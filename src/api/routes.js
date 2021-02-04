const express = require("express");
const router = express.Router()

require("middleware/auth");

const userRouter = require("./components/user/controller");
const blogpostRouter = require("./components/blogpost/controller");
const commentRouter = require("./components/comment/controller");

if (process.env.NODE_ENV !== 'test') {
  router.use("/user", passport.authenticate("jwt", { session: false }), userRouter);
  router.use("/blogposts", passport.authenticate("jwt", { session: false }), blogpostRouter);
  router.use("/comments", passport.authenticate("jwt", { session: false }), commentRouter);
}
else{
  router.use("/user", userRouter);
  router.use("/blogposts", blogpostRouter);
  router.use("/comments", commentRouter);
}


router.post(
  "/signup",
  passport.authenticate("signup", { session: false }),
  async (req, res, next) => {
    res.json({
      message: "Registrazione utente avvenuta con successo",
      user: req.user,
    });
  }
);

router.post("/login", async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        const error = new Error("An error occurred.");

        return next(error);
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const body = { _id: user._id, email: user.email };
        const token = jwt.sign({ user: body }, "TOP_SECRET");

        return res.json({ token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

module.exports = router;
