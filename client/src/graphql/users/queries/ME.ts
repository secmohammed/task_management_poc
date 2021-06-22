import { gql } from '@apollo/client'
export default gql`
  {
    me {
      id
      name
      email
      teams {
        id
        name
      }
    }
  }
`
