import { gql } from '@apollo/client'
export default gql`
  query showTeam($id: String!) {
    showTeam(data: { id: $id }) {
      id
      name
      members {
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
