import { useState, useEffect } from 'react'
import axios from 'axios'


function UserApi(token) {
  const [isLogged, setIsLogged] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [cart, setCart] = useState([])


  useEffect(() => {
    if (token) {
      const getUser = async () => {
        try {
          const res = await axios.get('/user/infor', {
            headers: { Authorization: token }
          })

          setIsLogged(true)

          res.data.role === 1 ? setIsAdmin(true) : setIsAdmin(false)

        } catch (err) {
          alert(err.response.data.msg)
        }
      }
      getUser()
    }
  }, [token])

  const addCart = async (e, product) => {
    e.preventDefault()
    if (!isLogged) return alert("please login to buy product!")

    const check = cart.every(item => {
      return item._id !== product._id
    })

    if (check) { setCart([...cart, { ...product, quantity: 1 }]) }
    else { alert("This product was added to cart!") }
  }

  return {
    isLogged: [isLogged, setIsLogged],
    isAdmin: [isAdmin, setIsAdmin],
    cart: [cart, setCart],
    addCart: addCart
  }
}

export default UserApi
