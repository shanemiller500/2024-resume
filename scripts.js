(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date(); a = s.createElement(o),
        m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-91612823-1', 'auto');
ga('send', 'pageview');

var trackOutboundLink = function (url) {
    ga('send', 'event', 'outbound', 'click', url, {
        'transport': 'beacon',
        'hitCallback': function () { window.open(url); }
    });
}

window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'UA-91612823-1');


  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-CC1SCRJJSW');

//   jQuery(document).ready(function(){
//     $('h1').mousemove(function(e){
//       var rXP = (e.pageX - this.offsetLeft-$(this).width()/2);
//       var rYP = (e.pageY - this.offsetTop-$(this).height()/2);
//       $('h1').css('text-shadow', +rYP/10+'px '+rXP/80+'px rgba(255, 0, 0, 1), '+rYP/8+'px '+rXP/60+'px rgba(255, 255, 0, 1), '+rXP/70+'px '+rYP/12+'px rgba(255, 165, 0, 1)');
//     });
//  });

//  jQuery(document).ready(function(){
//     $('h1').on("touchmove",function(e){
//       var rXP = (e.pageX - this.offsetLeft-$(this).width()/2);
//       var rYP = (e.pageY - this.offsetTop-$(this).height()/2);
//       $('h1').css('text-shadow', +rYP/10+'px '+rXP/80+'px rgba(255, 255, 0, 1), '+rYP/8+'px '+rXP/60+'px rgba(255, 20, 147, 1), '+rXP/70+'px '+rYP/12+'px rgba(41, 206, 255, 1)');
//     });
//  });

$(document).ready(function() {
    // Add hover effect class
    $('.skills p').hover(
        function() {
            $(this).addClass('animate__animated animate__pulse');
        },
        function() {
            $(this).removeClass('animate__animated animate__pulse');
        }
    );
});
 

$(document).ready(function() {
    // Add pulse effect class on touchstart for touch devices
    $('.skills p').on('touchstart', function() {
        $(this).addClass('animate__animated animate__pulse pulse-effect');
    });

    // Remove pulse effect class on touchend for touch devices
    $('.skills p').on('touchend', function() {
        $(this).removeClass('animate__animated animate__pulse pulse-effect');
    });
});