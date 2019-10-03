import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import Audio from 'mastodon/features/audio';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { FormattedMessage } from 'react-intl';
import { previewState } from './video_modal';
import classNames from 'classnames';
import Icon from 'mastodon/components/icon';

export default class AudioModal extends ImmutablePureComponent {

  static propTypes = {
    media: ImmutablePropTypes.map.isRequired,
    status: ImmutablePropTypes.map,
    onClose: PropTypes.func.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object,
  };

  componentDidMount () {
    if (this.context.router) {
      const history = this.context.router.history;

      history.push(history.location.pathname, previewState);

      this.unlistenHistory = history.listen(() => {
        this.props.onClose();
      });
    }
  }

  componentWillUnmount () {
    if (this.context.router) {
      this.unlistenHistory();

      if (this.context.router.history.location.state === previewState) {
        this.context.router.history.goBack();
      }
    }
  }

  handleStatusClick = e => {
    if (e.button === 0 && !(e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      this.context.router.history.push(`/statuses/${this.props.status.get('id')}`);
    }
  }

  render () {
    const { media, status } = this.props;

    return (
      <div className='modal-root__modal audio-modal'>
        <div className='audio-modal__container'>
          <Audio
            src={media.get('url')}
            alt={media.get('description')}
            duration={media.getIn(['meta', 'original', 'duration'], 0)}
            height={135}
            preload
          />
        </div>

        {status && (
          <div className={classNames('media-modal__meta')}>
            <a href={status.get('url')} onClick={this.handleStatusClick}><Icon id='comments' /> <FormattedMessage id='lightbox.view_context' defaultMessage='View context' /></a>
          </div>
        )}
      </div>
    );
  }

}
