import {
  Map as ImmutableMap,
  List as ImmutableList,
  fromJS as ConvertToImmutable } from 'immutable';
import {
  GIF_LIST_FETCH_REQUEST,
  GIF_LIST_FETCH_SUCCESS,
  GIF_SEARCH_CHANGE,
  GIF_SEARCH_CLEAR,
  GIF_SEARCH_ACTIVATE,
  GIF_EMBED_PROGRESS,
  GIF_SEARCH_RESET,
  GIF_RESET_DONE,
} from '../actions/gif_search';

const initialState = ImmutableMap({
  data: ImmutableList([
    ImmutableMap({
      id: '',
      url: '',
      preview: '',
      width: 0,
      height: 0,
    })]
  ),
  pagination: ImmutableMap({
    total_count: 0,
    count: 0,
    offset: 0,
  }),
  value: '',
  active: false,
  preview_type: 'gif',
  progress: false,
  reset: false,
});

export default function gif_search(state = initialState, action) {

  switch (action.type) {
  case GIF_SEARCH_ACTIVATE:
    return state.set('active', action.active);
  case GIF_LIST_FETCH_REQUEST:
    return state.set('progress', true);
  case GIF_LIST_FETCH_SUCCESS:
    const { data, pagination, preview_type, format } = action.search_results;

    let previews;
    if (pagination.offset === 0) {
      previews = [];
    } else {
      previews = state.get('data').size > 1 ? state.get('data').toArray() : [];
    }

    previews = previews.concat(data.map( item => {
      const preview = item.images[preview_type];

      return ImmutableMap({
        id: item.id,
        url: item.url,
        preview: (format === 'gif' ? preview.url : preview[format]),
        width: preview.width,
        height: preview.height,
      });
    }));

    state = ImmutableMap({
      data: ConvertToImmutable(previews),
      pagination: ConvertToImmutable(pagination),
      value: '',
      active: true,
      preview_type: state.preview_type,
      progress: false,
      reset: false,
    });
    return state;
  case GIF_SEARCH_CHANGE:
    return state.set('value', action.value);
  case GIF_EMBED_PROGRESS:
    return state.set('progress', true);
  case GIF_SEARCH_CLEAR:
    return initialState;
  case GIF_SEARCH_RESET:
    return state.set('reset', true);
  case GIF_RESET_DONE:
    return state.set('reset', false);
  default:
    return state;
  }

}