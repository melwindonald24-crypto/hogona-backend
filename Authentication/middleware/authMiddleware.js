import acessTokenSevice from "../services/accesssTokenService.js";

export const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "you are unauthorized!!" });
    }
    const accessToken = authHeader.split(" ")[1];
    try {
      const payload = acessTokenSevice.verifyToken(accessToken);
      req.userId = payload.userId;
      next();
    } catch (error) {
      res.status(401).json({ error: "you are unauthorized!" });
    }
  } catch (error) {
    res.status(500).json({ error: "something went wrong try again" });
  }
};
