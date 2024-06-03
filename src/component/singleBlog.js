import React, { useEffect, useState } from "react";
import axios from "../config/axios"
import { useParams, useNavigate } from "react-router-dom";

export default function SingleBlog() {
    const navigate = useNavigate();
    const { id } = useParams(); // extracting id from url through params
    const [post, setPost] = useState(null);
    const [commentText, setCommentText] = useState("");
    const [comments, setComments] = useState([]);
    const [editCommentId, setEditCommentId] = useState(null);
    const [editCommentText, setEditCommentText] = useState("");
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [commentToDeleteId, setCommentToDeleteId] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchPost = async () => {
        try {
            const response = await axios.get(`/api/posts/${id}`);
            setPost(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPost();
    }, [id]);

    const handleUpload = async (event) => {
        event.preventDefault();
        const files = event.target.files;
        if (!files || files.length === 0) {
            console.error('No file selected');
            return;
        }
        const file = files[0];
        const formData = new FormData();
        formData.append('postPicture', file);
        try {
            await axios.post(`/api/posts/${id}/upload-post`, formData, {
                headers: {
                    Authorization: localStorage.getItem('token'),
                    'Content-Type': 'multipart/form-data'
                }
            });
            // Refresh profile after upload
            fetchPost(); // Fetch updated profile data
        } catch (error) {
            console.error('Error uploading postPicture:', error);
        }
    };

    const fetchComments = async () => {
        try {
            const response = await axios.get(`/api/posts/${id}/comments`);
            setComments(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [id]);

    const handleCommentSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post(
                `/api/posts/${id}/comments`,
                { content: commentText }, // in form data we are fetching only content
                { headers: { Authorization: localStorage.getItem("token") } }
            );
            setCommentText("");
            fetchComments(); // Fetch comments again to include the new comment
        } catch (err) {
            console.error(err);
        }
    };

    const handleEditCommentSubmit = async (commentId) => {
        try {
            const response = await axios.put(
                `/api/posts/${id}/comments/${commentId}`,
                { content: editCommentText },
                { headers: { Authorization: localStorage.getItem("token") } }
            );
            const updatedComment = response.data;
            setComments(comments.map(comment => {
                if (comment._id === updatedComment._id) {
                    return {
                        ...updatedComment,
                        author: comment.author // Preserve author information
                    };
                }
                return comment;
            }));
            setEditCommentId(null);
            setEditCommentText("");
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteConfirmationOpen = (commentId) => {
        setCommentToDeleteId(commentId);
        setDeleteConfirmationOpen(true);
    };

    const handleDeleteConfirmationClose = () => {
        setDeleteConfirmationOpen(false);
        setCommentToDeleteId(null);
    };

    const handleDeleteComment = async () => {
        try {
            await axios.delete(`/api/posts/${id}/comments/${commentToDeleteId}`, {
                headers: { Authorization: localStorage.getItem("token") }
            });
            setComments(comments.filter(comment => comment._id !== commentToDeleteId));
            handleDeleteConfirmationClose();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h1>Single Blog</h1>
            {post && (
                <>
                    <h2>Title: {post.title}</h2>
                    <p>Content: {post.content}</p>
                </>
            )}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    {post ? (
                        <>
                            <h4>Post:</h4>
                            <img 
                                src={`http://localhost:5000/${post.postPicture}`} // Assuming the postPicture field contains the correct path
                                alt="post" 
                                style={{ width: '150px', height: '150px', objectFit: 'cover' }} 
                            />
                        </>
                    ) : (
                        <div>
                            <h4>No post found.</h4>
                            <h4>Please upload your post picture:</h4>
                            <input type="file" name="postPicture" accept="image/*" onChange={handleUpload} />
                        </div>
                    )}
                </>
            )}

            <h2>Comments</h2>
            <form onSubmit={handleCommentSubmit}>
                <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write your comment here"
                ></textarea> <br/>
                {localStorage.getItem('token') ? <button onClick={handleCommentSubmit}>Comment</button> : <h2>Sign in to comment</h2>}
            </form>

            <ul>
                {comments.map((comment) => (
                    <li key={comment._id}>
                        <p>{comment.content} - commented By - {comment?.author?.username}</p>

                        {editCommentId === comment._id ? (
                            <form onSubmit={(e) => { e.preventDefault(); handleEditCommentSubmit(comment._id); }}>
                                <textarea
                                    value={editCommentText}
                                    onChange={(e) => setEditCommentText(e.target.value)}
                                    placeholder="Edit your comment"
                                ></textarea> <br />
                                {localStorage.getItem('token') ? <button onClick={handleEditCommentSubmit}>Submit</button> : <h2>Sign in to edit comment</h2>}
                            </form>
                        ) : (
                            <>
                                <button
                                    onClick={() => { setEditCommentId(comment._id); setEditCommentText(comment.content); }}>
                                    Edit
                                </button>
                                <button onClick={() => handleDeleteConfirmationOpen(comment._id)}>Delete</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>

            {deleteConfirmationOpen && (
                <div>
                    <p>Are you sure you want to delete this comment?</p>
                    {localStorage.getItem('token') ? <button onClick={handleDeleteComment}>Submit</button> : <h2>Sign in to delete</h2>}
                    <button onClick={handleDeleteConfirmationClose}>Cancel</button>
                </div>
            )}
        </div>
    );
}
