import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const enviroment = process.env.NODE_ENV;
  const secretKey = process.env.SECRET_KEY;
  const token = jwt.sign({ userId }, secretKey, {
    expiresIn: "7d",
  });
  res.cookie("JWT_Token", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: enviroment !== "development",
  });
  return token;
};
