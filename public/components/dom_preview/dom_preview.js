import React from 'react';
import _ from 'lodash';
import $ from 'jquery';

export class DomPreview extends React.PureComponent {
  constructor(props) {    /* Note props is passed into the constructor in order to be used */
    super(props);
    this.slowUpdate = _.debounce(this.update, 250);
    this.state = {original: $(`#${props.id}`)};
  }

  shouldComponentUpdate() {
    return false;
  }

  update() {
    var original = this.state.original;
    var thumb = this.state.original.clone();

    //var width = 320;
    //var height = workpad.current.size.height * (width / workpad.current.size.width);

    var height = this.props.height || 100;
    var width = original.width() * (height / original.height());

    $(this.refs.content).html(thumb);

    // Copy canvas data
    var originalCanvas = $('canvas', original);
    var thumbCanvas = $('canvas', thumb);

    _.each(originalCanvas, function (img, i) {
      thumbCanvas[i].getContext('2d').drawImage(img, 0, 0);
    });

    $(this.refs.container).css({
      width: width,
      height: height,
      overflow: 'hidden'
    });

    $(this.refs.content).css({
      transform: `scale(${(width / original.width())})`,
      'transform-origin': 'top left',
      height: original.height(),
      width: original.width(),
    });
  }

  componentDidMount() {
    this.update();

    const observer = new MutationObserver(this.slowUpdate.bind(this));
    // configuration of the observer:
    const config = { attributes: true, childList: true, subtree: true };
    // pass in the target node, as well as the observer options
    observer.observe(this.state.original[0], config);
  }

  componentDidUpdate() {
    this.update();
  }

  render() {
    return (
      <div ref="container" style={{display: 'inline-block'}} className="rework--dom-preview">
        <div ref="content"></div>
      </div>
    );
  }
};
