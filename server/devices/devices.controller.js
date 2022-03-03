const express = require('express')
const router = express.Router()
const Joi = require('joi')
const validateRequest = require('_middleware/validate-request')
const authorize = require('_middleware/authorize')
const Role = require('_helpers/role')
const deviceService = require('./device.service')

// routes

router.get('/', authorize(Role.Admin), getAll);
router.get('/:id', authorize(), getById);
router.get('/userId/:id', authorize(), getByUserId);
router.post('/', authorize(Role.Admin), createSchema, create);
router.put('/:id', authorize(Role.Admin), updateSchema, update);
router.delete('/:id', authorize(Role.Admin), _delete);

module.exports = router;


function getAll(req, res, next) {
    deviceService.getAll()
        .then(devices => res.json(devices))
        .catch(next);
}

function getById(req, res, next) {

    deviceService.getById(req.params.id)
        .then(device => device ? res.json(device) : res.sendStatus(404))
        .catch(next);
}

function getByUserId(req, res, next) {

    deviceService.getByUserId(req.params.id)
        .then(devices => devices ? res.json(devices) : res.sendStatus(404))
        .catch(next);
}

function createSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        code: Joi.string().required(),
        topic: Joi.string().required(),
        type: Joi.string().required(),
    });
    validateRequest(req, next, schema);
}

function create(req, res, next) {
    // only admins can create devices
    if (req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    deviceService.create(req.body)
        .then(device => res.json(device))
        .catch(next)
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().empty(''),
        code: Joi.string().empty(''),
        topic: Joi.string().empty(''),
        type: Joi.string().empty(''),
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    // only admins can update devices
    if (req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    deviceService.update(req.params.id, req.body)
        .then(device => res.json(device))
        .catch(next);
}

function _delete(req, res, next) {
    // only admins can delete devices
    if (req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    deviceService.delete(req.params.id)
        .then(() => res.json({ message: 'Đã xóa thiết bị thành công' }))
        .catch(next);
}


