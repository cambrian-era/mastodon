import { connect } from 'react-redux';
import GifPickerDropdown from '../components/gif_picker_dropdown';
import {
  changeGifSearch,
  fetchGifList,
  clearGifList,
  gifEmbed,
  gifSearchActivate,
} from '../../../actions/gif_search';

const mapStateToProps = state => ({
  value: state.getIn(['gif_search', 'value']),
  submitted: state.getIn(['gif_search', 'submitted']),
  previews: state.getIn(['gif_search', 'data']),
  pagination: state.getIn(['gif_search', 'pagination']),
  active: state.getIn(['gif_search', 'active']),
  preview_format: state.getIn(['gif_search', 'preview_format']),
  progress: state.getIn(['gif_search', 'progress']),
  unavailable: state.getIn(['compose', 'poll']) !== null,
});

const mapDispatchToProps = dispatch => ({
  onChange (value) {
    dispatch(changeGifSearch(value));
  },

  onRequest (value, preview_format, offset) {
    dispatch(fetchGifList(value, offset, 'fixed_width_downsampled', preview_format));
  },

  onSelect (value) {
    dispatch(gifEmbed(value));
  },

  onClose () {
    dispatch(clearGifList());
  },

  activateSearch (active) {
    dispatch(gifSearchActivate(active));
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(GifPickerDropdown);