export interface SignUpRes {
  accessToken: string;
  refreshToken: string;
}

export type RefreshTokenRes = SignUpRes;

export interface SignInReq {
  email: string;
  password: string;
  remember: boolean;
}

export interface Token {
  exp: number;
  sub: string;
}
