const { application } = require("express");
const db = require("../config");

const { storage } = require("../firebase");

const Profile = {};

Profile.userinfo = async (userID) => {
  try {
    const result = await db.query(
      "SELECT *,  roles.role FROM users INNER JOIN roles ON users.role_id = roles.id WHERE users.id = $1 and users.is_deleted = false;",
      [userID]
    );

    return result.rows;
  } catch (err) {
    throw err;
  }
};

Profile.checkUserExistence = async (email, username, userID) => {
  if (email) {
    const checkEmail = await db.query(
      "SELECT * FROM users WHERE email = $1 AND id <> $2;",
      [email, userID]
    );
    if (checkEmail.rows.length > 0) {
      throw new Error("invalid email");
    }
  }

  if (username) {
    const checkUsername = await db.query(
      "SELECT * FROM users WHERE username = $1 AND id <> $2;",
      [username, userID]
    );
    if (checkUsername.rows.length > 0) {
      throw new Error("invalid username");
    }
  }
  return true;
};

Profile.updateinfo = async (userID, username, email) => {
  try {
    const query =
      "UPDATE users SET username = $2, email = $3  WHERE id = $1";
    const result = await db.query(query, [userID, username, email]);

    return result.rows;
  } catch (err) {
    console.error("Error updating user info:", err);
    throw err;
  }
};

Profile.updatepassword = async (userID, hashedPassword) => {
  const result = await db.query(
    "update users set password = $2 where id = $1",
    [userID, hashedPassword]
  );
  return result.rows;
};

Profile.mycourses = async (userID) => {
  try {
    const queryResult = await db.query(
      `
      SELECT 
      courses.id,
courses.title,
REPLACE(courses.image, 'https://storage.googleapis.com/scholarway-21a50.appspot.com/images/', '') AS image,
courses.startdate,
courses.enddate
FROM 
courses
WHERE 
courses.is_deleted = false
AND courses.user_id = $1;
    `,
      [userID]
    );

    const formattedResult = await Promise.all(
      queryResult.rows.map(async (row) => {
        if (row.startdate !== null) {
          row.startdate = row.startdate.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          if (row.enddate !== null) {
            row.enddate = row.enddate.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
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

module.exports = Profile;
