import React, { useState, useEffect } from 'react';
import { Table, Button, message, Modal, Space, Tag } from 'antd';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import api from '../../config/axios';

const Transaction = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            // Lấy token từ localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                message.error('Vui lòng đăng nhập để xem giao dịch');
                window.location.href = '/login';
                return;
            }

            // Lấy thông tin user từ localStorage
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            console.log('User Info:', userInfo);

            if (!userInfo || !userInfo.id) {
                message.error('Không tìm thấy thông tin người dùng');
                return;
            }

            // Gọi API với token trong header
            const response = await api.get(`/transactions/user/${userInfo.id}`, {
               
            });
            
            // Lọc ra các transaction chưa bị xóa
            const activeTransactions = response.data.filter(transaction => !transaction.isDeleted);
            setTransactions(activeTransactions);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            if (error.response?.status === 401) {
                message.error('Phiên đăng nhập đã hết hạn');
                window.location.href = '/login';
            } else {
                message.error('Không thể tải danh sách giao dịch');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/transactions/${id}`);
            message.success('Giao dịch đã bị xóa');
            // Cập nhật state để ẩn transaction đã xóa
            setTransactions(prevTransactions => 
                prevTransactions.filter(transaction => transaction.id !== id)
            );
        } catch (error) {
            console.error('Failed to delete transaction:', error);
            message.error('Không thể xóa giao dịch');
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Người dùng',
            dataIndex: 'userName',
            key: 'userName',
        },
        {
            title: 'Số tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (price) => new Intl.NumberFormat('vi-VN').format(price) + ' VNĐ',
        },
        {
            title: 'Phương thức thanh toán',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = status === 'COMPLETED' ? 'green' : 'red';
                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button 
                        icon={<EyeOutlined />} 
                        onClick={() => {
                            setSelectedTransaction(record);
                            setModalVisible(true);
                        }}
                    >
                        Xem
                    </Button>
                    <Button 
                        icon={<DeleteOutlined />} 
                        danger
                        onClick={() => {
                            Modal.confirm({
                                title: 'Xác nhận xóa',
                                content: 'Bạn có chắc chắn muốn xóa giao dịch này không?',
                                okText: 'Xóa',
                                cancelText: 'Hủy',
                                onOk: () => handleDelete(record.id)
                            });
                        }}
                    >
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Lịch sử giao dịch của bạn</h1>
            <Table 
                columns={columns} 
                dataSource={transactions} 
                rowKey="id" 
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title="Chi tiết giao dịch"
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
            >
                {selectedTransaction && (
                    <div className="space-y-4">
                        <p><strong>ID:</strong> {selectedTransaction.id}</p>
                        <p><strong>Người dùng:</strong> {selectedTransaction.userName}</p>
                        <p><strong>Số tiền:</strong> {new Intl.NumberFormat('vi-VN').format(selectedTransaction.totalPrice)} VNĐ</p>
                        <p><strong>Phương thức thanh toán:</strong> {selectedTransaction.paymentMethod}</p>
                        <p><strong>Trạng thái:</strong> {selectedTransaction.status}</p>
                        <p><strong>Ngày tạo:</strong> {new Date(selectedTransaction.createdAt).toLocaleString()}</p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Transaction; 