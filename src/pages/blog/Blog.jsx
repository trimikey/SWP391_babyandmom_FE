import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Input, Spin, Button, Modal, message, Form } from 'antd';
import { Link } from 'react-router-dom';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import api from '../../config/axios';
import moment from 'moment';
import backgroundImage from '../../assets/background.jpg';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const { Search } = Input;

const Blog = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [content, setContent] = useState('');
    const [form] = Form.useForm();

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const response = await api.get('/blogs');
            setBlogs(response.data);
        } catch (error) {
            message.error('Không thể tải danh sách bài viết');
        } finally {
            setLoading(false);
        }
    };

    const checkPermission = (blog) => {
        const info = JSON.parse(localStorage.getItem('userInfo'));
        const role = JSON.parse(localStorage.getItem('role'));
        return role === 'ADMIN' || info?.id === blog.userId;
    };

    const handleSubmit = async (values) => {
        try {
            const requestData = { title: values.title, content };
            if (selectedBlog) {
                if (!checkPermission(selectedBlog)) {
                    message.error('Bạn không có quyền sửa bài viết này');
                    return;
                }
                await api.put(`/blogs/${selectedBlog.id}`, requestData);
                message.success('Cập nhật bài viết thành công');
            } else {
                await api.post('/blogs', requestData);
                message.success('Tạo bài viết mới thành công');
            }
            closeModal();
            fetchBlogs();
        } catch {
            message.error('Có lỗi xảy ra khi lưu bài viết');
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/blogs/${id}`);
            message.success('Xóa bài viết thành công');
            fetchBlogs();
        } catch {
            message.error('Có lỗi xảy ra khi xóa bài viết');
        }
    };

    const closeModal = () => {
        setIsModalVisible(false);
        setSelectedBlog(null);
        form.resetFields();
        setContent('');
    };

    const filteredBlogs = blogs.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-cover p-6" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="mb-8 flex justify-between items-center">
                <h1 className="text-3xl font-semibold">Blog</h1>
                <button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)} className="bg-pink-500 hover:bg-pink-500 text-white font-bold py-2 px-4 rounded">
                    Thêm bài viết
                </button>
            </div>

            <Search placeholder="Tìm kiếm bài viết..." allowClear onChange={e => setSearchTerm(e.target.value)} className="mb-6 w-72" />

            {loading ? (
                <div className="text-center py-8">
                    <Spin size="large" />
                </div>
            ) : (
                <Row gutter={[24, 24]}>
                    {filteredBlogs.map(blog => (
                        <Col xs={24} sm={12} lg={8} key={blog.id}>
                            <Card hoverable actions={checkPermission(blog) ? [
                                <EditOutlined key="edit" onClick={() => { setSelectedBlog(blog); form.setFieldsValue(blog); setContent(blog.content); setIsModalVisible(true); }} />, 
                                <DeleteOutlined key="delete" onClick={() => handleDelete(blog.id)} />
                            ] : null}>
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

            <Modal title={selectedBlog ? "Sửa bài viết" : "Thêm bài viết mới"} open={isModalVisible} onCancel={closeModal} footer={null}>
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Nội dung" rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}>
                        <ReactQuill theme="snow" value={content} onChange={setContent} />
                    </Form.Item>
                    <Form.Item className="text-right">
                        <Button onClick={closeModal} className="mr-2">Hủy</Button>
                        <Button type="primary" htmlType="submit">
                            {selectedBlog ? 'Cập nhật' : 'Đăng bài'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Blog;
