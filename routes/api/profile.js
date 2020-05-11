const router = require("express")();
const mongoose = require("mongoose");
const request = require("request");
const config = require("config");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Post = require("../../models/Post");
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator/check");

// @route GET api/profile/me
// @desc  Get profile of logged in user.
// @access Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar", "email"]);
    if (!profile) {
      return res.status(400).json({
        msg: "Profile does not exists",
      });
    }
    res.status(200).json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

// @route Post api/profile/
// @desc  Create and update a profile
// @access Private
router.post(
  "/",
  [
    auth,
    [
      check("status", "Staus is required").not().isEmpty(),
      check("skills", "Skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    const {
      company,
      website,
      location,
      status,
      skills,
      bio,
      githubusername,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
    } = req.body;

    const profileFields = {};
    //webiste
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (status) profileFields.status = status;
    if (bio) profileFields.bio = bio;
    if (githubusername) profileFields.githubusername = githubusername;

    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
      console.log(profileFields.skills);
    }

    profileFields.social = {};

    if (youtube) profileFields.social.youtube = youtube;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        //Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        res.status(200).json(profile);
      }
      //Create
      else {
        profile = new Profile(profileFields);
        await profile.save();
        res.status(200).json(profile);
      }
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route GET api/profile/
// @desc  Get all profiles.
// @access Public
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    console.log("profiles :>> ", profiles);
    res.status(200).json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route GET api/profile/user/:user_id
// @desc  Get profile by user id
// @access Public
router.get("/user/:userId", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.userId,
    }).populate("user", ["name", "avatar"]);
    console.log(profile);
    if (!profile) {
      return res.status(400).json({ msg: "Profile Not Found" });
    }
    res.status(200).json(profile);
  } catch (err) {
    console.log(err.message);
    if (err.kind == "ObjectId")
      return res.status(400).json({ msg: "Profile Not Found" });
    res.status(500).send("Server Error");
  }
});

// @route Delete api/profile/
// @desc  Delete profile , user , posts
// @access Private
router.delete("/", auth, async (req, res) => {
  try {
    //Post Delete
    await Post.deleteMany({ user: req.user.id });

    //Profile Delete
    await Profile.findOneAndRemove({ user: req.user.id });

    //User Delete
    await User.findByIdAndRemove({ _id: req.user.id });

    res.status(200).json({ msg: "User deleted" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

// @route PUT api/profile/expereince
// @desc  Add profile expereince in a profile
// @access Private
router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title Field is required").not().isEmpty(),
      check("company", "Company Field is required").not().isEmpty(),
      check("from", "fromDate  Field is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    const {
      title,
      company,
      location,
      from,
      current,
      to,
      description,
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      current,
      to,
      description,
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route Delete api/profile/expereince/:exp_id
// @desc  delete expereince in a profile
// @access Private
router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    const resultIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);
    if (resultIndex == -1) {
      return res.status(400).send("Id not found");
    } else {
      profile.experience.splice(resultIndex, 1);
    }

    await profile.save();
    //const exp = ["A","B","C"];
    //const exp1= ["D", "E", "F"];
    //const str=exp.indexOf("A");
    //console.log(exp.unshift(exp1));
    //console.log(exp.push(exp1));
    //console.log(str);
    res.json(profile);
  } catch (err) {
    console.log(err.messgae);
    res.status(500).send("Server Error");
  }
});

// @route PUT api/profile/education
// @desc  Add education in a profile
// @access Private
router.put(
  "/education",
  [
    auth,
    [
      check("school", "School Field is required").not().isEmpty(),
      check("degree", "Degree Field is required").not().isEmpty(),
      check("fieldofstudy", "Fieldofstudy Field is required").not().isEmpty(),
      check("from", "From date Field is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newEdu);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route Delete api/profile/education/:edu_id
// @desc  delete education in a profile
// @access Private
router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    //remove index
    const returnIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);
    if (returnIndex == -1) {
      return res.status(400).json({ message: "Id is not valid" });
    }

    profile.education.splice(returnIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

// @route GET api/profile/github/:username
// @desc  get repos of github
// @access Public
router.get("/github/:username", (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&
            sort=created:asc&client_id=${config.get(
              "githubClientID"
            )}&client_secret=${config.get("githubSeceret")}`,
      method: "GET",
      headers: { "User-Agent": "node.js" },
    };
    request(options, (error, response, body) => {
      if (error) {
        console.error(error);
      }
      if (response.statusCode !== 200) {
        return res.status(400).json({ msg: "GitHub Profile Not found" });
      }
      // console.log(body);
      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
