import React from 'react'
import { useSelector,useDispatch } from 'react-redux'
import authService from '../Appwrite/Authentication'
import { logout } from '../store/authSlice'



function Logoutbtn() {

    
    const dispatch=useDispatch();
    const handleclick=()=>{
        authService.logout().then(()=>{//bcz it is a promise
            dispatch(logout());//ye vala uss configure store ki authslice se aa rha hai ye method hai
        })
    }
  return (
    <button onClick={handleclick} className='inline-block px-6 py-2 duration-200 hover:border-r-blue-100 rounded-full' >Logout</button>
  )
}

export default Logoutbtn