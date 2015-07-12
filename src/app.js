var React         = require('react'),
    Header        = require('./components/header'),
    Paginater     = require('./components/paginater'),
    Toast         = require('./components/toast'),
    SettingsModal = require('./components/modal/settings');
    
var testList = [{ name: 'Le Face Face', text: '( ͡° ͜ʖ ͡°)', tags: 'le face face, lenny face, happy, smile' }
               ,{ name: 'Oh Well', text: '¯\\_(ツ)_/¯', tags: 'oh well, whaatever' }
               ,{ name: 'Sniper', text: '▄︻̷̿┻̿═━一', tags: 'gun, sniper' }
               ,{ name: 'Group Lenny', text: '( ͡°( ͡° ͜ʖ( ͡° ͜ʖ ͡°)ʖ ͡°) ͡°)', tags: 'group, lenny face' }
               ,{ name: 'Glasses', text: '(▀̿Ĺ̯▀̿ ̿)', tags: 'glasses' }
               ,{ name: 'Over Here', text: '༼ つ ◕_◕ ༽つ', tags: 'over here' }];

React.render(<Header />, document.getElementById('headerContainer'));
React.render(<Paginater />, document.getElementById('paginaterContainer'));
React.render(<Toast />, document.getElementById('toastContainer'));
React.render(<SettingsModal />, document.getElementById('settingsModalContainer'));