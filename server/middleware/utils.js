require('dotenv').config({
	path: './config/.env.dev'
});
const jwt = require('jsonwebtoken');

const issueJwt = (user) => {
	const payload = {
		sub: user.cuid,
		role: user.role
	};
	const options = {
		expiresIn: '1d',
		algorithm: 'HS256',
	};
	const token = jwt.sign(payload, process.env.JWT_SECRET, options);
	return `Bearer ${token}`;
};

module.exports = {
	issueJwt,
};