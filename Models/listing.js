const mongoose=require('mongoose')
const Schema=mongoose.Schema;
const Review=require("./reviews.js");
const User=require("./user.js");
const { type } = require('../schema.js');
// function isValidUrl(url) {
//   const regex = /^(https?:\/\/)?([\w\d\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
//   return regex.test(url);
// }
const listingSchema = new Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: String,
  image: {
    url: String,
   filename:String
},
  price: Number,
  category:{
    type: String,
    default:'Homes',
    enum: ['Mountains', 'Beach', 'Nature','City','Historic','Rivers','Homes','Hiking','Snowy'], // Only these values are allowed
    required: true
  },
  location: String,
  country: String,

  reviews:[{
    type:Schema.Types.ObjectId,
    ref:Review,
  }],
  owner:{
    type:Schema.Types.ObjectId,
    ref:User
  }
});

listingSchema.post('findOneAndDelete',async(data)=>{
await Review.deleteMany({_id:{$in:data.reviews}});
console.log('data have been deleted ='+data)


})
// module.exports=listingSchema;
const Listing=mongoose.model('Listing',listingSchema);
module.exports=Listing;

