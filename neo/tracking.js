"use strict";
var UserTracker = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tracking.ts
  var tracking_exports = {};
  __export(tracking_exports, {
    default: () => tracking_default
  });
  var UserTracker = class {
    constructor(apiEndpoint, userId) {
      this.isEnabled = true;
      this.apiEndpoint = apiEndpoint;
      this.userId = userId || this.generateUserId();
      this.init();
    }
    generateUserId() {
      return "user_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now();
    }
    init() {
      if (typeof document !== "undefined") {
        document.addEventListener("click", this.handleClick.bind(this));
      }
    }
    handleClick(event) {
      if (!this.isEnabled) return;
      if (this.isDashboardIframe()) return;
      const target = event.target;
      const clickData = {
        x: event.clientX,
        y: event.clientY,
        timestamp: Date.now(),
        url: window.location.href,
        element: target.tagName.toLowerCase(),
        userId: this.userId,
        elementPath: this.getElementPath(target),
        xpath: this.getXPath(target),
        pageHeight: Math.max(
          document.body.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.clientHeight,
          document.documentElement.scrollHeight,
          document.documentElement.offsetHeight
        )
      };
      console.log(clickData);
      this.sendData(clickData);
    }
    isDashboardIframe() {
      try {
        if (window.self !== window.top) {
          if (window.parent && window.parent.location) {
            const parentUrl = window.parent.location.href;
            if (parentUrl.includes(":9090") || parentUrl.includes("dashboard")) {
              return true;
            }
          }
        }
        if (document.referrer.includes(":9090") || document.referrer.includes("dashboard")) {
          return true;
        }
        return false;
      } catch (error) {
        if (window.self !== window.top) {
          const urlParams = new URLSearchParams(window.location.search);
          if (urlParams.has("dashboard") || urlParams.has("heatmap")) {
            return true;
          }
        }
        return false;
      }
    }
    getElementPath(element) {
      const path = [];
      let current = element;
      while (current && current !== document.body) {
        let selector = current.tagName.toLowerCase();
        if (current.id) {
          selector += `#${current.id}`;
        }
        if (current.className && typeof current.className === "string" && current.className.trim()) {
          const classes = current.className.split(" ").filter((c) => c.trim());
          if (classes.length > 0) {
            selector += "." + classes.join(".");
          }
        }
        path.unshift(selector);
        current = current.parentElement;
      }
      return path.join(" > ");
    }
    getXPath(element) {
      const segments = [];
      let current = element;
      while (current && current.nodeType === Node.ELEMENT_NODE) {
        let segment = current.tagName.toLowerCase();
        if (current.id) {
          segment += `[@id='${current.id}']`;
        } else if (current.className && typeof current.className === "string") {
          const classes = current.className.split(" ").filter((c) => c.trim());
          if (classes.length > 0) {
            segment += `[@class='${classes.join(" ")}']`;
          }
        } else {
          const siblings = Array.from(current.parentElement?.children || []);
          const sameTagSiblings = siblings.filter(
            (sibling) => sibling.tagName.toLowerCase() === current.tagName.toLowerCase()
          );
          if (sameTagSiblings.length > 1) {
            const index = sameTagSiblings.indexOf(current) + 1;
            segment += `[${index}]`;
          }
        }
        segments.unshift(segment);
        current = current.parentElement;
        if (current && current.tagName.toLowerCase() === "body") {
          segments.unshift("body");
          break;
        }
      }
      return "/" + segments.join("/");
    }
    async sendData(data) {
      try {
        await fetch(`${this.apiEndpoint}/api/events/click`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });
      } catch (error) {
        console.error("Failed to send tracking data:", error);
      }
    }
    enable() {
      this.isEnabled = true;
    }
    disable() {
      this.isEnabled = false;
    }
    setUserId(userId) {
      this.userId = userId;
    }
  };
  if (typeof window !== "undefined") {
    window.addEventListener("message", (event) => {
      if (event.data.type === "TRIGGER_CLICK") {
        const { xpath, elementPath, x, y, element, index, total } = event.data.data;
        let targetElement = null;
        console.log(`Receiving click [${index}/${total}]:`, element || elementPath);
        if (xpath) {
          try {
            const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            targetElement = result.singleNodeValue;
            if (targetElement) console.log("\u2713 Found by XPath");
          } catch (e) {
            console.warn("XPath failed:", e);
          }
        }
        if (!targetElement && elementPath) {
          try {
            targetElement = document.querySelector(elementPath);
            if (targetElement) console.log("\u2713 Found by elementPath");
            if (!targetElement) {
              const descendantPath = elementPath.replace(/ > /g, " ");
              targetElement = document.querySelector(descendantPath);
              if (targetElement) console.log("\u2713 Found by descendant selector");
            }
          } catch (e) {
            console.warn("CSS selector failed:", e);
          }
        }
        if (!targetElement && x && y) {
          targetElement = document.elementFromPoint(x, y);
          if (targetElement) console.log("\u2713 Found by position");
        }
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
          targetElement.style.outline = "3px solid #ff0000";
          targetElement.style.backgroundColor = "rgba(255, 0, 0, 0.1)";
          setTimeout(() => {
            targetElement.click();
            console.log(`\u2713 Clicked [${index}/${total}]`);
          }, 100);
          setTimeout(() => {
            targetElement.style.outline = "";
            targetElement.style.backgroundColor = "";
          }, 700);
        } else {
          console.warn(`\u2717 Could not find element [${index}/${total}]`);
        }
      }
    });
  }
  globalThis.UserTracker = UserTracker;
  if (typeof window !== "undefined") {
    window.UserTracker = UserTracker;
    window.initUserTracker = function(apiEndpoint, userId) {
      return new UserTracker(apiEndpoint, userId);
    };
  }
  var tracking_default = UserTracker;
  return __toCommonJS(tracking_exports);
})();
