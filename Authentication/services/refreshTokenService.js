import crypto from "crypto"
import RefreshToken from "../models/RefreshToken.js";


const REFRESH_TOKEN_EXPIRY=30

class refreshTokenService
{
    static async generateToken(userId, deviceInfo) 
    {
       const refreshToken=crypto.randomBytes(64).toString('hex')
       const expiresAt= new Date(Date.now()+REFRESH_TOKEN_EXPIRY*1000*24*60*60)
       return RefreshToken.create({
        refreshToken,
        expiresAt,
        userId,
        deviceInfo,
       })

    }
    static async verifyToken(token)// returns a record or null 
    {
        const record= await RefreshToken.findOne().where('refreshToken').equals(token)
        if(record===null) return null
        if(record.expiresAt<new Date()) return null
        return record
    }
    static async revokeToken(token)
    {
        return await RefreshToken.deleteOne().where('refreshToken').equals(token)
    }
    static async revokeAllTokens(userId)
    {
        return await RefreshToken.deleteMany().where('UserId').equals(userId)
    }
}

export default refreshTokenService