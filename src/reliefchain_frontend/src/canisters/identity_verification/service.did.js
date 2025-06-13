export const idlFactory = ({ IDL }) => {
  const UserProfilePublic = IDL.Record({
    'id' : IDL.Nat,
    'verified' : IDL.Bool,
    'name' : IDL.Text,
    'role' : IDL.Text,
    'details' : IDL.Text,
  });
  return IDL.Service({
    'getProfiles' : IDL.Func([], [IDL.Vec(UserProfilePublic)], ['query']),
    'registerUser' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [IDL.Text], []),
    'verifyUser' : IDL.Func([IDL.Nat], [IDL.Text], []),
  });
};
export const init = ({ IDL }) => { return []; };
