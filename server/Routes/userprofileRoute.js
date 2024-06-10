const userprofileController = require('../Controllers/userprofileController');
const express = require('express');
const app = express();
const router = express.Router();
const middleware = require('../middleware/authorization');



router.get('/profile', middleware.authorize, userprofileController.userinfo);
router.put('/profile/updateinfo', middleware.authorize, userprofileController.updateinfo);
router.put('/profile/updatepassword', middleware.authorize, userprofileController.updatepassword);
router.get('/profile/mycourses', middleware.authorize, userprofileController.mycourses);
module.exports = router;

