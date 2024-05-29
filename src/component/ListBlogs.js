import axios from "../config/axios"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"

export default function ListBlogs() {
    const navigate = useNavigate()
    const [posts, setPosts] = useState('')

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await axios.get('/api/posts')
            setPosts(response.data)
        }
        fetchPosts()
    }, [])

    const handleClick = (id) => {
        navigate(`/single-blog/${id}`)
    }

    return (
        <div>
            <h1>List Blogs - {posts.length}</h1>
            <ul>
                {posts.length !== 0 ? ( // if the post length is greater than zero than map posts
                    posts.map((ele) => (
                        <li key={ele._id}>
                            <Link to={`/single-blog/${ele._id}`}>
                                {ele.title}
                            </Link>
                            <button onClick={() => handleClick(ele._id)}>View</button>
                        </li>
                    ))
                ) : (
                    <p>No blogs at this moment</p>
                )}
            </ul>
        </div>
    )
}
