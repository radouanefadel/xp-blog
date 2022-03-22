const passport = require('passport');

const Routes = [
	{ path: 'articles', router: require('./articles') },
	{ path: 'categories', router: require('./categories') },
	{ path: 'comments', router: require('./comments') },
	{ path: 'users', router: require('./users') },
];

const useRoutes = (app) => {
	app.get('/', (req, res) => {
		res.send('Welcome to XP-Blog!');
	});
	
	app.use('/api/', require('./auth'));
	
	const verifyToken = passport.authenticate('jwt', { session: false });
	Routes.forEach(route => {
		const { path, router } = route;
		app.use(`/api/${path}`, verifyToken, router);
	});
};

module.exports = useRoutes;