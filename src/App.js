import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Route,Routes,Link } from 'react-router-dom';
import Register from './component/Register';
import Login from './component/Login';
import Home from "./component/Home"
import Account from './component/Account';
import AddBlog from './component/AddBlog';
import AllBlogs from './component/AllBlogs';
import SingleBlog from './component/singleBlog';
import MyBlogs from './component/MyBlogs';
import {useAuth}from "./context/AuthContext"
import axios from "./config/axios"
import PrivateRoute from './component/PrivateRoute';
import { useEffect } from 'react';



function App() {
  const {user,dispatch}=useAuth()

  const registerIn=()=>{
    toast("successfully Registered !!")
     }

   const loggedIn=()=>{
      toast("successfully logged !!")
       }

    useEffect(()=>{
      if(localStorage.getItem("token")){
        (async()=>{
         const userResponse=await axios.get('/api/users/profile',{
          headers:{
            Authorization:
              localStorage.getItem("token")
            
          }
         })
         console.log(userResponse.data)
        //  setTimeout(()=>{
          dispatch({type:"LOGIN",payload:{account:userResponse.data}})
        //  },2000)
        })();
      }
      },[])
      

  return (
   
    <div>
      <h1>BLOG-APP</h1>
      <Link to="/">Home</Link>|
      <Link to="/all-blogs">All Blogs</Link> | 
      {!user.isLoggedIn ?(
      <>
      
        <Link to="/register">Register</Link>|
        <Link to="/login">Login</Link>|
      </>) :(
      <>
       <Link to="/account">Account</Link>|
       <Link to= "/add-blog">Add Blog</Link> |
       <Link to= "/my-blog">My Blogs</Link>
        <Link to="/" onClick={()=>{
             localStorage.removeItem("token")
             dispatch({type:"LOGOUT"})
          }}  >  Logout</Link>| 
      </>)}
       


        <Routes>
          <Route path="/" element={<Home/>}  />
          <Route path="/all-blogs" element={<AllBlogs/>} />
          <Route path="/single-blog/:id" element={<SingleBlog />} />

          <Route path="/register" element={<Register   registerIn={registerIn} />}/>
          <Route path="/login" element={<Login  loggedIn={loggedIn}/>}/>
        
          <Route path="/account" element={
            <PrivateRoute>
              <Account/>
            </PrivateRoute>
          }  />
          <Route path="/add-blog" element= {
            <PrivateRoute>
              <AddBlog/>
            </PrivateRoute>
          } />
          <Route path="/my-blog" element= {
            <PrivateRoute>
              <MyBlogs/>
            </PrivateRoute>
          } />
        
          
        </Routes>
      <ToastContainer/>
    </div>
     
     
  )
}

export default App;
