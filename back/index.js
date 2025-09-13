import express from 'express';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import cors from 'cors';
dotenv.config();

import helmet from "helmet";
import cookieParser from "cookie-parser";
import https from "https";
import fs from "fs";
import csurf from 'csurf';

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import swaggerSpec from './config/swagger.js';
import routes from './routes/routes.js';

const app = express();
app.use(express.json());

app.use(fileUpload());
app.use(
  "/uploads",
  express.static("uploads", {
    setHeaders: (res, path) => {
      res.setHeader("Access-Control-Allow-Origin", process.env.APPLICATION_URL || "http://localhost:5173");
    },
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false, // désactive le CSP si besoin
  })
); 

app.use(cookieParser());
app.use(cors({
  origin: process.env.APPLICATION_URL || "https://dsp-dev-o24a-g4.fr",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
}));

// Gérer les pré-vols OPTIONS explicitement
app.options('*', cors());

app.use('/api/v1', routes);

app.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const csrfProtection = csurf({ cookie: true });


// Optionnel : exposer le token CSRF pour le frontend 
app.get('/api/v1/csrf-token', csrfProtection, (req, res) => { 
    res.json({ csrfToken: req.csrfToken() });
}); 

// Swagger docs
app.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// HTTPS server avec tes certificats 
const privateKey = fs.readFileSync('./config/dsp-dev-o24a-g4.fr_private_key.key', 'utf8');
const certificate = fs.readFileSync('./config/dsp-dev-o24a-g4.fr_ssl_certificate.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };
const httpsServer = https.createServer(credentials, app); 

const PORT = process.env.PORT || 3000;
const USE_HTTPS = process.env.USE_HTTPS === 'true';

if (USE_HTTPS) {
  httpsServer.listen(PORT, () => {
    console.log(`Secure HTTPS server running on port ${PORT}`);
  });
} else {
  app.listen(PORT, () => {
    console.log(`App server running on port ${PORT}`);
  });
}