import { gql } from '@apollo/client'

export default gql`
  mutation StoreAssignees(
    $userIds: [String!]!
    $taskId: String!
  ) {
    storeAssignees(
      data: { userIds: $userIds, taskId: $taskId }
    ) {
      id
    }
  }
`
