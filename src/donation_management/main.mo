import Array "mo:base/Array";
import Time "mo:base/Time";

actor DonationManagement {
  // Record type for a donation
  type Donation = {
    donor: Text;
    amount: Nat;
    timestamp: Time.Time;
  };

  var donations: [Donation] = [];

  public shared(_msg) func donate(donor: Text, amount: Nat) : async Text {
    let donation: Donation = {
      donor = donor;
      amount = amount;
      timestamp = Time.now();
    };
    donations := Array.append<Donation>(donations, [donation]);
    return "Donation received successfully.";
  };

  public query func getDonations() : async [Donation] {
    return donations;
  };
};
