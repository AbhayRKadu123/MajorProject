const Listing=require("../Models/listing");
const schema=require("../schema");
const express=require('express')

const app=express()

app.use(express.urlencoded({extended:true}))

module.exports.Categery_func=async(req,res)=>{
    
    const allListing=await Listing.find({category: req.query.value});
    console.log(req.query.value)
    res.render('listings/index.ejs', { allListing });
}
module.exports.search=async (req, res) => {
    try {
      const searchTerm = req.query.value || ''; // Get user input from the query params
      const categoryFilter = req.query.category || ''; // Optional: filter by category
  
      // Search for listings with a case-insensitive match for location
      const allListing = await Listing.find({
        location: { $regex: searchTerm, $options: 'i' }// Optional category filter
      });
  
      res.render('listings/index.ejs', { allListing }); // Send the results back to the user
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
module.exports.index =async (req, res)  => {


    const allListing = await Listing.find({});
// console.log(allListing)
    res.render('listings/index.ejs', { allListing });
}

module.exports.RenderNewForm=async (req, res) => {
    // console.log(req.query);

    console.log('user==' + res.locals.user)
    res.render("listings/NEW.ejs");
}

module.exports.RenderNewPostForm=async (req, res) => {

    if (!req.body.listing) {
        throw new ExpressError(400, "Bad input from user size");
    }
    const url=req.file.path
    const filename=req.file.filename





    const { error, value } = schema.validate(req.body);
    console.log(error)
    if (error) {
        throw new ExpressError(400, error.message);

    }
    
 

  


    
    const newlst = new Listing(req.body.listing);
    newlst.owner = req.user._id;
    newlst.image={url,filename}
   

    await newlst.save()
    //    res.send("data saved")

    req.flash('success', 'Listing saved Successfully!');


    res.redirect("/listings")
}



module.exports.ShowAllListing=async (req, res, next) => {

    const { id } = req.params;
    const Data = await Listing.findById(id)
        .populate({
            path: 'reviews', populate: {
                path: 'author'
            }
        }).populate('owner');
    
    if (!Data) {
        req.flash('error', 'Listing does not exist !');
        res.redirect("/listings")
    }
    // const review=await Review.find({ _id: { $in: Data.reviews } });

    res.render('listings/show.ejs', { Data });


}

module.exports.renderEditForm=async (req, res) => {
    const { id } = req.params;
    console.log(id);

    const Data = await Listing.findById(id);

    console.log("EDIT ROUT" + Data)
    res.render("listings/edit.ejs", { Data });
}

module.exports.EditPostForm=async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Bad input from user size")
    }
    // const list = await Listing.findById(req.params.id);
    //    console.log('current use'+res.locals.currentuser._id)
    //   console.log('owner='+list.owner._id)
    // console.log('list')
    // console.log(list)

    if(typeof(req.file)!='undefined'){
        const url=req.file.path
        const filename=req.file.filename
        const list = await Listing.findById(req.params.id);
        list.image={url,filename}
        list.save();
    }

    await Listing.findByIdAndUpdate(req.params.id, { ...req.body.listing })
    req.flash('success', 'Listing Updated !');
    res.redirect(`/listings/${req.params.id}`);
}

module.exports.DeleteListing=async (req, res) => {

    await Listing.findByIdAndDelete(req.params.id);
    req.flash('success', 'Listing deleted Successfully!');
    res.redirect("/listings")

}

