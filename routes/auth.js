// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const { User, Tenant } = require('../models');
const router = express.Router();
require('dotenv').config();

// Signup Route
router.post('/signup', async (req, res) => {
    const { name, email, password, tenantName, tenantSlug } = req.body;

    try {
        let tenant = await Tenant.findOne({ where: { slug: tenantSlug } });
        if (!tenant) {
            tenant = await Tenant.create({ name: tenantName, slug: tenantSlug });
        }

        const user = await User.create({
            name,
            email,
            password,
            tenantId: tenant.id,
            role: 'admin',
        });

        const token = jwt.sign(
            { userId: user.id, tenantId: tenant.id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({ token, user, tenant });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Signup failed' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user || !(await user.validatePassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
