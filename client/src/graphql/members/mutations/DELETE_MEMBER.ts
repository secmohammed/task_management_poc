import { gql } from '@apollo/client'

export default gql`
  mutation DeleteMember(
    $userIds: [String!]!
    $teamId: String!
  ) {
    deleteMember(
      data: { userIds: $userIds, teamId: $teamId }
    ) {
      id
      name
    }
  }
`
