import axios from '../config/axios'
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import _ from 'lodash'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';



export default function AddBlog(){
    const { dispatch } = useAuth();

const [title, setTitle] = useState('')
const [content,setContent]=useState('')
const [img, setImg] = useState('')
const [serverErrors, setServerErrors] = useState('')
const [clientErrors, setClientErrors] = useState('')
    const errors = {}

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
            title: title,
            content: content,
            img: img
        }

        
        runValidations()
        if (Object.keys(errors).length === 0) {
            try {
                const response = await axios.post('/api/posts', formData, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                console.log(response.data);
                alert('blog Created');
                // dispatch({ type: 'JOB', payload: response.data });
            } catch (err) {
                console.log(err);
                setServerErrors(err.response.data)
            }
        } else {
            setClientErrors(errors);
        }
    };

    
 return (
    <div>
        <h2>Add Blog Post</h2>
        { serverErrors && (
                <>
                    <h3>These error/s prohibitted the form from being saved: </h3>
                    <ul>
                        { serverErrors.map((err, i) => {
                            return <li key={i}> { err.msg } </li>
                        })}
                    </ul>
                </>
            )}

        <form onSubmit={handleSubmit}>
                <label htmlFor="title">Enter title</label><br />
                <input type="text" id="title" value={title}  onChange={e => setTitle(e.target.value)} />
                { clientErrors.title && <span style={{ color: 'red'}}>{ clientErrors.title} </span>}
                <br />
                

                <label htmlFor="content">Enter Content</label><br />
               
                <ReactQuill  id="content" value={content}  onChange={setContent}/>
                { clientErrors.content && <span style={{ color: 'red'}}>{ clientErrors.content} </span>}
                <br />


                <label htmlFor="img">Enter Img</label><br />
                <input type="text" id="img" value={img}  onChange={e=> setImg(e.target.value)} />
                { clientErrors.img && <span style={{ color: 'red'}}>{ clientErrors.img} </span>}<br />

                <input type="submit" />
          </form>
    </div>
 )
}




