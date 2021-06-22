import { gql } from '@apollo/client'
export default gql`
  mutation deleteTask($id: String!) {
    deleteTask(data: { taskId: $id }) {
      id
    }
  }
`
