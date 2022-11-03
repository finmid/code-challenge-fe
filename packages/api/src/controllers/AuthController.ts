import { Request, Response } from "express";
import { compareSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "src/constants";
import users from "src/data/users.json";

const login = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  const INCORRECT_LOGIN = "Incorrect login or password";

  const user = users.find((user) => user.email === email);

  if (!user) {
    res.status(401).json({ error: "Unauthorized", message: INCORRECT_LOGIN });
  } else if (!compareSync(password, user.password)) {
    res.status(401).json({ error: "Unauthorized", message: INCORRECT_LOGIN });
  } else {
    const { password, ...userData } = user;
    const token = jwt.sign({ userData }, SECRET_KEY, { expiresIn: "1y" });

    res.status(200).json({ token });
  }
};

export const AuthController = {
  login,
};
