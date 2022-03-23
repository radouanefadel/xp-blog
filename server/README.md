# XP-BLOG / Server
REST API with **Node.js** & **Express.js**
## Environment setup
Before running your project, create a `.env.dev` file (it should be located at `/server/config` folder)

```env
PORT=YOUR_APP_PORT

DATABASE_URL=mysql://USERNAME:PASSWORD@HOST:PORT/DB_NAME?createDatabaseIfNotExist=true

JWT_SECRET=YOUR_JWT_SECRET_KEY
```

## Database seed
To seed the database, run the following command:
```bash
npx prisma db seed
```
## Running the server
To run the server, run the following command:
```bash
npm run dev-start 
```