const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");


const port = 8080;


const cookieParser = require("cookie-parser");
const courseRouter = require("./Routes/courseRoutes");
const userRouter = require("./Routes/userRoutes");
const homeRouter = require("./Routes/homeRoute");
const userprofileRouter = require("./Routes/userprofileRoute");
app.use(session({ secret: "cats", resave: true, saveUninitialized: true }));

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use(cookieParser());
app.use(userRouter);
app.use(courseRouter);
app.use(homeRouter);
app.use(userprofileRouter);


app.listen(port, () => {
  console.log(`server runnning in port ${port}`);
});
