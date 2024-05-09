import { faker } from '@faker-js/faker';
import { hasMocked, createUser, createConnection } from "./database.js";
import { randomUUID } from 'crypto';

let userCount = 0;
/**
 * Creates random user data
 */
function testUser() {
    const userID = randomUUID();
    const randomName = faker.person.fullName();
    const username = faker.person.firstName();
    const randomEmail = faker.internet.email();

    const userAvatar = `https://picsum.photos/150/150?random=${userCount}`;

    const user = {
        userID: userID,
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
        password: faker.music.genre(),
    };
    return user;
}

async function addUsers() {
    if (await hasMocked()) {
        return [];
    }
    const users = [];
    while (userCount <= 10) {
        const user = testUser();
        try {
            const signupPromise = await createUser(user);
            users.push(signupPromise);
        } catch (err) {
            console.error(err);
        }
        userCount++;
    }
    return users;
}

export async function addConnections(userID) {
    const users = await addUsers();
    console.log(users);

    for (const user of users) {
        const connPromise = await createConnection({
            userID: userID,
            targetID: user.userID,
        });
        const connPromise2 = await createConnection({
            targetID: userID,
            userID: user.userID,
        })
    }

    const user1 = users[0];
    for(let i = 1; i<users.length; i++){

        const connPromise = await createConnection({
            userID: user1.userID,
            targetID: users[i].userID
        });

        const connPromise2 = await createConnection({
            targetID: user1.userID,
            userID: users[i].userID
        });

    }

}

