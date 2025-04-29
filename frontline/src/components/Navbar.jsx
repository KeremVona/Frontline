import React from 'react'
import { Link } from "react-router-dom"

export default function Navbar() {
  return (
    
        <ul className='flex flex-row bg-amber-100 justify-center gap-2'>
            <li className='basis-sm bg-amber-200 justify-center items-center flex p-2.5'>
                <Link to="/host-game" className='text-center text-2xl'>Game Host</Link>
            </li>
            <li className='basis-sm bg-amber-200 justify-center items-center flex'>
                <Link to="" className='text-center text-2xl'>Game List</Link>
            </li>
            <li className='basis-sm bg-amber-200 justify-center items-center flex'>
                <Link to="" className='text-center text-2xl'>Profile</Link>
            </li>
        </ul>
  )
}
