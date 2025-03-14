import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Input, Spin, Button, Modal, message, Form } from 'antd';
import { Link } from 'react-router-dom';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import blogApi from '../services/api.blog';
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
    const currentUser = useSelector((state) => {
        // Thử lấy user từ localStorage nếu không có trong Redux state
        if (!state.auth.user) {
            const savedUser = JSON.parse(localStorage.getItem('user'));
            return savedUser;
        }
        return state.auth.user;
    });
    
    console.log('Current user in Blog:', currentUser); // Debug current user

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const data = await blogApi.getAllPosts();
            console.log('Blogs data:', data); // Debug
            setBlogs(data);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);
 
    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id, e) => {
        e.preventDefault();
        try {
            await blogApi.deletePost(id);
            message.success('Xóa bài viết thành công');
            fetchBlogs();
        } catch (error) {
            message.error('Không thể xóa bài viết');
        }
    };

    const handleSubmit = async (values) => {
        try {
            if (selectedBlog) {
                if (selectedBlog.userId !== currentUser.id) {
                    message.error('Bạn không có quyền sửa bài viết này');
                    return;
                }
                await blogApi.updatePost(selectedBlog.id, values);
                message.success('Cập nhật bài viết thành công');
            } else {
                const postData = {
                    ...values,
                    userId: currentUser.id,
                    userName: currentUser.name
                };
                await blogApi.createPost(postData);
                message.success('Tạo bài viết mới thành công');
            }
            console.log(currentUser)    

            setIsModalVisible(false);
            form.resetFields();
            setSelectedBlog(null);
            fetchBlogs();
        } catch (error) {
            message.error('Có lỗi xảy ra');
        }
    };

    useEffect(() => {
        if (selectedBlog) {
            form.setFieldsValue(selectedBlog);
        }
    }, [selectedBlog, form]);

    const renderActionButtons = (blog) => {
        console.log('Checking permissions for blog:', blog);
        console.log('Current user for comparison:', currentUser);
        
        if (currentUser && (
            String(currentUser.id) === String(blog.userId) || 
            currentUser.role === 'ADMIN'
        )) {
            return [
                <EditOutlined
                    key="edit"
                    onClick={(e) => {
                        e.preventDefault();
                        setSelectedBlog(blog);
                        setIsModalVisible(true);
                    }}
                />,
                <DeleteOutlined
                    key="delete"
                    onClick={(e) => handleDelete(blog.id, e)}
                />
            ];
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="mb-8 flex justify-between items-center">
                <h1 className="text-3xl font-semibold text-gray-800">Blog</h1>

                <button 
                    className="bg-pink-500 text-white px-2 py-2 rounded-md"
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setSelectedBlog(null);
                        setIsModalVisible(true);
                    }}
                >
                    Thêm bài viết
                </button>
            </div>

            <Search
                placeholder="Tìm kiếm bài viết..."
                allowClear
                onChange={e => setSearchTerm(e.target.value)}
                style={{ width: 300 }}
                className="mb-6"
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
                                                    Người đăng: {blog.userName || 'Ẩn danh'}
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
                    initialValues={{ title: '', content: '' }}
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
                            form.resetFields();
                            setSelectedBlog(null);
                        }} className="mr-2">
                            Hủy
                        </Button>



                        <button type="primary" htmlType="submit" className="bg-pink-500 text-white px-4 py-1 rounded-md">
                            {selectedBlog ? 'Cập nhật' : 'Đăng bài'}
                        </button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Blog; 