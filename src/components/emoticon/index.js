var React        = require('react'),
    ToastActions = require('../../actions/toast'),
    Utils        = require('../../utils'),
    Emoticon;

Emoticon = React.createClass({
    propTypes: {
        name: React.PropTypes.string.isRequired,
        text: React.PropTypes.string.isRequired
    },
    
    handleClick: function (evt) {
      Utils.copyToClipboard(evt.target);
      ToastActions.toast('Copied!');
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