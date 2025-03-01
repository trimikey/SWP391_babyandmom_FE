import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import blogApi from '../services/api.blog';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import moment from 'moment';

const BlogManagement = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingId, setEditingId] = useState(null);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const data = await blogApi.getAllPosts();
            setBlogs(data);
        } catch (error) {
            message.error('Không thể tải danh sách bài viết');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const columns = [
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => moment(date).format('DD/MM/YYYY HH:mm'),
        },
        {
            title: 'Cập nhật lần cuối',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (date) => moment(date).format('DD/MM/YYYY HH:mm'),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button 
                        type="primary" 
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        Sửa
                    </Button>
                    <Button 
                        type="primary" 
                        danger 
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                    >
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            if (editingId) {
                await blogApi.updatePost(editingId, values);
                message.success('Cập nhật bài viết thành công');
            } else {
                await blogApi.createPost(values);
                message.success('Thêm bài viết thành công');
            }
            setIsModalVisible(false);
            form.resetFields();
            fetchBlogs();
        } catch (error) {
            message.error('Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (record) => {
        setEditingId(record.id);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await blogApi.deletePost(id);
            message.success('Xóa bài viết thành công');
            fetchBlogs();
        } catch (error) {
            message.error('Có lỗi xảy ra khi xóa');
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-semibold">Quản lý bài viết</h1>
                <Button 
                    type="primary"
                    onClick={() => {
                        setEditingId(null);
                        form.resetFields();
                        setIsModalVisible(true);
                    }}
                >
                    Thêm bài viết
                </Button>
            </div>

            <Table 
                columns={columns} 
                dataSource={blogs}
                rowKey="id"
                loading={loading}
            />

            <Modal
                title={editingId ? "Sửa bài viết" : "Thêm bài viết"}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={800}
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
                        <ReactQuill theme="snow" />
                    </Form.Item>

                    <Form.Item className="text-right">
                        <Space>
                            <Button onClick={() => setIsModalVisible(false)}>
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                {editingId ? 'Cập nhật' : 'Thêm mới'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default BlogManagement; 