const HttpError = require("../error/http-error");
const uuid = require("uuid4");
const { validationResult } = require("express-validator");
const getCoordsForAddress = require("../util/location");
const { Place, User } = require("../models");
const fs = require("fs");

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.placeId;
  let place;

  try {
    place = await Place.findOne({
      where: {
        id: placeId,
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
    places = await Place.findAll({
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

  console.log(places[0].dataValues);

  res.json({ places: places });
};

const createPlace = async (req, res, next) => {
  let coordinates;
  let { title, description, address, id } = req.body;
  try {
    coordinates = await getCoordsForAddress(address);
    const user = await User.findOne({
      include: [
        {
          model: Place,
          where: {
            id: id,
          },
        },
      ],
    });

    const newPlace = await Place.create({
      place_id: uuid(),
      title,
      description,
      image: req.file.path,
      lat: coordinates.lat,
      lng: coordinates.lng,
      creator: req.userData.userId,
      address,
    });

    res.status(201).json({ place: newPlace });
  } catch (err) {
    const error = new HttpError(
      "Creating place failed, please try again.",
      500
    );

    return next(err);
  }
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
        id: placeId,
      },
    });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, Could not update place",
      500
    );
    return next(error);
  }

  if (place.creator !== req.userData.userId) {
    const error = new HttpError("You are not allowed to edit this place.", 401);
    return next(error);
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
  console.log("placeId : ", placeId);
  // const { id } = req.body;

  let place;
  // let filtredPlaces;
  let imagePath;
  try {
    place = await Place.findOne({
      where: {
        id: placeId,
      },
    });
    imagePath = place.image;

    await place.destroy();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place.",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError("Could not find place for this id", 404);
    return next(error);
  }

  if (place.creator !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to delete this place.",
      401
    );
    return next(error);
  }

  fs.unlink(imagePath, (err) => {
    console.log(err);
  });
  res.status(200).json({ message: "Deleted place." });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlace = deletePlace;
