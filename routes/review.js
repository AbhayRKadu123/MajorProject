const express=require('express');
const app=express();
const ReviewRouter=express.Router({mergeParams:true});
const wrapAsync=require('../utils/wrapAsync');
const ExpressError=require('../utils/ExpressError');
const path=require('path');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');

const schema=require('../schema')
const Review=require('../Models/reviews.js');
const ReviewController=require("../controller/review.js")
const {middleware,AuthenticateReview,isOwner,isReviewAuthor}=require("../middleware.js");
// Review Route
ReviewRouter.post("/reviews",AuthenticateReview,wrapAsync(ReviewController.CreateReview))
// deleting review route
ReviewRouter.delete("/:id2/delete",AuthenticateReview,isReviewAuthor,wrapAsync(ReviewController.DeleteReview))

module.exports= ReviewRouter;