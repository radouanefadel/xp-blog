const express = require('express');
const router = express.Router();
const prismaClient = require('@prisma/client');
const prisma = new prismaClient.PrismaClient();

router.get('/', async (req, res) => {
	if (req.isAuthenticated() && req.user.role === 'ADMIN') {
		const users = await prisma.user.findMany();
		res.json({ users });
	} else {
		res.status(401).json({
			message: 'You are not authorized to display content of this endpoint.'
		});
	}
});

router.get('/authors', async (req, res) => {
	const users = await prisma.user.findMany({
		where: { role: 'AUTHOR' },
		select: {
			cuid: true,
			firstName: true,
			lastName: true,
			articles: true,
		}
	});
	return res.json({ users });
});

module.exports = router;