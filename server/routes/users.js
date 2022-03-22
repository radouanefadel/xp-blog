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

module.exports = router;