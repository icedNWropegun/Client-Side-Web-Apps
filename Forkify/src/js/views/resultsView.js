/* This module contains code relating to the presentation logic of user search results view*/

import View from './View.js';
import previewView from './previewView.js'; // "child view" to generate .preview markup for Results View
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage =
    'We could not find anything that matched your search. Please try another recipe or ingredient.';
  _message = '';

  _generateMarkup() {
    //instead of rendering results to the DOM we have render() return the method as a string
    return this._data.map(result => previewView.render(result, false)).join(''); // Array of strings returned
  }
}

// instance => controller
export default new ResultsView();
