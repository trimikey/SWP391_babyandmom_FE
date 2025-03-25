import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Spin, Button, Input, List, Avatar, Popconfirm, message } from 'antd';
import { ArrowLeftOutlined, CommentOutlined, EditOutlined, DeleteOutlined, SendOutlined } from '@ant-design/icons';
import api from '../../config/axios';
import moment from 'moment';
import backgroundImage from '../../assets/background.jpg';

const { TextArea } = Input;

const BlogDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [editingComment, setEditingComment] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUserInfo = localStorage.getItem('userInfo');
        if (token) {
            setUserInfo(storedUserInfo ? JSON.parse(storedUserInfo) : fetchUserInfo(token));
        }
        fetchBlogDetail();
        fetchComments();
    }, [id]);

    const fetchUserInfo = async (token) => {
        try {
            const response = await api.get('/user/profile');
            localStorage.setItem('userInfo', JSON.stringify(response.data));
            setUserInfo(response.data);
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    const fetchBlogDetail = async () => {
        try {
            const response = await api.get(`/blogs/${id}`);
            if (response.data) {
                setBlog(response.data);
            } else {
                message.error('Không tìm thấy bài viết');
                navigate('/blog');
            }
        } catch (error) {
            console.error('Error fetching blog detail:', error);
            message.error('Không thể tải bài viết');
            navigate('/blog');
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        setCommentsLoading(true);
        try {
            const response = await api.get(`/comments/${id}`);
            setComments(response.data);
        } catch (error) {
            message.error('Không thể tải bình luận');
        } finally {
            setCommentsLoading(false);
        }
    };

    const handleCommentSubmit = async () => {
        if (!newComment.trim()) return;
        if (!userInfo) {
            message.warning('Bạn cần đăng nhập để bình luận');
            navigate('/login');
            return;
        }
        try {
            await api.post(`/comments/blog/${id}`, { content: newComment });
            setNewComment('');
            message.success('Bình luận đã được đăng');
            fetchComments();
        } catch {
            message.error('Không thể đăng bình luận');
        }
    };

    const handleEditComment = (comment) => {
        setEditingComment(comment.id);
        setEditContent(comment.content);
    };

    const submitEditComment = async () => {
        try {
            await api.put(`/comments/${editingComment}`, { content: editContent });
            setEditingComment(null);
            message.success('Bình luận đã được cập nhật');
            fetchComments();
        } catch {
            message.error('Không thể cập nhật bình luận');
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await api.delete(`/comments/${commentId}`);
            message.success('Bình luận đã được xóa');
            fetchComments();
        } catch {
            message.error('Không thể xóa bình luận');
        }
    };

    if (loading) return <Spin className="flex justify-center py-8" size="large" />;

    return (
        <div className="min-h-screen bg-cover p-6" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/blog')} className="mb-4">
                Quay lại
            </Button>
            <Card className="shadow-md mb-6">
                <h1 className="text-3xl font-bold mb-4">{blog?.title}</h1>
                <div className="text-gray-500 mb-6">Đăng ngày: {moment(blog?.createdAt).format('DD/MM/YYYY HH:mm')}</div>
                <div dangerouslySetInnerHTML={{ __html: blog?.content }} />
            </Card>
            <Card title={<><CommentOutlined className="mr-2" /> Bình luận</>} className="shadow-md">
                <TextArea rows={4} placeholder="Viết bình luận..." value={newComment} onChange={(e) => setNewComment(e.target.value)} disabled={!userInfo} className="mb-3" />
                <Button type="primary" icon={<SendOutlined />} onClick={handleCommentSubmit} disabled={!userInfo || !newComment.trim()}>
                    Đăng bình luận
                </Button>
                {!userInfo && <div className="text-gray-500 mt-2">Vui lòng <a href="/login" className="text-blue-500">đăng nhập</a> để bình luận</div>}
                <List
                    loading={commentsLoading}
                    locale={{ emptyText: "Chưa có bình luận nào" }}
                    dataSource={comments}
                    renderItem={comment => (
                        <List.Item 
                            actions={
                                userInfo?.id === comment.userId ? [
                                    <Button icon={<EditOutlined />} onClick={() => handleEditComment(comment)} type="link" />,
                                    <Popconfirm title="Xóa bình luận?" onConfirm={() => handleDeleteComment(comment.id)} okText="Có" cancelText="Không">
                                        <Button icon={<DeleteOutlined />} type="link" danger />
                                    </Popconfirm>
                                ] : []
                            }
                        >
                            <List.Item.Meta
                                avatar={<Avatar style={{ backgroundColor: stringToColor(comment.userName), verticalAlign: 'middle' }}>{comment.userName?.[0]?.toUpperCase() || '?'}</Avatar>}
                                title={<span className="font-medium">{comment.userName || 'Người dùng ẩn danh'} <span className="text-xs font-normal text-gray-500 ml-2">{moment(comment.createdAt).format('DD/MM/YYYY HH:mm')}</span></span>}
                                description={editingComment === comment.id ? (
                                    <div>
                                        <TextArea rows={3} value={editContent} onChange={(e) => setEditContent(e.target.value)} className="mb-2" />
                                        <Button type="primary" size="small" onClick={submitEditComment} className="mr-2">Cập nhật</Button>
                                        <Button size="small" onClick={() => setEditingComment(null)}>Hủy</Button>
                                    </div>
                                ) : (
                                    <div className="whitespace-pre-wrap">{comment.content}</div>
                                )}
                            />
                        </List.Item>
                    )}
                />
            </Card>
        </div>
    );
};

// Generate a color based on string
function stringToColor(string) {
    // Kiểm tra nếu string là null hoặc undefined
    if (!string) {
        return '#CCCCCC'; // Trả về màu mặc định nếu string không tồn tại
    }
    
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
}

export default BlogDetail; 
