var React = require('react'),
    Header;

Header = React.createClass({
  render: function () {
    return (
      <div className='header'>
        <span className='octicon octicon-gear'></span>
      </div>
    );
  }
});

module.exports = Header;