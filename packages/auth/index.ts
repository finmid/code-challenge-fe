import express from 'express';
import cors from 'cors';
import { compareSync } from 'bcrypt';
import jwt from 'jsonwebtoken';
import users from './auth.json';

const PORT = 3000;

// Our super secret key we are going to use to sign the JWT token
const SECRET_KEY = 'gandalf';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/static', express.static('./static'));

app.get('/', function (req, res) {
  res.send('Hello World');
});

app.post('/login', function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const INCORRECT_LOGIN = { message: 'Incorrect login or password' };

  const user = users.find((user) => user.email === email);

  if (!user) {
    res.status(403).json(INCORRECT_LOGIN);
  } else if (!compareSync(password, user.password)) {
    res.status(403).json(INCORRECT_LOGIN);
  } else {
    const { password, ...userData } = user;
    const token = jwt.sign({ userData }, SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({ token });
  }
});

console.log(`Listening on port ${PORT}`);
app.listen(PORT);
