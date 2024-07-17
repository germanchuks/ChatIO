const UserSchema = require('../models/userModel');
const { comparePassword, hashPassword } = require('../utils/auth')
const jwt = require('jsonwebtoken');


// User Registration EndPoint
exports.registerUser = async (req, res) => {
    try {
        const { username, password, email } = req.body
        // Check is username exists
        if (!username) {
            return res.json({
                error: 'Username is required'
            })
        }

        // Check is password exists and has mininum of 6 characters
        if (!password || password.length < 6) {
            return res.json({
                error: 'Password is required and should be at least 6 characters long'
            })
        }

        // Check if user already exists
        const user = await UserSchema.findOne({ email });
        if (user) {
            return res.json({
                error: 'Email is taken'
            })
        }

        // Hash password
        const hashedPassword = await hashPassword(password)

        // Create user in database
        const newUser = await UserSchema.create({
            username,
            password: hashedPassword,
            email,
        })

        return res.json(newUser)
    } catch {
        res.json({
            error: "Could not complete registration. Try again later."
        })
    }
}


// Login Endpoint
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email is entered
        if (!email) {
            return res.json({
                error: 'Email is required'
            })
        }

        // Check if password is entered
        if (!password) {
            return res.json({
                error: 'Enter password'
            })
        }

        //Check if user exists
        const user = await UserSchema.findOne({ email }).select("+password")
        if (!user) {
            return res.json({
                error: 'User does not exists!'
            })
        }

        // Compare passwords
        const isMatch = await comparePassword(password, user.password)

        if (!isMatch) {
            return res.json({
                error: 'Incorrect password'
            })
        }

        // Login sccessful
        if (isMatch) {
            // Send token to track user session
            const secret = process.env.ACCESS_TOKEN_SECRET
            const payload = {
                id: user._id,
                email: user.email,
                username: user.username,
            }

            const { id, email, username, theme, recentInteractions } = user

            jwt.sign(payload, secret, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json({
                    id: id,
                    email: email,
                    username: username,
                    theme: theme,
                    recentInteractions: recentInteractions
                })
            })
        }
    } catch {
        res.json({
            error: 'Server Error'
        })
    }

}


// Logout
exports.logoutUser = (req, res) => {
    res.clearCookie("token", {
        sameSite: "none",
        secure: true
    }).json('Logged out')
}

// Get user
exports.getUser = async (req, res) => {
    const { token } = req.cookies

    // Verify token exists in request header and is valid.
    if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {}, (err, user) => {
            if (err) throw err;
            const { id, email, username, theme, recentInteractions } = user
            res.json({
                id: id,
                email: email,
                username: username,
                theme: theme,
                recentInteractions: recentInteractions
            })
        })
    } else {
        res.json(null)
    }
}
