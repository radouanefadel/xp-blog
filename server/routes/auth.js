const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const express = require('express');
const prismaClient = require('@prisma/client');

const { issueJwt } = require('../middleware/utils');
const { ucFirst } = require('../utils/strings');

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

router.post('/register',
	body('email').trim().isEmail(),
	body('password').isLength({ min: 8 }),
	body('firstName').trim().isLength({ min: 2 }),
	body('lastName').trim().isLength({ min: 2 }),
	async (req, res) => {
		const { firstName, lastName, email, password } = req.body;
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array(),
			});
		}
		const user = await prisma.user.findUnique({
			where: { email },
		});
		if (!!user) {
			res.status(409).json({
				error: 'Email is already taken!',
			});
		} else {
			await prisma.user.create({
				data: {
					firstName: ucFirst(firstName),
					lastName: lastName.toUpperCase(),
					email,
					password: bcrypt.hashSync(password, 10),
					role: 'AUTHOR',
				},		
			}).then(user => res.status(201).json({
				message: 'User created successfully!',
				user: {
					name: `${user.firstName} ${user.lastName}`,
					email: user.email,
					role: user.role,
				},
			})).catch(err =>
				res.status(500).json({ error: 'Unable to create user' })
			);
		}
	}
);

module.exports = router;