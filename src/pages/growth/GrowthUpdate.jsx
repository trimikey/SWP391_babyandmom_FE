import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Popconfirm, Modal, Tag, Tooltip, notification } from "antd";
import backgroundImage from "../../assets/background.jpg";
import api from "../../config/axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import useMembershipAccess from "../../hooks/useMembershipAccess";
import MembershipRequired from "../../pages/membership/MembershipRequired";
import { Spin } from "antd";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { FaChartLine } from "react-icons/fa";
import { FaExclamationTriangle, FaInfoCircle, FaExclamationCircle } from "react-icons/fa";
import PregnancyProfileManager from "../profiles/PregnancyProfile";
import TextArea from "antd/es/input/TextArea";

// Danh sách gợi ý ghi chú
const noteTemplates = [
  {
    id: 1,
    text: "Cảm thấy đau bụng dưới khi vận động",
    severity: "medium",
    warning: "Đau bụng dưới khi vận động có thể là dấu hiệu của giãn dây chằng hoặc biến chứng khác. Nếu đau kéo dài, hãy tham khảo ý kiến bác sĩ.",
  },
  {
    id: 2,
    text: "Tăng cân đột ngột trong tuần qua",
    severity: "medium",
    warning: "Tăng cân đột ngột có thể là dấu hiệu của tích nước, tiền sản giật. Cần theo dõi huyết áp và thông báo với bác sĩ trong lần khám tiếp theo.",
  },
  {
    id: 3,
    text: "Sưng phù nhiều ở chân và mắt cá",
    severity: "high",
    warning: "Phù nề ở chân, mắt cá chân và kết hợp với tăng cân nhanh có thể là dấu hiệu cảnh báo tiền sản giật. Cần đi khám ngay.",
  },
  {
    id: 4,
    text: "Giảm cân trong tuần này",
    severity: "high",
    warning: "Giảm cân trong thai kỳ có thể ảnh hưởng đến sự phát triển của thai nhi. Hãy liên hệ với bác sĩ ngay lập tức.",
  },
  {
    id: 5,
    text: "Cảm thấy mệt mỏi bất thường",
    severity: "medium",
    warning: "Mệt mỏi quá mức có thể là dấu hiệu của thiếu máu hoặc thiếu hụt dinh dưỡng. Nên kiểm tra chế độ ăn uống và bổ sung sắt nếu cần.",
  },
  {
    id: 6,
    text: "Tăng cân bình thường theo tuần thai",
    severity: "low",
    warning: "Tiếp tục duy trì chế độ ăn uống cân đối và lành mạnh để đảm bảo sự phát triển tốt của thai nhi.",
  },
  {
    id: 7,
    text: "Đường huyết cao hơn bình thường",
    severity: "medium",
    warning: "Đường huyết cao có thể là dấu hiệu của đái tháo đường thai kỳ. Cần theo dõi chế độ ăn và báo cáo với bác sĩ trong lần khám tiếp theo.",
  },
  {
    id: 8,
    text: "Huyết áp tăng cao hơn lần đo trước",
    severity: "high",
    warning: "Huyết áp cao là dấu hiệu nguy hiểm trong thai kỳ, có thể dẫn đến tiền sản giật. Hãy đến cơ sở y tế ngay để được kiểm tra.",
  }
];

