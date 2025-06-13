import Array "mo:base/Array";
import Iter "mo:base/Iter";

actor ResourceAllocation {

  // Define a location type using Text.
  type Location = {
    lat: Text;
    long: Text;
  };

  type Need = {
    id: Nat;
    description: Text;
    location: Location;
    urgency: Nat;
    var fulfilled: Bool;
  };

  type NeedPublic = {
    id: Nat;
    description: Text;
    location: Location;
    urgency: Nat;
    fulfilled: Bool;
  };

  var needs: [Need] = [];
  var nextNeedId: Nat = 0;

  type Resource = {
    id: Nat;
    description: Text;
    location: Location;
    quantity: Nat;
  };

  var resources: [Resource] = [];
  var nextResourceId: Nat = 0;

  public shared(_msg) func addNeed(description: Text, location: Location, urgency: Nat) : async Text {
    let need: Need = {
      id = nextNeedId;
      description = description;
      location = location;
      urgency = urgency;
      var fulfilled = false;
    };
    needs := Array.append(needs, [need]);
    nextNeedId += 1;
    return "Need added successfully.";
  };

  public shared(_msg) func addResource(description: Text, location: Location, quantity: Nat) : async Text {
    let resource: Resource = {
      id = nextResourceId;
      description = description;
      location = location;
      quantity = quantity;
    };
    resources := Array.append(resources, [resource]);
    nextResourceId += 1;
    return "Resource added successfully.";
  };

  // Helper function: drop the first element from an array.
  func drop<T>(arr: [T]) : [T] {
    if (arr.size() == 0) return [];
    Array.tabulate<T>(
      arr.size() - 1,
      func(i) { arr[i + 1] }
    )
  };

  public shared(_msg) func allocateResources() : async [(Nat, Nat)] {
    var allocations: [(Nat, Nat)] = [];
    let n: Nat = Array.size(needs);
    var m: Nat = Array.size(resources);
    
    if (n > 0 and m > 0) {
      // Iterate over valid indices (0 to n - 1)
      for (i in Iter.range(0, n - 1)) {
        if (not needs[i].fulfilled and m > 0) {
          let resource = resources[0];
          allocations := Array.append(allocations, [(needs[i].id, resource.id)]);
          needs[i].fulfilled := true;
          resources := drop(resources);
          m := Array.size(resources);
        }
      };
    };
    return allocations;
  };

  func convertNeed(need: Need) : NeedPublic {
    return {
      id = need.id;
      description = need.description;
      location = need.location;
      urgency = need.urgency;
      fulfilled = need.fulfilled;
    };
  };

  public query func getNeeds() : async [NeedPublic] {
    return Array.map<Need, NeedPublic>(needs, convertNeed);
  };

  public query func getResources() : async [Resource] {
    return resources;
  };
};
