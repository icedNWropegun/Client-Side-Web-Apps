/* This module contains code relating to the view logic of the pagination buttons rendered below the resultsView */

import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  //Pub=>Sub pattern - events listened for in View but handled in Controller
  addHandlerClick(handler) {
    // Event delegation
    this._parentElement.addEventListener('click', function (event) {
      const btn = event.target.closest('.btn--inline');
      if (!btn) return; // Guard clause

      const goToPage = +btn.dataset.goto; //we use the dataset attr so that the model can maintain state when a user clicks a new results page
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1 & there are more =>
    if (currentPage === 1 && numPages > 1) {
      return this._generateMarkupButton('next', currentPage);
    }

    //Last page <=
    if (currentPage === numPages && numPages > 1) {
      return this._generateMarkupButton('prev', currentPage);
    }

    //Other page
    if (currentPage < numPages) {
      return `
      ${this._generateMarkupButton('prev', currentPage)}
      ${this._generateMarkupButton('next', currentPage)}`;
    }

    // Page 1 and there are NO more
    return '';
  }

  //   Generate button markup based off of button state
  _generateMarkupButton(type, currentPage) {
    if (type === 'next') {
      return `
            <button data-goto="${
              currentPage + 1
            }" class="btn--inline pagination__btn--next">
              <span>Page ${currentPage + 1}</span>
              <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
              </svg>
            </button>
          `;
    }

    if (type === 'prev') {
      return `
            <button data-goto="${
              currentPage - 1
            }" class="btn--inline pagination__btn--prev">
              <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
              </svg>
              <span>Page ${currentPage - 1}</span>
            </button>
          `;
    }
  }
}

// instance => controller
export default new PaginationView();
