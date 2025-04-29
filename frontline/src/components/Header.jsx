import React from 'react'

export default function Header({ name }) {
  return (
    <h1 className='text-4xl p-4' id='header'>Welcome, {name}</h1>
  )
}
