import { gql } from '@apollo/client'
export default gql`
  query showTask($id: String!) {
    showTask(data: { id: $id }) {
      id
      name
      assignees {
        id
        email
        name
      }
      owner {
        id
        email
      }
    }
  }
`
