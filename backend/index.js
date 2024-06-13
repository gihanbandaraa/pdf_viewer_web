require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connectionString);

const User = require("./models/user.model");


const express = require("express");
const cors = require("cors");
const app = express();

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");

app.use(express.json());

app.use(
    cors({
        origin: "*",
    }));

app.get("/", (req, res) => {
    res.json({ data: "hello" })
});



//Create Account
app.post("/create-account", async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName) {
        return res
            .status(400)
            .json({ error: true, message: "Full name is Required" })
    }
    if (!email) {
        return res
            .status(400)
            .json({ error: true, message: "Email is Required" })
    }
    if (!password) {
        return res
            .status(400)
            .json({ error: true, message: "Password name is Required" })
    }
    const isUser = await User.findOne({ email: email });

    if (isUser) {
        return res.json({
            error: true,
            message: "User already Exit",
        })
    }
    const user = new User({
        fullName,
        email,
        password,
    });

    await user.save();

    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "36000m",
    });

    return res.json({
        error: false,
        user,
        accessToken,
        message: "Registration Successful",
    })
});

//Login Process
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res
            .status(400)
            .json({ message: "Email is Required" })
    }
    if (!password) {
        return res
            .status(400)
            .json({ message: "Password name is Required" })
    }

    const userInfo = await User.findOne({ email: email });

    if (!userInfo) {
        return res.status(400).json({ message: "User not found" })
    }

    if (userInfo.email == email && userInfo.password == password) {
        const user = { user: userInfo };
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "36000m",
        });
        return res.json({
            error: false,
            message: "Login Successful",
            email,
            accessToken,
        });
    } else {
        return res.status(400).json({
            error: true,
            message: "Invalid Credintials",
        })
    }

});

//Get User
app.get("/get-user", authenticateToken, async (req, res) => {

    const { user } = req.user;

    const isUser = await User.findOne({ _id: user._id });
    if (!isUser) {
        return res.sendStatus(401)
    }
    return res.json({
        user: {
            fullName: isUser.fullName,
            email: isUser.email,
            "_id": isUser._id,
            createdOn: isUser.createdOn
        },
        message: "",
    })

})

app.listen(8000);

module.exports = app;