/* This module contains code relating to the presentation logic of the addRecipe View */

import View from './View.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded!';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  //As soon as this Obj is created we run the _addHandlerShowForm() to handle events in the Add recipe View
  constructor() {
    super();
    this._addHandlerShowForm();
    this._addHandlerHideForm();
  }

  //toggleWindow() needs to be bound with 'this' keyword anywhere its referenced to handle events
  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addHandlerShowForm() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerHideForm() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (event) {
      event.preventDefault();
      //user form data => [...FormData Obj] === [key, val] => Obj. && 'this' points to parentEl
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  _generateMarkup() {}
}

// instance => controller // This module is ONLY exported because controller.js is the "main script" and we want the code in this module to run upon init
export default new AddRecipeView();
