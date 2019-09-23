module.exports = {
  client: {
    service: {
      name: "crm-app",
      // URL to the GraphQL API
      url: "http://localhost:3000/graphql/noAuth"
    },
    // Files processed by the extension
    includes: ["**/src/**/*.vue", "**/src/**/*.ts", "**/src/**/*.js"]
  }
};
