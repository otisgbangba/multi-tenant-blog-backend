// models/Tenant.js
module.exports = (sequelize, DataTypes) => {
    const Tenant = sequelize.define('Tenant', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        theme: {
            type: DataTypes.JSONB, // Stores theme settings per tenant
            defaultValue: {},
        },
    });

    return Tenant;
};
