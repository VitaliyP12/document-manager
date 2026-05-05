const { Tag, Document } = require('../models/index');

exports.getAll = async (req, res) => {
  try {
    const tags = await Tag.findAll({
      where: { user_id: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    res.json(tags);
  } catch (err) {
    res.status(500).json({ message: 'Помилка сервера', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, color } = req.body;

    const existingTag = await Tag.findOne({
      where: { name, user_id: req.user.id },
    });

    if (existingTag) {
      return res.status(400).json({ message: 'Тег з такою назвою вже існує' });
    }

    const tag = await Tag.create({
      name,
      color: color || '#3B82F6',
      user_id: req.user.id,
    });

    res.status(201).json({ message: 'Тег створено', tag });
  } catch (err) {
    res.status(500).json({ message: 'Помилка сервера', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const tag = await Tag.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });

    if (!tag) {
      return res.status(404).json({ message: 'Тег не знайдено' });
    }

    const { name, color } = req.body;
    await tag.update({ name, color });

    res.json({ message: 'Тег оновлено', tag });
  } catch (err) {
    res.status(500).json({ message: 'Помилка сервера', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const tag = await Tag.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });

    if (!tag) {
      return res.status(404).json({ message: 'Тег не знайдено' });
    }

    await tag.destroy();
    res.json({ message: 'Тег видалено' });
  } catch (err) {
    res.status(500).json({ message: 'Помилка сервера', error: err.message });
  }
};

exports.addTagToDocument = async (req, res) => {
  try {
    const document = await Document.findOne({
      where: { id: req.params.documentId, user_id: req.user.id },
    });

    if (!document) {
      return res.status(404).json({ message: 'Документ не знайдено' });
    }

    const tag = await Tag.findOne({
      where: { id: req.params.tagId, user_id: req.user.id },
    });

    if (!tag) {
      return res.status(404).json({ message: 'Тег не знайдено' });
    }

    await document.addTag(tag);
    res.json({ message: 'Тег додано до документу' });
  } catch (err) {
    res.status(500).json({ message: 'Помилка сервера', error: err.message });
  }
};

exports.removeTagFromDocument = async (req, res) => {
  try {
    const document = await Document.findOne({
      where: { id: req.params.documentId, user_id: req.user.id },
    });

    if (!document) {
      return res.status(404).json({ message: 'Документ не знайдено' });
    }

    const tag = await Tag.findOne({
      where: { id: req.params.tagId, user_id: req.user.id },
    });

    if (!tag) {
      return res.status(404).json({ message: 'Тег не знайдено' });
    }

    await document.removeTag(tag);
    res.json({ message: 'Тег видалено з документу' });
  } catch (err) {
    res.status(500).json({ message: 'Помилка сервера', error: err.message });
  }
};