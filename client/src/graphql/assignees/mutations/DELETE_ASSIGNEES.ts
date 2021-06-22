import { gql } from '@apollo/client'

export default gql`
  mutation DeleteAssignees(
    $userIds: [String!]!
    $taskId: String!
  ) {
    deleteAssignees(
      data: { userIds: $userIds, taskId: $taskId }
    ) {
      id
    }
  }
`
