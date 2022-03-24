const express = require('express');
const router = express.Router();

const prismaClient = require('@prisma/client');
const prisma = new prismaClient.PrismaClient();

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

module.exports = router;
