const Faker = require('@faker-js/faker');

const faker = Faker.faker;

const Categories = Array(10)
	.fill()
	.map(() => ({
		name: faker.lorem.word(),
	}));

module.exports = Categories;