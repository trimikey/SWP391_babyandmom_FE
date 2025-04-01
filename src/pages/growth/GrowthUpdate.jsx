import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Popconfirm } from 'antd';
import backgroundImage from '../../assets/background.jpg';
import api from '../../config/axios';
import { useParams, useNavigate } from 'react-router-dom';
import useMembershipAccess from '../../hooks/useMembershipAccess';
import MembershipRequired from '../../pages/membership/MembershipRequired';
import { Spin } from 'antd';


const GrowthUpdate = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const profileId = localStorage.getItem('profileId');
  const navigate = useNavigate();
  const [growthRecords, setGrowthRecords] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [weightWarning, setWeightWarning] = useState('');
  const [preBMI, setPreBMI] = useState(null);
  const [currentBMI, setCurrentBMI] = useState(null);
  const [alertStatus, setAlertStatus] = useState(null);
  const [minPregnancyWeek, setMinPregnancyWeek] = useState(1);
  const [profileExists, setProfileExists] = useState(true);
  const { isLoading, hasAccess } = useMembershipAccess();

  useEffect(() => {
    // console.log('Current profileId:', profileId);
    if (profileId) {
      // console.log('Fetching growth records for profileId:', profileId);
      fetchGrowthRecords();
      fetchPregnancyProfile();
    }
  }, [profileId]);

  useEffect(() => {
    // Set isEditing dựa vào id từ params
    // console.log('Current id:', id);
    if (id) {
      setIsEditing(true);
      fetchGrowthRecordById(id);
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
          
        });
        
        console.log('Growth records response:', response.data);
        
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          setGrowthRecords(response.data);
          
          // Lấy bản ghi mới nhất (phần tử cuối cùng của mảng)
          const latestRecord = response.data[response.data.length - 1];
          
          if (latestRecord) {
            // Khi có bản ghi mới nhất, đặt isEditing thành true
            setIsEditing(true);
            populateFormWithRecord(latestRecord);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching growth records:', error);
    }
  };

  const fetchGrowthRecordById = async (recordId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await api.get(`/growth-records/${recordId}`, {
       
      }); 
      const recordToEdit = response.data;
      if (recordToEdit) {
        console.log('Found record to edit:', recordToEdit);
        populateFormWithRecord(recordToEdit);
      } else {
        message.error('Không tìm thấy thông tin theo dõi thai kỳ');
      }
    } catch (error) {
      console.error('Error fetching growth record by id:', error);
      message.error('Có lỗi xảy ra khi tải thông tin theo dõi thai kỳ');
    }
  };

  const populateFormWithRecord = (record) => {
    form.setFieldsValue({
      pregnancyWeek: record.pregnancyWeek,
      pregnancyWeight: record.pregnancyWeight,
      pregnancyHeight: record.pregnancyHeight,
      prePregnancyWeight: record.prePregnancyWeight,
      prePregnancyHeight: record.prePregnancyHeight,
      notes: record.notes
    });
    
    // Lưu thông tin BMI và cảnh báo
    setPreBMI(record.prePregnancyBMI);
    setCurrentBMI(record.currentBMI);
    setWeightWarning(record.weightWarning);
    setAlertStatus(record.alertStatus);
  };

  const onFinish = async (values) => {
    try {
      // Kiểm tra lại tuần thai trước khi submit
      if (parseInt(values.pregnancyWeek) < minPregnancyWeek) {
        message.error(`Tuần thai không thể nhỏ hơn tuần hiện tại (${minPregnancyWeek})`);
        return;
      }
      
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
        message.success('Cập nhật thành công!');
        // Refresh data to show updated BMI and warnings
        fetchGrowthRecordById(id);
      } else {
        const response = await api.post('/growth-records', requestData);
        message.success('Tạo mới thành công!');
        
        // Cập nhật state và chuyển hướng
        if (response.data && response.data.id) {
          setIsEditing(true);
          navigate(`/growth-records/profile/${response.data.id}`, { replace: true });
          // Fetch lại dữ liệu
          fetchGrowthRecords();
        }
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  // Hàm để hiển thị đúng ngôn ngữ Tiếng Việt cho cảnh báo
  const translateWarning = (warning) => {
    if (warning.includes("too little") || warning.includes("Gaining too little")) {
      return "Tăng cân quá ít có thể ảnh hưởng đến sự phát triển của thai nhi";
    } else if (warning.includes("too much") || warning.includes("Gain too much")) {
      return "Tăng cân quá nhiều, cần kiểm soát chế độ ăn uống";
    } else if (warning.includes("Normal")) {
      return "Mức tăng cân bình thường";
    }
    return warning;
  };

  // Hàm để quyết định màu sắc dựa trên alert status
  const getAlertStatusColor = (status) => {
    switch(status) {
      case 'LOW':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'NORMAL':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'HIGH':
        return 'bg-red-50 border-red-200 text-red-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const getAlertStatusIcon = (status) => {
    switch(status) {
      case 'LOW':
        return '⚠️';
      case 'NORMAL':
        return '✅';
      case 'HIGH':
        return '⛔';
      default:
        return 'ℹ️';
    }
  };

  const getBMICategory = (bmi) => {
    if (!bmi) return 'N/A';
    if (bmi < 18.5) return 'Thiếu cân';
    if (bmi < 25) return 'Bình thường'; 
    if (bmi < 30) return 'Thừa cân';
    return 'Béo phì';
  };

  // Màu sắc cho từng phân loại BMI
  const getBMIColorClass = (bmi) => {
    if (!bmi) return 'text-gray-500';
    if (bmi < 18.5) return 'text-blue-600';
    if (bmi < 25) return 'text-green-600';
    if (bmi < 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Thêm hàm mới để lấy thông tin profile thai kỳ
  const fetchPregnancyProfile = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await api.get(`/pregnancy-profile`);
      
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        console.log('Pregnancy profiles:', response.data);
        
        let selectedProfile;
        if (profileId) {
          selectedProfile = response.data.find(profile => profile.id == profileId);
        }
        
        if (!selectedProfile && response.data.length > 0) {
          selectedProfile = response.data[0];
        }
        
        if (selectedProfile && selectedProfile.currentWeek) {
          setMinPregnancyWeek(selectedProfile.currentWeek);
          setProfileExists(true);
        } else {
          setProfileExists(false);
        }
      } else {
        console.warn('No pregnancy profiles found');
        setProfileExists(false);
      }
    } catch (error) {
      console.error('Error fetching pregnancy profiles:', error);
      message.error('Không thể tải thông tin thai kỳ');
      setProfileExists(false);
    }
  };

  useEffect(() => {
    if (!profileExists) {
      message.info('Không tìm thấy thông tin thai kỳ. Vui lòng tạo thông tin thai kỳ trước.');
      // Redirect to pregnancy profile page after a short delay
      const timer = setTimeout(() => {
        navigate('/pregnancy-profile');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [profileExists, navigate]);

  // Thêm hàm xử lý xóa bản ghi tăng trưởng
  const handleDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/growth-records/${id}`);
      message.success('Xóa bản ghi tăng trưởng thành công');
      
      // Sau khi xóa, chuyển hướng về trang chính
      navigate('/profile/pregnancy-profile');
    } catch (error) {
      console.error('Error deleting growth record:', error);
      message.error('Không thể xóa bản ghi tăng trưởng');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" tip="Đang kiểm tra quyền truy cập..." />
      </div>
    );
  }

  if (!hasAccess) {
    return <MembershipRequired />;
  }

  return (
    <div className="min-h-screen bg-cover p-6" style={{ backgroundImage: `url(${backgroundImage})` }}>
      {/* Background với overlay */}
     

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-xl mx-auto bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-semibold text-pink-600 mb-8 text-center">
            {isEditing ? 'Cập Nhật Thông Tin Thai Kỳ' : 'Cập nhật tăng trưởng'}
          </h2>

          {/* Hiển thị BMI và cảnh báo nếu có */}
          {isEditing && (
            <div className="mb-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-blue-700 font-medium mb-1">BMI trước thai kỳ</h3>
                  <p className="text-xl font-semibold">{preBMI ? Math.round(preBMI) : 'N/A'}</p>
                  <p className={`text-sm ${getBMIColorClass(preBMI)}`}>
                    {getBMICategory(preBMI)}
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-blue-700 font-medium mb-1">BMI hiện tại</h3>
                   {/* chinh so BMI theo hang chuc */}
                  <p className="text-xl font-semibold">{currentBMI ? Math.round(currentBMI) : 'N/A'}</p>
                  <p className={`text-sm ${getBMIColorClass(currentBMI)}`}>
                    {getBMICategory(currentBMI)}
                  </p>
                </div>
              </div>
              
              {alertStatus && (
                <div className={`p-4 border rounded-lg ${getAlertStatusColor(alertStatus)}`}>
                  <div className="flex items-start">
                    <span className="mr-2 text-xl">{getAlertStatusIcon(alertStatus)}</span>
                    <div>
                      <h3 className="font-medium">
                        Tình trạng: {alertStatus === 'NORMAL' ? 'Bình thường' : alertStatus === 'LOW' ? 'Thấp' : 'Cao'}
                      </h3>
                      <p>
                        {alertStatus === 'NORMAL' 
                          ? "Mức tăng cân bình thường" 
                          : alertStatus === 'LOW'
                            ? "Tăng cân quá ít có thể ảnh hưởng đến sự phát triển của thai nhi"
                            : "Tăng cân quá nhiều, cần kiểm soát chế độ ăn uống"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <Form 
            form={form} 
            layout="vertical" 
            onFinish={onFinish}
            className="space-y-4"
          >
            <div className="flex flex-col space-y-4">
              <Form.Item
                label="Tuần Thai"
                name="pregnancyWeek"
                rules={[
                  { required: true, message: 'Vui lòng nhập tuần thai!' },
                  { 
                    validator: (_, value) => {
                      const weekValue = parseInt(value);
                      if (isNaN(weekValue) || weekValue <= minPregnancyWeek) {
                        return Promise.reject(`Tuần thai phải lớn hơn tuần ${minPregnancyWeek} theo thông tin thai kỳ`);
                      }
                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <Input 
                  type="number" 
                  min={minPregnancyWeek + 1} 
                  max={42} 
                  className="rounded-md w-full"
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value <= minPregnancyWeek) {
                      message.warning(`Tuần thai phải lớn hơn tuần hiện tại (${minPregnancyWeek})`);
                      form.setFieldsValue({
                        pregnancyWeek: minPregnancyWeek + 1
                      });
                    }
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Cân Nặng Hiện Tại (kg)"
                name="pregnancyWeight"
                rules={[{ required: true, message: 'Vui lòng nhập cân nặng hiện tại!' }]}
              >
                <Input type="number" step="1" min={0} className="rounded-md w-full" />
              </Form.Item>

              <Form.Item
                label="Chiều Cao Hiện Tại (cm)"
                name="pregnancyHeight"
                rules={[{ required: true, message: 'Vui lòng nhập chiều cao hiện tại!' }]}
              >
                <Input type="number" step="1" min={0} className="rounded-md w-full" />
              </Form.Item>

              <Form.Item
                label="Cân Nặng Trước Thai Kỳ (kg)"
                name="prePregnancyWeight"
                rules={[{ required: true, message: 'Vui lòng nhập cân nặng trước thai kỳ!' }]}
              >
                <Input type="number" step="1" min={0} className="rounded-md w-full" />
              </Form.Item>

              <Form.Item
                label="Chiều Cao Trước Thai Kỳ (cm)"
                name="prePregnancyHeight"
                rules={[{ required: true, message: 'Vui lòng nhập chiều cao trước thai kỳ!' }]}
              >
                <Input type="number" step="1" min={0} className="rounded-md w-full" />
              </Form.Item>
              
              <Form.Item
                label="Ghi chú"
                name="notes"
              >
                <Input.TextArea rows={4} className="rounded-md w-full" />
              </Form.Item>
            </div>

            <Form.Item className="text-center mt-8 flex justify-center gap-4">
              <button
                type="submit"
                className="bg-pink-400 hover:bg-pink-400 border-pink-400 text-white px-3 py-1 rounded-lg"

              >
                {isEditing ? 'Cập Nhật' : 'Tạo Mới'}
              </button>
              
              {/* Thêm nút Xóa khi đang ở chế độ chỉnh sửa */}
              {isEditing && id && (
                <Popconfirm
                  title="Bạn có chắc muốn xóa bản ghi tăng trưởng này?"
                  onConfirm={handleDelete}
                  okText="Có"
                  cancelText="Không"
                  okButtonProps={{ 
                    className: "bg-red-500 hover:bg-red-600 border-red-500" 
                  }}
                >
                  <button
                    type="button"
                    className="ml-4 w bg-red-500 hover:bg-red-600 rounded-lg px-3 py-1 border-red-500"

                  >
                    Xóa
                  </button>
                </Popconfirm>
              )}
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default GrowthUpdate;