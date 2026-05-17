const { Folder, Document, Tag } = require('../models/index');

exports.getAll = async (req, res) => {
  try {
    const folders = await Folder.findAll({
      where: { user_id: req.user.id },
      order: [['createdAt', 'ASC']],
    });
    res.json(folders);
  } catch (err) {
    res.status(500).json({ message: 'Помилка сервера', error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const folder = await Folder.findOne({
      where: { id: req.params.id, user_id: req.user.id },
      include: [
        {
          model: Document,
          include: [{ model: Tag }],
        },
        {
          model: Folder,
          as: 'children',
        },
      ],
    });

    if (!folder) {
      return res.status(404).json({ message: 'Папку не знайдено' });
    }

    res.json(folder);
  } catch (err) {
    res.status(500).json({ message: 'Помилка сервера', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, parent_id } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Введіть назву папки' });
    }

    if (parent_id) {
      const parent = await Folder.findOne({
        where: { id: parent_id, user_id: req.user.id },
      });
      if (!parent) {
        return res.status(400).json({ message: 'Батьківську папку не знайдено' });
      }
    }

    const folder = await Folder.create({
      name: name.trim(),
      parent_id: parent_id || null,
      user_id: req.user.id,
    });

    res.status(201).json({ message: 'Папку створено', folder });
  } catch (err) {
    res.status(500).json({ message: 'Помилка сервера', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const folder = await Folder.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });

    if (!folder) {
      return res.status(404).json({ message: 'Папку не знайдено' });
    }

    const { name, parent_id } = req.body;

    if (parent_id === req.params.id) {
      return res.status(400).json({ message: 'Папка не може бути власним батьком' });
    }

    await folder.update({
      name: name?.trim() || folder.name,
      parent_id: parent_id !== undefined ? parent_id : folder.parent_id,
    });

    res.json({ message: 'Папку оновлено', folder });
  } catch (err) {
    res.status(500).json({ message: 'Помилка сервера', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const folder = await Folder.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });

    if (!folder) {
      return res.status(404).json({ message: 'Папку не знайдено' });
    }

    await folder.destroy();
    res.json({ message: 'Папку видалено' });
  } catch (err) {
    res.status(500).json({ message: 'Помилка сервера', error: err.message });
  }
};

exports.moveDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const { folder_id } = req.body;

    const document = await Document.findOne({
      where: { id: documentId, user_id: req.user.id },
    });

    if (!document) {
      return res.status(404).json({ message: 'Документ не знайдено' });
    }

    if (folder_id) {
      const folder = await Folder.findOne({
        where: { id: folder_id, user_id: req.user.id },
      });
      if (!folder) {
        return res.status(404).json({ message: 'Папку не знайдено' });
      }
    }

    await document.update({ folder_id: folder_id || null });
    res.json({ message: 'Документ переміщено', document });
  } catch (err) {
    res.status(500).json({ message: 'Помилка сервера', error: err.message });
  }
};