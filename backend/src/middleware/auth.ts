import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../db/db";

const isAuth = async (req: any, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(404).json({
        message: "Forbidden resource",
      });
      return;
    }
    const decode = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    if (!decode || !decode.userId) {
      res.status(404).json({
        message: "Forbidden resource",
      });
      return;
    }
    const user = await prisma.user.findUnique({
      where: {
        id: decode.userId,
      },
    });
    if (!user) {
      res.status(404).json({ message: "Invalid Credentials" });
      return;
    }
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      uuid: user.uuid,
    };
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal server error");
  }
};

export { isAuth };
