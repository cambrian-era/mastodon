import React, { Component } from 'react';
import { throttle } from 'lodash';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class ScrollableContainer extends Component {

  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
    loadMore: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    offsetThreshold: PropTypes.number,
  }

  static defaultProps = {
    offsetThreshold: 600,
    isLoading: false,
  }

  componentDidMount () {
    this.attachScrollListener();
  }

  attachScrollListener () {
    this.node.addEventListener('scroll', this.handleScroll);
  }

  detachScrollListener () {
    this.node.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = throttle(() => {
    const { scrollTop, scrollHeight, clientHeight } = this.node;
    const offset = scrollHeight - scrollTop - clientHeight;

    if (offset < this.props.offsetThreshold && !this.props.isLoading) {
      this.props.loadMore();
    }
  }, 150, {
    trailing: true,
  });

  setRef = (c) => {
    this.node = c;
  }

  render() {
    return (
      <div
        className={classNames('scrollable', this.props.className)}
        ref={this.setRef}
      >
        { React.Children.map(this.props.children, (child) => {
          return child;
        })}
      </div>
    );
  }

}
