import 'dotenv/config'
import cloudinary from 'cloudinary'
cloudinary.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.APIKEY,
    api_secret: process.env.APISECRET,
})
export default cloudinary.v2
