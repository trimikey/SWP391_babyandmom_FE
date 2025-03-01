import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, message, Popconfirm } from 'antd';
import api from '../../config/axios';

const MembershipPackages = () => {
    const [packages, setPackages] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchPackages = async () => {
        try {
            const response = await api.get('membership-packages');
            console.log('Create package status:', response.data);

            setPackages(response.data);
        } catch (error) {
            message.error('Failed to fetch membership packages');
        }
    };

    useEffect(() => {
        fetchPackages();
    }, []);

    const columns = [
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Features',
            dataIndex: 'features',
            key: 'features',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Duration (Months)',
            dataIndex: 'durationInMonths',
            key: 'durationInMonths',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <>
                    <Button type="link" onClick={() => handleEdit(record)}>
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure you want to delete this package?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="link" danger>
                            Delete
                        </Button>
                    </Popconfirm>
                </>
            ),
        },
    ];

    const handleAdd = () => {
        setEditingId(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingId(record.id);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`membership-packages/${id}`);
            message.success('Package deleted successfully');
            fetchPackages();
        } catch (error) {
            message.error('Failed to delete package');
        }
    };

    const handleModalOk = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            
            if (editingId) {
                await api.put(`membership-packages/${editingId}`, values);
                message.success('Package updated successfully');
            } else {
                await api.post(`membership-packages`, values);
                message.success('Package created successfully');
            }
            
            setIsModalVisible(false);
            fetchPackages();
        } catch (error) {
            message.error('Failed to save package');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '24px' }}>
            <Button
                type="primary"
                onClick={handleAdd}
                style={{ marginBottom: '16px' }}
            >
                Add New Package
            </Button>

            <Table
                columns={columns}
                dataSource={packages}
                rowKey="id"
            />

            <Modal
                title={editingId ? "Edit Package" : "Add New Package"}
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={() => setIsModalVisible(false)}
                confirmLoading={loading}
            >
                <Form
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        name="type"
                        label="Type"
                        rules={[{ required: true }]}
                    >
                        <Select>
                            <Select.Option value="BASIC">Basic</Select.Option>
                            <Select.Option value="PREMIUM">Premium</Select.Option>
                            <Select.Option value="VIP">VIP</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="features"
                        label="Features"
                        rules={[{ required: true }]}
                    >
                        <Input.TextArea />
                    </Form.Item>

                    <Form.Item
                        name="price"
                        label="Price"
                        rules={[{ required: true }]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            step={0.01}
                        />
                    </Form.Item>

                    <Form.Item
                        name="durationInMonths"
                        label="Duration (Months)"
                        rules={[{ required: true }]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            min={1}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default MembershipPackages; 