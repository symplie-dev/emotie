var React                = require('react'),
    Header               = require('./components/header'),
    Paginater            = require('./components/paginater'),
    Toast                = require('./components/toast'),
    SettingsModal        = require('./components/modal/settings'),
    EmoticonDetailsModal = require('./components/modal/emoticon-details');

React.render(<Header />, document.getElementById('headerContainer'));
React.render(<Paginater />, document.getElementById('paginaterContainer'));
React.render(<Toast />, document.getElementById('toastContainer'));
