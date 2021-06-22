import { gql } from '@apollo/client'
export default gql`
  query {
    tasks {
      id
      title
      status
      description
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
