const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const router = express.Router();
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
// load user model
const User = require('../../models/User');
const passport = require('passport');

// @route GET api/users/test
// @desc Test users route
// @access Public
router.get('/test', (req,res) => res.json({msg: 'users works'}));

// @route GET api/users/register
// @desc Register users route
// @access Public
router.post('/register', (req,res) => {
User.findOne({email: req.body.email})
.then(user => {
    if(user) {
        return res.status(400).json({email: 'User already exists'})
    }else {
        const avatar = gravatar.url(req.body.email,{
            s: '200', //Size 
            r: 'pg', //rating
            d: 'mm' //default
        });
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            avatar,
            password: req.body.password
        });
        bcrypt.genSalt(10,(err,salt) =>{
            bcrypt.hash(newUser.password, salt, (err,hash) =>{
                if(err) throw err;
                newUser.password = hash;
                newUser.save()
                .then(user => res.json(user))
                .catch(err => console.log(err));
            })
        })
    }
})
});

// @route GET api/users/login
// @desc Login users route
// @access Public
router.post('/login',(req,res) =>{
const email = req.body.email;
const password = req.body.password;

//Find user by email
User.findOne({email})
.then(user => {
    //check for user
    if(!user){
        return res.status(404).json({email: 'User not found'});
    }
    //check password
    bcrypt.compare(password, user.password).then(isMatch =>{
        if(isMatch){
            // User matched
            const payload = {id: user.id, name: user.name, avatar: user.avatar};

            //Sign token
            jwt.sign(payload,
                 keys.SecreteOrKey,
                  {expiresIn: 3600},
                (err, token) =>{
                    res.json({
                        Success: true,
                        token: 'Bearer ' + token
                    });

            });
        }else{
            return res.status(400).json({password: 'Password Incorrect'})
        }
    });
});
});


// @route GET api/users/current
// @desc return cuuurent user 
// @access Private

router.get('/current', passport.authenticate('jwt', {session: false}), (req,res) => {
    (req,res) => res.json({message: 'success'})
});
module.exports = router;
