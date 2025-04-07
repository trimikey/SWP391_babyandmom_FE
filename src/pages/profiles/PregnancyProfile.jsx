import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  message,
  Spin,
  Table,
  Button,
  Tabs,
  Popconfirm,
  Tag,
  Card,
  Empty,
  Tooltip,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, LineChartOutlined } from '@ant-design/icons';
import pregnancyProfileApi from "../services/api.pregnancyProfile";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import useMembershipAccess from "../../hooks/useMembershipAccess";
import MembershipRequired from "../../pages/membership/MembershipRequired";
const { Option } = Select;
const { TabPane } = Tabs;

const LoadingScreen = ({ tip = "Đang tải..." }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spin size="large" tip={tip} />
    </div>
  );
};

const PregnancyProfileManager = () => {
  const { isLoading, hasAccess, membershipStatus } = useMembershipAccess();
  const [loading, setLoading] = useState(false);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState("1");
  const [profiles, setProfiles] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const navigate = useNavigate();

  // Fetch all profiles when component mounts
  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoadingProfiles(true);
      const data = await pregnancyProfileApi.getAllProfiles();
      const updatedProfiles = data.map(profile => {
        const lastPeriodMoment = moment(profile.lastPeriod);
        return {
          ...profile,
          dueDate: calculateDueDate(lastPeriodMoment),
          currentWeek: calculateCurrentWeek(lastPeriodMoment),
        };
      });
      setProfiles(updatedProfiles);
    } catch (error) {
      console.error("Error fetching profiles:", error);
      message.error("Không thể tải danh sách hồ sơ thai kỳ");
    } finally {
      setLoadingProfiles(false);
    }
  };

  // Tính ngày dự sinh (kỳ kinh cuối + 9 tháng 10 ngày)
  const calculateDueDate = (lastPeriodDate) => {
    if (!lastPeriodDate) return null;
    return moment(lastPeriodDate).add(9, "months").add(10, "days");
  };
  // Tính tuần thai từ kỳ kinh cuối
  const calculateCurrentWeek = (lastPeriodDate) => {
    if (!lastPeriodDate) return null;
    const days = moment().diff(moment(lastPeriodDate), "days");
    const weeks = Math.floor(days / 7) + 1;
    return weeks;
  };
  // Xử lý khi thay đổi ngày kỳ kinh cuối
  const handleLastPeriodChange = (date) => {
    if (date) {
      const dueDate = calculateDueDate(date);
      const currentWeek = calculateCurrentWeek(date);
  
      if (currentWeek > 45) {
        message.error(
          "Kỳ kinh cuối không hợp lệ. Tuần thai không thể vượt quá 45 tuần. Vui lòng chọn lại ngày."
        );
        form.setFieldsValue({
          lastPeriod: null,
          dueDate: null,
          currentWeek: null,
        });
        return;
      }
  
      form.setFieldsValue({
        dueDate: dueDate,
        currentWeek: currentWeek,
      });
  
    } else {
      form.setFieldsValue({
        dueDate: null,
        currentWeek: null,
      });
    }
  };
  
  // Select profile for editing
