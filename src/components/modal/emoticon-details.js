var React = require('react'),
    cx    = require('classnames'),
    $     = require('jquery'),
    Dao              = require('../../database'),
    ModalActions     = require('../../actions/modal'),
    ModalStore       = require('../../stores/modal'),
    PaginaterActions = require('../../actions/paginater'),
    ModalCtrls       = require('./modal-ctrls'),
    ToastActions     = require('../../actions/toast'),
    EmoticonDetails;

EmoticonDetails = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
    initialName: React.PropTypes.string,
    initialEmoticonText: React.PropTypes.string,
    newEmotie: React.PropTypes.bool
  },
  
  getDefaultProps: function () {
    return {
      title: 'Emotie Details',
      initialName: '',
      initialEmoticonText: '',
      newEmotie: true
    }
  },
  
  getInitialState: function () {
    return {
      name: this.props.initialName,
      emoticonText: this.props.initialEmoticonText,
      isVisible: false,
      animating: false,
      showUniqueWarning: false
    };
  },
  
  componentDidMount: function () {
    ModalStore.addChangeListener(this.handleModalChange);
  },

  componentWillUnmount: function () {
    ModalStore.removeChangeListener(this.handleModalChange);
  },
  
  handleModalChange: function () {
    this.setState({
      isVisible: ModalStore.getIsEmoticonDetailsVisible(),
      animating: ModalStore.getIsEmoticonDetailsAnimated()
    });
  },
  
  remove: function () {
    this.setState({
      showUniqueWarning: false,
      name: '',
      emoticonText: ''
    });
    
    $('.emoticon-details-input').val('');
    
    $('.modal-outer').removeClass('fade-in-down').addClass('fade-out-up');
    
    setTimeout(function () {
      React.unmountComponentAtNode(document.getElementById('emoticonDetailsModalContainer'));
    }, 400);
  },
  
  handleCancel: function () {
    this.remove();
  },
  
  saveNew: function () {
    var self = this;
    
    if (this.state.name.length > 0 && this.state.emoticonText.length > 0) {
      Dao.addEmoticon({ name: this.state.name, text: this.state.emoticonText }).then(function () {
        PaginaterActions.updateEmoticons();
        self.remove();
      }).catch(function () {
        self.setState({
          showUniqueWarning: true
        });
        
        $('.modal').addClass('shake');
        setTimeout(function () {
          $('.modal').removeClass('shake');
        }, 1000);
      });
    } else {
      $('.modal').addClass('shake');
      setTimeout(function () {
        $('.modal').removeClass('shake');
      }, 1000);
    }
  },
  
  saveUpdate: function () {
    
  },
  
  handleNameChange: function (evt) {
    this.setState({
      name: evt.target.value
    });
  },
  
  handleEmoticonTextChange: function (evt) {
    this.setState({
      emoticonText: evt.target.value
    });
  },
  
  render: function () {
    var dangerZoneClasses = cx({
          'danger-zone': true,
          'show': !this.props.newEmotie
        }),
        dangerMsgClasses = cx({
          'danger-msg': true,
          'show': this.state.showUniqueWarning
        }),
        handleSave = (this.props.newEmotie) ? this.saveNew : this.saveUpdate;
    
    return (
      <div className='modal-wrapper'>
        <div className='modal-outer fade-in-down animated'>
          <div className='modal-middle'>
            <div className='emoticon-detail-modal modal animated-long'>
              
              <h1>{ this.props.title }</h1>
              
              <div className='modal-body'>
                <div className='modal-body-row'>
                  <div className={dangerMsgClasses}>Emoticon name must be unique</div>
                  <input type='text' className='emoticon-details-input' value={ this.state.name }
                    onChange={ this.handleNameChange } placeholder='Emoticon Name' />
                </div>
                <div className='modal-body-row'>
                  <input type='text' className='emoticon-details-input' value={ this.state.emoticonText }
                    onChange={ this.handleEmoticonTextChange } placeholder='Emoticon Text' />
                </div>
              </div>
              
              <ModalCtrls handleClickLeftBtn={ this.handleCancel } handleClickRightBtn={ handleSave } />
              
              <div className={ dangerZoneClasses }>
                <h1>Danger Zone</h1>
                <div className='modal-body'>
                  <div className='modal-body-row'>
                    <div className='danger-input-wrapper'>
                      <input type='text' className='danger-input delete-input' placeholder='Type emoticon name' />
                    </div>
                    <button className='danger-btn delete-btn'>delete</button>
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

module.exports = EmoticonDetails;