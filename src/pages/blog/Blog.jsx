import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Input, Spin, Typography, Button, Form, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import blogApi from '../services/api.blog';
import moment from 'moment';

const { Search } = Input;
const { Title } = Typography;

const Blog = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [form] = Form.useForm();
    const [editingBlog, setEditingBlog] = useState(null);
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    // Fetch blogs from API
    const fetchBlogs = async () => {
        try {
            const data = await blogApi.getAllPosts();
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

    // Filter blogs based on search term
    const filteredBlogs = blogs.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const onFinish = async (values) => {
        try {
            if (editingBlog) {
                await blogApi.updatePost(editingBlog.id, values);
                message.success('Cập nhật blog thành công!');
            } else {
                await blogApi.createPost(values);
                message.success('Blog đã được tạo thành công!');
            }
            form.resetFields();
            setEditingBlog(null);
            fetchBlogs();
        } catch (error) {
            message.error('Có lỗi xảy ra khi tạo hoặc cập nhật blog');
            console.error('Error details:', error.response || error);
        }
    };

    const editBlog = (blog) => {
        form.setFieldsValue(blog);
        setEditingBlog(blog);
    };

    const deleteBlog = async (id) => {
        try {
            await blogApi.deletePost(id);
            message.success('Blog đã được xóa thành công!');
            fetchBlogs();
        } catch (error) {
            message.error('Có lỗi xảy ra khi xóa blog');
            console.error('Error details:', error.response || error);
        }
    };

    const viewBlogDetail = (blogId) => {
        navigate(`/blog-detail/${blogId}`);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <Title level={2} className="mb-6">Blog</Title>
            <Form form={form} layout="vertical" onFinish={onFinish} className="mb-4">
                <Form.Item
                    label="Tiêu đề"
                    name="title"
                    rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Nội dung"
                    name="content"
                    rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
                >
                    <Input.TextArea />
                </Form.Item>
                
                    <button type="primary" htmlType="submit" className="bg-pink-400 hover:bg-pink-500 border-pink-400 text-white px-5 py-1 mb-2 rounded-lg ">
                        {editingBlog ? 'Cập Nhật' : 'Tạo Blog'}
                    </button>
            </Form>
            <Search
                placeholder="Tìm kiếm bài viết..."
                allowClear
                onChange={e => setSearchTerm(e.target.value)}
                style={{ width: 300, marginBottom: '20px' }}
            />
            {loading ? (
                <div className="text-center py-8">
                    <Spin size="large" />
                </div>
            ) : (
                <Row gutter={[24, 24]}>
                    {filteredBlogs.length > 0 ? (
                        filteredBlogs.map(blog => (
                            <Col xs={24} sm={12} lg={8} key={blog.id}>
                                <Card hoverable className="h-full" onClick={() => viewBlogDetail(blog.id)}>
                                    <Card.Meta
                                        title={blog.title}
                                        description={
                                            <div>
                                                <div className="text-sm text-gray-500 mb-2">
                                                    {moment(blog.createdAt).format('DD/MM/YYYY HH:mm')}
                                                </div>
                                                <div className="line-clamp-3 text-gray-600">
                                                    {blog.content.replace(/<[^>]+>/g, '')}
                                                </div>
                                                {currentUser && currentUser.id === blog.userId && (
                                                    <div>
                                                        <Button type="link" onClick={(e) => { e.stopPropagation(); editBlog(blog); }}>
                                                            Sửa
                                                        </Button>
                                                        <Button type="link" danger onClick={(e) => { e.stopPropagation(); deleteBlog(blog.id); }}>
                                                            Xóa
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        }
                                    />
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <Col span={24}>
                            <div className="text-center">Không tìm thấy bài viết nào.</div>
                        </Col>
                    )}
                </Row>
            )}
        </div>
    );
};

export default Blog; 