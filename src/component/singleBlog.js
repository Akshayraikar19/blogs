import { useParams } from "react-router-dom"
import axios from '../config/axios'
import { useState, useEffect } from "react"

export default function SingleBlog(){
    const {id} = useParams()
    const [blog, setBlog] = useState(null)




    useEffect(() => {
        (async() => {
            try { 
                const response = await axios.get(`/api/posts/${id}`)
                setBlog(response.data) 
            }catch(err) {
                alert(err) 
            }
        })();
    }, [])

    return(
        <div>
           <h1>single blog </h1> 
            
           {blog && (
              <div>
                <h3>Title:{blog.title}</h3>
                <h3>content:{blog.content}</h3>
                </div>
           )}
        </div>
    )
}