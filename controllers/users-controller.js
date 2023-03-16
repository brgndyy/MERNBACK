const uuid4 = require("uuid4");
const HttpError = require("../error/http-error");
const { validationResult } = require("express-validator");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.findAll({});
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later",
      500
    );

    return next(error);
  }

  res.json({ users: users });
};

const signUp = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invaild Inputs passed, please check your data.", 422)
    );
  }
  const { name, email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({
      where: {
        email: email,
      },
    });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );

    return next(error);
  }

  const createdUser = await User.create({
    name: name,
    email: email,
    image: req.file.path,
    password: password,
  });

  res.status(201).json({ user: createdUser });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({
      where: {
        email: email,
      },
    });
  } catch (err) {
    const error = new HttpError(
      "Logging up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      "Invalid credentails, could not log you in",
      401
    );
    return next(error);
  }

  res.json({ message: "Logged in!", user: existingUser });
};

exports.getUsers = getUsers;
exports.signUp = signUp;
exports.login = login;
