const bcrypt = require('bcrypt');
const Faker  = require('@faker-js/faker');
const prismaClient = require('@prisma/client');
const Data = require('./Data');

const faker = Faker.faker;
const prisma = new prismaClient.PrismaClient();

// #region Delete operations
const deleteAllUsers = async () => {
	console.info('🗑️ ⏳ Deleting all users...');
	console.warn('🚸🚸 Cascade delete is enabled for this operation.');
	return prisma.user.deleteMany({})
		.then(() => console.info('🗑️ ✔️ All users have been deleted successfully', '\n'))
		.catch(err => console.warn('❌ Error while deleting users: ', err));
};

const deleteAllCategories = async () => {
	console.info('🗑️ ⏳ Deleting all categories...');
	return prisma.category.deleteMany({})
		.then(() => console.info('🗑️ ✔️ All categories have been deleted successfully.', '\n'))
		.catch(err => console.warn('❌ Error while deleting categories: ', err));
};

const deleteAll = async () => {
	console.info('⏳ Deleting all Data. This may take a while...', '\n');
	await deleteAllUsers();
	await deleteAllCategories();
	console.info('🗑️ ✅ All Data has been deleted successfully.', '\n');
	console.info('*'.repeat(100), '\n');
};
// #endregion

// #region Seed operations
const savedUsers = [];

const saveUsers = async () => {
	const users = Data.Users;
	console.info('💾 ⏳ Saving users...');
	for (let i = 0; i < users.length; i++) {
		const userData = users[i];
		await prisma.user.create({
			data: {
				...userData,
				password: await bcrypt.hashSync(userData.password, 10),
			}
		}).then(user => savedUsers.push({
			name: `${user.firstName} ${user.lastName}`,
			email: user.email,
			password: userData.password,
			role: user.role,
		}));
	}
	console.info('💾 ✅ All users have been saved successfully.', '\n');
};

const emojis = {
	admin: '🔑',
	stars: '⭐',
}

const saveCategories = async () => {
	const categories = Data.Categories;
	console.info('💾 ⏳ Saving categories...');
	for (let i = 0; i < categories.length; i++) {
		await prisma.category.create({
			data: categories[i],
		});
	}
	console.info('💾 ✅ All categories have been saved successfully.', '\n');
};

const saveArticlesAndComments = async () => {
	console.info('💾 ⏳ Saving articles and their comments...');
	const categories = await prisma.category.findMany();
	const authors = await prisma.user.findMany({
		where: {
			role: { equals: 'AUTHOR' },
		},
	});
	const articles = await Data.Articles.generateArticles(authors[0]);
	await Promise.all(
		articles.map(async (article) => {
			const articleCategories = faker.random.arrayElements(
				categories,
				faker.datatype.number({ min: 1, max: 4, })
			).map(category => ({ categoryId: category.cuid }));
			await prisma.article.create({
				data: {
					...article,
					categories: {
						create: articleCategories,
					}
				}
			});
		})
	);
	const fullName = `${authors[0].firstName} ${authors[0].lastName}`;
	console.info(`💾 ✅  All articles for the author "${fullName}" have been saved successfully.`, '\n');
};

const saveComments = async () => {
	console.log('💾 ⏳ Saving comments...');
	const articles = await prisma.article.findMany();
	await Promise.all(
		articles.map(async (article) => {
			const comments = await Data.Comments.generateComments();
			await prisma.comment.createMany({
				data: comments.map(comment => ({
					...comment,
					articleId: article.cuid,
				})),
			});
		})
	);
	console.info('💾 ✅  All comments have been saved successfully.', '\n');
};

const save = async () => {
	console.info('💾 ⏳ Saving Data. This may take a while...', '\n');
	await saveUsers();
	await saveCategories();
	await saveArticlesAndComments();
	await saveComments();
	console.info('💾 ✅ Data has been saved successfully.', '\n');
	console.info('*'.repeat(100));
};

// #endregion

const showSavedUsers = () => {
	console.log('\n', '🔑👤 SAVED USERS:', '\n');
	console.table(
		savedUsers.filter(user => user.role !== 'ADMIN'),
		['name', 'email', 'password']
	);
	console.log('\n', '🔑👤 SAVED ADMINS:', '\n');
	console.table(
		savedUsers.filter(user => user.role === 'ADMIN'),
		['name', 'email', 'password']
	);
	console.log('\n');
};

const main = async () => {
	console.log('\n', '🚀 Data seeder started...', '\n\n');
	await deleteAll();
	await save();
	showSavedUsers();
};

main()
	.then(() => console.info('🎉 Database seeded successfully!'))
	.catch((err) => {
		console.error('\n\n💥 Error while seeding Database!', err);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());
