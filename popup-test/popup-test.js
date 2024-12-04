(function()
{
    function addLog(text) {
        var logDiv = document.getElementById('log');
        logDiv.value += '\n' + text;
        logDiv.value += '\n' + 'time : ' + new Date().toISOString();
    };
        let e,
                o,
                a = {
                        local_url: window.location.href,
                        local_protocol: window.location.protocol,
                        local_hostname: window.location.hostname,
                        local_pathname: window.location.pathname,
                        local_search: window.location.search,
                        local_hash: window.location.hash,
                        local_title: 0 === document.getElementsByTagName("title").length ? window.location.href : document.getElementsByTagName("title")[0].innerHTML,
                        rest_url: document.location.protocol + "//hpjp.mieru-ca.com/action",
                        popup_condition_show: "show_by_exit",
                        popup_value_condition_show: 0,
                        popup_value_condition_show_scroll_after_time: 0,
                        popup_value_condition_show_scroll_position: 0,
                        popup_condition_inherit: false,
                        popup_site_id: "359192189",
                        popup_url_id: "676891102",
                        popup_popup_id: "232052891",
                        device: (e = navigator.userAgent || navigator.vendor || window.opera, /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(e) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(e.substr(0, 4)) ? "m" : /android|ipad|playbook|silk/i.test(e) ? "t" : "d"),
                        browser: -1 !== (o = navigator.userAgent || navigator.vendor || window.opera).toLowerCase().indexOf("opera") || -1 !== o.toLowerCase().indexOf("opr") ? "opera" : -1 !== o.toLowerCase().indexOf("edge") ? "edge" : -1 !== o.toLowerCase().indexOf("chrome") ? "chrome" : -1 !== o.toLowerCase().indexOf("safari") ? "safari" : -1 !== o.toLowerCase().indexOf("firefox") ? "firefox" : -1 !== o.toLowerCase().indexOf("msie") || !0 !== document.documentMode ? "ie" : "unknown"
                },
                t = document.createElement("div");
        if (t.innerHTML = `<div id="mieruca_heatmap_popup" class="mieruca-heatmap-popup" style="display: none;"><div class="mieruca-heatmap-popup-device"><div class="mieruca-hm-popup-overlay-bg"></div><div class="mieruca-hm-popup-inner"><span class="mieruca-hm-popup-close"></span><a href="https://mieru-ca.com/" class="mieruca-hm-popup-setting-pc mieruca-heatmap-click-link popup-setting-jp" target="_blank"><img id="pc_image" src="https://s3-ap-northeast-1.amazonaws.com/mieruca-heatmap/popup-image-uploaded/232052891/PC.png" alt=""></a></div><style>#mieruca_heatmap_popup .mieruca-hm-popup-overlay-bg{background:rgb(97 97 97 / 42%);width:100%;height:100%;position:fixed;top:0;left:0;z-index:9999}#mieruca_heatmap_popup .mieruca-hm-popup-inner{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);max-width:1180px;min-width:280px;max-height:500px;display:flex;align-items:center;justify-content:center;z-index:99999;-webkit-animation:fadein .5s;-moz-animation:fadein .5s;-ms-animation:fadein 0.5s;-o-animation:fadein .5s;animation:fadein .5s}#mieruca_heatmap_popup .mieuca-heatmap-mobile-device-setting .mieruca-hm-popup-inner{max-width:inherit;min-width:inherit;width:70%}#mieruca_heatmap_popup .mieruca-hm-popup-close{position:absolute;top:-10px;right:-10px;width:29px;height:29px;display:flex;border:1px solid #fff;align-items:center;justify-content:center;background:#fff;cursor:pointer;border-radius:50%;z-index: 999999;}#mieruca_heatmap_popup .mieruca-hm-popup-close:after,#mieruca_heatmap_popup .mieruca-hm-popup-close:before{width:14px;height:2px;content:"";position:absolute;left:7px;top:12px;background:#667075}#mieruca_heatmap_popup .mieruca-hm-popup-close:before{-ms-transform:rotate(-45deg);transform:rotateZ(-45deg)}#mieruca_heatmap_popup .mieruca-hm-popup-close:after{-ms-transform:rotate(45deg);transform:rotateZ(45deg)}#mieruca_heatmap_popup .mieruca-hm-popup-setting-sp .mieruca-hm-popup-close{width:23px;height:23px}#mieruca_heatmap_popup .mieruca-hm-popup-setting-sp .mieruca-hm-popup-close:after,#mieruca_heatmap_popup .mieruca-hm-popup-setting-sp .mieruca-hm-popup-close:before{width:11px;height:2px;left:6px;top:9px}#mieruca_heatmap_popup .mieruca-hm-popup-inner img{max-width:100%;max-height:500px;opacity:1!important}#mieruca_heatmap_popup .mieuca-heatmap-mobile-device-setting .mieruca-hm-popup-innerimg{max-height:inherit}#mieruca_heatmap_popup .mieruca-hm-popup-setting-sp,#mieruca_heatmap_popup .mieuca-heatmap-mobile-device-setting .mieruca-hm-popup-setting-pc{display:none}#mieruca_heatmap_popup .mieruca-hm-popup-setting-pc,#mieruca_heatmap_popup .mieuca-heatmap-mobile-device-setting .mieruca-hm-popup-setting-sp{display:block}@keyframes fadein{from{opacity:0}to{opacity:1}}@-moz-keyframes fadein{from{opacity:0}to{opacity:1}}@-webkit-keyframes fadein{from{opacity:0}to{opacity:1}}@-ms-keyframes fadein{from{opacity:0}to{opacity:1}}@-o-keyframes fadein{from{opacity:0}to{opacity:1}}#mieruca_heatmap_popup a:hover{opacity: 1 !important;}</style></div></div>`, document.body.appendChild(t), 0 === document.querySelectorAll("#mieruca_heatmap_popup").length) return;
        window.onunload = function() {};
        let p = {};
        p.t = "pageview",
                p.sId = a.popup_site_id,
                p.uId = a.popup_url_id,
                p.pId = a.popup_popup_id,
                p.protocol = a.local_protocol,
                p.hostname = a.local_hostname,
                p.pathname = a.local_pathname,
                p.search = a.local_search,
                p.hash = a.local_hash,
                p.title = a.local_title,
                p.browser = a.browser,
                p.d = a.device,
                p.ua = navigator.userAgent || navigator.vendor || window.opera,
                fetch(a.rest_url,
                {
                        method: "POST",
                        headers:
                        {
                                "Content-type": "application/json;charset=UTF-8"
                        },
                        body: JSON.stringify(p)
                }).then().catch(e => console.log(e));
        let l = function()
                {
                        let e = document.querySelectorAll("#mieruca_heatmap_popup")[0];
                        e.style.display = "block";
                        let o = {};
                        o.t = "impression",
                                o.sId = a.popup_site_id,
                                o.uId = a.popup_url_id,
                                o.pId = a.popup_popup_id,
                                o.protocol = a.local_protocol,
                                o.hostname = a.local_hostname,
                                o.pathname = a.local_pathname,
                                o.search = a.local_search,
                                o.hash = a.local_hash,
                                o.title = a.local_title,
                                o.browser = a.browser,
                                o.d = a.device,
                                o.ua = navigator.userAgent || navigator.vendor || window.opera,
                                fetch(a.rest_url,
                                {
                                        method: "POST",
                                        headers:
                                        {
                                                "Content-type": "application/json;charset=UTF-8"
                                        },
                                        body: JSON.stringify(o)
                                }).then().catch(e => console.log(e))
                },
                i = function()
                {
                        let e = {};
                        e.t = "click",
                                e.sId = a.popup_site_id,
                                e.uId = a.popup_url_id,
                                e.pId = a.popup_popup_id,
                                e.protocol = a.local_protocol,
                                e.hostname = a.local_hostname,
                                e.pathname = a.local_pathname,
                                e.search = a.local_search,
                                e.hash = a.local_hash,
                                e.title = a.local_title,
                                e.browser = a.browser,
                                e.d = a.device,
                                e.ua = navigator.userAgent || navigator.vendor || window.opera,
                                fetch(a.rest_url,
                                {
                                        method: "POST",
                                        headers:
                                        {
                                                "Content-type": "application/json;charset=UTF-8"
                                        },
                                        body: JSON.stringify(e)
                                }).then().catch(e => console.log(e))
                };
        if ("show_by_time" === a.popup_condition_show && setTimeout(l, 1e3 * a.popup_value_condition_show), "show_by_scroll" === a.popup_condition_show)
        {
                let n = !1;
                window.addEventListener("scroll", function()
                {
                        if (n) return;
                        let e = document.documentElement.scrollHeight || document.body.scrollHeight || 0,
                                o = a.popup_value_condition_show_scroll_position / 100 * e;
                        Math.floor(document.documentElement.scrollTop || document.body.scrollTop || 0) > o && (n = !0, setTimeout(l, 1e3 * a.popup_value_condition_show_scroll_after_time))
                })
        }
        if ("show_by_exit" === a.popup_condition_show && 
            (
                setTimeout(function() { history.replaceState({initPage: !0}, null, null); addLog('replaceState'); }, 100),
                setTimeout(function() { history.pushState(null, null, null); addLog('pushState'); addLog('window.onpopstate : ' + window.onpopstate ) }, 200),
                window.onpopstate = function(e) {
                    addLog('popstate fired');
                    addLog('e.state : ' + e.state);
                    addLog('history.state : ' + history.state);
                    addLog('history.state.initPage : ' + history.state.initPage);
                    // history.replaceState(null, null, null);
                    // l();
                }
                // window.onpopstate = () => setTimeout(function() {history.state && history.state.initPage && (history.replaceState(null, null, null), l())}, 0)
                // setTimeout(function() {
                //     window.addEventListener("popstate", e => {
                //         history.state && history.state.initPage && (history.replaceState(null, null, null), l())
                //     })
                // }, 0)
            ), document.querySelectorAll("#mieruca_heatmap_popup .mieruca-heatmap-click-link").length > 0 && document.querySelectorAll("#mieruca_heatmap_popup .mieruca-heatmap-click-link")[0].addEventListener("click", function()
                {
                        i()
                }), document.querySelectorAll("#mieruca_heatmap_popup .mieruca-hm-popup-close").length > 0 && document.querySelectorAll("#mieruca_heatmap_popup .mieruca-hm-popup-close")[0].addEventListener("click", function()
                {
                        let e = document.querySelectorAll("#mieruca_heatmap_popup")[0];
                        e.style.display = "none"
                }), a.popup_condition_inherit)
        {
                let r = document.querySelector(".mieruca-heatmap-click-link"),
                        c = new URL(r.href);
                new URL(a.local_url).searchParams.forEach((e, o) =>
                        {
                                c.searchParams.append(o, e)
                        }),
                        r.href = c
        }
}).call(this);