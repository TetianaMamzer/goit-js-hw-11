import axios from 'axios';

export default class NewsApiServer {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  getUrl() {
    console.log(this)
    const URL = 'https://pixabay.com/api/';
    
   return axios.get(`${URL}?key=31894475-96e7d507169227daa5d3a3af7&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`)
    .then(({data}) => data)
    .then(data => {
      this.page +=1;
      return data;
    });
  }
  resetPage() {
    this.page = 1;
  }
get getQuery() {
  return this.query;
}
set setQuery(newQuery) {
  this.query = newQuery;
}
};