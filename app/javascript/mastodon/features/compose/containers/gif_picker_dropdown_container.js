import { connect } from 'react-redux';
import GifPickerDropdown from '../components/gif_picker_dropdown';
import { changeGifSearch, fetchGifList } from '../../../actions/gif_search';

const mapStateToProps = state => ({
  value: state.getIn(['gif_picker', 'value']),
  submitted: state.getIn(['gif_picker', 'submitted']),
});

const mapDispatchToProps = dispatch => ({
  onChange (value) {
    dispatch(changeGifSearch(value));
  },

  onSubmit () {
    dispatch(fetchGifList());
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(GifPickerDropdown);
