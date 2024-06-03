import { useState, useEffect } from "react";
import axios from "../config/axios";
import { Link } from "react-router-dom";

export default function MyBlogs() {
    const [myblogs, setMyBlogs] = useState([]);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [comments, setComments] = useState([]);
    const [editBlogId, setEditBlogId] = useState(null);
    const [editBlogText, setEditBlogText] = useState("");
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [blogToDeleteId, setBlogToDeleteId] = useState(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            const response = await axios.get("/api/posts/myposts", {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            });
            setMyBlogs(response.data);
        };
        fetchBlogs();
    }, []);

    const handleEditBlogSubmit = async () => {
        try {
            const response = await axios.put(
                `/api/posts/${editBlogId}`,
                { content: editBlogText },
                { headers: { Authorization: localStorage.getItem("token") } }
            );
            const updatedBlog = response.data;
            setMyBlogs(myblogs.map(blog => blog._id === updatedBlog._id ? updatedBlog : blog));
            setEditBlogId(null);
            setEditBlogText("");
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteConfirmationOpen = (blogId) => {
        setBlogToDeleteId(blogId);
        setDeleteConfirmationOpen(true);
    };

    const handleDeleteConfirmationClose = () => {
        setDeleteConfirmationOpen(false);
        setBlogToDeleteId(null);
    };

    const handleDeleteBlog = async () => {
        try {
            await axios.delete(`/api/posts/${blogToDeleteId}`, {
                headers: { Authorization: localStorage.getItem("token") }
            });
            setMyBlogs(myblogs.filter(blog => blog._id !== blogToDeleteId));
            handleDeleteConfirmationClose();
        } catch (err) {
            console.error(err);
        }
    };

    const fetchComments = async (blogId) => {
        try {
            const response = await axios.get(`/api/posts/${blogId}/comments`);
            setComments(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleBlogClick = async (blog) => {
        setSelectedBlog(blog);
        fetchComments(blog._id);
    };

    return (
        <div>
            <h1>My Blogs</h1>
            {myblogs.length !== 0 ? (
                <ul>
                    {myblogs.map((blog) => (
                        <li key={blog._id}>
                            <Link onClick={() => handleBlogClick(blog)}>{blog.title}</Link>
                            {selectedBlog && selectedBlog._id === blog._id && (
                                <div>
                                    <h2>Title: {selectedBlog.title}</h2>
                                    <p>Content: {selectedBlog.content}</p>
                                     

                                    {editBlogId === blog._id ? (
                                        <form onSubmit={(e) => { e.preventDefault(); handleEditBlogSubmit(); }}>
                                            <textarea
                                                value={editBlogText}
                                                onChange={(e) => setEditBlogText(e.target.value)}
                                                placeholder="Edit your blog"
                                            ></textarea><br />
                                            <button type='submit'>Submit</button>
                                        </form>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => { setEditBlogId(blog._id); setEditBlogText(blog.content); }}>
                                                Edit
                                            </button>
                                            <button onClick={() => handleDeleteConfirmationOpen(blog._id)}>Delete</button>
                                        </>
                                    )}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No blogs found. Create your blog.</p>
            )}

            {deleteConfirmationOpen && (
                <div>
                    <p>Are you sure you want to delete this blog?</p>
                    <button onClick={handleDeleteBlog}>Delete</button>
                    <button onClick={handleDeleteConfirmationClose}>Cancel</button>
                </div>
            )}
                                    <h3>Comments</h3>
                                    <ul>
                                        {comments.length !== 0 ? comments.map(comment => (
                                            <li key={comment._id}>{comment.content} - commented by - {comment?.author?.username}</li>
                                        )) : (
                                            <p>No comments yet</p>
                                        )}
                                    </ul>
                                   
        </div>
    );
}
