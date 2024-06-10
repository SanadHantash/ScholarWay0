const homeController = require('../Controllers/homeController');
const express = require('express');
const app = express();
const router = express.Router();
router.get('/home/allcourses', homeController.allcourses);

module.exports = router;