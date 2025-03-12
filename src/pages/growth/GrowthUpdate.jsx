import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';

import api from '../../config/axios';
import { useParams, useNavigate } from 'react-router-dom';

const GrowthUpdate = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const profileId = localStorage.getItem('profileId');
  const navigate = useNavigate();
  const [growthRecords, setGrowthRecords] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    console.log('Current profileId:', profileId);
    if (profileId) {
      console.log('Fetching growth records for profileId:', profileId);
      fetchGrowthRecords();
    }
  }, [profileId]);

  useEffect(() => {
    // Set isEditing dựa vào id từ params
    console.log('Current id:', id);
    if (id) {
      setIsEditing(true);
      fetchGrowthRecords();
    }
  }, [id]);

  const fetchGrowthRecords = async () => {
      const token = localStorage.getItem('token');
      if(!id){
        const response = await api.get(`/growth-records/current`, {
          params: {
            profileId: profileId
          },
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('Growth records response:', response.data);
        
        if (response.data && Array.isArray(response.data)) {
          setGrowthRecords(response.data);
          
          // Lấy bản ghi mới nhất (phần tử cuối cùng của mảng)
          const latestRecord = response.data[response.data.length - 1];
          
          if (latestRecord) {
            console.log('Latest growth record:', latestRecord);
            form.setFieldsValue({
              pregnancyWeek: latestRecord.pregnancyWeek,
              pregnancyWeight: latestRecord.pregnancyWeight,
              pregnancyHeight: latestRecord.pregnancyHeight,
              prePregnancyWeight: latestRecord.prePregnancyWeight,
              prePregnancyHeight: latestRecord.prePregnancyHeight,
              notes: latestRecord.notes
            });
          }
          
        }
      }else{
        const response = await api.get(`/growth-records/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }); 
        setGrowthRecords(response.data);
          const recordToEdit = response.data;
          if (recordToEdit) {
            console.log('Found record to edit:', recordToEdit);
            form.setFieldsValue({
              pregnancyWeek: recordToEdit.pregnancyWeek,
              pregnancyWeight: recordToEdit.pregnancyWeight,
              pregnancyHeight: recordToEdit.pregnancyHeight,
              prePregnancyWeight: recordToEdit.prePregnancyWeight,
              prePregnancyHeight: recordToEdit.prePregnancyHeight,
              notes: recordToEdit.notes
            });
          } else {
            message.error('Không tìm thấy thông tin theo dõi thai kỳ');
          }
      
      }
     
     
  };

  const onFinish = async (values) => {
    // if (!profileId) {
    //   message.error('Không tìm thấy ID hồ sơ thai kỳ');
    //   return;
    // }

    try {
      setLoading(true);
      const requestData = {
        pregnancyWeek: Number(values.pregnancyWeek),
        pregnancyWeight: Number(values.pregnancyWeight),
        pregnancyHeight: Number(values.pregnancyHeight),
        prePregnancyWeight: Number(values.prePregnancyWeight),
        prePregnancyHeight: Number(values.prePregnancyHeight),
        notes: values.notes || '',
        profileId: Number(profileId)
      };

      console.log('Sending request with data:', requestData);
      console.log('isEditing:', isEditing);
      console.log('id:', id);  
      if (isEditing && id) { // Kiểm tra cả isEditing và id
        await api.put(`/growth-records/${id}`, requestData);
        message.success('Cập nhật thông tin thành công!');
      } else {
        const response = await api.post('/growth-records', requestData);
        message.success('Tạo thông tin thành công!');
        setIsEditing(true);
        if (response.data && response.data.id) {
          // Chuyển hướng đến trang edit với id mới
          navigate(`/growth-records/${response.data.id}`, { replace: true });
        }
      }
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
          {isEditing ? 'Cập Nhật Thông Tin Thai Kỳ' : 'Thêm Thông Tin Thai Kỳ'}
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
            label="Cân Nặng Thai (g)"
            name="pregnancyWeight"
            rules={[{ required: true, message: 'Vui lòng nhập cân nặng thai!' }]}
          >
            <Input type="number" step="0.1" min={0} />
          </Form.Item>

          <Form.Item
            label="Chiều Cao Thai (mm)"
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

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="bg-pink-500 hover:bg-pink-600 border-pink-500"
            >
              {isEditing ? 'Cập Nhật' : 'Tạo Mới'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default GrowthUpdate;