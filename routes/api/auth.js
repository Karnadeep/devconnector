const router = require("express")();
const { check, validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../../middleware/auth");
const User = require("../../models/User");

//@route Get api/auth
//descp: To get display  user  using token
//access  Private using token key
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

//@route post api/auth
//descp: To get login for a userand get a  token
//access  Private using token key
router.post(
  "/",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a password").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    console.log(email);
    try {
      const user = await User.findOne({ email });
      console.log(user);
      //check if the user exists
      if (!user) {
        return res.status(401).json({
          msg: "Autherization failed",
        });
      }
      await bcrypt.compare(password, user.password);
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) {
            return res.status(500).send("Token error");
          }

          res.status(200).json({
            message: "User Logeed in",
            token: token,
          });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
