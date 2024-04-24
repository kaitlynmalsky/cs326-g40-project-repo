import dbInstance from "./database.js";


/**
 * @typedef {import('faker')} Faker
 */

const faker = /** @type Faker */ (window.faker);

let userCount = 0;

function testUser() {
    const randomName = faker.name.findName();
    const username = faker.name.firstName();
    const randomEmail = faker.internet.email();
    /*const res = await fetch('https://picsum.photos/200/300');
    if (!res.ok) {
        return;
    }
    const data = await res.json();*/

    const userAvatar = `https://picsum.photos/150/150?random=${++userCount}`;

    const user = {
        name: randomName,
        username: username,
        email: randomEmail,
        avatar: userAvatar,
        password: faker.commerce.color()
    };
    console.log(user);
    return user;
}

export async function mockUsers() {
    const ids = [];
    const currentUserID = dbInstance.getCurrentUserID();
    if ((await dbInstance.getConnections()).length < 20) {
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
                })
            ])
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
                })
            ])
        }
    }
}
