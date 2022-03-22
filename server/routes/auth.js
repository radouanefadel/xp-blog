const bcrypt = require('bcrypt');
const express = require('express');
const prismaClient = require('@prisma/client');
const { issueJwt } = require('../middleware/utils');

const router = express.Router();
const prisma = new prismaClient.PrismaClient();

router.post('/login', async (req, res) => {
	const { email, password } = req.body;
	await prisma.user.findUnique({
		where: { email },
	}).then(user => {
		const userPassword = !!user ? user.password : '';
		const isValid = bcrypt.compareSync(password, userPassword);
		if (!user || !isValid) {
			return res.status(401).json({
				error: 'Invalid credentials'
			});
		}
		res.status(200).json({
			access_token: issueJwt(user),
			user: {
				name: `${user.firstName} ${user.lastName}`,
				email: user.email,
				role: user.role,
			},
			expires_in: 3600 * 24 * 1, // 1 day
		});
	});
});

module.exports = router;