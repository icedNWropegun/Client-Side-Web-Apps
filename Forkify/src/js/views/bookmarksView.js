/* This module contains code relating to the presentation logic of the Bookmarks View */

import View from './View.js';
import previewView from './previewView.js'; // "child view" to generate .preview markup for the Bookmarks View
import icons from 'url:../../img/icons.svg';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage =
    'There are no bookmarks yet. Find a recipe you like and bookmark it ;D';
  _message = '';

  addHandlerRenderBookmarks(handler) {
    window.addEventListener('load', handler);
  }

  //  1.controller calls render(Arr) on Bookmarks View  => 2. _generateMarkup() for each bookmark called in View using this keyword pointing to Boookmarks View => 3. previewView.render() called in Bookmarks View for each of the bookmarks in the array => 4. _generateMarkup() for each of the bookmarks in the array called in View using this keyword pointing to Preview View => 5. Preview View.generateMarkup() returns a string of HTML for each of the the bookmarks in the Bookmarks View => 6. Finally, string is returned to "parent call" in controller
  _generateMarkup() {
    //instead of rendering bookmarks to the DOM we have render() return the method as a string
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join(''); // Array of strings returned from this method => stored in recipeMarkup variable of render() method in View => origionally called in controller
  }
}

// instance => controller
export default new BookmarksView();
