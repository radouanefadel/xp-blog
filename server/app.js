require('dotenv').config({
	path: './config/.env.dev'
});
const express = require('express');
const { initPassportJWT } = require('./middleware');
const passport = require('passport');
const useRoutes = require('./routes');

const app = express();
const PORT = process.env.PORT;


initPassportJWT(passport);
app.use(passport.initialize());

app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);

useRoutes(app);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
