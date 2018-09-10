import api from '../api';

export const GIF_LIST_FETCH_REQUEST = 'GIF_LIST_FETCH_REQUEST';
export const GIF_LIST_FETCH_SUCCESS = 'GIF_LIST_FETCH_SUCCESS';
export const GIF_LIST_FETCH_FAIL    = 'GIF_LIST_FETCH_FAIL';

export const GIF_SEARCH_CHANGE      = 'GIF_SEARCH_CHANGE';
export const GIF_SEARCH_CLEAR       = 'GIF_SEARCH_CLEAR';

export const GIF_EMBED_REQUEST      = 'GIF_EMBED_REQUEST';
export const GIF_EMBED_SUCCESS      = 'GIF_EMBED_SUCCESS';
export const GIF_EMBED_FAIL         = 'GIF_EMBED_FAIL';

export function changeGifSearch(value) {
  return {
    type: GIF_SEARCH_CHANGE,
    value,
  };
}

export function clearGifList() {
  return {
    type: GIF_SEARCH_CLEAR,
  };
}

export function fetchGifList(query, offset) {
  return (dispatch, getState) => {
    dispatch(fetchGifListRequest());

    api(getState).get('/api/radical/gif_search',
      {
        params: { query, offset },
      },
    ).then(response => {
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

export function fetchGifListSuccess(search_results) {
  return {
    type: GIF_LIST_FETCH_SUCCESS,
    search_results,
  };
};

export function fetchGifListFail(error) {
  return {
    type: GIF_LIST_FETCH_FAIL,
    error,
  };
};

export function gifEmbed(id) {
  return (dispatch, getState) => {
    api(getState).post('/api/radical/gif_embed',
      {
        data: {
          id,
        },
      }
    ).then(() => {
      dispatch(gifEmbedSuccess());
    }).catch(error => {
      dispatch(gifEmbedFail(error));
    });
  };
};

export function gifEmbedSuccess() {
  return {
    type: GIF_EMBED_SUCCESS,
  };
}

export function gifEmbedFail(error) {
  return {
    type: GIF_EMBED_FAIL,
    error,
  };
}