require("./db/conn");
const path = require("path");
const express = require("express");
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const cookieParser = require('cookie-parser')
const {User,Token} = require("./models/employee");
const auth = require("./middleware/auth");
const app = express();

const staticPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialPath = path.join(__dirname, "../templates/partials");

app.use(express.static(staticPath));
app.set("views", viewsPath);
app.set("view engine", "hbs");
hbs.registerPartials(partialPath);
app.use(express.json());
app.use(express.urlencoded({ extended:false }));
app.use(cookieParser());

app.get("/", (req,res) => {
    res.render("index");
});

app.get("/secret", auth, async (req,res) => {
    try{
        //console.log(`Cookies : ${req.cookies.jwt}`);
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        const userData = await User.findOne({_id:verifyUser._id});
        res.render("secret", {message: `Hi ${userData.email}, Logged In`});
    }catch(err){
        console.log(err);
    }
});

app.get("/logout", auth, async(req,res) => {
    try{    
        res.clearCookie("jwt");    
        res.render("logout", {message:"Successfully Logged Out"});
    } catch (err) {
        res.status(500).send(err);
    }
})

app.post("/", async (req,res) => {
    try{
        if(req.body.password != req.body.conPassword)
        {
            return res.render("index", { message: "Password doesn't match"});
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const register = new User({
            firstname: req.body.firstName,
            lastname: req.body.lastName,
            email: req.body.email,
            gender: req.body.gender,
            phone: req.body.phone,
            age: req.body.age,
            password: hashedPassword,
        });

        const registerUser = await register.save();
        console.log(registerUser);
        res.status(201).render("index", {message: "User Registered"});
    }
    catch (err) {
        console.log(err);
        res.status(400).render("index", {message: "Email or Phone No. is already Registered"});
    }
});

app.get("/login", (req,res) => {
    res.render("login");
});

app.post("/login", async (req,res) => {
    try{
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({email:email});
        const check = await bcrypt.compare(password, userData.password);
        
        if(check == true){
            const token = await jwt.sign({ _id: userData._id }, process.env.SECRET_KEY);
            const newToken = new Token({
                token:token
            });
            userData.tokens[0] = newToken;
            userData.save();

            res.cookie("jwt", token, { expires:new Date(Date.now() + 100000), httpOnly:true });
            return res.status(201).render("index");
        }
        res.render("login", {message: "Incorrect Password"});
    }catch(err){
        res.status(400).render("login", {message: "Invalid Email"});
    }
});

app.get("/delete", (req,res) => {
    User.deleteMany().then(() => {
        res.send("All User Deleted");
    })
    .catch((err) => {
        console.log(err);
    });
});

const port = process.env.PORT || 3000;
app.listen(port, (err) => {
    if(err){
        console.log("Something went Wrong");
    }else{
        console.log(`Server Listening at port ${port}`);
    }
})