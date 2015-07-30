var React            = require('react'),
    cx               = require('classnames'),
    ModalActions     = require('../../actions/modal'),
    PaginaterActions = require('../../actions/paginater'),
    SettingsStore    = require('../../stores/settings'),
    ModalCtrls       = require('./modal-ctrls'),
    $                = require('jquery'),
    assign           = require('object-assign'),
    SettingsModal;

SettingsModal = React.createClass({
  tmpSettings: {},
  
  getInitialState: function () {
    return {
      settings:    SettingsStore.getSettings(),
      tmpSettings:  assign({}, SettingsStore.getSettings())
    }
  },
  
  getDefaultProps: function () {
    return {
      defaultTweet: 'Copy%20fun%20emoticon%20faces%20quick%2C%20or%20don%27t%20%C2%AF%5C_(%E3%83%84)_%2F%C2%AF%3A%20https%3A%2F%2Fgoo.gl%2FBvBKJZ%20%23Emotie'
    }
  },
  
  componentDidMount: function () {
    SettingsStore.addChangeListener(this.handleModalChange);
  },

  componentWillUnmount: function () {
    SettingsStore.removeChangeListener(this.handleModalChange);
  },
  
  handleModalChange: function () {
    this.setState({
      settings:    SettingsStore.getSettings(),
      tmpSettings: assign({}, SettingsStore.getSettings())
    });
  },
  
  remove: function () {
    $('.modal-outer').removeClass('fade-in-down').addClass('fade-out-up');
    
    setTimeout(function () {
      React.unmountComponentAtNode(document.getElementById('settingsModalContainer'));
    }, 400);
  },
  
  handleShortcutsChange: function (evt) {
    var currSettings = this.state.tmpSettings;
    
    currSettings.shortcuts = evt.target.checked;
    
    this.setState({ tmpSettings: currSettings });
  },
  
  handleResultsPerPageChange: function (evt) {
    var currSettings = this.state.tmpSettings;
    
    currSettings.resultsPerPage = parseInt(evt.target.value);
    
    this.setState({ tmpSettings: this.state.tmpSettings });
  },
  
  handleCancel: function () {
    this.setState({
      tmpSettings: assign({}, this.state.settings)
    });
    
    this.remove();
  },
  
  handleSave: function () {
    ModalActions.setSettings(this.state.tmpSettings);
    PaginaterActions.goToPage(0);
    this.remove();
  },
  
  handleReset: function () {
    var resetVal = $('.reset-input').val();
    
    if (resetVal.toLowerCase() === 'reset') {
      PaginaterActions.resetEmoticons();
      $('.reset-input').val('');
      PaginaterActions.goToPage(0);
      this.remove();
    } else {
      $('.modal').addClass('shake');
      setTimeout(function () {
        $('.modal').removeClass('shake');
      }, 1000);
    }
  },
    
  render: function () {    
    return (
      <div className='modal-wrapper'>
        <div className='modal-outer fade-in-down animated'>
          <div className='modal-middle'>
            <div className='emoticon-detail-modal modal animated-long'>
              <div className='modal-inner'>
                <h1>Settings</h1>
                <div className='modal-body'>
                  <div className='modal-body-row'>
                    <div className='modal-body-lbl'>Emoticons Per Page</div>
                    <div className='modal-body-val'>
                      <select value={ this.state.tmpSettings.resultsPerPage } onChange={ this.handleResultsPerPageChange }>
                        <option value='6'>6</option>
                        <option value='8'>8</option>
                        <option value='10'>10</option>
                        <option value='12'>12</option>
                      </select>
                    </div>
                  </div>
                  <div className='modal-body-row'>
                    <div className='modal-body-lbl'>Space used</div>
                    <div className='modal-body-val'>
                      { this.state.settings.stats.syncBytesInUse + ' / ' + this.state.settings.stats.syncQuota + ' bytes' }
                    </div>
                  </div>
                  <div className='modal-body-row'>
                    <div className='modal-body-lbl'>Share ( ͡°( ͡° ͜ʖ( ͡° ͜ʖ ͡°)ʖ ͡°) ͡°)</div>
                    <div className='modal-body-val'>
                      <a className='twitter-share-button' href={'https://twitter.com/intent/tweet?text=' + this.props.defaultTweet}>
                        <i></i>
                        <span className='label'>Tweet</span>
                      </a>
                    </div>
                  </div>
                </div>
                
                <ModalCtrls handleClickLeftBtn={ this.handleCancel } handleClickRightBtn={ this.handleSave } />
              </div>
              
              <div className='modal-inner'>
                <div className='danger-zone show'>
                  <h1>Danger Zone</h1>
                  <div className='modal-body'>
                    <div className='modal-body-row'>
                      <div className='modal-body-desc'>
                        Reset your emoticon library to the default list. This <em>cannot</em> be undone.
                      </div>
                      <div className='danger-input-wrapper'>
                        <input type='text' className='danger-input reset-input' placeholder='Type reset' />
                      </div>
                      <button className='danger-btn reset-btn' onClick={ this.handleReset }>reset</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = SettingsModal;
