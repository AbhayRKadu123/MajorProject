const Review=require("../Models/reviews");
const Listing = require('../Models/listing.js');
module.exports.CreateReview=async(req,res)=>{
   
   console.log('this is review'+req.params.id)
    var list=await Listing.findById(req.params.id)
    var NewReview=new Review(req.body.review);
    NewReview.author=req.user._id;
   console.log('this is review'+NewReview.author)

    await NewReview.save();
    await list.reviews.push(NewReview);
    await list.save();
    req.flash('success', 'Review added !');
    res.redirect(`/listings/${req.params.id}`)
   

};

module.exports.DeleteReview=async(req,res)=>{

    await Review.findByIdAndDelete(req.params.id2);
    var r=await Listing.findByIdAndUpdate(req.params.id,{$pull:{reviews:req.params.id2}});
    req.flash('success', 'Review deleted Successfully!');
  
    res.redirect(`/listings/${req.params.id}`)

}