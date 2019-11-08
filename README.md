# Recipes exercise

## Querys

Las querys de tipo listado: authors, recipes y ingredients mostraran todos los elementos sin aplicar ningun filtro,

```graphql
query{
  authors{
    name
    id
    email
    recipes{
      ...
    }
  }
}
```
 para filtrar las recetas se usan dos querys: authorRecipes y ingredientRecipes
 
 ```graphql
query{
  authorRecipes(id: "id-del-autor para filtrar"){
    title
    id
    description
    ...
  }
}
```

## Mutaciones

existen tres tipo de mutaciones, de añadido: addRecipe, addIngredient, addAuthor donde tenemos que añadir los datos que no sean de tipo ID ó Recipe

```graphql
mutation{
  addAuthor(name: "Tempname", email: "example@gmail.com"){
    name
    id
    email
  }
}
```
