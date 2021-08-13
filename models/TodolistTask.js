const {Schema,model,Types} = require('mongoose');

const schema=new Schema({
  status:{type: String},
  text:{type: String},
  deadline: {type: String},
  doneDate: {type: String},
  owner: {type: Types.ObjectId, ref:'User'}
})

module.exports=model('TodolistTask',schema);