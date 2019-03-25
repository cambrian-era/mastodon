import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '../../../components/icon_button';
import ScrollableContainer from '../containers/gif_picker_list_container';
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
    onRequest: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    style: PropTypes.object.isRequired,
    previews: PropTypes.instanceOf(ImmutableList),
    pagination: PropTypes.instanceOf(ImmutableMap),
    value: PropTypes.string,
    preview_format: PropTypes.string,
    progress: PropTypes.bool,
  }

  static defaultProps = {
    style: {},
    progress: false,
  }

  state = {
    valueSnapshot: '',
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
    this.setState({ valueSnapshot: '' });
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
    this.props.onRequest(this.props.value, 'gif', 0);
    this.setState({ valueSnapshot: this.props.value });
    e.preventDefault();
  }

  handleRequestMore = () => {
    const { offset, total_count } = this.props.pagination.toObject();

    if ( offset < total_count ) {
      this.props.onRequest(this.state.valueSnapshot, 'gif', offset + 50);
    }
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
          format={this.props.preview_format}
          tabIndex={n}
        />
      );
    };

    const previewLists = [[], []];
    this.props.previews.forEach( (preview, n) => previewLists[n % 2].push(preview) );

    return(
      <div
        className={classNames('compose-form__gif-picker-dropdown', { 'radical-loading': this.props.progress })}
        ref={this.setRef}
        style={style}
      >
        <form onSubmit={this.handleSubmit}>
          <input
            autoComplete='off'
            className={classNames('compose-form__gif-picker-dropdown-input', { 'radical-loading-pulse': this.props.progress } )}
            type='text'
            name='value'
            placeholder='Search...'
            onChange={this.handleChange}
          />
        </form>
        <ScrollableContainer
          className='compose-form__gif-picker-previews'
          loadMore={this.handleRequestMore}
          isLoading={this.props.progress}
        >
          <div className={classNames('compose-form__gif-picker-column-1', 'gif-preview-column')}>
            { previewLists[0].map((preview, n) => getPreview(preview, n)) }
          </div>

          <div className={classNames('compose-form__gif-picker-column-2', 'gif-preview-column')}>
            { previewLists[1].map((preview, n) => getPreview(preview, n + 1)) }
          </div>
        </ScrollableContainer>
      </div>
    );
  }

}

class GifPreview extends React.PureComponent {

  static propTypes = {
    id: PropTypes.string.isRequired,
    src: PropTypes.string.isRequired,
    format: PropTypes.string.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    onSelect: PropTypes.func.isRequired,
    tabIndex: PropTypes.number,
  }

  static defaultProps = {
    id: '',
    src: '',
    width: 0,
    height: 0,
    url: '',
    format: 'gif',
    tabIndex: 0,
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

  handleKey = e => {
    if (e.key === 13) {
      this.handleSelect();
    }
  }

  render() {
    if (this.props.format === 'mp4') {
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
    } else {
      return(
        <div
          onClick={this.handleSelect}
          onKeyDown={this.handleKey}
          tabIndex={this.props.tabIndex}
          className='gif-picker-preview-button'
          role='button'
        >
          <img
            src={this.props.src}
            width={this.props.width}
            height={this.props.height}
            alt=''
          />
        </div>
      );
    }
  }

}

export default class GifPickerDropdown extends React.PureComponent {

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onRequest: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    activateSearch: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    unavailable: PropTypes.bool,
    progress: PropTypes.bool,
    previews: PropTypes.instanceOf(ImmutableList),
    pagination: PropTypes.instanceOf(ImmutableMap),
  };

  static defaultProps = {
    value: '',
    progress: false,
  }

  state = {
    placement: 'bottom',
  }

  onToggle = () => {
    if (this.props.active) {
      this.onHideDropdown();
    } else {
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
    const { placement } = this.state;

    const {
      onChange,
      onRequest,
      onSelect,
      previews,
      pagination,
      value,
      active,
      progress,
      unavailable,
    } = this.props;

    if (unavailable) {
      return null;
    }
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
            onRequest={onRequest}
            onSelect={onSelect}
            previews={previews}
            pagination={pagination}
            value={value}
            progress={progress}
          />
        </Overlay>
      </div>
    );
  }

}