const courseController = require('../Controllers/courseController');
const express = require('express');
const app = express();
const router = express.Router();
const middleware = require('../middleware/authorization');

router.get('/course/allcourses',courseController.allcourses);
router.get('/course/:id/allessons',courseController.alllesons);
router.get('/course/:id/allessonsauth', middleware.authorize,courseController.alllesonsauth);
router.get('/course/lesson/:id', courseController.lessonpage);
router.post("/course/createcourse",middleware.authorize, courseController.createcourse);
router.put("/course/updatecourse/:id", middleware.authorize,courseController.updatecourse);
router.put("/course/deletecourse/:id", middleware.authorize,courseController.deletecourse);
router.post("/course/createlesson/:id",middleware.authorize, courseController.createlesson);
router.get('/course/detail/:id', courseController.detail);
module.exports = router;