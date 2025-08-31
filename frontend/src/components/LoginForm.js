import { useState } from 'react';
import api from '../api';

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
    const [loginemail, setLoginemail] = useState('');
  const [loginpassword, setLoginpassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/login', { email, password });
      localStorage.setItem('token', res.data.token); // assuming backend returns JWT
      onLogin();
    } catch (err) {
      alert('Login failed');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/register', { name,email, password });
      alert('Registered! Please log in.');
    } catch (err) {
      alert('Registration failed');
      console.log(err);
    }
  };

  return (
    <>
    <form>
      <h3>Register</h3>
        <input 
        type="string" 
        placeholder="Name"
        value={name} 
        onChange={e => setName(e.target.value)}
      /><br/>
      <input 
        type="email" 
        placeholder="Email"
        value={email} 
        onChange={e => setEmail(e.target.value)}
      /><br/>
      <input 
        type="password" 
        placeholder="Password"
        value={password} 
        onChange={e => setPassword(e.target.value)}
      /><br/>
      <button onClick={handleRegister}>Register</button>
    </form>
        <form>
      <h3>Login</h3>
      <input 
        type="email" 
        placeholder="Email"
        value={loginemail} 
        onChange={e => setLoginemail(e.target.value)}
      /><br/>
      <input 
        type="password" 
        placeholder="Password"
        value={loginpassword} 
        onChange={e => setLoginpassword(e.target.value)}
      /><br/>
      <button onClick={handleLogin}>Login</button>
    </form>
    </>
  );
}
