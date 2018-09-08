import api from '../api';

export const GIF_LIST_FETCH_REQUEST = 'GIF_LIST_FETCH_REQUEST';
export const GIF_LIST_FETCH_SUCCESS = 'GIF_LIST_FETCH_SUCCESS';
export const GIF_LIST_FETCH_FAIL    = 'GIF_LIST_FETCH_FAIL';

export const GIF_SEARCH_CHANGE      = 'GIF_SEARCH_CHANGE';

export function changeGifSearch(value) {
  return {
    type: GIF_SEARCH_CHANGE,
    value,
  };
}

export function fetchGifList() {
  return (dispatch, getState) => {
    dispatch(fetchGifListRequest());

    api(getState).get('/api/radical/gif_search').then(response => {
      dispatch(fetchGifListSuccess(response.data));
    }).catch(error => {
      dispatch(fetchGifListFail(error));
    });
  };
};

export function fetchGifListRequest() {
  return {
    type: GIF_LIST_FETCH_REQUEST,
  };
};

export function fetchGifListSuccess(custom_emojis) {
  return {
    type: GIF_LIST_FETCH_SUCCESS,
    custom_emojis,
  };
};

export function fetchGifListFail(error) {
  return {
    type: GIF_LIST_FETCH_FAIL,
    error,
  };
};