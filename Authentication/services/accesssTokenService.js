import jwt from "jsonwebtoken"




class acessTokenSevice
{

   
    static  generateToken(userid)
    {
        //userid should be a string
      
        return jwt.sign({userId:userid.toString()},process.env.ACCESS_TOKEN_SECRET,{
            expiresIn:'15m',
            algorithm:"HS256",
        
        })
    }
    static  verifyToken(token)
    {
        return jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,{
            algorithms:["HS256"]
        })//throws a error if verification failed
    }

}
export default acessTokenSevice