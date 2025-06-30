// pages/blog/[id].js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import api from '../../services/api';

export default function BlogDetail({ initialBlog }) {
  const router = useRouter();
  const [blog, setBlog] = useState(initialBlog);

  // Increment view count once on load
  useEffect(() => {
    const incrementView = async () => {
      try {
        await api.post(`/blogs/${blog.id}/view`);
      } catch (err) {
        console.error('Error incrementing view:', err);
      }
    };
    incrementView();
  }, [blog.id]);

  const handleLike = async () => {
    try {
      const res = await api.post(`/blogs/${blog.id}/like`);
      setBlog((prev) => ({ ...prev, likes: res.data.likes }));
    } catch (err) {
      console.error('Like failed:', err);
    }
  };

  const handleShare = async () => {
    try {
      const res = await api.post(`/blogs/${blog.id}/share`);
      setBlog((prev) => ({ ...prev, shares: res.data.shares }));
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  const metaDescription = blog.content
    ? blog.content.slice(0, 150).replace(/<[^>]+>/g, '') + '...'
    : 'Read this insightful post on our multi-tenant blog.';

  return (
    <>
      <Head>
        <title>{blog.title} | Multi-Tenant Blog</title>
        <meta name="description" content={metaDescription} />

        {/* Open Graph / Facebook */}
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://yourdomain.com/blog/${blog.id}`} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.title} />
        <meta name="twitter:description" content={metaDescription} />
      </Head>

      <div style={styles.container}>
        <h1 style={styles.title}>{blog.title}</h1>
        <div
          style={styles.content}
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
        <div style={styles.stats}>
          <span>👁 {blog.views} views</span>
          <span>❤️ {blog.likes} likes</span>
          <span>🔁 {blog.shares} shares</span>
        </div>
        <div style={styles.actions}>
          <button onClick={handleLike} style={styles.button}>❤️ Like</button>
          <button onClick={handleShare} style={styles.button}>🔁 Share</button>
          <button onClick={() => router.back()} style={styles.backBtn}>🔙 Back</button>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/blogs/${id}`);
    const data = await res.json();
    return { props: { initialBlog: data } };
  } catch (error) {
    return { notFound: true };
  }
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '0 20px',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '20px',
  },
  content: {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  stats: {
    display: 'flex',
    gap: '20px',
    fontSize: '0.95rem',
    color: '#555',
    marginBottom: '15px',
  },
  actions: {
    display: 'flex',
    gap: '10px',
  },
  button: {
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  backBtn: {
    backgroundColor: '#eaeaea',
    color: '#000',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};
