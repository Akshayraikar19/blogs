import { useState,useEffect } from "react"
import axios from "../config/axios"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"

export default function AllBlogs() {
    const [blogs, setBlogs] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get('/api/posts')
                setBlogs(response.data)
            } catch(err) {
                alert(err)
            }
        })()
    }, [])
     

    const handleClick=(id) => {
       navigate(`/single-blog/${id}`)
    }


    return(
        <div>
            <h2>All blogs - { blogs.length }</h2>
            <ul>
                {blogs.map((ele) => {
                    return <li key={ele._id}><Link to={`/single-blog/${ele._id}`}>{ele.title}</Link>
                     <button onClick={() => {handleClick(ele._id)}}>view</button></li>

                })}
            </ul>
           

        </div>
    )
}