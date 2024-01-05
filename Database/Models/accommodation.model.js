import mongoose, { Schema, Types, model } from 'mongoose'
import { describesYourPlace } from '../../Src/Modules/Accommodation/describe_place.js';
const accommodationSchema=new Schema({
    name:{
        type:String,
        required:true,
    },
    slug:{
        type:String,
        required:true,
    },
    describesYourPlace:{
        type:String,
        default:describesYourPlace.House,
        enum:Object.values(describesYourPlace),
    },
    description:{
        type:String,
        required:true,
    },
    country :{
        type:String,
        required:true,
    },
    town:{
        type:String,
        required:true,
    },
    ZIP_code:{
        type:String,
        required:true,
    },
    hostName:{
        type:String,
        required:true,
    },
    hostPhoneNumber:{
        type:String,
        required:true,
    },
    mainImage:{
        type:Object,
        required:true,
    },
    subImages:[
        {type:Object,required:true}
    ],
    pricePerNight:{
        type:String,
        required:true,
    },
    status: {
        type: String,
        default: 'Active',
        enum: ['Active', 'Inactive'],
    },
    numberOfBedroom:{
        type:Number,
        required:true
    },
    numberOfBeds:{
        type:Number,
        required:true
    },
    numberOfGuests:{
        type:Number,
        required:true
    },
    numberOfBathroom:{
        type:Number,
        required:true
    },
    servicesProvided:{
        type:String,
        required:true,
    },
    reserved:{
        type:Boolean,
        required:true,
        default:'false',
    },
    minimumNumberOfNights:{
        type:Number,
        default:1,
    },
    published:{
        type:String,
        required:true,
        default:'Pending',
        enum:['Accepted','Rejected','Pending']
    },
    reviews:[{
        type:String,
    }],
    checkIn:[{
        type:Date,
        default:null,
    }],
    checkOut:[{
        type:Date,
        default:null,
    }],
    category: { type: Types.ObjectId, ref: 'Category', required: true },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Types.ObjectId, ref: 'User', required: true },
},{
    timestamps:true,
})

const accommodationModel=mongoose.models.Accommodation || model('Accommodation',accommodationSchema);
export default accommodationModel;
