var React             = require('react'),
    PaginaterCtrlsBtn = require('./paginater-ctrls-btn'),
    PaginaterCtrls;

PaginaterCtrls = React.createClass({
    propTypes: {
        numPages: React.PropTypes.number,
        pageIndex: React.PropTypes.number
    },
    
    getDefaultProps:function () {
        return {
            numPages: 1,
            activePageIndex: 0
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