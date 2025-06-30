// models/index.js
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    define: {
        timestamps: true,
        underscored: true,
    },
    dialectOptions: process.env.NODE_ENV === 'production'
        ? { ssl: { rejectUnauthorized: false } }
        : {},
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Tenant = require('./Tenant')(sequelize, DataTypes);
db.User = require('./User')(sequelize, DataTypes);

// Relationships
db.Tenant.hasMany(db.User, { foreignKey: 'tenantId' });
db.User.belongsTo(db.Tenant, { foreignKey: 'tenantId' });

module.exports = db;

// ... existing imports and setup
db.Blog = require('./Blog')(sequelize, DataTypes);

// Blog relations
db.Tenant.hasMany(db.Blog, { foreignKey: 'tenantId' });
db.User.hasMany(db.Blog, { foreignKey: 'userId' });

db.Blog.belongsTo(db.Tenant, { foreignKey: 'tenantId' });
db.Blog.belongsTo(db.User, { foreignKey: 'userId' });
