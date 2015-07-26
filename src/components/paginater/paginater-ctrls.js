var React              = require('react'),
    $                  = require('jquery'),
    PaginaterCtrlsBtn  = require('./paginater-ctrls-btn'),
    PaginaterConstants = require('../../constants/paginater'),
    PaginaterActions   = require('../../actions/paginater'),
    PaginaterCtrls;

PaginaterCtrls = React.createClass({
  propTypes: {
    numPages: React.PropTypes.number,
    pageIndex: React.PropTypes.number
  },
  
  getDefaultProps:function () {
    return {
      numPages: 1,
      pageIndex: 0
    }
  },
  
  componentDidMount: function () {
    var self = this;
    
    // Listen for arrow key navigation on the body element
    $('body').on('keyup', function (evt) {
      self.handleArrowNav(evt);
    });
  },
  
  handleArrowNav: function (evt) {
    switch(evt.keyCode) {
      // Decrement active page and wrap to end
      case PaginaterConstants.KeyCodes.LEFT_ARROW:
        if (this.props.pageIndex - 1 < 0) {
          PaginaterActions.goToPage(this.props.numPages - 1);
        } else {
          PaginaterActions.goToPage(this.props.pageIndex - 1);
        }
        break;
      // Go to the first page
      case PaginaterConstants.KeyCodes.UP_ARROW:
        PaginaterActions.goToPage(0);
        break;
      // Increment active page and wrap to beginning
      case PaginaterConstants.KeyCodes.RIGHT_ARROW:
        if (this.props.pageIndex + 1 >= this.props.numPages) {
          PaginaterActions.goToPage(0);
        } else {
          PaginaterActions.goToPage(this.props.pageIndex + 1);
        }
        break;
      // Go to the last page
      case PaginaterConstants.KeyCodes.DOWN_ARROW:
        PaginaterActions.goToPage(this.props.numPages - 1);
        break;
      default:
        break;
    }
  },
  
  render: function () {
    var btns = [],
        i;
    
    for (i = 0; i < this.props.numPages; i++) {
      if (i == this.props.pageIndex) {
        btns.push(<PaginaterCtrlsBtn isActive={true} pageIndex={i} key={i} />);
      } else {
        btns.push(<PaginaterCtrlsBtn pageIndex={i} key={i} />);
      }
    }
    
    return (
      <div className='paginater-ctrls'>
        <div className='paginater-ctrls-btns'>
          {btns}
        </div>
      </div>
    );
  }
});

module.exports = PaginaterCtrls;