import connectDB from '../Database/Connection.js';
import authenticationRouter from './Modules/Authentication/authentication.router.js';
import userRouter from './Modules/User/user.router.js';
import categoryRouter from './Modules/Category/category.router.js';
import accommodationRouter from './Modules/Accommodation/accommodation.router.js';
import wishlistRouter from './Modules/Wishlist/wishlist.router.js';
import bookingRouter from './Modules/Booking/booking.router.js';
import visaRouter from './Modules/Visa/visa.router.js';


import { globalErrorHandling } from './Utils/global_error_handling.js';

const initapp = (app, express) => {
    app.use(express.json());
    connectDB();
    app.use('/authentication', authenticationRouter);
    app.use('/user', userRouter);
    app.use('/category', categoryRouter);
    app.use('/accommodation', accommodationRouter);
    app.use('/wishlist', wishlistRouter);
    app.use('/booking', bookingRouter);
    app.use('/visa', visaRouter);
    app.use('*', (req, res) => {
        return res.json({ message: "Page not found" });
    })
    app.use(globalErrorHandling);
}

export default initapp;
