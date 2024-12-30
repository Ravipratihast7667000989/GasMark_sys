const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('./model');
const router = express.Router();
const multer = require('multer');
const Image = require('./imagemodel'); 
const UserRegistration = require('./model');
const Usercareer = require('./career_model');
const UserPersonal = require('./personal_model');
const UserSocial =require('./social_model');
const profileImage = require('./imagemodel');


// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';


// matches male

router.get('/matchMale', async function(req,res){
    var matchResult= await UserPersonal.find({
        gender:matchResult === 'Male'?'Female':'Male',

    });
    res.json(matchResult);
});
// matches female

router.get('/matchfemale', async function(req,res){
    var matchResult= await UserPersonal.find({
        gender:matchResult === 'Female'?'Male':'Female',
        

    });
    res.json(matchResult);
});



// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null,Date.now() +'__' + file.originalname);
    },
});

// Initialize multer
const upload = multer({ storage });

// POST route to upload an image
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image uploaded' });
        }

        const image = new Image({
            imageUrl: req.file.filename, 
        });

        await image.save();

        res.status(200).json({
            message: 'Image uploaded successfully',
            image,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading image', error: error.message });
    }
});

module.exports = router;


//Image fetch
router.get('/search/image', async function(req,res){
    var PersonalResult= await Image.find();
    res.json(PersonalResult);
});
//Personal details
router.get('/search/personal', async function(req,res){
    var PersonalResult= await UserPersonal.find();
    res.json(PersonalResult);
});
//Career details
router.get('/search/career', async function(req,res){
    var CareerResult= await Usercareer.find();
    res.json(CareerResult);
});
//Social details
router.get('/search/social', async function(req,res){
    var SocialResult= await UserSocial.find();
    res.json(SocialResult);
});
router.get('/search/register', async function(req,res){
    var LoginResult= await UserRegistration.find();
    res.json(LoginResult);
});

// Register a new user
router.post('/register', async (req, res) => {
    try {
        const {fullname,email, password,mobilenumber} = req.body;

        // Check for missing fields
        if (!fullname ||!email ||!password ||!mobilenumber ) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user
        const user = new User({ fullname,email,password,mobilenumber});
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate JWT
        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({
            message: 'Login successful',
            token,
            user: { id: user._id,  email: user.email },
        });
        
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

// Career details
router.post('/register/career', async (req, res) => {
    try {
        const {highesteducation,employedIn, occupation,income} = req.body;

        // Check for missing fields
        if (!highesteducation ||!employedIn ||!occupation ||!income ) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if the user already exists
        // const existingUser = await User.findOne({ email });
        // if (existingUser) {
        //     return res.status(400).json({ message: 'User already exists' });
        // }

        // Create a new user
        const user = new Usercareer({ highesteducation,employedIn,occupation,income});
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

// Personal details
router.post('/register/personal', async (req, res) => {
    try {
        const {gender,dob, height,country,city,residentialStatus} = req.body;

        // Check for missing fields
        // if (!highesteducation ||!employedIn ||!occupation ||!income ) {
        //     return res.status(400).json({ message: 'All fields are required' });
        // }

        // Check if the user already exists
        // const existingUser = await User.findOne({ email });
        // if (existingUser) {
        //     return res.status(400).json({ message: 'User already exists' });
        // }

        // Create a new user
        const user = new UserPersonal({ gender,dob, height,country,city,residentialStatus});
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

// Social details
router.post('/register/social', async (req, res) => {
    try {
        const {maritalstatus,havechildren, mothertongue,religion,horoscopemustformarriage,manglik} = req.body;


        // Create a new user
        const user = new UserSocial({maritalstatus,havechildren, mothertongue,religion,horoscopemustformarriage,manglik});
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

module.exports = router;
