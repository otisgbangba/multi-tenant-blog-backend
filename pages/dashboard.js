// pages/dashboard.js
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { useRouter } from 'next/router';
import Head from 'next/head';

import Link from 'next/link';
...
<h3>
  <Link href={`/blog/${blog.id}`} style={{ color: '#0070f3', textDecoration: 'none' }}>
    {blog.title}
  </Link>
</h3>

export default function Dashboard() {
  const { user, tenant, logout, loading } = useAuth();
  const router = useRouter();

  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState({ title: '', content: '' });
  const [submitting, setSubmitting] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 5;

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else {
      fetchBlogs();
    }
  }, [user, loading]);

  const fetchBlogs = async () => {
    try {
      const res = await api.get('/blogs');
      setBlogs(res.data);
    } catch (err) {
      console.error('Error fetching blogs', err);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingBlogId) {
        const res = await api.put(`/blogs/${editingBlogId}`, form);
        setBlogs((prev) =>
          prev.map((b) => (b.id === editingBlogId ? res.data : b))
        );
        setEditingBlogId(null);
      } else {
        const res = await api.post('/blogs', form);
        setBlogs([res.data, ...blogs]);
      }

      setForm({ title: '', content: '' });
    } catch (err) {
      console.error('Blog submission error:', err);
    }

    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;
    try {
      await api.delete(`/blogs/${id}`);
      setBlogs((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  // Pagination calculations
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Head>
        <title>Dashboard | Multi-Tenant Blog</title>
      </Head>

      <div style={styles.container}>
        <header style={styles.header}>
          <h1>{tenant} Dashboard</h1>
          <button onClick={logout} style={styles.logoutBtn}>
            Logout
          </button>
        </header>

        <form onSubmit={handleSubmit} style={styles.form}>
          <h2>{editingBlogId ? 'Edit Blog' : 'Create Blog'}</h2>
          <input
            name="title"
            placeholder="Blog Title"
            value={form.title}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <textarea
            name="content"
            placeholder="Write something..."
            value={form.content}
            onChange={handleChange}
            required
            style={styles.textarea}
          />
          <button type="submit" disabled={submitting} style={styles.button}>
            {submitting ? (editingBlogId ? 'Updating...' : 'Posting...') : editingBlogId ? 'Update Blog' : 'Create Blog'}
          </button>
        </form>

        <div style={styles.blogList}>
          {currentBlogs.map((blog) => (
            <div key={blog.id} style={styles.blogItem}>
              <h3>{blog.title}</h3>
              <p dangerouslySetInnerHTML={{ __html: blog.content }}></p>

              <div style={styles.stats}>
                <span>👁 {blog.views}</span>
                <span>❤️ {blog.likes}</span>
                <span>🔁 {blog.shares}</span>
              </div>

              <div style={styles.actions}>
                <button
                  style={styles.editBtn}
                  onClick={() => {
                    setForm({ title: blog.title, content: blog.content });
                    setEditingBlogId(blog.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  ✏️ Edit
                </button>
                <button
                  style={styles.deleteBtn}
                  onClick={() => handleDelete(blog.id)}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div style={styles.pagination}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                style={{
                  ...styles.pageBtn,
                  backgroundColor:
                    currentPage === i + 1 ? '#0070f3' : '#eaeaea',
                  color: currentPage === i + 1 ? '#fff' : '#000',
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '0 20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoutBtn: {
    backgroundColor: '#e00',
    color: '#fff',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  form: {
    marginTop: '20px',
    marginBottom: '40px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    fontSize: '1rem',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    height: '120px',
    fontSize: '1rem',
    marginBottom: '10px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#0070f3',
    color: '#fff',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  blogList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  blogItem: {
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    backgroundColor: '#fff',
  },
  stats: {
    marginTop: '10px',
    display: 'flex',
    gap: '20px',
    fontSize: '0.9rem',
    color: '#666',
  },
  actions: {
    marginTop: '10px',
    display: 'flex',
    gap: '10px',
  },
  editBtn: {
    padding: '6px 10px',
    backgroundColor: '#ffc107',
    color: '#000',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  deleteBtn: {
    padding: '6px 10px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  pagination: {
    marginTop: '30px',
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
  },
  pageBtn: {
    padding: '8px 12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};
