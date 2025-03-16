import { prisma } from "../db/db";
import { Response } from "express";
import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { admin } from "../utils/GoogleApp";

interface UserType {
  id: number,
  email: string,
  uuid: string,
  token?: string,
}
function generateRandomWord() {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  let word = "";
  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * letters.length);
    word += letters[randomIndex];
  }
  return word;
}

async function googleSignUpSignIn(googleToken: string) {
  try {
    const decodedToken = await admin.auth().verifyIdToken(googleToken);
    const { email, name } = decodedToken;
    let userData: UserType
    const user = await prisma.user.findUnique({
      where: {
        email: email,
        googleLogin: true
      }
    })
    if (user) {
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET as string
      );

      userData = {
        id: user.id,
        email: user.email,
        uuid: user.uuid,
        token: token,
      }
    } else {
      const password = generateRandomWord();
      const hash = await argon2.hash(password);
      const user = await prisma.user.create({
        data: {
          email: email as string,
          name: name,
          uuid: uuidv4(),
          password: hash,
          googleLogin: true,
        },
      });
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET as string
      );
      userData = {
        id: user.id,
        email: user.email,
        uuid: user.uuid,
        token: token,
      }
    }
    return userData
  } catch (err) {

  }
}
const SignUpController = async (req: any, res: Response): Promise<any> => {
  try {
    const { email, password, name, googleToken, googleLogin } = req.body;
    console.log(googleToken);

    let userData: UserType
    if (googleLogin) {
      userData = await googleLogin(googleToken) as UserType
    }
    else if (!email || !password || !name) {
      res.status(400).json({ message: "Empty fields" });
      return;
    } else {
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      if (user) {
        res.status(409).json({ message: "User already exists" });
        return;
      }
      const hash = await argon2.hash(password);
      userData = await prisma.user.create({
        data: {
          email: email,
          name: name,
          uuid: uuidv4(),
          password: hash,
          googleLogin: false,
        },
      });
      userData.token = jwt.sign(
        { userId: userData.id },
        process.env.JWT_SECRET as string
      );
    }

    res.cookie("token", userData.token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.status(200).json({
      message: "User created successfully",
      id: userData.id,
      email: userData.email,
      secretKey: userData.uuid,
      token: userData.token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "internal server error" });
  }
};

const SignInController = async (req: any, res: Response): Promise<any> => {
  try {
    const { email, password, googleLogin, googleToken } = req.body;

    let userData: UserType
    if (googleLogin) {
      userData = await googleSignUpSignIn(googleToken) as UserType
    } else if (!googleLogin && (!email || !password)) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    } else {
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      if (!user) {
        res.status(404).json({ message: "Invalid Credentials" });
        return;
      }
      const isPasswordValid = await argon2.verify(user.password, password);

      if (isPasswordValid) {
        userData = user
        userData.token = jwt.sign(
          { userId: user.id },
          process.env.JWT_SECRET as string
        )
      } else {
        res.status(404).json({ message: "Invalid Credentials" });
        return;
      }
    }
    res.cookie("token", userData.token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.status(200).json({
      message: "User Logged In successfully",
      id: userData.id,
      email: userData.email,
      secretKey: userData.uuid,
      token: userData.token,
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "internal server error" });
    return;
  }
};

const isAuthenticated = (req: any, res: Response) => {
  try {
    const { user } = req;
    res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "internal server error" });
    return;
  }
};

const logout = (req: any, res: Response) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "internal server error" });
    return;
  }
};

export { SignUpController, SignInController, isAuthenticated, logout };
