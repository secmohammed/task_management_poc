import React from 'react'
import { useQuery } from '@apollo/client'
import INDEX_TEAMS from './graphql/teams/queries/INDEX_TEAMS'
function App() {
  const { data, loading } = useQuery(INDEX_TEAMS)
  React.useEffect(() => {
    console.log(data)
  }, [loading])
  return <p>Hello World</p>
}

export default App
