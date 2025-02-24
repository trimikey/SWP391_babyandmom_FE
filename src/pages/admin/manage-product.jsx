import React, { useEffect, useState } from 'react';
import { getProduct, createProduct } from '../services/api.product';
import { Button, Form, Input, Modal, Select, Table } from 'antd';
import { getCategory } from '../services/api.category';
import { toast } from 'react-toastify';

function ManageProduct() {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState([]);
  const [form] = Form.useForm();
  const fetchProduct = async () => {
    const response = await getProduct();
    setProducts(response);
  }
  const fetchCategory = async () => {
    const data = await getCategory();
    setCategory(data);
  }

  useEffect(() => {
    fetchProduct()
    fetchCategory()
  }, []);
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
  ];
  const handleSubmit = async (formValues) => {
    formValues.image = "123";
    const response = createProduct(formValues);
    toast.success("Create product success!");
    setOpen(false);
  };
  return (
    <div>
      <Button onClick={() => setOpen(true)} type="primary">Create new product</Button>
      <Table dataSource={products} columns={columns}></Table>
      <Modal title="Product" open={open} onCancel={() => setOpen(false)} onOk={() => form.submit()}>
        <Form
          labelCol={{
            span: 24,
          }}
          form={form}
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter the name' }]}
          >
            <Input defaultValue="string" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please enter the description' }]}
          >


            <Input defaultValue="string" />
          </Form.Item>


          <Form.Item
            label="Price"
            name="price"
            rules={[
              { required: true, message: 'Please enter the price' },
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[
              { required: true, message: 'Please enter the quantity' },
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Category ID"
            name="categoryID"
            rules={[{ required: true, message: 'Please select at least one category' }]}
          >
            <Select mode="multiple">
              {category.map((category) => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>

      </Modal>


    </div>

  );
}

export default ManageProduct;