var express                = require("express"),
    app                    = express(),
    bodyParser             = require("body-parser"),
    mongoose               = require("mongoose"),
    Campground             = require("./models/campground"),
    User                   = require("./models/user"),
	flash                  = require("connect-flash"),
    passport               = require("passport"),
    LocalStrategy          = require("passport-local"),
    passportLocalMongoose  = require("passport-local-mongoose"),
    seedDB                 = require("./seeds"),
    Comment                = require("./models/comments"),
	methodOverride         = require("method-override");

// requiring routes
var campgroundRoutes = require("./routes/campgrounds"),
	commentRoutes    = require("./routes/comments"),
	authRoutes       = require("./routes/index");


mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb://localhost:27017/yelpcamp", {

    useNewUrlParser: true,

    useCreateIndex: true,

    useUnifiedTopology: true

});

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();// execute the function


// Passpost Configuration 
app.use(require("express-session")({
	
	secret: "Rusty is cute",
	
	resave: false,
	
	saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser= req.user;
	res.locals.error= req.flash("error");
	res.locals.success= req.flash("success");
	next();
})
 
///
app.use("/", authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);




app.listen(3000,function(){
	console.log("server is listening!!!!");
});