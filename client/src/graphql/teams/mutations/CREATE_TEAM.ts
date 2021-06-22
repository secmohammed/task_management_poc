import { gql } from '@apollo/client'

export default gql`
  mutation CreateTeam($name: String!) {
    createTeam(data: { name: $name }) {
      id
      name
    }
  }
`
