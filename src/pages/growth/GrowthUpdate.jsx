import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import backgroundImage from '../../assets/background.jpg';
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
  const [weightWarning, setWeightWarning] = useState('');


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
    try {
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
        
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          setGrowthRecords(response.data);
          
          // Lấy bản ghi mới nhất (phần tử cuối cùng của mảng)
          const latestRecord = response.data[response.data.length - 1];
          
          if (latestRecord) {
            // Khi có bản ghi mới nhất, đặt isEditing thành true
            setIsEditing(true);
            
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
      } else {
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
    } catch (error) {
      console.error('Error fetching growth records:', error);
    }
  };

  const onFinish = async (values) => {
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
      if (isEditing && id) { 
        await api.put(`/growth-records/${id}`, requestData);
        message.success('Cập nhật thông tin thành công!');
      } else {
        const response = await api.post('/growth-records', requestData);
        message.success('Tạo thông tin thành công!');
        setIsEditing(true); // Đặt isEditing thành true ngay khi tạo mới
        
        if (response.data && response.data.id) {
          // Lưu id mới vào state/local storage
          localStorage.setItem('lastGrowthRecordId', response.data.id);
          // Sửa đường dẫn để phù hợp với cấu trúc route
          navigate(`/growth-records/profile/${response.data.id}`, { replace: true });
        }
      }
      // Fetch lại dữ liệu để cập nhật form
      fetchGrowthRecords();
    } catch (error) {
      console.error('Error in form submission:', error);
      message.error('Có lỗi xảy ra khi cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  const checkWeightGain = (pregnancyWeek, currentWeight, preWeight) => {
    if (!pregnancyWeek || !currentWeight || !preWeight) return;
    
    const weightGain = currentWeight - preWeight;
    let warning = '';

    if (pregnancyWeek <= 12) {
      if (weightGain < 0.5) warning = 'Tăng cân quá ít có thể ảnh hưởng đến sự phát triển của thai nhi';
      if (weightGain > 2) warning = 'Tăng cân quá nhiều, cần kiểm soát chế độ ăn uống';
    } else if (pregnancyWeek <= 28) {
      if (weightGain < 4) warning = 'Tăng cân quá ít có thể ảnh hưởng đến sự phát triển của thai nhi';
      if (weightGain > 8) warning = 'Tăng cân quá nhiều, cần kiểm soát chế độ ăn uống';
    } else {
      if (weightGain < 8) warning = 'Tăng cân quá ít có thể ảnh hưởng đến sự phát triển của thai nhi';
      if (weightGain > 12) warning = 'Tăng cân quá nhiều, cần kiểm soát chế độ ăn uống';
    }

    setWeightWarning(warning);
  };

  const handleFormChange = () => {
    const values = form.getFieldsValue();
    checkWeightGain(
      Number(values.pregnancyWeek),
      Number(values.prePregnancyWeight),
      Number(values.pregnancyWeight)
    );
  };

  return (
    <div className="min-h-screen relative">
      {/* Background với overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-xl mx-auto bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-semibold text-pink-600 mb-8 text-center">
            {isEditing ? 'Cập Nhật Thông Tin Thai Kỳ' : 'Thêm Thông Tin Thai Kỳ'}
          </h2>

          <Form 
            form={form} 
            layout="vertical" 
            onFinish={onFinish}
            onValuesChange={handleFormChange}
            className="space-y-4"
          >
            <div className="flex flex-col space-y-4">
              <Form.Item
                label="Tuần Thai"
                name="pregnancyWeek"
                rules={[{ required: true, message: 'Vui lòng nhập tuần thai!' }]}
              >
                <Input type="number" min={1} max={42} className="rounded-md w-full" />
              </Form.Item>

              <Form.Item
                label="Cân Nặng Thai (g)"
                name="pregnancyWeight"
                rules={[{ required: true, message: 'Vui lòng nhập cân nặng thai!' }]}
              >
                <Input type="number" step="0.1" min={0} className="rounded-md w-full" />
              </Form.Item>

              <Form.Item
                label="Chiều Cao Thai (mm)"
                name="pregnancyHeight"
                rules={[{ required: true, message: 'Vui lòng nhập chiều cao thai!' }]}
              >
                <Input type="number" step="0.1" min={0} className="rounded-md w-full" />
              </Form.Item>

              <Form.Item
                label="Cân Nặng Trước Thai Kỳ (kg)"
                name="prePregnancyWeight"
                rules={[{ required: true, message: 'Vui lòng nhập cân nặng trước thai kỳ!' }]}
              >
                <Input type="number" step="0.1" min={0} className="rounded-md w-full" />
              </Form.Item>

              <Form.Item
                label="Chiều Cao Trước Thai Kỳ (cm)"
                name="prePregnancyHeight"
                rules={[{ required: true, message: 'Vui lòng nhập chiều cao trước thai kỳ!' }]}
              >
                <Input type="number" step="0.1" min={0} className="rounded-md w-full" />
              </Form.Item>
            </div>

            {weightWarning && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 mt-4">
                ⚠️ {weightWarning}
              </div>
            )}

            <Form.Item className="text-center mt-8">
              <button
                type="submit"
                className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-2 rounded-full 
                           transform transition-all duration-200 hover:scale-105 
                           shadow-md hover:shadow-lg"
              >
                {isEditing ? 'Cập Nhật' : 'Tạo Mới'}
              </button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default GrowthUpdate