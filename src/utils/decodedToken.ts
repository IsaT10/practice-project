import jwt, { JwtPayload } from 'jsonwebtoken';

export const decodedToken = (token: string, secretToken: string) => {
  return jwt.verify(token, secretToken) as JwtPayload;
};
