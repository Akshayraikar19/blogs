import { useState } from "react"
import validator from "validator"
import axios from "../config/axios"
import {useNavigate} from 'react-router-dom'
import _ from 'lodash'

export default function Register({registerIn}){
    const navigate=useNavigate()
    const [form,setform]=useState({
        username:'',
        email:'',
        password:'',
        bio:'',

        serverErrors:null,
        clientErrors:{}
    })
    const errors = {}

    const runValidations = () => {
        
        if(form.username.trim().length === 0) {
            errors.username = 'username is required'
        }

        if(form.email.trim().length === 0) {
            errors.email = 'email is required'
        } else if(!validator.isEmail(form.email)) {
            errors.email = 'invalid email format'
        }

        if(form.password.trim().length === 0) {
            errors.password = 'password is required'
        } else if(form.password.trim().length < 8 || form.password.trim().length > 128) {
            errors.password = 'password should be between 8 - 128 characters'
        }

        if(form.bio.trim().length === 0) {
            errors.bio = 'role is required'
        }

      
    }

    const handleChange=(e)=>{
        const {name,value}=e.target
        setform({...form,[name]:value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData =  _.pick(form, ['username','email', 'password','bio','profilepicture'])
        
        runValidations()

        if(Object.keys(errors).length === 0) {
            try {
                const response = await axios.post('/api/users/register', formData) 
                console.log(response.data)
                registerIn()
                navigate('/login')
            } catch(err) {
                console.log(err)
                setform({...form,serverErrors:err})
            }
        } else {
            setform({...form,clientErrors:errors})
        }
    }

    const displayErrors = () => {
        let result 
        if(typeof form.serverErrors == 'string') {
            result = <p> { form.serverErrors } </p>
        } else {
            result = (
                <div>
                    <h3>Theses errors prohibitted the form from being saved: </h3>
                    <ul>
                        { form.serverErrors.map((ele, i) => {
                            return <li key={i}> { ele.msg } </li>
                        })}
                    </ul>
                </div>
            )
        }
        return result 
    }

    return (
        <div>
            <h1>Register With Us</h1>
            
                <form onSubmit={handleSubmit}>
                <label htmlFor="username">Enter username</label><br />
                <input 
                    type="text" 
                    value={form.username} 
                    onChange={handleChange}
                    name="username" 
                    id="username"
                />
                { form.clientErrors.username && <span> { form.clientErrors.username } </span>}
                 <br />
                <label htmlFor="email">Enter email</label><br />
                <input 
                    type="text" 
                    value={form.email} 
                    onChange={handleChange}
                    name="email" 
                    id="email"
                />
                { form.clientErrors.email && <span> { form.clientErrors.email } </span>}
                 <br />

                <label htmlFor="password">Enter password</label><br />
                <input 
                    type="password" 
                    value={form.password} 
                    onChange={handleChange} 
                    name="password"
                    id="password"
                /> 
                { form.clientErrors.password && <span> { form.clientErrors.password } </span> }
                <br />
                <label htmlFor="bio">Enter Bio</label><br />
                <input 
                    type="text" 
                    value={form.bio} 
                    onChange={handleChange}
                    name="bio" 
                    id="bio"
                />
                { form.clientErrors.bio && <span> { form.clientErrors.bio } </span>}
                 <br />
              
                <input type="submit" /> 
            </form>
            { form.serverErrors && displayErrors() } 

     </div>)
}



