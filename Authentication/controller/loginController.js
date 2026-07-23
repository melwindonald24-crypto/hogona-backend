import User from "../../Users/models/User.js";
import bcrypt from "bcrypt";
import acessTokenSevice from "../services/accesssTokenService.js";
import refreshTokenService from "../services/refreshTokenService.js";

const HTTP_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 30 * 1000 * 24 * 60 * 60,
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "all the feilds are required" });
    }
    const record = await User.findOne()
      .where("email")
      .equals(email.toLowerCase());
    if (!record) return res.status(401).json({ error: "invalid password or email" });

    const isValid = await bcrypt.compare(password, record.password);
    if (!isValid) return res.status(401).json({ error: "invalid password or email" });

    const accessToken =  acessTokenSevice.generateToken(record._id);
    const refreshToken = await refreshTokenService.generateToken(
      record._id,
      req.headers["user-agent"],
    );

    res.cookie("refreshToken", refreshToken, HTTP_COOKIE_OPTIONS);
    return res.status(200).json({
      user: { userId: record._id, name: record.name },
      accessToken,
    });
  } catch (error) {
    res.status(500).json({ error: "something went wrong try again" });
    console.log("login error: "+error.message)
  }
};
