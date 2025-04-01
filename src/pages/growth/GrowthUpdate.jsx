
import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Popconfirm, Modal } from "antd";
import backgroundImage from "../../assets/background.jpg";
import api from "../../config/axios";
import { useParams, useNavigate } from "react-router-dom";
import useMembershipAccess from "../../hooks/useMembershipAccess";
import MembershipRequired from "../../pages/membership/MembershipRequired";
import { Spin } from "antd";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";

import axios from "axios";
import PregnancyProfile from "../profiles/PregnancyProfile";
import TextArea from "antd/es/input/TextArea";

const GrowthUpdate = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const profileId = localStorage.getItem("profileId");
  const navigate = useNavigate();
  const [growthRecords, setGrowthRecords] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [weightWarning, setWeightWarning] = useState("");
  const [preBMI, setPreBMI] = useState(null);
  const [currentBMI, setCurrentBMI] = useState(null);
  const [alertStatus, setAlertStatus] = useState(null);
  const [minPregnancyWeek, setMinPregnancyWeek] = useState(1);
  const [profileExists, setProfileExists] = useState(true);
  const { isLoading, hasAccess } = useMembershipAccess();

  const [isSelect, setSelect] = useState(0);
  const [isSelectProfile, setSelectProfile] = useState([]);
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
    setIsModalOpen2(true);
  };

  const handleOk2 = () => {
    setIsModalOpen2(false);
  };

  const handleCancel2 = () => {
    setIsModalOpen2(false);
  };

  const handleGetListPregnantcy = async () => {
    try {
      const response = await axios.get(
        "http://14.225.210.81:8080/api/pregnancy-profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
      const response = await axios.get(
        "http://14.225.210.81:8080/api/growth-records/current",
        {
          params: { profileId: id }, // Chuyển vào params
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSelectProfile(response?.data);
      console.log(response?.data, "toibingu");
    } catch (err) {
      console.error("Error fetching pregnancy profile:", err.response || err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://14.225.210.81:8080/api/growth-records",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Dữ liệu đã được thêm thành công:", response.data);
      message.success("Dữ liệu đã được thêm thành công!");

      window.location.reload(); // Tải lại trang
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

  const fetchGrowthRecords = async (data) => {
    populateFormWithRecord(data);
    setSelect((prev) => prev + 1);
    setIsEditing(true);
    console.log("asdasdasdsadsadsadasdsad", data);
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
      notes: record.notes,
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
        message.error(
          `Tuần thai không thể nhỏ hơn tuần hiện tại (${minPregnancyWeek})`
        );
        return;
      }

      setLoading(true);
      const requestData = {
        pregnancyWeek: Number(values.pregnancyWeek),
        pregnancyWeight: Number(values.pregnancyWeight),
        pregnancyHeight: Number(values.pregnancyHeight),
        prePregnancyWeight: Number(values.prePregnancyWeight),
        prePregnancyHeight: Number(values.prePregnancyHeight),
        notes: values.notes || "",
        profileId: Number(profileId),
      };

      console.log("Sending request with data:", requestData);
      console.log("isEditing:", isEditing);
      console.log("id:", id);
      if (isEditing && id) {
        await api.put(`/growth-records/${id}`, requestData);
        message.success("Cập nhật thành công!");
        // Refresh data to show updated BMI and warnings
        fetchGrowthRecordById(id);
      } else {
        const response = await api.post("/growth-records", requestData);
        message.success("Tạo mới thành công!");

        // Cập nhật state và chuyển hướng
        if (response.data && response.data.id) {
          setIsEditing(true);
          navigate(`/growth-records/profile/${response.data.id}`, {
            replace: true,
          });
          // Fetch lại dữ liệu
          fetchGrowthRecords();
        }
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Có lỗi xảy ra");
    } finally {
      setLoading(false);
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
      case "LOW":
        return "bg-yellow-50 border-yellow-200 text-yellow-700";
      case "NORMAL":
        return "bg-green-50 border-green-200 text-green-700";
      case "HIGH":
        return "bg-red-50 border-red-200 text-red-700";
      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  const getAlertStatusIcon = (status) => {
    switch (status) {
      case "LOW":
        return "⚠️";
      case "NORMAL":
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
          {/* ============================= */}
          {isSelect === 0 ? (
            <div>
              <h2 className="text-3xl font-semibold text-pink-600 mb-8 text-center">
                Thông tin thai kỳ
              </h2>
              <div className="flex flex-col gap-2">
                {listPreg.map((item, index) => (
                  <button
                    onClick={() => selectOnList(item.id)}
                    key={index}
                    className="border border-sky-200 bg-blue-50 py-3 px-5 flex flex-row justify-between items-center"
                    style={{ borderRadius: "12px" }}
                  >
                    <p className="text-[18px] font-semibold truncate w-[160px] text-left">
                      {item?.babyName}
                    </p>
                    <div className="flex flex-row justify-center gap-2 items-center">
                      <p>Giới tính : </p>
                      <p className="font-semibold text-[16px]">
                        {item?.babyGender === "FEMALE" ? "Bé gái" : "Bé trai"}
                      </p>
                    </div>
                    <div className="flex flex-row justify-center gap-2 items-center">
                      <p>Tuần hiện tại : </p>
                      <p className="font-semibold text-[16px]">
                        {item?.currentWeek}
                      </p>
                    </div>
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
                onClick={() => setSelect((prev) => prev - 1)}
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
                          const weekValue = parseInt(value);
                          if (
                            isNaN(weekValue) ||
                            weekValue <= minPregnancyWeek
                          ) {
                            return Promise.reject(
                              `Tuần thai phải lớn hơn tuần ${minPregnancyWeek} theo thông tin thai kỳ`
                            );
                          }
                          return Promise.resolve();
                        },
                      },
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
                          message.warning(
                            `Tuần thai phải lớn hơn tuần hiện tại (${minPregnancyWeek})`
                          );
                        }
                      }}
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
                    <Input.TextArea rows={4} className="rounded-md w-full" />
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
        <PregnancyProfile />
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
                  min={minPregnancyWeek + 1}
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