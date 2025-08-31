import { useState } from 'react';
import LoginForm from './components/LoginForm';
import PostList from './components/PostList';
import PostForm from './components/PostForm';

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));
  const [refreshPosts, setRefreshPosts] = useState(0);

  const handlePostAdded = () => setRefreshPosts(refreshPosts + 1);

  return (
    <div className="App">
      <h1>Post App</h1>
      {!loggedIn ? (
        <LoginForm onLogin={() => setLoggedIn(true)} />
      ) : (
        <>
          <PostForm onPostAdded={handlePostAdded} />
          <PostList key={refreshPosts} />
        </>
      )}
    </div>
  );
}

export default App;
