const Home = require('../Models/homeModel.js');

const allcourses = async (req, res, next) => {

    try {
      const courses = await Home.allcourses();
      res.status(200).json({ success: true, courses });
    } 
    
    catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Error in getting courses' });
    }
  };


  module.exports = {
    allcourses
  }