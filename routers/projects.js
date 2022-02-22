const express = require('express');
const router = express.Router()
const Project = require('../models/leedprojectmodel');
const { isLoggedIn, isAuthor, validateProject } = require('../middleware/middleware')
const catchAsync = require('../utils/catchAsync')
const projects = require('../controllers/projects')
const { storage } = require('../cloudinary')         //node js look for index.js automatically 
const multer = require('multer') // v1.0.5
const upload = multer({ storage }) // for parsing multipart/form-data ，uploading file data

router.route('/')
    .get(catchAsync(projects.index))
    .post(isLoggedIn, upload.array('image'), validateProject, catchAsync(projects.createProject))


router.get('/new', isLoggedIn, projects.renderNewForm)

router.route('/:id')
    .get(catchAsync(projects.showProject))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateProject, catchAsync(projects.udpateProject))
    .delete(isLoggedIn, isAuthor, catchAsync(projects.destroyProject))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(projects.renderEditForm))

module.exports = router