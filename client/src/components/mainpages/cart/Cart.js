import React, { useContext, useState } from 'react'
import { GlobalState } from '../../../GlobalState'
import { Link } from 'react-router-dom'


function Cart() {
 const state = useContext(GlobalState)
 const [cart] = state.userAPI.cart
 const [total, setTotal] = useState(0)

 if (cart.length === 0)
  return <div><h2 style={{ textAlign: 'center', fontSize: 'Srem' }}>Cart Empty</h2>
  </div>

 return (
  <>
   {
    cart.map(product => (
     <div className="detail cart">
      <img src={product.images.url} alt="" className="img_container" />

      <div className="box-detail">
       <div className="row">
        <h2>{product.title}</h2>

        <h6>Product ID: {product.product_id}</h6>
       </div>
       <h3>$ {product.price * product.quantity}</h3>
       <p>{product.description}</p>
       <p>{product.content}</p>
       <div className="amount">
        <button> - </button>
        <span>{product.quantity}</span>
        <button> + </button>
       </div>
       <div>
        <div className="delete">
         X
       </div>
       </div>
      </div>
     </div>

    ))
   }
   <div className="total">
    <h3>total $ {total}</h3>
    <Link to="#!">Payment</Link>
   </div>
  </>
 )
}

export default Cart
