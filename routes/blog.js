// routes/blog.js
const express = require('express');
const { Blog } = require('../models');
const auth = require('../middleware/auth');
const blogController = require('../controllers/blogController');
const tenantResolver = require('../middleware/tenantResolver');

const router = express.Router();

router.post('/:id/view', blogController.incrementView);
router.post('/:id/like', blogController.incrementLike);
router.post('/:id/share', blogController.incrementShare);
router.get('/tenant/:tenant', blogController.getBlogsByTenant);


// Create Blog
router.post('/', auth, tenantResolver, async (req, res) => {
    const { title, content } = req.body;
    const { tenant } = req;
    const { userId } = req.user;

    try {
        const blog = await Blog.create({
            title,
            content,
            tenantId: tenant.id,
            userId,
        });

        res.status(201).json(blog);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not create blog' });
    }
});

// Get all blogs for tenant
router.get('/', tenantResolver, async (req, res) => {
    try {
        const blogs = await Blog.findAll({ where: { tenantId: req.tenant.id } });
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch blogs' });
    }
});

// Get single blog + increment views
router.get('/:id', tenantResolver, async (req, res) => {
    try {
        const blog = await Blog.findOne({ where: { id: req.params.id, tenantId: req.tenant.id } });

        if (!blog) return res.status(404).json({ error: 'Blog not found' });

        blog.views += 1;
        await blog.save();

        res.json(blog);
    } catch (err) {
        res.status(500).json({ error: 'Could not fetch blog' });
    }
});

// Update blog (owner only)
router.put('/:id', auth, tenantResolver, async (req, res) => {
    try {
        const blog = await Blog.findOne({
            where: {
                id: req.params.id,
                tenantId: req.tenant.id,
                userId: req.user.userId,
            },
        });

        if (!blog) return res.status(404).json({ error: 'Blog not found or unauthorized' });

        const { title, content } = req.body;
        blog.title = title || blog.title;
        blog.content = content || blog.content;

        await blog.save();

        res.json(blog);
    } catch (err) {
        res.status(500).json({ error: 'Update failed' });
    }
});

// Like blog
router.post('/:id/like', tenantResolver, async (req, res) => {
    try {
        const blog = await Blog.findOne({ where: { id: req.params.id, tenantId: req.tenant.id } });
        if (!blog) return res.status(404).json({ error: 'Blog not found' });

        blog.likes += 1;
        await blog.save();

        res.json({ likes: blog.likes });
    } catch (err) {
        res.status(500).json({ error: 'Could not like blog' });
    }
});

// Share blog
router.post('/:id/share', tenantResolver, async (req, res) => {
    try {
        const blog = await Blog.findOne({ where: { id: req.params.id, tenantId: req.tenant.id } });
        if (!blog) return res.status(404).json({ error: 'Blog not found' });

        blog.shares += 1;
        await blog.save();

        res.json({ shares: blog.shares });
    } catch (err) {
        res.status(500).json({ error: 'Could not share blog' });
    }
});

// Delete blog (owner only)
router.delete('/:id', auth, tenantResolver, async (req, res) => {
    try {
        const deleted = await Blog.destroy({
            where: {
                id: req.params.id,
                userId: req.user.userId,
                tenantId: req.tenant.id,
            },
        });

        if (!deleted) return res.status(404).json({ error: 'Delete failed or unauthorized' });

        res.json({ message: 'Blog deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Could not delete blog' });
    }
});

module.exports = router;
