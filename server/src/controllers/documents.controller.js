const { Document, Tag } = require('../models/index');
const fs = require('fs');
const path = require('path');

exports.getAll = async (req, res) => {
  try {
    const documents = await Document.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Tag }],
      order: [['createdAt', 'DESC']],
    });
    res.json(documents);
  } catch (err) {
    res.status(500).json({ message: 'Помилка сервера', error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const document = await Document.findOne({
      where: { id: req.params.id, user_id: req.user.id },
      include: [{ model: Tag }],
    });

    if (!document) {
      return res.status(404).json({ message: 'Документ не знайдено' });
    }

    res.json(document);
  } catch (err) {
    res.status(500).json({ message: 'Помилка сервера', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Файл не завантажено' });
    }

    const { title, description } = req.body;

    const document = await Document.create({
      title,
      description,
      file_path: req.file.filename,
      file_type: req.file.mimetype,
      file_size: req.file.size,
      original_name: req.file.originalname,
      user_id: req.user.id,
    });

    res.status(201).json({ message: 'Документ створено', document });
  } catch (err) {
    res.status(500).json({ message: 'Помилка сервера', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const document = await Document.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });

    if (!document) {
      return res.status(404).json({ message: 'Документ не знайдено' });
    }

    const { title, description } = req.body;
    await document.update({ title, description });

    res.json({ message: 'Документ оновлено', document });
  } catch (err) {
    res.status(500).json({ message: 'Помилка сервера', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const document = await Document.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });

    if (!document) {
      return res.status(404).json({ message: 'Документ не знайдено' });
    }

    // Видаляємо файл з диску
    const filePath = path.join(__dirname, '../../uploads', document.file_path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await document.destroy();
    res.json({ message: 'Документ видалено' });
  } catch (err) {
    res.status(500).json({ message: 'Помилка сервера', error: err.message });
  }
};