import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/FeedPage.css';

const API_BASE_URL = 'http://localhost:3001/api';

const FeedPage = ({ user }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [commentingOn, setCommentingOn] = useState(null);
    const [commentCache, setCommentCache] = useState({});
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchFeed = async () => {
            if (!token) {
                setError("No hay token de autenticación.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/posts/feed`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        throw new Error("No autorizado. Verifica tu token.");
                    }
                    throw new Error("Error al obtener el feed.");
                }

                const data = await response.json();
                setPosts(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchFeed();
    }, [token]);

    const fetchCommentById = async (commentId) => {
        if (commentCache[commentId]) {
            return commentCache[commentId];
        }

        try {
            const response = await fetch(`${API_BASE_URL}/posts/comments/${commentId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error al obtener el comentario');
            }

            const data = await response.json();
            setCommentCache((prevCache) => ({ ...prevCache, [commentId]: data }));
            return data;
        } catch (error) {
            console.error('Error al cargar comentario:', error);
        }
    };

    const handleLike = async (postId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const updatedPost = await response.json();
                setPosts(posts.map(post =>
                    post._id === postId ? updatedPost : post
                ));
            }
        } catch (error) {
            console.error('Error al dar like:', error);
        }
    };

    const handleComment = async (postId) => {
        if (!newComment.trim()) return;
    
        try {
            const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: newComment }),
            });
    
            if (response.ok) {
                const comment = await response.json();
    
                setCommentCache((prevCache) => ({
                    ...prevCache,
                    [comment._id]: comment,
                }));
    
                setPosts((prevPosts) =>
                    prevPosts.map((post) =>
                        post._id === postId
                            ? {
                                  ...post,
                                  comments: [...post.comments, comment._id],
                              }
                            : post
                    )
                );
    
                setNewComment('');
                setCommentingOn(null);
            }
        } catch (error) {
            console.error('Error al comentar:', error);
        }
    };

    if (!user) {
        return <div>Inicia sesión para ver el contenido del feed.</div>;
    }

    if (loading) return <div className="loading">Cargando publicaciones...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="feed-container">
            <div className="header">
                <h1>Fakestagram</h1>
            </div>

            {posts.length === 0 ? (
                <div className="empty-feed">
                    <h2>No hay publicaciones</h2>
                    <p>¡Sigue a otros usuarios y empieza a ver sus publicaciones!</p>
                </div>
            ) : (
                <div className="posts-container">
                    {posts.map(post => (
                        <div key={post._id} className="post-card">
                            <div className="post-header">
                                <div className="post-header-left">
                                    <img 
                                        src={post.user?.profilePicture || '/default-avatar.png'} 
                                        alt={post.user?.username || 'Usuario'} 
                                        className="user-avatar"
                                    />
                                    <span className="username">{post.user?.username || 'Usuario desconocido'}</span>
                                </div>
                                <i className="fas fa-ellipsis-h"></i>
                            </div>

                            <img 
                                src={`http://localhost:3001/${post.imageUrl}`} 
                                alt="Post content" 
                                className="post-image"
                            />

                            <div className="post-actions">
                                <button
                                    onClick={() => handleLike(post._id)}
                                    className={`like-button ${post.likes.includes(user._id) ? 'liked' : ''}`}
                                >
                                    <i className={`${post.likes.includes(user._id) ? 'fas' : 'far'} fa-heart`}></i>
                                </button>
                                <button
                                    onClick={() => setCommentingOn(post._id)}
                                    className="comment-button"
                                >
                                    <i className="far fa-comment"></i>
                                </button>
                            </div>

                            <div className="likes-count">
                                {post.likes.length} Me gusta
                            </div>

                            {post.caption && (
                                <div className="post-caption">
                                    <span className="username">{post.user?.username}</span> {post.caption}
                                </div>
                            )}

                            <div className="comments-section">
                                {post.comments.map((commentId) => {
                                    const comment = commentCache[commentId]; 
                                    if (!comment) {
                                        fetchCommentById(commentId);
                                        return <span key={commentId}>Cargando comentario...</span>;
                                    }

                                    return (
                                        <div key={commentId} className="comment">
                                            <span className="username">{comment.user?.username || 'Usuario'}</span> {comment.content}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="timestamp">
                                hace 2 horas
                            </div>

                            <div className="comment-input-container">
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Añade un comentario..."
                                    className="comment-input"
                                />
                                <button
                                    onClick={() => handleComment(post._id)}
                                    className="send-comment-button"
                                    disabled={!newComment.trim()}
                                >
                                    Publicar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="navigation-bar">
                <div className="nav-item active icon home-icon" onClick={() => navigate('/feed')}></div>
                <div className="nav-item active icon search-icon" onClick={() => navigate('/search')}></div>
                <div className="nav-item active icon create-icon" onClick={() => navigate('/upload')}></div>
                <div className="nav-item active icon notificacion-icon" onClick={() => navigate('/notifications')}></div>
                <div className="nav-item active icon profile-icon" onClick={() => navigate('/profile')}></div>
            </div>
        </div>
    );
};

export default FeedPage;
