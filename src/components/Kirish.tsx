import { Form, Input } from "antd";
import { useState } from "react";
import "../App.css";
import ill from "../assets/Learning-bro.png";
import { Link } from "react-router-dom";

export default function Kirish() {
  type HandleValue = {
    name: string;
    phone: string;
  };

  const [formData, setFormData] = useState<HandleValue>({
    name: "",
    phone: "",
  });

  const handleLogin = (value: HandleValue) => {
    console.log("Formdan kelgan qiymatlar:", value);
    setFormData(value); // Statega yozamiz
  };

  return (
    <div className="main-back min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="container flex flex-col md:flex-row items-center justify-center max-w-6xl gap-10 py-10">
        {/* Rasm faqat md (>=768px) dan katta ekranlarda ko‘rinadi */}
        <div className="hidden md:flex login_img w-full md:w-1/2 justify-center">
          <img src={ill} alt="learning" className="max-w-sm w-full" />
        </div>

        {/* Forma har doim ko‘rinadi */}
        <div className="login_input w-full md:w-1/2 flex justify-center">
          <Form
            onFinish={handleLogin}
            layout="vertical"
            className="w-full max-w-md text-white"
          >
            <Form.Item
              label={<span className="text-white">Ism Familya</span>}
              name="name"
              rules={[
                { required: true, message: "Ism familyangizni kiriting!" },
              ]}
            >
              <Input
                placeholder="Ism familya"
                className="bg-white text-black"
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-white">Telefon raqami</span>}
              name="phone"
              rules={[
                { required: true, message: "Telefon raqamingizni kiriting!" },
              ]}
            >
              <Input
                placeholder="+998 90 123 45 67"
                className="bg-white text-black"
              />
            </Form.Item>

            <Form.Item>
              <Link to="/quiz">
                <button
                  type="submit"
                  className="bg-blue-600 w-full text-white py-2 px-6 rounded hover:bg-blue-700 transition-all"
                >
                  Kirish
                </button>
              </Link>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
