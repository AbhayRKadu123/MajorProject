const express = require('express');
const router = express.Router();
const app = express();
const flash = require('connect-flash');
const mongoose = require('mongoose');
const url = 'mongodb://127.0.0.1:27017/wanderlust';
const Listing = require('../Models/listing.js');
const multer = require('multer');
const wrapAsync = require('../utils/wrapAsync');

const { middleware, isOwner } = require("../middleware.js");
const controller = require("../controller/listing.js");
const schema = require('../schema');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const passport = require('passport');

const { storage } = require("../cloudConfig.js");
const upload = multer({ storage }); 

// Middleware
app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Category Route
router.get("/Category", wrapAsync(controller.Categery_func));
// search 
router.get("/search",wrapAsync(controller.search));
// New Listing Routes
router.get("/new", middleware, wrapAsync(controller.RenderNewForm));
router.post("/new", middleware, upload.single('listing[image]'), wrapAsync(controller.RenderNewPostForm));

// Index Route
router.get("/", wrapAsync(controller.index));

// Show Listing Route
router.get("/:id", wrapAsync(controller.ShowAllListing));

// Edit Listing Routes
router.get("/:id/edit", middleware, isOwner, wrapAsync(controller.renderEditForm));
router.put("/:id", middleware, isOwner, upload.single('listing[image]'), wrapAsync(controller.EditPostForm));

// Delete Listing Route
router.delete("/:id", middleware, isOwner, wrapAsync(controller.DeleteListing));

module.exports = router;
