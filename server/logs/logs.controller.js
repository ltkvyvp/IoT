const express = require('express')
const router = express.Router()
const authorize = require('_middleware/authorize')
const Role = require('_helpers/role')
const logService = require('./log.service')

// routes

router.get('/', authorize(Role.Admin), getAll);
router.get('/:id', authorize(), getById);
router.get('/deviceId/:id', authorize(), getByDeviceId);
router.get('/userId/:id', authorize(), getByUserId);
router.delete('/:id', authorize(Role.Admin), _delete);

module.exports = router;


function getAll(req, res, next) {
    logService.getAll()
        .then(logs => res.json(logs))
        .catch(next);
}

function getById(req, res, next) {

    logService.getById(req.params.id)
        .then(log => log ? res.json(log) : res.sendStatus(404))
        .catch(next);
}

function getByDeviceId(req, res, next) {

    logService.getByDeviceId(req.params.id)
        .then(logs => logs ? res.json(logs) : res.sendStatus(404))
        .catch(next);
}

function getByUserId(req, res, next) {
    logService.getByUserId(req.params.id)
        .then(logs => logs ? res.json(logs) : res.sendStatus(404))
        .catch(next);
}

function _delete(req, res, next) {
    // only admins can delete logs
    if (req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    logService.delete(req.params.id)
        .then(() => res.json({ message: 'Đã xóa lịch sử thành công' }))
        .catch(next);
}


