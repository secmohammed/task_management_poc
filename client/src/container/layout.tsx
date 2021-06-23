import { Layout, Menu, Breadcrumb } from 'antd'
import {
  DesktopOutlined,
  PieChartOutlined,
} from '@ant-design/icons'
import React from 'react'
import { useHistory } from 'react-router-dom'

const { Content, Sider, Footer } = Layout

const CustomLayout = ({ children }: any) => {
  const history = useHistory()
  const [defaultSeleciton, setDefaultSelection] =
    React.useState('1')
  const handleItemSelection = React.useCallback((key) => {
    setDefaultSelection(key)
  }, [])
  return (
    <>
    <Content style={{ padding: '0 50px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Teams</Breadcrumb.Item>
      </Breadcrumb>
      <Layout
        className='site-layout-background'
      >
        <Sider
          className='site-layout-background'
          width={200}
        >
          <Menu
            mode='inline'
            defaultSelectedKeys={['1']}
            selectedKeys={[defaultSeleciton]}
            onClick={(e) => handleItemSelection(e.key)}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%' }}
          >
            <Menu.Item
              key='1'
              icon={<PieChartOutlined />}
              onClick={() => history.push('/')}
            >
              Tasks
            </Menu.Item>
            <Menu.Item
              key='2'
              icon={<DesktopOutlined />}
              onClick={() => history.push('/teams')}
            >
              Teams
            </Menu.Item>
            <Menu.Item
              key='3'
              icon={<DesktopOutlined />}
              onClick={() => history.push('/users/create')}
            >
              Create User
            </Menu.Item>
          </Menu>
        </Sider>
        <Content
          style={{ padding: '0 24px', minHeight: 280 }}
        >
          {children}


        </Content>
      </Layout>
    </Content>
    <Footer style={{ textAlign: 'center' }}>
      Ant Design ©2018 Created by Ant UED
    </Footer>
    </>
  )
}

export default CustomLayout
