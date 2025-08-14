import express from 'express';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import cors from 'cors';
dotenv.config();


import routes from './routes/routes.js';

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173',
  methods: 'GET,POST,PUT,DELETE',
  credentials: true
}))

app.use(fileUpload());
app.use("/uploads", express.static("uploads"));

app.use('/api/v1', routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});