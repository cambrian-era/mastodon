import api from '../api';

import { uploadComposeSuccess } from './compose';

export const GIF_SEARCH_ACTIVATE    = 'GIF_SEARCH_ACTIVATE';

export const GIF_LIST_FETCH_REQUEST   = 'GIF_LIST_FETCH_REQUEST';
export const GIF_LIST_FETCH_SUCCESS   = 'GIF_LIST_FETCH_SUCCESS';
export const GIF_LIST_FETCH_FAIL      = 'GIF_LIST_FETCH_FAIL';

export const GIF_SEARCH_CHANGE      = 'GIF_SEARCH_CHANGE';
export const GIF_SEARCH_CLEAR       = 'GIF_SEARCH_CLEAR';

export const GIF_EMBED_REQUEST      = 'GIF_EMBED_REQUEST';
export const GIF_EMBED_PROGRESS     = 'GIF_EMBED_PROGRESS';
export const GIF_EMBED_SUCCESS      = 'GIF_EMBED_SUCCESS';
export const GIF_EMBED_FAIL         = 'GIF_EMBED_FAIL';

export const GIF_SEARCH_RESET       = 'GIF_SEARCH_RESET';
export const GIF_RESET_DONE         = 'GIF_RESET_DONE';

export function gifSearchActivate(active) {
  return {
    type: GIF_SEARCH_ACTIVATE,
    active,
  };
}

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

export function gifSearchReset() {
  return {
    type: GIF_SEARCH_RESET,
  };
}

export function fetchGifList(query, offset, preview_type, format) {
  return (dispatch, getState) => {
    dispatch(fetchGifListRequest());

    if (offset === 0) {
      dispatch(gifSearchReset());
    }

    api(getState).get('/api/radical/gif_search',
      {
        params: { query, offset },
      },
    ).then(response => {
      const { data, pagination } = response.data;
      dispatch(fetchGifListSuccess({
        data,
        pagination,
        preview_type,
        format,
      }));
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
    dispatch(gifEmbedProgress());

    api(getState).post('/api/radical/gif_embed',
      {
        file: id,
      }
    ).then((media) => {

      dispatch(uploadComposeSuccess(media.data));
      dispatch(gifEmbedSuccess());
      dispatch(clearGifList());

    }).catch(error => {

      dispatch(gifEmbedFail(error));

    });
  };
};

export function gifEmbedProgress() {
  return {
    type: GIF_EMBED_PROGRESS,
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