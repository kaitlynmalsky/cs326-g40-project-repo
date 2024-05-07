import dbInstance from './api.js';
import mockBios from './mockBios.js';

/**
 * @typedef {import('faker')} Faker
 */

// @ts-ignore
const faker = /** @type Faker */ (window.faker);

/**
 * @type {number}
 */
let userCount = 0;

/**
 * Creates random user data
 * @returns {import('./api.js').CreateUserInput}
 */
function testUser() {
  const randomName = faker.name.findName();
  const username = faker.name.firstName();
  const randomEmail = faker.internet.email();

  const userAvatar = `https://picsum.photos/150/150?random=${++userCount}`;

  /**
   * @type {import('./api.js').CreateUserInput}
   */
  const user = {
    name: randomName,
    username: username,
    email: randomEmail,
    avatar: userAvatar,
    avatarConfig: {
      bg: 0,
      body: 0,
      ears: 0,
      hat: 0,
    },
    password: faker.commerce.color(),
  };
  console.log(user);
  return user;
}

/**
 * Creates mock connections and sub-connection between any one element and the rest.
 * @returns {Promise<string[]>}
 */
export async function mockUsers() {
  const ids = [];
  const currentUserID = await dbInstance.getCurrentUserID();
  const currentConnections = await dbInstance.getConnections();
  if (currentConnections.length < 20) {
    for (let i = 0; i < 20; i++) {
      const user = testUser();
      const targetID = (await dbInstance.addUser(user)).userID;
      await dbInstance.updateUserBio(targetID, mockBios[i]);
      await Promise.all([
        dbInstance.createConnection({
          userID: currentUserID,
          targetID: targetID,
        }),
        dbInstance.createConnection({
          userID: targetID,
          targetID: currentUserID,
        }),
      ]);
      ids.push(targetID);
    }
    const user1 = ids[0];
    for (let i = 1; i < 20; i++) {
      await Promise.all([
        dbInstance.createConnection({
          userID: user1,
          targetID: ids[i],
        }),
        dbInstance.createConnection({
          userID: ids[i],
          targetID: user1,
        }),
      ]);
    }
  } else {
    return currentConnections.map((c) => c.targetID);
  }

  return ids;
}

/**
 * Generates a random date within a given range.
 * @param {Date} start - The start date of the range.
 * @param {Date} end - The end date of the range.
 * @returns {Date} A random date between the start and end dates.
 */
function getRandomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

/**
 * Formats a date to the ISO-8601 format (YYYY-MM-DDTHH:MM:SSZ).
 * @param {Date} date - The date to be formatted.
 * @returns {string} The ISO-8601 formatted date string.
 */

function formatDateToISO(date) {
  return date.toISOString();
}

/**
 * Generates random start time and end time within a range of 7 days from today.
 * @returns {{ startTime: string, endTime: string }} An object containing the generated start and end times in ISO-8601 format.
 */

function generateRandomTimeRange() {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + 1);

  const startTime = getRandomDate(startDate, endDate);
  const endTime = getRandomDate(startTime, endDate);

  const startTimeISO = formatDateToISO(startTime);
  const endTimeISO = formatDateToISO(endTime);

  return { startTime: startTimeISO, endTime: endTimeISO };
}

/**
 * Generates random coordinates within a bounding box.
 * @returns {[number, number]} An array containing the generated random coordinates [x, y].
 */
function generateRandomCoords() {
  const x1 = 42.41319;
  const y1 = -72.54448;
  const x2 = 42.36495;
  const y2 = -72.4967;

  const randomX = Math.random() * (x2 - x1) + x1;
  const randomY = Math.random() * (y2 - y1) + y1;

  return [randomX, randomY];
}

/**
 * Creates mock pins based on user data
 */
export async function mockPins() {
  const pins = (await dbInstance.getUpcomingPins()).length;
  if (pins < 15) {
    const users = await dbInstance.getAllUsers();

    for (const user of users) {
      const userId = user.userID;

      const time = generateRandomTimeRange();

      /**
       * @type {import('./api.js').CreatePinInput}
       */
      const pinData = {
        hostID: userId,
        startTime: time.startTime,
        endTime: time.endTime,
        details: faker.finance.bitcoinAddress(),
        coords: generateRandomCoords(),
      };
      console.log(pinData);
      await dbInstance.createPin(pinData);
    }
  }
}

export async function mockMessages() {
  const users = await dbInstance.getAllUsers();
  console.log(users);
  if (users.length >= 20) {
    let u1 = users[1];
    let u2 = users[2];
    await dbInstance.addGroupChat(0);
    await dbInstance.addGroupChatMember(u1.userID, 0);
    await dbInstance.addGroupChatMember(u2.userID, 0);

    let u3 = users[3];
    let u4 = users[4];
    let u5 = users[5];
    await dbInstance.addGroupChat(1);
    await dbInstance.addGroupChatMember(u3.userID, 1);
    await dbInstance.addGroupChatMember(u4.userID, 1);
    await dbInstance.addGroupChatMember(u5.userID, 1);

    await dbInstance.addGroupChatMessage(
      0,
      u1.userID,
      'Hey I just found out that they have therapy dogs in the campus center today!',
      new Date('April 23, 2024 13:24:00'),
    );
    await dbInstance.addGroupChatMessage(
      0,
      u2.userID,
      'Wait really??',
      new Date('April 23, 2024 13:25:00'),
    );
    await dbInstance.addGroupChatMessage(
      0,
      u2.userID,
      'I am going there right now',
      new Date('April 23, 2024 13:25:20'),
    );
    await dbInstance.addGroupChatMessage(
      0,
      u2.userID,
      'I am running',
      new Date('April 23, 2024 13:25:40'),
    );
    await dbInstance.addGroupChatMessage(
      0,
      u1.userID,
      'Please try not to scare the dogs...',
      new Date('April 23, 2024 13:26:40'),
    );
  }
}
