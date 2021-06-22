import { gql } from '@apollo/client'
export default gql`
  mutation createTask(
    $description: String!
    $title: String!
    $status: String!
  ) {
    createTask(
      data: {
        description: $description
        title: $title
        status: $status
      }
    ) {
      id
    }
  }
`
