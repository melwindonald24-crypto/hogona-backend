import refreshTokenService from "../services/refreshTokenService.js";

refreshTokenService

export const logout=async (req,res)=>{
    try{
        const refreshToken=req.cookies?.refreshToken
        if(!refreshToken)
        {
            return res.status(401).json({error:"refresh token is not present"})
        }
        await refreshTokenService.revokeToken(refreshToken)
        return res.clearCookie("refreshtoken").status(200).json({message:"logout succeessfull"})

    }
    catch(error)
    {
         res.status(500).json({ error: "something went wrong try again" });
        

    }
}