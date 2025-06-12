!function () {
    'use strict';
    console.log('test import script loaded : ' + document.readyState);
    var moAddElementScript = e => {
        let t = document.getElementsByTagName("script")[0];
        t ? t.parentNode.insertBefore(e, t) : document.head.appendChild(e)
    },
        c = t => {
            let n = document.createElement("script");
            n.type = "text/javascript",
                n.async = !0,
                n.src = "https://lamduthach.github.io/dom/test-init.js",
                moAddElementScript(n)
        }
        (function () {
            c();
        })();
}();