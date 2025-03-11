import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import api from '../../config/axios';
import { useParams, useNavigate } from 'react-router-dom';

const GrowthUpdate = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const { id, profileId } = useParams();
  const navigate = useNavigate();

  // Fetch profile data when component mounts
  useEffect(() => {
    if (profileId) {
      fetchProfile(profileId);
    }
  }, [profileId]);

  const fetchProfile = async (profileId) => {
    try {
      // Log để debug
      console.log('Fetching profile with ID:', profileId);
      
      // Sửa lại endpoint cho đúng với backend
      const response = await api.get(`/pregnancy-profile/${profileId}`);
      console.log('Profile response:', response);
      
      if (response.data) {
        setProfile(response.data);
        // If we have a growth record ID, fetch its data
        if (id) {
          fetchGrowthRecord(id);
        }
      } else {
        throw new Error('No profile data received');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      message.error('Không thể tải thông tin hồ sơ thai kỳ');
      navigate('/Profile/pregnancy-profile');
    }
  };

  const fetchGrowthRecord = async (recordId) => {
    try {
      // Sửa lại endpoint cho đúng với backend
      const response = await api.get(`/growth-records/${recordId}`);
      console.log('Growth record data:', response.data);
      if (response.data) {
        form.setFieldsValue(response.data);
      }
    } catch (error) {
      console.error('Error fetching growth record:', error);
      message.error('Không thể tải thông tin theo dõi thai kỳ');
    }
  };

  const onFinish = async (values) => {
    if (!profile?.id) {
      message.error('Không tìm thấy thông tin hồ sơ thai kỳ');
      return;
    }

    setLoading(true);
    try {
      const requestData = {
        ...values,
        profileId: profile.id
      };

      console.log('Request data:', requestData);

      if (id) {
        await api.put(`/growth-records/${id}`, requestData);
        message.success('Cập nhật thông tin thành công!');
      } else {
        await api.post('/growth-records', requestData);
        message.success('Tạo thông tin thành công!');
      }
      navigate(`/Profile/pregnancy-profile/${profile.id}`);
    } catch (error) {
      console.error('Error in form submission:', error);
      message.error('Có lỗi xảy ra khi cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold text-pink-600 mb-6">
          {id ? 'Cập Nhật Thông Tin Thai Kỳ' : 'Thêm Thông Tin Thai Kỳ'}
        </h2>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Tuần Thai"
            name="pregnancyWeek"
            rules={[{ required: true, message: 'Vui lòng nhập tuần thai!' }]}
          >
            <Input type="number" min={1} max={42} />
          </Form.Item>

          <Form.Item
            label="Cân Nặng Thai (kg)"
            name="pregnancyWeight"
            rules={[{ required: true, message: 'Vui lòng nhập cân nặng thai!' }]}
          >
            <Input type="number" step="0.1" min={0} />
          </Form.Item>

          <Form.Item
            label="Chiều Cao Thai (cm)"
            name="pregnancyHeight"
            rules={[{ required: true, message: 'Vui lòng nhập chiều cao thai!' }]}
          >
            <Input type="number" step="0.1" min={0} />
          </Form.Item>

          <Form.Item
            label="Cân Nặng Trước Thai Kỳ (kg)"
            name="prePregnancyWeight"
            rules={[{ required: true, message: 'Vui lòng nhập cân nặng trước thai kỳ!' }]}
          >
            <Input type="number" step="0.1" min={0} />
          </Form.Item>

          <Form.Item
            label="Chiều Cao Trước Thai Kỳ (cm)"
            name="prePregnancyHeight"
            rules={[{ required: true, message: 'Vui lòng nhập chiều cao trước thai kỳ!' }]}
          >
            <Input type="number" step="0.1" min={0} />
          </Form.Item>

          <Form.Item
            label="Ghi Chú"
            name="notes"
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="bg-pink-500 hover:bg-pink-600 border-pink-500"
            >
              {id ? 'Cập Nhật' : 'Tạo Mới'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default GrowthUpdate; 