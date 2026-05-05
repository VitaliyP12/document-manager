const { Document, Tag } = require('../models/index');
const { Op } = require('sequelize');

exports.search = async (req, res) => {
  try {
    const { q, type, tag, sort = 'createdAt', order = 'DESC' } = req.query;

    const whereClause = { user_id: req.user.id };

    // Пошук по назві або опису
    if (q) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${q}%` } },
        { description: { [Op.iLike]: `%${q}%` } },
        { original_name: { [Op.iLike]: `%${q}%` } },
      ];
    }

    // Фільтр по типу файлу
    if (type) {
      whereClause.file_type = { [Op.iLike]: `%${type}%` };
    }

    // Фільтр по тегу
    const includeClause = [{ model: Tag }];
    if (tag) {
      includeClause[0].where = { name: { [Op.iLike]: `%${tag}%` } };
      includeClause[0].required = true;
    }

    const documents = await Document.findAll({
      where: whereClause,
      include: includeClause,
      order: [[sort, order]],
    });

    res.json({ results: documents, count: documents.length });
  } catch (err) {
    res.status(500).json({ message: 'Помилка сервера', error: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const totalDocuments = await Document.count({
      where: { user_id: req.user.id },
    });

    const totalTags = await Tag.count({
      where: { user_id: req.user.id },
    });

    const recentDocuments = await Document.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Tag }],
      order: [['createdAt', 'DESC']],
      limit: 5,
    });

    res.json({ totalDocuments, totalTags, recentDocuments });
  } catch (err) {
    res.status(500).json({ message: 'Помилка сервера', error: err.message });
  }
};