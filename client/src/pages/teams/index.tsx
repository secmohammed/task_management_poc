import React, { useState } from 'react'
import {
  useQuery,
  useMutation,
  useLazyQuery,
} from '@apollo/client'

import {
  Modal,
  Table,
  Input,
  Button,
  Form,
  Tag,
  Select,
  FormInstance,
} from 'antd'
import INDEX_TEAMS from '../../graphql/teams/queries/INDEX_TEAMS'
import CREATE_TEAM from '../../graphql/teams/mutations/CREATE_TEAM'
import INDEX_USERS from '../../graphql/users/queries/INDEX_USERS'
import CREATE_MEMBER from '../../graphql/members/mutations/CREATE_MEMBER'

const Option = Select

const Teams = () => {
  const {
    loading,
    data,
    refetch: refetchTeams,
  } = useQuery(INDEX_TEAMS)
  const [getUsers, { data: users }] = useLazyQuery(
    INDEX_USERS,
    {
      fetchPolicy: 'cache-first',
    },
  )
  const [createMember] = useMutation(CREATE_MEMBER)
  const [createTeam] = useMutation(CREATE_TEAM)
  const [isModalVisible, setIsModalVisible] =
    useState<boolean>(false)

  const showModal = () => {
    getUsers()
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const handleOk = async ({ name, userIds }: any) => {
    console.log(name, userIds)
    createTeam({
      variables: {
        name,
      },
    }).then(async (record: any) => {
      await createMember({
        variables: {
          teamId: record.data.createTeam.id,
          userIds,
        },
      })
      refetchTeams()
    })
    setIsModalVisible(false)
  }
  const [form] = Form.useForm()
  const createTeamRef = React.createRef<FormInstance>()

  const columns = [
    {
      title: 'name',
      dataIndex: 'name',
      width: '25%',
    },
    {
      title: 'owner',
      dataIndex: 'owner',
      render: (owner: any) => (
        <Tag color='darkblue'>
          {owner.name.toUpperCase()}
        </Tag>
      ),
      width: '15%',
    },
    {
      title: 'members',
      dataIndex: 'members',
      render: (members: any) => (
        <>
          {members.map((member: any) => {
            return (
              <Tag color='green' key={member.id}>
                {member.name.toUpperCase()}
              </Tag>
            )
          })}
        </>
      ),
      width: '40%',
    },
  ]

  return loading ? (
    <>Loading...</>
  ) : (
    <>
      <Button onClick={showModal}>+</Button>
      <Table
        bordered
        dataSource={data.teams}
        columns={columns}
        rowClassName='editable-row'
        pagination={false}
      />
      <Modal
        title='Members'
        visible={isModalVisible}
        onOk={form.submit}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          onFinish={handleOk}
          ref={createTeamRef}
        >
          <Form.Item
            label='Name'
            name='name'
            rules={[
              {
                required: true,
                message: 'Please input your name!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name='userIds'
            label='Members'
            rules={[{ required: true }]}
          >
            <Select
              placeholder='select an option'
              mode='multiple'
              onChange={(value: string[]) =>
                createTeamRef.current!.setFieldsValue({
                  userIds: value,
                })
              }
              allowClear={true}
              showArrow={true}
              style={{
                width: '70%',
              }}
            >
              {users?.users?.map((user: any) => (
                <Option value={user.id} key={user.id}>
                  {user.email}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default Teams
