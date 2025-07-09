import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app = express();

app.listen(process.env.PORT, ()=>{
    console.log('App is running on port 3000');  
});

