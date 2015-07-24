var React                = require('react'),
    ToastActions         = require('../../actions/toast'),
    Utils                = require('../../utils'),
    EmoticonDetailsModal = require('../modal/emoticon-details'),
    Emoticon;

Emoticon = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    text: React.PropTypes.string.isRequired
  },
  
  handleClick: function (evt) {
    if (evt.ctrlKey) {
      this.showEmoticonDetailsModal();
    } else {
      Utils.copyToClipboard(evt.target);
      ToastActions.toast('Copied!');
    }
  },
  
  showEmoticonDetailsModal: function (evt) {
    React.render(<EmoticonDetailsModal title='Update Emotie' newEmotie={false}
      initialName={this.props.name} initialEmoticonText={this.props.text}/>,
      document.getElementById('emoticonDetailsModalContainer'));
  },
  
  render: function () {
    return (
      <div className='emoticon'>
        <div className='emoticon-inner' title={this.props.name} onClick={this.handleClick}>
          {this.props.text}
        </div>
      </div>
    );
  }
});

module.exports = Emoticon;