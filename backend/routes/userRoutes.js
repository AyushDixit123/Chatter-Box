const express = require('express');
const {protect} = require('../middleware/authMiddleware')
const { registerUser,authUser,allUsers }= require('../controllers/userControllers')
const router = express.Router();
// /Routers in Express are used to handle different endpoints of the application. You can think of a router as a mini-application that handles a specific part of the overall application.


//.post(registerUser): This specifies that the route should handle POST requests and that the function registerUser should be called when a POST request is made to this route.
router.route('/').post(registerUser).get(protect,allUsers)//first get req will pass throught protect middleware then function


//router.route('/login'): This defines a route handler for the /login URL of the router.
//.post(authUser): This specifies that the route should handle POST requests and that the function authUser should be called when a POST request is made to this route.
router.route('/login').post(authUser);



module.exports =router;