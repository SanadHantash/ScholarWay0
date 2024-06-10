const db = require('../config');
const { admin, storage } = require('../firebase');
const Home = {};


Home.allcourses = async () => {
    try {
      const queryResult = await db.query(`
       SELECT 
        courses.id,
        courses.title,
        users.username,
        REPLACE(courses.image, 'https://storage.googleapis.com/scholarway-21a50.appspot.com/images/', '') AS image,
        courses.startdate,
        courses.enddate,
        courses.is_deleted
      FROM 
        courses
        INNER JOIN users ON users.id = courses.user_id
      WHERE 
      courses.is_deleted = false and current_timestamp < courses.enddate order by courses.create_at desc limit 12;
    `);
      
    const formattedResult = await Promise.all(
      queryResult.rows.map(async (row) => {
        if (row.startdate !== null) {
          row.startdate = row.startdate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });

          

          
          if (row.enddate !== null) {
            row.enddate = row.enddate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
          }
          
        }
    
        const imageRef = storage.bucket().file('images/' + row.image);
        const [url] = await imageRef.getSignedUrl({ action: 'read', expires: '01-01-2500' });
        row.image = url;
    
        return row;
      })
    );
  
      return formattedResult;
    } catch (err) {
      throw err;
    }
  };

  






module.exports = Home