import { connect } from 'react-redux';
import TextIconButton from '../components/text_icon_button';
import { uploadCompose } from '../../../actions/compose';

const mapStateToProps = ( state, { intl }) => ({
  label: 'GIF',
  title: 'Select an animated GIF',
  active: true
//   {
//   disabled: state.getIn(['compose', 'is_uploading']) || (state.getIn(['compose', 'media_attachments']).size > 3 || state.getIn(['compose', 'media_attachments']).some(m => m.get('type') === 'video')),
//   resetFileKey: state.getIn(['compose', 'resetFileKey']),
// }
});

const mapDispatchToProps = dispatch => ({

  onClick () {
    dispatch(uploadCompose(files));
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(GifSearchButton);
