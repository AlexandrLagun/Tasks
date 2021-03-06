const express = require("express");
const router = express.Router();
const passport = require("passport");

//const { check, validationResult } = require('express-validator');

const {
  signUp,
  signIn,
  getProfile,
  
} = require("../services/user");

const {
  getBooks,
  getBookCover,
  searchBooks,
  getSingleBook,
  addComment,
  bookingBook,
  decrementAvailableBooksCount,
  incrementAvailableBooksCount,
  cancelReservation
  
} = require("../services/books");


router.post("/signup", /* [
  // firstname must be at least 2 chars long
  check('firstname').isLength({ min: 3 }),
  // lastname must be at least 2 chars long
  check('lastname').isLength({ min: 3 }),
  // username must be at least 3 chars long
  check('username').isLength({ min: 4 }),
  // email must be as email
  check('email').isEmail(),
  // password must be at least 4 chars long
  check('password').isLength({ min: 5 })
  ], */ (req, res) => {


    /* const errors = validationResult(req);
    if (!errors.isEmpty()) {
    // return res.status(422).json({ errors: errors.array() });
    console.log("---Errors from signup: " + JSON.stringify(errors));
    } */

    const {firstname, lastname, username, email, password} = req.body;
    const userData = {firstname, lastname, username, email, password};
    //const userData = req.body;
    console.log("signupInfo: " +  firstname + " " + lastname + " " + username +  " " + email + " " + password);
    signUp(userData, res);
    
});

router.post("/signin", /* [
  // username must be at least 3 chars long
  check('email').isEmail(),
  // password must be at least 4 chars long
  check('password').isLength({ min: 7 })
  ], */ (req, res) => {


   /*  const errorsSignIn = validationResult(req);
    if (!errorsSignIn.isEmpty()) {
     // return res.status(422).json({ errors: errors.array() });
     console.log("---Errors from signin: " + JSON.stringify(errorsSignIn));
    }
 */
    
  console.log("It's Ok from /signin");
  const {email, password} = req.body;
  const userData = {email, password};
  console.log("signinInfo: " + email +  " " + password);
  signIn(userData, res)

});

router.get("/profile", passport.authenticate("jwt", {
  session: false
}), (req, res) => {
  getProfile(req, res);
  //console.log("AUTHENTICATION WITH PASSPORT!!!");
});


router.get("/books", (req, res) => {
  getBooks(req, res);
});

router.get("/book/cover/:bookId", (req, res) => {
  getBookCover(req, res)
})

router.post("/search", (req, res) => {
  searchBooks(req, res);
})


router.get("/book/:bookId", (req, res) => {
  //console.log("hi from user routes");
  getSingleBook(req, res)
})

router.post("/addcomment", passport.authenticate("jwtBan", {
  session: false
}), (req, res) => {
  addComment(req, res)
})

router.post("/bookingbook", passport.authenticate("jwtBan", {
  session: false
}), (req, res) => {
  bookingBook(req.body.bookId, req.user._id, req.body.bookingTime)
    .then(() => decrementAvailableBooksCount(req.body.bookId))
    .then(() => {
      console.log(" Hi from booking route!");
      /* logger.info(`user ${req.user._id} booked book ${req.body.bookId}`) */
      res.sendStatus(200);
    })
    .catch(() => {
      res.sendStatus(400);
    })
})

router.post("/cancelreservationuser", passport.authenticate("jwtBan", {
  session: false
}), (req, res) => {
  cancelReservation(req.body.bookId, req.user._id)
    .then(() => incrementAvailableBooksCount(req.body.bookId))
    .then(() => {
      /* logger.info(`user ${req.user._id} booked book ${req.body.bookId}`) */
      res.sendStatus(200);
    })
    .catch(() => {
      res.sendStatus(400);
    })
})

router.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.sendStatus(200);
});













module.exports = router;