(function () {
  window._gaq = window._gaq || [];
  
  window._gaq.push(['_setAccount', 'UA-60232429-5']);
  window._gaq.push(['_trackPageview']);
  
  (function() {
    console.log('adding lytics')
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
})()