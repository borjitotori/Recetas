import {GraphQLServer} from 'graphql-yoga'
import fs from 'fs';
import request from 'request'
import * as uuid from 'uuid'
import date from 'date-and-time';

const authorData = [], ingredientData = [], recipeData = [];

authorData.push({id: "123", name: "Borja", email: "awesad@diaw"},{id: "342", name: "Agustin", email: "dwadf@fnans"})
ingredientData.push({id: "122", name: "Guatemala"}, {id: "675", name: "Guatepeor"})
recipeData.push({id: "322", title: "Something good", description: "NONE", date: 123, author: "342", ingredients:["122", "675"]})

const typeDefs=`
    type Query {
        authors: [Author!]
        recipes: [Recipe!]
        ingredients: [Ingredient!]
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
		name: String!
		recipes: [Recipe!]
    }
    type Mutation{
        addAuthor(name: String!, email: String!): Author!
        addRecipe(title: String!, description: String!, author: ID!, ingredients: [ID!]!): Recipe!
        addIngredient(name: String!): Ingredient!
        deleteRecipe(id: ID!): String!
        deleteAuthor(id: ID!): String!
        deleteIngredient(id: ID!): String!
        actualizeAuthor(id: ID!, name: String, email: String): String!
        actualizeRecipe(id: ID!, title: String, description: String, addingredient: ID, delingredient: ID): String!
        actualizeIngredient(id: ID!, name: String): String!
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
        },
		ingredients:(parent, args, ctx, info) => {
			const ingredientID = parent.ingredients;
			const result = ingredientData.filter(obj => ingredientID.includes(obj.id));
			return result;
		}
    },
	
	Ingredient: {
		recipes:(parent, args, ctx, info) => {
			const ingredientID = parent.id;
			return recipeData.filter(obj => obj.ingredients.includes(ingredientID));
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
			
            return recipeData.filter(obj=>obj.author === args.id);
        },
		
	    ingredientRecipes: (parent, args, ctx, info) => {
            if(!recipeData.some(obj=>obj.ingredients.includes(args.id))){
                throw new Error (`No recipe with ingredient ${args.ingredients}`);
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

        deleteRecipe: (parent, args, ctx, info) =>{
            const message = (`git gud recipe with id ${args.id}`)
            recipeData.splice(recipeData.findIndex(obj => obj.id === args.id), 1)
            return message
        },

        deleteAuthor: (parent, args, ctx, info) =>{
            const message = (`git gud user with id ${args.id}`)
            authorData.splice(authorData.findIndex(obj => obj.id === args.id), 1)
            if (recipeData.some(obj=>obj.author === args.id)){
                recipeData.splice(recipeData.findIndex(obj => obj.author === args.id), 1)
            }
            return message
        },

        deleteIngredient: (parent, args, ctx, info) =>{
            const message = (`git gud ingredient with id ${args.id}`)
            ingredientData.splice(ingredientData.findIndex(obj => obj.id === args.id), 1)
            if (recipeData.some(obj=>obj.ingredients.includes(args.id))){author
                recipeData.splice(recipeData.findIndex(obj => obj.author === args.id), 1)
            }
            return message
        },

        actualizeAuthor: (parent, args, ctx, info) =>{
            const message = ("GIT GUD")
            const {id, name, email} = args;
            if(name){
                authorData.find(obj => obj.id === id).name=name
            }
            if(email){
                authorData.find(obj => obj.id === id).email=email
            }
            return message
        },

        actualizeRecipe: (parent, args, ctx, info) =>{
            const message = ("GIT GUD")
            const {id, name} = args;
            if(name){
                ingredientData.find(obj => obj.id === id).name=name
            }
            return message
        },

        actualizeRecipe: (parent, args, ctx, info) =>{

            const message = ("GIT GUD")
            const {id, title, description, addingredient, delingredient} = args;
            const index = recipeData.findIndex(obj => obj.id === id)
            if(title){
                recipeData.find(obj => obj.id === id).title=title
            }
            if(description){
                recipeData.find(obj => obj.id === id).description=description
            }
            if(addingredient){
                recipeData.find(obj => obj.id === id).ingredients.push(ingredientData.find(obj => obj.id === addingredient));
            }
            if(delingredient){
                recipeData.find(obj => obj.id === id).ingredients.splice(recipeData.findIndex(obj => obj.ingredients === delingredient), 1)
            }
            return message
        }
    }
}


const server = new GraphQLServer({typeDefs, resolvers});
server.start(()=> console.log("Server started"));
