const Routes = [
	{ path: '', router: require('./auth') },
	{ path: 'articles', router: require('./articles') },
	{ path: 'categories', router: require('./categories') },
	{ path: 'comments', router: require('./comments') },
	{ path: 'users', router: require('./users') },
];

const useRoutes = (app) => {
	app.get('/', (req, res) => {
		res.send('Welcome to XP-Blog!');
	});
	
	Routes.forEach(route => {
		const { path, router } = route;
		app.use(`/api/${path}`, router);
	});
};

module.exports = useRoutes;