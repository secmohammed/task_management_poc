import React, { useEffect } from 'react'
import { useMutation } from '@apollo/client'
import LOGIN_USER_MUTATION from '../../graphql/users/mutations/LOGIN'
import {
  Form,
  Input,
  Checkbox,
  Button,
  Typography,
} from 'antd'
import { useHistory } from 'react-router-dom'
const { Title } = Typography
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
}

const Login = () => {
  const history = useHistory()

  useEffect(() => {
    if (localStorage.getItem('token')) {
      history.push('/')
    }
  })

  const [login, { error, data }] = useMutation(
    LOGIN_USER_MUTATION,
    {
      errorPolicy: 'all',
    },
  )
  const handleSubmit = async ({
    password,
    email,
  }: {
    password: string
    email: string
  }) => {
    console.log(email, password)
    await login({
      variables: {
        email,
        password,
      },
    })
    console.log(data)
    if (data && data.login) {
      localStorage.setItem('token', data.login.auth_token)
      history.push('/')
    }
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }
  return (
    <>
      <Title style={{ margin: '0 auto' }}>Login</Title>
      <Form
        {...layout}
        name='basic'
        initialValues={{ remember: true }}
        onFinish={handleSubmit}
        onFinishFailed={onFinishFailed}
        style={{ marginTop: '50px' }}
      >
        <Form.Item
          label='Email'
          name='email'
          rules={[
            {
              required: true,
              type: 'email',
              message: 'Please enter your email!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label='Password'
          name='password'
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          {...tailLayout}
          name='remember'
          valuePropName='checked'
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}
export default Login
