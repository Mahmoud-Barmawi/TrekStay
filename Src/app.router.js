import connectDB from '../Database/Connection.js';
import authenticationRouter from './Modules/Authentication/authentication.router.js';
import userRouter from './Modules/User/user.router.js';
import categoryRouter from './Modules/Category/category.router.js';
import accommodationRouter from './Modules/Accommodation/accommodation.router.js';
import adminRouter from './Modules/Admin/admin.router.js';
import { globalErrorHandling } from './Utils/global_error_handling.js';
const initapp=(app,express)=>{
    app.use(express.json());
    connectDB();
    app.use('/authentication',authenticationRouter);
    app.use('/user',userRouter);
    app.use('/category',categoryRouter)
    app.use('/accommodation',accommodationRouter)
    app.use('/admin',adminRouter)
    app.use('*',(req,res)=>{
        return res.json({message:"Page not found"});
    })
    app.use(globalErrorHandling);
}

export default initapp;
