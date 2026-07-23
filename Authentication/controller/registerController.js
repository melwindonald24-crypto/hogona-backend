import User from "../../Users/models/User.js";
import bcrypt from "bcrypt"


export const register=async (req,res)=>{
    
    try{

        const {email,password,name}=req.body

        if(!email|| !password || !name)
        {
            return res.status(400).json({error:"all the feilds are required"});//client-side error 400
        }
        const existing=await User.findOne().where('email').equals(email.toLowerCase())
        if(existing) return res.status(409).json({error:"the user aldready exists! please log in"})//conflict with a existing resource
    
        const hashedPassword=await bcrypt.hash(password,10);
        await User.create({
            name,
            email:email.toLowerCase(),
            password:hashedPassword,
        })
        return res.status(201).json({messsage:"good news!!!you are registered successfully. login now"})
    }
    catch(error)
    {
         res.status(500).json({error:"something went wrong try again"})
        console.log("registration error: "+error.message)
    }


}