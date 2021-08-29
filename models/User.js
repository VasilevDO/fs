const {Schema,model,Types} = require('mongoose');

const schema=new Schema({
    email:{type:String, required:true,unique:true},
    password:{type:String,required:true},
    name:{type:String,required:true, unique:true},
    status:{type:String,defalut:'user'},
    passwordResetId:{type:String},
    links:[{
        type: Types.ObjectId,ref:'Link'
    }]
    
})

module.exports=model('User',schema);