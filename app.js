const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate =require("ejs-mate");
const wrapAsync = require("./utilis/wrapAsyc.js");
const ExpressError = require("./utilis/ExpressErro.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")))



app.get("/", (req, res) => {
  res.send("Hii , i am root");
});

// new create Route - must come before /listings/:id
app.get("/listings/new", wrapAsync((req, res) => {
  res.render("listings/new");
}));

// index route
app.get("/listings", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
}));

// show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show", { listing });
}));

// create Route

app.post("/listings", wrapAsync(async(req,res) =>{
    //let { title, description,image,price,country,location} = req.body;
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings"); 
}))

// Edite Route
app.get("/listings/:id/edit", wrapAsync(async(req,res) =>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

// upadte route 
app.put("/listings/:id", wrapAsync(async (req,res) =>{
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//Delete Route 
app.delete("/listings/:id", wrapAsync(async(req,res) =>{
  let {id} =req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings")
}));

app.use((req,res,next) =>{
  next(new ExpressError(404 , "Page Not Found!"));
});

app.use(( err, req ,res , next) =>{
  let {statusCode=505,message = "Something went wrong"} = err; 
  res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log("server is listening to post 8080");
});
