import 'dotenv/config';
import express from 'express';
import initapp from './Src/app.router.js';
const app=express();
const PORT=process.env.PORT || 5000;

initapp(app,express);   

app.listen(PORT,()=>{
    console.log(`Server is running at ${PORT}`);
})
