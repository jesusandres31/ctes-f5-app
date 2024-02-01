interface UserRecord {
  avatar: string;
  collectionId: string;
  collectionName: string;
  created: string;
  email: string;
  emailVisibility: boolean;
  id: string;
  name: string;
  updated: string;
  username: string;
  verified: boolean;
}

export interface SignUpRes {
  record: UserRecord;
  token: string;
}

export interface SignInReq {
  email: string;
  password: string;
}

export interface Token {
  exp: number;
  sub: string;
}
