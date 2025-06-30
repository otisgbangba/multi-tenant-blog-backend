exports.incrementView = async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (blog) {
    blog.views += 1;
    await blog.save();
    res.json({ views: blog.views });
  } else {
    res.status(404).json({ message: 'Blog not found' });
  }
};

exports.incrementLike = async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (blog) {
    blog.likes += 1;
    await blog.save();
    res.json({ likes: blog.likes });
  } else {
    res.status(404).json({ message: 'Blog not found' });
  }
};

exports.getBlogsByTenant = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      where: { tenant: req.params.tenant },
      order: [['createdAt', 'DESC']],
    });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tenant blogs' });
  }
};

exports.incrementShare = async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (blog) {
    blog.shares += 1;
    await blog.save();
    res.json({ shares: blog.shares });
  } else {
    res.status(404).json({ message: 'Blog not found' });
  }
};
