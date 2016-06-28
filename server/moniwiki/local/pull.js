/**
 * check and show link to pull remote wiki page
 * @author  wkpark at gmail.com
 * @since   2013/12/21
 * @license GPLv2
 */

(function() {
function check_pull() {
    var href = location + '';
    if (href.match(/action=/)) return;

    // check query prefix
    if (href.match(/\?/)) href+= '&';
    else href+= '?';
    href+= 'action=pull';

    var ret = HTTPGet(href + '&check=1');
    // 304, 404 etc.
    if (ret != '200') return;

    // this page is updated.
    // show link to sync remote page
    var div = document.createElement('div');
    var a = document.createElement('a');
    var text = document.createTextNode('pull');
    div.setAttribute('class','pull-msg');

    a.href = href;
    a.appendChild(text);
    div.appendChild(a);
    //document.body.appendChild(div);
    document.body.insertBefore(div, document.body.childNodes[0]);
}

if (window.addEventListener) window.addEventListener("load",check_pull,false);
else if (window.attachEvent) window.attachEvent("onload",check_pull);
})();

// vim:et:sts=4:sw=4:
