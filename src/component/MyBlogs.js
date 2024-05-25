import { useState,useEffect } from "react";
import axios from "../config/axios";
import { useNavigate } from "react-router-dom";
export default function MyBlogs(){
    const [myBlogs,setMyBlogs]=useState([])
    const [title,setTitle]=useState('')
    const [content,setContent]=useState('')
    const [img,setImg]=useState('')
    const [serverErrors,setServerErrors]=useState(null)
    const [clientErrors,setClientErrors]=useState({})
    const [edit,setEdit]=useState(false)
    const [id,setId]=useState(null)
    const navigate=useNavigate()

    useEffect(()=>{
        const fun=async()=>{
       try {
            const response=await axios.get('/api/posts/myPosts',{
            headers:{
                Authorization:localStorage.getItem('token')
            }
        })
        console.log(response.data)
        setMyBlogs(response.data)
    }catch(err){
        console.log(err)
       setServerErrors(err.response.data.errors)
    }
 }
 fun()
},[])

const errors={}

    const runValidations = () => {
        
        if(title.trim().length === 0) {
            errors.title = 'title is required'
        }

        if(content.trim().length === 0) {
            errors.content = 'content is required'
        }

        if(img.trim().length === 0) {
            errors.img = 'img is required'
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = {
            title:title,
            content:content,
            img:img
        }
        
        runValidations()

        if(Object.keys(errors).length === 0) {
            try {
                const response = await axios.put(`/api/posts/${id}`, formData,
                {
                    headers:{
                        Authorization:localStorage.getItem('token')
                    }
                }
                ) 
                const newArr=myBlogs.map(ele=>{
                    if(ele._id==id){
                        return response.data
                    }else{
                        return ele
                    }
                })
                setMyBlogs(newArr)
            } catch(err) {
                console.log(err.response.data)
                setServerErrors(err.response.data)
            }
        } else {
            setClientErrors(errors)
        }
    }

const handleRemove=async(id)=>{
   try{ const response=await axios.delete(`/api/posts/${id}`,{
        headers:{
            Authorization:localStorage.getItem('token')
        }
    })

    const newArr=myBlogs.filter(ele=>{
        return ele._id!=id
    })
    setMyBlogs(newArr)

  }catch(err){
    console.log(err)
  }
}

const handleToggle=(id)=>{
    setEdit(!edit)
    console.log(id)
    setId(id)
}



    return (
    <div>
        <h1>MyBlogs</h1>
        {
            myBlogs && 
            myBlogs.map((ele,i)=>{
                return (<>
                <h4 key={ele._id}> Title : {ele.title}</h4>
                <p > Content : {ele.content}</p>
                <button onClick={(e)=>{handleToggle(ele._id)}}>{ edit ? 'Cancel' : 'Update' }</button>
                <button onClick={(e)=>{handleRemove(ele._id)}}>Delete</button>
               <button onClick={() =>{navigate(`/single-blog/${ele._id}`)}}>View</button>
                </>
            )
            })
        }
        {
                edit &&  <form onSubmit={handleSubmit}>
                <label htmlFor="title">Enter title</label><br />
                    <input 
                        type="text" 
                        value={title} 
                        onChange={e=>{setTitle(e.target.value)}} 
                        id="title"
                    /> 
                    { clientErrors.title && <span> { clientErrors.title }</span>}
            
                    <br />
    
                    <label htmlFor="content">Enter content</label><br />
                    <input 
                        type="textarea" 
                        value={content} 
                        onChange={e=>{setContent(e.target.value)}} 
                        id="content"
                        disabled={!edit}
                    /> 
                    { clientErrors.content && <span> { clientErrors.content }</span>}
            
                    <br />
                    <label htmlFor="img">Enter img</label><br />
                    <input 
                        type="img" 
                        value={img} 
                        onChange={e=>{setImg(e.target.value)}} 
                        id="img"
                        disabled={!edit}
                    /> 
                    { clientErrors.img && <span> { clientErrors.img }</span>}                   
                    <br />
                    <input type="submit"/>
                </form>
            }
        <ul>
            { serverErrors && serverErrors.map((ele, i) => {
                return <li key={i}> { ele.msg } </li>
            })}
        </ul>
    </div>)
}