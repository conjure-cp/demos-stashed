# Solver API

Conjure is wrapped in a docker image alongside a small GraphQL server. This allows for queries, mutations and subscriptions as a means to communicate information regarding solver progress.

## Getting Started

_The nature of GraphQL is self-documenting, so for more advanced queries view the introspection._

### Endpoint

```
POST https://<host>/graphql
```

### Solve a conjure problem
