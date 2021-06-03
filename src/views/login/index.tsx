import { Form, Input, Button, Row, Col } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '@components/app/provider';
import { useLocation, useHistory } from 'react-router-dom';
import styles from './styles.module.scss';

// 登录页
const LoginPage = () => {
  const auth = useAuth();
  const location = useLocation();
  const history = useHistory();
  const onFinish = (values: any) => {
    console.log('Success:', values);
    auth
      .signIn(values)
      .then((res) => {
        const { from } = (location?.state ?? { pathname: '/' }) as { from: Location };
        console.log('from: ', from);
        history.push(from);
      })
      .catch(console.log);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className={styles.loginPage}>
      <Row className={styles['height-2']} />
      <Row className={styles['height-6']} align="middle">
        <Col xs={2} sm={4} md={6} lg={8} xl={9} />
        <Col xs={20} sm={16} md={12} lg={8} xl={6}>
          <Form name="normal_login" className="login-form" initialValues={{ remember: true }} onFinish={onFinish}>
            <Form.Item name="username" rules={[{ required: true, message: 'Please input your Username!' }]}>
              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: 'Please input your Password!' }]}>
              <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Password" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className={styles.loginFormButton}>
                登录
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col xs={2} sm={4} md={6} lg={8} xl={9} />
      </Row>
      <Row className={styles['height-2']} />
    </div>
  );
};

export default LoginPage;
