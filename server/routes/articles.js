const express = require('express');
const router = express.Router();

const prismaClient = require('@prisma/client');
const prisma = new prismaClient.PrismaClient();

const passport = require('passport');
const verifyToken = passport.authenticate('jwt', { session: false });

const { body, validationResult } = require('express-validator');

router.get('/', async (req, res) => {
	const articles = await prisma.article.findMany({
		orderBy: {
			createdAt: 'desc',
		}
	});
	return res.status(200).json({ articles });
});

router.get('/:cuid', async (req, res) => {
	const { cuid } = req.params;
	const article = await prisma.article.findUnique({
		where: {
			cuid,
		},
		include: {
			categories: {
				select: {
					category: true,
				},
			},
			comments: true,
		}
	});
	if (!article) {
		return res.status(404).json({
			error: 'Article not found',
		});
	}
	return res.status(200).json({ article });
});

router.post('/',
	verifyToken,
	body('title').trim().isLength({ min: 2 }).withMessage('Title must be at least 2 characters long'),
	body('content').trim().isLength({ min: 50 }).withMessage('Content must be at least 50 characters long'),
	body('image').trim().isURL().withMessage('Image must be a valid URL'),
	body('categories').isArray({ min: 1 }),
	body('categories.*').isString().isLength({ min: 1 }),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { title, content, image, categories } = req.body;
		await Promise.all(categories.map(
			async (name) => await prisma.category.upsert({
				where: { name },
				update: {},
				create: { name },
			})
		));
		const article = await prisma.article.create({
			data: {
				title,
				content,
				image,
				author: {
					connect: {
						// This is the user that is currently logged in
						cuid: req.user.cuid,
					},
				},
				categories: {
					create: categories.map(name => ({
						category: {
							connect: { name },
						},
					})),
				},
			},
		}).catch(
			() => res.status(500).json({ error: 'Something went wrong' })
		);
		return res.status(201).json({ article });
	}
);

module.exports = router;
