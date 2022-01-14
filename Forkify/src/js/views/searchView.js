/* This module contains code relating to the presentation logic of the recipe search feature*/
class SearchView {
  _parentElement = document.querySelector('.search');

  getQuery() {
    const query = this._parentElement.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentElement.querySelector('.search__field').value = '';
  }

  //Pub=>Sub pattern - events listened for in View but handled in Controller
  addHandlerSearch(handler) {
    //submit event lets us use one event listener to handle 2 cases: where user clicks enter or user clicks button to search
    this._parentElement.addEventListener('submit', function (event) {
      event.preventDefault();
      handler();
    });
  }
}

// exported => controller
export default new SearchView();
