const express = require("express");
const router = express.Router();
const {check, validationResult} = require('express-validator/check');
const gravatar = require('gravatar');
const bycrypt= require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../../models/User');
// @route Post api/users
// @desc  Create a new user
// @access Private
router.post('/',[
    check('name', 'Name is requirement').not().isEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Please  entera valid password with 6 or more digits').isLength({
        min : 6
    })
], async (req,res) => {
    const errors= validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors : errors.array()});
    }
    try{
        const {name , email, password} = req.body;

    let user = await User.findOne({email});
    if(user){
        return res.status(400).json({errors : [{msg : 'User already exists'}]})
    }
    avatar= gravatar.url(email,{
        s:200,
        r: 'pn',
        d:'mm'
    })
    user = new User({
        name,email,avatar,password
    });
    const salt = await bycrypt.genSalt(10);
    user.password= await bycrypt.hash(password,salt);
    await user.save();
    const payload = {
        user: {
            id : user.id
        }
    }
    jwt.sign(payload, 
        config.get('jwtSecret'),
        {expiresIn: 36000},
        (err,token)=>{
            if (err)
            {
                throw err
            }
            res.status(200).json({token});
        }
    );
   // res.status(200).send("User Registered");

    }
    
    catch(err){
        res.status(500).send("Server Error");
    }
}
   
);


module.exports = router;
