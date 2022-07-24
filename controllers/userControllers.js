
const UserModel = require("../models/User")
const bcrypt = require("bcrypt")
const md5=  require("md5")
const { populate, where } = require("../models/User")
const { render } = require("ejs")
const ObjectId=UserModel.ObjectId
const mongoose= require ("mongoose")

// Showing home page with all the users
exports.showHomePage = async (req, res) => {
  try {
    const result2 = await UserModel.find();

    if (req.session.user) {
      req.session.user.avatar = getAvatar(req.session.user)
      console.log(req.session.user)
      res.render("dashboard.ejs", {
        data: { allUser: result2, loggedInUser: req.session.user },
      })
    } else {
      res.render("index.ejs", { data: { result: result2, error: "" } })
    }
  } catch (error) {
    console.log(error)
  }
};

// Creating a new user
exports.createNewUser = async (req, res) => {
  console.log(req.body.username)
  var salt = bcrypt.genSaltSync(10)
  const hashedPassword = bcrypt.hashSync(req.body.password, salt)
  console.log(hashedPassword)
  try {
    const userDoc = new UserModel({
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email,
    });
    console.log(userDoc);

    // Saving Document
    const result = await userDoc.save();
    console.log(result);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

// Showing edit form with data
exports.editUser = async (req, res) => {
  try {
    const result = await UserModel.findById(req.params.id)
    console.log(result)
    res.render("edit", { data: result });
  } catch (error) {
    console.log(error)
  }
}

// Update user
exports.updateDocById = async (req, res) => {
  console.log(req.body);
   try { if(this.userLoggedIn==true){
    const result = await UserModel.findById(req.params.id).updateOne(req.body);
  }} catch (error) {
    console.log(error);
  }
    
  
  const result2 = await UserModel.find();
  res.render("dashboard.ejs", {
    data: { allUser: result2, loggedInUser: req.session.user },
  })
}

// Deleting the user by id.
exports.deleteUser = async (req, res) => {
  try {
    const result = await UserModel.findByIdAndDelete(req.params.id);
  } catch (error) {
    console.log(error);
  }
  req.session.destroy();
  res.redirect("/");
};

/* A function that is being exported. */
exports.loginUser = async (req, res) => {
  try {
    const result = await UserModel.findOne({ username: req.body.username })

    console.log(result)
    if (result && bcrypt.compareSync(req.body.password, result.password)) {
      req.session.user = {
        _id: result._id,
        username: result.username,
        password: result.password,
        email: result.email,
        followers: result.followers,
        following: result.following,
        followersCount: result.followers.length,
        followingCount: result.following.length,
      }
      console.log(req.session.user)
      const result2 = await UserModel.find({ $nin: req.session.username })

      console.log(result2)

      req.session.save(function () {
        res.render("dashboard", {
          data: { allUser: result2, loggedInUser: req.session.user },
        })
      })
      req.session.user.avatar = getAvatar(req.session.user.email)
    } else {
      req.flash("error", "Sorry your credentials are wrong");
      const result = await UserModel.find();
      req.session.save(function () {
        res.render("index", {
          data: { result: result, error: req.flash("error") },
        });
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//checking if user is logged in

exports.userLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.send("Unauthorised Access!");
  }
};

//Follow User
exports.followUser = async function (req, res) {
  try {
    const followingId = mongoose.Types.ObjectId(req.params.id.trim());
    const followerId = mongoose.Types.ObjectId(req.session.user._id.trim());
    console.log(followingId);
    console.log(followerId);

    // Checking whether the id is valid or not
    if (!mongoose.Types.ObjectId(req.params.id.trim(req.params.id))) {
      res.render("404");
    }

    // Checking if my id is similar to the user I am following
    if (req.params.id === req.session.user._id) {
      res.render("404");
    }

    // Adding the user to my following array
    const followingQuery = {
      _id: req.session.user._id,
      following: { $not: { $elemMatch: { $eq: followingId } } },
    };
    console.log(followingQuery);

    const followingUpdate = {
      $addToSet: { following: followingId },
    }

    console.log(followingUpdate);

    const followingUpdated = await UserModel.updateOne(
      followingQuery,
      followingUpdate
    )

    console.log(followingUpdated)
    // Adding my id to the followers array of the user whom I followed
    const followerQuery = {
      _id: followingId,
      followers: { $not: { $elemMatch: { $eq: followerId } } },
    }
    console.log(followerQuery)

    const followerUpdate = {
      $addToSet: { followers: followerId },
    }
    console.log(followerUpdate);

    const followerUpdated = await UserModel.updateOne(
      followerQuery,
      followerUpdate
    )
    console.log(followerUpdated)

    res.send("Followed!")
  } catch (err) {
    console.log(err)
  }
}

// Logout user
exports.logoutUser = function (req, res) {
  req.session.destroy();
  res.redirect("/");
};

const getAvatar = function (email) {
  return `https://gravatar.com/avatar/${md5(email)}?s=128`;
};
