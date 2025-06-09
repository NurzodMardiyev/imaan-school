import { Form, Input, message } from "antd";
import "../App.css";
import ill from "../assets/Learning-bro.png";
import logo from "../assets/Imaan logo.svg"; // logotip
import { useNavigate } from "react-router-dom";
import { useUser } from "./Context";
import MaskedInput from "react-text-mask";

export default function Kirish() {
  const [messageApi, contextHolder] = message.useMessage();

  const success = () => {
    messageApi.open({
      type: "success",
      content: "This is a success message",
    });
  };

  type HandleValue = {
    name: string;
    phone: string;
  };

  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleLogin = (value: HandleValue) => {
    const maskPhone = "+" + value.phone.replace(/\D/g, "");
    setUser({ ...value, phone: maskPhone });
    success();
    navigate("/quiz");
  };

  const phoneMask = [
    "+",
    "9",
    "9",
    "8",
    " ",
    "(",
    /[1-9]/,
    /\d/,
    ")",
    " ",
    /\d/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
  ];

  return (
    <div className="main-back min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="container flex flex-col md:flex-row items-center justify-center max-w-6xl gap-10 py-10">
        {/* Chap rasm */}
        <div className="hidden md:flex w-full md:w-1/2 justify-center">
          <img src={ill} alt="learning" className="max-w-sm w-full" />
        </div>

        {contextHolder}

        {/* O'ng forma */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          {/* Logo + Title */}
          <div className="flex flex-col items-center mb-6">
            <img
              src={logo}
              alt="Imaan School logo"
              className="w-16 h-16 md:w-26 md:h-26"
            />
            <h1 className="text-2xl md:text-3xl font-bold text-white mt-0 tracking-wider">
              Imaan School
            </h1>
          </div>

          {/* Form */}
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
              <MaskedInput
                mask={phoneMask}
                placeholder="+998 (__) ___-__-__"
                className="bg-white text-black ant-inputme  ant-input-outlinedme "
              />
            </Form.Item>

            <Form.Item>
              <button
                type="submit"
                className="bg-[#00E1FF] w-full text-black font-semibold py-2 px-6 rounded hover:opacity-90 transition-all"
              >
                Kirish
              </button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
