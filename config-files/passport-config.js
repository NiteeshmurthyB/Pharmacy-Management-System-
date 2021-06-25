const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

//Function to set up passport for Customer model
async function passportConfig(passport){
    passport.serializeUser((user, done)=>{
        done(null,  user.id);
    });

    passport.deserializeUser((id,done)=>{
        User.findById(id, (err,user)=>{
            done(err, user);
        })
    });


    await passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done)=>{
            //Find customer
            User.findOne({email:email})
                .then(user=>{
                    if(!user){
                        //No Customer found
                        return done(null, false, {message : "User not found"})
                    }

                    //User exists
                    //Match password
                    bcrypt.compare(password, user.password, (err,isMatch)=>{
                        if(err) throw err;

                        if(isMatch){
                            //Matched
                            return done(null, user );
                        }

                        else{
                            //Wrong Password
                            return done(null, false, {message: "Password does not match"});
                        }
                    })
                }).catch(err=> console.log(err))
        })
    )

}

module.exports = passportConfig;