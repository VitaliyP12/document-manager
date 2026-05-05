const express = require('express');
const router = express.Router();
const documentsController = require('../controllers/documents.controller');
const authMiddleware = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router.use(authMiddleware);

router.get('/', documentsController.getAll);
router.get('/:id', documentsController.getOne);
router.post('/', upload.single('file'), documentsController.create);
router.put('/:id', documentsController.update);
router.delete('/:id', documentsController.remove);

module.exports = router;