var React      = require('react'),
    cx         = require('classnames'),
    ToastStore = require('../../stores/toast'),
    Toast;

Toast = React.createClass({
  getInitialState: function () {
    return {
      isVisible: ToastStore.getIsVisible(),
      text: ToastStore.getText()
    };
  },
  
  componentDidMount: function () {
    ToastStore.addChangeListener(this.handleToastChange);
  },

  componentWillUnmount: function () {
    ToastStore.removeChangeListener(this.handleToastChange);
  },
  
  handleToastChange: function () {
    this.setState({
      isVisible: ToastStore.getIsVisible(),
      text: ToastStore.getText()
    });
  },
  
  render: function () {
    var outerClasses = cx({
      'toast-notification-outer': true,
      'toast': this.state.isVisible
    });
    
    return (
      <div className={outerClasses}>
        <div className='toast-notification-middle'>
          <div className='toast-notification'>
            {this.state.text}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Toast;