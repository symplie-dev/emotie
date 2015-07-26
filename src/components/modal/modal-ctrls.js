var React = require('react'),
    cx    = require('classnames'),
    ModalCtrls;

ModalCtrls = React.createClass({
  propTypes: {
    leftBtnTxt:          React.PropTypes.string,
    rightBtnTxt:         React.PropTypes.string,
    leftBtnIsVisible:    React.PropTypes.bool,
    rightBtnIsVisible:   React.PropTypes.bool,
    handleClickLeftBtn:  React.PropTypes.func,
    handleClickRightBtn: React.PropTypes.func
  },
  
  getDefaultProps: function () {
    return {
      leftBtnTxt:          'cancel',
      rightBtnTxt:         'save',
      leftBtnIsVisible:    true,
      rightBtnIsVisible:   true,
    }
  },
  
  render: function () {
    var leftBtnClasses = cx({
          'modal-ctrls-btn': true,
          'link-btn': true,
          'hide': this.props.leftBtnIsVisible
        }),
        rightBtnClasses = cx({
          'modal-ctrls-btn': true,
          'solid-btn': true,
          'hide': this.props.rightBtnIsVisible
        });
        
    return (
      <div className='modal-ctrls'>
        <button className={ leftBtnClasses } onClick={ this.props.handleClickLeftBtn}>
          { this.props.leftBtnTxt }
        </button>
        <button className={ rightBtnClasses } onClick={ this.props.handleClickRightBtn }>
          { this.props.rightBtnTxt }
        </button>
      </div>
    );
  }
});

module.exports = ModalCtrls;