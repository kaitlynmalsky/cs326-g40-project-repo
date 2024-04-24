import dbInstance from "./database.js";


/**
 * @typedef {import('faker')} Faker
 */

const faker = /** @type Faker */ (window.faker);

function testUser() {
    const randomName = faker.name.findName();
    const username = faker.name.firstName();
    const randomEmail = faker.internet.email();
    const userAvatar = "./images/placeholder_avatar.png" //faker.internet.avatar(); 
    const user = {
        name: randomName,
        username: username,
        email: randomEmail,
        avatar: userAvatar,
        password: faker.commerce.color()
    };
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
    }
}
