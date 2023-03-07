const express = require("express");
const HttpError = require("../models/http-error");
const placesControllers = require("../controllers/places-controller");

const router = express.Router();

router.get("/:placeId", placesControllers.getPlaceById);

router.get("/user/:userId", placesControllers.getUserById);

router.post("/", placesControllers.createPlace);

router.patch("/:placeId", placesControllers.updatePlaceById);

router.delete("/:placeId", placesControllers.deletePlace);

module.exports = router;
