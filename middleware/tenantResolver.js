// middleware/tenantResolver.js
const { Tenant } = require('../models');

module.exports = async function (req, res, next) {
    const tenantSlug = req.headers['x-tenant-slug'];

    if (!tenantSlug) {
        return res.status(400).json({ error: 'Tenant header missing' });
    }

    try {
        const tenant = await Tenant.findOne({ where: { slug: tenantSlug } });
        if (!tenant) {
            return res.status(404).json({ error: 'Tenant not found' });
        }

        req.tenant = tenant;
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not resolve tenant' });
    }
};
