const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLInt, 
    GraphQLSchema, 
    GraphQLList, 
    GraphQLNonNull
} = require("graphql");
// User and Post data source
const USERS = require("./users.js").users;
const POSTS = require("./posts.js").posts;

function Users(id) {
    if (id) {
        const user = [];
        user.push(USERS.find(function(user){
            if (user.id === id) { return user; }
        }));
        return user;
    }
    return USERS;
}

function getUser(id) {
    return Users(id)[0];
}

/*
 * Post and Users Schema
 */
const UserSchema = new GraphQLObjectType({
    name: "User",
    description: "...",
    fields: function() {
        return {
            id: { type: GraphQLInt },
            first_name: { type: GraphQLString },
            last_name: { type: GraphQLString },
            age: { type: GraphQLInt },
            gender: { type: GraphQLString },
            email: { type: GraphQLString },
            posts: {
                type: new GraphQLList(PostSchema),
                resolve: function(user) {
                    const posts = POSTS.map( function(post){
                        if (post.user_id === user.id) {
                            return post;
                        }
                    });
                    return posts.filter(function(post){ return post !== undefined;  });
                }
            }
        };
    }
});

const PostSchema = new GraphQLObjectType({
    name: "Post",
    description: "...",
    fields: function() {
        return {
            id: { type: GraphQLInt },
            title: { type: GraphQLString },
            body: { type: GraphQLString },
            user_id: { type: GraphQLInt },
            user: {
                type: UserSchema,
                resolve: function(post) {
                    const user = USERS.find(function(user){
                        if (user.id === post.user_id) {
                            return user;
                        }
                    });
                    return user;
                }
            }
        };
    }
});


/*
 * Model Mutation
 */
const MutationAdd = {
    type: new GraphQLList(UserSchema),
    description: "...",
    args: {
        first_name: { type : new GraphQLNonNull(GraphQLString) },
        last_name: { type : new GraphQLNonNull(GraphQLString) },
        email: { type : new GraphQLNonNull(GraphQLString) },
        age: { type : new GraphQLNonNull(GraphQLString) },
        gender: { type : new GraphQLNonNull(GraphQLString) },
    },
    resolve: function (root, {first_name, last_name, email, age, gender}) {
        const new_data = {
            id : USERS.length,
            first_name : first_name,
            last_name : last_name,
            email : email,
            age : age,
            gender : gender
        };
        USERS.push(new_data);
        return [new_data];
    }
};

const Mutation = new GraphQLObjectType({
    name : "Mutation",
    fields: {
        add: MutationAdd
    }
});

const Query = new GraphQLObjectType({
    name: "users",
    fields: {
        users: {
            type: new GraphQLList(UserSchema),
            args: {
                id: { type : GraphQLInt },
            },
            resolve: function(_, args) {
                return Users(args.id);
            }
        },
        post: {
           type: new GraphQLList(PostSchema),
           args: {},
           resolve: function(_, args) {
               return POSTS;
           }
        }
    }
});

const Schema = new GraphQLSchema({
    query: Query,
    mutation:  Mutation
});

module.exports = Schema;
