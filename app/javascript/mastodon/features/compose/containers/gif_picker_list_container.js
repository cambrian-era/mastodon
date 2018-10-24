import { connect } from 'react-redux';
import ScrollableContainer from '../../../components/scrollable_container';

const mapStateToProps = state => ({
  reset: state.getIn(['gif_search', 'reset']),
});

export default connect(mapStateToProps)(ScrollableContainer);