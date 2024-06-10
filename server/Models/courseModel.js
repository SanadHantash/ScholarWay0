const db = require("../config");
const { admin, storage } = require("../firebase");
const Course = {};



Course.allcourses = async (page, pageSize) => {
  try {
    const offset = (page - 1) * pageSize;
    const queryString = `
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
        courses.is_deleted = false AND current_timestamp < courses.enddate
      ORDER BY 
        users.id 
      LIMIT $1 OFFSET $2;
    `;
    const params = [pageSize, offset];

    const { rows } = await db.query(queryString, params);
    const formattedResult = await Promise.all(
      rows.map(async (row) => {
        if (row.startdate !== null) {
          row.startdate = new Date(row.startdate).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        }

        if (row.enddate !== null) {
          row.enddate = new Date(row.enddate).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        }

        const imageRef = storage.bucket().file("images/" + row.image);
        const [url] = await imageRef.getSignedUrl({
          action: "read",
          expires: "01-01-2500",
        });
        row.image = url;
        return row;
      })
    );

    return formattedResult;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};




Course.alllessons = async (courseID) => {
  try {
    const result = await db.query(
      "SELECT lesson.id, lesson.title,  REPLACE(lesson.image, 'https://storage.googleapis.com/scholarway-21a50.appspot.com/images/', '') AS image FROM lesson INNER JOIN courses ON courses.id = lesson.course_id WHERE courses.id = $1 AND lesson.is_deleted = false limit 2;",
      [courseID]
    );

    const formattedResult = await Promise.all(
      result.rows.map(async (row) => {
        const imageRef = storage.bucket().file("images/" + row.image);
        const [url] = await imageRef.getSignedUrl({
          action: "read",
          expires: "01-01-2500",
        });
        row.image = url;

        return row;
      })
    );

    return formattedResult;
  } catch (err) {
    throw err;
  }
};
Course.alllessonsauth = async (courseID) => {
  try {
    const result = await db.query(
      "SELECT lesson.id, lesson.title,  REPLACE(lesson.image, 'https://storage.googleapis.com/scholarway-21a50.appspot.com/images/', '') AS image FROM lesson INNER JOIN courses ON courses.id = lesson.course_id WHERE courses.id = $1 AND lesson.is_deleted = false;",
      [courseID]
    );

    const formattedResult = await Promise.all(
      result.rows.map(async (row) => {
        const imageRef = storage.bucket().file("images/" + row.image);
        const [url] = await imageRef.getSignedUrl({
          action: "read",
          expires: "01-01-2500",
        });
        row.image = url;

        return row;
      })
    );

    return formattedResult;
  } catch (err) {
    throw err;
  }
};

Course.lessonpage = async (lessonID) => {
  try {
    const queryResult = await db.query(
      `
      SELECT 
        lesson.id,
        lesson.title,
        REPLACE(lesson.video, 'https://storage.googleapis.com/scholarway-21a50.appspot.com/videos/', '') AS video
      FROM lesson
      WHERE lesson.id = $1 and  lesson.is_deleted = false;
    `,
      [lessonID]
    );

    const formattedResult = await Promise.all(
      queryResult.rows.map(async (row) => {
        const videRef = storage.bucket().file("videos/" + row.video);
        const [url] = await videRef.getSignedUrl({
          action: "read",
          expires: "01-01-2500",
        });
        row.video = url;

        return row;
      })
    );
    return formattedResult;
  } catch (err) {
    throw err;
  }
};


Course.createcourse = async (
  title,
  description,
  startdate,
  enddate,
  imageUrl,
  teacherID
) => {
  const result = await db.query(
    "INSERT INTO courses (title,description,startdate,enddate,image,user_id)  VALUES ($1, $2, $3,$4,$5,$6)",
    [
      title,
      description,
      startdate,
      enddate,
      imageUrl,
      teacherID
     
    ]
  );
  return result.rows;
};

Course.updatecourse = async (
  courseID,
  title,
  description,
  startdate,
  enddate
) => {
  try {
    const result = await db.query(
      "UPDATE courses SET title = $2, description = $3,startdate = $4, enddate = $5 WHERE id = $1 RETURNING *",
      [courseID, title,description,startdate,enddate]
    );

    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

Course.deletecourse = async (courseID) => {
  try {
    const result = await db.query(
      "UPDATE courses SET is_deleted = TRUE  WHERE id = $1",
      [courseID]
    );
    return result.rows;
  } catch (err) {
    throw err;
  }
};


Course.createlesson = async (courseID, videoUrl, title,imageUrl) => {
  try {
    const result = await db.query(
      "INSERT INTO lesson (course_id,video,title,image) VALUES ($1, $2,$3,$4) RETURNING *",
      [courseID, videoUrl, title,imageUrl]
    );
    return result.rows[0];
  } catch (error) {
    console.log(error);
    return error;
  }
};

Course.detail = async (courseId) => {
  try {
    const queryResult = await db.query(
      `
        SELECT 
          courses.id,
          courses.title,
          courses.description,
          courses.startdate,
          courses.enddate
        FROM 
          courses
        WHERE 
          courses.id=$1 and courses.is_deleted = false;
      `,
      [courseId]
    );

    const formattedResult = await Promise.all(
      queryResult.rows.map(async (row) => {
        if (row.startdate !== null) {
          row.startdate = row.startdate.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
          });

          if (row.enddate !== null) {
            row.enddate = row.enddate.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
            });
          }
        }

        const imageRef = storage.bucket().file("images/" + row.image);
        const [url] = await imageRef.getSignedUrl({
          action: "read",
          expires: "01-01-2500",
        });
        row.image = url;
        return row;
      })
    );

    return formattedResult;
  } catch (err) {
    throw err;
  }
};


Course.countcourses = async () => {
  try {
    const result = await db.query(
      "select count(id) from courses where is_deleted = false and current_timestamp < courses.enddate"
    );
    return result.rows[0].count;
  } catch (err) {
    throw err;
  }
};


module.exports = Course;
