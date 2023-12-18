const express = require("express");
const router = express.Router();
const upload = require("./../routes/multer");

const authController = require("./../controllers/authController");
const routeController = require("./../controllers/routeController");

const postModel = require('./../models/postModel')
const userModel = require("./../models/userModel");
const passport = require("passport");
const { route } = require("../app");


// login route
router
  .route("/")
  .get((req, res) => {
    res.render("home" , {nav:false});
  })
  .post(
    passport.authenticate("local", {
      successRedirect: "/profile",
      failureRedirect: "/",
    }),
    (req, res) => {
      res.redirect("/profile");
    }
  );

  router.get('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });



// register route
router
  .route("/register")
  .get(authController.registerGet)
  .post(authController.registerPost);

// profile route
router.get("/profile", async (req, res) => {
  try {
    if (req.session.passport && req.session.passport.user) {
      const user = await userModel
      .findOne({
        username: req.session.passport.user})
        .populate('posts')

        
      res.render('profile', { user , nav:true });
    } else {
      // Handle the case when passport user is not defined in the session
      res.status(403).send("Unauthorized");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});


// upload route
router.post("/fileupload", upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      throw new Error("No file uploaded.");
    }

    const user = await userModel.findOne({
      username: req.session.passport.user,
    });
    user.profileImage = req.file.filename;

    await user.save();

    res.redirect('/profile')
  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).send("File upload failed");
  }
});

router.get('/add' ,(req,res)=>{
  if(req.isAuthenticated()){
    res.render('add', {nav :true})
  }else{
    res.redirect("/")
   
  }
  
})
router.post('/createpost',upload.single('postimage') ,async(req,res)=>{
try {
  if (!req.file) {
    throw new Error("No file uploaded.");
  }

  if(req.isAuthenticated()){
    const user = await userModel.findOne({username : req.session.passport.user})
   const post  = await postModel.create({
      user :user._id,
      title : req.body.title,
      description : req.body.description,
      image : req.file.filename
    })

    user.posts.push(post._id)
    await user.save()

    res.redirect('/profile')
  }else{
    res.redirect("/")
   
  }
} catch (error) {
  console.log(error);
}
})

// uploaded posts
router.get("/uploads", async (req, res) => {
  try {
    if (req.session.passport && req.session.passport.user) {
      const user = await userModel
      .findOne({
        username: req.session.passport.user})
        .populate('posts')

        
      res.render('show', { user , nav:true });
    } else {
      // Handle the case when passport user is not defined in the session
      res.status(403).send("Unauthorized");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

// feed route

router.get("/feed", async(req, res) => {
 try {
  const user = await userModel.findOne({username : req.session.passport.user})
  const posts = await postModel.find().populate('user')

  res.render('feed' , {user , posts , nav:true})
 } catch (error) {
  console.log(error);
  res.status(401).send("server error")
 }
});
module.exports = router;
