import {
  Button,
  Form,
  Image,
  Input,
  Modal,
  Popconfirm,
  Table,
  Upload,
} from "antd";
import { useForm } from "antd/es/form/Form";
import FormItem from "antd/es/form/FormItem";
import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { PlusOutlined } from "@ant-design/icons";
import uploadFile from "./utils/upload";

const StudentManagement = () => {
  // xử lý JS
  // CRUD cho Student => tương tác thông qua API

  const [studentList, setStudentList] = useState([]);
  const [isOpen, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar) => <Image src={avatar} width={100} />,
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (id, student) => {
        return (
          <>
            <Button
              type="primary"
              onClick={() => {
                setOpen(true);
                form.setFieldsValue(student);
                if (student.avatar) {
                  setFileList([
                    {
                      name: "image.png",
                      status: "done",
                      url: student.avatar,
                    },
                  ]);
                }
              }}
            >
              Edit
            </Button>
            <Popconfirm
              title="Delete the student"
              description="Are you sure to delete this student?"
              onConfirm={() => handleDeleteStudent(id)}
            >
              <Button danger type="primary">
                Delete
              </Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  const handleDeleteStudent = async (id) => {
    await axios.delete(
      `https://67825c0ac51d092c3dcf2ce2.mockapi.io/Student/${id}`
    );
    toast.success("Successfully delete student!");
    fetchStudent();
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  // get dữ liệu
  const fetchStudent = async () => {
    // tạo ra 1 hành động để xử lý việc lấy danh sách học sinh
    console.log("fetching student!!!");

    // xuống back end lấy cái danh sách student

    // nhờ axios call api

    // promise
    // không xảy ra ngay lập tức => bất đồng bộ
    const response = await axios.get(
      "https://67825c0ac51d092c3dcf2ce2.mockapi.io/Student"
    );

    // student data
    console.log(response.data);
    setStudentList(response.data);

    console.log("done fetch student!!!");
  };

  // event => chạy khi page vừa load lên

  useEffect(() => {
    fetchStudent(); // => lấy danh sách học sinh
    // chạy mỗi khi load trang lên
  }, []);

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleSubmitForm = async (values) => {
    console.log(values);

    // upload tấm ảnh lên Firebase Storage trước
    if (values.avatar.file?.originFileObj) {
      const url = await uploadFile(values.avatar.file.originFileObj);
      values.avatar = url;
    }

    if (values.id) {
      // update
      await axios.put(
        `https://67825c0ac51d092c3dcf2ce2.mockapi.io/Student/${values.id}`,
        values
      );
    } else {
      // create
      await axios.post(
        "https://67825c0ac51d092c3dcf2ce2.mockapi.io/Student",
        values
      );
    }

    toast.success("Successfully create new student");
    handleCloseModal();
    fetchStudent();
    form.resetFields();
  };

  return (
    <div>
      <ToastContainer />
      <h1>Student Management</h1>
      <Button onClick={handleOpenModal}>Add new student</Button>
      <Table dataSource={studentList} columns={columns} />
      <Modal
        title="Create new student"
        open={isOpen}
        onClose={handleCloseModal}
        onCancel={handleCloseModal}
        onOk={() => form.submit()}
      >
        <Form
          labelCol={{
            span: 24,
          }}
          form={form}
          onFinish={handleSubmitForm}
        >
          <FormItem label="Id" name="id" hidden>
            <Input />
          </FormItem>
          <FormItem
            label="Code"
            name="code"
            rules={[
              {
                required: true,
                message: "Code can not be empty!",
              },
            ]}
          >
            <Input />
          </FormItem>
          <FormItem
            label="Full Name"
            name="fullName"
            rules={[
              {
                required: true,
                message: "Full name can not be empty!",
              },
            ]}
          >
            <Input />
          </FormItem>

          <FormItem label="Avatar" name="avatar">
            <Upload
              action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
            >
              {fileList.length >= 8 ? null : uploadButton}
            </Upload>
          </FormItem>
        </Form>
      </Modal>

      {previewImage && (
        <Image
          wrapperStyle={{
            display: "none",
          }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </div>
  );
};

export default StudentManagement;
