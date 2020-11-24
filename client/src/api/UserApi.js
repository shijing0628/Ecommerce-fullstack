import { useState, useEffect } from 'react'
import axios from 'axios'


function UserApi(token) {
 const [isLogged, setIsLogged] = useState(false)
 const [isAdmin, setIsAdmin] = useState(false)

 useEffect(() => {
  if (token) {
   const getUser = async () => {
    try {
     const res = await axios.get('/user/infor', {
      headers: { Authorization: token }
     })
     console.log(res.data)
    } catch (err) {
     return alert(err.response.data.msg)
    }
   }
  }
 }, [token])

 return {
  isLogged: [isLogged, setIsLogged],
  isAdmin: [isAdmin, setIsAdmin]
 }
}

export default UserApi