const handleEditProfile = (profile) => {
  setIsEditing(true);
  setSelectedProfileId(profile.id);

  const lastPeriodMoment = moment(profile.lastPeriod);

  form.setFieldsValue({
    babyName: profile.babyName,
    babyGender: profile.babyGender,
    lastPeriod: lastPeriodMoment,
    dueDate: moment(profile.dueDate),
    currentWeek: profile.currentWeek,
    height: profile.height,
  });

  // ✅ Gọi tính toán lại dự sinh và tuần thai
  handleLastPeriodChange(lastPeriodMoment);

  setActiveTab("1");
};

  // Handle profile deletion
  const handleDeleteProfile = async (id) => {
    try {
      setLoading(true);
      await pregnancyProfileApi.deleteProfile(id);
      message.success("Xóa hồ sơ thai kỳ thành công");
      fetchProfiles();
      
      // If the deleted profile was selected for editing, reset form
      if (id === selectedProfileId) {
        resetForm();
      }
    } catch (error) {
      console.error("Error deleting profile:", error);
      message.error("Không thể xóa hồ sơ thai kỳ");
    } finally {
      setLoading(false);
    }
  };

  // Reset form for creating new profile
  const resetForm = () => {
    form.resetFields();
    setIsEditing(false);
    setSelectedProfileId(null);
  };

  // Handle submit for both create and update
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const formattedValues = {
        babyName: values.babyName,
        babyGender: values.babyGender,
        dueDate: values.dueDate.format("YYYY-MM-DDTHH:mm:ss"),
        currentWeek: values.currentWeek,
        lastPeriod: values.lastPeriod.format("YYYY-MM-DDTHH:mm:ss"),
        height: parseFloat(values.height),
      };
      
      if (
        !formattedValues.babyName ||
        !formattedValues.babyGender ||
        !formattedValues.dueDate ||
        !formattedValues.currentWeek ||
        !formattedValues.lastPeriod ||
        isNaN(formattedValues.height)
      ) {
        message.error("Vui lòng điền đầy đủ thông tin hợp lệ");
        return;
      }

      let profileData;
      if (isEditing && selectedProfileId) {
        // Update existing profile
        profileData = await pregnancyProfileApi.updateProfile(
          selectedProfileId,
          formattedValues
        );
        message.success("Cập nhật thông tin thai kỳ thành công");
      } else {
        // Create new profile
        profileData = await pregnancyProfileApi.createProfile(
          formattedValues
        );
        message.success("Thêm thông tin thai kỳ thành công");
      }

      if (profileData && profileData.id) {
        localStorage.setItem("profileId", profileData.id);
        localStorage.setItem(
          "currentPregnancyWeek",
          formattedValues.currentWeek
        );
      }

      // Refresh profiles and reset form
      fetchProfiles();
      resetForm();
      
    } catch (error) {
      message.error(
        "Có lỗi xảy ra: " +
          (error.response?.data?.message || "Vui lòng kiểm tra lại thông tin")
      );
    } finally {
      setLoading(false);
    }
  };

  // Table columns configuration
  const columns = [
    {
      title: 'Tên em bé',
      dataIndex: 'babyName',
      key: 'babyName',
      // render: (text, record) => (
      //   <Tooltip title="Xem thông tin tăng trưởng">
      //     <a
      //       className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-medium flex items-center"
      //       onClick={() => {
      //         // Set the profile ID in localStorage
      //         localStorage.setItem("profileId", record.id);
      //         // Set a flag to indicate we want to show records directly
      //         localStorage.setItem("showGrowthRecords", "true");
              
      //         // Show a loading message
      //         message.loading(`Đang chuyển đến trang tăng trưởng của ${text}...`, 1, () => {
      //           // Navigate to the growth records page for this profile
      //           navigate("/growth-records/profile");
      //         });
      //       }}
      //     >
      //       <LineChartOutlined className="mr-1" /> {text}
      //     </a>
      //   </Tooltip>
      // ),
    },
    {
      title: 'Giới tính',
      dataIndex: 'babyGender',
      key: 'babyGender',
      render: gender => {
        if (gender === 'MALE') {
          return <Tag color="blue">Nam</Tag>;
        } else if (gender === 'FEMALE') {
          return <Tag color="pink">Nữ</Tag>;
        } else {
          return <Tag color="gray">Chưa xác định</Tag>; // For undecided gender
        }
      },
    },
    {
      title: 'Ngày dự sinh',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: date => moment(date).format('DD/MM/YYYY'),
    },
    // {
    //   title: 'Tuần thai hiện tại',
    //   dataIndex: 'currentWeek',
    //   key: 'currentWeek',
    //   render: week => (
    //     <Tag color="cyan" className="text-base px-3 py-1">
    //       {week} tuần
    //     </Tag>
    //   ),
    //   sorter: (a, b) => a.currentWeek - b.currentWeek,
    // },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <div className="flex gap-2 flex-wrap">
          <Tooltip title="Xem biểu đồ tăng trưởng">
            <Button
              type="default"
              icon={<LineChartOutlined />}
              size="small"
              className="border-pink-500 text-pink-600 hover:bg-pink-100"
              onClick={() => {
                localStorage.setItem("profileId", record.id);
                localStorage.setItem("showGrowthRecords", "true");
    
                message.loading(`Đang chuyển đến biểu đồ của ${record.babyName}...`, 1, () => {
                  navigate(`/growth-records/profile/`);
                });
              }}
            >
              Biểu đồ
            </Button>
          </Tooltip>
    
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEditProfile(record)}
          >
            Sửa
          </Button>
    
          <Popconfirm
            title="Xác nhận xóa hồ sơ này?"
            onConfirm={() => handleDeleteProfile(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button 
              danger 
              icon={<DeleteOutlined />} 
              size="small"
            >
              Xóa
            </Button>
          </Popconfirm>
        </div>
      ),
    }
    
  ];

  if (isLoading) {
    return <LoadingScreen tip="Đang kiểm tra quyền truy cập..." />;
  }
  
  if (!hasAccess) {
    return <MembershipRequired membershipStatus={membershipStatus} />;
  }
  
  return (
    <div className="min-h-screen bg-cover p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold text-pink-400 mb-6 text-center">
          Quản lý hồ sơ thai kỳ
        </h1>

        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane 
            tab={
              <span>
                {isEditing ? "Cập nhật hồ sơ" : "Thêm mới hồ sơ"}
              </span>
            } 
            key="1"
          >
            <Card className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700">
                  {isEditing ? `Cập nhật thông tin: ${form.getFieldValue('babyName')}` : "Thêm hồ sơ thai kỳ mới"}
                </h2>
                {isEditing && (
                  <Button onClick={resetForm}>
                    Thêm mới
                  </Button>
                )}
              </div>

              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className="space-y-4"
                onValuesChange={(changedValues) => {
                  if (changedValues.lastPeriod) {
                    handleLastPeriodChange(changedValues.lastPeriod);
                  }
                }}
              >
                <Form.Item
                  name="babyName"
                  label="Tên em bé"
                  rules={[{ required: true, message: "Vui lòng nhập tên em bé" }]}
                >
                  <Input placeholder="Nhập tên em bé" className="rounded-lg" />
                </Form.Item>

                <Form.Item
                  name="babyGender"
                  label="Giới tính"
                  rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
                >
                  <Select placeholder="Chọn giới tính" className="rounded-lg">
                    <Option value="MALE">Nam</Option>
                    <Option value="FEMALE">Nữ</Option>
                    <Option value="NULL">Chưa Xác Định</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="lastPeriod"
                  label="Kỳ kinh cuối"
                  rules={[
                    { required: true, message: "Vui lòng chọn kỳ kinh cuối" },
                  ]}
                >
                  <DatePicker
                    className="w-full rounded-lg"
                    format="DD/MM/YYYY"
                    placeholder="Chọn ngày kỳ kinh cuối"
                    onChange={handleLastPeriodChange}
                    disabledDate={(current) => {
                      return current && current > moment().endOf("day");
                    }}
                  />
                </Form.Item>

                <Form.Item name="dueDate" label="Ngày dự sinh">
                  <DatePicker
                    className="w-full rounded-lg"
                    format="DD/MM/YYYY"
                    disabled
                  />
                </Form.Item>

                <Form.Item
                  name="currentWeek"
                  label="Tuần thai"
                  rules={[
                    { required: true, message: "Vui lòng nhập tuần thai" },
                    { type: "number", min: 1, max: 45, message: "Tuần thai phải từ 1 đến 45" },
                  ]}
                  tooltip="Tuần thai được tính tự động dựa trên kỳ kinh cuối. Bạn có thể điều chỉnh thủ công nếu cần."
                >
                  <InputNumber
                    className="w-full rounded-lg"
                    placeholder="Nhập tuần thai hiện tại"
                    step={1}
                    precision={0}
                    min={1}
                    max={45}
                  />
                </Form.Item>

                <Form.Item
                  name="height"
                  label="Chiều cao (cm)"
                  rules={[
                    { required: true, message: "Vui lòng nhập chiều cao" },
                    { type: "number", min: 1, message: "Chiều cao phải lớn hơn 0" },
                  ]}
                >
                  <InputNumber
                    className="w-full rounded-lg"
                    placeholder="Nhập chiều cao"
                    step={1}
                    precision={1}
                    min={1}
                  />
                </Form.Item>

                <Form.Item className="text-center">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    className="bg-pink-400 hover:bg-pink-400 border-pink-400 text-white"
                  >
                    {isEditing ? "Cập nhật" : "Thêm mới"}
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </TabPane>
          
          <TabPane 
            tab={
              <span>
                Danh sách hồ sơ thai kỳ
              </span>
            } 
            key="2"
          >
            <Card>
              {loadingProfiles ? (
                <div className="py-10 flex justify-center">
                  <Spin tip="Đang tải danh sách..." />
                </div>
              ) : profiles.length > 0 ? (
                <Table 
                  dataSource={profiles} 
                  columns={columns} 
                  rowKey="id"
                  pagination={false}
                />
              ) : (
                <Empty 
                  description="Chưa có hồ sơ thai kỳ nào" 
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                  <Button 
                    type="primary" 
                    onClick={() => setActiveTab("1")}
                    icon={<PlusOutlined />}
                  >
                    Tạo hồ sơ mới
                  </Button>
                </Empty>
              )}
            </Card>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default PregnancyProfileManager;