const GrowthUpdate = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const profileId = localStorage.getItem("profileId");
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [weightWarning, setWeightWarning] = useState("");
  const [preBMI, setPreBMI] = useState(null);
  const [currentBMI, setCurrentBMI] = useState(null);
  const [alertStatus, setAlertStatus] = useState(null);
  const [minPregnancyWeek, setMinPregnancyWeek] = useState(1);
  const [profileExists, setProfileExists] = useState(true);
  const { isLoading, hasAccess } = useMembershipAccess();
  const [selectedRecordId, setSelectedRecordId] = useState(null);

  const [isSelect, setSelect] = useState(0);
  const [isSelectProfile, setSelectProfile] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showNoteWarning, setShowNoteWarning] = useState(false);

  useEffect(() => {
    // console.log('Current profileId:', profileId);
    if (profileId) {
      // console.log('Fetching growth records for profileId:', profileId);
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

  const [listPreg, setListPreg] = useState([]);
  const token = localStorage.getItem("token");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [isModalOpen2, setIsModalOpen2] = useState(false);

  const showModal2 = () => {
    setIsEditing(false); // ✅ Reset trạng thái về tạo mới

    setFormData((prevData) => ({
      ...prevData,
      profileId: localStorage.getItem("profileId") || "",
      pregnancyWeek: minPregnancyWeek ? (minPregnancyWeek + 1).toString() : "",
      pregnancyWeight: "",
      pregnancyHeight: "",
      prePregnancyWeight: "",
      prePregnancyHeight: "",
      notes: "",
    }));

    setIsModalOpen2(true);
  };


  const handleOk2 = () => {
    setIsModalOpen2(false);
  };

  const handleCancel2 = () => {
    setIsModalOpen2(false);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,  // Cập nhật giá trị vào formData
    }));
    console.log("Updated formData:", { ...formData, [name]: value });
  };
  const handleGetListPregnantcy = async () => {
    try {
      const response = await api.get("/pregnancy-profile");

      setListPreg(response.data);
      console.log(response.data);
    } catch (err) {
      console.error("Error fetching pregnancy profile:", err.response || err);
    }
  };

  const [formData, setFormData] = useState({
    profileId: "",
    pregnancyWeek: "",
    pregnancyWeight: "",
    pregnancyHeight: "",
    prePregnancyWeight: "",
    prePregnancyHeight: "",
    notes: "",
  });

  const handleGetListPregProfile = async (id) => {
    setFormData((prevData) => ({
      ...prevData, // Giữ nguyên tất cả các trường còn lại
      profileId: id, // Thay đổi giá trị profileId
    }));

    try {
      const response = await api.get(`/growth-records/current`, {
        params: { profileId: id }, // Chuyển vào params
      });

      setSelectProfile(response?.data);
      console.log(response?.data, "toibingu");
    } catch (err) {
      console.error("Error fetching pregnancy profile:", err.response || err);
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate dữ liệu
      if (!formData.pregnancyWeek) {
        message.error("Vui lòng nhập tuần thai!");
        return;
      }
  
      if (!formData.pregnancyWeight || !formData.prePregnancyWeight || !formData.prePregnancyHeight) {
        message.error("Vui lòng nhập đầy đủ thông tin cân nặng và chiều cao!");
        return;
      }
  
      const requestData = {
        ...formData,
        pregnancyWeek: Number(formData.pregnancyWeek),
        pregnancyWeight: Number(formData.pregnancyWeight),
        pregnancyHeight: Number(formData.pregnancyHeight),
        prePregnancyWeight: Number(formData.prePregnancyWeight),
        prePregnancyHeight: Number(formData.prePregnancyHeight),
      };
  
      // Kiểm tra nếu là tạo mới hoặc cập nhật
      if (isEditing) {
        const response = await api.put(`/growth-records/${selectedRecordId}`, requestData);
        message.success("Cập nhật thành công!");
        // Cập nhật dữ liệu mới sau khi cập nhật
        handleGetListPregProfile(profileId);
        await fetchGrowthRecordById(selectedRecordId);
      } else {
        const response = await api.post("/growth-records", requestData);
        message.success("Tạo mới thành công!");
        // Cập nhật lại danh sách bản ghi
        setListPreg(prevList => [...prevList, response.data]); // Thêm bản ghi mới vào listPreg
        setSelect(1); // Chuyển sang màn hình xem danh sách
      }
    } catch (error) {
      message.error("Đã có lỗi xảy ra khi thêm dữ liệu!");
      console.error("Đã có lỗi xảy ra khi thêm dữ liệu:", error);
    }
  };
  


  const selectOnList = (id) => {
    setSelect((prev) => prev + 1);
    handleGetListPregProfile(id);
  };

  useEffect(() => {
    handleGetListPregnantcy();
  }, []);

  // const fetchGrowthRecords = async (data) => {
  //   populateFormWithRecord(data.id);
  //   setSelect((prev) => prev + 1);
  //   setIsEditing(true);
  //   console.log("asdasdasdsadsadsadasdsad", data);
  // };
  const fetchGrowthRecords = async (record) => {
    if (!record || !record.id) {
      message.error("Dữ liệu không hợp lệ");
      return;
    }

    setSelectedRecordId(record.id); // Ghi lại id đang sửa
    populateFormWithRecord(record); // Truyền đúng object
    setSelect((prev) => prev + 1);
    setIsEditing(true);
  };


  const fetchGrowthRecordById = async (recordId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await api.get(`/growth-records/${recordId}`, {});
      const recordToEdit = response.data;
      if (recordToEdit) {
        console.log("Found record to edit:", recordToEdit);
        populateFormWithRecord(recordToEdit);
      } else {
        message.error("Không tìm thấy thông tin theo dõi thai kỳ");
      }
    } catch (error) {
      console.error("Error fetching growth record by id:", error);
      message.error("Có lỗi xảy ra khi tải thông tin theo dõi thai kỳ");
    }
  };

  const populateFormWithRecord = (record) => {
    form.setFieldsValue({
      pregnancyWeek: record.pregnancyWeek,
      pregnancyWeight: record.pregnancyWeight,
      pregnancyHeight: record.pregnancyHeight,
      prePregnancyWeight: record.prePregnancyWeight,
      prePregnancyHeight: record.prePregnancyHeight,
      notes: record.notes,  // Cập nhật ghi chú trong form khi chỉnh sửa
    });

    // Lưu thông tin BMI và cảnh báo
    setPreBMI(record.prePregnancyBMI);
    setCurrentBMI(record.currentBMI);
    setWeightWarning(record.weightWarning);
    setAlertStatus(record.alertStatus);
  };


  const onFinish = async (values) => {
    try {
      // Kiểm tra các giá trị khác trước khi submit
      if (!values.pregnancyWeight || !values.prePregnancyWeight || !values.prePregnancyHeight) {
        message.error("Vui lòng nhập đầy đủ thông tin cân nặng và chiều cao!");
        return;
      }

      // Nếu là cập nhật, bỏ qua kiểm tra tuần thai trùng
      if (isEditing && selectedRecordId) {
        const updatedData = { ...values };
        updatedData.pregnancyWeek = Number(values.pregnancyWeek); // Chuyển tuần thai thành số để lưu trữ đúng cách
        const response = await api.put(`/growth-records/${selectedRecordId}`, updatedData);
        message.success("Cập nhật thành công!");

        // Cập nhật danh sách sau khi cập nhật thành công
        handleGetListPregProfile(profileId);
        await fetchGrowthRecordById(selectedRecordId);

        // Kiểm tra các ghi chú và hiển thị cảnh báo nếu cần
        checkNotesForWarnings(values.notes);
        setSelect(1);
      } else {
        const requestData = {
          pregnancyWeek: Number(values.pregnancyWeek),
          pregnancyWeight: Number(values.pregnancyWeight),
          pregnancyHeight: Number(values.pregnancyHeight),
          prePregnancyWeight: Number(values.prePregnancyWeight),
          prePregnancyHeight: Number(values.prePregnancyHeight),
          notes: values.notes || "",
          profileId: profileId,
        };

        const response = await api.post("/growth-records", requestData);
        message.success("Tạo mới thành công!");

        // Cập nhật lại danh sách sau khi thêm bản ghi mới
        setListPreg(prevList => [...prevList, response.data]);
        setSelect(1); // Chuyển sang màn hình xem danh sách
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Có lỗi xảy ra");
    }
  };



  // Hàm để hiển thị đúng ngôn ngữ Tiếng Việt cho cảnh báo
  const translateWarning = (warning) => {
    if (
      warning.includes("too little") ||
      warning.includes("Gaining too little")
    ) {
      return "Tăng cân quá ít có thể ảnh hưởng đến sự phát triển của thai nhi";
    } else if (
      warning.includes("too much") ||
      warning.includes("Gain too much")
    ) {
      return "Tăng cân quá nhiều, cần kiểm soát chế độ ăn uống";
    } else if (warning.includes("Normal")) {
      return "Mức tăng cân bình thường";
    }
    return warning;
  };

  // Hàm để quyết định màu sắc dựa trên alert status
  const getAlertStatusColor = (status) => {
    switch (status) {
      case "THẤPTHẤP":
        return "bg-yellow-50 border-yellow-200 text-yellow-700";
      case "BÌNH THƯỜNG":
        return "bg-green-50 border-green-200 text-green-700";
      case "CAO":
        return "bg-red-50 border-red-200 text-red-700";
      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  const getAlertStatusIcon = (status) => {
    switch (status) {
      case "THẤPTHẤP":
        return "⚠️";
      case "BÌNH THƯỜNG":
        return "✅";
      case "HIGH":
        return "⛔";
      default:
        return "ℹ️";
    }
  };

  const getBMICategory = (bmi) => {
    if (!bmi) return "N/A";
    if (bmi < 18.5) return "Thiếu cân";
    if (bmi < 25) return "Bình thường";
    if (bmi < 30) return "Thừa cân";
    return "Béo phì";
  };

  // Màu sắc cho từng phân loại BMI
  const getBMIColorClass = (bmi) => {
    if (!bmi) return "text-gray-500";
    if (bmi < 18.5) return "text-blue-600";
    if (bmi < 25) return "text-green-600";
    if (bmi < 30) return "text-yellow-600";
    return "text-red-600";
  };

  // Thêm hàm mới để lấy thông tin profile thai kỳ
  const fetchPregnancyProfile = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await api.get(`/pregnancy-profile`);

      if (
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        console.log("Pregnancy profiles:", response.data);

        let selectedProfile;
        if (profileId) {
          selectedProfile = response.data.find(
            (profile) => profile.id == profileId
          );
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
        console.warn("No pregnancy profiles found");
        setProfileExists(false);
      }
    } catch (error) {
      console.error("Error fetching pregnancy profiles:", error);
      message.error("Không thể tải thông tin thai kỳ");
      setProfileExists(false);
    }
  };

  useEffect(() => {
    if (!profileExists) {
      message.info(
        "Không tìm thấy thông tin thai kỳ. Vui lòng tạo thông tin thai kỳ trước."
      );
      // Redirect to pregnancy profile page after a short delay
      const timer = setTimeout(() => {
        navigate("/pregnancy-profile");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [profileExists, navigate]);

  // Thêm hàm xử lý xóa bản ghi tăng trưởng
  const handleDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/growth-records/${id}`);
      message.success("Xóa bản ghi tăng trưởng thành công");

      // Sau khi xóa, chuyển hướng về trang chính
      navigate("/profile/pregnancy-profile");
    } catch (error) {
      console.error("Error deleting growth record:", error);
      message.error("Không thể xóa bản ghi tăng trưởng");
    } finally {
      setLoading(false);
    }
  };

  // Custom validator cho cân nặng
  const validateWeight = (rule, value) => {
    if (value && (isNaN(value) || value <= 0)) {
      return Promise.reject("Cân nặng phải là số dương");
    }
    if (value && value > 300) {
      return Promise.reject("Cân nặng không được vượt quá 300kg");
    }
    return Promise.resolve();
  };

  // Check for direct navigation to growth records
  useEffect(() => {
    const showRecords = localStorage.getItem("showGrowthRecords");
    if (showRecords === "true" && profileId) {
      // Set to screen 1 (records list) directly
      setSelect(1);
      // Load the growth records for this profile
      handleGetListPregProfile(profileId);
      // Remove the flag so it doesn't persist on refresh
      localStorage.removeItem("showGrowthRecords");
    }
  }, [profileId]);

  const handleSelectNote = (template) => {
    const currentNotes = form.getFieldValue("notes") || "";  // lấy giá trị ghi chú hiện tại từ form
    const newNotes = currentNotes ? `${currentNotes}\n${template.text}` : template.text;  // thêm ghi chú mới vào
  
    // Cập nhật lại giá trị cho trường 'notes' trong form
    form.setFieldsValue({ notes: newNotes });
  
    // Cập nhật lại formData (để đồng bộ nếu bạn cần sử dụng lại sau này)
    setFormData((prev) => ({
      ...prev,
      notes: newNotes,  // Lưu ghi chú vào formData
    }));
  };

  const getNoteSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return '#f5222d';
      case 'medium':
        return '#fa8c16';
      case 'low':
        return '#52c41a';
      default:
        return '#1890ff';
    }
  };

  const getNoteSeverityIcon = (severity) => {
    switch (severity) {
      case 'high':
        return <FaExclamationTriangle className="text-red-500" />;
      case 'medium':
        return <FaExclamationCircle className="text-orange-500" />;
      case 'low':
        return <FaInfoCircle className="text-green-500" />;
      default:
        return <FaInfoCircle className="text-blue-500" />;
    }
  };

  // Hàm mới để kiểm tra các ghi chú và hiển thị cảnh báo
  const checkNotesForWarnings = (notes) => {
    if (!notes) return;

    // Duyệt qua các mẫu ghi chú để tìm match
    const matchedTemplates = noteTemplates.filter(template =>
      notes.includes(template.text)
    );

    // Nếu có ghi chú cần cảnh báo, hiển thị thông báo
    if (matchedTemplates.length > 0) {
      // Ưu tiên hiển thị cảnh báo có mức độ nghiêm trọng cao nhất
      const highSeverityTemplates = matchedTemplates.filter(t => t.severity === 'high');
      const mediumSeverityTemplates = matchedTemplates.filter(t => t.severity === 'medium');

      let templateToShow;

      if (highSeverityTemplates.length > 0) {
        templateToShow = highSeverityTemplates[0];
      } else if (mediumSeverityTemplates.length > 0) {
        templateToShow = mediumSeverityTemplates[0];
      } else {
        templateToShow = matchedTemplates[0];
      }

      // Hiển thị notification với cảnh báo
      notification.open({
        message: templateToShow.severity === 'high'
          ? 'Cảnh báo quan trọng!'
          : templateToShow.severity === 'medium'
            ? 'Lưu ý'
            : 'Thông tin',
        description: templateToShow.warning,
        duration: 10, // Hiển thị trong 10 giây
        icon:
          templateToShow.severity === 'high'
            ? <FaExclamationTriangle style={{ color: '#f5222d' }} />
            : templateToShow.severity === 'medium'
              ? <FaExclamationCircle style={{ color: '#fa8c16' }} />
              : <FaInfoCircle style={{ color: '#52c41a' }} />,
        style: {
          borderLeft: `4px solid ${getNoteSeverityColor(templateToShow.severity)}`
        },

      });

      // Nếu có nhiều cảnh báo, hiển thị thông báo tổng hợp
      if (matchedTemplates.length > 1) {
        const highCount = highSeverityTemplates.length;
        const mediumCount = mediumSeverityTemplates.length;

        let warningMessage = '';

        if (highCount > 0) {
          warningMessage += `${highCount} cảnh báo nghiêm trọng`;
        }

        if (mediumCount > 0) {
          warningMessage += warningMessage ? ` và ${mediumCount} lưu ý cần chú ý` : `${mediumCount} lưu ý cần chú ý`;
        }

        if (warningMessage) {
          message.warning(`Bạn có ${warningMessage} trong ghi chú của bạn. Vui lòng xem xét kỹ.`);
        }
      }
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
  /////////////////////////////////////////////////////////////////
  const extractDate = (isoString) => {
    return isoString.split("T")[0]; // Lấy phần trước "T"
  };

  return (
    <div
      className="min-h-screen bg-cover p-6"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Background với overlay */}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-xl mx-auto bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-8">
          {/* Weight chart button - appears in all views */}
          <div className="absolute top-4 right-4">
            <Link
              to="/growth-records/weight-chart"
              className="flex items-center gap-2 bg-pink-100 hover:bg-pink-200 text-pink-700 px-3 py-2 rounded-md transition-all"
              onClick={(e) => {
                // Show loading message for better UX
                message.loading("Đang tải biểu đồ tăng trưởng...", 1);
              }}
            >
              <FaChartLine />
              <span className="text-sm">Xem biểu đồ</span>
            </Link>
          </div>

          {/* ============================= */}
          {isSelect === 0 ? (
            <div>
              <h2 className="text-3xl font-semibold text-pink-600 mb-8 text-center">
                Thông tin thai kỳ
              </h2>
              <p className="text-center text-gray-600 mb-4">
                Chọn một hồ sơ thai kỳ để xem thông tin tăng trưởng
              </p>
              <div className="flex flex-col gap-2">
                {listPreg.map((item, index) => (
                  <button
                    onClick={() => selectOnList(item.id)}
                    key={index}
                    className="border border-sky-200 bg-blue-50 hover:bg-blue-100 py-3 px-5 flex flex-row justify-between items-center transition-colors"
                    style={{ borderRadius: "12px" }}
                  >
                    <div className="flex flex-row justify-center gap-2 items-center">

                      <p> Tên bé:</p>
                      <p className="text-[18px] font-semibold truncate w-[160px] text-left text-blue-600">
                        {item?.babyName}
                      </p>

                    </div>


                    <div className="flex flex-row justify-center gap-2 items-center">
                      <p>Giới tính : </p>
                      <p className="font-semibold text-[16px]">
                        {item?.babyGender === "FEMALE" ? "Bé gái" : "Bé trai"}
                      </p>
                    </div>
                    {/* <div className="flex flex-row justify-center gap-2 items-center">
                      <p>Tuần hiện tại : </p>
                      <p className="font-semibold text-[16px]">
                        {item?.currentWeek}
                      </p>
                    </div> */}
                  </button>
                ))}
              </div>
              {listPreg?.length < 3 && (
                <button
                  onClick={() => showModal()}
                  className="mt-3 text-gray-500 border border-gray-200 bg-gray-50 py-3 px-5 flex flex-row justify-center items-center w-full hover:border-gray-400 hover:text-black"
                  style={{ borderRadius: "12px" }}
                >
                  <FaPlus />
                </button>
              )}
            </div>
          ) : isSelect === 1 ? (
            <div>
              <button
                onClick={() => {
                  setSelectedRecordId(null); // ✅ Reset khi quay lại
                  setSelect((prev) => prev - 1);
                }}
                className="flex flex-row items-center text-[16px] gap-2 hover:text-red-400 hover:cursor-pointer"
              >
                <FaArrowLeftLong />
                Trở lại
              </button>
              <h2 className="text-3xl font-semibold text-pink-600 mb-8 text-center">
                Thông tin thai kỳ
              </h2>
              <div className="flex flex-col gap-2">
                {isSelectProfile.map((item, index) => (
                  <button
                    onClick={() => fetchGrowthRecords(item)}
                    key={index}
                    className="border border-sky-200 bg-blue-50 py-3 px-3 pr-7 flex flex-row justify-between items-center"
                    style={{ borderRadius: "12px" }}
                  >
                    <p className="text-gray-500 text-[16px] truncate ">
                      {extractDate(item?.createdAt)}
                    </p>
                    <div className="flex flex-row justify-center gap-2 items-center">
                      <p>Mức độ cảnh báo : </p>
                      <p className="font-semibold text-[16px]">
                        {item?.alertStatus}
                      </p>
                    </div>
                    <div className="flex flex-row justify-center gap-2 items-center">
                      <p>Tuần hiện tại : </p>
                      <p className="font-semibold text-[16px]">
                        {item?.pregnancyWeek}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => showModal2()}
                className="mt-3 text-gray-500 border border-gray-200 bg-gray-50 py-3 px-5 flex flex-row justify-center items-center w-full hover:border-gray-400 hover:text-black"
                style={{ borderRadius: "12px" }}
              >
                <FaPlus />
              </button>
            </div>
          ) : (
            <div>
              <button
                onClick={() => setSelect((prev) => prev - 1)}
                className="flex flex-row items-center text-[16px] gap-2 hover:text-red-400 hover:cursor-pointer"
              >
                <FaArrowLeftLong />
                Trở lại
              </button>
              <h2 className="text-3xl font-semibold text-pink-600 mb-8 text-center">
                {isEditing
                  ? "Cập Nhật Thông Tin Thai Kỳ"
                  : "Cập nhật tăng trưởng"}
              </h2>

              {/* Hiển thị BMI và cảnh báo nếu có */}
              {isEditing && (
                <div className="mb-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="text-blue-700 font-medium mb-1">
                        BMI trước thai kỳ
                      </h3>
                      <p className="text-xl font-semibold">
                        {preBMI ? Math.round(preBMI) : "N/A"}
                      </p>
                      <p className={`text-sm ${getBMIColorClass(preBMI)}`}>
                        {getBMICategory(preBMI)}
                      </p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="text-blue-700 font-medium mb-1">
                        BMI hiện tại
                      </h3>
                      {/* chinh so BMI theo hang chuc */}
                      <p className="text-xl font-semibold">
                        {currentBMI ? Math.round(currentBMI) : "N/A"}
                      </p>
                      <p className={`text-sm ${getBMIColorClass(currentBMI)}`}>
                        {getBMICategory(currentBMI)}
                      </p>
                    </div>
                  </div>

                  {alertStatus && (
                    <div
                      className={`p-4 border rounded-lg ${getAlertStatusColor(
                        alertStatus
                      )}`}
                    >
                      <div className="flex items-start">
                        <span className="mr-2 text-xl">
                          {getAlertStatusIcon(alertStatus)}
                        </span>
                        <div>
                          <h3 className="font-medium">
                            Tình trạng:{" "}
                            {alertStatus === "NORMAL"
                              ? "Bình thường"
                              : alertStatus === "LOW"
                                ? "Thấp"
                                : "Cao"}
                          </h3>
                          <p>
                            {alertStatus === "NORMAL"
                              ? "Mức tăng cân bình thường"
                              : alertStatus === "LOW"
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
                      { required: true, message: "Vui lòng nhập tuần thai!" },
                      {
                        validator: (_, value) => {
                          if (isEditing && value === form.getFieldValue("pregnancyWeek")) {
                            return Promise.resolve(); // Nếu tuần thai không thay đổi thì không cần kiểm tra
                          }

                          const weekValue = parseInt(value);
                          const existingWeeks = isSelectProfile.map(
                            (record) => Number(record.pregnancyWeek)
                          );
                          if (existingWeeks.includes(weekValue)) {
                            return Promise.reject("Tuần thai này đã tồn tại, vui lòng chọn tuần khác.");
                          }
                          if (weekValue < 1 || weekValue > 42) {
                            return Promise.reject("Tuần thai phải từ 1 đến 42.");
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input
                      type="number"
                      min={1}
                      max={42}
                      className="rounded-md w-full"
                    />
                  </Form.Item>



                  <Form.Item
                    label="Cân Nặng Hiện Tại (kg)"
                    name="pregnancyWeight"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập cân nặng hiện tại!",
                      },
                      { validator: validateWeight },
                    ]}
                  >
                    <Input
                      type="number"
                      step="1"
                      min={0}
                      className="rounded-md w-full"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Chiều Cao Hiện Tại (cm)"
                    name="pregnancyHeight"
                  >
                    <Input
                      type="number"
                      step="1"
                      min={0}
                      className="rounded-md w-full"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Cân Nặng Trước Thai Kỳ (kg)"
                    name="prePregnancyWeight"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập cân nặng trước thai kỳ!",
                      },
                      { validator: validateWeight },
                    ]}
                  >
                    <Input
                      type="number"
                      step="1"
                      min={0}
                      className="rounded-md w-full"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Chiều Cao Trước Thai Kỳ (cm)"
                    name="prePregnancyHeight"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập chiều cao trước thai kỳ!",
                      },
                    ]}
                  >
                    <Input
                      type="number"
                      step="1"
                      min={0}
                      className="rounded-md w-full"
                    />
                  </Form.Item>

                  <Form.Item label="Ghi chú" name="notes">
                    <div className="space-y-4">
                      <Input.TextArea rows={4} className="rounded-md w-full" />

                      <div className="mt-2">
                        <div className="text-sm text-gray-600 mb-2">Gợi ý ghi chú:</div>
                        <div className="grid grid-cols-2 gap-2">
                          {noteTemplates.map(template => (
                            <button
                              key={template.id}
                              type="button"
                              onClick={() => handleSelectNote(template)}
                              className="border text-left px-3 py-2 rounded-md text-sm hover:bg-gray-50 flex items-center gap-2 transition-colors"
                              style={{ borderColor: getNoteSeverityColor(template.severity) }}
                            >
                              {getNoteSeverityIcon(template.severity)}
                              <span className="truncate">{template.text}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Xóa phần hiển thị cảnh báo ngay */}
                    </div>
                  </Form.Item>
                </div>

                <Form.Item className="text-center mt-8 flex justify-center gap-4">
                  <button
                    type="submit"
                    className="bg-pink-400 hover:bg-pink-400 border-pink-400 text-white px-3 py-1 rounded-lg"
                  >
                    {isEditing ? "Cập Nhật" : "Tạo Mới"}
                  </button>
                </Form.Item>
              </Form>
            </div>
          )}

          {/* ============================= */}
        </div>
      </div>

      {/* MODAL */}
      <Modal
        footer={[<></>]}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1000}
      >
        <PregnancyProfileManager />
      </Modal>

      {/* MODAL ADD REPORT */}
      <Modal
        footer={[<></>]}
        open={isModalOpen2}
        width={600}
        onOk={handleOk}
        onCancel={handleCancel2}
      >
        <div>
          <h2 className="text-3xl font-semibold text-pink-600 mb-8 text-center">
            Cập Nhật Thông Tin Tăng Trưởng
          </h2>

          <div className="space-y-4">
            <div className="flex flex-col space-y-4">
              <div className="mb-4">
                <label
                  htmlFor="pregnancyWeek"
                  className="block text-sm font-medium"
                >
                  Tuần Thai
                </label>
                <Input
                  type="number"
                  id="pregnancyWeek"
                  name="pregnancyWeek"
                  value={formData.pregnancyWeek}
                  className="rounded-md w-full"
                  min={1}
                  max={42}
                  onChange={handleInputChange}

                />

              </div>

              <div className="mb-4">
                <label
                  htmlFor="pregnancyWeight"
                  className="block text-sm font-medium"
                >
                  Cân Nặng Hiện Tại (kg)
                </label>
                <Input
                  type="number"
                  id="pregnancyWeight"
                  name="pregnancyWeight"
                  value={formData.pregnancyWeight}
                  className="rounded-md w-full"
                  step="1"
                  min={0}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="pregnancyHeight"
                  className="block text-sm font-medium"
                >
                  Chiều Cao Hiện Tại (cm)
                </label>
                <Input
                  type="number"
                  id="pregnancyHeight"
                  name="pregnancyHeight"
                  value={formData.pregnancyHeight}
                  className="rounded-md w-full"
                  step="1"
                  min={0}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="prePregnancyWeight"
                  className="block text-sm font-medium"
                >
                  Cân Nặng Trước Thai Kỳ (kg)
                </label>
                <Input
                  type="number"
                  id="prePregnancyWeight"
                  name="prePregnancyWeight"
                  value={formData.prePregnancyWeight}
                  className="rounded-md w-full"
                  step="1"
                  min={0}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="prePregnancyHeight"
                  className="block text-sm font-medium"
                >
                  Chiều Cao Trước Thai Kỳ (cm)
                </label>
                <Input
                  type="number"
                  id="prePregnancyHeight"
                  name="prePregnancyHeight"
                  value={formData.prePregnancyHeight}
                  className="rounded-md w-full"
                  step="1"
                  min={0}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="notes" className="block text-sm font-medium">
                  Ghi chú
                </label>
                <TextArea
                  id="notes"
                  name="notes"
                  rows={4}
                  value={formData.notes}
                  className="rounded-md w-full"
                  onChange={handleInputChange}
                />

                <div className="mt-2">
                  <div className="text-sm text-gray-600 mb-2">Gợi ý ghi chú:</div>
                  <div className="grid grid-cols-2 gap-2">
                    {noteTemplates.map(template => (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => {
                          // Cập nhật notes trong formData nhưng không hiển thị cảnh báo ngay
                          const currentNotes = formData.notes || '';
                          const newNotes = currentNotes ? `${currentNotes}\n${template.text}` : template.text;
                          setFormData({ ...formData, notes: newNotes });
                        }}
                        className="border text-left px-3 py-2 rounded-md text-sm hover:bg-gray-50 flex items-center gap-2 transition-colors"
                        style={{ borderColor: getNoteSeverityColor(template.severity) }}
                      >
                        {getNoteSeverityIcon(template.severity)}
                        <span className="truncate">{template.text}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Xóa phần hiển thị cảnh báo ngay */}
              </div>

              <div className="text-center mt-8 flex justify-center gap-4">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-pink-400 hover:bg-pink-400 border-pink-400 text-white px-3 py-1 rounded-lg"
                >
                  {isEditing ? "Cập Nhật" : "Tạo Mới"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default GrowthUpdate;