const {Router} = require('express');
const config=require('config');
const Task=require('../models/TodolistTask');
const auth=require('../middleware/auth.middleware');
const router=Router();

router.post('/create', auth,async (request, response)=> {
    try {
        const {text,status}=request.body.task;
        /**const existing=await Image.findOne({url});

        if (existing) {
            return response.json({message:'Image already been saved'});
        }   */
        const task=new Task ({
            text:text,status:status,owner:request.user.userId
        })
        await task.save();
        response.status(201).json(task);

    } catch (e) {
        response.status(500).json({message:'Something went wrong. Try again later'});
    }
})

router.post('/update', auth,async (request, response)=> {
    try {
        const updatedTask=request.body.task;
        const task=await Task.findOne({_id:updatedTask._id});
        for (const key in updatedTask) {
            if (task[key]!==updatedTask[key]) task[key]=updatedTask[key];
        }
        await task.save(); 
        console.log(task);
        response.status(201).json(task);
    } catch (e) {
        console.log(e.message);
        response.status(500).json({message:'Something went wrong. Try again later'});
    }
})

router.post('/delete', auth,async (request, response)=> {
    try {
        const {id}=request.body;
        const task=await Task.findOne({_id:id});
        await task.delete();
        response.status(201).json({message:'Task was successfuly deleted'})
    } catch (e) {
        response.status(500).json({message:'Something went wrong. Try again later'});
    }
})


router.get('/', auth,async (request, response)=> {
    try {
        const tasks = await Task.find({owner:request.user.userId});
        response.status(201).json(tasks);
    } catch (e) {
        response.status(500).json({message:'Something went wrong. Try again later'});
    }
})


module.exports=router;




