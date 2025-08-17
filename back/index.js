import express from 'express';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import cors from 'cors';
dotenv.config();


import routes from './routes/routes.js';

const app = express();
app.use(express.json());

app.use(cors());

app.use(fileUpload());
app.use("/uploads", express.static("uploads"));

app.use('/api/v1', routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});