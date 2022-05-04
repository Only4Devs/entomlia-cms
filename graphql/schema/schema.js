// The GraphQL schema in string form
const typeDefs = `
  type Query {
    items: [Item]
  }
  type Item {
    id: Int, title: String
  }
`;

// The resolvers
const resolvers = {
  Query: {
    items: () => {
      return [
        {id: 1, title: 'Item 1'},
        {id: 2, title: 'Item 2'},
        {id: 3, title: 'Item 3'},
      ];
    }
  },
};

module.exports = {
  typeDefs: typeDefs,
  resolvers: resolvers
}
