const Faker = require('@faker-js/faker');

const faker = Faker.faker;

let Users = [];

// Generate 11 users with fake data
// 10 users are authors, 1 is admin
for (let i = 0; i < 11; i++) {
	Users.push({
		firstName: faker.name.firstName(),
		lastName: faker.name.lastName(),
		email: faker.internet.email(),
		password: faker.internet.password(),
		role: i < 10 ? 'AUTHOR' : 'ADMIN',
	});
}

module.exports = Users;