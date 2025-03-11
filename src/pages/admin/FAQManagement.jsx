import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Switch, message } from 'antd';
import api from '../../config/axios';

const FAQManagement = () => {
  const [faqs, setFaqs] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [form] = Form.useForm();

  // Fetch FAQs
  const fetchFAQs = async () => {
    try {
      const response = await api.get('faqs');
      setFaqs(response.data);
    } catch (error) {
      message.error('Không thể tải danh sách FAQ');
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  // Table columns
  const columns = [
    {
      title: 'Câu hỏi',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Thứ tự hiển thị',
      dataIndex: 'displayOrder',
      key: 'displayOrder',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Switch checked={isActive} disabled />
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <span>
          <Button type="link" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            Xóa
          </Button>
        </span>
      ),
    },
  ];

  // Handle create/edit
  const handleSubmit = async (values) => {
    try {
      if (editingFaq) {
        await api.put(`/faqs/${editingFaq.id}`, values);
        message.success('Cập nhật FAQ thành công');
      } else {
        await api.post('/faqs', values);
        message.success('Tạo FAQ mới thành công');
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingFaq(null);
      fetchFAQs();
    } catch (error) {
      message.error('Có lỗi xảy ra');
    }
  };

  // Handle edit
  const handleEdit = (faq) => {
    setEditingFaq(faq);
    form.setFieldsValue(faq);
    setIsModalVisible(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await api.delete(`/faqs/${id}`);
      message.success('Xóa FAQ thành công');
      fetchFAQs();
    } catch (error) {
      message.error('Không thể xóa FAQ');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Quản lý FAQ</h1>
        <Button 
          type="primary"
          onClick={() => {
            setEditingFaq(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Thêm FAQ mới
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={faqs}
        rowKey="id"
      />

      <Modal
        title={editingFaq ? "Sửa FAQ" : "Thêm FAQ mới"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingFaq(null);
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ isActive: true }}
        >
          <Form.Item
            name="name"
            label="Câu hỏi"
            rules={[{ required: true, message: 'Vui lòng nhập câu hỏi' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="displayOrder"
            label="Thứ tự hiển thị"
            rules={[{ required: true, message: 'Vui lòng nhập thứ tự hiển thị' }]}
          >
            <Input type="number" /> 
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Trạng thái"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item className="text-right">
            <Button type="default" className="mr-2" onClick={() => setIsModalVisible(false)}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              {editingFaq ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FAQManagement; 