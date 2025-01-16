import {v2 as cloudinary} from "cloudinary";
import dotenv from 'dotenv';
import ShortUniqueId from 'short-unique-id';
import { auth } from '../middleware/auth.js';
import express from "express";


dotenv.config()

const router = express.Router();
const uid = new ShortUniqueId({ length: 10 });

// Create event
router.post('/', async (req, res) =>  {
         // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });
    
    // Upload an image
     const uploadResult = await cloudinary.uploader
       .upload(
           req.body.image, {
               public_id: uid.rnd(),
           }
       )
       .catch((error) => {
           console.log(error);
           res.status(404).json({err: error})
       });
    
    console.log(uploadResult);
    
    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = cloudinary.url('post', {
        fetch_format: 'auto',
        quality: 'auto'
    });
    
    console.log(optimizeUrl);
    
    // Transform the image: auto-crop to square aspect_ratio
    const autoCropUrl = cloudinary.url('post', {
        crop: 'auto',
        gravity: 'auto',
        width: 500,
        height: 500,
    });
    
    console.log(autoCropUrl);  
    // res.json({img_url: autoCropUrl})  
    res.json({img: uploadResult.url})
  });

  export default router;




  //https://res.cloudinary.com/dl7xblncz/image/upload/f_auto,q_auto/bSpthzWLcb