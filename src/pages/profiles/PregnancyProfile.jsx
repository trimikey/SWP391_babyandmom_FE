import React, { useState, useEffect } from 'react';
import { Form, Input, Select, DatePicker, InputNumber, Button, message, Card, Popconfirm } from 'antd';
import pregnancyProfileApi from '../services/api.pregnancyProfile';
import moment from 'moment';
import backgroundImage from '../../assets/background.jpg';
const { Option } = Select;

const PregnancyProfile = () => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [form] = Form.useForm();

  // Tính ngày dự sinh (kỳ kinh cuối + 9 tháng 10 ngày)
  const calculateDueDate = (lastPeriodDate) => {
    if (!lastPeriodDate) return null;
    return moment(lastPeriodDate).add(9, 'months').add(10, 'days');
  };

  // Tính tuần thai từ kỳ kinh cuối
  const calculateCurrentWeek = (lastPeriodDate) => {
    if (!lastPeriodDate) return null;
    const days = moment().diff(moment(lastPeriodDate), 'days');
    const weeks = Math.floor(days / 7) + 1;
    return weeks;
  };

  // Xử lý khi thay đổi ngày kỳ kinh cuối
  const handleLastPeriodChange = (date) => {
    if (date) {
      const dueDate = calculateDueDate(date);
      const currentWeek = calculateCurrentWeek(date);
      
      if (currentWeek > 45) {
        message.error('Kỳ kinh cuối không hợp lệ. Tuần thai không thể vượt quá 45 tuần. Vui lòng chọn lại ngày.');
        form.setFieldsValue({
          lastPeriod: null,
          dueDate: null,
          currentWeek: null
        });
        return;
      }

      form.setFieldsValue({
        dueDate: dueDate,
        currentWeek: currentWeek
      });
    } else {
      form.setFieldsValue({
        dueDate: null,
        currentWeek: null
      });
    }
  };

  // Theo dõi sự thay đổi của form
  useEffect(() => {
    // Đăng ký theo dõi sự thay đổi của trường lastPeriod
    const { lastPeriod } = form.getFieldsValue();
    if (lastPeriod) {
      handleLastPeriodChange(lastPeriod);
    }
  }, [form.getFieldValue('lastPeriod')]);

  // Fetch profile
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await pregnancyProfileApi.getAllProfiles();
      if (data && data.length > 0) {
        setProfile(data[0]);
        
        // Lưu profileId vào localStorage
        localStorage.setItem('profileId', data[0].id);
        
        form.setFieldsValue({
          babyName: data[0].babyName,
          babyGender: data[0].babyGender,
          dueDate: moment(data[0].dueDate),
          currentWeek: data[0].currentWeek,
          lastPeriod: moment(data[0].lastPeriod),
          height: data[0].height
        });

        // tính tuần thai 
        const currentWeek = calculateCurrentWeek(data[0].lastPeriod);
        localStorage.setItem('currentPregnancyWeek', currentWeek);
      }
    } catch (error) {
      message.error('Không thể tải thông tin thai kỳ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle submit
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const formattedValues = {
        babyName: values.babyName,
        babyGender: values.babyGender,
        dueDate: values.dueDate.format('YYYY-MM-DDTHH:mm:ss'),
        currentWeek: values.currentWeek,
        lastPeriod: values.lastPeriod.format('YYYY-MM-DDTHH:mm:ss'),
        height: parseFloat(values.height)
      };

      if (!formattedValues.babyName || !formattedValues.babyGender || !formattedValues.dueDate || !formattedValues.currentWeek || !formattedValues.lastPeriod || isNaN(formattedValues.height)) {
        message.error('Vui lòng điền đầy đủ thông tin hợp lệ');
        return;
      }

      let profileData;
      if (profile?.id) {
        profileData = await pregnancyProfileApi.updateProfile(profile.id, formattedValues);
        message.success('Cập nhật thông tin thành công');
      } else {
        profileData = await pregnancyProfileApi.createProfile(formattedValues);
        message.success('Thêm thông tin thành công');
        
        // Lưu profileId vào localStorage sau khi tạo mới
        if (profileData && profileData.id) {
          localStorage.setItem('profileId', profileData.id);
        }
      }
      
      fetchProfile();
    } catch (error) {
      message.error('Có lỗi xảy ra: ' + (error.response?.data?.message || 'Vui lòng kiểm tra lại thông tin'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await pregnancyProfileApi.deleteProfile(profile.id);
      
      // Clear pregnancy-related data from localStorage
      localStorage.removeItem('currentPregnancyWeek');
      localStorage.removeItem('profileId');
      
      message.success('Xóa hồ sơ thành công');
      setProfile(null);
      form.resetFields();
      
      // Redirect to home or another appropriate page if needed
      // If you're using react-router-dom, uncomment the following:
      // navigate('/');
    } catch (error) {
      console.error('Error deleting profile:', error);
      message.error('Không thể xóa hồ sơ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cover p-6" style={{ backgroundImage: `url(${backgroundImage})` }}>
      {/* <style jsx>{`
        .ant-picker-header-view {
          color: #000000 !important;
          pointer-events: none !important;
        }
        .ant-picker-content th {
          color: #000000 !important;
        }
        .ant-picker-cell {
          color: #000000 !important;
        }
        .ant-picker-cell-disabled {
          color: rgba(0, 0, 0, 0.25) !important;
        }
        .ant-picker-super-prev-icon::after,
        .ant-picker-super-next-icon::after,
        .ant-picker-prev-icon::after,
        .ant-picker-next-icon::after {
          border-color: #000000 !important;
        }
        .ant-picker-header-super-prev-btn,
        .ant-picker-header-super-next-btn {
          display: none !important;
        }
        .ant-picker-decade-panel,
        .ant-picker-year-panel {
          display: none !important;
        }
      `}</style> */}
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-lg rounded-lg">
          <h1 className="text-2xl font-semibold text-pink-400 mb-6 text-center">
            Thông Tin Thai Kỳ
          </h1>

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
              rules={[{ required: true, message: 'Vui lòng nhập tên em bé' }]}
            >
              <Input placeholder="Nhập tên em bé" className="rounded-lg" />
            </Form.Item>

            <Form.Item
              name="babyGender"
              label="Giới tính"
              rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
            >
              <Select placeholder="Chọn giới tính" className="rounded-lg">
                <Option value="MALE">Nam</Option>
                <Option value="FEMALE">Nữ</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="lastPeriod"
              label="Kỳ kinh cuối"
              rules={[{ required: true, message: 'Vui lòng chọn kỳ kinh cuối' }]}
            >
              <DatePicker 
                className="w-full rounded-lg" 
                format="DD/MM/YYYY"
                placeholder="Chọn ngày kỳ kinh cuối"
                onChange={handleLastPeriodChange}
                disabledDate={(current) => {
                  return current && current > moment().endOf('day');
                }}
              />
            </Form.Item>

            <Form.Item
              name="dueDate"
              label="Ngày dự sinh"
            >
              <DatePicker 
                className="w-full rounded-lg" 
                format="DD/MM/YYYY HH:mm:ss"
                showTime
                disabled
              />
            </Form.Item>

            <Form.Item
              name="currentWeek"
              label="Tuần thai (tự động tính từ kỳ kinh cuối)"
            >
              <InputNumber 
                className="w-full rounded-lg"
                disabled
                min={0}
                max={45}
              />
            </Form.Item>

            <Form.Item
              name="height"
              label="Chiều cao (cm)"
              rules={[
                { required: true, message: 'Vui lòng nhập chiều cao' },
                { type: 'number', min: 0.1, message: 'Chiều cai phải lớn hơn 0' }
              ]}
            >
              <InputNumber 
                className="w-full rounded-lg"
                placeholder="Nhập chiều cao" 
                step={0.1}
                precision={1}
                min={0.1}
              />
            </Form.Item>

            <Form.Item className="text-center">
              <button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                className="bg-pink-400 hover:bg-pink-400 border-pink-400 text-white px-3 py-1 rounded-lg"
              >
                {profile ? 'Cập nhật' : 'Thêm mới'}
              </button>
              {profile && (
                <Popconfirm
                  title="Bạn có chắc muốn xóa hồ sơ này?"
                  onConfirm={handleDelete}
                  okText="Có"
                  cancelText="Không"
                >
                  <Button 
                    type="danger" 
                    className="ml-4"
                  >
                    Xóa
                  </Button>
                </Popconfirm>
              )}
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default PregnancyProfile; 