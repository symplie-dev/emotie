var React            = require('react'),
    PaginaterActions = require('../../actions/paginater'),
    PaginaterCtrlsBtn;

PaginaterCtrlsBtn = React.createClass({
    propTypes: {
        isActive: React.PropTypes.bool,
        pageIndex: React.PropTypes.number.isRequired
    },
    
    getDefaultProps:function () {
        return {
            isActive: false
        }
    },
    
    handleClick: function () {
        PaginaterActions.goToPage(this.props.pageIndex);
    },
    
    render: function () {
        return (
            <div className='paginater-btn-wrapper'>
            <div className={'paginater-ctrls-btn ' +
                ((this.props.isActive) ? 'active' : '')} onClick={this.handleClick}>
            </div>
            </div>
        );
    }
});

module.exports = PaginaterCtrlsBtn;