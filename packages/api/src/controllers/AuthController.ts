import { Request, Response, NextFunction } from 'express';
import { compareSync } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { unauthorized } from '@hapi/boom';
import { SECRET_KEY, TOKEN_TTL } from 'src/constants';
import crewMembers from 'src/data/crew-members.json';

const login = async (req: Request, res: Response, next: NextFunction) => {
  const email = req.body.email;
  const password = req.body.password;
  const INCORRECT_LOGIN = 'Incorrect login or password';

  const member = crewMembers.find((member) => member.email === email);

  try {
    if (!member) {
      throw unauthorized(INCORRECT_LOGIN);
    } else if (!compareSync(password, member.password)) {
      throw unauthorized(INCORRECT_LOGIN);
    } else {
      const { password, ...userData } = member;
      const token = jwt.sign({ userData }, SECRET_KEY, {
        expiresIn: TOKEN_TTL,
      });

      res.status(200).json({ token });
    }
  } catch (error) {
    next(error);
  }
};

export const AuthController = {
  login,
};
