const { ApolloServer, gql } = require('apollo-server-lambda');
var faunadb = require('faunadb'),
  q = faunadb.query;

const typeDefs = gql`

type Todo {
  id: ID!
  task: String!
  completed: Boolean!
}
type Query {
  todos: [Todo!],
}
type Mutation {
  addTodo(task: String!): Todo,
  deleteTodo(id: ID!): Todo,
  updateTodo(id: ID!): Todo,
}
  
`
const resolvers = {
  Query: {
    todos: async (root, args, context) => {
      try {
        var adminClient = new faunadb.Client({ secret: process.env.faunadbKey });
        const result = await adminClient.query(
          q.Map(
            q.Paginate(q.Match(q.Index('all_task'))),
            q.Lambda(x => q.Get(x))
          )
        )

        return result.data.map(d => {
          return {
            id: d.ref.id,
            task: d.data.task,
            completed: d.data.completed,

          }
        })

      }
      catch (err) {
        console.log(err)
      }
    }
  },

  
  Mutation: {
    addTodo: async (_, { task }) => {
      try {
        var adminClient = new faunadb.Client({ secret: process.env.faunadbKey });
        const result = await adminClient.query(
          q.Create(
            q.Collection('todos'),
            {
              data: {
                task: task,
                completed: false
              }
            },
          )
        )
        
        return {
          task: result.data.task,
        };

      }
      catch (err) {
        console.log(err)
      }
    },

    updateTodo: async(_, { id }) => {
      try {
        var adminClient = new faunadb.Client({ secret: process.env.faunadbKey });
        const result = await adminClient.query(
            q.Update(
                q.Ref(q.Collection('todos'), id),
                { data: {completed: true} }
            )
        )
    
        return {
          id: result.ref.id,
        };
      }
      catch (err) {
        console.log(err)
      }
    },
    
    deleteTodo: async(_, { id }) => {
      try {
        var adminClient = new faunadb.Client({ secret: process.env.faunadbKey });
        const result = await adminClient.query(
          q.Delete(
            q.Ref(q.Collection('todos'), id)
          )
        )
        return {
          id: result.ref.id,
        };
      }
      catch (err) {
        console.log(err)
      }
    }
    
  }

}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

exports.handler = server.createHandler()
