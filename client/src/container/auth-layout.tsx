import React from 'react'

import { Layout } from 'antd'

const { Footer } = Layout

const AuthLayout = (props: any) => {
  return (
    <Layout style={{ height: '100vh' }}>
      {props.children}
      <Footer style={{ textAlign: 'center' }}>
        Ant Design ©2018 Created by Ant UED
      </Footer>
    </Layout>
  )
}

export default AuthLayout
