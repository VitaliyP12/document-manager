const { Document, Tag } = require('../models/index');
const { Op } = require('sequelize');

exports.search = async (req, res) => {
  try {
    const { q, type, tag, sort = 'createdAt', order = 'DESC' } = req.query;
    const whereClause = { user_id: req.user.id };

    if (q) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${q}%` } },
        { description: { [Op.iLike]: `%${q}%` } },
        { original_name: { [Op.iLike]: `%${q}%` } },
        { content: { [Op.iLike]: `%${q}%` } },
      ];
    }

    if (type) {
      whereClause.file_type = { [Op.iLike]: `%${type}%` };
    }

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

    const results = documents.map((doc) => {
      const plain = doc.toJSON();

      if (q && plain.content) {
        const lowerContent = plain.content.toLowerCase();
        const lowerQuery = q.toLowerCase();
        const idx = lowerContent.indexOf(lowerQuery);

        if (idx !== -1) {
          const start = Math.max(0, idx - 80);
          const end = Math.min(plain.content.length, idx + q.length + 80);
          let snippet = plain.content.substring(start, end);
          if (start > 0) snippet = '...' + snippet;
          if (end < plain.content.length) snippet = snippet + '...';
          plain.snippet = snippet;
          plain.matchedInContent = true;
        }
      }

      delete plain.content;
      return plain;
    });

    res.json({ results, count: results.length });
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
      attributes: { exclude: ['content'] },
      include: [{ model: Tag }],
      order: [['createdAt', 'DESC']],
      limit: 5,
    });
    res.json({ totalDocuments, totalTags, recentDocuments });
  } catch (err) {
    res.status(500).json({ message: 'Помилка сервера', error: err.message });
  }
};