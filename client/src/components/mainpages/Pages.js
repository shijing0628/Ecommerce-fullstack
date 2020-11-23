import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Login from './auth/Login'
import Register from './auth/Register'
import Cart from './cart/Cart'
import Products from './products/Products'
import NotFound from './util/Not_found.js/NotFound'

function Pages() {
 return (
  <div>
   <Switch>
    <Route path="/" exact component={Products} />
    <Route path="/login" component={Login} />
    <Route path="/register" component={Register} />
    <Route path="/cart" component={Cart} />

    <Route path="*" component={NotFound} />
   </Switch>
  </div>
 )
}

export default Pages
