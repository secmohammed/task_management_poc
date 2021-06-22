import { gql } from '@apollo/client'
export default gql`
  query {
    teams {
      id
      name
      members {
        id
        email
        name
      }
      owner {
        id
        name
        email
      }
    }
  }
`
