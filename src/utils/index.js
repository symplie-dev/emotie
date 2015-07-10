var Utils = {
  copyToClipboard: function (domNode) {
    var range = document.createRange(),
        selection = window.getSelection();
    
    range.selectNode(domNode);
    selection.removeAllRanges();
    selection.addRange(range);
    
    document.execCommand('Copy');
    selection.removeAllRanges();
  }
};

module.exports = Utils;