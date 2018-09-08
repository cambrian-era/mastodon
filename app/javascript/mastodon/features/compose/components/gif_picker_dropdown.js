import React from 'react';
import PropTypes from 'prop-types';
//import { injectIntl, defineMessages } from 'react-intl';
import IconButton from '../../../components/icon_button';
import Overlay from 'react-overlays/lib/Overlay';
//import Motion from '../../ui/util/optional_motion';
//import spring from 'react-motion/lib/spring';
import detectPassiveEvents from 'detect-passive-events';
import classNames from 'classnames';

const listenerOptions = detectPassiveEvents.hasSupport ? { passive: true } : false;

const iconStyle = {
  height: null,
  lineHeight: '27px',
};

class GifPickerMenu extends React.PureComponent {

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onClose: PropTypes.func,
    style: PropTypes.object,
    placement: PropTypes.string,
  }

  static defaultProps = {
    style: {},
  }

  setRef = c => {
    this.node = c;
  }

  componentDidMount () {
    document.addEventListener('click', this.handleDocumentClick, false);
    document.addEventListener('touchend', this.handleDocumentClick, listenerOptions);
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.handleDocumentClick, false);
    document.removeEventListener('touchend', this.handleDocumentClick, listenerOptions);
  }

  handleDocumentClick = e => {
    if (this.node && !this.node.contains(e.target)) {
      this.props.onClose();
    }
  }

  render() {
    const { style } = this.props;

    return(
      <div className={classNames('compose-form__gif-picker-dropdown')} ref={this.setRef} style={style}>
        <form>
          <input
            autoComplete='off'
            className='compose-form__gif-picker-dropdown-input'
            type='text'
            name='value'
            placeholder='Search...'
            onChange={this.props.onChange}
            onSubmit={this.onSubmit}
          />
        </form>
      </div>
    );
  }

}

// class GifPreview extends React.PureComponent {

// }

export default class GifPickerDropdown extends React.PureComponent {

  static propTypes = {
    onChange: PropTypes.func.isRequired,
  };

  state = {
    active: false,
  };

  onToggle = () => {
    if (this.state.active) {
      this.onHideDropdown();
    }
    else {
      this.onShowDropdown();
    }
  }

  onShowDropdown = () => {
    this.setState( {
      active: true,
      placement: 'bottom',
    });
  }

  onHideDropdown = () => {
    this.setState( { active: false } );
  }

  handleKeyDown = e => {
    if (e.key === 'Escape') {
      this.onHideDropdown();
    }
  }
  setTargetRef = c => {
    this.target = c;
  }

  findTarget = () => {
    return this.target;
  }

  render() {
    const { active, placement } = this.state;

    return(
      <div ref={this.setTargetRef} className='compose-form__gif-picker-button;' onKeyDown={this.handleKeyDown} >
        <IconButton icon='film' title='Attach a GIF' onClick={this.onToggle} className='compose-form__upload-button-icon' size={18} inverted style={iconStyle} />
        <Overlay
          show={active}
          placement={placement}
          target={this.findTarget}
          onClose={this.onHideDropdown}
        >
          <GifPickerMenu onChange={this.props.onChange} />
        </Overlay>
      </div>
    );
  }

}