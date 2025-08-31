import { useState } from 'react';
import api from '../api';

export default function PostForm({ onPostAdded }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const addPost = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await api.post('/posts', { title, content }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTitle('');
      setContent('');
      onPostAdded();
    } catch (err) {
      alert('Failed to add post');
    }
  };

  return (
    <form onSubmit={addPost}>
      <h3>Add Post</h3>
      <input 
        type="text" 
        placeholder="Title"
        value={title} 
        onChange={e => setTitle(e.target.value)}
      /><br/>
      <textarea 
        placeholder="Content"
        value={content} 
        onChange={e => setContent(e.target.value)}
      /><br/>
      <button type="submit">Add</button>
    </form>
  );
}
