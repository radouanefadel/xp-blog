const express = require('express');
const useRoutes = require('./routes');

const app = express();

app.listen(3000, () => {
	console.log('Server listening on port 3000');
});

useRoutes(app);
