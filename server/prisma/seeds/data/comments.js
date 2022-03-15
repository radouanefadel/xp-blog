const Faker = require('@faker-js/faker');
const faker = Faker.faker;

const generateComments = async () => {
	const length = faker.datatype.number({ min: 0, max: 20 });
	return Array(length)
		.fill()
		.map((_, i) => ({
			email: faker.internet.email(),
			content: faker.lorem.lines(faker.datatype.number({ min: 1, max: 2 })),
		})
	);
};

module.exports = {
	generateComments,
};