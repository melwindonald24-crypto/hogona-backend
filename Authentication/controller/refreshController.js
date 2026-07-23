import acessTokenSevice from "../services/accesssTokenService.js";
import refreshTokenService from "../services/refreshTokenService.js";

export const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken)
      return res.status(401).json({ error: "refresh token is missing" });

   
    const record = await refreshTokenService.verifyToken(refreshToken);

    if (!record)
      return res.status(401).json({ error: "session expired! please log in" });

    const accessToken = acessTokenSevice.generateToken(record.userId);
    return res.status(200).json({
      accessToken,
    });
  } catch (error) {
     res.status(500).json({ error: "something went wrong try again" });
  }
};
