import { gql } from '@apollo/client'
export default gql`
  mutation updateTask(
    $description: String!
    $title: String!
    $status: String!
    $id: String!
  ) {
    updateTask(
      data: {
        description: $description
        title: $title
        status: $status
        id: $id
      }
    ) {
      id
    }
  }
`
