import React from 'react';
import '../../App.css';
import '../../Styles/login.css';

function Login() {
  return (
    <>
      <h1 className="title">Fakestagram</h1>
      <label htmlFor='username' className='text'>Email</label>
      <input id='username' type='text' className='rectangle'/> 
      <div>
        <label htmlFor='password' className='text' >Password</label>
        <input id='password' type='password' className='rectangle'/>
      </div>
      <div>
        <button className="login-button">Login</button>
      </div>
      <p>
        Create account <a href="/register" className="register-link">here</a> 
      </p>
    </>
  );
}

export default Login;
