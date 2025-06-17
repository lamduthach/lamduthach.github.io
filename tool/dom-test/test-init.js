(function () {
        var preInit = function () {
            console.log("preInit");
        },
        init = () => {
            console.log("init");
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