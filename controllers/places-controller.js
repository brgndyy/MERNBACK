const HttpError = require("../error/http-error");
const uuid = require("uuid4");
const { validationResult } = require("express-validator");
const getCoordsForAddress = require("../util/location");
const { Place } = require("../models");

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: "20 W 34th St, New York, NY 10001",
    creator: "u1",
  },
];

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.placeId;
  let place;
  try {
    place = await Place.findOne({
      where: {
        place_id: placeId,
      },
    });
  } catch (err) {
    return next(err);
  }

  if (!place) {
    const error = new HttpError(
      "Could not find a place for the provided id.",
      404
    );

    return next(error);
  }

  res.json({ place: place });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.userId;
  let places;

  try {
    places = await Place.findOne({
      where: {
        creator: userId,
      },
    });
  } catch (err) {
    const error = new HttpError(
      "Fetching places failed, please try again later.",
      500
    );

    return next(err);
  }

  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find a place for the provided user id.", 404)
    );
  }

  res.json({ places: places });
};

const createPlace = async (req, res, next) => {
  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (err) {
    console.error(err);
    next(err);
  }

  const newPlace = await Place.create({
    place_id: uuid(),
    title: req.body.title,
    description: req.body.description,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/400px-Empire_State_Building_%28aerial_view%29.jpg",
    lat: coordinates.lat,
    lng: coordinates.lng,
    creator: req.body.creator,
    address: address,
  });

  res.status(201).json({ place: newPlace });
};

const updatePlaceById = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return new HttpError("Invaild Inputs passed, please check your data.", 422);
  }
  const { title, description } = req.body;
  const placeId = req.params.placeId;

  let place;
  try {
    place = await Place.findOne({
      where: {
        place_id: placeId,
      },
    });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, Could not update place",
      500
    );
    return next(err);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place",
      500
    );

    return next(err);
  }

  res.status(200).json({ place: place });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.placeId;

  let place;

  try {
    place = await Place.findOne({
      where: {
        place_id: placeId,
      },
    });
    await place.destroy();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted place." });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlace = deletePlace;
