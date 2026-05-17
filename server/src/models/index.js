const sequelize = require('../config/database');
const User = require('./User');
const Document = require('./Document');
const Tag = require('./Tag');
const Folder = require('./Folder');

User.hasMany(Document, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Document.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Tag, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Tag.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Folder, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Folder.belongsTo(User, { foreignKey: 'user_id' });

Folder.hasMany(Folder, { foreignKey: 'parent_id', as: 'children', onDelete: 'CASCADE' });
Folder.belongsTo(Folder, { foreignKey: 'parent_id', as: 'parent' });

Folder.hasMany(Document, { foreignKey: 'folder_id', onDelete: 'SET NULL' });
Document.belongsTo(Folder, { foreignKey: 'folder_id' });

Document.belongsToMany(Tag, { through: 'DocumentTags', foreignKey: 'document_id' });
Tag.belongsToMany(Document, { through: 'DocumentTags', foreignKey: 'tag_id' });

sequelize.sync({ alter: true })
  .then(() => console.log('Таблиці синхронізовані!'))
  .catch(err => console.error('Помилка синхронізації:', err));

module.exports = { sequelize, User, Document, Tag, Folder };