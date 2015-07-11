
var React          = require('react'),
    PaginaterStore = require('../../stores/paginater'),
    Page           = require('./page'),
    PaginaterCtrls = require('./paginater-ctrls'),
    Paginater;

Paginater = React.createClass({
  
  getInitialState: function () {
    return {
      resultsPerPage: PaginaterStore.getResultsPerPage(),
      pageIndex: PaginaterStore.getPageIndex(),
      emoticons: PaginaterStore.getEmoticons()
    };
  },
  
  componentDidMount: function () {
    PaginaterStore.addChangeListener(this.handlePaginaterChange);
  },

  componentWillUnmount: function () {
    PaginaterStore.removeChangeListener(this.handlePaginaterChange);
  },
  
  handlePaginaterChange: function () {
    this.setState({
      resultsPerPage: PaginaterStore.getResultsPerPage(),
      pageIndex: PaginaterStore.getPageIndex(),
      emoticons: PaginaterStore.getEmoticons()
    });
  },
  
  render: function() {
    var numPages = Math.ceil(this.state.emoticons.length / this.state.resultsPerPage),
        pages    = [],
        style    = {},
        i;
    
    style.width = (numPages * 300) + 'px';
    style.left = (-this.state.pageIndex * 300) + 'px';
    
    for (i = 0; i < this.state.emoticons.length; ) {
      pages.push(<Page items={this.state.emoticons.slice(i, i + this.state.resultsPerPage)} key={i} />);
      i += this.state.resultsPerPage;
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