import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  return (
    <>
      <h1>Fakestagram</h1>
      <label htmlFor='username'>User </label>
      <input id='username' type='text' placeholder='' /> 
      <div>
        <label htmlFor='password'>Password </label>
        <input type='text' placeholder='' />
      </div>
      <div>
        <button>Login</button>
      </div>
      <p>
        Create account here
      </p>
    </>
  )
}

export default App