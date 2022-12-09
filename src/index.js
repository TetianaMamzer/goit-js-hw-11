import Notiflix from 'notiflix';
import NewsApiServer from './url';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  closeText: '🐠',
});

const refs = {
  form: document.querySelector('form'),
  input: document.querySelector('input'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('button.load-more')
};
console.log(refs)
const newsApiServer = new NewsApiServer();
refs.form.addEventListener('submit', onSubmiteClick);
refs.gallery.addEventListener('click', onCardGallery);
refs.loadMore.addEventListener('click', onMore);

async function onSubmiteClick(e) {
  e.preventDefault();
  clearList();
  refs.loadMore.classList.add('is-hiden');
  newsApiServer.searchQuery = e.currentTarget.elements.searchQuery.value.trim();
  newsApiServer.resetPage();
  newsApiServer.getUrl().then(onList).then((data) => {

    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
  })
  
}

function onMore() {

  newsApiServer.getUrl().then(onList).then((data) => {
    const total = data.totalHits / 40;
    if (newsApiServer.page >= total) {
      refs.loadMore.classList.add('is-hiden');
      return Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.")
    }
  });
  newsApiServer.page += 1;
}
function onList(data) {

  if ( newsApiServer.searchQuery === '') {
    return;
  } else if (data.hits.length === 0) {
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    // lightbox.refresh();
    const list = data.hits
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) => {
          return `
 <a class="gallery__item" href="${largeImageURL}">
  <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
  </a>
 `;
        }
      )
      .join('');
    console.log(data.total);
    refs.gallery.insertAdjacentHTML('beforeend', list);
    if (data.total <= 40) {
      lightbox.refresh();
      return data;
    } else {
      refs.loadMore.classList.remove('is-hiden');
    }
    lightbox.refresh();

    
    return data;
  }

}

function clearList() {
  refs.gallery.innerHTML = '';
}

function onCardGallery(event) {
  event.preventDefault();
  window.addEventListener('keydown', closeModalKeydown);
 
  const findGalleryCard = event.target.classList.contains('gallery__image');
  console.log(findGalleryCard)
  if (!findGalleryCard) {
    return;
  }

}

function closeModalKeydown(e) {
  if (e.code === 'Escape') {
    lightbox.close(() => {
      window.removeEventListener('keydown', closeModalKeydown);
    });
  }
}



