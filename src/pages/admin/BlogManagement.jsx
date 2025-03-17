import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Space, Tag, Tooltip, Select, Switch } from 'antd';
import { EditOutlined, DeleteOutlined, UndoOutlined, EyeOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import api from '../../config/axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import moment from 'moment';

const { confirm } = Modal;
const { TextArea } = Input;

const BlogManagement = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isPreviewVisible, setIsPreviewVisible] = useState(false);
    const [previewContent, setPreviewContent] = useState({ title: '', content: '' });
    const [form] = Form.useForm();
    const [editingId, setEditingId] = useState(null);
    const [filterStatus, setFilterStatus] = useState('active');

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const response = await api.get('/blogs/admin/all');
            setBlogs(response.data);
        } catch (error) {
            console.error('Failed to fetch blogs:', error);
            message.error('Không thể tải danh sách bài viết');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const filteredBlogs = () => {
        if (filterStatus === 'all') return blogs;
        if (filterStatus === 'active') return blogs.filter(blog => !blog.deleted);
        if (filterStatus === 'deleted') return blogs.filter(blog => blog.deleted);
        return blogs;
    };

    const handleDeleteOrRestore = async (id, isCurrentlyDeleted) => {
        try {
            // Lấy thông tin bài viết hiện tại
            const blog = blogs.find(blog => blog.id === id);
            if (!blog) {
                message.error('Không tìm thấy bài viết');
                return;
            }
            
            // Cập nhật trạng thái isDeleted của bài viết
            await api.put(`/blogs/${id}`, {
                title: blog.title,
                content: blog.content,
                isDeleted: !isCurrentlyDeleted // Đảo ngược trạng thái
            });
            
            message.success(isCurrentlyDeleted 
                ? 'Khôi phục bài viết thành công'
                : 'Xóa bài viết thành công');
                
            // Tải lại danh sách bài viết
            fetchBlogs();
        } catch (error) {
            console.error('Action failed:', error);
            message.error(isCurrentlyDeleted 
                ? 'Không thể khôi phục bài viết' 
                : 'Không thể xóa bài viết');
        }
    };

    const handlePreview = (record) => {
        setPreviewContent({
            title: record.title,
            content: record.content
        });
        setIsPreviewVisible(true);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <span style={{ color: record.deleted ? '#999' : 'inherit' }}>
                    {text}
                </span>
            ),
        },
        {
            title: 'Trạng thái',
            key: 'status',
            dataIndex: 'deleted',
            width: 120,
            render: (deleted) => (
                <Tag color={deleted ? 'red' : 'green'}>
                    {deleted ? 'Đã xóa' : 'Hoạt động'}
                </Tag>
            ),
            filters: [
                { text: 'Hoạt động', value: false },
                { text: 'Đã xóa', value: true },
            ],
            onFilter: (value, record) => record.deleted === value,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => moment(date).format('DD/MM/YYYY HH:mm'),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        },
        {
            title: 'Cập nhật lần cuối',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (date) => moment(date).format('DD/MM/YYYY HH:mm'),
            sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 280,
            render: (_, record) => (
                <Space>
                    <Tooltip title="Xem trước">
                        <Button 
                            icon={<EyeOutlined />} 
                            onClick={() => handlePreview(record)}
                        />
                    </Tooltip>
                    
                    {!record.deleted && (
                        <Tooltip title="Sửa">
                            <Button 
                                type="primary" 
                                icon={<EditOutlined />}
                                onClick={() => handleEdit(record)}
                                style={{ backgroundColor: '#ff85a2', borderColor: '#ff85a2' }}
                            />
                        </Tooltip>
                    )}
                    
                    {record.deleted ? (
                        <Tooltip title="Khôi phục">
                            <Button 
                                type="primary" 
                                icon={<UndoOutlined />}
                                onClick={() => handleDeleteOrRestore(record.id, true)}
                                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                            />
                        </Tooltip>
                    ) : (
                        <Tooltip title="Xóa">
                            <Button 
                                type="primary" 
                                danger 
                                icon={<DeleteOutlined />}
                                onClick={() => handleDeleteOrRestore(record.id, false)}
                            />
                        </Tooltip>
                    )}
                </Space>
            ),
        },
    ];

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            if (editingId) {
                await api.put(`/blogs/${editingId}`, {
                    title: values.title,
                    content: values.content,
                });
                message.success('Cập nhật bài viết thành công');
            } else {
                await api.post('/blogs', {
                    title: values.title,
                    content: values.content,
                });
                message.success('Thêm bài viết thành công');
            }
            setIsModalVisible(false);
            form.resetFields();
            fetchBlogs();
        } catch (error) {
            console.error('Form submission failed:', error);
            message.error('Có lỗi xảy ra khi lưu bài viết');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (record) => {
        setEditingId(record.id);
        form.setFieldsValue({
            title: record.title,
            content: record.content
        });
        setIsModalVisible(true);
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold">Quản lý bài viết</h1>
                <div className="flex gap-4">
                    <Select
                        value={filterStatus}
                        onChange={setFilterStatus}
                        style={{ width: 200 }}
                    >
                        <Select.Option value="active">Bài viết đang hoạt động</Select.Option>
                        <Select.Option value="deleted">Bài viết đã xóa</Select.Option>
                        <Select.Option value="all">Tất cả bài viết</Select.Option>
                    </Select>
                    <Button type="primary" onClick={() => {
                        setEditingId(null);
                        form.resetFields();
                        setIsModalVisible(true);
                    }}>
                        Thêm bài viết mới
                    </Button>
                </div>
            </div>

            <Table 
                dataSource={filteredBlogs()} 
                columns={columns} 
                rowKey="id" 
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            {/* Modal thêm/sửa bài viết */}
            <Modal
                title={editingId ? "Sửa bài viết" : "Thêm bài viết mới"}
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
                        <Input placeholder="Nhập tiêu đề bài viết" />
                    </Form.Item>

                    <Form.Item
                        name="content"
                        label="Nội dung"
                        rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
                    >
                        <ReactQuill 
                            theme="snow" 
                            style={{ height: 300, marginBottom: 50 }}
                        />
                    </Form.Item>

                    <Form.Item className="flex justify-end mt-8">
                        <Space>
                            <Button onClick={() => setIsModalVisible(false)}>
                                Hủy
                            </Button>
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                loading={loading}
                                style={{ backgroundColor: '#ff85a2', borderColor: '#ff85a2' }}
                            >
                                {editingId ? 'Cập nhật' : 'Thêm mới'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal xem trước bài viết */}
            <Modal
                title="Xem trước bài viết"
                open={isPreviewVisible}
                onCancel={() => setIsPreviewVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setIsPreviewVisible(false)}>
                        Đóng
                    </Button>
                ]}
                width={800}
            >
                <div className="preview-container">
                    <h1 className="text-2xl font-bold mb-4">{previewContent.title}</h1>
                    <div 
                        className="ql-editor preview-content"
                        dangerouslySetInnerHTML={{ __html: previewContent.content }}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default BlogManagement; 