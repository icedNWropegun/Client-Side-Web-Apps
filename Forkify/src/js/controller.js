/* This module contains code relating to the application logic. This controller is the bridge between the Model and the View. It dispatches tasks to both the Model && View */
import * as model from './model.js';
import { MODAL_CLOSE_SECONDS } from './config.js'; // controller uses this config setting in setTimeout to close modal after new user recipe is uploaded
import recipeView from './views/recipeView.js'; // controller uses this module to control presentation logic related to recipes
import searchView from './views/searchView.js'; // controller uses this functionality to get value of search query
import resultsView from './views/resultsView.js'; //controller uses this module to control presentation logic related to the search feature
import paginationView from './views/paginationView.js'; //controller uses this module to control presentation logic related to pagination buttons on LI generated from recipe search
import bookmarksView from './views/bookmarksView.js'; //controller uses this module to control presentation logic related to the bookmarking feature
import addRecipeView from './views/addRecipeView.js'; //This module is ONLY imported because controller.js is the "main script" and we want the code in AddRecipeView to run upon init

import 'core-js/stable';
import 'regenerator-runtime/runtime';

const controlRecipes = async function () {
  try {
    const recipeId = window.location.hash.slice(1);

    if (!recipeId) return;
    // recipeView.renderLoadingSpinner();

    // 0. update() Results View + Bookmarks View to highlight a user selected search result without re-rendering everything
    resultsView.update(model.getSearchResultsPage());

    // 1. update Bookmarks View
    bookmarksView.update(model.state.bookmarks);

    // 2. Load recipe
    await model.loadRecipe(recipeId);

    // 3. Render recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError();
    console.log(error);
  }
};

//Search Results Controller + Pagination Button Controller are intertwined because of the btn functionality
const controlSearchResults = async function () {
  try {
    resultsView.renderLoadingSpinner();
    // 1.) Get search query
    const query = searchView.getQuery();
    if (!query) return; //Guard clause incase there is no query

    // 2.) Load search results -populates query with data from model
    await model.loadSearchResults(query);

    // 3.) Render results
    resultsView.render(model.getSearchResultsPage());

    // 4.) Render initial pagination buttons upon search results
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};

// This controller mutates the rendered search results when the user clicks on page buttons
const controlPagination = function (goToPage) {
  // 1.) Render new results after user clicks new page
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2.) Render new pagination buttons after user clicks new page
  paginationView.render(model.state.search);
};

// This controller executes when user clicks buttons to increase or decrease servings
const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  //Update the Recipe View
  recipeView.update(model.state.recipe);
};

// This controller is executed whenever a user clicks on the bookmark btn
const controlAddBookmark = function () {
  // 1.) Add/remove bookmark from state obj- bookmarks[]-
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2.) Re-render the changed html in the RecipeView without re-rendering everything
  recipeView.update(model.state.recipe);

  // 3.) Render bookmarks[] in BookmarksView
  bookmarksView.render(model.state.bookmarks); // 2nd param of render() is true by default so this is where markup is inserted into DOM
};

// upon init => For each recipe that is bookmarked (in the state) => html markup is generated and eventually passed back to this func to be rendered. Bookmarks are data persistent => they live in locale storage.
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

// Control when user adds a new recipe
const controlAddRecipe = async function (newRecipe) {
  try {
    // 1.) POST new recipe data to API
    await model.uploadRecipe(newRecipe);

    // 2.) Render new recipe
    recipeView.render(model.state.recipe);

    // 3.) Render success message
    addRecipeView.renderMessage();

    // 4.) Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // 5.) Change ID in URL without reloading page using history api
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // 4.) Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SECONDS * 1000);
  } catch (err) {
    console.error('###', err);
    addRecipeView.renderError(err.message);
  }
};

//Pub=>Sub pattern - events listened for in View but handled in Controller
const init = function () {
  bookmarksView.addHandlerRenderBookmarks(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);

  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
