require('dotenv').config({
	path: './config/.env.dev'
});
const express = require('express');
const useRoutes = require('./routes');

const app = express();
const PORT = process.env.PORT;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

useRoutes(app);
