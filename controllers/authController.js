const passport = require("passport");
const userModel = require("./../models/userModel");


// Register Route controllers
exports.registerGet = async (req, res) => {
  res.render("register"  , {nav : false});
};

exports.registerPost = async (req, res) => {
//   const {email, fullname , username , dateofbirth} = req.body;

  const { email, fullname, username, dateofbirth } = req.body;

    try {
        const user = await new userModel({
            email: email,
            username: username,
            fullname: fullname,
            dateofbirth: dateofbirth
        });

        userModel.register(user, req.body.password, (err) => {
            if (err) {
                console.log(err);
                return res.send('Error during registration');
            }

            passport.authenticate('local')(req, res, function () {
                res.render('profile' ,{user ,nav:true});
            });
        });
    } catch (error) {
        console.log(error);
        res.send('Error during registration');
    }
};


// Login route controller

