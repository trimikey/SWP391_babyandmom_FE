import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, message, Space, Switch, Select } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import api from '../../config/axios';

const { confirm } = Modal;
const { TextArea } = Input;
const { Option } = Select;

const MembershipPackages = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form] = Form.useForm();
    const [packageTypes, setPackageTypes] = useState(['BASIC', 'PREMIUM']);

    const fetchPackages = async () => { 
        setLoading(true);
        try {
            const response = await api.get('/membership-packages');
            // Transform API data to match frontend structure
            const transformedData = response.data.map(pkg => ({
                id: pkg.id,
                name: pkg.name || `Gói ${pkg.type}`,
                type: pkg.type,
                description: pkg.features,
                price: pkg.price,
                duration: pkg.durationInMonths,
                active: true // Assume all packages from API are active
            }));
            setPackages(transformedData);
        } catch (error) {
            console.error('Failed to fetch packages:', error);
            message.error('Không thể tải danh sách gói thành viên');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPackages();
    }, []);

    const columns = [
        {
            title: 'Tên gói',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => text || `Gói ${record.type}`,
        },
        {
            title: 'Loại gói',
            dataIndex: 'type',
            key: 'type',
            render: (type) => (
                <span className={`${type === 'PREMIUM' ? 'text-pink-600 font-bold' : 'text-blue-600'}`}>
                    {type}
                </span>
            ),
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: 'Giá (VND)',
            dataIndex: 'price',
            key: 'price',
            render: (price) => price.toLocaleString('vi-VN'),
        },
        {
            title: 'Thời hạn (tháng)',
            dataIndex: 'duration',
            key: 'duration',
        },
        
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => showEditModal(record)}
                    >
                        Sửa
                    </Button>
                    <Button
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

    const showEditModal = (record) => {
        setEditingId(record.id);
        form.setFieldsValue({
            name: record.name || `Gói ${record.type}`,
            description: record.description,
            price: record.price,
            duration: record.duration,
            active: record.active,
            type: record.type
        });
        setIsModalVisible(true);
    };

    const showAddModal = () => {
        setEditingId(null);
        form.resetFields();
        form.setFieldsValue({
            active: true,
            type: 'BASIC'
        });
        setIsModalVisible(true);
    };

    const handleDelete = (id) => {
        confirm({
            title: 'Bạn có chắc chắn muốn xóa gói thành viên này?',
            icon: <ExclamationCircleOutlined />,
            content: 'Hành động này không thể hoàn tác',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            async onOk() {
                try {
                    await api.delete(`/membership-packages/${id}`);
                    message.success('Xóa gói thành viên thành công');
                    fetchPackages();
                } catch (error) {
                    console.error('Failed to delete package:', error);
                    message.error('Không thể xóa gói thành viên');
                }
            },
        });
    };

    const handleSubmit = async (values) => {
        try {
            // Transform form data to match API structure
            const requestData = {
                type: values.type,
                features: values.description,
                price: values.price,
                durationInMonths: values.duration,
                name: values.name
            };

            if (editingId) {
                await api.put(`/membership-packages/${editingId}`, requestData);
                message.success('Cập nhật gói thành viên thành công');
            } else {
                await api.post('/membership-packages', requestData);
                message.success('Thêm mới gói thành viên thành công');
            }
            setIsModalVisible(false);
            fetchPackages();
        } catch (error) {
            console.error('Failed to save package:', error);
            message.error('Không thể lưu gói thành viên');
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Quản lý gói thành viên</h1>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={showAddModal}
                >
                    Thêm gói mới
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={packages}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title={editingId ? "Chỉnh sửa gói thành viên" : "Thêm gói thành viên mới"}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={700}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="name"
                        label="Tên gói"
                        rules={[{ required: true, message: 'Vui lòng nhập tên gói' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="type"
                        label="Loại gói"
                        rules={[{ required: true, message: 'Vui lòng chọn loại gói' }]}
                    >
                        <Select>
                            {packageTypes.map(type => (
                                <Option key={type} value={type}>
                                    {type}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
                    >
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item
                        name="price"
                        label="Giá (VND)"
                        rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
                    >
                        <InputNumber 
                            style={{ width: '100%' }} 
                            min={0} 
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        />
                    </Form.Item>
                    <Form.Item
                        name="duration"
                        label="Thời hạn (tháng)"
                        rules={[{ required: true, message: 'Vui lòng nhập thời hạn' }]}
                    >
                        <InputNumber style={{ width: '100%' }} min={1} />
                    </Form.Item>
                    
                    <Form.Item className="flex justify-end">
                        <Button type="default" onClick={() => setIsModalVisible(false)} className="mr-2">
                            Hủy
                        </Button>
                        <Button type="primary" htmlType="submit">
                            {editingId ? 'Cập nhật' : 'Tạo mới'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default MembershipPackages; 