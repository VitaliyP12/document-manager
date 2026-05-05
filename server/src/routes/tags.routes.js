const express = require('express');
const router = express.Router();
const tagsController = require('../controllers/tags.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.get('/', tagsController.getAll);
router.post('/', tagsController.create);
router.put('/:id', tagsController.update);
router.delete('/:id', tagsController.remove);

router.post('/document/:documentId/tag/:tagId', tagsController.addTagToDocument);
router.delete('/document/:documentId/tag/:tagId', tagsController.removeTagFromDocument);

module.exports = router;