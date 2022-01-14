/* This module contains code relating to the Business Logic, State Logic, and it is where HTTP Library logic is used */

import { async } from 'regenerator-runtime'; //For Parcel
import { API_URL, RES_PER_PAGE, KEY } from './config.js'; // Config variables used in loadRecipe() && loadSearchResults
import { AJAX } from './helpers.js'; // HTTP Library
// State Obj contains all data about application and is the "single source of truth"
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

// Once you GET response from API this function is called & transforms response data for use in state
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
    //recipe key property is conditionally added
  };
};

export const loadRecipe = async function (recipeId) {
  try {
    const data = await AJAX(`${API_URL}${recipeId}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    // When a user loads a recipe we check if its been bookmarked already to help maintain state
    if (state.bookmarks.some(bookmark => bookmark.id === recipeId))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (error) {
    throw error;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
        //recipe key property is conditionally added
      };
    });
    state.search.page = 1; //Reset Search Results View page state upon new search
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//This func breaks up the array of search results so we dont have more than 10 LI's at a time.
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page; // state is maintained whenever controller calls getSearchResultsPage()

  let start = (page - 1) * state.search.resultsPerPage;
  let end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ingredient => {
    ingredient.quantity =
      (ingredient.quantity * newServings) / state.recipe.servings;
    //newqt = oldqt * new servings / old servings
  });

  state.recipe.servings = newServings; // To maintain state
};

//Bookmarks are data persistent => they live in locale storage.
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  //Add bookmark to state Obj so we can check for BookMarked recipes when user renders a new recipe
  state.bookmarks.push(recipe);

  //Mark current recipe as bookmarked in the Search Results View
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (recipeId) {
  //Delete bookmark from state obj when a bookmarked recipe contains this recipeId
  const recipeIndex = state.bookmarks.findIndex(
    element => element.id === recipeId
  );
  state.bookmarks.splice(recipeIndex, 1);
  //Mark current recipe as NOT bookmarked in the Search Results View
  if (recipeId === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

export const uploadRecipe = async function (newRecipe) {
  try {
    //Obj => [key, value] => create new Arr containing each 'entry' where only the first element of the array starts with "ingredient" & ignoring any empty "ingredient" elements [key, val] => Obj
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ingredient => {
        const ingredientArr = ingredient[1]
          .split(',')
          .map(element => element.trim());

        if (ingredientArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please follow the correct format. HINT: Pay attention to commas'
          );

        const [quantity, unit, description] = ingredientArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    // Manipulate state data from application and tranform into Response Obj for POST in helpers.js module
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const apiData = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(apiData);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
