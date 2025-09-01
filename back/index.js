import express from "express";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import https from "https";
import fs from "fs";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import csurf from 'csurf';

import swaggerSpec from "./config/swagger.js";
import routes from "./routes/routes.js";


dotenv.config();
const app = express(); 
// Sécurité HTTP headers 
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false, // désactive le CSP si besoin
  })
); 

// Middlewares 
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.APPLICATION_URL || "http://localhost:5173",
  credentials: true
}));

app.use(fileUpload());
app.use(
  "/uploads",
  express.static("uploads", {
    setHeaders: (res, path) => {
      res.setHeader("Access-Control-Allow-Origin", process.env.APPLICATION_URL || "http://localhost:5173");
    },
  })
);

app.use('/api/v1', routes);

const csrfProtection = csurf({ cookie: true });


// Optionnel : exposer le token CSRF pour le frontend 
app.get('/api/v1/csrf-token', csrfProtection, (req, res) => { 
    res.json({ csrfToken: req.csrfToken() });
}); 

// Swagger docs
app.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// HTTPS server avec tes certificats 
const PORT = process.env.PORT || 3000; 
const privateKey = fs.readFileSync('./config/dsp-dev-o24a-g4.fr_private_key.key', 'utf8');
const certificate = fs.readFileSync('./config/dsp-dev-o24a-g4.fr_ssl_certificate.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };
const httpsServer = https.createServer(credentials, app); 

// httpsServer.listen(PORT, () => { 
//     console.log(`Secure app is running on port ${PORT}`);
//  });

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});