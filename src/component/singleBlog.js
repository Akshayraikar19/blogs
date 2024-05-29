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

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`/api/posts/${id}`);
                setPost(response.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchPost();
    }, [id]);

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
                    <h2> Title:{post.title}</h2>
                    <p> Content:{post.content}</p>
                </>
            )}

            <h2>Comments</h2>
            <form onSubmit={handleCommentSubmit}>
                <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write your comment here"
                ></textarea> <br/>
                 { localStorage.getItem('token') ? <button onClick={handleCommentSubmit}>comment</button>  : <h2>Sign in to comment</h2> }
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
                                ></textarea>  <br />
                                 { localStorage.getItem('token') ? <button onClick={handleEditCommentSubmit}>submit</button>  : <h2>Sign in to  Edit comment</h2> }
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
                    { localStorage.getItem('token') ? <button onClick={handleDeleteComment}>submit</button>  : <h2>Sign in to delete</h2> }
                    <button onClick={handleDeleteConfirmationClose}>Cancel</button>
                </div>
            )}

               
            </div>
    )}
