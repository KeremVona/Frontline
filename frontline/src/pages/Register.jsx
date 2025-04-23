import React from 'react'
import { useState } from 'react'

export default function Register() {

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    name: ""
  });

  const { email, password, name } = inputs;

  const onChange = (e) => {
    setInputs({...inputs, [e.target.name] : e.target.value});
  }

  const onSubmit = async (e) => {
    e.preventDefault();

    try {

    }
    catch (err) {
      console.error(err.message);
      console.log("Register error");
    }
  }

  return (
    <>
      <h1>Register</h1>
      <form>
        <input type="email" name='email' placeholder='email' value={email} onChange={(e) => onChange(e)} />
        <input type="password" name='password' placeholder='password' value={password} onChange={(e) => onChange(e)} />
        <input type="text" name='name' placeholder='name' value={name} onChange={(e) => onChange(e)} />
        <button className='bg-red-200'>Submit</button>
      </form>
    </>
  )
}
