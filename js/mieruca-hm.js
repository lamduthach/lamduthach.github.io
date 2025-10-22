(() => {
    var v = {
        t: /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i,
        m: /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/
    };

    function g() {
        let e = navigator?.userAgent || navigator?.vendor || window?.opera || "";
        return v.t.test(e) ? "t" : v.m.test(e) ? "m" : "d"
    }

    // Add log function to append content to click_log div
    function appendToClickLog(content) {
        const logElement = document.getElementById('click_log');
        if (logElement) {
            const logItem = document.createElement('div');
            logItem.innerHTML = content;
            logItem.style.padding = '5px';
            logItem.style.borderBottom = '1px solid #ddd';
            logElement.appendChild(logItem);
        }
    }

    var b = "//hpjp.mieru-ca.com/embed";

    function f(e, o) {
        let c = `${window.location.protocol}${b}`,
            a = new URLSearchParams({
                service: "heatmap-popup",
                tokenId: e,
                protocol: window.location.protocol,
                hostname: window.location.hostname,
                pathname: window.location.pathname,
                search: window.location.search,
                hash: window.location.hash,
                dv: o
            });
        return `${c}?${a}`
    }

    function h(e) {
        return `${window.location.protocol==="https:"?"wss":"ws"}://ntjp.mieru-ca.com/hm?sId=${e}`
    }
    var _ = function() {
        var e = {
                local_url: window.location.href,
                referrer_url: document.referrer,
                sWs: h(window.__fid[0][0]),
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
                read_check: null,
                href: "",
                text: "",
                ipa: 0,
                sChk: null,
                tempXp: 0,
                tempYp: 0,
                device: g()
            },
            o = 0,
            c = 0,
            a = 0,
            u = 0,
            l = 0,
            r = null,
            s = _.prototype = {
                initWindowElement: function() {
                    var i = document.body || {
                            scrollTop: 0,
                            scrollHeight: 0,
                            offsetHeight: 0,
                            scrollLeft: 0,
                            offsetWidth: 0,
                            clientWidth: 0
                        },
                        t = document.documentElement || {
                            scrollTop: 0,
                            clientHeight: 0,
                            scrollHeight: 0,
                            clientWidth: 0,
                            scrollWidth: 0,
                            offsetWidth: 0,
                            offsetHeight: 0
                        };
                    l = Math.floor(t.scrollTop || i.scrollTop || window.pageYOffset), o = Math.max(i.scrollHeight, i.offsetHeight, t.clientHeight, t.scrollHeight, t.offsetHeight), c = Math.max(i.scrollLeft, i.offsetWidth, t.clientWidth, t.scrollWidth, t.offsetWidth), u = Math.floor(window.innerWidth || t.clientWidth || i.clientWidth), a = Math.floor(window.innerHeight + l > o ? o : window.innerHeight)
                },
                sendPageView: function() {
                    if ("WebSocket" in window) r = new WebSocket(e.sWs + (e.ire ? "&retry=1" : ""));
                    else if ("MozWebSocket" in window) r = new MozWebSocket(e.sWs + (e.ire ? "&retry=1" : ""));
                    else return;
                    e.iwc = 0, s.initWindowElement(), r.onopen = function() {
                        var n = {};
                        n.type = "p", n.sId = e.site_id, n.url = e.local_url, n.refUrl = e.referrer_url, n.d = e.device, n.sP = a, n.dH = o, n.wW = u, n.wH = a, n.ipa = "ipa", n.ua = navigator.userAgent || navigator.vendor || window.opera, r.sendMessage(JSON.stringify(n))
                    }, r.onclose = function(n) {
                        e.iwc = 1
                    }, r.onerror = function(n) {
                        e.ire === 0 && !window.__hmrid && (e.ire = 1, setTimeout(() => {
                            s.sendPageView()
                        }, 500))
                    }, r.sendMessage = function(n) {
                        n !== "" && e.iwc === 0 && r.readyState === r.OPEN && r.send(n)
                    }, r.onmessage = function(n) {
                        if (n.data === "IS_ALLOW_LOAD_POPUP") {
                            s.popupHandle();
                            return
                        }
                        if (n.data.startsWith("refId-")) {
                            window.__hmrid = n.data.split("-")[1];
                            return
                        }
                        if (n.data.startsWith("urlId-")) {
                            window.__hmuid = n.data.split("-")[1];
                            return
                        }
                    };
                    var i = document.querySelectorAll("label,a,input,button,textarea,img,iframe,video"),
                        t = 0;
                    for (t; t < i.length; t += 1) s.setEventClickListener(i[t]);
                    window.addEventListener("scroll", function() {
                        e.time_out || (s.scrollHandle(), s.readHandle(), s.resetTimeOut())
                    }), s.resetTimeOut()
                },
                readHandle: function() {
                    clearTimeout(e.read_check), e.read_check = setTimeout(function() {
                        if (s.initWindowElement(), l !== 0) {
                            var i = {};
                            i.type = "r", i.rP = Math.floor(window.innerHeight + l) >= o ? Math.floor(o - window.innerHeight) : Math.floor(l), i.dH = o, i.wW = Math.floor(window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth), i.wH = a, i.d = e.device, r.sendMessage(JSON.stringify(i))
                        }
                    }, 4e3)
                },
                scrollHandle: function() {
                    clearTimeout(e.sChk), e.sChk = setTimeout(function() {
                        s.initWindowElement();
                        var i = Math.floor(document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset || 0) + a;
                        if (i > e.temp_scroll_pos) {
                            e.temp_scroll_pos = i;
                            var t = {};
                            t.type = "s", t.sP = i >= o ? o : i, t.dH = o, t.wW = u, t.wH = a, t.d = e.device, r.sendMessage(JSON.stringify(t))
                        }
                    }, 300)
                },
                resetTimeOut: function() {
                    e.idl !== null && clearTimeout(e.idl), e.idl = setTimeout(function() {
                        e.time_out = !0, e.idl = null
                    }, 6e5)
                },
                setEventClickListener: function(i) {
                    i.addEventListener("click", function(t) {
                        if (s.initWindowElement(), !e.time_out) {
                            t = t || window.event;
                            var n = 50,
                                p = t.pageX !== void 0 ? Math.floor(t.pageX) : 0,
                                m = t.pageY !== void 0 ? Math.floor(t.pageY) : 0,
                                W = Math.abs(e.tempXp - p) < n,
                                E = Math.abs(e.tempYp - m) < n;
                            if (e.device === "m" && W && E) {
                                if (this.nodeName !== "A") return;
                                clearTimeout(e.chkPrevEvent)
                            }
                            e.tempXp = p, e.tempYp = m;
                            var d = {};
                            if (this.nodeName === "IMG") d.txt = this.alt === void 0 ? "" : this.alt, d.href = this.src === void 0 ? "" : this.src;
                            else {
                                d.txt = this.innerText === void 0 ? "" : this.innerText, d.href = this.href === void 0 ? "" : this.href;
                                var w = this.getElementsByTagName("img");
                                d.txt.trim().length === 0 && w.length && (d.txt = w[0].alt === void 0 ? "" : w[0].alt)
                            }
                            if (d.type = "c", d.xP = p, d.yP = m, d.dW = c, d.dH = o, d.wW = u, d.d = e.device, e.chkPrevEvent) return;
                            
                            // Add click logging
                            const timestamp = new Date().toLocaleTimeString();
                            const logContent = `<strong>${timestamp}</strong>: Clicked ${this.nodeName} "${d.txt.substring(0, 50)}" at position (${p}, ${m})`;
                            appendToClickLog(logContent);
                            
                            r.sendMessage(JSON.stringify(d)), e.chkPrevEvent = setTimeout(function() {
                                e.chkPrevEvent = null
                            }, 300)
                        }
                    }, !0)
                },
                popupHandle: function() {
                    let i = document.createElement("script");
                    i.type = "text/javascript", i.async = !0, i.src = f(window.__fid[0][0], e.device);
                    let t = document.getElementsByTagName("script")[0];
                    t.parentNode.insertBefore(i, t)
                }
            };
        this.init = function() {
            setTimeout(() => {
                s.sendPageView()
            }, 500)
        }
    };
    (function() {
        window.__mieruca_heatmap = new _, window.__mieruca_heatmap.init()
    })();
})();