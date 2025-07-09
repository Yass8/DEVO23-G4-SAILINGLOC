import express from 'express';
import dotenv from 'dotenv';


import routes from './routes/routes.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/v1', routes)


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});