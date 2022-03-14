const Faker = require('@faker-js/faker');

const faker = Faker.faker;

// Generate 11 users with fake data
// 10 users are authors, 1 is admin
const Users = Array(11).fill()
	.map((value, index) => {
		const firstName = faker.name.firstName();
		const lastName = faker.name.lastName();
		return {
			firstName,
			lastName,
			email: faker.internet.email(firstName, lastName).toLowerCase(),
			password: faker.internet.password(),
			role: index < 10 ? 'AUTHOR' : 'ADMIN',
		};
	}
);

module.exports = Users;