(function () {
        var preInit = function () {
            console.log("preInit " + new Date().toUTCString());
        },
        init = () => {
            console.log("init " + new Date().toUTCString());
        };
    (function () {
        preInit();
        console.log('test-init ' + document.readyState);
        if ("loading"===document.readyState) {
            window.addEventListener("DOMContentLoaded",init,!1);
        } else {
            init();
        }
    }());
}).call(this);