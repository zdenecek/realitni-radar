
const express = require("express");
const router = express.Router();
const passport = require("passport");

const registerUser = require("../src/auth").registerUser;

module.exports = router;


router.post('/login/password',
  passport.authenticate("local", { failWithError: true }),
  function(req, res, next) {
    const user = req.user;
    return res.json({ success: true, user: { name: user.name, username: user.username, role: user.role } });
  },
  function(err, req, res, next) {
    console.error(err);
    return res.status(401).json({ success: false, error: err });
  });

router.get("/logout", (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
  });
});


router.post('/signup', (req, res) => {
  const { username, password, name } = req.body;

  registerUser(username, password, name ,'registered', (err, user) => {
    if(err) {
      console.error(err);
      res.status(409).json({ success: false, message: err });
    }
    else res.json({ success: true, user });
  });
});