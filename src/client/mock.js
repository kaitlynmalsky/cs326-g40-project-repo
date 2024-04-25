// @ts-nocheck
import dbInstance from './database.js';

/**
 * @typedef {import('faker')} Faker
 */

const faker = /** @type Faker */ (window.faker);

/**
 * @type {number}
 */
let userCount = 0;

/**
 * Creates random user data
 * @returns {import('./database.js').CreateUserInput}
 */
function testUser() {
    const randomName = faker.name.findName();
    const username = faker.name.firstName();
    const randomEmail = faker.internet.email();

    const userAvatar = `https://picsum.photos/150/150?random=${++userCount}`;

    const user = {
        name: randomName,
        username: username,
        email: randomEmail,
        avatar: userAvatar,
        password: faker.commerce.color(),
    };
    console.log(user);
    return user;
}

/**
 * Creates mock connections and sub-connection between any one element and the rest.
 * @returns {string[]}
 */
export async function mockUsers() {
    const ids = [];
    const currentUserID = dbInstance.getCurrentUserID();
    const currentConnections = await dbInstance.getConnections();
    if (currentConnections.length < 20) {
        for (let i = 0; i < 20; i++) {
            const user = testUser();
            const targetID = (await dbInstance.addUser(user)).userID;
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
    endDate.setDate(startDate.getDate() + 7);

    const startTime = getRandomDate(startDate, endDate);
    const endTime = getRandomDate(startTime, endDate);

    const startTimeISO = formatDateToISO(startTime);
    const endTimeISO = formatDateToISO(endTime);

    return { startTime: startTimeISO, endTime: endTimeISO };
}

/**
 * Generates random coordinates within a bounding box.
 * @returns {number[]} An array containing the generated random coordinates [x, y].
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
        const ids = await mockUsers();
        console.log('ids', ids);
        for (const id of ids) {
            const time = generateRandomTimeRange();
            const pinData = {
                hostID: id,
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
