import React, { useState } from "react";
import {
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Button,
  message,
  Spin,
} from "antd";
import pregnancyProfileApi from "../services/api.pregnancyProfile";
import moment from "moment";
import backgroundImage from "../../assets/background.jpg";
import useMembershipAccess from "../../hooks/useMembershipAccess";
import MembershipRequired from "../../pages/membership/MembershipRequired";
const { Option } = Select;

const LoadingScreen = ({ tip = "Đang tải..." }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spin size="large" tip={tip} />
    </div>
  );
};

const AddPregnancyProfile = () => {
  const { isLoading, hasAccess, membershipStatus } = useMembershipAccess();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

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

  // Handle submit
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

      const profileData = await pregnancyProfileApi.createProfile(
        formattedValues
      );
      message.success("Thêm thông tin thai kỳ thành công");

      // Lưu profileId vào localStorage sau khi tạo mới
      if (profileData && profileData.id) {
        localStorage.setItem("profileId", profileData.id);
        localStorage.setItem(
          "currentPregnancyWeek",
          formattedValues.currentWeek
        );
      }

      // Reset form và reload trang
      form.resetFields();
      window.location.reload();
    } catch (error) {
      message.error(
        "Có lỗi xảy ra: " +
          (error.response?.data?.message || "Vui lòng kiểm tra lại thông tin")
      );
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!hasAccess) {
    return <MembershipRequired membershipStatus={membershipStatus} />;
  }

  return (
    <div
      className="min-h-screen bg-cover p-6"
    >
      <div className="max-w-3xl mx-auto">
        <div className=" rounded-lg">
          <h1 className="text-2xl font-semibold text-pink-400 mb-6 text-center">
            Thêm Hồ Sơ Thai Kỳ
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
              <button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="bg-pink-400 hover:bg-pink-400 border-pink-400 text-white px-3 py-1 rounded-lg"
              >
                Thêm mới
              </button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AddPregnancyProfile;