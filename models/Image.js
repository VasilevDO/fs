const {Schema,model,Types} = require('mongoose');

const schema=new Schema({
  url:{type:String, required:true},
  description:{type: String},
  tags:{type: String},
  date: {type: Date, default:Date.now},
  owner: {type: Types.ObjectId, ref:'User'}
})

module.exports=model('Image',schema);