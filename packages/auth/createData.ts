import { genSaltSync, hashSync } from 'bcrypt';
import { faker } from '@faker-js/faker';
import fs from 'fs/promises';

const PASSWORD = '123code';
const SALT = genSaltSync(10);

const createUser = (options: { name: string; image: string }) => {
  const { name, image } = options;
  const email = `${name.toLowerCase().split(' ').join('.')}@test.com`;
  const profileImage = `http://localhost:3000/static/${image}`;

  return {
    id: faker.datatype.uuid(),
    name,
    email,
    profileImage,
    password: hashSync(PASSWORD, SALT),
  };
};

const createUsers = async () => {
  const users = [
    { name: 'Gandalf the Grey', image: 'gandalf.png' },
    { name: 'Frodo Baggins', image: 'frodo.png' },
    { name: 'Gollum', image: 'gollum.png' },
  ];

  const data = users.map(createUser);

  await fs.writeFile('auth.json', JSON.stringify(data, null, 2), 'utf8');
};

createUsers();
