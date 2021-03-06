const  User  = require("./database").User;
const crypto = require('crypto');
const token = require("./jwtoken");


const signUp = (userData, res) => {
    console.log( "FDDG"+  JSON.stringify(userData));
    let usernameSearch = new Promise((res, rej) => {
      User.findOne({ username: userData.username })
        .then(username => res(username))
    });
    let emailSearch = new Promise((res, rej) => {
      User.findOne({ email: userData.email })
        .then(email => res(email))
    });
    Promise.all([usernameSearch, emailSearch])
      .then(values => {
        if (values[0] === null && values[1] === null) {
          let newUser = new User({
            firstName: userData.firstname,
            lastName: userData.lastname,
            username: userData.username,
            email: userData.email,
            password: crypto.createHash("sha256").update(userData.password).digest("hex")
          });

          newUser.save();

          res.sendStatus(200);

          // redirect to login page
        } else {
          res.sendStatus(401);
          console.log("The user with the same email or username already exists");
        }
      })
      .catch(err => {
        console.log(err.message)
        res.sendStatus(500);
      });
}


const signIn = (req, res) => {
  
  //console.log(req.email + "---------!!");
  User.findOne({ email: req.email },
    (err, user) => {
      console.log("user: " + user);
      if (user) {
        if (
          user.password === crypto.createHash("sha256").update(req.password).digest("hex")
        ) {
          // add cookies to store jwt
          res.cookie("jwt", token.setToken(user._id), {
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // cookies expires in 1 week
            httpOnly: true
          });
          console.log("Authentication was successfully done");
          res.sendStatus(200);
        } else {
          
          console.log("Authentication was failed: incorrect password" + res);
          res.sendStatus(401);
          
        }
      } else {
        res.sendStatus(404);
        console.log("User with such email wasn't found " + res);
      }
    }
  );
}

const getProfile = (req, res) => {
  let payload = {
    _id: req.user._id,
    firstname: req.user.firstName,
    lastname: req.user.lastName,
    username: req.user.username,
    email: req.user.email,
    takenBooks: req.user.takenBooks,
    bookedBooks: req.user.bookedBooks,
    isAdmin: req.user.isAdmin,
    isBan: req.user.isBan
  };
  res.json(payload);
}



module.exports = {
  signUp,
  signIn,
  getProfile,

};
