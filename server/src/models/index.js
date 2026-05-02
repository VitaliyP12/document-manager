const sequelize = require('../config/database');
const User = require('./User');
const Document = require('./Document');
const Tag = require('./Tag');

// Зв'язки між моделями
User.hasMany(Document, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Document.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Tag, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Tag.belongsTo(User, { foreignKey: 'user_id' });

Document.belongsToMany(Tag, { through: 'DocumentTags', foreignKey: 'document_id' });
Tag.belongsToMany(Document, { through: 'DocumentTags', foreignKey: 'tag_id' });

// Синхронізація з базою даних
sequelize.sync({ alter: true })
  .then(() => console.log('Таблиці синхронізовані!'))
  .catch(err => console.error('Помилка синхронізації:', err));

module.exports = { sequelize, User, Document, Tag };