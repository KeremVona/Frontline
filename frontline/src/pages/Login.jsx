import React, { useState } from 'react'

export default function Login({ setAuth }) {
  const [inputs, setInputs] = useState({
    email: "",
    password: ""
  });

  const { email, password } = inputs;

  const onChange = e => {
    setInputs({ ...inputs, [e.target.name] : e.target.value });
  }

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {

      const body = { email, password };

      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(body)
      });

      const parseRes = await response.json();

      localStorage.setItem("token", parseRes.token);

      setAuth(true);
    }
    catch (err) {
      console.error(err.message);
    }
  }
  return (
    <div className='mt-60'>
      <h1 className='text-6xl mb-4 flex justify-center'>Login</h1>
      <form onSubmit={onSubmitForm} className='grid grid-flow-col grid-rows-3 justify-center'>
        <input type="text" name='email' placeholder='email' value={email} onChange={e => onChange(e)} className='bg-gray-200 text-amber-900 mb-2 h-15 w-200 text-2xl pl-2' />
        <input type="text" name='password' placeholder='password' value={password} onChange={e => onChange(e)} className='bg-gray-200 text-amber-900 text-2xl pl-2' />
        <button className='bg-gray-200 mt-2'>CLICK MEEAAEAA</button>
      </form>
    </div>
  )
}
