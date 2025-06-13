import Array "mo:base/Array";
import Iter "mo:base/Iter";

actor IdentityVerification {
  // Internal record type with a mutable field.
  type UserProfile = {
    id: Nat;
    name: Text;
    role: Text;      // e.g., "organization", "volunteer", "victim"
    var verified: Bool;
    details: Text;   // Additional info or documentation links
  };

  // Public, shareable type without mutable fields.
  type UserProfilePublic = {
    id: Nat;
    name: Text;
    role: Text;
    verified: Bool;
    details: Text;
  };

  var profiles: [UserProfile] = [];
  var nextUserId: Nat = 0;

  // Register a new user.
  public shared(_msg) func registerUser(name: Text, role: Text, details: Text) : async Text {
    let profile: UserProfile = {
      id = nextUserId;
      name = name;
      role = role;
      var verified = false;
      details = details;
    };
    profiles := Array.append<UserProfile>(profiles, [profile]);
    nextUserId += 1;
    return "User registered successfully. Awaiting verification.";
  };

  // Verify a user (admin function).
  public shared(_msg) func verifyUser(userId: Nat) : async Text {
    let size = Array.size(profiles);
    var found = false;
    for (i in Iter.range(0, size - 1)) {
      if (profiles[i].id == userId) {
        // Directly update the mutable field.
        profiles[i].verified := true;
        found := true;
      }
    };
    if (found) {
      return "User verified successfully.";
    } else {
      return "User not found.";
    }
  };

  // Conversion function from mutable UserProfile to immutable UserProfilePublic.
  func toPublic(profile: UserProfile) : UserProfilePublic {
    return {
      id = profile.id;
      name = profile.name;
      role = profile.role;
      verified = profile.verified;
      details = profile.details;
    };
  };

  // Query function returns shareable type.
  public query func getProfiles() : async [UserProfilePublic] {
    return Array.map<UserProfile, UserProfilePublic>(profiles, toPublic);
  };
};
