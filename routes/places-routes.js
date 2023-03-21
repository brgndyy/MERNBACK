const express = require("express");
const { check } = require("express-validator");
const HttpError = require("../error/http-error");
const placesControllers = require("../controllers/places-controller");
const fileUpload = require("../middleware/file-upload");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

router.get("/:placeId", placesControllers.getPlaceById);

router.get("/user/:userId", placesControllers.getPlacesByUserId);

// 위의 2개의 get 요청에는 로그인을 안해도 볼수있는 부분이기때문에 미들웨어를 연결해놓지 않는다.

router.use(checkAuth);

router.post(
  "/",
  fileUpload.single("image"),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  placesControllers.createPlace
);

router.patch(
  "/:placeId",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],

  placesControllers.updatePlaceById
);

router.delete("/:placeId", placesControllers.deletePlace);

module.exports = router;
