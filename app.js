const express = require("express");
const bodyParser = require("body-parser");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");

const app = express();

app.set("port", process.env.PORT || 3000);

app.use(bodyParser.json());

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});
