const Review=require("../Models/reviews");
const Listing = require('../Models/listing.js');
module.exports.CreateReview=async(req,res)=>{
   
   
    var list=await Listing.findById(req.params.id)
    var NewReview=new Review(req.body.review);
    NewReview.author=req.user._id;
    await NewReview.save();
    await list.reviews.push(NewReview);
    await list.save();
    req.flash('success', 'Review added !');
    res.redirect(`http://localhost:8080/listings/${req.params.id}`)

};

module.exports.DeleteReview=async(req,res)=>{

    await Review.findByIdAndDelete(req.params.id2);
    var r=await Listing.findByIdAndUpdate(req.params.id,{$pull:{reviews:req.params.id2}});
    req.flash('success', 'Review deleted Successfully!');
  
    res.redirect(`http://localhost:8080/listings/${req.params.id}`)

}