import express from 'express';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import cors from 'cors';
dotenv.config();

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import swaggerSpec from './config/swagger.js';

import routes from './routes/routes.js';

const app = express();
app.use(express.json());

app.use(cors());

app.use(fileUpload());
app.use("/uploads", express.static("uploads"));

app.use('/api/v1', routes);

app.use('api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});