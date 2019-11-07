import {GraphQLServer} from 'graphql-yoga'
import fs from 'fs';
import request from 'request'
import * as uuid from 'uuid'
import date from 'date-and-time';

const authorData = [], ingredientData = [] 
const recipeData = [];

const typeDefs=`
    type Query {
        authors: [Author!]
        recipes: [Recipe!]
        ingredient: [Ingredient!]
		authorRecipes (id: ID!): [Recipe!]
		ingredientRecipes (id: ID!): [Recipe!]
    }
    type Author {
        id: ID!,
        name: String!,
        email: String!
        recipes: [Recipe!] 
    }
    type Recipe {
        id: ID!,
        title: String!,
        description: String!,
        date: Int!,
        author: Author!,
		ingredients: [Ingredient!]
    }
    type Ingredient{
        id: ID!
		name: Author!
		recipes: [Recipe!]
    }
    type Mutation{
        addAuthor(name: String!, email: String!): Author!
        addRecipe(title: String!, description: String!, author: ID!, ingredients: ID!): Recipe!
		addIngredient(name: String!): Ingredient!
    }
`

const resolvers = {
    Author: {
        recipes:(parent, args, ctx, info) => {
            const authorID = parent.id;
            return recipeData.filter(obj => obj.author === authorID);
        } 
    },

    Recipe: {
        author:(parent, args, ctx, info) => {
            const authorID = parent.author;
            const result = authorData.find(obj => obj.id === authorID);
            return result;
        }
		ingredients:(parent, args, ctx, info) => {
			const ingredientID = parent.ingredient;
			const result = [];
			const result = ingredientData.filter(obj => obj.id === ingredientID);
			return result;
		}
    },
	
	Ingredient: {
		recipe:(parent, args, ctx, info) => {
			const ingredientID = parent.id;
			return recipeData.filter(obj => obj.ingredient === ingredientID);
		}
	},

    Query: {
        authors:()=>{
            return authorData;
        },
        
        recipes: () =>{
            return recipeData;
        },
		
		ingredients: () =>{
            return ingredientData;
        },
        
        authorRecipes: (parent, args, ctx, info) => {
            if(!recipeData.some(obj=>obj.author === args.id)){
                throw new Error (`No recipe by user ${args.id}`);
            }
			
            return recipeData.find(obj=>obj.author === args.id);
        },
		
	ingredientRecipes: (parent, args, ctx, info) => {
            if(!recipeData.some(obj=>obj.ingredient === args.id)){
                throw new Error (`No recipe with ingredient ${args.ingredient}`);
            }
            
            return recipeData.filter(obj => obj.ingredients.some(obj => obj === args.id));;
        }
    },

    Mutation: {
        addAuthor: (parent, args, ctx, info) => {
            const {name, email} = args;
            if (authorData.some(obj=>obj.email === email)){
                throw new Error(`User email ${email} already in use`);
            }

            const author = {
                name: name,
                email: email,
                id: uuid.v4()
            }

            authorData.push(author);
            return author;
        },

        addRecipe: (parent, args, ctx, info) => {
            const {title, description, author, ingredients} = args;
            if (recipeData.some(obj=>obj.author === author)){
                throw new Error(`There is no user with id ${id}`);
            }

            const recipe = {
                title,
                description,
                id: uuid.v4(),
                author,
		ingredients,
                date: new Date().getDate()
            }

            recipeData.push(recipe);
            return recipe;
        },
		
	addIngredient: (parent, args, ctx, info) => {
            const {name} = args;
            if (ingredientData.some(obj=>obj.name === name)){
                throw new Error(`Ingredient with name ${name} already exist`);
            }

            const ingredient = {
                name,
                id: uuid.v4()
            }

            ingredientData.push(ingredient);
            return ingredient;
        },
    }
}
const server = new GraphQLServer({typeDefs, resolvers});
server.start(()=> console.log("Server started"));
