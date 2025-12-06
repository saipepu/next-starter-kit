export enum AuthMethods {
  Google = "google",
  Credentials = "credentials",
}

export type SignInRequestDto = {
  method: AuthMethods.Google;
  email?: string;
  providerToken: string
} | {
  method: AuthMethods.Credentials;
  email: string;
  password: string;
}

export type SignInResponseDto = {
  success: boolean;
  message: {
    access_token: string;
    refresh_token: string;
    access_token_expires_in: number;
    otp_expiry?: number;
    email?: string;
    is_verified?: boolean;
    is_first_time_user?: boolean;
    otp?: string;
  };
}

export type RenewAccessTokenRequest = {
  refresh_token: string;
}

export type RenewAccessTokenResponse = {
  success: boolean;
}