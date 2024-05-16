require('dotenv').config(); //this is the connection setup for mongodb
const User = require('./models/user'); // Replace './models/User' with the actual path to your User model


const express = require('express');
const path = require('path');
const cors = require('cors');
const Joi = require('joi');
const { Console } = require('console');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3001;

let registrations = [];

// Middleware to parse JSON and urlencoded form data
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.DB_CONNECTION_STRING)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error:',err))

.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

  

  
// Joi Schema Definition
const registrationSchema= Joi.object({
    fname: Joi.string().required(),
    lname: Joi.string().required(),
    sex: Joi.string().valid('male', 'female', 'other').required(),
    age: Joi.number().integer().min(0).required(),
    email: Joi.string().email().required(),
    nationality: Joi.string().required(),
    number: Joi.string().length(10).pattern(/^[0-9]+$/).required()
});    

// Content Security Policy
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy",
    "default-src 'self';" +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com https://maps.gstatic.com;" +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;" +
    "img-src 'self' data: https://maps.googleapis.com https://maps.gstatic.com;" +
    "font-src 'self' https://fonts.gstatic.com;" +
    "frame-src 'self' https://www.google.com/maps/embed/;" + // Correct directive to allow Google Maps iframe
    "connect-src 'self';");
    next();
});    

// Serve static files from the 'frontend' directory
app.use(express.static(path.join(__dirname, '../frontend',)));


// Routes
// Registration endpoint
app.post('/api/register', async (req, res) => {
    // Validate the incoming data with Joi
    const { error } = registrationSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        const user = new User(req.body);
        await user.save();
        
        // Redirect to 'about.html' after successful registration
        return res.redirect('/about.html');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering the user.' });
    }
});

    




// Route to retrieve all registrations
app.get('/api/registrations', (req, res) => {
    res.status(200).json(registrations);
});

app.post('/api/contact', (req, res) => {
    // Here, you'd handle the contact form data. For example, you could save it to a database or send an email.
    const { name, email, message } = req.body;    
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Message:', message);
    res.status(200).send('Contact form submitted successfully');
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
