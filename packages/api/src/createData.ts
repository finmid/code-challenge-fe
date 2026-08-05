import path from 'path';
import fs from 'fs/promises';
import { genSaltSync, hashSync } from 'bcrypt';
import { faker } from '@faker-js/faker';
import {
  Crew,
  CrewMember,
  Cut,
  Expense,
  Job,
  JobStatus,
  TakingsEntry,
} from '@finmid/lib-common/types';
import { PORT } from './constants';

const PASSWORD = '123code';
const SALT = genSaltSync(10);
const BASE_URL = `http://localhost:${PORT}`;

faker.seed(4471);

const getPath = (file: string) => path.join(__dirname, 'data', file);

const CREW_A = '6fa0ea41-9249-43d5-8479-81af6a55b946';
const CREW_B = '58c0645c-ce36-4395-9658-9a654cd3f3f9';

const GANDALF = 'b3f271ef-e73b-4c12-ad85-665c3686017a';
const FRODO = 'f757b26e-444b-45d0-b5a7-e8944a36d70a';
const GOLLUM = '5fb473af-2413-43ee-b899-7a4835ee607f';
const FERNY = 'c1a6e2d8-7b53-4a1e-9f42-0d5b7e3c8a19';

const crews: Crew[] = [
  {
    id: CREW_A,
    legalName: 'Fellowship Logistics GmbH',
    frontBusiness: 'REMOVALS',
  },
  {
    id: CREW_B,
    legalName: 'Sharkey & Sons Salvage',
    frontBusiness: 'SCRAP_METAL',
  },
];

const crewMembers = [
  {
    id: GANDALF,
    crewId: CREW_A,
    name: 'Gandalf the Grey',
    alias: 'The Grey',
    role: 'PLANNER',
    standing: 'ACTIVE',
    image: 'gandalf.png',
  },
  {
    id: FRODO,
    crewId: CREW_A,
    name: 'Frodo Baggins',
    alias: 'Underhill',
    role: 'INSIDE',
    standing: 'ACTIVE',
    image: 'frodo.png',
  },
  {
    id: GOLLUM,
    crewId: CREW_A,
    name: 'Gollum',
    alias: 'Smeagol',
    role: 'WHEELS',
    standing: 'IN_CUSTODY',
    image: 'gollum.png',
  },
  {
    id: FERNY,
    crewId: CREW_B,
    name: 'Bill Ferny',
    alias: 'Ferny',
    role: 'PLANNER',
    standing: 'ACTIVE',
    image: 'gollum.png',
  },
] as const;

const crewIds = [CREW_A, CREW_B];

const memberIds: Record<string, string[]> = {
  [CREW_A]: [GANDALF, FRODO, GOLLUM],
  [CREW_B]: [FERNY],
};

const targets = [
  { image: 'mi-aws.png', name: 'AWS Frankfurt DC', city: 'Frankfurt' },
  { image: 'mi-figma.png', name: 'Figma Studio Loft', city: 'Berlin' },
  { image: 'mi-github.png', name: 'Github Office Safe', city: 'Amsterdam' },
  { image: 'mi-lieferando.png', name: 'Lieferando Depot', city: 'Cologne' },
  { image: 'mi-linkedin.png', name: 'LinkedIn Reception', city: 'Munich' },
  { image: 'mi-sharenow.png', name: 'Share Now Motor Pool', city: 'Hamburg' },
  { image: 'mi-slack.png', name: 'Slack Summit Hotel', city: 'Vienna' },
  { image: 'mi-uber.png', name: 'Uber Cash Office', city: 'Prague' },
  { image: 'mi-wework.png', name: 'WeWork Vault Room', city: 'Berlin' },
  { image: 'mi-zendesk.png', name: 'Zendesk Payroll Run', city: 'Rotterdam' },
];

const iconUrl = (image: string) => `${BASE_URL}/static/${image}`;

const targetByImage = (image: string) => {
  const target = targets.find((candidate) => candidate.image === image);

  if (!target) throw new Error(`Unknown target image: ${image}`);

  return target;
};

