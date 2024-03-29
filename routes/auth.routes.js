const {Router} = require ('express');
const bcrypt=require('bcryptjs');
const config=require('config');
const jwt=require('jsonwebtoken');
const {check, validationResult}=require('express-validator');
const User=require('../models/User');
const Task=require('../models/TodolistTask');
const Image=require('../models/Image');
const router = Router();
const nodemailer = require('nodemailer');

const randomFromAtoB=(a,b)=> {
    return Math.round(a - 0.5 + Math.random() * (b - a + 1));
}
const generatePasswordResetId=(length)=> {
    let id='';
    const chars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    while (id.length<length) {
        id+=chars[randomFromAtoB(0,chars.length-1)];
    }
    return id;
}

const copyUserGoldTasks=async(userId)=>{
    const userGold=await User.findOne({status:'usergoldstandart'});
    const tasks=await Task.find({owner:userGold._id});
    tasks.forEach(async task=>{
        const newTask=new Task({
            text:task.text,
            status:task.status,
            owner:userId
        })
        await newTask.save();
    })
}

const copyUserGoldImages=async(userId)=>{
    const userGold=await User.findOne({status:'usergoldstandart'});
    const images=await Image.find({owner:userGold._id});
    images.forEach(async image=>{
        const newImage=new Image({
            url:image.url,
            owner:userId
        })
        if (image.description) {
            newImage.description = image.description;
        }
        if (image.tags) {
            newImage.tags = image.tags;
        }
        await newImage.save();
    })
}

// /api/auth/register
router.post('/register',
[
    check('email','Invalid email').isEmail(),
    check('name','Invalid name').exists(),
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
        const candidateEmail=await User.findOne({email});
        if (candidateEmail) {
            response.status(400).json({
                message:'This email is already used'
            });
        }
        const candidateName=await User.findOne({name});
        if (candidateName) {
            response.status(400).json({
                message:'This name is already taken'
            });
        }
        const hashedPassword=await bcrypt.hash(password,12);
        const user=new User({email,password:hashedPassword,name:name,status:'user'});
        await copyUserGoldTasks(user._id);
        await copyUserGoldImages(user._id);
        await user.save();
        const token=jwt.sign(
            {userId:user.id},
            config.get('jwtKey'),
            {expiresIn:'1h'}
        )
        response.json({token,userId:user.id,userName:user.name,userStatus:user.status});
    } catch (e) {
        response.status(500).json({message:e.message});
        //response.status(500).json({message:'Something went wrong. Try again later'});
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

        if (!user) {
            return response.status(400).json({message:'Wrong email or password'});
        }

        const isMatch=await bcrypt.compare(password,user.password);
        if (!isMatch) {
            return response.status(400).json({message:'Wrong email or password'});
        }

        const token=jwt.sign(
            {userId:user.id},
            config.get('jwtKey'),
            {expiresIn:'144h'}
        )

        response.json({token,userId:user.id,userName:user.name});

    } catch (e) {
        response.status(500).json({message:'Wrong email or password'});
    }
});

router.get('/login', 
async (request,response)=>{
    try {
        const guests=await User.find({status:'guest'});
        const email=`guest_${guests.length+1}@pwnz-guests.pog`;
        const hashedPassword=await bcrypt.hash(`guest_${guests.length}`,12);
        name = `Guest_${guests.length+1}`;
        const user=new User({email,password:hashedPassword,name:name,status:'guest'});
        await copyUserGoldTasks(user._id);
        await copyUserGoldImages(user._id);
        await user.save();
        const token=jwt.sign(
            {userId:user.id},
            config.get('jwtKey'),
            {expiresIn:'1h'}
        )
        response.json({token,userId:user.id,userName:user.name,userStatus:user.status});
    } catch (e) {
        response.status(500).json({message:'Wrong email or password'});
    }
});

// /api/auth/recover
router.post('/recover', 
[
    check('email','Enter valid email').normalizeEmail().isEmail(),
],
async (request,response)=>{
    try {
        const errors=validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({
                errors:errors.array(),
                message:'Invalid email'
            });
        }
        
        const {email} = request.body;
        const user=await User.findOne({email});

        if (!user) {
            return response.status(400).json({message:'Email not found'});
        }

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.get('emailer'),
                pass: config.get('emailerPassword')
            }
        });

        let passwordResetId=generatePasswordResetId(12);

        let userWithResetId=await User.findOne({passwordResetId:passwordResetId});

        while (userWithResetId) {
            passwordResetId=generatePasswordResetId(12);
            userWithResetId=await User.findOne({passwordResetId:passwordResetId});
        }

        let mailOptions = {
            from: 'pwnzforever.ru',
            to: user.email,
            subject:'Password recovery',
            text:`Hello, ${user.name}! There is your link to reset password:${config.get('baseUrl')}/reset/${passwordResetId}`
        }

        transporter.sendMail(mailOptions, function (error, data) {
            if (error) {
                console.log(error);
            }
        })

        user.passwordResetId=passwordResetId;
        await user.save();
        response.json({message:'Email succesfully sent'});
    } catch (e) {
        response.status(500).json({message:'Something went wrong. Try again later.'});
    }
});


// /api/auth/reset
router.post('/reset', 
[
    check('password', 'Minimum password length is 6 characters').isLength({min:6})
],
async (request,response)=>{
    try {
        const errors=validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({
                errors:errors.array(),
                message:'Invalid password'
            });
        }
        
        const {password,passwordResetId} = request.body;
        const user=await User.findOne({passwordResetId});

        if (!user) {
            return response.status(400).json({message:'Password change request not found'});
        }

        const hashedPassword=await bcrypt.hash(password,12);
        user.password=hashedPassword;
        user.set('passwordResetId',undefined,{strict:false});
        await user.save();
        response.json({message:'Password succesfully changed'});
    } catch (e) {
        response.status(500).json({message:'Something went wrong. Try again later.'});
    }
});


router.post('/userRights',async (request, response)=> {
    try {
        const {id}=request.body;
        const user=await User.findOne({_id:id});

        if (!user) {
            return response.status(400).json({message:'Something definetely went wrong'});
        }
        const userRights={};
        if (user.status==='admin') {
            userRights.canModerateBlog=true;
        };
        return response.status(201).json(userRights)

    } catch (e) {
        response.status(500).json({message:'Something went wrong. Try again later'});
    }
})

module.exports=router;