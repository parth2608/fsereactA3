import {createUser, deleteUsersByUsername, findAllUsers, findUserById,} from "../services/users-service";

describe("createUser", () => {
    const ripley = {username: "ellenripley", password: "lv426", email: "ellenripley@aliens.com"};
    beforeAll(async () => {
        return deleteUsersByUsername(ripley.username);
    });
    afterAll(async () => {
        return deleteUsersByUsername(ripley.username);
    });
    test("can insert with REST API", async () => {
        const newUser = await createUser(ripley);
        expect(newUser.username).toEqual(ripley.username);
        expect(newUser.password).toEqual(ripley.password);
        expect(newUser.email).toEqual(ripley.email);
    });
});

describe("deleteUsersByUsername", () => {
    const sowell = {username: "thommas_sowell", password: "compromise", email: "compromise@solutions.com"};
    beforeAll(async () => {
        return createUser(sowell);
    });
    afterAll(async () => {
        return deleteUsersByUsername(sowell.username);
    });
    test("can delete with REST API", async () => {
        const status = await deleteUsersByUsername(sowell.username);
        expect(status.deletedCount).toBeGreaterThanOrEqual(1);
    });
});

describe("findUserById", () => {
    const adam = {username: "adam_smith", password: "not0sum", email: "wealth@nations.com"};
    beforeAll(async () => {
        return deleteUsersByUsername(adam.username);
    });
    afterAll(async () => {
        return deleteUsersByUsername(adam.username);
    });

    test("can retrieve with REST API", async () => {
        const newUser = await createUser(adam);
        expect(newUser.username).toEqual(adam.username);
        expect(newUser.password).toEqual(adam.password);
        expect(newUser.email).toEqual(adam.email);
        const existingUser = await findUserById(newUser._id);
        expect(existingUser.username).toEqual(adam.username);
        expect(existingUser.password).toEqual(adam.password);
        expect(existingUser.email).toEqual(adam.email);
    });
});

describe("findAllUsers", () => {
    const usernames = ["larry", "curley", "moe"];
    beforeAll(async () =>
        Promise.all(
            usernames.map((username) =>
                createUser({
                    username,
                    password: `${username}123`,
                    email: `${username}@stooges.com`,
                })
            )
        )
    );
    afterAll(() =>
        Promise.all(
            usernames.map((username) => deleteUsersByUsername(username))
        )
    );
    test("can retrieve all users from REST API", async () => {
        const users = await findAllUsers();
        expect(users.length).toBeGreaterThanOrEqual(usernames.length);
        const usersWeInserted = users.filter((user) => usernames.indexOf(user.username) >= 0);
        usersWeInserted.forEach((user) => {
            const username = usernames.find((username) => username === user.username);
            expect(user.username).toEqual(username);
            expect(user.password).toEqual(`${username}123`);
            expect(user.email).toEqual(`${username}@stooges.com`);
        });
    });
});
