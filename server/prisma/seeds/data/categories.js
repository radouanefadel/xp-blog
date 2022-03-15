// It's not recommended to use faker.js to generate fake category names.

const categoryNames = [
	'Web development',
	'Mobile development',
	'Data science',
	'Machine learning',
	'Artificial intelligence',
	'DevOps',
	'Blockchain',
	'Game development',
	'Cryptocurrency',
	'Micro-services',
];
const Categories = Array(10)
	.fill()
	.map((_, i) => ({
		name: categoryNames[i],
	}));

module.exports = Categories;