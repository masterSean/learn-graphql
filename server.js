const express = require("express");
const graphqlHTTP = require("express-graphql");
const app = express();
const Schema = require("./schema.js");

app.use("/graphql" , graphqlHTTP({
    schema: Schema,
    graphiql: true,
    formatError: function(error) {
        return {
            message: error.message,
            locations: error.locations,
            stack: error.stack
        };
    }
}));

app.listen(5000, function(){
    console.log("Server running on port 5000");
});
