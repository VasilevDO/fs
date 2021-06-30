const {Router} = require ('express');
const bcrypt=require('bcryptjs');
const config=require('config');
const jwt=require('jsonwebtoken');
const {check, validationResult}=require('express-validator');
const User=require('../models/User');
const router=Router();

// /api/auth/register
router.post('/register',
[
    check('email','Invalid email').isEmail(),
    check('password', 'Minimum password length is 6 characters').isLength({min:6})
],
 async (request,response)=>{
    try {
        const errors=validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({
                errors:errors.array(),
                message:'Invalid registration data'
            });
        }

        const {email,password,name}=request.body;
        const candidate=await User.findOne({email});
        if (candidate) {
            response.status(400).json({
                message:'This email is already used'
            });
        }
        const hashedPassword=await bcrypt.hash(password,12);
        const user=new User({email,password:hashedPassword,name:name||"E-traveler"});

        await user.save();

        response.status(201).json({
            message:'User has been planted'
        });

    } catch (e) {
        response.status(500).json({message:'Something went wrong. Try again later'});
    }

});

// /api/auth/login
router.post('/login', 
[
    check('email','Enter valid email').normalizeEmail().isEmail(),
    check('password','Enter password').exists()
],
async (request,response)=>{
    try {
        const errors=validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({
                errors:errors.array(),
                message:'Invalid login data'
            });
        }
        
        const {email,password} = request.body;
        const user=await User.findOne({email});

        if (!User) {
            return response.status(400).json({message:'User not found'});
        }

        const isMatch=await bcrypt.compare(password,user.password);
        if (!isMatch) {
            return response.status(400).json({message:'Wrong password'});
        }

        const token=jwt.sign(
            {userId:user.id},
            config.get('jwtKey'),
            {expiresIn:'1h'}
        )
        response.json({token,userId:user.id,userName:user.name});

    } catch (e) {
        response.status(500).json({message:'Something went wrong. Try again later'});
    }
});

module.exports=router;