import React from 'react';
import PropTypes from 'prop-types';
import WaveSurfer from 'wavesurfer.js';
import { defineMessages, injectIntl } from 'react-intl';
import { formatTime } from 'mastodon/features/video';
import Icon from 'mastodon/components/icon';
import classNames from 'classnames';
import { throttle } from 'lodash';

const messages = defineMessages({
  play: { id: 'video.play', defaultMessage: 'Play' },
  pause: { id: 'video.pause', defaultMessage: 'Pause' },
  mute: { id: 'video.mute', defaultMessage: 'Mute sound' },
  unmute: { id: 'video.unmute', defaultMessage: 'Unmute sound' },
});

export default @injectIntl
class Audio extends React.PureComponent {

  static propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string,
    duration: PropTypes.number,
    peaks: PropTypes.arrayOf(PropTypes.number),
    height: PropTypes.number,
    preload: PropTypes.bool,
    editable: PropTypes.bool,
    intl: PropTypes.object.isRequired,
  };

  state = {
    currentTime: 0,
    duration: null,
    paused: true,
    muted: false,
    volume: 0.5,
  };

  // hard coded in components.scss
  // any way to get ::before values programatically?

  volWidth = 50;

  volOffset = 70;

  volHandleOffset = v => {
    const offset = v * this.volWidth + this.volOffset;
    return (offset > 110) ? 110 : offset;
  }

  setVolumeRef = c => {
    this.volume = c;
  }

  setWaveformRef = c => {
    this.waveform = c;
  }

  componentDidMount () {
    if (this.waveform) {
      this._updateWaveform();
    }
  }

  componentDidUpdate (prevProps) {
    if (this.waveform && prevProps.src !== this.props.src) {
      this._updateWaveform();
    }
  }

  componentWillUnmount () {
    if (this.wavesurfer) {
      this.wavesurfer.destroy();
      this.wavesurfer = null;
    }
  }

  _updateWaveform () {
    const { src, height, duration, peaks, preload } = this.props;

    const progressColor = window.getComputedStyle(document.querySelector('.audio-player__progress-placeholder')).getPropertyValue('background-color');
    const waveColor     = window.getComputedStyle(document.querySelector('.audio-player__wave-placeholder')).getPropertyValue('background-color');

    if (this.wavesurfer) {
      this.wavesurfer.destroy();
      this.loaded = false;
    }

    const wavesurfer = WaveSurfer.create({
      container: this.waveform,
      height,
      barWidth: 3,
      cursorWidth: 0,
      progressColor,
      waveColor,
      backend: 'MediaElement',
      interact: preload,
    });

    wavesurfer.setVolume(this.state.volume);

    if (preload) {
      wavesurfer.load(src);
      this.loaded = true;
    } else {
      wavesurfer.load(src, peaks, 'none', duration);
      this.loaded = false;
    }

    wavesurfer.on('ready', () => this.setState({ duration: Math.floor(wavesurfer.getDuration()) }));
    wavesurfer.on('audioprocess', () => this.setState({ currentTime: Math.floor(wavesurfer.getCurrentTime()) }));
    wavesurfer.on('pause', () => this.setState({ paused: true }));
    wavesurfer.on('play', () => this.setState({ paused: false }));
    wavesurfer.on('volume', volume => this.setState({ volume }));
    wavesurfer.on('mute', muted => this.setState({ muted }));

    this.wavesurfer = wavesurfer;
  }

  togglePlay = () => {
    if (this.state.paused) {
      if (!this.props.preload && !this.loaded) {
        this.wavesurfer.createBackend();
        this.wavesurfer.createPeakCache();
        this.wavesurfer.load(this.props.src);
        this.wavesurfer.toggleInteraction();
        this.loaded = true;
      }

      this.wavesurfer.play();
      this.setState({ paused: false });
    } else {
      this.wavesurfer.pause();
      this.setState({ paused: true });
    }
  }

  toggleMute = () => {
    this.wavesurfer.setMute(!this.state.muted);
  }

  handleVolumeMouseDown = e => {
    document.addEventListener('mousemove', this.handleMouseVolSlide, true);
    document.addEventListener('mouseup', this.handleVolumeMouseUp, true);
    document.addEventListener('touchmove', this.handleMouseVolSlide, true);
    document.addEventListener('touchend', this.handleVolumeMouseUp, true);

    this.handleMouseVolSlide(e);

    e.preventDefault();
    e.stopPropagation();
  }

  handleVolumeMouseUp = () => {
    document.removeEventListener('mousemove', this.handleMouseVolSlide, true);
    document.removeEventListener('mouseup', this.handleVolumeMouseUp, true);
    document.removeEventListener('touchmove', this.handleMouseVolSlide, true);
    document.removeEventListener('touchend', this.handleVolumeMouseUp, true);
  }

  handleMouseVolSlide = throttle(e => {
    const rect = this.volume.getBoundingClientRect();
    const x    = (e.clientX - rect.left) / this.volWidth; // x position within the element.

    if(!isNaN(x)) {
      let slideamt = x;

      if (x > 1) {
        slideamt = 1;
      } else if(x < 0) {
        slideamt = 0;
      }

      this.wavesurfer.setVolume(slideamt);
    }
  }, 60);

  render () {
    const { height, intl, alt, editable } = this.props;
    const { paused, muted, volume, currentTime } = this.state;

    const volumeWidth     = muted ? 0 : volume * this.volWidth;
    const volumeHandleLoc = muted ? this.volHandleOffset(0) : this.volHandleOffset(volume);

    return (
      <div className={classNames('audio-player', { editable })}>
        <div className='audio-player__progress-placeholder' style={{ display: 'none' }} />
        <div className='audio-player__wave-placeholder' style={{ display: 'none' }} />

        <div
          className='audio-player__waveform'
          aria-label={alt}
          title={alt}
          style={{ height }}
          ref={this.setWaveformRef}
        />

        <div className='video-player__controls active'>
          <div className='video-player__buttons-bar'>
            <div className='video-player__buttons left'>
              <button type='button' aria-label={intl.formatMessage(paused ? messages.play : messages.pause)} onClick={this.togglePlay}><Icon id={paused ? 'play' : 'pause'} fixedWidth /></button>
              <button type='button' aria-label={intl.formatMessage(muted ? messages.unmute : messages.mute)} onClick={this.toggleMute}><Icon id={muted ? 'volume-off' : 'volume-up'} fixedWidth /></button>

              <div className='video-player__volume' onMouseDown={this.handleVolumeMouseDown} ref={this.setVolumeRef}>
                <div className='video-player__volume__current' style={{ width: `${volumeWidth}px` }} />

                <span
                  className={classNames('video-player__volume__handle')}
                  tabIndex='0'
                  style={{ left: `${volumeHandleLoc}px` }}
                />
              </div>

              <span>
                <span className='video-player__time-current'>{formatTime(currentTime)}</span>
                <span className='video-player__time-sep'>/</span>
                <span className='video-player__time-total'>{formatTime(this.state.duration || Math.floor(this.props.duration))}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

}
