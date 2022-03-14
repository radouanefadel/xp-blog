const Faker = require('@faker-js/faker');
const faker = Faker.faker;

const generateArticles = async (author) => Array(100)
	.fill()
	.map((_, i) => ({
		title: faker.lorem.sentence(3),
		content: faker.lorem.lines(8),
		author,
	})
);

module.exports = {
	generateArticles,
};