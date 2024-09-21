const Listing=require('./Models/listing');
const Review=require('./Models/reviews');
module.exports.middleware=(req,res,next)=>{
if(!req.isAuthenticated()){
    console.log(req.originalUrl)
    req.session.url=req.originalUrl;
    req.flash("error","you must be logged in !")
    return res.redirect("/user/login")
}else{
    next();

}
  
}

module.exports.AuthenticateReview=(req,res,next)=>{
   

    if(!req.isAuthenticated()){
    

        req.session.url=`/listings/${req.params.id}`;
        req.flash("error","you must be logged in !")
        return res.redirect("/user/login")
    }else{
        next();
    
    }
      
    }
    
module.exports.redirecturl=(req,res,next)=>{
    res.locals.url=req.session.url;
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    const {id}=req.params;
    const list=await Listing.findById(id);
    if(!res.locals.currentuser._id.equals(list.owner._id)){
        req.flash('error', 'no access!');
        return res.redirect(`/listings`);
      } else{
        next()
      }
}
module.exports.isReviewAuthor=async(req,res,next)=>{
    const {id,id2}=req.params;
    const review=await Review.findById(id2);
    if(res.locals.currentuser &&!res.locals.currentuser._id.equals(review.author._id)){
        req.flash('error', 'You are not the author of this review!');
        return res.redirect(`http://localhost:8080/listings/${req.params.id}`)
      } else{
        next()
      }
}