var React    = require('react'),
    Emoticon = require('../emoticon'),
    Page;

Page = React.createClass({
    propTypes: {
        items: React.PropTypes.array
    },
    
    getDefaultProps: function () {
        items: []
    },
    
    render: function () {
        var emoticons = [];
        
        this.props.items.forEach(function (item, index) {
            emoticons.push(<Emoticon name={item.name} text={item.text} key={index} />);
        });
        
        return (
            <div className='page'>
                {emoticons}
            </div>
        );
    }
});

module.exports = Page;