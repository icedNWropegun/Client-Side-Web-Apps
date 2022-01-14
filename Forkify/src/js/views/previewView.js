/*This module contains the presentation logic that generates the .preview Element markup. It is used as a "child view" for the Bookmarks View + Results View to get their markup  */
import View from './View.js';
import icons from 'url:../../img/icons.svg';

//PreviewView class inherits from parent class and when BookmarksView or resultsView calls this._data.map(el=>previewView.render(bookmark, false) => packages and delivers string to origional call => Bookmarks View
class PreviewView extends View {
  _parentElement = '';

  _generateMarkup() {
    const id = window.location.hash.slice(1);
    return `
    <li class="preview">
        <a class="preview__link ${
          this._data.id === id ? 'preview__link--active' : ''
        }" href="#${this._data.id}">
            <figure class="preview__fig">
                <img src="${this._data.image}" alt="${this._data.title}"/>
            </figure>
            <div class="preview__data">
                <h4 class="preview__title">${this._data.title}</h4>
                <p class="preview__publisher">${this._data.publisher}</p>
                <div class="preview__user-generated ${
                  this._data.key ? '' : 'hidden'
                }">
                  <svg>
                    <use href="${icons}#icon-user"></use>
                  </svg>
                </div>
            </div>
        </a>
    </li>
`;
  }
}

// instance => controller
export default new PreviewView();
