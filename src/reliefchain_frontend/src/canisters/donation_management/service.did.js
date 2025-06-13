export const idlFactory = ({ IDL }) => {
  const Time = IDL.Int;
  const Donation = IDL.Record({
    'timestamp' : Time,
    'amount' : IDL.Nat,
    'donor' : IDL.Text,
  });
  return IDL.Service({
    'donate' : IDL.Func([IDL.Text, IDL.Nat], [IDL.Text], []),
    'getDonations' : IDL.Func([], [IDL.Vec(Donation)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
