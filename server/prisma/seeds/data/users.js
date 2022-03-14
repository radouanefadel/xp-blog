const Faker = require('@faker-js/faker');

const faker = Faker.faker;

// Generate 11 users with fake data
// 10 users are authors, 1 is admin
const Users = Array(11).fill()
	.map((value, index) => ({
		firstName: faker.name.firstName(),
		lastName: faker.name.lastName(),
		email: faker.internet.email(),
		password: faker.internet.password(),
		role: index < 10 ? 'AUTHOR' : 'ADMIN',
	})
);

module.exports = Users;