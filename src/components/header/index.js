var React         = require('react'),
    HeaderBtn     = require('./header-btn'),
    SearchInput   = require('./search-input'),
    ModalActions  = require('../../actions/modal'),
    Header;

Header = React.createClass({
  render: function () {    
    return (
      <div className='header'>
        <HeaderBtn icon='gear' tooltip='settings' handleClick={ModalActions.showSettingsModal} />
        <SearchInput />
        <HeaderBtn icon='plus' tooltip='new' />
      </div>
    );
  }
});

module.exports = Header;