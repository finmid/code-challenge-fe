import path from 'path';
import fs from 'fs/promises';
import { genSaltSync, hashSync } from 'bcrypt';
import { faker } from '@faker-js/faker';
import {
  Transaction,
  TransactionStatus,
  RejectionReason,
} from '@finmid/lib-common/types';
import { PORT } from './constants';

const PASSWORD = '123code';
const SALT = genSaltSync(10);
const BASE_URL = `http://localhost:${PORT}`;

const getPath = (file: string) => path.join(__dirname, 'data', file);

const smes = [
  {
    id: '6fa0ea41-9249-43d5-8479-81af6a55b946',
    legalName: 'Fellowship GmbH',
    businessType: 'GMBH',
  },
  {
    id: '58c0645c-ce36-4395-9658-9a654cd3f3f9',
    legalName: 'Gollum Enterprises',
    businessType: 'EINZELUNTERNEHMEN',
  },
];

const smeIds = [
  '6fa0ea41-9249-43d5-8479-81af6a55b946',
  '58c0645c-ce36-4395-9658-9a654cd3f3f9',
];

const userIds = {
  '6fa0ea41-9249-43d5-8479-81af6a55b946': [
    'b3f271ef-e73b-4c12-ad85-665c3686017a',
    'f757b26e-444b-45d0-b5a7-e8944a36d70a',
  ],
  '58c0645c-ce36-4395-9658-9a654cd3f3f9': [
    '5fb473af-2413-43ee-b899-7a4835ee607f',
  ],
};

const users = [
  {
    id: 'b3f271ef-e73b-4c12-ad85-665c3686017a',
    smeId: '6fa0ea41-9249-43d5-8479-81af6a55b946',
    name: 'Gandalf the Grey',
    image: 'gandalf.png',
  },
  {
    id: 'f757b26e-444b-45d0-b5a7-e8944a36d70a',
    smeId: '6fa0ea41-9249-43d5-8479-81af6a55b946',
    name: 'Frodo Baggins',
    image: 'frodo.png',
  },
  {
    id: '5fb473af-2413-43ee-b899-7a4835ee607f',
    smeId: '58c0645c-ce36-4395-9658-9a654cd3f3f9',
    name: 'Gollum',
    image: 'gollum.png',
  },
];

const merchants = [
  { image: 'mi-aws.png', name: 'Amazon Web Services' },
  { image: 'mi-figma.png', name: 'Figma' },
  { image: 'mi-github.png', name: 'Github' },
  { image: 'mi-lieferando.png', name: 'Lieferando' },
  { image: 'mi-linkedin.png', name: 'LinkedIn' },
  { image: 'mi-sharenow.png', name: 'Share Now' },
  { image: 'mi-slack.png', name: 'Slack' },
  { image: 'mi-uber.png', name: 'Uber' },
  { image: 'mi-wework.png', name: 'WeWork' },
  { image: 'mi-zendesk.png', name: 'ZenDesk' },
];

/**
 * Returns a single user, with encrypted password and the profile images
 * pointing to the correct url
 *
 * @param options
 * @returns
 */
const createUser = (options: {
  id: string;
  smeId: string;
  name: string;
  image: string;
}) => {
  const { name, image, id, smeId } = options;
  const email = `${name.toLowerCase().split(' ').join('.')}@test.com`;
  const profileImage = `${BASE_URL}/static/${image}`;

  return {
    id,
    smeId,
    name,
    email,
    profileImage,
    password: hashSync(PASSWORD, SALT),
  };
};

/**
 * Iterates through the predetermined users, calls `createUser` on them,
 * and saves the result to `./data/users.json`
 */
const createUsers = async () => {
  const data = users.map(createUser);
  const filePath = getPath('users.json');

  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(
    `✨ Created Users:\x1b[90m packages/api/src/data/\x1b[0musers.json`
  );
  console.log('   Users and passwords:');
  data
    .map(
      (user) => `     \x1b[32m ${user.email} \x1b[90m/\x1b[32m 123code\x1b[0m`
    )
    .forEach((userText) => console.log(userText));
};

/**
 * Saves the SME data to `./data/smes.json`
 */
const createSmeData = async () => {
  const filePath = getPath('smes.json');
  await fs.writeFile(
    getPath('smes.json'),
    JSON.stringify(smes, null, 2),
    'utf-8'
  );
  console.log(
    `✨ Created SMEs:\x1b[90m packages/api/src/data/\x1b[0msmes.json`
  );
};

/**
 * Creates a transaction using faker.
 *
 * @returns
 */
const createTransaction = (): Transaction => {
  const smeId = faker.helpers.arrayElement(smeIds);
  const userId = faker.helpers.arrayElement(
    userIds[smeId as keyof typeof userIds]
  );
  const merchant = faker.helpers.arrayElement(merchants);
  const status: TransactionStatus = faker.helpers.arrayElement([
    'REJECTED',
    'PENDING',
    'COMPLETED',
    'REVERSED',
  ]);

  const rejectionReason: RejectionReason | null =
    status === 'REJECTED'
      ? faker.helpers.arrayElement([
          'NOT_PERMITTED',
          'INSUFFICIENT_FUNDS',
          'CARD_MONTHLY_LIMIT_REACHED',
          'CARD_DAILY_LIMIT_REACHED',
          'CARD_EXPIRED',
          'CARD_SUSPENDED',
          'CARD_NOT_ACTIVE',
          'INCORRECT_PIN',
        ])
      : null;

  return {
    id: faker.datatype.uuid(),
    userId,
    smeId,
    transactionTime: faker.date.recent(180).toISOString(),
    merchantIconUrl: `${BASE_URL}/static/${merchant.image}`,
    merchantName: merchant.name,
    amount: faker.finance.amount(-800, -10),
    currency: faker.helpers.arrayElement(['EUR', 'USD']),
    status,
    rejectionReason,
  };
};

/**
 * Creates a number of transactions and saves them to `./data/transactions.json`
 */
const createTransactions = async () => {
  const NUMBER_OF_TRANSACTIONS = 100;
  const transactions = [];

  for (let index = 0; index < NUMBER_OF_TRANSACTIONS; index++) {
    transactions.push(createTransaction());
  }

  const sortedTransactions = transactions.sort((a, b) =>
    a.transactionTime < b.transactionTime ? 1 : -1
  );
  const payload = JSON.stringify(sortedTransactions, null, 2);

  const filePath = getPath('transactions.json');
  await fs.writeFile(filePath, payload, 'utf-8');
  console.log(
    `✨ Created Transactions:\x1b[90m packages/api/src/data/\x1b[0mtransactions.json`
  );
};

/**
 * Calls the functions that persist data to json.
 */
const createData = async () => {
  await createUsers();
  await createSmeData();
  await createTransactions();
};

createData();
