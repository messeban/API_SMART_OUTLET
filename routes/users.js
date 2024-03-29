const express = require("express");

const usersController = require("../controllers/users");
const authenticate = require("./../util/authenticate");
const router = express.Router();

// GET /feed/posts
router.get("/all" /*, authenticate.authenticateToken*/, usersController.getUsers);
router.get("/", authenticate.authenticateToken, usersController.getUser);
router.get("/outlets", authenticate.authenticateToken, usersController.getOutlets);
//router.get('/:id/locations', usersController.getLocations);
router.post("/create", usersController.addPersonalInfo);
router.post("/create/:id", usersController.addUser);

router.get("/locations", authenticate.authenticateToken, usersController.getLocations);
router.get("/rooms/:id", authenticate.authenticateToken, usersController.getRooms);

router.post("/addLocation", authenticate.authenticateToken, usersController.addLocation);
router.post( "/addRoom/:locationId", authenticate.authenticateToken, usersController.addRoom);

router.post("/token", usersController.getToken);
router.post("/login", usersController.login);
router.post("/logout", usersController.logout);

module.exports = router;
