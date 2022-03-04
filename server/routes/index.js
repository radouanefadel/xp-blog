const ArticleRouter = require('./articles');
const CategoryRouter = require('./categories');
const CommentsRouter = require('./comments');

const Routes = [
	{ path: '/articles', router: ArticleRouter },
	{ path: '/categories', router: CategoryRouter },
	{ path: '/comments', router: CommentsRouter },
];

const useRoutes = (app) => {
	app.get('/', (req, res) => {
		res.send('Welcome to XP-Blog!');
	});
	Routes.forEach(route => {
		app.use(route.path, route.router);
	});
};

module.exports = useRoutes;