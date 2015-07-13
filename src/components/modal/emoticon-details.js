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
    initialEmoticonText: React.PropTypes.string
  },
  
  getDefaultProps: function () {
    return {
      initialName: '',
      initialEmoticonText: ''
    }
  },
  
  getInitialState: function () {
    return {
      title: 'New Emotie',
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
  
  handleCancel: function () {
    this.setState({
      showUniqueWarning: false,
      name: '',
      emoticonText: ''
    });
    
    $('.emoticon-details-input').val('');
    
    ModalActions.hideEmoticonDetailsModal();
  },
  
  handleSave: function () {
    var self = this;
    
    if (this.state.name.length > 0 && this.state.emoticonText.length > 0) {
      Dao.addEmoticon({ name: this.state.name, text: this.state.emoticonText }).then(function () {
        PaginaterActions.updateEmoticons();
        ModalActions.hideEmoticonDetailsModal();
        self.setState({
          showUniqueWarning: false,
          name: '',
          emoticonText: ''
        });
        $('.emoticon-details-input').val('');
      }).catch(function () {
        self.setState({
          showUniqueWarning: true
        });
      });
    }
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
    var outerClasses = cx({
          'modal-outer': true,
          'show': this.state.isVisible,
          'hide': !this.state.isVisible,
          'animating': this.state.animating
        }),
        innerClasses = cx({
          'emoticon-detail-modal': true,
          'modal': true,
          'show': this.state.isVisible,
          'hide': !this.state.isVisible
        }),
        warningClasses = cx({
          'warning-lbl': true,
          'hide': !this.state.showUniqueWarning
        });
        
    return (
      <div className={outerClasses}>
        <div className='modal-middle'>
          <div className={innerClasses}>
            <h1>{ this.state.title }</h1>
            <div className='modal-body'>
              <div className='modal-input-row'>
                <div className={warningClasses}>Name must be unique</div>
                <input type='text' className='emoticon-details-input'
                  onChange={ this.handleNameChange } placeholder='Emoticon Name' />
              </div>
              <div className='modal-input-row'>
                <input type='text' className='emoticon-details-input'
                  onChange={ this.handleEmoticonTextChange } placeholder='Emoticon Text' />
              </div>
            </div>
            <ModalCtrls handleClickLeftBtn={ this.handleCancel } handleClickRightBtn={ this.handleSave } />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = EmoticonDetails;