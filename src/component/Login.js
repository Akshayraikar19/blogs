import axios  from "../config/axios"
import {useFormik}from "formik"
import * as yup from "yup"
import { useNavigate } from "react-router-dom"
import {useState}from "react"
import {useAuth}from "../context/AuthContext"


const loginValidationSchema=yup.object({
    email:yup.string().required().email(),
    password:yup.string().required().min(8).max(64)
})

export default function Login ({loggedIn}){
    const {dispatch}=useAuth()
    const navigate=useNavigate()
    const [serverErrors,setServerErrors]=useState('')

    const formik=useFormik({
        initialValues:{
            email:"",
            password:""
        },
        validateOnChange:false,
        validationSchema:loginValidationSchema,
        onSubmit:async(values)=>{
            try{
                const response=await axios.post("/api/users/login",values)
                localStorage.setItem("token",response.data.token)
                loggedIn()
                 console.log(response.data)
                const userResponse=await axios.get("/api/users/profile",{
                    headers:{
                        Authorization:localStorage.getItem("token")
                    }
                    
                })
                console.log("userResponse",userResponse.data)
                dispatch({type:"LOGIN",payload:{account:userResponse.data}})
                
                 navigate("/")
            }
            catch(e){
                setServerErrors(e.response.data.errors)
            }
        }
    })
    return (
        <div>
           <h1>Login Here</h1>
           {serverErrors && <b>
            {serverErrors}</b>}

            <form onSubmit={formik.handleSubmit}>
                <label>Enter Email</label>
                <input type="text"
                value={formik.values.email}
                name="email"
                onChange={formik.handleChange}/>
                {formik.errors.email}
                <br/>

                <label>Enter Password</label>
                <input type="password"
                value={formik.values.password}
                name="password"
                onChange={formik.handleChange}/>
                {formik.errors.password}
                <br/>
                <input type="submit"/>
            </form>
        </div>
    )
}