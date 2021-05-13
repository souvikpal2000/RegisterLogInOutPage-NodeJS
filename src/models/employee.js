const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const tokenSchema = new mongoose.Schema({
    token:{
        type: String,
        required: true
    }
});

const employeeSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    tokens: [tokenSchema]
});



/*employeeSchema.methods.generateAuthToken = async function(){
    try{
        const token = await jwt.sign({_id:this._id}, "mynameisSouvikPalDeveloper");
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    }
    catch(err){
        console.log(err);
    }
}*/

const user = new mongoose.model("user", employeeSchema);
const token = new mongoose.model("token",tokenSchema);

module.exports.User = user;
module.exports.Token = token;