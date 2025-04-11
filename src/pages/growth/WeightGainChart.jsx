import React, { useState, useEffect } from "react";
import { Spin, message, Card, Radio, Typography } from "antd";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
  ComposedChart
} from "recharts";
import api from "../../config/axios";
import backgroundImage from "../../assets/background.jpg";
import useMembershipAccess from "../../hooks/useMembershipAccess";
import MembershipRequired from "../membership/MembershipRequired";
import { Link } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";

const { Title, Text } = Typography;

const WeightGainChart = () => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [rangeData, setRangeData] = useState({});
  const [chartType, setChartType] = useState("line");
  const [profiles, setProfiles] = useState([]);
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const { isLoading, hasAccess } = useMembershipAccess();

  useEffect(() => {
    // Fetch pregnancy profiles when component mounts
    fetchPregnancyProfiles();
  }, []);

  useEffect(() => {
    // When a profile is selected, fetch the chart data
    if (selectedProfileId) {
      fetchChartData(selectedProfileId);
      fetchWeightRangeData(selectedProfileId);
    }
  }, [selectedProfileId]);

  // Fetch pregnancy profiles
  const fetchPregnancyProfiles = async () => {
    try {
      const response = await api.get('/pregnancy-profile');
      
      const profiles = response.data;
      setProfiles(profiles);
      
      // Set the first profile as default if profiles exist
      if (profiles.length > 0) {
        setSelectedProfileId(profiles[0].id);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching pregnancy profiles:", error);
      message.error("Không thể tải thông tin thai kỳ");
      setLoading(false);
    }
  };

  // Fetch chart data from API
  const fetchChartData = async (profileId) => {
    if (!profileId) {
      console.error("Invalid profileId:", profileId);
      return;
    }
    
    setLoading(true);
    try {
      // Đảm bảo profileId được truyền dưới dạng số
      const numericProfileId = Number(profileId);
      console.log("Sending chart profileId:", numericProfileId, typeof numericProfileId);
      
      const response = await api.get(`/growth-records/weight-gain-chart?profileId=${numericProfileId}`);
      
      // Process data for chart
      if (response.data) {
        const processedData = processChartData(response.data);
        setChartData(processedData);
      } else {
        setChartData([]);
        console.warn("No chart data received from API");
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
      message.error("Không thể tải dữ liệu biểu đồ tăng cân");
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch weight range data from API
  const fetchWeightRangeData = async (profileId) => {
    if (!profileId) {
      console.error("Invalid profileId:", profileId);
      return;
    }
    
    try {
      // Đảm bảo profileId được truyền dưới dạng số
      const numericProfileId = Number(profileId);
      console.log("Sending range profileId:", numericProfileId, typeof numericProfileId);
      
      const response = await api.get(`/growth-records/weight-gain-range?profileId=${numericProfileId}`);
      
      setRangeData(response.data);
    } catch (error) {
      console.error("Error fetching weight range data:", error);
      message.error("Không thể tải dữ liệu phạm vi tăng cân");
    }
  };

  // Process API response into chart data format
  const processChartData = (apiData) => {
    if (!apiData || !apiData.actualWeights || !apiData.standardWeights) {
      console.warn("Invalid data format received from API", apiData);
      return [];
    }
    
    const { actualWeights, standardWeights } = apiData;
    
    const chartData = [];
    for (let week = 1; week <= 40; week++) {
      const actualWeight = actualWeights[week-1] || null;
      const standardWeight = standardWeights[week-1] || null;

      // Only include weeks with actual data or up to current week + 10
      if ((actualWeight && actualWeight > 0) || (rangeData[week] && Object.keys(rangeData).length > 0)) {
        const minWeight = rangeData[week]?.min || null;
        const maxWeight = rangeData[week]?.max || null;
        
        chartData.push({
          week,
          actualWeight: actualWeight > 0 ? actualWeight : null,
          standardWeight,
          minWeight: minWeight && standardWeight ? standardWeight - minWeight : null,
          maxWeight: maxWeight && standardWeight ? standardWeight + maxWeight : null,
        });
      }
    }
    
    return chartData;
  };

  // Handle change of chart type
  const handleChartTypeChange = (e) => {
    setChartType(e.target.value);
  };

  // Handle profile selection change
  const handleProfileChange = (e) => {
    setSelectedProfileId(e.target.value);
  };

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const actualWeight = payload.find(entry => entry.dataKey === 'actualWeight')?.value;
      const standardWeight = payload.find(entry => entry.dataKey === 'standardWeight')?.value;
      const minWeight = payload.find(entry => entry.dataKey === 'minWeight')?.value;
      const maxWeight = payload.find(entry => entry.dataKey === 'maxWeight')?.value;

      let warningMessage = null;
      if (actualWeight && standardWeight) {
        const weightDiff = actualWeight - standardWeight;
        const weightDiffPercent = (weightDiff / standardWeight) * 100;
        
        if (weightDiffPercent < -10) {
          warningMessage = "⚠️ Cân nặng thấp hơn tiêu chuẩn. Cần tăng cường dinh dưỡng.";
        } else if (weightDiffPercent > 10) {
          warningMessage = "⚠️ Cân nặng cao hơn tiêu chuẩn. Cần kiểm soát chế độ ăn uống.";
        }
      }

      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-md">
          <p className="font-semibold">{`Tuần thai: ${label}`}</p>
          {payload.map((entry, index) => {
            // Don't show null values
            if (entry.value === null) return null;
            
            let label = '';
            let color = entry.color;
            
            switch(entry.dataKey) {
              case 'actualWeight':
                label = 'Cân nặng hiện tại';
                break;
              case 'standardWeight':
                label = 'Cân nặng tiêu chuẩn';
                break;
              case 'minWeight':
                label = 'Cân nặng tối thiểu';
                break;
              case 'maxWeight':
                label = 'Cân nặng tối đa';
                break;
              default:
                label = entry.dataKey;
            }
            
            return (
              <p key={index} style={{ color: color }}>
                {`${label}: ${entry.value.toFixed(1)} kg`}
              </p>
            );
          })}
          {warningMessage && (
            <p className="mt-2 text-red-500 font-medium">{warningMessage}</p>
          )}
        </div>
      );
    }
    return null;
  };

  // Render different chart types
  const renderChart = () => {
    if (!chartData || chartData.length === 0) {
      return (
        <div className="text-center py-10">
          <Text>Không có dữ liệu để hiển thị. Vui lòng cập nhật thông tin tăng cân trước.</Text>
        </div>
      );
    }

    // Filter out data points with null or undefined values to prevent chart errors
    const validChartData = chartData.filter(data => {
      return data.week && 
        (data.actualWeight !== null || data.standardWeight !== null || 
         data.minWeight !== null || data.maxWeight !== null);
    });

    if (validChartData.length === 0) {
      return (
        <div className="text-center py-10">
          <Text>Không có dữ liệu hợp lệ để hiển thị. Vui lòng cập nhật thông tin tăng cân.</Text>
        </div>
      );
    }

    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={validChartData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="week" 
                label={{ value: 'Tuần thai', position: 'insideBottom', offset: -5 }} 
              />
              <YAxis 
                label={{ value: 'Cân nặng (kg)', angle: -90, position: 'insideLeft' }} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} />
              <Line 
                type="monotone" 
                dataKey="actualWeight" 
                stroke="#ff85a2" 
                name="Cân nặng thực tế" 
                strokeWidth={2} 
                dot={{ r: 3 }} 
                activeDot={{ r: 5 }} 
                connectNulls={true}
              />
              <Line 
                type="monotone" 
                dataKey="standardWeight" 
                stroke="#8884d8" 
                name="Cân nặng tiêu chuẩn" 
                strokeWidth={2} 
                strokeDasharray="5 5" 
                connectNulls={true}
              />
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={validChartData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="week" 
                label={{ value: 'Tuần thai', position: 'insideBottom', offset: -5 }} 
              />
              <YAxis 
                label={{ value: 'Cân nặng (kg)', angle: -90, position: 'insideLeft' }} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} />
              <Area 
                type="monotone" 
                dataKey="maxWeight" 
                fill="#d1e9fc" 
                stroke="#4dabf7" 
                name="Giới hạn trên" 
                fillOpacity={0.3}
                connectNulls={true}
              />
              <Area 
                type="monotone" 
                dataKey="minWeight" 
                fill="#d1e9fc" 
                stroke="#4dabf7" 
                name="Giới hạn dưới" 
                fillOpacity={0.3}
                connectNulls={true}
              />
              <Line 
                type="monotone" 
                dataKey="standardWeight" 
                stroke="#8884d8" 
                name="Cân nặng tiêu chuẩn" 
                strokeWidth={2} 
                strokeDasharray="5 5" 
                connectNulls={true}
              />
              <Line 
                type="monotone" 
                dataKey="actualWeight" 
                stroke="#ff85a2" 
                name="Cân nặng thực tế" 
                strokeWidth={2} 
                dot={{ r: 3 }} 
                activeDot={{ r: 5 }} 
                connectNulls={true}
              />
            </ComposedChart>
          </ResponsiveContainer>
        );
        
      default:
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={validChartData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="actualWeight" stroke="#ff85a2" name="Cân nặng thực tế" connectNulls={true} />
              <Line type="monotone" dataKey="standardWeight" stroke="#8884d8" name="Cân nặng tiêu chuẩn" connectNulls={true} />
            </LineChart>
          </ResponsiveContainer>
        );
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
      <div className="max-w-6xl mx-auto">
        {/* Back navigation */}
        <div className="mb-4 flex justify-between items-center">
          <Link
            to="/growth-records/profile"
            className="flex items-center gap-2 text-pink-600 hover:text-pink-800 transition-colors"
          >
            <FaArrowLeftLong className="text-lg" />
            <span>Quay lại danh sách tăng trưởng</span>
          </Link>
        </div>

        <Card className="mb-6 shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <Title level={2} className="text-pink-600 mb-0">Biểu Đồ Tăng Cân Thai Kỳ</Title>
          </div>

          {/* Profile selection */}
          {profiles.length > 0 && (
            <div className="mb-6">
              <Card className="bg-blue-50/70">
                <div className="flex flex-wrap items-center gap-4">
                  <Text strong>Chọn thai kỳ:</Text>
                  <Radio.Group onChange={handleProfileChange} value={selectedProfileId}>
                    {profiles.map(profile => (
                      <Radio key={profile.id} value={profile.id}>
                        {profile.babyName} ({profile.babyGender === 'FEMALE' ? 'Bé gái' : 'Bé trai'})
                        - Tuần {profile.currentWeek}
                      </Radio>
                    ))}
                  </Radio.Group>
                </div>
              </Card>
            </div>
          )}

          {/* Chart type selection */}
          <div className="mb-6">
            <Card className="bg-pink-50/70">
              <div className="flex flex-wrap items-center gap-4">
                <Text strong>Kiểu biểu đồ:</Text>
                <Radio.Group onChange={handleChartTypeChange} value={chartType}>
                  <Radio value="line">Đường</Radio>
                  <Radio value="area">Khu vực</Radio>
                </Radio.Group>
              </div>
            </Card>
          </div>

          {/* Chart display */}
          <Card className="mt-4">
            {loading ? (
              <div className="flex justify-center items-center p-10">
                <Spin size="large" tip="Đang tải dữ liệu..." />
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <Text className="text-gray-600">
                    Biểu đồ này hiển thị sự thay đổi cân nặng theo từng tuần thai kỳ. Đường màu hồng thể hiện 
                    cân nặng thực tế của bạn, trong khi đường màu tím thể hiện cân nặng tiêu chuẩn theo khuyến nghị.
                    Vùng màu xanh nhạt thể hiện phạm vi cân nặng khuyến nghị.
                  </Text>
                </div>
                {renderChart()}
                <div className="mt-4">
                  <Text className="text-gray-500 italic">
                    * Dữ liệu được dựa trên các khuyến nghị của tổ chức y tế và lịch sử theo dõi cân nặng của bạn.
                  </Text>
                </div>
              </>
            )}
          </Card>

          {/* Interpretation guide */}
          <Card className="mt-6 bg-green-50/70">
            <Title level={4} className="text-green-700 mb-4">Hướng dẫn đọc biểu đồ</Title>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <Text strong>Đường màu hồng:</Text> Thể hiện cân nặng thực tế của bạn qua từng tuần thai kỳ.
              </li>
              <li>
                <Text strong>Đường màu tím:</Text> Thể hiện cân nặng tiêu chuẩn khuyến nghị dựa trên cân nặng ban đầu của bạn.
              </li>
              <li>
                <Text strong>Vùng màu xanh nhạt:</Text> Thể hiện phạm vi cân nặng an toàn (chỉ hiển thị trong chế độ biểu đồ khu vực).
              </li>
            </ul>
            <div className="mt-4">
              <Text className="text-red-600">
                Lưu ý: Nếu đường cân nặng thực tế của bạn nằm ngoài vùng khuyến nghị trong nhiều tuần liên tiếp, 
                hãy tham khảo ý kiến bác sĩ để được tư vấn thêm.
              </Text>
            </div>
          </Card>
        </Card>
      </div>
    </div>
  );
};

export default WeightGainChart; 