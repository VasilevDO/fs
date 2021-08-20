const {Schema,model,Types} = require('mongoose');

const schema=new Schema({
  senderName:{type: String},
  text:{type: String},
  date: {type: Date, default:Date.now},
  owner: {type: Types.ObjectId, ref:'User'}
})

module.exports=model('Feedback',schema);