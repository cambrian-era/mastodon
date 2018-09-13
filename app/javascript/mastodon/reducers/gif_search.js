import { 
  Map as ImmutableMap,
  List as ImmutableList,
  fromJS as ConvertToImmutable } from 'immutable';
import { 
  GIF_LIST_FETCH_SUCCESS,
  GIF_SEARCH_CHANGE,
  GIF_SEARCH_CLEAR,
  GIF_SEARCH_ACTIVATE,
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
});

export default function gif_search(state = initialState, action) {

  switch (action.type) {
  case GIF_SEARCH_ACTIVATE:
    return state.set('active', action.active);
  case GIF_LIST_FETCH_SUCCESS:
    const { data, pagination, preview_type, format } = action.search_results;
    state = ImmutableMap({
      data: ConvertToImmutable(data.map( item => {
        const preview = item.images[preview_type];

        return ImmutableMap({
          id: item.id,
          url: item.url,
          preview: (format === 'gif' ? preview.url : preview[format]),
          width: preview.width,
          height: preview.height,
        });
      })),
      pagination: ConvertToImmutable(pagination),
      value: '',
      active: true,
      preview_type: state.preview_type,
    });
    return state;
  case GIF_SEARCH_CHANGE:
    return state.set('value', action.value);
  case GIF_SEARCH_CLEAR:
    return initialState;
  default:
    return state;
  }

}