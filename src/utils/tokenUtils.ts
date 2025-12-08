import jwt from "jsonwebtoken";

export const updateTokenExpiry = (oldToken: string, id: number) => {
  const decodedToken = jwt.decode(oldToken) as jwt.JwtPayload;

  const newExpiration = Math.floor(Date.now() / 1000) + 31536000;

  const newPayload: any = {
    ...decodedToken,
    exp: newExpiration,
    user_metadata: {
      ...decodedToken.user_metadata,
      id: id,
    },
  };

  return jwt.sign(newPayload, process.env.JWT_SECRET!);
};
