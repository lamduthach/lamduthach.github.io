var MierucaHM = function() {
    "use strict";
    var e, t = {
        local_url: window.location.href,
        referrer_url: document.referrer,
        sWs: ("https:" === document.location.protocol ? "wss" : "ws") + "://ntjp.mieru-ca.com/hm?sId=" + window.__fid[0][0],
        HM: {},
        site_id: window.__fid[0][0],
        temp_scroll_pos: 0,
        idl: null,
        iwc: 0,
        ire: 0,
        time_out: !1,
        chkPrevEvent: null,
        temp_x_pos: 0,
        temp_y_pos: 0,
        read_check: "",
        href: "",
        text: "",
        ipa: 0,
        device: (e = navigator.userAgent || navigator.vendor || window.opera,
        /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(e) ? "t" : /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(e) ? "m" : "d")
    }, i = 0, o = 0, n = 0, r = 0, d = 0, l = null, a = MierucaHM.prototype = {
        initWindowElement: function() {
            var e = document.body || {
                scrollTop: 0,
                scrollHeight: 0,
                offsetHeight: 0,
                scrollLeft: 0,
                offsetWidth: 0,
                clientWidth: 0
            }
              , t = document.documentElement || {
                scrollTop: 0,
                clientHeight: 0,
                scrollHeight: 0,
                clientWidth: 0,
                scrollWidth: 0,
                offsetWidth: 0,
                offsetHeight: 0
            };
            d = Math.floor(t.scrollTop || e.scrollTop || window.pageYOffset),
            i = Math.max(e.scrollHeight, e.offsetHeight, t.clientHeight, t.scrollHeight, t.offsetHeight),
            o = Math.max(e.scrollLeft, e.offsetWidth, t.clientWidth, t.scrollWidth, t.offsetWidth),
            r = Math.floor(window.innerWidth || t.clientWidth || e.clientWidth),
            n = Math.floor(window.innerHeight + d > i ? i : window.innerHeight)
        },
        sendPageView: function() {
            if ("WebSocket"in window)
                l = new WebSocket(t.sWs + (t.ire ? "&retry=1" : ""));
            else {
                if (!("MozWebSocket"in window))
                    return;
                l = new MozWebSocket(t.sWs + (t.ire ? "&retry=1" : ""))
            }
            t.iwc = 0,
            a.initWindowElement(),
            l.onopen = function() {
                var e = {
                    type: "p"
                };
                e.sId = t.site_id,
                e.url = t.local_url,
                e.refUrl = t.referrer_url,
                e.d = t.device,
                e.sP = n,
                e.dH = i,
                e.wW = r,
                e.wH = n,
                e.ipa = "ipa",
                e.ua = navigator.userAgent || navigator.vendor || window.opera,
                l.sendMessage(JSON.stringify(e))
            }
            ,
            l.onclose = function(e) {
                t.iwc = 1
            }
            ,
            l.onerror = function(e) {
                0 !== t.ire || window.__hmrid || (t.ire = 1,
                setTimeout(( () => {
                    a.sendPageView()
                }
                ), 500))
            }
            ,
            l.sendMessage = function(e) {
                "" !== e && 0 === t.iwc && l.readyState === l.OPEN && l.send(e)
            }
            ,
            l.onmessage = function(e) {
                "IS_ALLOW_LOAD_POPUP" !== e.data ? e.data.startsWith("refId-") ? window.__hmrid = e.data.split("-")[1] : e.data.startsWith("urlId-") && (window.__hmuid = e.data.split("-")[1]) : a.popupHandle()
            }
            ;
            for (var e = document.querySelectorAll("label,a,input,button,textarea,img,iframe,video"), o = 0; o < e.length; o += 1)
                a.setEventClickListener(e[o]);
            window.addEventListener("scroll", (function() {
                t.time_out || (a.scrollHandle(),
                a.readHandle(),
                a.resetTimeOut())
            }
            )),
            a.resetTimeOut()
        },
        readHandle: function() {
            clearTimeout(t.read_check),
            t.read_check = setTimeout((function() {
                if (a.initWindowElement(),
                0 !== d) {
                    var e = {
                        type: "r"
                    };
                    e.rP = Math.floor(window.innerHeight + d) >= i ? Math.floor(i - window.innerHeight) : Math.floor(d),
                    e.dH = i,
                    e.wW = Math.floor(window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth),
                    e.wH = n,
                    e.d = t.device,
                    l.sendMessage(JSON.stringify(e))
                }
            }
            ), 4e3)
        },
        scrollHandle: function() {
            clearTimeout(t.sChk),
            t.sChk = setTimeout((function() {
                a.initWindowElement();
                var e = Math.floor(document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset || 0) + n;
                if (e > t.temp_scroll_pos) {
                    t.temp_scroll_pos = e;
                    var o = {
                        type: "s"
                    };
                    o.sP = e >= i ? i : e,
                    o.dH = i,
                    o.wW = r,
                    o.wH = n,
                    o.d = t.device,
                    l.sendMessage(JSON.stringify(o))
                }
            }
            ), 300)
        },
        resetTimeOut: function() {
            null !== t.idl && clearTimeout(t.idl),
            t.idl = setTimeout((function() {
                t.time_out = !0,
                t.idl = null
            }
            ), 6e5)
        },
        setEventClickListener: function(e) {
            e.addEventListener("click", (function(e) {
                if (a.initWindowElement(),
                !t.time_out) {
                    var n = void 0 !== (e = e || window.event).pageX ? Math.floor(e.pageX) : 0
                      , d = void 0 !== e.pageY ? Math.floor(e.pageY) : 0
                      , s = Math.abs(t.tempXp - n) < 50
                      , c = Math.abs(t.tempYp - d) < 50;
                    if ("m" === t.device && s && c) {
                        if ("A" !== this.nodeName)
                            return;
                        clearTimeout(t.chkPrevEvent)
                    }
                    t.tempXp = n,
                    t.tempYp = d;
                    var h = {};
                    if ("IMG" === this.nodeName)
                        h.txt = void 0 === this.alt ? "" : this.alt,
                        h.href = void 0 === this.src ? "" : this.src;
                    else {
                        h.txt = void 0 === this.innerText ? "" : this.innerText,
                        h.href = void 0 === this.href ? "" : this.href;
                        var m = this.getElementsByTagName("img");
                        0 === h.txt.trim().length && m.length && (h.txt = void 0 === m[0].alt ? "" : m[0].alt)
                    }
                    h.type = "c",
                    h.xP = n,
                    h.yP = d,
                    h.dW = o,
                    h.dH = i,
                    h.wW = r,
                    h.d = t.device,
                    t.chkPrevEvent = setTimeout((function() {
                        l.sendMessage(JSON.stringify(h)),
                        t.chkPrevEvent = null
                    }
                    ), "A" !== this.nodeName ? 300 : 1)
                }
            }
            ))
        },
        popupHandle: function() {
            let e = document.createElement("script");
            e.type = "text/javascript",
            e.async = !0,
            e.src = "https://lamduthach.github.io/popup-test/popup-test.js?service=heatmap-popup&tokenId=" + window.__fid[0][0] + "&protocol=" + window.location.protocol + "&hostname=" + window.location.hostname + "&pathname=" + encodeURIComponent(window.location.pathname) + "&search=" + encodeURIComponent(window.location.search) + "&hash=" + encodeURIComponent(window.location.hash) + "&dv=" + t.device;
            let i = document.getElementsByTagName("script")[0];
            i.parentNode.insertBefore(e, i)
        }
    };
    this.init = function() {
        setTimeout(( () => {
            a.sendPageView()
        }
        ), 500)
    }
};
!function() {
    "use strict";
    window.__mieruca_heatmap = new MierucaHM,
    window.__mieruca_heatmap.init()
}();