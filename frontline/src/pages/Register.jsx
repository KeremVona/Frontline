import React from 'react'
import { useState } from 'react'

export default function Register({ setAuth }) {

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    username: ""
  });

  const { email, password, username } = inputs;

  const onChange = (e) => {
    setInputs({...inputs, [e.target.name] : e.target.value});
  }

  const onSubmitForm = async (e) => {
    e.preventDefault();

    try {
      const body = { email, password, username };

      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type" : "application/json" },
        body: JSON.stringify(body)
      });

      const parseRes = await response.json();

      console.log("parseRes: ", parseRes);
      console.log(`parseRes.token: ${parseRes.token}`);

      localStorage.setItem("token", parseRes.token);

      setAuth(true);
    }
    catch (err) {
      console.error(err.message);
      console.log("Register error");
    }
  }

  return (
    <div className='mt-60'>
      <h1 className='text-6xl mb-4 flex justify-center'>Register</h1>
      <form onSubmit={onSubmitForm} className='grid grid-flow-col grid-rows-4 justify-center'>
        <input type="email" name='email' placeholder='email' value={email} onChange={(e) => onChange(e)} className='bg-gray-200 text-amber-900 mb-2 h-15 w-200 text-2xl pl-2' />
        <input type="password" name='password' placeholder='password' value={password} onChange={(e) => onChange(e)} className='bg-gray-200 text-amber-900 mb-2 h-15 w-200 text-2xl pl-2' />
        <input type="text" name='username' placeholder='name' value={username} onChange={(e) => onChange(e)} className='bg-gray-200 text-amber-900 mb-2 h-15 w-200 text-2xl pl-2' />
        <button className='bg-gray-200 mt-2'>Submit</button>
      </form>
    </div>
  )
}
