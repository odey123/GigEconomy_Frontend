export interface RiderJwtPayload {
  id: string;
  email: string;
  riderType: "standard" | "premium";
  tokenType: "rider";
  iat?: number;
  exp?: number;
}
