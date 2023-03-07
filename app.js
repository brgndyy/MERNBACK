const express = require("express");
const bodyParser = require("body-parser");

const placesRoutes = require("./routes/places-routes");

const app = express();

app.set("port", process.env.PORT || 3000);

app.use(bodyParser.json());

app.use("/api/places", placesRoutes);

app.use((req, res, next, error) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "And unknown error occured!" });
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});
