import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, message, Modal, Tooltip } from 'antd';
import api from '../../config/axios';
import { DeleteOutlined } from '@ant-design/icons';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

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

  // Status color mapping
  const statusColors = {
    PENDING: 'gold',
    PAID: 'blue',
    ACTIVE: 'green',
    EXPIRED: 'red',
    CANCELED: 'gray'
  };

  // Handle order deletion - Cải tiến để xử lý tốt hơn
  const handleDelete = async (orderId, status) => {
    try {
      // Xóa đơn hàng thông qua API
      await api.delete(`/order/${orderId}`);
      message.success('Xóa đơn hàng thành công');
      fetchOrders();
    } catch (error) {
      console.error('Deletion error:', error);
      
      // Nếu backend không cho phép xóa đơn hàng đã thanh toán
      if (status === 'PAID') {
        Modal.confirm({
          title: 'Đơn hàng đã thanh toán',
          content: 'Đơn hàng này đã được thanh toán. Bạn có muốn xóa vĩnh viễn không?',
          okText: 'Xóa vĩnh viễn',
          okType: 'danger',
          cancelText: 'Hủy',
          onOk: async () => {
            try {
              // Gọi API xóa vĩnh viễn đơn hàng
              await api.delete(`/order/remove/${orderId}`);
              message.success('Đã xóa vĩnh viễn đơn hàng');
              fetchOrders();
            } catch (removeError) {
              message.error('Không thể xóa vĩnh viễn: ' + (removeError.response?.data || removeError.message));
              console.error(removeError);
            }
          }
        });
      } else {
        message.error('Không thể xóa đơn hàng: ' + (error.response?.data || error.message));
      }
    }
  };

  // Handle permanent removal
  const handleRemove = async (orderId) => {
    try {
      await api.delete(`/order/remove/${orderId}`);
      message.success('Đã xóa vĩnh viễn đơn hàng');
      fetchOrders();
    } catch (error) {
      message.error('Không thể xóa vĩnh viễn đơn hàng');
      console.error(error);
    }
  };

  // Handle order cancellation
  const handleCancel = async (orderId) => {
    try {
      await api.put(`/order/cancel/${orderId}`);
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
    {
      title: 'Gói thành viên',
      dataIndex: 'membershipType',
      key: 'membershipType',
    },
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
            onClick={() => handleDelete(record.id, record.status)}
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
            <p><strong>Gói thành viên:</strong> {selectedOrder.membershipType}</p>
            <p><strong>Giá:</strong> {new Intl.NumberFormat('vi-VN').format(selectedOrder.totalPrice)} VNĐ</p>
            <p><strong>Trạng thái:</strong> {selectedOrder.status}</p>
            <p><strong>Ngày tạo:</strong> {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}</p>
            <p><strong>Ngày bắt đầu:</strong> {new Date(selectedOrder.startDate).toLocaleString('vi-VN')}</p>
            <p><strong>Ngày kết thúc:</strong> {new Date(selectedOrder.endDate).toLocaleString('vi-VN')}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderManagement; 