export const idlFactory = ({ IDL }) => {
  const Location = IDL.Record({ 'lat' : IDL.Text, 'long' : IDL.Text });
  const NeedPublic = IDL.Record({
    'id' : IDL.Nat,
    'urgency' : IDL.Nat,
    'fulfilled' : IDL.Bool,
    'description' : IDL.Text,
    'location' : Location,
  });
  const Resource = IDL.Record({
    'id' : IDL.Nat,
    'description' : IDL.Text,
    'quantity' : IDL.Nat,
    'location' : Location,
  });
  return IDL.Service({
    'addNeed' : IDL.Func([IDL.Text, Location, IDL.Nat], [IDL.Text], []),
    'addResource' : IDL.Func([IDL.Text, Location, IDL.Nat], [IDL.Text], []),
    'allocateResources' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Nat, IDL.Nat))],
        [],
      ),
    'getNeeds' : IDL.Func([], [IDL.Vec(NeedPublic)], ['query']),
    'getResources' : IDL.Func([], [IDL.Vec(Resource)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
