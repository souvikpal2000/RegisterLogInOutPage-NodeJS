const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log("MongoDB not Connected");
});