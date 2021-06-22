import {
  ApolloCache,
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client'
import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { withClientState } from 'apollo-link-state'
import { ApolloLink, Observable } from 'apollo-link'
import { InMemoryCache as LocalCache } from 'apollo-cache-inmemory'

const cache = new InMemoryCache(
  {},
) as ApolloCache<NormalizedCacheObject>

const request = (operation: any) => {
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  })
}

const requestLink = new ApolloLink(
  (operation, forward) =>
    new Observable((observer) => {
      let handle: any
      Promise.resolve(operation)
        .then((oper) => request(oper))
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          })
        })
        .catch(observer.error.bind(observer))

      return () => {
        if (handle) handle.unsubscribe()
      }
    }),
)
const token = localStorage.getItem('token')
const httpLink = new HttpLink({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
})

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: process.env.REACT_APP_WS_GRAPHQL_ENDPOINT as string,
  options: {
    reconnect: true,
    timeout: 30000,
    connectionParams: {
      authorization: token ? `Bearer ${token}` : '',
    },
  },
})

export const apollo = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        console.log(graphQLErrors, 'listing errors...')
      }
      if (networkError) {
        console.log(networkError)
        // console.log("network issue, logging out...");
        // localStorage.removeItem("token");
      }
    }),
    requestLink,
    withClientState({
      cache: new LocalCache(),
      defaults: {
        isConnected: true,
      },
      resolvers: {
        Mutation: {
          updateNetworkStatus: (
            _: any,
            { isConnected }: any,
            { cache }: any,
          ) => {
            cache.writeData({ data: { isConnected } })
            return null
          },
        },
      },
    }),
    split(
      // split based on operation type
      ({ query }) => {
        const definition = getMainDefinition(query)
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        )
      },
      wsLink,
      httpLink,
    ),
  ]) as any,
  cache,
})
