### Installation Steps.

- Open Terminal and execute the following script which will do the following:
  - Setup the backend, and run seeder for db. Backend will be available on port 8000.
  - Setup frontend on port 3000



```  ./build.sh```



open graphiql (or use cURL..) and get any user email to attempt login at the frontend using the following query



```
// http://localhost:8000/graphql
users {
  email
}
```
NOTE: the default password for all of the users is: password
