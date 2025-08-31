import { useEffect, useState } from 'react';
import api from '../api';

export default function PostList() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const res = await api.get('/posts');
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  return (
    <div>
      <h3>Posts</h3>
      <ul>
        {posts.map(p => (
          <li key={p.id}><strong>{p.title}</strong>: {p.content}</li>
        ))}
      </ul>
    </div>
  );
}
