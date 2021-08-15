const {Schema,model,Types} = require('mongoose');

const schema=new Schema({
  title:{type: String},
  text:{type: String},
  date: {type: Date, default:Date.now},
  dateEdited: {type: Date, default:null},
  createdBy:{type: String},
  editedBy:{type: String},
  owner: {type: Types.ObjectId, ref:'User'},
  likedBy:{type: Array, default:[]},
  dislikedBy:{type: Array, default:[]},
  deleted:{type:Boolean, default:false},
  number:{type:Number,default:0}
})

module.exports=model('BlogPost',schema);