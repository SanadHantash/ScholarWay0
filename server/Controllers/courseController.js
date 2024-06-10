
const Course = require('../Models/courseModel.js');
const multer  = require('multer');
const path = require('path');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("image");
const videoupload = multer({ storage: storage }).single("video");
const uploads = multer({ storage: storage });
const { admin } = require("../firebase");
const { log } = require('console');

const allcourses = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 9;
      const courses = await Course.allcourses(page, pageSize);
      const totalCount = await Course.countcourses();
      const totalPages = Math.ceil(totalCount / pageSize);
      res.status(200).json({ success: true, courses, totalCount, totalPages });
     
     
    } 
    
    catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Error in getting courses' });
    }
  };

  
  
    const lessonpage = async (req, res) => {
      const lessonID = req.params.id;
    
      try {
        const course = await Course.lessonpage(lessonID);
        res.status(200).json({ success: true, course });
      } 
      
      catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Error in getting lesson' });
      }
    };
  

    const alllesons = async (req, res) => {
      try {
        const courseID = req.params.id;
      
        
          const lessons =  await Course.alllessons(courseID);
          res.status(201).json({ success: true, lessons });
        
      } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, error: err.message || 'Course registration failed' });
      }
    };
 
  

    const createcourse = async (req, res) => {
      try {
        const { role } = req.user;
 
    if (role !== 2 && role !== 'teacher') {
      return res.status(403).json({ success: false, message: 'Access denied. Only teachers are allowed.' });
    }
    
        upload(req, res, async function (err) {
          if (err) {
            return res.status(400).json({ success: false, error: err.message });
          }

          const teacherID = req.user.userId;
    
          const {
            title,
            description,
            startdate,
            enddate
          } = req.body;

          console.log("Received request body:", JSON.stringify(req.body, null, 2));
          
          const imageBuffer = req.file ? req.file.buffer : null;
    
          const imageUrl = await uploadImageToFirebase(imageBuffer);
    
         
          await Course.createcourse(
            title,
            description,
            startdate,
            enddate,
            imageUrl,
            teacherID
          );
    
          const created = await Course.createcourse(
            title,
            description,
            startdate,
            enddate,
            imageUrl,
            teacherID
          );

          console.log(created);
          res
            .status(201)
            .json({ success: true, message: "Course added successfully" });
        });
      } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, error: "Course added failed" });
      }
    };


    const uploadImageToFirebase = async (imageBuffer) => {
      const bucket = admin.storage().bucket();
    
      const folderPath = "images/";
    
      const uniqueFilename = "image-" + Date.now() + ".png";
    
      const filePath = folderPath + uniqueFilename;
    
      const file = bucket.file(filePath);
    
      await file.createWriteStream().end(imageBuffer);
    
      const imageUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
    
      return imageUrl;
    };


    const updatecourse = async (req, res) => {
      try {
        const { role } = req.user;
        if (role !== 2 && role !== 'teacher') {
          return res.status(403).json({ success: false, message: 'Access denied. Only teachers are allowed.' });
        }
    
        const { title, description, start_time, end_time } =
          req.body;
        const courseID = req.params.id;   
      
    
  
        const update = await Course.updatecourse(
          courseID,
          title,
          description,
          start_time,
          end_time
        );
    
     
        res
          .status(200)
          .json({ success: true, message: "course updated successfully" });
      } catch (error) {
        console.error("Error updating course:", error);
        res.status(500).json({ success: false, error: "Error updating course" });
      }
    };
    
    
    
    
    const deletecourse = async (req, res, next) => {
      try {
        const {  role } = req.user;
    
        if (role !== 2 && role !== 'teacher') {
          return res.status(403).json({ success: false, message: 'Access denied. Only teachers are allowed.' });
        }
    
        const courseID = req.params.id;
        await Course.deletecourse(courseID);
        res
          .status(200)
          .json({ success: true, message: "Course deleted successfully" });
      } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, error: "Course deleted failed" });
      }
    };
    

    const createlesson = async (req, res) => {
      try {
        const { role } = req.user;
    
        if (role !== 'teacher' && role!==2) {
          return res.status(403).json({ success: false, message: 'Access denied. Only admin users are allowed.' });
        }
    
        uploads.fields([{ name: 'video', maxCount: 1 }, { name: 'image', maxCount: 1 }])(req, res, async function (err) {
          if (err) {
            console.log(err);
            return res.status(400).json({ success: false, error: err.message });
          }
    
          const courseID = req.params.id;
          const { title } = req.body;
          const videoBuffer = req.files['video'] ? req.files['video'][0].buffer : null;
          const imageBuffer = req.files['image'] ? req.files['image'][0].buffer : null;
    
          const videoUrl = await uploadVideoToFirebase(videoBuffer);
          const imageUrl = await uploadImageToFirebase(imageBuffer);
          
          const result = await Course.createlesson(courseID, videoUrl, title, imageUrl);
    
          res.status(201).json({ success: true, message: "Lesson added successfully", data: result });
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
      }
    };
    
    
    const uploadVideoToFirebase = async (videoBuffer) => {
      const bucket = admin.storage().bucket();
      const folderPath = "videos/";
      const uniqueFilename = "video-" + Date.now() + ".mp4";
      const filePath = folderPath + uniqueFilename;
    
      const file = bucket.file(filePath);
      await file.createWriteStream().end(videoBuffer);
    
      const videoUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
      return videoUrl;
    };

    const detail = async (req, res) => {
      const courseId = req.params.id;
      try {
        const course = await Course.detail(courseId);
        res.status(200).json({ success: true, course });
      } 
      
      catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Error in getting course' });
      }
    };


    const alllesonsauth = async (req, res) => {
      try {
        const courseID = req.params.id;
      
        
          const lessons =  await Course.alllessonsauth(courseID);
          res.status(201).json({ success: true, lessons });
        
      } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, error: err.message || 'Course registration failed' });
      }
  };
module.exports = {
  allcourses,
    lessonpage,
    alllesons,
    createcourse,
    updatecourse,
    deletecourse,
    createlesson,
    detail,
    alllesonsauth
  };