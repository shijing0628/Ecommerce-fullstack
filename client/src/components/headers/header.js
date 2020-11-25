import React, { useState, useContext } from 'react'
import { GlobalState } from '../../GlobalState'
import Menu from './icons/menu.svg'
import Close from './icons/close.svg'
import Cart from './icons/cart.svg'
import { Link } from 'react-router-dom'
import Logo from '../../images/logo.png'
import axios from 'axios'

const Header = () => {
 const state = useContext(GlobalState)
 const [isLogged] = state.userAPI.isLogged;
 const [isAdmin] = state.userAPI.isAdmin;
 const [cart, setCart] = state.userAPI.cart;
 const adminRouter = () => {
  return (
   <>
    <li><Link to="/create_product">Create Product</Link></li>
    <li><Link to="/category">Categories</Link></li>
   </>
  )
 }

 const loggedRouter = () => {
  return (
   <>
    <li><Link to="/history">History</Link></li>
    <li><Link to="/" onClick={logoutUser}>Logout</Link></li>
   </>
  )
 }

 const logoutUser = async () => {

  await axios.get('/user/logout')
  localStorage.clear()
  window.location.href = "/"
 }


 return (
  <header >
   <div className="menu">
    <img src={Menu} alt="" width="30" />
   </div>
   <div className="logo">
    <h1>
     <Link to="/">
      {isAdmin ? 'Admin' : <img className="logo" src={Logo} alt="" />}
     </Link>
    </h1>
   </div>
   <ul>
    <li><Link to="/"> {isAdmin ? 'Products' : 'Shop'}</Link></li>
    {isAdmin && adminRouter()}
    {
     isLogged ? loggedRouter() : <li><Link to="/login">Login/Register</Link></li>
    }

    <li>
     <img src={Close} alt="" width="30" className="menu" />
    </li>
   </ul>

   { isAdmin ? '' :
    <div className="cart-icon">
     <span>{cart.length}</span>
     <Link to="/cart">
      <img src={Cart} alt="" width="30" />
     </Link>
    </div>
   }

  </header>
 )
}

export default Header
