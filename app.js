const express = require("express");
const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const { sequelize } = require("./models");
const morgan = require("morgan");
const session = require("express-session");

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

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});
