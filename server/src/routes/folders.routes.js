const express = require('express');
const router = express.Router();
const foldersController = require('../controllers/folders.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.get('/', foldersController.getAll);
router.get('/:id', foldersController.getOne);
router.post('/', foldersController.create);
router.put('/:id', foldersController.update);
router.delete('/:id', foldersController.remove);
router.put('/document/:documentId/move', foldersController.moveDocument);

module.exports = router;