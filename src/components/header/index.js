var React       = require('react'),
    HeaderBtn   = require('./header-btn'),
    SearchInput = require('./search-input'),
    Header;

Header = React.createClass({
  render: function () {
    return (
      <div className='header'>
        <HeaderBtn icon='gear' tooltip='settings' />
        <SearchInput />
        <HeaderBtn icon='plus' tooltip='new' />
      </div>
    );
  }
});

module.exports = Header;