/** Days from now, negative is the past. */
const at = (days: number, hour = 23) => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  date.setUTCHours(hour, 17, 4, 0);

  return date.toISOString();
};

const createCrewMember = (options: typeof crewMembers[number]): CrewMember => {
  const { id, crewId, name, alias, role, standing, image } = options;
  const email = `${name.toLowerCase().split(' ').join('.')}@test.com`;

  return {
    id,
    crewId,
    name,
    alias,
    role,
    standing,
    email,
    profileImage: `${BASE_URL}/static/${image}`,
  };
};

const createCrewMembers = async () => {
  const data = crewMembers
    .map(createCrewMember)
    .map((member) => ({ ...member, password: hashSync(PASSWORD, SALT) }));
  const filePath = getPath('crew-members.json');

  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(
    `✨ Created Crew Members:\x1b[90m packages/api/src/data/\x1b[0mcrew-members.json`
  );
  console.log('   Logins and passwords:');
  data
    .map(
      (member) =>
        `     \x1b[32m ${member.email} \x1b[90m/\x1b[32m 123code\x1b[0m`
    )
    .forEach((line) => console.log(line));
};

const createCrews = async () => {
  const filePath = getPath('crews.json');

  await fs.writeFile(filePath, JSON.stringify(crews, null, 2), 'utf-8');
  console.log(`✨ Created Crews:\x1b[90m packages/api/src/data/\x1b[0mcrews.json`);
};

// ---------------------------------------------------------------------------
// Takings builders
// ---------------------------------------------------------------------------

const cash = (amount: string, currency: 'EUR' | 'USD'): TakingsEntry => ({
  id: faker.datatype.uuid(),
  assetType: 'CASH',
  amount,
  currency,
});

const gold = (options: {
  grams: string;
  purity: string;
  spotPricePerGram: string;
  spotPriceCurrency: 'EUR' | 'USD';
  spotPriceAt: string;
}): TakingsEntry => ({
  id: faker.datatype.uuid(),
  assetType: 'GOLD',
  ...options,
});

const bearerBond = (options: {
  faceValue: string;
  currency: 'EUR' | 'USD';
  quotedAt: string;
}): TakingsEntry => ({
  id: faker.datatype.uuid(),
  assetType: 'BEARER_BOND',
  serial: `BB-${faker.datatype.number({ min: 1000, max: 9999 })}-${faker.random
    .alpha(1)
    .toUpperCase()}`,
  faceValue: options.faceValue,
  faceValueCurrency: options.currency,
  // What the fence offers. He has never moved off 40% of face.
  buyerQuote: (Number(options.faceValue) * 0.4).toFixed(2),
  buyerQuoteCurrency: options.currency,
  quotedAt: options.quotedAt,
});

const crypto = (options: {
  symbol: 'BTC' | 'ETH' | 'XMR';
  units: string;
  quotedRate: string | null;
  quoteCurrency: 'EUR' | 'USD' | null;
  quotedAt: string | null;
}): TakingsEntry => ({
  id: faker.datatype.uuid(),
  assetType: 'CRYPTO',
  ...options,
});

const goods = (options: {
  description: string;
  appraisal: string;
  appraisalCurrency: 'EUR' | 'USD';
  appraisedBy: string;
}): TakingsEntry => ({
  id: faker.datatype.uuid(),
  assetType: 'GOODS',
  ...options,
});

const expense = (
  label: string,
  amount: string,
  currency: 'EUR' | 'USD',
  frontedBy: string | null = null
): Expense => ({
  id: faker.datatype.uuid(),
  label,
  amount,
  currency,
  frontedBy,
});

const percentCut = (
  crewMemberId: string,
  percent: string,
  note: string | null = null
): Cut => ({
  crewMemberId,
  kind: 'PERCENT',
  percent,
  amount: null,
  currency: null,
  note,
});

