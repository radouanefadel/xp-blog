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

module.exports = router;
