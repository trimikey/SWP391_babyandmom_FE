import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Spin, Button, Input, List, Avatar, Popconfirm, Form, message } from 'antd';
import { ArrowLeftOutlined, CommentOutlined, EditOutlined, DeleteOutlined, SendOutlined } from '@ant-design/icons';
import blogApi from '../services/api.blog';
import api from '../../config/axios';
import moment from 'moment';

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
    const [form] = Form.useForm();
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        // Kiểm tra token để xác định trạng thái đăng nhập
        const token = localStorage.getItem('token');
        
        // Nếu có token, lấy thông tin người dùng từ localStorage
        if (token) {
            try {
                // Kiểm tra tất cả các key có thể chứa thông tin người dùng
                const storedUserInfo = localStorage.getItem('userInfo');
                const userDetails = localStorage.getItem('userDetails'); 
                const user = localStorage.getItem('user');
                
                // Log để debug
              
                console.log('userInfo:', storedUserInfo);
                
                // Thử các nguồn dữ liệu khác nhau
                if (storedUserInfo) {
                    setUserInfo(JSON.parse(storedUserInfo));
                } else if (userDetails) {
                    setUserInfo(JSON.parse(userDetails));
                } else if (user) {
                    setUserInfo(JSON.parse(user));
                } else {
                    // Nếu không tìm thấy thông tin người dùng trong localStorage
                    // Gọi API để lấy thông tin người dùng
                    fetchUserInfo(token);
                }
            } catch (error) {
                console.error('Error loading user info:', error);
            }
        }
        
        const fetchBlogDetail = async () => {
            try {
                const data = await blogApi.getPostById(id);
                setBlog(data);
            } catch (error) {
                console.error('Error fetching blog detail:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogDetail();
        fetchComments();
    }, [id]);

    // Thêm hàm lấy thông tin người dùng từ API
    const fetchUserInfo = async (token) => {
        try {
            const response = await api.get('/user/profile', {
               
            });
            
            if (response.data) {
                setUserInfo(response.data);
                // Lưu thông tin người dùng vào localStorage để lần sau
                localStorage.setItem('userInfo', JSON.stringify(response.data));
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    const fetchComments = async () => {
        setCommentsLoading(true);
        try {
            const response = await api.get(`/comments/${id}`);
            setComments(response.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
            message.error('Không thể tải bình luận');
        } finally {
            setCommentsLoading(false);
        }
    };

    const handleCommentSubmit = async () => {
        if (!newComment.trim()) return;
        
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                message.warning('Bạn cần đăng nhập để bình luận');
                navigate('/login');
                return;
            }

            await api.post(`/comments/blog/${id}`, 
                { content: newComment }
            );
            
            setNewComment('');
            message.success('Bình luận đã được đăng');
            fetchComments();
        } catch (error) {
            console.error('Error posting comment:', error);
            message.error('Không thể đăng bình luận');
        }
    };

    const handleEditComment = (comment) => {
        setEditingComment(comment.id);
        setEditContent(comment.content);
    };

    const submitEditComment = async () => {
        try {
            const token = localStorage.getItem('token');
            await api.put(`/comments/${editingComment}`, 
                { content: editContent }
            );
                
            setEditingComment(null);
            message.success('Bình luận đã được cập nhật');
            fetchComments();
        } catch (error) {
            console.error('Error updating comment:', error);
            message.error('Không thể cập nhật bình luận');
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const token = localStorage.getItem('token');
            await api.delete(`/comments/${commentId}`, 
            );
            
            message.success('Bình luận đã được xóa');
            fetchComments();
        } catch (error) {
            console.error('Error deleting comment:', error);
            message.error('Không thể xóa bình luận');
        }
    };

    if (loading) {
        return (
            <div className="text-center py-8">
                <Spin size="large" />
            </div>
        );
    }

    console.log('Current userInfo:', userInfo);
    console.log('Has token:', !!localStorage.getItem('token'));

    // Kiểm tra xem người dùng đã đăng nhập hay chưa (dựa vào token chứ không phải userInfo)
    const isLoggedIn = !!localStorage.getItem('token');

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <Button 
                icon={<ArrowLeftOutlined />} 
                onClick={() => navigate('/blog')}
                className="mb-4"
            >
                Quay lại
            </Button>

            {blog && (
                <Card className="shadow-md mb-6">
                    <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
                    <div className="text-gray-500 mb-6">
                        Đăng ngày: {moment(blog.createdAt).format('DD/MM/YYYY HH:mm')}
                    </div>
                    <div 
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                </Card>
            )}

            {/* Comments Section */}
            <Card 
                title={
                    <div className="flex items-center">
                        <CommentOutlined className="mr-2" />
                        <span>Bình luận</span>
                    </div>
                }
                className="shadow-md"
            >
                {/* Comment Form */}
                <div className="mb-6">
                    <TextArea 
                        rows={4} 
                        placeholder="Viết bình luận của bạn..." 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        disabled={!isLoggedIn}
                        className="mb-3"
                    />
                    <Button 
                        type="primary" 
                        icon={<SendOutlined />} 
                        onClick={handleCommentSubmit}
                        disabled={!isLoggedIn || !newComment.trim()}
                    >
                        Đăng bình luận
                    </Button>
                    {!isLoggedIn && (
                        <div className="text-gray-500 mt-2">
                            Vui lòng <a href="/login" className="text-blue-500">đăng nhập</a> để bình luận
                        </div>
                    )}
                </div>

                {/* Comments List */}
                <List
                    loading={commentsLoading}
                    locale={{ emptyText: "Chưa có bình luận nào" }}
                    dataSource={comments}
                    renderItem={comment => (
                        <List.Item 
                            actions={
                                userInfo && userInfo.email === comment.userEmail ? [
                                    <Button 
                                        icon={<EditOutlined />}
                                        onClick={() => handleEditComment(comment)}
                                        type="link"
                                    />,
                                    <Popconfirm
                                        title="Bạn có chắc muốn xóa bình luận này?"
                                        onConfirm={() => handleDeleteComment(comment.id)}
                                        okText="Có"
                                        cancelText="Không"
                                    >
                                        <Button 
                                            icon={<DeleteOutlined />}
                                            type="link"
                                            danger
                                        />
                                    </Popconfirm>
                                ] : []
                            }
                        >
                            <List.Item.Meta
                                avatar={
                                    <Avatar 
                                        style={{ 
                                            backgroundColor: stringToColor(comment.userName || 'userInfo.userName'), 
                                            verticalAlign: 'middle' 
                                        }}
                                    >
                                        {comment.userName ? comment.userName[0].toUpperCase() : '?'}
                                    </Avatar>
                                }
                                title={
                                    <span className="font-medium">
                                        {comment.userName || 'Người dùng ẩn danh'}
                                        <span className="text-xs font-normal text-gray-500 ml-2">
                                            {moment(comment.createdAt).format('DD/MM/YYYY HH:mm')}
                                            {comment.updatedAt && comment.updatedAt !== comment.createdAt && 
                                                " (đã chỉnh sửa)"}
                                        </span>
                                    </span>
                                }
                                description={
                                    editingComment === comment.id ? (
                                        <div>
                                            <TextArea 
                                                rows={3} 
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                                className="mb-2"
                                            />
                                            <Button 
                                                type="primary" 
                                                size="small" 
                                                onClick={submitEditComment}
                                                className="mr-2"
                                            >
                                                Cập nhật
                                            </Button>
                                            <Button 
                                                size="small" 
                                                onClick={() => setEditingComment(null)}
                                            >
                                                Hủy
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="whitespace-pre-wrap">{comment.content}</div>
                                    )
                                }
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
