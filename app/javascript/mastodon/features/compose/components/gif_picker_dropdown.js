import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '../../../components/icon_button';
import Overlay from 'react-overlays/lib/Overlay';
import detectPassiveEvents from 'detect-passive-events';
import classNames from 'classnames';
import { List as ImmutableList, Map as ImmutableMap } from 'immutable';

const listenerOptions = detectPassiveEvents.hasSupport ? { passive: true } : false;

const iconStyle = {
  height: null,
  lineHeight: '27px',
};

class GifPickerMenu extends React.PureComponent {

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    style: PropTypes.object.isRequired,
    previews: PropTypes.instanceOf(ImmutableList),
    value: PropTypes.string,
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

  handleChange = e => {
    this.props.onChange(e.target.value);
  }

  handleSubmit = e => {
    this.props.onSubmit(this.props.value);
    e.preventDefault();
  }

  render() {
    const { style } = this.props;
    let getPreview = (preview, n) => {
      return (
        <GifPreview
          key={n}
          id={preview.get('id')}
          src={preview.get('preview')}
          width={Number(preview.get('width'))}
          height={Number(preview.get('height'))}
          onSelect={this.props.onSelect}
        />
      );
    };
    return(
      <div className={classNames('compose-form__gif-picker-dropdown')} ref={this.setRef} style={style}>
        <form onSubmit={this.handleSubmit}>
          <input
            autoComplete='off'
            className='compose-form__gif-picker-dropdown-input'
            type='text'
            name='value'
            placeholder='Search...'
            onChange={this.handleChange}
          />
        </form>
        <div className='compose-form__gif-picker-previews'>
          <div className={classNames('compose-form__gif-picker-column-1', 'gif-preview-column')}>
            { this.props.previews.map( (preview, n) => {
              if (n % 2 === 0) {
                return(getPreview(preview, n));
              } else {
                return null;
              }
            })}
          </div>
          <div className={classNames('compose-form__gif-picker-column-2', 'gif-preview-column')}>
            { this.props.previews.map( (preview, n) => {
              if (n % 2 === 1) {
                return(getPreview(preview, n));
              } else {
                return null;
              }
            })}
          </div>
        </div>
      </div>
    );
  }

}

class GifPreview extends React.PureComponent {

  static propTypes = {
    id: PropTypes.string.isRequired,
    src: PropTypes.string.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    onSelect: PropTypes.func.isRequired,
  }

  static defaultProps = {
    id: '',
    src: '',
    width: 0,
    height: 0,
    url: '',
  }

  start = e => {
    e.target.play();
  }

  stop = e => {
    e.target.pause();
    e.target.currentTime = 0;
  }

  handleSelect = () => {
    this.props.onSelect(this.props.id);
  }

  render() {
    return(
      <video
        muted loop
        className='gif-picker-preview'
        src={this.props.src}
        width={this.props.width}
        height={this.props.height}
        onMouseEnter={this.start}
        onMouseLeave={this.stop}
        onClick={this.handleSelect}
      />
    );
  }

}

export default class GifPickerDropdown extends React.PureComponent {

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    activateSearch: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    previews: PropTypes.instanceOf(ImmutableList),
    pagination: PropTypes.instanceOf(ImmutableMap),
  };

  static defaultProps = {
    value: '',
  }

  state = {
    placement: 'bottom',
  }

  onToggle = () => {
    if (this.props.active) {
      this.onHideDropdown();
    }
    else {
      this.onShowDropdown();
    }
  }

  onShowDropdown = () => {
    this.setState( { placement: 'bottom' });
    this.props.activateSearch(true);
  }

  onHideDropdown = () => {
    this.props.activateSearch(false);
    this.props.onClose();
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
    const {
      placement,
    } = this.state;

    const {
      onChange,
      onSubmit,
      onSelect,
      previews,
      pagination,
      value,
      active,
    } = this.props;

    return(
      <div ref={this.setTargetRef} className='compose-form__gif-picker-button;' onKeyDown={this.handleKeyDown} >
        <IconButton
          icon='film'
          title='Attach a GIF'
          onClick={this.onToggle}
          className='compose-form__upload-button-icon'
          size={18}
          active={active}
          inverted
          style={iconStyle}
        />
        <Overlay
          show={active}
          placement={placement}
          target={this.findTarget}
        >
          <GifPickerMenu
            onChange={onChange}
            onClose={this.onHideDropdown}
            onSubmit={onSubmit}
            onSelect={onSelect}
            previews={previews}
            pagination={pagination}
            value={value}
          />
        </Overlay>
      </div>
    );
  }

}