const flatCut = (
  crewMemberId: string,
  amount: string,
  currency: 'EUR' | 'USD',
  note: string | null = null
): Cut => ({
  crewMemberId,
  kind: 'FLAT',
  percent: null,
  amount,
  currency,
  note,
});

// ---------------------------------------------------------------------------
// Hand-written jobs, so the interesting shapes are always in the data
// ---------------------------------------------------------------------------

const handWrittenJobs = (): Job[] => [
  {
    id: 'a4f1c2d0-9b3e-4c7a-8f21-0d5b7e3c8a01',
    crewId: CREW_A,
    plannerId: GANDALF,
    codename: 'SILVERWARE',
    targetName: targetByImage('mi-wework.png').name,
    targetIconUrl: iconUrl('mi-wework.png'),
    city: targetByImage('mi-wework.png').city,
    status: 'SCORED',
    jobTime: at(-4),
    takings: [
      cash('12450.00', 'EUR'),
      cash('8300.00', 'USD'),
      gold({
        grams: '1840.500',
        purity: '0.999',
        spotPricePerGram: '71.42',
        spotPriceCurrency: 'EUR',
        spotPriceAt: at(-4, 21),
      }),
    ],
    expenses: [
      expense('Transit van, three days', '1250.00', 'EUR'),
      expense('Welder, cash up front', '900.00', 'EUR', GANDALF),
    ],
    cuts: [
      percentCut(GANDALF, '40'),
      percentCut(FRODO, '25'),
      percentCut(GOLLUM, '20', 'agreed before he was picked up'),
    ],
    expensePolicy: 'OFF_THE_TOP',
    fenceFeePercent: '12.5',
    failureNote: null,
  },
  {
    id: 'a4f1c2d0-9b3e-4c7a-8f21-0d5b7e3c8a02',
    crewId: CREW_A,
    plannerId: FRODO,
    codename: 'PAPERWEIGHT',
    targetName: targetByImage('mi-zendesk.png').name,
    targetIconUrl: iconUrl('mi-zendesk.png'),
    city: targetByImage('mi-zendesk.png').city,
    status: 'SCORED',
    jobTime: at(-9),
    takings: [
      bearerBond({
        faceValue: '250000.00',
        currency: 'EUR',
        quotedAt: at(-8, 11),
      }),
      goods({
        description: '14x wristwatch, assorted',
        appraisal: '38000.00',
        appraisalCurrency: 'EUR',
        appraisedBy: 'Barliman, insured value, not an offer',
      }),
    ],
    expenses: [expense('The guy on the inside', '5000.00', 'USD')],
    cuts: [
      percentCut(GANDALF, '33.34'),
      percentCut(FRODO, '33.33'),
      percentCut(GOLLUM, '33.33'),
    ],
    expensePolicy: null,
    fenceFeePercent: '12.5',
    failureNote: null,
  },
  {
    id: 'a4f1c2d0-9b3e-4c7a-8f21-0d5b7e3c8a03',
    crewId: CREW_A,
    plannerId: GANDALF,
    codename: 'NIGHTCAP',
    targetName: targetByImage('mi-uber.png').name,
    targetIconUrl: iconUrl('mi-uber.png'),
    city: targetByImage('mi-uber.png').city,
    status: 'BURNED',
    jobTime: at(-12),
    takings: [],
    expenses: [
      expense('Transit van, three days', '1250.00', 'EUR'),
      expense('Welder', '2200.00', 'EUR', FRODO),
    ],
    cuts: [
      percentCut(GANDALF, '45'),
      flatCut(FRODO, '500.00', 'EUR', 'paid whatever happens, he insisted'),
      percentCut(GOLLUM, '30'),
    ],
    expensePolicy: 'PAID_BY_FRONTER',
    fenceFeePercent: '12.5',
    failureNote: 'Silent alarm on the second door. Nothing came out.',
  },
  {
    id: 'a4f1c2d0-9b3e-4c7a-8f21-0d5b7e3c8a04',
    crewId: CREW_A,
    plannerId: GOLLUM,
    codename: 'GLASSHOUSE',
    targetName: targetByImage('mi-aws.png').name,
    targetIconUrl: iconUrl('mi-aws.png'),
    city: targetByImage('mi-aws.png').city,
    status: 'SEIZED',
    jobTime: at(-17),
    takings: [
      cash('41000.00', 'EUR'),
      crypto({
        symbol: 'BTC',
        units: '0.84210000',
        quotedRate: '58210.00',
        quoteCurrency: 'EUR',
        quotedAt: at(-63, 8),
      }),
    ],
    expenses: [expense('Two burner phones', '180.00', 'EUR', GANDALF)],
    cuts: [
      percentCut(GANDALF, '35'),
      percentCut(FRODO, '30'),
      percentCut(GOLLUM, '22.5'),
    ],
    expensePolicy: 'OFF_THE_TOP',
    fenceFeePercent: '12.5',
    failureNote: 'Taken off him at the S-Bahn. Bags logged as evidence.',
  },
  {
    id: 'a4f1c2d0-9b3e-4c7a-8f21-0d5b7e3c8a05',
    crewId: CREW_A,
    plannerId: GANDALF,
    codename: 'HALFPENNY',
    targetName: targetByImage('mi-lieferando.png').name,
    targetIconUrl: iconUrl('mi-lieferando.png'),
    city: targetByImage('mi-lieferando.png').city,
    status: 'SCORED',
    jobTime: at(-2),
    takings: [cash('1000.01', 'EUR')],
    expenses: [],
    cuts: [
      percentCut(GANDALF, '33.33'),
      percentCut(FRODO, '33.33'),
      percentCut(GOLLUM, '33.33'),
    ],
    expensePolicy: 'OFF_THE_TOP',
    fenceFeePercent: '0',
    failureNote: null,
  },
  {
    id: 'a4f1c2d0-9b3e-4c7a-8f21-0d5b7e3c8a06',
    crewId: CREW_A,
    plannerId: FRODO,
    codename: 'BRASSNECK',
    targetName: targetByImage('mi-sharenow.png').name,
    targetIconUrl: iconUrl('mi-sharenow.png'),
    city: targetByImage('mi-sharenow.png').city,
    status: 'SCORED',
    jobTime: at(-26),
    takings: [
      gold({
        grams: '62.400',
        purity: '0.916',
        spotPricePerGram: '68.05',
        spotPriceCurrency: 'USD',
        spotPriceAt: at(-26, 19),
      }),
      cash('1500.00', 'USD'),
    ],
    expenses: [expense('Flatbed and a tarp', '640.00', 'EUR', FRODO)],
    cuts: [
      percentCut(GANDALF, '45'),
      flatCut(FRODO, '2000.00', 'EUR'),
      percentCut(GOLLUM, '30'),
    ],
    expensePolicy: 'FROM_SHARES',
    fenceFeePercent: '15',
    failureNote: null,
  },
  {
    id: 'a4f1c2d0-9b3e-4c7a-8f21-0d5b7e3c8a07',
    crewId: CREW_A,
    plannerId: GANDALF,
    codename: 'CANDLESTICK',
    targetName: targetByImage('mi-github.png').name,
    targetIconUrl: iconUrl('mi-github.png'),
    city: targetByImage('mi-github.png').city,
    status: 'SCORED',
    jobTime: at(-38),
    takings: [
      crypto({
        symbol: 'XMR',
        units: '214.00000000',
        quotedRate: null,
        quoteCurrency: null,
        quotedAt: null,
      }),
      goods({
        description: 'One forklift, one pallet of laptops',
        appraisal: '11500.00',
        appraisalCurrency: 'EUR',
        appraisedBy: 'Sam, who sells forklifts',
      }),
    ],
    expenses: [expense('Storage unit, prepaid', '420.00', 'EUR', GANDALF)],
    cuts: [percentCut(GANDALF, '50'), percentCut(FRODO, '35')],
    expensePolicy: 'PAID_BY_FRONTER',
    fenceFeePercent: '12.5',
    failureNote: null,
  },
  {
    id: 'a4f1c2d0-9b3e-4c7a-8f21-0d5b7e3c8a08',
    crewId: CREW_A,
    plannerId: FRODO,
    codename: 'TEAPOT',
    targetName: targetByImage('mi-figma.png').name,
    targetIconUrl: iconUrl('mi-figma.png'),
    city: targetByImage('mi-figma.png').city,
    status: 'CASING',
    jobTime: at(11),
    takings: [],
    expenses: [expense('Drone rental, two nights', '340.00', 'EUR', FRODO)],
    cuts: [percentCut(GANDALF, '40'), percentCut(FRODO, '40')],
    expensePolicy: null,
    fenceFeePercent: '12.5',
    failureNote: null,
  },
  {
    id: 'a4f1c2d0-9b3e-4c7a-8f21-0d5b7e3c8a09',
    crewId: CREW_A,
    plannerId: GANDALF,
    codename: 'LONG WEEKEND',
    targetName: targetByImage('mi-slack.png').name,
    targetIconUrl: iconUrl('mi-slack.png'),
    city: targetByImage('mi-slack.png').city,
    status: 'RUNNING',
    jobTime: at(0, 2),
    takings: [],
    expenses: [expense('Two rooms, false names', '780.00', 'EUR')],
    cuts: [
      percentCut(GANDALF, '35'),
      percentCut(FRODO, '35'),
      percentCut(GOLLUM, '15', 'if he is out by then'),
    ],
    expensePolicy: 'OFF_THE_TOP',
    fenceFeePercent: '12.5',
    failureNote: null,
  },
];

