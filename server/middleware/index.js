require('dotenv').config({
	path: './config/.env.dev'
});

const PassportJWT = require('passport-jwt');
const prismaClient = require('@prisma/client');

const prisma = new prismaClient.PrismaClient();

const ExtractJWT = PassportJWT.ExtractJwt;
const JWTStrategy = PassportJWT.Strategy;

const options = {
	jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_SECRET,
	algorithms: ['HS256'],
};

const strategy = new JWTStrategy(options, (payload, done) => {
	prisma.user.findUnique({
		where: { cuid: payload.sub }
	}).then(
		user => user ? done(null, user) : done(null, false)
	).catch(err => done(err, false));
});

module.exports = {
	initPassportJWT(passport) {
		passport.use(strategy);
	}
};