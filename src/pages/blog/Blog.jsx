import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Input, Spin, Button, Modal, message, Form } from 'antd';
import { Link } from 'react-router-dom';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import api from '../../config/axios';
import moment from 'moment';
import backgroundImage from '../../assets/background.jpg';
import { useSelector } from 'react-redux';
const { Search } = Input;
const { TextArea } = Input;

const Blog = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [form] = Form.useForm();
    const [userNames, setUserNames] = useState({});
    const [currentUser, setCurrentUser] = useState(null);
    
    const currentUserFromStore = useSelector((state) => state.auth.user);

    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        } else if (currentUserFromStore) {
            setCurrentUser(currentUserFromStore);
        }
    }, [currentUserFromStore]);

    const fetchUserName = async (userId) => {
        try {
            // Kiểm tra nếu đã có trong cache
            if (userNames[userId]) {
                return;
            }

            const token = localStorage.getItem('token');
            const response = await api.get(`/user/profile`, {
               
            });
            console.log('User response:', response.data);
            // Lưu tên người dùng vào cache
            setUserNames(prev => ({
                ...prev,
                [userId]: response.data.userName || response.data.email || 'Ẩn danh'
            }));
        } catch (error) {
            console.error('Error fetching user:', error);
            setUserNames(prev => ({
                ...prev,
                [userId]: 'Ẩn danh'
            }));
        }
    };

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await api.get('/blogs', {
               
            });
            
            setBlogs(response.data);
            
            // Lấy danh sách unique userIds từ tất cả các blogs
            const uniqueUserIds = [...new Set(response.data.map(blog => blog.userId))];
            
            // Fetch thông tin cho mỗi userId chưa có trong cache
            uniqueUserIds.forEach(userId => {
                if (!userNames[userId]) {
                    fetchUserName(userId);
                }
            });

        } catch (error) {
            console.error('Error fetching blogs:', error);
            message.error('Không thể tải danh sách bài viết');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);


    const handleSubmit = async (values) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                message.error('Vui lòng đăng nhập lại');
                return;
            }

            if (selectedBlog) {
                console.log('Checking permissions for update:', {
                    currentUser,
                    selectedBlog,
                    hasPermission: checkPermission(selectedBlog)
                });

                if (!checkPermission(selectedBlog)) {
                    message.error('Bạn không có quyền sửa bài viết này');
                    setIsModalVisible(false);
                    return;
                }

                await api.put(`/blogs/${selectedBlog.id}`, 
                    {
                        title: values.title,
                        content: values.content
                    },
                  
                );
                message.success('Cập nhật bài viết thành công');
            } else {
                await api.post('/blogs', 
                    {
                        title: values.title,
                        content: values.content
                    },
                    
                );
                message.success('Tạo bài viết mới thành công');
            }
            setIsModalVisible(false);
            form.resetFields();
            setSelectedBlog(null);
            fetchBlogs();
        } catch (error) {
            console.error('Error submitting blog:', error);
            if (error.response?.status === 403) {
                message.error('Bạn không có quyền thực hiện hành động này');
            } else {
                message.error('Có lỗi xảy ra khi lưu bài viết');
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await api.delete(`/blogs/${id}`, {
               
            });
            message.success('Xóa bài viết thành công');
            fetchBlogs();
        } catch (error) {
            console.error('Error deleting blog:', error);
            message.error('Có lỗi xảy ra khi xóa bài viết');
        }
    };
 
    const checkPermission = (blog) => {
        console.log(blog);
        const info = JSON.parse(localStorage.getItem('userInfo'));
        const role = JSON.parse(localStorage.getItem('role'));
        if(role === 'ADMIN' || info?.id === blog.userId){
            return true;
        }
        return false;
    }

    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderActionButtons = (blog) => {
        const hasPermission = checkPermission(blog);
        console.log("Check");
        console.log(hasPermission);

        if (!hasPermission) return null;

        return [
            <EditOutlined
                key="edit"
                onClick={(e) => {
                    e.preventDefault();
                    setSelectedBlog(blog);
                    form.setFieldsValue(blog);
                    setIsModalVisible(true);
                }}
            />,
            <DeleteOutlined
                key="delete"
                onClick={(e) => {
                    e.preventDefault();
                    handleDelete(blog.id);
                }}
            />
        ];
    };

    const handleLogin = async (credentials) => {
        try {
            const response = await api.post('/login', credentials);
            const user = response.data.user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            // ... other login logic ...
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const updateUserProfile = async (updatedInfo) => {
        try {
            const response = await api.put('/user/profile', updatedInfo);
            const updatedUser = response.data;
            setCurrentUser(updatedUser);
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            message.success('Profile updated successfully');
        } catch (error) {
            console.error('Failed to update profile:', error);
            message.error('Failed to update profile');
        }
    };

    return (
        <div className="min-h-screen bg-cover bg-center bg-no-repeat p-6"
            style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="mb-8 flex justify-between items-center">
                <h1 className="text-3xl font-semibold text-gray-800">Blog</h1>
                    <Button 
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setSelectedBlog(null);
                            form.resetFields();
                            setIsModalVisible(true);
                        }}
                        className="bg-pink-500 hover:bg-pink-600 text-white"
                    >
                        Thêm bài viết
                    </Button>
            </div>

            <Search
                placeholder="Tìm kiếm bài viết..."
                allowClear
                onChange={e => setSearchTerm(e.target.value)}
                className="mb-6 w-72"
            />

            {loading ? (
                <div className="text-center py-8">
                    <Spin size="large" />
                </div>
            ) : (
                <Row gutter={[24, 24]}>
                    {filteredBlogs.map(blog => (
                        <Col xs={24} sm={12} lg={8} key={blog.id}>
                            <Card
                                hoverable
                                className="h-full"
                                actions={renderActionButtons(blog)}
                            >
                                <Link to={`/blog-detail/${blog.id}`}>
                                    <Card.Meta
                                        title={blog.title}
                                        description={
                                            <div>
                                                <div className="text-sm text-gray-500 mb-2">
                                                    {moment(blog.createdAt).format('DD/MM/YYYY HH:mm')}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Người đăng: {userNames[blog.userId] || 'Đang tải...'}
                                                </div>
                                                <div className="line-clamp-3 text-gray-600">
                                                    {blog.content.replace(/<[^>]+>/g, '')}
                                                </div>
                                            </div>
                                        }
                                    />
                                </Link>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            <Modal
                title={selectedBlog ? "Sửa bài viết" : "Thêm bài viết mới"}
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    setSelectedBlog(null);
                    form.resetFields();
                }}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="title"
                        label="Tiêu đề"
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="content"
                        label="Nội dung"
                        rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
                    >
                        <TextArea rows={6} />
                    </Form.Item>

                    <Form.Item className="text-right">
                        <Button type="default" onClick={() => {
                            setIsModalVisible(false);
                            setSelectedBlog(null);
                            form.resetFields();
                        }} className="mr-2">
                            Hủy
                        </Button>
                        <Button type="primary" htmlType="submit" className="bg-pink-500">
                            {selectedBlog ? 'Cập nhật' : 'Đăng bài'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Blog; 