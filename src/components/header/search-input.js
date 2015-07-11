var React = require('react'),
    cx    = require('classnames'),
    SearchInput;

SearchInput = React.createClass({
  render: function () {    
    return (
      <div className='search-input'>
        <input type='text' placeholder='Search' />
      </div>
    );
  }
});

module.exports = SearchInput;