// ---------------------------------------------------------------------------
// Filler jobs, so the feed has volume
// ---------------------------------------------------------------------------

const randomTakings = (status: JobStatus): TakingsEntry[] => {
  if (status === 'CASING' || status === 'RUNNING' || status === 'BURNED') {
    return [];
  }

  const count = faker.datatype.number({ min: 1, max: 3 });
  const entries: TakingsEntry[] = [];

  for (let index = 0; index < count; index++) {
    const assetType = faker.helpers.arrayElement([
      'CASH',
      'CASH',
      'GOLD',
      'BEARER_BOND',
      'CRYPTO',
      'GOODS',
    ] as const);
    const currency = faker.helpers.arrayElement(['EUR', 'USD'] as const);

    if (assetType === 'CASH') {
      entries.push(cash(faker.finance.amount(400, 90000, 2), currency));
    } else if (assetType === 'GOLD') {
      entries.push(
        gold({
          grams: faker.finance.amount(20, 4000, 3),
          purity: faker.helpers.arrayElement(['0.999', '0.916', '0.750']),
          spotPricePerGram: faker.finance.amount(64, 74, 2),
          spotPriceCurrency: currency,
          spotPriceAt: faker.date.recent(120).toISOString(),
        })
      );
    } else if (assetType === 'BEARER_BOND') {
      entries.push(
        bearerBond({
          faceValue: faker.finance.amount(20000, 500000, 2),
          currency,
          quotedAt: faker.date.recent(90).toISOString(),
        })
      );
    } else if (assetType === 'CRYPTO') {
      const quoted = faker.datatype.boolean();

      entries.push(
        crypto({
          symbol: faker.helpers.arrayElement(['BTC', 'ETH', 'XMR'] as const),
          units: faker.finance.amount(0.2, 40, 8),
          quotedRate: quoted ? faker.finance.amount(140, 62000, 2) : null,
          quoteCurrency: quoted ? currency : null,
          quotedAt: quoted ? faker.date.recent(90).toISOString() : null,
        })
      );
    } else {
      entries.push(
        goods({
          description: faker.helpers.arrayElement([
            'Three crates, unopened',
            'Copper cable, 400m',
            'One painting, no frame',
            'Catering equipment',
            'Pallet of phone handsets',
          ]),
          appraisal: faker.finance.amount(900, 60000, 2),
          appraisalCurrency: currency,
          appraisedBy: faker.helpers.arrayElement([
            'Barliman, insured value, not an offer',
            'Sam, who sells forklifts',
            'nobody, this is a guess',
          ]),
        })
      );
    }
  }

  return entries;
};

