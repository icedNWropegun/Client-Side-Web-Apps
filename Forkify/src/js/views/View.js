/* This module contains a parent class that all the child views will inherit from  */
import icons from 'url:../../img/icons.svg';

export default class View {
  _data; //data from model.state obj

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError(); // Guard clause if data is false or if there is data and the Arr is empty => reject promise

    this._data = data;
    const recipeMarkup = this._generateMarkup();

    if (!render) return recipeMarkup; //will provide data to the view of your choice, but the view will not try to insert markup if render = false - This only happens when previewView calls render() in the map() method in Results View + Bookmarks View

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', recipeMarkup);
  }

  // update() only updates texts and attributes in the DOM without having to re-render the entire recipe view
  update(data) {
    this._data = data; // whenever update() is called in the controller we want the views _data to maintain synced with state
    const newRecipeMarkup = this._generateMarkup(); // create new markup string => becomes a big object like a virtual DOM

    //convert markup string to dom object living in the memory => compare with DOM on the page
    const newDOM = document
      .createRange()
      .createContextualFragment(newRecipeMarkup); //becomes a big object like a virtual DOM === a DOM living in memory
    const newElements = Array.from(newDOM.querySelectorAll('*')); //gets all elements contained in the "virtual DOM"
    const currentElements = Array.from(
      this._parentElement.querySelectorAll('*')
    ); //this gets all the current elements rendered on the page

    //loop through both arrays and compare
    newElements.forEach((newEl, i) => {
      const curEl = currentElements[i];

      //Change Text Content: if newEl node !=== curEL && the text content of the newEl.nodeValue is not empty => child node of newEL in node list contains actual textContent because it is an element node and not a text node
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }
      //Change Attribute Value: if newEl node !=== curEL => replace attributes in currentEl with attributes from the newElement
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderLoadingSpinner() {
    const markup = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
      `;
    this._parentElement.innerHTML = markup;
  }

  renderError(message = this._errorMessage) {
    const markup = `
        <div class="error">
            <div>
                <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                </svg>
              </div>
              <p>${message}</p>
          </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
        <div class="message">
          <div>
              <svg>
                  <use href="${icons}#icon-smile"></use>
              </svg>
          </div>
          <p>${message}</p>
        </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
