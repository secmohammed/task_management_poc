import { useMutation } from '@apollo/client'
import REGISTER_USER_MUTATION from '../../graphql/users/mutations/CREATE_USER'
import { useHistory } from 'react-router-dom'

import { Form, Input, Button, Typography } from 'antd'
const { Title } = Typography
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8 },
}
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
}

const Create = () => {
  const history = useHistory()
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  const [register, { error, data }] = useMutation(
    REGISTER_USER_MUTATION,
    {
      errorPolicy: 'all',
    },
  )
  const handleSubmit = ({
    email,
    password,
    password_confirmation,
    name,
  }: any) => {
    register({
      variables: {
        email,
        password,
        password_confirmation,
        name,
      },
    }).then(() => history.push('/'))
  }
  return (
    <>
      <Title style={{ margin: '0 auto' }}>
        Create User
      </Title>
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
          label='Name'
          name='name'
          rules={[
            {
              required: true,
              type: 'string',
              message: 'Please enter name email!',
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
          label='Password'
          name='password_confirmation'
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input.Password />
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

export default Create
