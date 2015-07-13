var React            = require('react'),
    cx               = require('classnames'),
    ModalActions     = require('../../actions/modal'),
    PaginaterActions = require('../../actions/paginater'),
    ModalStore       = require('../../stores/modal'),
    ModalCtrls       = require('./modal-ctrls'),
    $                = require('jquery'),
    assign           = require('object-assign'),
    SettingsModal;

SettingsModal = React.createClass({
  tmpSettings: {},
  
  getInitialState: function () {
    return {
      isVisible:   ModalStore.getIsSettingsModalVisible(),
      animating:   false,
      settings:    ModalStore.getSettings(),
      tmpSettings: ModalStore.getSettings()
    }
  },
  
  componentDidMount: function () {
    ModalStore.addChangeListener(this.handleModalChange);
    console.log('init settings!')
    ModalStore.initSettings();
  },

  componentWillUnmount: function () {
    ModalStore.removeChangeListener(this.handleModalChange);
  },
  
  handleModalChange: function () {
    console.log('state changed');
    this.setState({
      isVisible:   ModalStore.getIsSettingsModalVisible(),
      animating:   ModalStore.getIsSettingsModalAnimated(),
      settings:    ModalStore.getSettings(),
      tmpSettings: assign({}, ModalStore.getSettings())
    });
  },
  
  handleResultsPerPageChange: function (evt) {
    var currSettings = this.state.tmpSettings;
    
    currSettings.resultsPerPage = parseInt(evt.target.value);
    
    this.setState({ tmpSettings: this.state.tmpSettings });
  },
  
  handleCancel: function () {
    ModalActions.hideSettingsModal();
    
    this.setState({
      tmpSettings: assign({}, this.state.settings)
    });
  },
  
  handleSave: function () {
    ModalActions.setSettings(this.state.tmpSettings);
    ModalActions.hideSettingsModal();
    PaginaterActions.goToPage(0);
  },
  
  handleReset: function () {
    var resetVal = $('.reset-input').val();
    
    if (resetVal === 'reset') {
      PaginaterActions.resetEmoticons();
      $('.reset-input').val('');
      ModalActions.hideSettingsModal();
      PaginaterActions.goToPage(0);
    } else {
      $('.settings-modal').removeClass('shake-reset').addClass('shake-reset');
    }
  },
    
  render: function () {
    var outerClasses = cx({
          'modal-outer': true,
          'show': this.state.isVisible,
          'hide': !this.state.isVisible,
          'animating': this.state.animating
        }),
        innerClasses = cx({
          'settings-modal': true,
          'modal': true,
          'show': this.state.isVisible,
          'hide': !this.state.isVisible
        });
    
    return (
      <div className={outerClasses}>
        <div className='modal-middle'>
          <div className={innerClasses}>
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
              <div className='modal-body-lbl'>Reset emoticons to default emoticon set</div>
              <div className='warning-lbl'>Warning reset cannot be undone</div>
              <input type='text' className='warning-input reset-input' placeholder='type reset' />
              <button className='reset-btn' onClick={ this.handleReset }>reset</button>
            </div>
            </div>
            <ModalCtrls handleClickLeftBtn={ this.handleCancel } handleClickRightBtn={ this.handleSave } />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = SettingsModal;