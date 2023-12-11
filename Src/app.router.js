import connectDB from '../Database/Connection.js';
import authenticationRouter from './Modules/Authentication/authentication.router.js';
const initapp=(app,express)=>{
    app.use(express.json());
    connectDB();
    app.use('/authentication',authenticationRouter);
    app.use('*',(req,res)=>{
        return res.json({message:"Page not found"});
    })
}

export default initapp;
