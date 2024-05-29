import React from 'react';
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import axios from '../config/axios';

export default function Account() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const response = await axios.get('/api/users/profile', {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });
            setProfile(response.data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleUpload = async (event) => {
        event.preventDefault();
        const files = event.target.files;
        if (!files || files.length === 0) {
            console.error('No file selected');
            return;
        }
        const file = files[0];
        const formData = new FormData();
        formData.append('profile', file);
        try {
            await axios.post('/api/users/upload-profile-picture', formData, {
                headers: {
                    Authorization: localStorage.getItem('token'),
                    'Content-Type': 'multipart/form-data'
                }
            });
            // Refresh profile after upload
            fetchProfile(); // Fetch updated profile data
        } catch (error) {
            console.error('Error uploading profile:', error);
        }
    };

    return (
        <div>
            <h1>Account</h1>
            {user && (
                <>
                    <h4>Username: {user.account.username}</h4>
                    <h4>Email: {user.account.email}</h4>
                  
                </>
            )}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    {profile ? ( // Show profile if it exists
                        <>
                            <h4>Profile:</h4>
                            <img 
                                src={`http://localhost:5000/${profile.profilePicture}`} // Assuming the profilePicture field contains the correct path
                                alt="Profile" 
                                style={{ width: '150px', height: '150px', objectFit: 'cover' }} 
                            />
                        </>
                    ) : (
                        <div>
                            <h4>No profile found.</h4>
                            <h4>Please upload your profile:</h4>
                            <input type="file" name="profile" accept="image/*" onChange={handleUpload} />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
