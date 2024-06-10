const db = require("../config");
const User = {};

User.checkUserExistence = async (email, username) => {
  const checkEmail = await db.query("SELECT * FROM users WHERE email = $1;", [
    email,
  ]);
  const checkUsername = await db.query(
    "SELECT * FROM users WHERE username = $1;",
    [username]
  );


  if (checkEmail.rows.length > 0) {
    throw new Error("invalid email");
  }
  if (checkUsername.rows.length > 0) {
    throw new Error("invalid username");
  }

  return true;
};
User.register = async (
  username,
  email,
  hashPassword,
role_id
) => {
  try {
    const result = await db.query(
      "INSERT INTO users(username, email, password,role_id) VALUES($1, $2, $3, $4) RETURNING *",
      [username, email, hashPassword,role_id]
    );
    console.log(result);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};




User.login = async (email) => {
  try {
    const user = await db.query(
      "SELECT users.id, email,username,password, roles.role  FROM users inner join roles on roles.id = users.role_id WHERE email = $1 And users.is_deleted= false;",
      [email]
    );
    if (user.rows[0]) {
      return user.rows[0];
    } else {
      return "Email not found or user is deleted.";
    }
  } catch (error) {
    throw error;
  }
};










module.exports = User;
