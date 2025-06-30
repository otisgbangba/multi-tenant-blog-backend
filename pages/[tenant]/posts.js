// pages/[tenant]/posts.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function TenantPosts({ tenant, posts }) {
  const [query, setQuery] = useState('');

  const filteredPosts = posts.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>{tenant} | Public Blog Posts</title>
        <meta
          name="description"
          content={`Read recent blog posts from ${tenant}.`}
        />
      </Head>

      <div style={styles.container}>
        <h1>📢 {tenant} Blog Posts</h1>

        <input
          type="text"
          placeholder="Search blog titles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: '10px', width: '100%', margin: '20px 0' }}
        />

        <div style={styles.list}>
          {filteredPosts.length === 0 ? (
            <p>No matching posts.</p>
          ) : (
            filteredPosts.map((post) => (
              <div key={post.id} style={styles.item}>
                <h3>
                  <Link href={`/blog/${post.id}`} style={styles.link}>
                    {post.title}
                  </Link>
                </h3>
                <p
                  dangerouslySetInnerHTML={{
                    __html: post.content.slice(0, 100) + '...',
                  }}
                />
                <p style={styles.stats}>
                  👁 {post.views} | ❤️ {post.likes} | 🔁 {post.shares}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { tenant } = context.params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/blogs/tenant/${tenant}`
    );
    const posts = await res.json();

    return {
      props: {
        tenant,
        posts,
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '0 20px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  item: {
    border: '1px solid #ddd',
    padding: '15px',
    borderRadius: '6px',
    backgroundColor: '#fff',
  },
  link: {
    textDecoration: 'none',
    color: '#0070f3',
  },
  stats: {
    fontSize: '0.9rem',
    color: '#666',
    marginTop: '10px',
  },
};
