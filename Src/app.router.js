import connectDB from '../Database/Connection.js';
import authenticationRouter from './Modules/Authentication/authentication.router.js';
import { globalErrorHandling } from './Utils/global_error_handling.js';
const initapp=(app,express)=>{
    app.use(express.json());
    connectDB();
    app.use('/authentication',authenticationRouter);
    app.use('*',(req,res)=>{
        return res.json({message:"Page not found"});
    })
    app.use(globalErrorHandling);
}

export default initapp;
