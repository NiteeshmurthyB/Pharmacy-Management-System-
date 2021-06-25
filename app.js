const express = require("express");
const mongoose = require("mongoose");
const app = express();
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const bodyParser = require("body-parser");
const passportConfig = require("./config-files/passport-config");
const bcrypt = require("bcryptjs");
const methodOverride = require("method-override");
const Stock = require("./models/stock");
const Presc = require("./models/presc");
const { find } = require("./models/user");

app.set("view engine","ejs");
//app.set("view engine","html");
//Passport config
app.use(require("express-session")({
    secret: " abc ",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 6000000,
    },
}));

app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);


//Use body parser
//Used to extract data from the form
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))


//Connect to the database (locally)
mongoose
    .connect("mongodb://localhost:27017/pharmacy", {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify:false
    })
    .then(() => {
        console.log("Connected to Mongo");
    })
    .catch((err) => {
        console.log("Problem with the database !!");
    });


//Serve the public directory
app.use(express.static("public"));
app.use(methodOverride("_method"));



//Routes

app.get("/",function(req,res){
    res.render("welcomepage.ejs");

})

app.get("/welcomepage",function(req,res){
    res.render("welcomepage.ejs");

})
app.get("/forgotpass", function (req, res) {
    res.render("forgotpass.ejs", {});
});


//check logged in or not
function isLoggedin(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


//Authentication routes

//Register user

//Show register page
app.get("/adduser",isLoggedin, function (req, res) {
    res.render("adduser.ejs");
});



//Register logic
app.post("/adduser", isLoggedin,function (req, res) {

    const {
        email,
        position,
        firstName,
        lastName,
        mobileNumber,
        address,
        password
    } = req.body;

    User.findOne({
            email: email
        })
        .then(user => {
            //user already exists
            if (user) {
                res.render("/adduser");
            } else {
                const newUser = new User({
                    email,
                    password,
                    firstName,
                    lastName,
                    mobileNumber,
                    address,
                    position
                });


                //Hash the password for security
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;

                        //set Password to hash
                        newUser.password = hash;
                        newUser.save();
                        res.redirect("/viewuser");
                    })
                });

            }
        }).catch(err => res.render("/adduser"));


});


//login 
//show login page
app.get("/login", function (req, res) {
    res.render("login.ejs", {});
});

//login logic
app.post("/login", function (req, res) {
    const pos = req.body.position;
    passport.authenticate("local", {
        successRedirect: "/welcome/" + pos,
        failureRedirect: "/login"
    })(req, res);
})

;

//logout logic
app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/login");
})


//Handle Landing page
app.get("/welcome/:pos",isLoggedin, function (req, res) {
    if (req.params.pos === "Manager") {
        Stock.find({}, function (err, adduser) {
            if (err) {
                console.log(err);
            } else
                res.render("managerLanding.ejs", {
                    foundusers: adduser
                });
            console.log("page rendered");
        });
    } else if (req.params.pos === "Pharmacist") {
        return res.render("pharmacistLanding.ejs");
    } else return res.render("cashierLanding.ejs");

})


app.get("/managerLanding",isLoggedin, function(req,res){
    Stock.find({}, function (err, adduser) {
        if (err) {
            console.log(err);
        } else
            res.render("managerLanding.ejs", {
                foundusers: adduser
            });
        console.log("page rendered");
    });
})

app.get("/pharmacistLanding",isLoggedin,function(req,res){
    res.render("pharmacistLanding.ejs")
})


app.get("/cashierLanding",isLoggedin,function(req,res){
    res.render("cashierLanding.ejs")
})

app.get("/welcome/Manager",isLoggedin,function(req,res){
    res.render("managerLanding.ejs")
})


//view user get route
app.get("/viewuser",isLoggedin, function (req, res) {
    User.find({}, function (err, adduser) {
        if (err) {
            console.log(err);
        } else
            res.render("viewuser.ejs", {
                foundusers: adduser
            });
        console.log("page rendered");
    });
});

//view user post route
app.post("/viewuser",isLoggedin, function (req, res) {
    adduser.find({}, function (err, adduser) {
        if (err) {
            console.log(err);
        } else
            res.render("viewuser.ejs", {
                foundusers: adduser
            });
        console.log("page rendered");
    });
});


app.get("/viewStock/:id/edit", async(req,res) =>{
    const foundStock = await Stock.findById(req.params.id)
    res.render("editStock",{foundStock})
})

app.put('/viewStock/:id',async(req,res) =>{
    const _id = req.params.id;
    const foundStock = await Stock.findByIdAndUpdate(_id,req.body);
    res.redirect('/viewStock')
    
})

//Delete user


app.delete("/viewStock/:id", function(req,res){
    console.log(req.params.id);
Stock.findByIdAndDelete(req.params.id, function(err){
    if(err) console.log(err);
    else{
    } res.redirect("/viewStock");
})
})

app.delete("/:id", function(req,res){
    console.log(req.params.id);
    User.findByIdAndDelete(req.params.id, function(err){
        if(err) console.log(err);
        else{
        } res.redirect("/viewuser");

    })

    
})





app.get("/manage",isLoggedin, function (req, res) {
    res.render("manage.ejs");
});

//Dashboard page
app.get("/dashboard",isLoggedin,function(req, res){
    res.render("dashboard.ejs")
});

//new prescriiption page
app.get("/newprescription",isLoggedin, function (req, res) {
    res.render("newprescription.ejs", {});
});

app.post("/newprescription",isLoggedin, (req,res)=>{
    Presc.create(req.body, (err,newPresc)=>{
        if(err) console.log(err);
        else res.redirect("/viewPresc");
    })
})

app.get("/viewPresc",isLoggedin, function(req,res){
    Presc.find({}, function(err,newPresc){
        if(err) {console.log(err);
        }        
        else  res.render("viewPresc.ejs",
         {foundPresc: newPresc
        });

    })
   
})


//Stock Enrty page
app.get("/stockentry",isLoggedin, function(req, res){
    res.render("newStock.ejs")
});

//Hanle stock entery
app.post("/stockentry",isLoggedin, (req,res)=>{
    Stock.create(req.body, (err,newStock)=>{
        if(err) console.log(err);
        else res.redirect("/viewstock");
    })
})




//View stock
app.get("/viewStock",isLoggedin, function(req,res){
    Stock.find({}, function(err,adduser){
        if(err) {console.log(err);
        }        
        else  res.render("viewStock.ejs",
         {foundStock: adduser
        });

    })
   
})

app.post("/viewStock",isLoggedin, function (req, res) {
    adduser.find({}, function (err, adduser) {
        if (err) {
            console.log(err);
        } else
            res.render("viewStock.ejs", {
                foundStock: adduser
            });
        console.log("page rendered");
    });
});

app.post("/test",function(req,res){
    const mname = req.body.total;
    console.log(mname);
    res.redirect("/billing");

})


//billing page
app.get("/billing",isLoggedin, function (req, res) {
   //res.sendFile(__dirname +'/views/pdf.html')
   Stock.find({},function(err,foundstocks){
    res.render("pdf.ejs",{foundstock:foundstocks});
   })
   
});

//app.get("/billing",isLoggedin, function(req,res){
  //  Stock.find({}, (err,foundStock)=>{
    //    if(err) console.log(err);
      //  else  res.render("bill1.ejs", {foundStock: foundStock});

    //})
   
//})

app.get("/about", function (req, res) {
    res.render("about.ejs", {});
});

app.listen(2000, function () {
    console.log("server started");
});