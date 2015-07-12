
var React          = require('react'),
    PaginaterStore = require('../../stores/paginater'),
    ModalStore     = require('../../stores/modal'),
    Page           = require('./page'),
    PaginaterCtrls = require('./paginater-ctrls'),
    Paginater;

Paginater = React.createClass({
  
  getInitialState: function () {
    return {
      resultsPerPage: ModalStore.getSettings().resultsPerPage || 10,
      pageIndex: PaginaterStore.getPageIndex(),
      emoticons: PaginaterStore.getEmoticons()
    };
  },
  
  componentDidMount: function () {
    PaginaterStore.addChangeListener(this.handlePaginaterChange);
    ModalStore.addChangeListener(this.handleModalChange);
  },

  componentWillUnmount: function () {
    PaginaterStore.removeChangeListener(this.handlePaginaterChange);
    ModalStore.removeChangeListener(this.handleModalChange);
  },
  
  handlePaginaterChange: function () {
    this.setState({
      pageIndex: PaginaterStore.getPageIndex(),
      emoticons: PaginaterStore.getEmoticons()
    });
  },
  
  handleModalChange: function () {
    this.setState({
      resultsPerPage: ModalStore.getSettings().resultsPerPage,
    });
  },
  
  render: function() {
    var numPages = Math.ceil(this.state.emoticons.length / this.state.resultsPerPage),
        pages    = [],
        style    = {},
        key      = 0,
        i;
    
    style.width = (numPages * 300) + 'px';
    style.left = (-this.state.pageIndex * 300) + 'px';
    
    for (i = 0; i < this.state.emoticons.length; ) {
      pages.push(<Page items={this.state.emoticons.slice(i, i + this.state.resultsPerPage)} key={key} />);
      i += this.state.resultsPerPage;
      key++;
    }
    
    return (
      <div className='paginater'>
        <div className='pages-wrapper'>
          <div className='pages' style={style}>
            {pages}
          </div>
        </div>
        <PaginaterCtrls numPages={numPages} pageIndex={this.state.pageIndex} />
      </div>
    );
  }
});

module.exports = Paginater;