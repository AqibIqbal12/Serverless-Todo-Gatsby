import fetch from 'cross-fetch';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';


export const client = new ApolloClient({
  link: new HttpLink({
    uri: '/.netlify/functions/todoList',
    fetch,
  }),
  cache: new InMemoryCache({
    typePolicies:{
      Query: {
        fields: {
          todos:{        
            merge: false,  // Short for always preferring incoming over existing data.

            // merge(existing, incoming) {
            //   return incoming;
            // },
          }
        },
      },
    }
  })
});