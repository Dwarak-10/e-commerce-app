import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import { useSelector } from 'react-redux'

const Body = () => {
  const user = useSelector(store => store?.user)
  const token = user?.token
  // console.log(token)
  return (
    <div>
      {token && <Navbar />}
      <Outlet />
    </div>
  )
}

export default Body
