import { gql } from '@apollo/client'

export default gql`
  mutation StoreMember(
    $userIds: [String!]!
    $teamId: String!
  ) {
    storeMember(
      data: { userIds: $userIds, teamId: $teamId }
    ) {
      id
      name
    }
  }
`
