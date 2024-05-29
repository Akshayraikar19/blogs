import React, { useState } from "react";
import axios from "../config/axios";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from "react-router-dom";

export default function PostForm() {
    const [postForm, setPostForm] = useState({
        title: '',
        content: '',
        featuredImage: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPostForm({ ...postForm, [name]: value });
    };

    const handleContentChange = (value) => {
        setPostForm({ ...postForm, content: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/posts', postForm, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });
            console.log(response.data);
            setPostForm({
                title: '',
                content: '',
                featuredImage: ''
            });
            alert('Post is created')
            navigate('/list7-blogs');
        } catch (error) {
            console.log(error);
            alert('Failed to create post');
        }
    };

    return (
        <div>
            <h2>Create New Post</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={postForm.title}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label htmlFor="content">Content</label>
                    <ReactQuill
                        value={postForm.content}
                        onChange={handleContentChange}
                        theme="snow"
                    />
                </div>

                <div>
                    <label htmlFor="featuredImage">Featured Image URL</label>
                    <input
                        type="text"
                        id="featuredImage"
                        name="featuredImage"
                        value={postForm.featuredImage}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit">Post</button>
            </form>
        </div>
    );
}
