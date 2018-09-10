import { connect } from 'react-redux';
import GifPickerDropdown from '../components/gif_picker_dropdown';
import { changeGifSearch, fetchGifList, clearGifList, gifEmbed } from '../../../actions/gif_search';

const mapStateToProps = state => ({
  value: state.getIn(['gif_search', 'value']),
  submitted: state.getIn(['gif_search', 'submitted']),
  previews: state.getIn(['gif_search', 'data']),
  pagination: state.getIn(['gif_search', 'pagination']),
});

const mapDispatchToProps = dispatch => ({
  onChange (value) {
    dispatch(changeGifSearch(value));
  },

  onSubmit (value) {
    dispatch(fetchGifList(value));
  },

  onSelect (value) {
    dispatch(gifEmbed(value));
  },

  onClose () {
    dispatch(clearGifList());
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(GifPickerDropdown);