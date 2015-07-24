var React         = require('react'),
    HeaderBtn     = require('./header-btn'),
    SearchInput   = require('./search-input'),
    ModalActions  = require('../../actions/modal'),
    EmoticonDetailsModal = require('../modal/emoticon-details'),
    SettingsModal = require('../modal/settings'),
    Header;

Header = React.createClass({
  showNewEmoticonDetailsModal: function () {
    React.render(<EmoticonDetailsModal newEmotie={true} />, document.getElementById('emoticonDetailsModalContainer'));
  },
  
  showSettingsModal: function () {
    React.render(<SettingsModal />, document.getElementById('settingsModalContainer'));
  },
  
  render: function () {    
    return (
      <div className='header'>
        <HeaderBtn icon='gear' tooltip='settings' handleClick={ this.showSettingsModal } />
        <SearchInput />
        <HeaderBtn icon='plus' tooltip='new' handleClick={ this.showNewEmoticonDetailsModal }/>
      </div>
    );
  }
});

module.exports = Header;