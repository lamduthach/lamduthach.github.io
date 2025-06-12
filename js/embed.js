(function(){
    sessionStorage.setItem('__mo:cId',
    '9157');sessionStorage.setItem('__mo:pId',
    '14359');sessionStorage.setItem('__mo:sId',
    'b5fffaf6-8144-4240-9328-8c6f59980fb5');sessionStorage.setItem('__mo:dv',
    'd')
})();(function(){
    var optimize=window.__mieruca_optimize,
    protocol=optimize.protocol,
    getSessionIdFromCookie=optimize.getSessionIdFromCookie,
    setCookie=function(){
        var date=new Date();date.setTime(date.getTime()+93*24*60*60*1000);var expiresDateTime=date.toUTCString();var startInterval=performance.now();var e=setInterval((function(){
            if(window.__hmrid&&window.__hmuid){
                clearInterval(e);var k=window.__mieruca_optimize,
                o=window.__hmrid,
                n=window.__hmuid,
                d=k.getSessionIdFromCookie("__MOAB-");if(o&&n&&d){
                    const e=k.protocol+"//opt.mieru-ca.com/hm/record/session?rId="+moEncode(o)+"&uId="+moEncode(n)+"&sesId="+moEncode(d);fetch(e,
                    {
                        method: "GET",
                        mode: "no-cors"
                    }).then().catch((e=>console.log(e)));var date=new Date();date.setTime(date.getTime()+24*60*60*1000);var expiresDateTime=date.toUTCString();var cookieValue=moEncode(o)+'-'+moEncode(n);document.cookie=`__MOABHM-1157200805=${cookieValue
                };domain=.leocoat.com;expires=${expiresDateTime
            };path=/;`;
        }
    }(performance.now()-startInterval)>=10000&&clearInterval(e)
}),
200);
},
abScript=function(){
    let moChangeObj={
        moStackArr: [
            {
                "type": "MOVE",
                "xpath": "/html/body/div[1]/section/div[14]/div",
                "desXpath": "/html/body/div[1]/section/div[2]",
                "script": "let currentEle = moGetELByXpath(\`/html/body/div[1]/section/div[14]/div\`);var targetEl = moGetELByXpath(\`/html/body/div[1]/section/div[2]\`);if(targetEl){moInsertBefore(targetEl,currentEle);}",
                "hash": "5c64e4de71508d7454e26001f66858f55cf9d400bb7f6416963d28ba018d7e76",
                "desHash": "0070b29b6577e775f5c13d72fa722e8a760472522e22dd613e6907ef5f7dca81",
                "css": null,
                "javaScript": null,
                "html": null
            }
        ],
        isForced: true
    };moApplyChange(moChangeObj);moObserverHandler(moApplyChange,
    moChangeObj);var startInterval=performance.now();var e=setInterval((function(){
        if(window.__fid&&window.__hmuid){
            clearInterval(e);var k=window.__mieruca_optimize,
            o=window.__fid[
                0
            ][
                0
            ],
            n=window.__hmuid;if(o&&n){
                const e=k.protocol+"//opt.mieru-ca.com/hm/record/linkage?dId="+moEncode(o)+"&uId="+moEncode(n)+"&cId=9157";fetch(e,
                {
                    method: "GET",
                    mode: "no-cors"
                }).then().catch((e=>console.log(e)))
            }
        }(performance.now()-startInterval)>=10000&&clearInterval(e)
    }),
    200);
},
// ...existing code...
clickEventHandler = () => {
    let goals = [];
    let goals_1 = [
        {
            "elFn": () => document.querySelectorAll(`[href='https://amzn.to/45ltLka'],[href='https://www.amzn.to/45ltLka']`),
            "clFn": () => {
                const src = window.location.protocol + '//opt.mieru-ca.com/click-events/record?pId=14359&gId=1550&sId=b5fffaf6-8144-4240-9328-8c6f59980fb5&type=AB&url=' + moEncode('https://leocoat.com/lp/') + '&dv=d';
                fetch(src, {
                    method: 'POST',
                    mode: 'no-cors'
                }).then().catch(err => console.log(err));
                moLinkageGoal();
            }
        }
    ];
    goals.push(...goals_1);

    // Check if elements exist before attaching events
    const elements = goals_1[0].elFn();
    if (elements && elements.length > 0) {
        moAddEventListeners(goals);
    } else {
        // Wait for DOMContentLoaded if not already loaded
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", () => moAddEventListeners(goals), { once: true });
        } else {
            // Optionally, use MutationObserver for dynamic content
            const observer = new MutationObserver(() => {
                const els = goals_1[0].elFn();
                if (els && els.length > 0) {
                    moAddEventListeners(goals);
                    observer.disconnect();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    let eventIdentifier = moGenerateKeyAI('RemoveEventListeners');
    window.__mieruca_optimize_eventTracker[eventIdentifier] = moInitKeyTracker();
    moUrlChangeListener(moRemoveEventListeners, goals, eventIdentifier, false);
    let rebindEventClickName = function (goals) {
        moRemoveEventListeners(goals);
        moAddEventListeners(goals);
    };
    moElChangeListener(rebindEventClickName, goals, eventIdentifier, true);
},
hmRecordGoal=()=>{},
addParameterScript=()=>{},
init=()=>{
    abScript();hmRecordGoal();addParameterScript();clickEventHandler();
};(function(){
    function runInitWhenReady() {
    // If Rocket Loader is present, wait for it to finish
    if (window.__cfRLUnblockHandlers === false) {
        // Try again soon
        setTimeout(runInitWhenReady, 50);
        return;
    }
    // If DOM is ready, run init immediately
    if (document.readyState === "interactive" || document.readyState === "complete") {
        init();
    } else {
        window.addEventListener("DOMContentLoaded", init, { once: true });
    }
}
setCookie();
runInitWhenReady();
}());
}).call(this);