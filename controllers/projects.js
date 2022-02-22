const Project = require('../models/leedprojectmodel')
const { cloudinary } = require('../cloudinary/index')
const mbxStyles = require('@mapbox/mapbox-sdk/services/Geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoding = mbxStyles({ accessToken: mapBoxToken });

module.exports.index = async (req, res, next) => {
    if (req.session.views) {
        req.session.views++
    } else {
        req.session.views = 1
    }

    projects = await Project.find({}).exec()
    res.render('projects/index', { projects, views: req.session.views })
}

module.exports.renderNewForm = (req, res) => {
    res.render('projects/new')
}

module.exports.createProject = async (req, res, next) => {
    const images = req.files.map(obj => ({ url: obj.path, filename: obj.filename }))
    const project = req.body.project;
    const geoData = await geoCoding.forwardGeocode({
        query: project.location,
        limit: 1
    }).send()
    project.images = images
    project.author = req.user._id
    project.geometry = geoData.body.features[0].geometry
    const newProject = new Project(project)
    await newProject.save()
    console.log(newProject)
    req.flash('success', 'Successfully added a new project')
    res.redirect('/projects')

}

module.exports.showProject = async (req, res, next) => {
    const { id } = req.params
    const project = await Project.findById(id)
        .populate({
            path: 'reviews',
            populate: { path: 'author' }
        })
        .populate('author').exec()
    if (project) {
        res.render('projects/show', { project })
    } else {
        req.flash('error', 'Can not find the project')
        res.redirect('/projects')
    }
}

module.exports.renderEditForm = async (req, res, next) => {
    const { id } = req.params
    const projectToUpdate = await Project.findById(id).exec()
    if (projectToUpdate) {
        res.render('projects/edit', { projectToUpdate })
    } else {
        req.flash('error', 'Can not find the project')
        res.redirect('/projects')
    }

}

module.exports.udpateProject = async (req, res, next) => {
    const projectParams = req.body.project
    const imagesToDelete = req.body.imagesToDelete
    const imgs = req.files.map(e => ({ url: e.path, filename: e.filename }))
    const { id } = req.params
    const project = await Project.findByIdAndUpdate(id, { ...projectParams }).exec();         //SPREAD THE PROJECT
    project.images.push(...imgs);
    if (imagesToDelete) {
        const query = { images: { filename: { $in: imagesToDelete } } }
        console.log(query)
        await project.updateOne({ $pull: query })        //delete images in mongo database. 
        for (let image of imagesToDelete) {
            cloudinary.uploader.destroy(image)         //delete images in cloudinary
        }
    }
    await project.save()
    req.flash('success', 'Successfully updated a new project')
    res.redirect(`/projects/${id}`)
}

module.exports.destroyProject = async (req, res, next) => {
    const { id } = req.params;
    await Project.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted a new project')
    res.redirect('/projects')
}