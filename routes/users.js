
const express = require('express');

const usersController = require('../controllers/users');

const router = express.Router();

// GET /feed/posts
router.get('/', usersController.getUsers);
router.get('/:id', usersController.getUser);
router.get('/:id/outlets', usersController.getOutlets);
//router.get('/:id/locations', usersController.getLocations);
router.post('/create', usersController.createAccount);

module.exports = router;