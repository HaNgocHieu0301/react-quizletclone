import {
  Button,
  Divider,
  Space,
  Form,
  DatePicker,
  Input,
  FormInstance,
} from "antd";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useLogin } from "react-facebook";

import google from "~/assets/images/google.png";
import facebook from "~/assets/images/facebook.png";

type Props = {
  setTab: Function;
  closeModal: Function;
};

function Register({ setTab, closeModal }: Props) {
  const { login, isLoading } = useLogin();
  const [registerForm] = Form.useForm();

  function onFinish(value: JSON) {
    console.log(value);
    closeModal(null, 3);
    registerForm.resetFields();
  }

  const loginGoogle = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        const res = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${codeResponse.access_token}`,
            },
          }
        );
        console.log(res.data);
        closeModal(res.data, 1);
      } catch (error) {
        console.log(error);
      }
    },
  });

  async function loginFacebook() {
    try {
      const response = (await login({ scope: "email", rerequest: false }))
        .authResponse.accessToken;
      const res = await axios.get(
        `https://graph.facebook.com/me?fields=id,name,email,first_name,last_name,gender,picture&access_token=${response}`
      );
      console.log(res);
      closeModal(res.data, 1);
    } catch (error: any) {
      console.log(error.message);
    }
  }

  function isValidateInfo(form: FormInstance) {
    for (const key in form.getFieldsValue()) {
      if (!form.getFieldsValue()[key]) {
        return false;
      }
    }
    return !form.getFieldsError().filter(({ errors }) => errors.length).length;
  }

  return (
    <Space direction="vertical" className="w-full" size="middle">
      <Button
        size="large"
        className="font-semibold flex justify-center items-center"
        block
        onClick={() => loginGoogle()}
        style={{ height: 52 }}
        icon={<img src={google} alt="" style={{ height: 20 }}></img>}
      >
        Login with Google
      </Button>

      <Button
        size="large"
        className="font-semibold flex justify-center items-center"
        block
        style={{ height: 52 }}
        onClick={loginFacebook}
        disabled={isLoading}
        icon={<img src={facebook} alt="" style={{ height: 20 }}></img>}
      >
        Login with Facebook
      </Button>

      <Divider>Or with Email</Divider>

      <Form
        layout="vertical"
        autoComplete="off"
        autoCapitalize="off"
        onFinish={onFinish}
        form={registerForm}
      >
        <Form.Item
          hasFeedback
          label="Date of birth"
          name="Dob"
          validateFirst
          className="font-semibold"
        >
          <DatePicker size="large" format="DD/MM/YYYY" />
        </Form.Item>

        <Form.Item
          hasFeedback
          label="Email"
          name="Email"
          validateFirst
          rules={[
            {
              required: true,
              type: "email",
              message: "The input is not valid E-mail!",
            },
          ]}
          className="font-semibold"
        >
          <Input placeholder="user@quizlet.com" size="large" />
        </Form.Item>

        <Form.Item
          hasFeedback
          label="Username"
          name="Username"
          validateFirst
          rules={[
            {
              required: true,
              max: 20,
            },
          ]}
          className="font-semibold"
        >
          <Input placeholder="andrew123" size="large" />
        </Form.Item>

        <Form.Item
          hasFeedback
          label="Password"
          name="Password"
          validateFirst
          rules={[
            {
              required: true,
              max: 20,
            },
          ]}
          className="font-semibold"
        >
          <Input.Password placeholder="••••••••" type="Password" size="large" />
        </Form.Item>
        <Form.Item shouldUpdate className="mb-0">
          {() => (
            <Button
              size="large"
              block
              type="primary"
              htmlType="submit"
              disabled={!isValidateInfo(registerForm)}
            >
              Register
            </Button>
          )}
        </Form.Item>
      </Form>

      <Button size="large" block onClick={() => setTab("2")}>
        Already have account? Login
      </Button>
    </Space>
  );
}

export default Register;