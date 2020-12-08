var express    = require("express");
var router     = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");



router.get("/", function(req,res){
	// get all campgrounds from database
	
	Campground.find({},function(err,allcampgrounds){
		
		if(err){
			console.log("something wrong");
			console.log(err);
			
		}else{
			
			
			 res.render("campgrounds/index",{campgrounds:allcampgrounds});
		}
	})
	
	
})

// Create Route

router.post("/", middleware.isLoggedIn, function(req,res){
	var name=req.body.name;
	var image= req.body.image;
	var description= req.body.description;
	var author= {
		id: req.user._id,
		username: req.user.username
	}
	
	var newCampground={name: name, image: image, description: description, author: author};
	//campgrounds.push(newCampground);
	
	Campground.create(newCampground,function(err, newlyCreated){
		if(err)
			console.log(err);
		else {
			req.flash("success","Newly added campground to db");
			res.redirect("/campgrounds");
		}
	})
})

router.get("/new",middleware.isLoggedIn, function(req,res){
	res.render("campgrounds/new");
})

// Show Route

router.get("/:id", function(req,res){
	//find the cg by the provided id
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err)
			console.log(err)
		else 
			res.render("campgrounds/show", {campground: foundCampground});
	})
	//res.send("show Pge mr.");
})

// Edit route

router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(req, res){
		res.render("campgrounds/edit", {campground: foundCampground});
	})
})

// Update Route

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err)
			res.redirect("/campgrounds");
		else{
			req.flash("success", "Campground updated");
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
})

/// Destroy Route
 router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	 Campground.findByIdAndRemove(req.params.id, function(err){
		 if(err)
			 res.redirect("/campgrounds");
		 else{
			 req.flash("success", "Campground deleted");
			 res.redirect("/campgrounds");
		 }
	 })
 })




module.exports = router;