const randomExpenses = (crewId: string): Expense[] => {
  const count = faker.datatype.number({ min: 0, max: 3 });
  const members = memberIds[crewId];
  const expenses: Expense[] = [];

  for (let index = 0; index < count; index++) {
    expenses.push(
      expense(
        faker.helpers.arrayElement([
          'Transit van, three days',
          'Welder, cash up front',
          'The guy on the inside',
          'Burner phones',
          'Storage unit, prepaid',
          'Lock cylinders, replacements',
        ]),
        faker.finance.amount(120, 6000, 2),
        faker.helpers.arrayElement(['EUR', 'USD'] as const),
        faker.datatype.boolean() ? faker.helpers.arrayElement(members) : null
      )
    );
  }

  return expenses;
};

const randomCuts = (crewId: string): Cut[] =>
  memberIds[crewId].map((memberId) =>
    faker.datatype.number({ min: 1, max: 10 }) > 8
      ? flatCut(
          memberId,
          faker.finance.amount(400, 4000, 2),
          faker.helpers.arrayElement(['EUR', 'USD'] as const)
        )
      : percentCut(memberId, faker.finance.amount(12, 45, 2))
  );

const createJob = (): Job => {
  const crewId = faker.helpers.arrayElement(crewIds);
  const plannerId = faker.helpers.arrayElement(memberIds[crewId]);
  const target = faker.helpers.arrayElement(targets);
  const status = faker.helpers.arrayElement([
    'CASING',
    'RUNNING',
    'SCORED',
    'SCORED',
    'SCORED',
    'BURNED',
    'SEIZED',
  ] as const);

  return {
    id: faker.datatype.uuid(),
    crewId,
    plannerId,
    codename: faker.helpers
      .arrayElement([
        'coldstore',
        'brass hat',
        'dovetail',
        'ninepin',
        'quiet room',
        'sandpiper',
        'tallboy',
        'winterbourne',
        'lamplight',
        'oxbow',
        'kettledrum',
        'penny lane',
      ])
      .toUpperCase(),
    targetName: target.name,
    targetIconUrl: iconUrl(target.image),
    city: target.city,
    status,
    jobTime:
      status === 'CASING'
        ? faker.date.soon(30).toISOString()
        : faker.date.recent(180).toISOString(),
    takings: randomTakings(status),
    expenses: randomExpenses(crewId),
    cuts: randomCuts(crewId),
    expensePolicy: faker.helpers.arrayElement([
      'OFF_THE_TOP',
      'FROM_SHARES',
      'PAID_BY_FRONTER',
      null,
    ]),
    fenceFeePercent: faker.helpers.arrayElement(['10', '12.5', '15', '18']),
    failureNote:
      status === 'BURNED'
        ? 'Went wrong on the way in. Nothing came out.'
        : status === 'SEIZED'
        ? 'Police recovered it the same week.'
        : null,
  };
};

const createJobs = async () => {
  const NUMBER_OF_FILLER_JOBS = 51;
  const jobs: Job[] = [...handWrittenJobs()];

  for (let index = 0; index < NUMBER_OF_FILLER_JOBS; index++) {
    jobs.push(createJob());
  }

  const sorted = jobs.sort((a, b) => (a.jobTime < b.jobTime ? 1 : -1));
  const filePath = getPath('jobs.json');

  await fs.writeFile(filePath, JSON.stringify(sorted, null, 2), 'utf-8');
  console.log(`✨ Created Jobs:\x1b[90m packages/api/src/data/\x1b[0mjobs.json`);
};

const createData = async () => {
  await createCrewMembers();
  await createCrews();
  await createJobs();
};

createData();
