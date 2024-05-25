import {useAuth}from "../context/AuthContext"
import {Navigate}from "react-router-dom"
export default function PrivateRouter({children}){
    const {user}=useAuth()
   
    if(!user.isLoggedIn && localStorage.getItem("token")){
        return <h2>Loading....</h2>
    }
    if(!user.isLoggedIn){
        return <Navigate to="/login"/>
    }

    return children
}