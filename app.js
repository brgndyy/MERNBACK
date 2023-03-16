const express = require("express");
const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const { sequelize } = require("./models");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const session = require("express-session");
const path = require("path");
const fs = require("fs");

const app = express();

app.set("port", process.env.PORT || 3000);

app.use(morgan("dev"));

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터 베이스 연결 성공.");
  })
  .catch((err) => {
    console.error(err);
  });
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "Cookie",
    cookie: {
      httpOnly: true,
      secure: false,
    },
    name: "session-cookie",
  })
);
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});
