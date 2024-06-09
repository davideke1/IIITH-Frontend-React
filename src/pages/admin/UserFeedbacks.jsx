// FeedbackPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FeedbackPage = () => {
    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        axios.get('/api/feedback/')
            .then(response => {
                setFeedbacks(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the feedbacks!', error);
            });
    }, []);

    return (
        <div>
            <h1>User Feedback</h1>
            <table>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Feedback</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {feedbacks.map(feedback => (
                        <tr key={feedback.id}>
                            <td>{feedback.user.username}</td>
                            <td>{feedback.feedback}</td>
                            <td>{new Date(feedback.created_at).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FeedbackPage;
