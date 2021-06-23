import React, { useState } from 'react'
import INDEX_TASKS from '../../graphql/tasks/queries/INDEX_TASKS'
import {
  useQuery,
  useMutation,
  useLazyQuery,
} from '@apollo/client'
import { PlusCircleOutlined } from '@ant-design/icons'
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
import CREATE_TASK from '../../graphql/tasks/mutations/CREATE_TASK'
import CREATE_ASSIGNEE from '../../graphql/assignees/mutations/CREATE_ASSIGNEE'
import INDEX_USERS from '../../graphql/users/queries/INDEX_USERS'
import UPDATE_TASK from '../../graphql/tasks/mutations/UPDATE_TASK'
import DELETE_ASSIGNEES from '../../graphql/assignees/mutations/DELETE_ASSIGNEES'
import DELETE_TASK from '../../graphql/tasks/mutations/DELETE_TASK'

const Option = Select

const Tasks = ({ me }: any) => {
  const {
    loading,
    data,
    refetch: refetchTasks,
  } = useQuery(INDEX_TASKS)
  const [getUsers, { data: users }] = useLazyQuery(
    INDEX_USERS,
    {
      fetchPolicy: 'cache-first',
    },
  )
  const [editTask] = useMutation(UPDATE_TASK)
  const [createTask] = useMutation(CREATE_TASK)
  const [createAssignees] = useMutation(CREATE_ASSIGNEE)
  const [deleteAssignees] = useMutation(DELETE_ASSIGNEES)
  const [isModalVisible, setIsModalVisible] =
    useState<boolean>(false)
  const [isEditModalVisible, setIsEditModalVisible] =
    useState<any>({})
  const showModal = async () => {
    await getUsers()
    setIsModalVisible(true)
  }
  const showEditModal = (id: string) => {
    getUsers()
    setIsEditModalVisible({ [id]: true })
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const handleOk = async ({
    description,
    title,
    status,
    userIds,
  }: any) => {
    createTask({
      variables: {
        status,
        title,
        description,
      },
    }).then(async (createdTask: any) => {
      await createAssignees({
        variables: {
          taskId: createdTask.data.createTask.id,
          userIds,
        },
      })
      refetchTasks()
    })
    setIsModalVisible(false)
  }

  const handleEditCancel = () => {
    setIsEditModalVisible(false)
  }
  const [form] = Form.useForm()
  const [createForm] = Form.useForm()
  const [deleteTask] = useMutation(DELETE_TASK)
  const handleEditOk = async (
    task: any,
    { status, title, description, userIds }: any,
  ) => {
    await editTask({
      variables: {
        id: task.id,
        status,
        title,
        description,
      },
    })
    const oldAssignees = task.assignees.map(
      (assignee: any) => assignee.id,
    )
    await deleteAssignees({
      variables: {
        taskId: task.id,
        userIds: oldAssignees,
      },
    })
    await createAssignees({
      variables: {
        taskId: task.id,
        userIds,
      },
    })
    refetchTasks()
    setIsEditModalVisible(false)
  }
  const handleDeleteSubmission = React.useCallback(
    async (id) => {
      await deleteTask({
        variables: {
          id,
        },
      })
      refetchTasks()
    },
    [refetchTasks, deleteTask],
  )
  const columns = [
    {
      title: 'title',
      dataIndex: 'title',
      width: '20%',
      editable: true,
    },
    {
      title: 'description',
      dataIndex: 'description',
      width: '20%',
      editable: true,
    },
    {
      title: 'assignees',
      dataIndex: 'assignees',
      render: (assignees: any) => (
        <>
          {assignees.map((assignee: any) => {
            return (
              <Tag color='green' key={assignee.id}>
                {assignee.name.toUpperCase()}
              </Tag>
            )
          })}
        </>
      ),
      width: '20%',
    },
    {
      title: 'status',
      dataIndex: 'status',
      width: '20%',
      editable: true,
    },
    {
      title: 'operation',
      width: '20%',
      render: (record: any) => (
        <>
          <Button onClick={() => showEditModal(record.id)}>
            Edit
          </Button>
          {me && me.id && me.id === record.owner.id && (
            <Button
              onClick={() =>
                handleDeleteSubmission(record.id)
              }
            >
              Delete
            </Button>
          )}
          <Modal
            key={record.id}
            title='Edit Modal'
            visible={isEditModalVisible[record.id]}
            onOk={form.submit}
            onCancel={handleEditCancel}
          >
            <Form
              ref={editTaskRef}
              form={form}
              onFinish={(values) =>
                handleEditOk(record, values)
              }
            >
              <Form.Item
                label='Title'
                initialValue={record.title}
                name='title'
                rules={[
                  {
                    required: true,
                    message: 'Please input your title!',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label='Description'
                name='description'
                initialValue={record.description}
                rules={[
                  {
                    required: true,
                    message:
                      'Please input your description!',
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name='status'
                label='Status'
                rules={[{ required: true }]}
              >
                <Select
                  onChange={(value: string) =>
                    editTaskRef.current!.setFieldsValue({
                      status: value,
                    })
                  }
                  defaultValue={record.status}
                  placeholder='select a status option'
                  allowClear={true}
                  showArrow={true}
                  style={{
                    width: '70%',
                  }}
                >
                  <Option value='open'>Open</Option>
                  <Option value='closed'>Closed</Option>
                  <Option value='pending'>Pending</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name='userIds'
                label='Assignees'
                rules={[{ required: true }]}
              >
                <Select
                  placeholder='select an option'
                  mode='multiple'
                  onChange={(value: string[]) =>
                    editTaskRef.current!.setFieldsValue({
                      userIds: value,
                    })
                  }
                  defaultValue={record.assignees.map(
                    (assignee: any) => assignee.id,
                  )}
                  allowClear={true}
                  showArrow={true}
                  style={{
                    width: '70%',
                  }}
                >
                  {users?.users?.map((user: any) => (
                    <Option key={user.id} value={user.id}>
                      {user.email}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>
          </Modal>
        </>
      ),
    },
  ]
  const createTaskRef = React.createRef<FormInstance>()
  const editTaskRef = React.createRef<FormInstance>()
  return loading ? (
    <>Loading...</>
  ) : (
    <>
      <Button
        onClick={showModal}
        type='primary'
        shape='circle'
        icon={<PlusCircleOutlined />}
      ></Button>
      <Table
        bordered
        dataSource={data.tasks}
        columns={columns}
        rowClassName='editable-row'
        pagination={false}
      />
      <Modal
        title='Assignees'
        visible={isModalVisible}
        onOk={createForm.submit}
        onCancel={handleCancel}
      >
        <Form
          form={createForm}
          onFinish={handleOk}
          ref={createTaskRef}
        >
          <Form.Item
            label='Title'
            name='title'
            rules={[
              {
                required: true,
                message: 'Please input your title!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='Description'
            name='description'
            rules={[
              {
                required: true,
                message: 'Please input your description!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name='status'
            label='Status'
            rules={[{ required: true }]}
          >
            <Select
              placeholder='select a status option'
              allowClear={true}
              showArrow={true}
              onChange={(value: string) =>
                createTaskRef.current!.setFieldsValue({
                  status: value,
                })
              }
              style={{
                width: '70%',
              }}
            >
              <Option value='open'>Open</Option>
              <Option value='closed'>Closed</Option>
              <Option value='pending'>Pending</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name='userIds'
            label='Assignees'
            rules={[{ required: true }]}
          >
            <Select
              placeholder='select an option'
              mode='multiple'
              allowClear={true}
              showArrow={true}
              onChange={(value: string[]) =>
                createTaskRef.current!.setFieldsValue({
                  userIds: value,
                })
              }
              style={{
                width: '70%',
              }}
            >
              {users?.users?.map((user: any) => (
                <Option key={user.id} value={user.id}>
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

export default Tasks
