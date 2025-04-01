import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, message, Modal } from 'antd';
import api from '../../config/axios';
import moment from 'moment';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Status color mapping
  const statusColors = {
    PENDING: 'gold',
    PAID: 'blue',
    ACTIVE: 'green',
    EXPIRED: 'red',
    CANCELED: 'gray'
  };

  // Fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/order/all');
      setOrders(response.data);
    } catch (error) {
      message.error('Không thể tải danh sách đơn hàng');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle order deletion
  const handleDelete = async (orderId, status) => {
    try {
      await api.delete(`/order/${orderId}`);
      message.success('Xóa đơn hàng thành công');
      fetchOrders();
    } catch (error) {
      message.error('Không thể xóa đơn hàng: ' + (error.response?.data || error.message));
    }
  };

  // Handle order cancellation
  const handleCancel = async (orderId) => {
    try {
      await api.get(`/order/cancel/${orderId}`);
      message.success('Hủy đơn hàng thành công');
      fetchOrders();
    } catch (error) {
      message.error('Không thể hủy đơn hàng');
      console.error(error);
    }
  };

  // Update expired orders
  const handleUpdateExpired = async () => {
    try {
      await api.put('/order/update-expired');
      message.success('Đã cập nhật trạng thái đơn hàng hết hạn');
      fetchOrders();
    } catch (error) {
      message.error('Không thể cập nhật trạng thái đơn hàng');
      console.error(error);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Khách hàng',
      dataIndex: 'buyerName',
      key: 'buyerName',
    },
    {
      title: 'Email',
      dataIndex: 'buyerEmail',
      key: 'buyerEmail',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'buyerPhone',
      key: 'buyerPhone',
    },
    // {
    //   title: 'Gói thành viên',
    //   dataIndex: 'subscription',
    //   key: 'membershipType',
    //   render: (subscription) => {
    //     const membershipNames = {
    //       'BASIC': 'Gói cơ bản',
    //       'PREMIUM': 'Gói cao cấp',
    //       'VIP': 'Gói VIP'
    //     };
    //     const type = subscription?.membershipPackage?.type;
    //     return membershipNames[type] || type;
    //   }
    // },
    {
      title: 'Giá (VNĐ)',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price) => new Intl.NumberFormat('vi-VN').format(price),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={statusColors[status]}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            onClick={() => setSelectedOrder(record)}
            type="primary"
          >
            Chi tiết
          </Button>
          <Button 
            onClick={() => handleCancel(record.id)}
            disabled={record.status !== 'PENDING'}
            danger
          >
            Hủy
          </Button>
          <Button 
            onClick={() => handleDelete(record.id)}
            danger
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Quản lý đơn hàng</h1>
        <Button 
          onClick={handleUpdateExpired}
          type="primary"
          className="bg-blue-500"
        >
          Cập nhật đơn hàng hết hạn
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={orders}
        loading={loading}
        rowKey="id"
      />

      <Modal
        title="Chi tiết đơn hàng"
        open={!!selectedOrder}
        onCancel={() => setSelectedOrder(null)}
        footer={null}
        width={800}
      >
        {selectedOrder && (
          <div className="space-y-4">
            <p><strong>ID:</strong> {selectedOrder.id}</p>
            <p><strong>Khách hàng:</strong> {selectedOrder.buyerName}</p>
            <p><strong>Email:</strong> {selectedOrder.buyerEmail}</p>
            <p><strong>Số điện thoại:</strong> {selectedOrder.buyerPhone}</p>
            {/* <p><strong>Gói thành viên:</strong> {
              {
                'BASIC': 'Gói cơ bản',
                'PREMIUM': 'Gói cao cấp',
                'VIP': 'Gói VIP'
              }[selectedOrder.subscription?.membershipPackage?.type] || selectedOrder.subscription?.membershipPackage?.type
            }</p> */}
            <p><strong>Thời hạn:</strong> {moment(selectedOrder.startDate).format('DD/MM/YYYY')} - {moment(selectedOrder.endDate).format('DD/MM/YYYY')}</p>
            <p><strong>Giá:</strong> {new Intl.NumberFormat('vi-VN').format(selectedOrder.totalPrice)} VNĐ</p>
            <p><strong>Trạng thái:</strong> {selectedOrder.status}</p>
            <p><strong>Ngày tạo:</strong> {moment(selectedOrder.createdAt).format('DD/MM/YYYY HH:mm')}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderManagement; 