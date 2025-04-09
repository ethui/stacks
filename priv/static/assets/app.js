(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // vendor/topbar.js
  var require_topbar = __commonJS({
    "vendor/topbar.js"(exports, module) {
      (function(window2, document2) {
        "use strict";
        (function() {
          var lastTime = 0;
          var vendors = ["ms", "moz", "webkit", "o"];
          for (var x = 0; x < vendors.length && !window2.requestAnimationFrame; ++x) {
            window2.requestAnimationFrame = window2[vendors[x] + "RequestAnimationFrame"];
            window2.cancelAnimationFrame = window2[vendors[x] + "CancelAnimationFrame"] || window2[vendors[x] + "CancelRequestAnimationFrame"];
          }
          if (!window2.requestAnimationFrame)
            window2.requestAnimationFrame = function(callback, element) {
              var currTime = (/* @__PURE__ */ new Date()).getTime();
              var timeToCall = Math.max(0, 16 - (currTime - lastTime));
              var id = window2.setTimeout(function() {
                callback(currTime + timeToCall);
              }, timeToCall);
              lastTime = currTime + timeToCall;
              return id;
            };
          if (!window2.cancelAnimationFrame)
            window2.cancelAnimationFrame = function(id) {
              clearTimeout(id);
            };
        })();
        var canvas, currentProgress, showing, progressTimerId = null, fadeTimerId = null, delayTimerId = null, addEvent = function(elem, type, handler) {
          if (elem.addEventListener)
            elem.addEventListener(type, handler, false);
          else if (elem.attachEvent)
            elem.attachEvent("on" + type, handler);
          else
            elem["on" + type] = handler;
        }, options = {
          autoRun: true,
          barThickness: 3,
          barColors: {
            0: "rgba(26,  188, 156, .9)",
            ".25": "rgba(52,  152, 219, .9)",
            ".50": "rgba(241, 196, 15,  .9)",
            ".75": "rgba(230, 126, 34,  .9)",
            "1.0": "rgba(211, 84,  0,   .9)"
          },
          shadowBlur: 10,
          shadowColor: "rgba(0,   0,   0,   .6)",
          className: null
        }, repaint = function() {
          canvas.width = window2.innerWidth;
          canvas.height = options.barThickness * 5;
          var ctx = canvas.getContext("2d");
          ctx.shadowBlur = options.shadowBlur;
          ctx.shadowColor = options.shadowColor;
          var lineGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
          for (var stop in options.barColors)
            lineGradient.addColorStop(stop, options.barColors[stop]);
          ctx.lineWidth = options.barThickness;
          ctx.beginPath();
          ctx.moveTo(0, options.barThickness / 2);
          ctx.lineTo(
            Math.ceil(currentProgress * canvas.width),
            options.barThickness / 2
          );
          ctx.strokeStyle = lineGradient;
          ctx.stroke();
        }, createCanvas = function() {
          canvas = document2.createElement("canvas");
          var style = canvas.style;
          style.position = "fixed";
          style.top = style.left = style.right = style.margin = style.padding = 0;
          style.zIndex = 100001;
          style.display = "none";
          if (options.className)
            canvas.classList.add(options.className);
          document2.body.appendChild(canvas);
          addEvent(window2, "resize", repaint);
        }, topbar2 = {
          config: function(opts) {
            for (var key in opts)
              if (options.hasOwnProperty(key))
                options[key] = opts[key];
          },
          show: function(delay) {
            if (showing)
              return;
            if (delay) {
              if (delayTimerId)
                return;
              delayTimerId = setTimeout(() => topbar2.show(), delay);
            } else {
              showing = true;
              if (fadeTimerId !== null)
                window2.cancelAnimationFrame(fadeTimerId);
              if (!canvas)
                createCanvas();
              canvas.style.opacity = 1;
              canvas.style.display = "block";
              topbar2.progress(0);
              if (options.autoRun) {
                (function loop() {
                  progressTimerId = window2.requestAnimationFrame(loop);
                  topbar2.progress(
                    "+" + 0.05 * Math.pow(1 - Math.sqrt(currentProgress), 2)
                  );
                })();
              }
            }
          },
          progress: function(to) {
            if (typeof to === "undefined")
              return currentProgress;
            if (typeof to === "string") {
              to = (to.indexOf("+") >= 0 || to.indexOf("-") >= 0 ? currentProgress : 0) + parseFloat(to);
            }
            currentProgress = to > 1 ? 1 : to;
            repaint();
            return currentProgress;
          },
          hide: function() {
            clearTimeout(delayTimerId);
            delayTimerId = null;
            if (!showing)
              return;
            showing = false;
            if (progressTimerId != null) {
              window2.cancelAnimationFrame(progressTimerId);
              progressTimerId = null;
            }
            (function loop() {
              if (topbar2.progress("+.1") >= 1) {
                canvas.style.opacity -= 0.05;
                if (canvas.style.opacity <= 0.05) {
                  canvas.style.display = "none";
                  fadeTimerId = null;
                  return;
                }
              }
              fadeTimerId = window2.requestAnimationFrame(loop);
            })();
          }
        };
        if (typeof module === "object" && typeof module.exports === "object") {
          module.exports = topbar2;
        } else if (typeof define === "function" && define.amd) {
          define(function() {
            return topbar2;
          });
        } else {
          this.topbar = topbar2;
        }
      }).call(exports, window, document);
    }
  });

  // ../deps/phoenix_html/priv/static/phoenix_html.js
  (function() {
    var PolyfillEvent = eventConstructor();
    function eventConstructor() {
      if (typeof window.CustomEvent === "function")
        return window.CustomEvent;
      function CustomEvent2(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: void 0 };
        var evt = document.createEvent("CustomEvent");
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
      }
      CustomEvent2.prototype = window.Event.prototype;
      return CustomEvent2;
    }
    function buildHiddenInput(name, value) {
      var input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      return input;
    }
    function handleClick(element, targetModifierKey) {
      var to = element.getAttribute("data-to"), method = buildHiddenInput("_method", element.getAttribute("data-method")), csrf = buildHiddenInput("_csrf_token", element.getAttribute("data-csrf")), form = document.createElement("form"), submit = document.createElement("input"), target = element.getAttribute("target");
      form.method = element.getAttribute("data-method") === "get" ? "get" : "post";
      form.action = to;
      form.style.display = "none";
      if (target)
        form.target = target;
      else if (targetModifierKey)
        form.target = "_blank";
      form.appendChild(csrf);
      form.appendChild(method);
      document.body.appendChild(form);
      submit.type = "submit";
      form.appendChild(submit);
      submit.click();
    }
    window.addEventListener("click", function(e) {
      var element = e.target;
      if (e.defaultPrevented)
        return;
      while (element && element.getAttribute) {
        var phoenixLinkEvent = new PolyfillEvent("phoenix.link.click", {
          "bubbles": true,
          "cancelable": true
        });
        if (!element.dispatchEvent(phoenixLinkEvent)) {
          e.preventDefault();
          e.stopImmediatePropagation();
          return false;
        }
        if (element.getAttribute("data-method") && element.getAttribute("data-to")) {
          handleClick(element, e.metaKey || e.shiftKey);
          e.preventDefault();
          return false;
        } else {
          element = element.parentNode;
        }
      }
    }, false);
    window.addEventListener("phoenix.link.click", function(e) {
      var message = e.target.getAttribute("data-confirm");
      if (message && !window.confirm(message)) {
        e.preventDefault();
      }
    }, false);
  })();

  // ../deps/phoenix/priv/static/phoenix.mjs
  var closure = (value) => {
    if (typeof value === "function") {
      return value;
    } else {
      let closure22 = function() {
        return value;
      };
      return closure22;
    }
  };
  var globalSelf = typeof self !== "undefined" ? self : null;
  var phxWindow = typeof window !== "undefined" ? window : null;
  var global = globalSelf || phxWindow || global;
  var DEFAULT_VSN = "2.0.0";
  var SOCKET_STATES = { connecting: 0, open: 1, closing: 2, closed: 3 };
  var DEFAULT_TIMEOUT = 1e4;
  var WS_CLOSE_NORMAL = 1e3;
  var CHANNEL_STATES = {
    closed: "closed",
    errored: "errored",
    joined: "joined",
    joining: "joining",
    leaving: "leaving"
  };
  var CHANNEL_EVENTS = {
    close: "phx_close",
    error: "phx_error",
    join: "phx_join",
    reply: "phx_reply",
    leave: "phx_leave"
  };
  var TRANSPORTS = {
    longpoll: "longpoll",
    websocket: "websocket"
  };
  var XHR_STATES = {
    complete: 4
  };
  var Push = class {
    constructor(channel, event, payload, timeout) {
      this.channel = channel;
      this.event = event;
      this.payload = payload || function() {
        return {};
      };
      this.receivedResp = null;
      this.timeout = timeout;
      this.timeoutTimer = null;
      this.recHooks = [];
      this.sent = false;
    }
    /**
     *
     * @param {number} timeout
     */
    resend(timeout) {
      this.timeout = timeout;
      this.reset();
      this.send();
    }
    /**
     *
     */
    send() {
      if (this.hasReceived("timeout")) {
        return;
      }
      this.startTimeout();
      this.sent = true;
      this.channel.socket.push({
        topic: this.channel.topic,
        event: this.event,
        payload: this.payload(),
        ref: this.ref,
        join_ref: this.channel.joinRef()
      });
    }
    /**
     *
     * @param {*} status
     * @param {*} callback
     */
    receive(status, callback) {
      if (this.hasReceived(status)) {
        callback(this.receivedResp.response);
      }
      this.recHooks.push({ status, callback });
      return this;
    }
    /**
     * @private
     */
    reset() {
      this.cancelRefEvent();
      this.ref = null;
      this.refEvent = null;
      this.receivedResp = null;
      this.sent = false;
    }
    /**
     * @private
     */
    matchReceive({ status, response, _ref }) {
      this.recHooks.filter((h) => h.status === status).forEach((h) => h.callback(response));
    }
    /**
     * @private
     */
    cancelRefEvent() {
      if (!this.refEvent) {
        return;
      }
      this.channel.off(this.refEvent);
    }
    /**
     * @private
     */
    cancelTimeout() {
      clearTimeout(this.timeoutTimer);
      this.timeoutTimer = null;
    }
    /**
     * @private
     */
    startTimeout() {
      if (this.timeoutTimer) {
        this.cancelTimeout();
      }
      this.ref = this.channel.socket.makeRef();
      this.refEvent = this.channel.replyEventName(this.ref);
      this.channel.on(this.refEvent, (payload) => {
        this.cancelRefEvent();
        this.cancelTimeout();
        this.receivedResp = payload;
        this.matchReceive(payload);
      });
      this.timeoutTimer = setTimeout(() => {
        this.trigger("timeout", {});
      }, this.timeout);
    }
    /**
     * @private
     */
    hasReceived(status) {
      return this.receivedResp && this.receivedResp.status === status;
    }
    /**
     * @private
     */
    trigger(status, response) {
      this.channel.trigger(this.refEvent, { status, response });
    }
  };
  var Timer = class {
    constructor(callback, timerCalc) {
      this.callback = callback;
      this.timerCalc = timerCalc;
      this.timer = null;
      this.tries = 0;
    }
    reset() {
      this.tries = 0;
      clearTimeout(this.timer);
    }
    /**
     * Cancels any previous scheduleTimeout and schedules callback
     */
    scheduleTimeout() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.tries = this.tries + 1;
        this.callback();
      }, this.timerCalc(this.tries + 1));
    }
  };
  var Channel = class {
    constructor(topic, params, socket) {
      this.state = CHANNEL_STATES.closed;
      this.topic = topic;
      this.params = closure(params || {});
      this.socket = socket;
      this.bindings = [];
      this.bindingRef = 0;
      this.timeout = this.socket.timeout;
      this.joinedOnce = false;
      this.joinPush = new Push(this, CHANNEL_EVENTS.join, this.params, this.timeout);
      this.pushBuffer = [];
      this.stateChangeRefs = [];
      this.rejoinTimer = new Timer(() => {
        if (this.socket.isConnected()) {
          this.rejoin();
        }
      }, this.socket.rejoinAfterMs);
      this.stateChangeRefs.push(this.socket.onError(() => this.rejoinTimer.reset()));
      this.stateChangeRefs.push(
        this.socket.onOpen(() => {
          this.rejoinTimer.reset();
          if (this.isErrored()) {
            this.rejoin();
          }
        })
      );
      this.joinPush.receive("ok", () => {
        this.state = CHANNEL_STATES.joined;
        this.rejoinTimer.reset();
        this.pushBuffer.forEach((pushEvent) => pushEvent.send());
        this.pushBuffer = [];
      });
      this.joinPush.receive("error", () => {
        this.state = CHANNEL_STATES.errored;
        if (this.socket.isConnected()) {
          this.rejoinTimer.scheduleTimeout();
        }
      });
      this.onClose(() => {
        this.rejoinTimer.reset();
        if (this.socket.hasLogger())
          this.socket.log("channel", `close ${this.topic} ${this.joinRef()}`);
        this.state = CHANNEL_STATES.closed;
        this.socket.remove(this);
      });
      this.onError((reason) => {
        if (this.socket.hasLogger())
          this.socket.log("channel", `error ${this.topic}`, reason);
        if (this.isJoining()) {
          this.joinPush.reset();
        }
        this.state = CHANNEL_STATES.errored;
        if (this.socket.isConnected()) {
          this.rejoinTimer.scheduleTimeout();
        }
      });
      this.joinPush.receive("timeout", () => {
        if (this.socket.hasLogger())
          this.socket.log("channel", `timeout ${this.topic} (${this.joinRef()})`, this.joinPush.timeout);
        let leavePush = new Push(this, CHANNEL_EVENTS.leave, closure({}), this.timeout);
        leavePush.send();
        this.state = CHANNEL_STATES.errored;
        this.joinPush.reset();
        if (this.socket.isConnected()) {
          this.rejoinTimer.scheduleTimeout();
        }
      });
      this.on(CHANNEL_EVENTS.reply, (payload, ref) => {
        this.trigger(this.replyEventName(ref), payload);
      });
    }
    /**
     * Join the channel
     * @param {integer} timeout
     * @returns {Push}
     */
    join(timeout = this.timeout) {
      if (this.joinedOnce) {
        throw new Error("tried to join multiple times. 'join' can only be called a single time per channel instance");
      } else {
        this.timeout = timeout;
        this.joinedOnce = true;
        this.rejoin();
        return this.joinPush;
      }
    }
    /**
     * Hook into channel close
     * @param {Function} callback
     */
    onClose(callback) {
      this.on(CHANNEL_EVENTS.close, callback);
    }
    /**
     * Hook into channel errors
     * @param {Function} callback
     */
    onError(callback) {
      return this.on(CHANNEL_EVENTS.error, (reason) => callback(reason));
    }
    /**
     * Subscribes on channel events
     *
     * Subscription returns a ref counter, which can be used later to
     * unsubscribe the exact event listener
     *
     * @example
     * const ref1 = channel.on("event", do_stuff)
     * const ref2 = channel.on("event", do_other_stuff)
     * channel.off("event", ref1)
     * // Since unsubscription, do_stuff won't fire,
     * // while do_other_stuff will keep firing on the "event"
     *
     * @param {string} event
     * @param {Function} callback
     * @returns {integer} ref
     */
    on(event, callback) {
      let ref = this.bindingRef++;
      this.bindings.push({ event, ref, callback });
      return ref;
    }
    /**
     * Unsubscribes off of channel events
     *
     * Use the ref returned from a channel.on() to unsubscribe one
     * handler, or pass nothing for the ref to unsubscribe all
     * handlers for the given event.
     *
     * @example
     * // Unsubscribe the do_stuff handler
     * const ref1 = channel.on("event", do_stuff)
     * channel.off("event", ref1)
     *
     * // Unsubscribe all handlers from event
     * channel.off("event")
     *
     * @param {string} event
     * @param {integer} ref
     */
    off(event, ref) {
      this.bindings = this.bindings.filter((bind) => {
        return !(bind.event === event && (typeof ref === "undefined" || ref === bind.ref));
      });
    }
    /**
     * @private
     */
    canPush() {
      return this.socket.isConnected() && this.isJoined();
    }
    /**
     * Sends a message `event` to phoenix with the payload `payload`.
     * Phoenix receives this in the `handle_in(event, payload, socket)`
     * function. if phoenix replies or it times out (default 10000ms),
     * then optionally the reply can be received.
     *
     * @example
     * channel.push("event")
     *   .receive("ok", payload => console.log("phoenix replied:", payload))
     *   .receive("error", err => console.log("phoenix errored", err))
     *   .receive("timeout", () => console.log("timed out pushing"))
     * @param {string} event
     * @param {Object} payload
     * @param {number} [timeout]
     * @returns {Push}
     */
    push(event, payload, timeout = this.timeout) {
      payload = payload || {};
      if (!this.joinedOnce) {
        throw new Error(`tried to push '${event}' to '${this.topic}' before joining. Use channel.join() before pushing events`);
      }
      let pushEvent = new Push(this, event, function() {
        return payload;
      }, timeout);
      if (this.canPush()) {
        pushEvent.send();
      } else {
        pushEvent.startTimeout();
        this.pushBuffer.push(pushEvent);
      }
      return pushEvent;
    }
    /** Leaves the channel
     *
     * Unsubscribes from server events, and
     * instructs channel to terminate on server
     *
     * Triggers onClose() hooks
     *
     * To receive leave acknowledgements, use the `receive`
     * hook to bind to the server ack, ie:
     *
     * @example
     * channel.leave().receive("ok", () => alert("left!") )
     *
     * @param {integer} timeout
     * @returns {Push}
     */
    leave(timeout = this.timeout) {
      this.rejoinTimer.reset();
      this.joinPush.cancelTimeout();
      this.state = CHANNEL_STATES.leaving;
      let onClose = () => {
        if (this.socket.hasLogger())
          this.socket.log("channel", `leave ${this.topic}`);
        this.trigger(CHANNEL_EVENTS.close, "leave");
      };
      let leavePush = new Push(this, CHANNEL_EVENTS.leave, closure({}), timeout);
      leavePush.receive("ok", () => onClose()).receive("timeout", () => onClose());
      leavePush.send();
      if (!this.canPush()) {
        leavePush.trigger("ok", {});
      }
      return leavePush;
    }
    /**
     * Overridable message hook
     *
     * Receives all events for specialized message handling
     * before dispatching to the channel callbacks.
     *
     * Must return the payload, modified or unmodified
     * @param {string} event
     * @param {Object} payload
     * @param {integer} ref
     * @returns {Object}
     */
    onMessage(_event, payload, _ref) {
      return payload;
    }
    /**
     * @private
     */
    isMember(topic, event, payload, joinRef) {
      if (this.topic !== topic) {
        return false;
      }
      if (joinRef && joinRef !== this.joinRef()) {
        if (this.socket.hasLogger())
          this.socket.log("channel", "dropping outdated message", { topic, event, payload, joinRef });
        return false;
      } else {
        return true;
      }
    }
    /**
     * @private
     */
    joinRef() {
      return this.joinPush.ref;
    }
    /**
     * @private
     */
    rejoin(timeout = this.timeout) {
      if (this.isLeaving()) {
        return;
      }
      this.socket.leaveOpenTopic(this.topic);
      this.state = CHANNEL_STATES.joining;
      this.joinPush.resend(timeout);
    }
    /**
     * @private
     */
    trigger(event, payload, ref, joinRef) {
      let handledPayload = this.onMessage(event, payload, ref, joinRef);
      if (payload && !handledPayload) {
        throw new Error("channel onMessage callbacks must return the payload, modified or unmodified");
      }
      let eventBindings = this.bindings.filter((bind) => bind.event === event);
      for (let i = 0; i < eventBindings.length; i++) {
        let bind = eventBindings[i];
        bind.callback(handledPayload, ref, joinRef || this.joinRef());
      }
    }
    /**
     * @private
     */
    replyEventName(ref) {
      return `chan_reply_${ref}`;
    }
    /**
     * @private
     */
    isClosed() {
      return this.state === CHANNEL_STATES.closed;
    }
    /**
     * @private
     */
    isErrored() {
      return this.state === CHANNEL_STATES.errored;
    }
    /**
     * @private
     */
    isJoined() {
      return this.state === CHANNEL_STATES.joined;
    }
    /**
     * @private
     */
    isJoining() {
      return this.state === CHANNEL_STATES.joining;
    }
    /**
     * @private
     */
    isLeaving() {
      return this.state === CHANNEL_STATES.leaving;
    }
  };
  var Ajax = class {
    static request(method, endPoint, accept, body, timeout, ontimeout, callback) {
      if (global.XDomainRequest) {
        let req = new global.XDomainRequest();
        return this.xdomainRequest(req, method, endPoint, body, timeout, ontimeout, callback);
      } else {
        let req = new global.XMLHttpRequest();
        return this.xhrRequest(req, method, endPoint, accept, body, timeout, ontimeout, callback);
      }
    }
    static xdomainRequest(req, method, endPoint, body, timeout, ontimeout, callback) {
      req.timeout = timeout;
      req.open(method, endPoint);
      req.onload = () => {
        let response = this.parseJSON(req.responseText);
        callback && callback(response);
      };
      if (ontimeout) {
        req.ontimeout = ontimeout;
      }
      req.onprogress = () => {
      };
      req.send(body);
      return req;
    }
    static xhrRequest(req, method, endPoint, accept, body, timeout, ontimeout, callback) {
      req.open(method, endPoint, true);
      req.timeout = timeout;
      req.setRequestHeader("Content-Type", accept);
      req.onerror = () => callback && callback(null);
      req.onreadystatechange = () => {
        if (req.readyState === XHR_STATES.complete && callback) {
          let response = this.parseJSON(req.responseText);
          callback(response);
        }
      };
      if (ontimeout) {
        req.ontimeout = ontimeout;
      }
      req.send(body);
      return req;
    }
    static parseJSON(resp) {
      if (!resp || resp === "") {
        return null;
      }
      try {
        return JSON.parse(resp);
      } catch (e) {
        console && console.log("failed to parse JSON response", resp);
        return null;
      }
    }
    static serialize(obj, parentKey) {
      let queryStr = [];
      for (var key in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, key)) {
          continue;
        }
        let paramKey = parentKey ? `${parentKey}[${key}]` : key;
        let paramVal = obj[key];
        if (typeof paramVal === "object") {
          queryStr.push(this.serialize(paramVal, paramKey));
        } else {
          queryStr.push(encodeURIComponent(paramKey) + "=" + encodeURIComponent(paramVal));
        }
      }
      return queryStr.join("&");
    }
    static appendParams(url, params) {
      if (Object.keys(params).length === 0) {
        return url;
      }
      let prefix = url.match(/\?/) ? "&" : "?";
      return `${url}${prefix}${this.serialize(params)}`;
    }
  };
  var arrayBufferToBase64 = (buffer) => {
    let binary = "";
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };
  var LongPoll = class {
    constructor(endPoint) {
      this.endPoint = null;
      this.token = null;
      this.skipHeartbeat = true;
      this.reqs = /* @__PURE__ */ new Set();
      this.awaitingBatchAck = false;
      this.currentBatch = null;
      this.currentBatchTimer = null;
      this.batchBuffer = [];
      this.onopen = function() {
      };
      this.onerror = function() {
      };
      this.onmessage = function() {
      };
      this.onclose = function() {
      };
      this.pollEndpoint = this.normalizeEndpoint(endPoint);
      this.readyState = SOCKET_STATES.connecting;
      setTimeout(() => this.poll(), 0);
    }
    normalizeEndpoint(endPoint) {
      return endPoint.replace("ws://", "http://").replace("wss://", "https://").replace(new RegExp("(.*)/" + TRANSPORTS.websocket), "$1/" + TRANSPORTS.longpoll);
    }
    endpointURL() {
      return Ajax.appendParams(this.pollEndpoint, { token: this.token });
    }
    closeAndRetry(code, reason, wasClean) {
      this.close(code, reason, wasClean);
      this.readyState = SOCKET_STATES.connecting;
    }
    ontimeout() {
      this.onerror("timeout");
      this.closeAndRetry(1005, "timeout", false);
    }
    isActive() {
      return this.readyState === SOCKET_STATES.open || this.readyState === SOCKET_STATES.connecting;
    }
    poll() {
      this.ajax("GET", "application/json", null, () => this.ontimeout(), (resp) => {
        if (resp) {
          var { status, token, messages } = resp;
          this.token = token;
        } else {
          status = 0;
        }
        switch (status) {
          case 200:
            messages.forEach((msg) => {
              setTimeout(() => this.onmessage({ data: msg }), 0);
            });
            this.poll();
            break;
          case 204:
            this.poll();
            break;
          case 410:
            this.readyState = SOCKET_STATES.open;
            this.onopen({});
            this.poll();
            break;
          case 403:
            this.onerror(403);
            this.close(1008, "forbidden", false);
            break;
          case 0:
          case 500:
            this.onerror(500);
            this.closeAndRetry(1011, "internal server error", 500);
            break;
          default:
            throw new Error(`unhandled poll status ${status}`);
        }
      });
    }
    // we collect all pushes within the current event loop by
    // setTimeout 0, which optimizes back-to-back procedural
    // pushes against an empty buffer
    send(body) {
      if (typeof body !== "string") {
        body = arrayBufferToBase64(body);
      }
      if (this.currentBatch) {
        this.currentBatch.push(body);
      } else if (this.awaitingBatchAck) {
        this.batchBuffer.push(body);
      } else {
        this.currentBatch = [body];
        this.currentBatchTimer = setTimeout(() => {
          this.batchSend(this.currentBatch);
          this.currentBatch = null;
        }, 0);
      }
    }
    batchSend(messages) {
      this.awaitingBatchAck = true;
      this.ajax("POST", "application/x-ndjson", messages.join("\n"), () => this.onerror("timeout"), (resp) => {
        this.awaitingBatchAck = false;
        if (!resp || resp.status !== 200) {
          this.onerror(resp && resp.status);
          this.closeAndRetry(1011, "internal server error", false);
        } else if (this.batchBuffer.length > 0) {
          this.batchSend(this.batchBuffer);
          this.batchBuffer = [];
        }
      });
    }
    close(code, reason, wasClean) {
      for (let req of this.reqs) {
        req.abort();
      }
      this.readyState = SOCKET_STATES.closed;
      let opts = Object.assign({ code: 1e3, reason: void 0, wasClean: true }, { code, reason, wasClean });
      this.batchBuffer = [];
      clearTimeout(this.currentBatchTimer);
      this.currentBatchTimer = null;
      if (typeof CloseEvent !== "undefined") {
        this.onclose(new CloseEvent("close", opts));
      } else {
        this.onclose(opts);
      }
    }
    ajax(method, contentType, body, onCallerTimeout, callback) {
      let req;
      let ontimeout = () => {
        this.reqs.delete(req);
        onCallerTimeout();
      };
      req = Ajax.request(method, this.endpointURL(), contentType, body, this.timeout, ontimeout, (resp) => {
        this.reqs.delete(req);
        if (this.isActive()) {
          callback(resp);
        }
      });
      this.reqs.add(req);
    }
  };
  var serializer_default = {
    HEADER_LENGTH: 1,
    META_LENGTH: 4,
    KINDS: { push: 0, reply: 1, broadcast: 2 },
    encode(msg, callback) {
      if (msg.payload.constructor === ArrayBuffer) {
        return callback(this.binaryEncode(msg));
      } else {
        let payload = [msg.join_ref, msg.ref, msg.topic, msg.event, msg.payload];
        return callback(JSON.stringify(payload));
      }
    },
    decode(rawPayload, callback) {
      if (rawPayload.constructor === ArrayBuffer) {
        return callback(this.binaryDecode(rawPayload));
      } else {
        let [join_ref, ref, topic, event, payload] = JSON.parse(rawPayload);
        return callback({ join_ref, ref, topic, event, payload });
      }
    },
    // private
    binaryEncode(message) {
      let { join_ref, ref, event, topic, payload } = message;
      let metaLength = this.META_LENGTH + join_ref.length + ref.length + topic.length + event.length;
      let header = new ArrayBuffer(this.HEADER_LENGTH + metaLength);
      let view = new DataView(header);
      let offset = 0;
      view.setUint8(offset++, this.KINDS.push);
      view.setUint8(offset++, join_ref.length);
      view.setUint8(offset++, ref.length);
      view.setUint8(offset++, topic.length);
      view.setUint8(offset++, event.length);
      Array.from(join_ref, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      Array.from(ref, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      Array.from(topic, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      Array.from(event, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      var combined = new Uint8Array(header.byteLength + payload.byteLength);
      combined.set(new Uint8Array(header), 0);
      combined.set(new Uint8Array(payload), header.byteLength);
      return combined.buffer;
    },
    binaryDecode(buffer) {
      let view = new DataView(buffer);
      let kind = view.getUint8(0);
      let decoder = new TextDecoder();
      switch (kind) {
        case this.KINDS.push:
          return this.decodePush(buffer, view, decoder);
        case this.KINDS.reply:
          return this.decodeReply(buffer, view, decoder);
        case this.KINDS.broadcast:
          return this.decodeBroadcast(buffer, view, decoder);
      }
    },
    decodePush(buffer, view, decoder) {
      let joinRefSize = view.getUint8(1);
      let topicSize = view.getUint8(2);
      let eventSize = view.getUint8(3);
      let offset = this.HEADER_LENGTH + this.META_LENGTH - 1;
      let joinRef = decoder.decode(buffer.slice(offset, offset + joinRefSize));
      offset = offset + joinRefSize;
      let topic = decoder.decode(buffer.slice(offset, offset + topicSize));
      offset = offset + topicSize;
      let event = decoder.decode(buffer.slice(offset, offset + eventSize));
      offset = offset + eventSize;
      let data = buffer.slice(offset, buffer.byteLength);
      return { join_ref: joinRef, ref: null, topic, event, payload: data };
    },
    decodeReply(buffer, view, decoder) {
      let joinRefSize = view.getUint8(1);
      let refSize = view.getUint8(2);
      let topicSize = view.getUint8(3);
      let eventSize = view.getUint8(4);
      let offset = this.HEADER_LENGTH + this.META_LENGTH;
      let joinRef = decoder.decode(buffer.slice(offset, offset + joinRefSize));
      offset = offset + joinRefSize;
      let ref = decoder.decode(buffer.slice(offset, offset + refSize));
      offset = offset + refSize;
      let topic = decoder.decode(buffer.slice(offset, offset + topicSize));
      offset = offset + topicSize;
      let event = decoder.decode(buffer.slice(offset, offset + eventSize));
      offset = offset + eventSize;
      let data = buffer.slice(offset, buffer.byteLength);
      let payload = { status: event, response: data };
      return { join_ref: joinRef, ref, topic, event: CHANNEL_EVENTS.reply, payload };
    },
    decodeBroadcast(buffer, view, decoder) {
      let topicSize = view.getUint8(1);
      let eventSize = view.getUint8(2);
      let offset = this.HEADER_LENGTH + 2;
      let topic = decoder.decode(buffer.slice(offset, offset + topicSize));
      offset = offset + topicSize;
      let event = decoder.decode(buffer.slice(offset, offset + eventSize));
      offset = offset + eventSize;
      let data = buffer.slice(offset, buffer.byteLength);
      return { join_ref: null, ref: null, topic, event, payload: data };
    }
  };
  var Socket = class {
    constructor(endPoint, opts = {}) {
      this.stateChangeCallbacks = { open: [], close: [], error: [], message: [] };
      this.channels = [];
      this.sendBuffer = [];
      this.ref = 0;
      this.timeout = opts.timeout || DEFAULT_TIMEOUT;
      this.transport = opts.transport || global.WebSocket || LongPoll;
      this.primaryPassedHealthCheck = false;
      this.longPollFallbackMs = opts.longPollFallbackMs;
      this.fallbackTimer = null;
      this.sessionStore = opts.sessionStorage || global && global.sessionStorage;
      this.establishedConnections = 0;
      this.defaultEncoder = serializer_default.encode.bind(serializer_default);
      this.defaultDecoder = serializer_default.decode.bind(serializer_default);
      this.closeWasClean = false;
      this.disconnecting = false;
      this.binaryType = opts.binaryType || "arraybuffer";
      this.connectClock = 1;
      if (this.transport !== LongPoll) {
        this.encode = opts.encode || this.defaultEncoder;
        this.decode = opts.decode || this.defaultDecoder;
      } else {
        this.encode = this.defaultEncoder;
        this.decode = this.defaultDecoder;
      }
      let awaitingConnectionOnPageShow = null;
      if (phxWindow && phxWindow.addEventListener) {
        phxWindow.addEventListener("pagehide", (_e) => {
          if (this.conn) {
            this.disconnect();
            awaitingConnectionOnPageShow = this.connectClock;
          }
        });
        phxWindow.addEventListener("pageshow", (_e) => {
          if (awaitingConnectionOnPageShow === this.connectClock) {
            awaitingConnectionOnPageShow = null;
            this.connect();
          }
        });
      }
      this.heartbeatIntervalMs = opts.heartbeatIntervalMs || 3e4;
      this.rejoinAfterMs = (tries) => {
        if (opts.rejoinAfterMs) {
          return opts.rejoinAfterMs(tries);
        } else {
          return [1e3, 2e3, 5e3][tries - 1] || 1e4;
        }
      };
      this.reconnectAfterMs = (tries) => {
        if (opts.reconnectAfterMs) {
          return opts.reconnectAfterMs(tries);
        } else {
          return [10, 50, 100, 150, 200, 250, 500, 1e3, 2e3][tries - 1] || 5e3;
        }
      };
      this.logger = opts.logger || null;
      if (!this.logger && opts.debug) {
        this.logger = (kind, msg, data) => {
          console.log(`${kind}: ${msg}`, data);
        };
      }
      this.longpollerTimeout = opts.longpollerTimeout || 2e4;
      this.params = closure(opts.params || {});
      this.endPoint = `${endPoint}/${TRANSPORTS.websocket}`;
      this.vsn = opts.vsn || DEFAULT_VSN;
      this.heartbeatTimeoutTimer = null;
      this.heartbeatTimer = null;
      this.pendingHeartbeatRef = null;
      this.reconnectTimer = new Timer(() => {
        this.teardown(() => this.connect());
      }, this.reconnectAfterMs);
    }
    /**
     * Returns the LongPoll transport reference
     */
    getLongPollTransport() {
      return LongPoll;
    }
    /**
     * Disconnects and replaces the active transport
     *
     * @param {Function} newTransport - The new transport class to instantiate
     *
     */
    replaceTransport(newTransport) {
      this.connectClock++;
      this.closeWasClean = true;
      clearTimeout(this.fallbackTimer);
      this.reconnectTimer.reset();
      if (this.conn) {
        this.conn.close();
        this.conn = null;
      }
      this.transport = newTransport;
    }
    /**
     * Returns the socket protocol
     *
     * @returns {string}
     */
    protocol() {
      return location.protocol.match(/^https/) ? "wss" : "ws";
    }
    /**
     * The fully qualified socket url
     *
     * @returns {string}
     */
    endPointURL() {
      let uri = Ajax.appendParams(
        Ajax.appendParams(this.endPoint, this.params()),
        { vsn: this.vsn }
      );
      if (uri.charAt(0) !== "/") {
        return uri;
      }
      if (uri.charAt(1) === "/") {
        return `${this.protocol()}:${uri}`;
      }
      return `${this.protocol()}://${location.host}${uri}`;
    }
    /**
     * Disconnects the socket
     *
     * See https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent#Status_codes for valid status codes.
     *
     * @param {Function} callback - Optional callback which is called after socket is disconnected.
     * @param {integer} code - A status code for disconnection (Optional).
     * @param {string} reason - A textual description of the reason to disconnect. (Optional)
     */
    disconnect(callback, code, reason) {
      this.connectClock++;
      this.disconnecting = true;
      this.closeWasClean = true;
      clearTimeout(this.fallbackTimer);
      this.reconnectTimer.reset();
      this.teardown(() => {
        this.disconnecting = false;
        callback && callback();
      }, code, reason);
    }
    /**
     *
     * @param {Object} params - The params to send when connecting, for example `{user_id: userToken}`
     *
     * Passing params to connect is deprecated; pass them in the Socket constructor instead:
     * `new Socket("/socket", {params: {user_id: userToken}})`.
     */
    connect(params) {
      if (params) {
        console && console.log("passing params to connect is deprecated. Instead pass :params to the Socket constructor");
        this.params = closure(params);
      }
      if (this.conn && !this.disconnecting) {
        return;
      }
      if (this.longPollFallbackMs && this.transport !== LongPoll) {
        this.connectWithFallback(LongPoll, this.longPollFallbackMs);
      } else {
        this.transportConnect();
      }
    }
    /**
     * Logs the message. Override `this.logger` for specialized logging. noops by default
     * @param {string} kind
     * @param {string} msg
     * @param {Object} data
     */
    log(kind, msg, data) {
      this.logger && this.logger(kind, msg, data);
    }
    /**
     * Returns true if a logger has been set on this socket.
     */
    hasLogger() {
      return this.logger !== null;
    }
    /**
     * Registers callbacks for connection open events
     *
     * @example socket.onOpen(function(){ console.info("the socket was opened") })
     *
     * @param {Function} callback
     */
    onOpen(callback) {
      let ref = this.makeRef();
      this.stateChangeCallbacks.open.push([ref, callback]);
      return ref;
    }
    /**
     * Registers callbacks for connection close events
     * @param {Function} callback
     */
    onClose(callback) {
      let ref = this.makeRef();
      this.stateChangeCallbacks.close.push([ref, callback]);
      return ref;
    }
    /**
     * Registers callbacks for connection error events
     *
     * @example socket.onError(function(error){ alert("An error occurred") })
     *
     * @param {Function} callback
     */
    onError(callback) {
      let ref = this.makeRef();
      this.stateChangeCallbacks.error.push([ref, callback]);
      return ref;
    }
    /**
     * Registers callbacks for connection message events
     * @param {Function} callback
     */
    onMessage(callback) {
      let ref = this.makeRef();
      this.stateChangeCallbacks.message.push([ref, callback]);
      return ref;
    }
    /**
     * Pings the server and invokes the callback with the RTT in milliseconds
     * @param {Function} callback
     *
     * Returns true if the ping was pushed or false if unable to be pushed.
     */
    ping(callback) {
      if (!this.isConnected()) {
        return false;
      }
      let ref = this.makeRef();
      let startTime = Date.now();
      this.push({ topic: "phoenix", event: "heartbeat", payload: {}, ref });
      let onMsgRef = this.onMessage((msg) => {
        if (msg.ref === ref) {
          this.off([onMsgRef]);
          callback(Date.now() - startTime);
        }
      });
      return true;
    }
    /**
     * @private
     */
    transportConnect() {
      this.connectClock++;
      this.closeWasClean = false;
      this.conn = new this.transport(this.endPointURL());
      this.conn.binaryType = this.binaryType;
      this.conn.timeout = this.longpollerTimeout;
      this.conn.onopen = () => this.onConnOpen();
      this.conn.onerror = (error) => this.onConnError(error);
      this.conn.onmessage = (event) => this.onConnMessage(event);
      this.conn.onclose = (event) => this.onConnClose(event);
    }
    getSession(key) {
      return this.sessionStore && this.sessionStore.getItem(key);
    }
    storeSession(key, val) {
      this.sessionStore && this.sessionStore.setItem(key, val);
    }
    connectWithFallback(fallbackTransport, fallbackThreshold = 2500) {
      clearTimeout(this.fallbackTimer);
      let established = false;
      let primaryTransport = true;
      let openRef, errorRef;
      let fallback = (reason) => {
        this.log("transport", `falling back to ${fallbackTransport.name}...`, reason);
        this.off([openRef, errorRef]);
        primaryTransport = false;
        this.replaceTransport(fallbackTransport);
        this.transportConnect();
      };
      if (this.getSession(`phx:fallback:${fallbackTransport.name}`)) {
        return fallback("memorized");
      }
      this.fallbackTimer = setTimeout(fallback, fallbackThreshold);
      errorRef = this.onError((reason) => {
        this.log("transport", "error", reason);
        if (primaryTransport && !established) {
          clearTimeout(this.fallbackTimer);
          fallback(reason);
        }
      });
      this.onOpen(() => {
        established = true;
        if (!primaryTransport) {
          if (!this.primaryPassedHealthCheck) {
            this.storeSession(`phx:fallback:${fallbackTransport.name}`, "true");
          }
          return this.log("transport", `established ${fallbackTransport.name} fallback`);
        }
        clearTimeout(this.fallbackTimer);
        this.fallbackTimer = setTimeout(fallback, fallbackThreshold);
        this.ping((rtt) => {
          this.log("transport", "connected to primary after", rtt);
          this.primaryPassedHealthCheck = true;
          clearTimeout(this.fallbackTimer);
        });
      });
      this.transportConnect();
    }
    clearHeartbeats() {
      clearTimeout(this.heartbeatTimer);
      clearTimeout(this.heartbeatTimeoutTimer);
    }
    onConnOpen() {
      if (this.hasLogger())
        this.log("transport", `${this.transport.name} connected to ${this.endPointURL()}`);
      this.closeWasClean = false;
      this.disconnecting = false;
      this.establishedConnections++;
      this.flushSendBuffer();
      this.reconnectTimer.reset();
      this.resetHeartbeat();
      this.stateChangeCallbacks.open.forEach(([, callback]) => callback());
    }
    /**
     * @private
     */
    heartbeatTimeout() {
      if (this.pendingHeartbeatRef) {
        this.pendingHeartbeatRef = null;
        if (this.hasLogger()) {
          this.log("transport", "heartbeat timeout. Attempting to re-establish connection");
        }
        this.triggerChanError();
        this.closeWasClean = false;
        this.teardown(() => this.reconnectTimer.scheduleTimeout(), WS_CLOSE_NORMAL, "heartbeat timeout");
      }
    }
    resetHeartbeat() {
      if (this.conn && this.conn.skipHeartbeat) {
        return;
      }
      this.pendingHeartbeatRef = null;
      this.clearHeartbeats();
      this.heartbeatTimer = setTimeout(() => this.sendHeartbeat(), this.heartbeatIntervalMs);
    }
    teardown(callback, code, reason) {
      if (!this.conn) {
        return callback && callback();
      }
      let connectClock = this.connectClock;
      this.waitForBufferDone(() => {
        if (connectClock !== this.connectClock) {
          return;
        }
        if (this.conn) {
          if (code) {
            this.conn.close(code, reason || "");
          } else {
            this.conn.close();
          }
        }
        this.waitForSocketClosed(() => {
          if (connectClock !== this.connectClock) {
            return;
          }
          if (this.conn) {
            this.conn.onopen = function() {
            };
            this.conn.onerror = function() {
            };
            this.conn.onmessage = function() {
            };
            this.conn.onclose = function() {
            };
            this.conn = null;
          }
          callback && callback();
        });
      });
    }
    waitForBufferDone(callback, tries = 1) {
      if (tries === 5 || !this.conn || !this.conn.bufferedAmount) {
        callback();
        return;
      }
      setTimeout(() => {
        this.waitForBufferDone(callback, tries + 1);
      }, 150 * tries);
    }
    waitForSocketClosed(callback, tries = 1) {
      if (tries === 5 || !this.conn || this.conn.readyState === SOCKET_STATES.closed) {
        callback();
        return;
      }
      setTimeout(() => {
        this.waitForSocketClosed(callback, tries + 1);
      }, 150 * tries);
    }
    onConnClose(event) {
      let closeCode = event && event.code;
      if (this.hasLogger())
        this.log("transport", "close", event);
      this.triggerChanError();
      this.clearHeartbeats();
      if (!this.closeWasClean && closeCode !== 1e3) {
        this.reconnectTimer.scheduleTimeout();
      }
      this.stateChangeCallbacks.close.forEach(([, callback]) => callback(event));
    }
    /**
     * @private
     */
    onConnError(error) {
      if (this.hasLogger())
        this.log("transport", error);
      let transportBefore = this.transport;
      let establishedBefore = this.establishedConnections;
      this.stateChangeCallbacks.error.forEach(([, callback]) => {
        callback(error, transportBefore, establishedBefore);
      });
      if (transportBefore === this.transport || establishedBefore > 0) {
        this.triggerChanError();
      }
    }
    /**
     * @private
     */
    triggerChanError() {
      this.channels.forEach((channel) => {
        if (!(channel.isErrored() || channel.isLeaving() || channel.isClosed())) {
          channel.trigger(CHANNEL_EVENTS.error);
        }
      });
    }
    /**
     * @returns {string}
     */
    connectionState() {
      switch (this.conn && this.conn.readyState) {
        case SOCKET_STATES.connecting:
          return "connecting";
        case SOCKET_STATES.open:
          return "open";
        case SOCKET_STATES.closing:
          return "closing";
        default:
          return "closed";
      }
    }
    /**
     * @returns {boolean}
     */
    isConnected() {
      return this.connectionState() === "open";
    }
    /**
     * @private
     *
     * @param {Channel}
     */
    remove(channel) {
      this.off(channel.stateChangeRefs);
      this.channels = this.channels.filter((c) => c !== channel);
    }
    /**
     * Removes `onOpen`, `onClose`, `onError,` and `onMessage` registrations.
     *
     * @param {refs} - list of refs returned by calls to
     *                 `onOpen`, `onClose`, `onError,` and `onMessage`
     */
    off(refs) {
      for (let key in this.stateChangeCallbacks) {
        this.stateChangeCallbacks[key] = this.stateChangeCallbacks[key].filter(([ref]) => {
          return refs.indexOf(ref) === -1;
        });
      }
    }
    /**
     * Initiates a new channel for the given topic
     *
     * @param {string} topic
     * @param {Object} chanParams - Parameters for the channel
     * @returns {Channel}
     */
    channel(topic, chanParams = {}) {
      let chan = new Channel(topic, chanParams, this);
      this.channels.push(chan);
      return chan;
    }
    /**
     * @param {Object} data
     */
    push(data) {
      if (this.hasLogger()) {
        let { topic, event, payload, ref, join_ref } = data;
        this.log("push", `${topic} ${event} (${join_ref}, ${ref})`, payload);
      }
      if (this.isConnected()) {
        this.encode(data, (result) => this.conn.send(result));
      } else {
        this.sendBuffer.push(() => this.encode(data, (result) => this.conn.send(result)));
      }
    }
    /**
     * Return the next message ref, accounting for overflows
     * @returns {string}
     */
    makeRef() {
      let newRef = this.ref + 1;
      if (newRef === this.ref) {
        this.ref = 0;
      } else {
        this.ref = newRef;
      }
      return this.ref.toString();
    }
    sendHeartbeat() {
      if (this.pendingHeartbeatRef && !this.isConnected()) {
        return;
      }
      this.pendingHeartbeatRef = this.makeRef();
      this.push({ topic: "phoenix", event: "heartbeat", payload: {}, ref: this.pendingHeartbeatRef });
      this.heartbeatTimeoutTimer = setTimeout(() => this.heartbeatTimeout(), this.heartbeatIntervalMs);
    }
    flushSendBuffer() {
      if (this.isConnected() && this.sendBuffer.length > 0) {
        this.sendBuffer.forEach((callback) => callback());
        this.sendBuffer = [];
      }
    }
    onConnMessage(rawMessage) {
      this.decode(rawMessage.data, (msg) => {
        let { topic, event, payload, ref, join_ref } = msg;
        if (ref && ref === this.pendingHeartbeatRef) {
          this.clearHeartbeats();
          this.pendingHeartbeatRef = null;
          this.heartbeatTimer = setTimeout(() => this.sendHeartbeat(), this.heartbeatIntervalMs);
        }
        if (this.hasLogger())
          this.log("receive", `${payload.status || ""} ${topic} ${event} ${ref && "(" + ref + ")" || ""}`, payload);
        for (let i = 0; i < this.channels.length; i++) {
          const channel = this.channels[i];
          if (!channel.isMember(topic, event, payload, join_ref)) {
            continue;
          }
          channel.trigger(event, payload, ref, join_ref);
        }
        for (let i = 0; i < this.stateChangeCallbacks.message.length; i++) {
          let [, callback] = this.stateChangeCallbacks.message[i];
          callback(msg);
        }
      });
    }
    leaveOpenTopic(topic) {
      let dupChannel = this.channels.find((c) => c.topic === topic && (c.isJoined() || c.isJoining()));
      if (dupChannel) {
        if (this.hasLogger())
          this.log("transport", `leaving duplicate topic "${topic}"`);
        dupChannel.leave();
      }
    }
  };

  // ../deps/phoenix_live_view/priv/static/phoenix_live_view.esm.js
  var CONSECUTIVE_RELOADS = "consecutive-reloads";
  var MAX_RELOADS = 10;
  var RELOAD_JITTER_MIN = 5e3;
  var RELOAD_JITTER_MAX = 1e4;
  var FAILSAFE_JITTER = 3e4;
  var PHX_EVENT_CLASSES = [
    "phx-click-loading",
    "phx-change-loading",
    "phx-submit-loading",
    "phx-keydown-loading",
    "phx-keyup-loading",
    "phx-blur-loading",
    "phx-focus-loading",
    "phx-hook-loading"
  ];
  var PHX_COMPONENT = "data-phx-component";
  var PHX_LIVE_LINK = "data-phx-link";
  var PHX_TRACK_STATIC = "track-static";
  var PHX_LINK_STATE = "data-phx-link-state";
  var PHX_REF_LOADING = "data-phx-ref-loading";
  var PHX_REF_SRC = "data-phx-ref-src";
  var PHX_REF_LOCK = "data-phx-ref-lock";
  var PHX_TRACK_UPLOADS = "track-uploads";
  var PHX_UPLOAD_REF = "data-phx-upload-ref";
  var PHX_PREFLIGHTED_REFS = "data-phx-preflighted-refs";
  var PHX_DONE_REFS = "data-phx-done-refs";
  var PHX_DROP_TARGET = "drop-target";
  var PHX_ACTIVE_ENTRY_REFS = "data-phx-active-refs";
  var PHX_LIVE_FILE_UPDATED = "phx:live-file:updated";
  var PHX_SKIP = "data-phx-skip";
  var PHX_MAGIC_ID = "data-phx-id";
  var PHX_PRUNE = "data-phx-prune";
  var PHX_CONNECTED_CLASS = "phx-connected";
  var PHX_LOADING_CLASS = "phx-loading";
  var PHX_ERROR_CLASS = "phx-error";
  var PHX_CLIENT_ERROR_CLASS = "phx-client-error";
  var PHX_SERVER_ERROR_CLASS = "phx-server-error";
  var PHX_PARENT_ID = "data-phx-parent-id";
  var PHX_MAIN = "data-phx-main";
  var PHX_ROOT_ID = "data-phx-root-id";
  var PHX_VIEWPORT_TOP = "viewport-top";
  var PHX_VIEWPORT_BOTTOM = "viewport-bottom";
  var PHX_TRIGGER_ACTION = "trigger-action";
  var PHX_HAS_FOCUSED = "phx-has-focused";
  var FOCUSABLE_INPUTS = ["text", "textarea", "number", "email", "password", "search", "tel", "url", "date", "time", "datetime-local", "color", "range"];
  var CHECKABLE_INPUTS = ["checkbox", "radio"];
  var PHX_HAS_SUBMITTED = "phx-has-submitted";
  var PHX_SESSION = "data-phx-session";
  var PHX_VIEW_SELECTOR = `[${PHX_SESSION}]`;
  var PHX_STICKY = "data-phx-sticky";
  var PHX_STATIC = "data-phx-static";
  var PHX_READONLY = "data-phx-readonly";
  var PHX_DISABLED = "data-phx-disabled";
  var PHX_DISABLE_WITH = "disable-with";
  var PHX_DISABLE_WITH_RESTORE = "data-phx-disable-with-restore";
  var PHX_HOOK = "hook";
  var PHX_DEBOUNCE = "debounce";
  var PHX_THROTTLE = "throttle";
  var PHX_UPDATE = "update";
  var PHX_STREAM = "stream";
  var PHX_STREAM_REF = "data-phx-stream";
  var PHX_KEY = "key";
  var PHX_PRIVATE = "phxPrivate";
  var PHX_AUTO_RECOVER = "auto-recover";
  var PHX_LV_DEBUG = "phx:live-socket:debug";
  var PHX_LV_PROFILE = "phx:live-socket:profiling";
  var PHX_LV_LATENCY_SIM = "phx:live-socket:latency-sim";
  var PHX_LV_HISTORY_POSITION = "phx:nav-history-position";
  var PHX_PROGRESS = "progress";
  var PHX_MOUNTED = "mounted";
  var PHX_RELOAD_STATUS = "__phoenix_reload_status__";
  var LOADER_TIMEOUT = 1;
  var MAX_CHILD_JOIN_ATTEMPTS = 3;
  var BEFORE_UNLOAD_LOADER_TIMEOUT = 200;
  var DISCONNECTED_TIMEOUT = 500;
  var BINDING_PREFIX = "phx-";
  var PUSH_TIMEOUT = 3e4;
  var DEBOUNCE_TRIGGER = "debounce-trigger";
  var THROTTLED = "throttled";
  var DEBOUNCE_PREV_KEY = "debounce-prev-key";
  var DEFAULTS = {
    debounce: 300,
    throttle: 300
  };
  var PHX_PENDING_ATTRS = [PHX_REF_LOADING, PHX_REF_SRC, PHX_REF_LOCK];
  var DYNAMICS = "d";
  var STATIC = "s";
  var ROOT = "r";
  var COMPONENTS = "c";
  var EVENTS = "e";
  var REPLY = "r";
  var TITLE = "t";
  var TEMPLATES = "p";
  var STREAM = "stream";
  var EntryUploader = class {
    constructor(entry, config, liveSocket2) {
      let { chunk_size, chunk_timeout } = config;
      this.liveSocket = liveSocket2;
      this.entry = entry;
      this.offset = 0;
      this.chunkSize = chunk_size;
      this.chunkTimeout = chunk_timeout;
      this.chunkTimer = null;
      this.errored = false;
      this.uploadChannel = liveSocket2.channel(`lvu:${entry.ref}`, { token: entry.metadata() });
    }
    error(reason) {
      if (this.errored) {
        return;
      }
      this.uploadChannel.leave();
      this.errored = true;
      clearTimeout(this.chunkTimer);
      this.entry.error(reason);
    }
    upload() {
      this.uploadChannel.onError((reason) => this.error(reason));
      this.uploadChannel.join().receive("ok", (_data) => this.readNextChunk()).receive("error", (reason) => this.error(reason));
    }
    isDone() {
      return this.offset >= this.entry.file.size;
    }
    readNextChunk() {
      let reader = new window.FileReader();
      let blob = this.entry.file.slice(this.offset, this.chunkSize + this.offset);
      reader.onload = (e) => {
        if (e.target.error === null) {
          this.offset += e.target.result.byteLength;
          this.pushChunk(e.target.result);
        } else {
          return logError("Read error: " + e.target.error);
        }
      };
      reader.readAsArrayBuffer(blob);
    }
    pushChunk(chunk) {
      if (!this.uploadChannel.isJoined()) {
        return;
      }
      this.uploadChannel.push("chunk", chunk, this.chunkTimeout).receive("ok", () => {
        this.entry.progress(this.offset / this.entry.file.size * 100);
        if (!this.isDone()) {
          this.chunkTimer = setTimeout(() => this.readNextChunk(), this.liveSocket.getLatencySim() || 0);
        }
      }).receive("error", ({ reason }) => this.error(reason));
    }
  };
  var logError = (msg, obj) => console.error && console.error(msg, obj);
  var isCid = (cid) => {
    let type = typeof cid;
    return type === "number" || type === "string" && /^(0|[1-9]\d*)$/.test(cid);
  };
  function detectDuplicateIds() {
    let ids = /* @__PURE__ */ new Set();
    let elems = document.querySelectorAll("*[id]");
    for (let i = 0, len = elems.length; i < len; i++) {
      if (ids.has(elems[i].id)) {
        console.error(`Multiple IDs detected: ${elems[i].id}. Ensure unique element ids.`);
      } else {
        ids.add(elems[i].id);
      }
    }
  }
  function detectInvalidStreamInserts(inserts) {
    const errors = /* @__PURE__ */ new Set();
    Object.keys(inserts).forEach((id) => {
      const streamEl = document.getElementById(id);
      if (streamEl && streamEl.parentElement && streamEl.parentElement.getAttribute("phx-update") !== "stream") {
        errors.add(`The stream container with id "${streamEl.parentElement.id}" is missing the phx-update="stream" attribute. Ensure it is set for streams to work properly.`);
      }
    });
    errors.forEach((error) => console.error(error));
  }
  var debug = (view, kind, msg, obj) => {
    if (view.liveSocket.isDebugEnabled()) {
      console.log(`${view.id} ${kind}: ${msg} - `, obj);
    }
  };
  var closure2 = (val) => typeof val === "function" ? val : function() {
    return val;
  };
  var clone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
  };
  var closestPhxBinding = (el, binding, borderEl) => {
    do {
      if (el.matches(`[${binding}]`) && !el.disabled) {
        return el;
      }
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1 && !(borderEl && borderEl.isSameNode(el) || el.matches(PHX_VIEW_SELECTOR)));
    return null;
  };
  var isObject = (obj) => {
    return obj !== null && typeof obj === "object" && !(obj instanceof Array);
  };
  var isEqualObj = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2);
  var isEmpty = (obj) => {
    for (let x in obj) {
      return false;
    }
    return true;
  };
  var maybe = (el, callback) => el && callback(el);
  var channelUploader = function(entries, onError, resp, liveSocket2) {
    entries.forEach((entry) => {
      let entryUploader = new EntryUploader(entry, resp.config, liveSocket2);
      entryUploader.upload();
    });
  };
  var Browser = {
    canPushState() {
      return typeof history.pushState !== "undefined";
    },
    dropLocal(localStorage, namespace, subkey) {
      return localStorage.removeItem(this.localKey(namespace, subkey));
    },
    updateLocal(localStorage, namespace, subkey, initial, func) {
      let current = this.getLocal(localStorage, namespace, subkey);
      let key = this.localKey(namespace, subkey);
      let newVal = current === null ? initial : func(current);
      localStorage.setItem(key, JSON.stringify(newVal));
      return newVal;
    },
    getLocal(localStorage, namespace, subkey) {
      return JSON.parse(localStorage.getItem(this.localKey(namespace, subkey)));
    },
    updateCurrentState(callback) {
      if (!this.canPushState()) {
        return;
      }
      history.replaceState(callback(history.state || {}), "", window.location.href);
    },
    pushState(kind, meta, to) {
      if (this.canPushState()) {
        if (to !== window.location.href) {
          if (meta.type == "redirect" && meta.scroll) {
            let currentState = history.state || {};
            currentState.scroll = meta.scroll;
            history.replaceState(currentState, "", window.location.href);
          }
          delete meta.scroll;
          history[kind + "State"](meta, "", to || null);
          window.requestAnimationFrame(() => {
            let hashEl = this.getHashTargetEl(window.location.hash);
            if (hashEl) {
              hashEl.scrollIntoView();
            } else if (meta.type === "redirect") {
              window.scroll(0, 0);
            }
          });
        }
      } else {
        this.redirect(to);
      }
    },
    setCookie(name, value, maxAgeSeconds) {
      let expires = typeof maxAgeSeconds === "number" ? ` max-age=${maxAgeSeconds};` : "";
      document.cookie = `${name}=${value};${expires} path=/`;
    },
    getCookie(name) {
      return document.cookie.replace(new RegExp(`(?:(?:^|.*;s*)${name}s*=s*([^;]*).*$)|^.*$`), "$1");
    },
    deleteCookie(name) {
      document.cookie = `${name}=; max-age=-1; path=/`;
    },
    redirect(toURL, flash) {
      if (flash) {
        this.setCookie("__phoenix_flash__", flash, 60);
      }
      window.location = toURL;
    },
    localKey(namespace, subkey) {
      return `${namespace}-${subkey}`;
    },
    getHashTargetEl(maybeHash) {
      let hash = maybeHash.toString().substring(1);
      if (hash === "") {
        return;
      }
      return document.getElementById(hash) || document.querySelector(`a[name="${hash}"]`);
    }
  };
  var browser_default = Browser;
  var DOM = {
    byId(id) {
      return document.getElementById(id) || logError(`no id found for ${id}`);
    },
    removeClass(el, className) {
      el.classList.remove(className);
      if (el.classList.length === 0) {
        el.removeAttribute("class");
      }
    },
    all(node, query, callback) {
      if (!node) {
        return [];
      }
      let array = Array.from(node.querySelectorAll(query));
      return callback ? array.forEach(callback) : array;
    },
    childNodeLength(html) {
      let template = document.createElement("template");
      template.innerHTML = html;
      return template.content.childElementCount;
    },
    isUploadInput(el) {
      return el.type === "file" && el.getAttribute(PHX_UPLOAD_REF) !== null;
    },
    isAutoUpload(inputEl) {
      return inputEl.hasAttribute("data-phx-auto-upload");
    },
    findUploadInputs(node) {
      const formId = node.id;
      const inputsOutsideForm = this.all(document, `input[type="file"][${PHX_UPLOAD_REF}][form="${formId}"]`);
      return this.all(node, `input[type="file"][${PHX_UPLOAD_REF}]`).concat(inputsOutsideForm);
    },
    findComponentNodeList(node, cid) {
      return this.filterWithinSameLiveView(this.all(node, `[${PHX_COMPONENT}="${cid}"]`), node);
    },
    isPhxDestroyed(node) {
      return node.id && DOM.private(node, "destroyed") ? true : false;
    },
    wantsNewTab(e) {
      let wantsNewTab = e.ctrlKey || e.shiftKey || e.metaKey || e.button && e.button === 1;
      let isDownload = e.target instanceof HTMLAnchorElement && e.target.hasAttribute("download");
      let isTargetBlank = e.target.hasAttribute("target") && e.target.getAttribute("target").toLowerCase() === "_blank";
      let isTargetNamedTab = e.target.hasAttribute("target") && !e.target.getAttribute("target").startsWith("_");
      return wantsNewTab || isTargetBlank || isDownload || isTargetNamedTab;
    },
    isUnloadableFormSubmit(e) {
      let isDialogSubmit = e.target && e.target.getAttribute("method") === "dialog" || e.submitter && e.submitter.getAttribute("formmethod") === "dialog";
      if (isDialogSubmit) {
        return false;
      } else {
        return !e.defaultPrevented && !this.wantsNewTab(e);
      }
    },
    isNewPageClick(e, currentLocation) {
      let href = e.target instanceof HTMLAnchorElement ? e.target.getAttribute("href") : null;
      let url;
      if (e.defaultPrevented || href === null || this.wantsNewTab(e)) {
        return false;
      }
      if (href.startsWith("mailto:") || href.startsWith("tel:")) {
        return false;
      }
      if (e.target.isContentEditable) {
        return false;
      }
      try {
        url = new URL(href);
      } catch (e2) {
        try {
          url = new URL(href, currentLocation);
        } catch (e3) {
          return true;
        }
      }
      if (url.host === currentLocation.host && url.protocol === currentLocation.protocol) {
        if (url.pathname === currentLocation.pathname && url.search === currentLocation.search) {
          return url.hash === "" && !url.href.endsWith("#");
        }
      }
      return url.protocol.startsWith("http");
    },
    markPhxChildDestroyed(el) {
      if (this.isPhxChild(el)) {
        el.setAttribute(PHX_SESSION, "");
      }
      this.putPrivate(el, "destroyed", true);
    },
    findPhxChildrenInFragment(html, parentId) {
      let template = document.createElement("template");
      template.innerHTML = html;
      return this.findPhxChildren(template.content, parentId);
    },
    isIgnored(el, phxUpdate) {
      return (el.getAttribute(phxUpdate) || el.getAttribute("data-phx-update")) === "ignore";
    },
    isPhxUpdate(el, phxUpdate, updateTypes) {
      return el.getAttribute && updateTypes.indexOf(el.getAttribute(phxUpdate)) >= 0;
    },
    findPhxSticky(el) {
      return this.all(el, `[${PHX_STICKY}]`);
    },
    findPhxChildren(el, parentId) {
      return this.all(el, `${PHX_VIEW_SELECTOR}[${PHX_PARENT_ID}="${parentId}"]`);
    },
    findExistingParentCIDs(node, cids) {
      let parentCids = /* @__PURE__ */ new Set();
      let childrenCids = /* @__PURE__ */ new Set();
      cids.forEach((cid) => {
        this.filterWithinSameLiveView(this.all(node, `[${PHX_COMPONENT}="${cid}"]`), node).forEach((parent) => {
          parentCids.add(cid);
          this.filterWithinSameLiveView(this.all(parent, `[${PHX_COMPONENT}]`), parent).map((el) => parseInt(el.getAttribute(PHX_COMPONENT))).forEach((childCID) => childrenCids.add(childCID));
        });
      });
      childrenCids.forEach((childCid) => parentCids.delete(childCid));
      return parentCids;
    },
    filterWithinSameLiveView(nodes, parent) {
      if (parent.querySelector(PHX_VIEW_SELECTOR)) {
        return nodes.filter((el) => this.withinSameLiveView(el, parent));
      } else {
        return nodes;
      }
    },
    withinSameLiveView(node, parent) {
      while (node = node.parentNode) {
        if (node.isSameNode(parent)) {
          return true;
        }
        if (node.getAttribute(PHX_SESSION) !== null) {
          return false;
        }
      }
    },
    private(el, key) {
      return el[PHX_PRIVATE] && el[PHX_PRIVATE][key];
    },
    deletePrivate(el, key) {
      el[PHX_PRIVATE] && delete el[PHX_PRIVATE][key];
    },
    putPrivate(el, key, value) {
      if (!el[PHX_PRIVATE]) {
        el[PHX_PRIVATE] = {};
      }
      el[PHX_PRIVATE][key] = value;
    },
    updatePrivate(el, key, defaultVal, updateFunc) {
      let existing = this.private(el, key);
      if (existing === void 0) {
        this.putPrivate(el, key, updateFunc(defaultVal));
      } else {
        this.putPrivate(el, key, updateFunc(existing));
      }
    },
    syncPendingAttrs(fromEl, toEl) {
      if (!fromEl.hasAttribute(PHX_REF_SRC)) {
        return;
      }
      PHX_EVENT_CLASSES.forEach((className) => {
        fromEl.classList.contains(className) && toEl.classList.add(className);
      });
      PHX_PENDING_ATTRS.filter((attr) => fromEl.hasAttribute(attr)).forEach((attr) => {
        toEl.setAttribute(attr, fromEl.getAttribute(attr));
      });
    },
    copyPrivates(target, source) {
      if (source[PHX_PRIVATE]) {
        target[PHX_PRIVATE] = source[PHX_PRIVATE];
      }
    },
    putTitle(str) {
      let titleEl = document.querySelector("title");
      if (titleEl) {
        let { prefix, suffix, default: defaultTitle } = titleEl.dataset;
        let isEmpty2 = typeof str !== "string" || str.trim() === "";
        if (isEmpty2 && typeof defaultTitle !== "string") {
          return;
        }
        let inner = isEmpty2 ? defaultTitle : str;
        document.title = `${prefix || ""}${inner || ""}${suffix || ""}`;
      } else {
        document.title = str;
      }
    },
    debounce(el, event, phxDebounce, defaultDebounce, phxThrottle, defaultThrottle, asyncFilter, callback) {
      let debounce = el.getAttribute(phxDebounce);
      let throttle = el.getAttribute(phxThrottle);
      if (debounce === "") {
        debounce = defaultDebounce;
      }
      if (throttle === "") {
        throttle = defaultThrottle;
      }
      let value = debounce || throttle;
      switch (value) {
        case null:
          return callback();
        case "blur":
          this.incCycle(el, "debounce-blur-cycle", () => {
            if (asyncFilter()) {
              callback();
            }
          });
          if (this.once(el, "debounce-blur")) {
            el.addEventListener("blur", () => this.triggerCycle(el, "debounce-blur-cycle"));
          }
          return;
        default:
          let timeout = parseInt(value);
          let trigger = () => throttle ? this.deletePrivate(el, THROTTLED) : callback();
          let currentCycle = this.incCycle(el, DEBOUNCE_TRIGGER, trigger);
          if (isNaN(timeout)) {
            return logError(`invalid throttle/debounce value: ${value}`);
          }
          if (throttle) {
            let newKeyDown = false;
            if (event.type === "keydown") {
              let prevKey = this.private(el, DEBOUNCE_PREV_KEY);
              this.putPrivate(el, DEBOUNCE_PREV_KEY, event.key);
              newKeyDown = prevKey !== event.key;
            }
            if (!newKeyDown && this.private(el, THROTTLED)) {
              return false;
            } else {
              callback();
              const t = setTimeout(() => {
                if (asyncFilter()) {
                  this.triggerCycle(el, DEBOUNCE_TRIGGER);
                }
              }, timeout);
              this.putPrivate(el, THROTTLED, t);
            }
          } else {
            setTimeout(() => {
              if (asyncFilter()) {
                this.triggerCycle(el, DEBOUNCE_TRIGGER, currentCycle);
              }
            }, timeout);
          }
          let form = el.form;
          if (form && this.once(form, "bind-debounce")) {
            form.addEventListener("submit", () => {
              Array.from(new FormData(form).entries(), ([name]) => {
                let input = form.querySelector(`[name="${name}"]`);
                this.incCycle(input, DEBOUNCE_TRIGGER);
                this.deletePrivate(input, THROTTLED);
              });
            });
          }
          if (this.once(el, "bind-debounce")) {
            el.addEventListener("blur", () => {
              clearTimeout(this.private(el, THROTTLED));
              this.triggerCycle(el, DEBOUNCE_TRIGGER);
            });
          }
      }
    },
    triggerCycle(el, key, currentCycle) {
      let [cycle, trigger] = this.private(el, key);
      if (!currentCycle) {
        currentCycle = cycle;
      }
      if (currentCycle === cycle) {
        this.incCycle(el, key);
        trigger();
      }
    },
    once(el, key) {
      if (this.private(el, key) === true) {
        return false;
      }
      this.putPrivate(el, key, true);
      return true;
    },
    incCycle(el, key, trigger = function() {
    }) {
      let [currentCycle] = this.private(el, key) || [0, trigger];
      currentCycle++;
      this.putPrivate(el, key, [currentCycle, trigger]);
      return currentCycle;
    },
    // maintains or adds privately used hook information
    // fromEl and toEl can be the same element in the case of a newly added node
    // fromEl and toEl can be any HTML node type, so we need to check if it's an element node
    maintainPrivateHooks(fromEl, toEl, phxViewportTop, phxViewportBottom) {
      if (fromEl.hasAttribute && fromEl.hasAttribute("data-phx-hook") && !toEl.hasAttribute("data-phx-hook")) {
        toEl.setAttribute("data-phx-hook", fromEl.getAttribute("data-phx-hook"));
      }
      if (toEl.hasAttribute && (toEl.hasAttribute(phxViewportTop) || toEl.hasAttribute(phxViewportBottom))) {
        toEl.setAttribute("data-phx-hook", "Phoenix.InfiniteScroll");
      }
    },
    putCustomElHook(el, hook) {
      if (el.isConnected) {
        el.setAttribute("data-phx-hook", "");
      } else {
        console.error(`
        hook attached to non-connected DOM element
        ensure you are calling createHook within your connectedCallback. ${el.outerHTML}
      `);
      }
      this.putPrivate(el, "custom-el-hook", hook);
    },
    getCustomElHook(el) {
      return this.private(el, "custom-el-hook");
    },
    isUsedInput(el) {
      return el.nodeType === Node.ELEMENT_NODE && (this.private(el, PHX_HAS_FOCUSED) || this.private(el, PHX_HAS_SUBMITTED));
    },
    resetForm(form) {
      Array.from(form.elements).forEach((input) => {
        this.deletePrivate(input, PHX_HAS_FOCUSED);
        this.deletePrivate(input, PHX_HAS_SUBMITTED);
      });
    },
    isPhxChild(node) {
      return node.getAttribute && node.getAttribute(PHX_PARENT_ID);
    },
    isPhxSticky(node) {
      return node.getAttribute && node.getAttribute(PHX_STICKY) !== null;
    },
    isChildOfAny(el, parents) {
      return !!parents.find((parent) => parent.contains(el));
    },
    firstPhxChild(el) {
      return this.isPhxChild(el) ? el : this.all(el, `[${PHX_PARENT_ID}]`)[0];
    },
    dispatchEvent(target, name, opts = {}) {
      let defaultBubble = true;
      let isUploadTarget = target.nodeName === "INPUT" && target.type === "file";
      if (isUploadTarget && name === "click") {
        defaultBubble = false;
      }
      let bubbles = opts.bubbles === void 0 ? defaultBubble : !!opts.bubbles;
      let eventOpts = { bubbles, cancelable: true, detail: opts.detail || {} };
      let event = name === "click" ? new MouseEvent("click", eventOpts) : new CustomEvent(name, eventOpts);
      target.dispatchEvent(event);
    },
    cloneNode(node, html) {
      if (typeof html === "undefined") {
        return node.cloneNode(true);
      } else {
        let cloned = node.cloneNode(false);
        cloned.innerHTML = html;
        return cloned;
      }
    },
    // merge attributes from source to target
    // if an element is ignored, we only merge data attributes
    // including removing data attributes that are no longer in the source
    mergeAttrs(target, source, opts = {}) {
      let exclude = new Set(opts.exclude || []);
      let isIgnored = opts.isIgnored;
      let sourceAttrs = source.attributes;
      for (let i = sourceAttrs.length - 1; i >= 0; i--) {
        let name = sourceAttrs[i].name;
        if (!exclude.has(name)) {
          const sourceValue = source.getAttribute(name);
          if (target.getAttribute(name) !== sourceValue && (!isIgnored || isIgnored && name.startsWith("data-"))) {
            target.setAttribute(name, sourceValue);
          }
        } else {
          if (name === "value" && target.value === source.value) {
            target.setAttribute("value", source.getAttribute(name));
          }
        }
      }
      let targetAttrs = target.attributes;
      for (let i = targetAttrs.length - 1; i >= 0; i--) {
        let name = targetAttrs[i].name;
        if (isIgnored) {
          if (name.startsWith("data-") && !source.hasAttribute(name) && !PHX_PENDING_ATTRS.includes(name)) {
            target.removeAttribute(name);
          }
        } else {
          if (!source.hasAttribute(name)) {
            target.removeAttribute(name);
          }
        }
      }
    },
    mergeFocusedInput(target, source) {
      if (!(target instanceof HTMLSelectElement)) {
        DOM.mergeAttrs(target, source, { exclude: ["value"] });
      }
      if (source.readOnly) {
        target.setAttribute("readonly", true);
      } else {
        target.removeAttribute("readonly");
      }
    },
    hasSelectionRange(el) {
      return el.setSelectionRange && (el.type === "text" || el.type === "textarea");
    },
    restoreFocus(focused, selectionStart, selectionEnd) {
      if (focused instanceof HTMLSelectElement) {
        focused.focus();
      }
      if (!DOM.isTextualInput(focused)) {
        return;
      }
      let wasFocused = focused.matches(":focus");
      if (!wasFocused) {
        focused.focus();
      }
      if (this.hasSelectionRange(focused)) {
        focused.setSelectionRange(selectionStart, selectionEnd);
      }
    },
    isFormInput(el) {
      return /^(?:input|select|textarea)$/i.test(el.tagName) && el.type !== "button";
    },
    syncAttrsToProps(el) {
      if (el instanceof HTMLInputElement && CHECKABLE_INPUTS.indexOf(el.type.toLocaleLowerCase()) >= 0) {
        el.checked = el.getAttribute("checked") !== null;
      }
    },
    isTextualInput(el) {
      return FOCUSABLE_INPUTS.indexOf(el.type) >= 0;
    },
    isNowTriggerFormExternal(el, phxTriggerExternal) {
      return el.getAttribute && el.getAttribute(phxTriggerExternal) !== null && document.body.contains(el);
    },
    cleanChildNodes(container, phxUpdate) {
      if (DOM.isPhxUpdate(container, phxUpdate, ["append", "prepend"])) {
        let toRemove = [];
        container.childNodes.forEach((childNode) => {
          if (!childNode.id) {
            let isEmptyTextNode = childNode.nodeType === Node.TEXT_NODE && childNode.nodeValue.trim() === "";
            if (!isEmptyTextNode && childNode.nodeType !== Node.COMMENT_NODE) {
              logError(`only HTML element tags with an id are allowed inside containers with phx-update.

removing illegal node: "${(childNode.outerHTML || childNode.nodeValue).trim()}"

`);
            }
            toRemove.push(childNode);
          }
        });
        toRemove.forEach((childNode) => childNode.remove());
      }
    },
    replaceRootContainer(container, tagName, attrs) {
      let retainedAttrs = /* @__PURE__ */ new Set(["id", PHX_SESSION, PHX_STATIC, PHX_MAIN, PHX_ROOT_ID]);
      if (container.tagName.toLowerCase() === tagName.toLowerCase()) {
        Array.from(container.attributes).filter((attr) => !retainedAttrs.has(attr.name.toLowerCase())).forEach((attr) => container.removeAttribute(attr.name));
        Object.keys(attrs).filter((name) => !retainedAttrs.has(name.toLowerCase())).forEach((attr) => container.setAttribute(attr, attrs[attr]));
        return container;
      } else {
        let newContainer = document.createElement(tagName);
        Object.keys(attrs).forEach((attr) => newContainer.setAttribute(attr, attrs[attr]));
        retainedAttrs.forEach((attr) => newContainer.setAttribute(attr, container.getAttribute(attr)));
        newContainer.innerHTML = container.innerHTML;
        container.replaceWith(newContainer);
        return newContainer;
      }
    },
    getSticky(el, name, defaultVal) {
      let op = (DOM.private(el, "sticky") || []).find(([existingName]) => name === existingName);
      if (op) {
        let [_name, _op, stashedResult] = op;
        return stashedResult;
      } else {
        return typeof defaultVal === "function" ? defaultVal() : defaultVal;
      }
    },
    deleteSticky(el, name) {
      this.updatePrivate(el, "sticky", [], (ops) => {
        return ops.filter(([existingName, _]) => existingName !== name);
      });
    },
    putSticky(el, name, op) {
      let stashedResult = op(el);
      this.updatePrivate(el, "sticky", [], (ops) => {
        let existingIndex = ops.findIndex(([existingName]) => name === existingName);
        if (existingIndex >= 0) {
          ops[existingIndex] = [name, op, stashedResult];
        } else {
          ops.push([name, op, stashedResult]);
        }
        return ops;
      });
    },
    applyStickyOperations(el) {
      let ops = DOM.private(el, "sticky");
      if (!ops) {
        return;
      }
      ops.forEach(([name, op, _stashed]) => this.putSticky(el, name, op));
    },
    isLocked(el) {
      return el.hasAttribute && el.hasAttribute(PHX_REF_LOCK);
    }
  };
  var dom_default = DOM;
  var UploadEntry = class {
    static isActive(fileEl, file) {
      let isNew = file._phxRef === void 0;
      let activeRefs = fileEl.getAttribute(PHX_ACTIVE_ENTRY_REFS).split(",");
      let isActive = activeRefs.indexOf(LiveUploader.genFileRef(file)) >= 0;
      return file.size > 0 && (isNew || isActive);
    }
    static isPreflighted(fileEl, file) {
      let preflightedRefs = fileEl.getAttribute(PHX_PREFLIGHTED_REFS).split(",");
      let isPreflighted = preflightedRefs.indexOf(LiveUploader.genFileRef(file)) >= 0;
      return isPreflighted && this.isActive(fileEl, file);
    }
    static isPreflightInProgress(file) {
      return file._preflightInProgress === true;
    }
    static markPreflightInProgress(file) {
      file._preflightInProgress = true;
    }
    constructor(fileEl, file, view, autoUpload) {
      this.ref = LiveUploader.genFileRef(file);
      this.fileEl = fileEl;
      this.file = file;
      this.view = view;
      this.meta = null;
      this._isCancelled = false;
      this._isDone = false;
      this._progress = 0;
      this._lastProgressSent = -1;
      this._onDone = function() {
      };
      this._onElUpdated = this.onElUpdated.bind(this);
      this.fileEl.addEventListener(PHX_LIVE_FILE_UPDATED, this._onElUpdated);
      this.autoUpload = autoUpload;
    }
    metadata() {
      return this.meta;
    }
    progress(progress) {
      this._progress = Math.floor(progress);
      if (this._progress > this._lastProgressSent) {
        if (this._progress >= 100) {
          this._progress = 100;
          this._lastProgressSent = 100;
          this._isDone = true;
          this.view.pushFileProgress(this.fileEl, this.ref, 100, () => {
            LiveUploader.untrackFile(this.fileEl, this.file);
            this._onDone();
          });
        } else {
          this._lastProgressSent = this._progress;
          this.view.pushFileProgress(this.fileEl, this.ref, this._progress);
        }
      }
    }
    isCancelled() {
      return this._isCancelled;
    }
    cancel() {
      this.file._preflightInProgress = false;
      this._isCancelled = true;
      this._isDone = true;
      this._onDone();
    }
    isDone() {
      return this._isDone;
    }
    error(reason = "failed") {
      this.fileEl.removeEventListener(PHX_LIVE_FILE_UPDATED, this._onElUpdated);
      this.view.pushFileProgress(this.fileEl, this.ref, { error: reason });
      if (!this.isAutoUpload()) {
        LiveUploader.clearFiles(this.fileEl);
      }
    }
    isAutoUpload() {
      return this.autoUpload;
    }
    //private
    onDone(callback) {
      this._onDone = () => {
        this.fileEl.removeEventListener(PHX_LIVE_FILE_UPDATED, this._onElUpdated);
        callback();
      };
    }
    onElUpdated() {
      let activeRefs = this.fileEl.getAttribute(PHX_ACTIVE_ENTRY_REFS).split(",");
      if (activeRefs.indexOf(this.ref) === -1) {
        LiveUploader.untrackFile(this.fileEl, this.file);
        this.cancel();
      }
    }
    toPreflightPayload() {
      return {
        last_modified: this.file.lastModified,
        name: this.file.name,
        relative_path: this.file.webkitRelativePath,
        size: this.file.size,
        type: this.file.type,
        ref: this.ref,
        meta: typeof this.file.meta === "function" ? this.file.meta() : void 0
      };
    }
    uploader(uploaders) {
      if (this.meta.uploader) {
        let callback = uploaders[this.meta.uploader] || logError(`no uploader configured for ${this.meta.uploader}`);
        return { name: this.meta.uploader, callback };
      } else {
        return { name: "channel", callback: channelUploader };
      }
    }
    zipPostFlight(resp) {
      this.meta = resp.entries[this.ref];
      if (!this.meta) {
        logError(`no preflight upload response returned with ref ${this.ref}`, { input: this.fileEl, response: resp });
      }
    }
  };
  var liveUploaderFileRef = 0;
  var LiveUploader = class _LiveUploader {
    static genFileRef(file) {
      let ref = file._phxRef;
      if (ref !== void 0) {
        return ref;
      } else {
        file._phxRef = (liveUploaderFileRef++).toString();
        return file._phxRef;
      }
    }
    static getEntryDataURL(inputEl, ref, callback) {
      let file = this.activeFiles(inputEl).find((file2) => this.genFileRef(file2) === ref);
      callback(URL.createObjectURL(file));
    }
    static hasUploadsInProgress(formEl) {
      let active = 0;
      dom_default.findUploadInputs(formEl).forEach((input) => {
        if (input.getAttribute(PHX_PREFLIGHTED_REFS) !== input.getAttribute(PHX_DONE_REFS)) {
          active++;
        }
      });
      return active > 0;
    }
    static serializeUploads(inputEl) {
      let files = this.activeFiles(inputEl);
      let fileData = {};
      files.forEach((file) => {
        let entry = { path: inputEl.name };
        let uploadRef = inputEl.getAttribute(PHX_UPLOAD_REF);
        fileData[uploadRef] = fileData[uploadRef] || [];
        entry.ref = this.genFileRef(file);
        entry.last_modified = file.lastModified;
        entry.name = file.name || entry.ref;
        entry.relative_path = file.webkitRelativePath;
        entry.type = file.type;
        entry.size = file.size;
        if (typeof file.meta === "function") {
          entry.meta = file.meta();
        }
        fileData[uploadRef].push(entry);
      });
      return fileData;
    }
    static clearFiles(inputEl) {
      inputEl.value = null;
      inputEl.removeAttribute(PHX_UPLOAD_REF);
      dom_default.putPrivate(inputEl, "files", []);
    }
    static untrackFile(inputEl, file) {
      dom_default.putPrivate(inputEl, "files", dom_default.private(inputEl, "files").filter((f) => !Object.is(f, file)));
    }
    static trackFiles(inputEl, files, dataTransfer) {
      if (inputEl.getAttribute("multiple") !== null) {
        let newFiles = files.filter((file) => !this.activeFiles(inputEl).find((f) => Object.is(f, file)));
        dom_default.updatePrivate(inputEl, "files", [], (existing) => existing.concat(newFiles));
        inputEl.value = null;
      } else {
        if (dataTransfer && dataTransfer.files.length > 0) {
          inputEl.files = dataTransfer.files;
        }
        dom_default.putPrivate(inputEl, "files", files);
      }
    }
    static activeFileInputs(formEl) {
      let fileInputs = dom_default.findUploadInputs(formEl);
      return Array.from(fileInputs).filter((el) => el.files && this.activeFiles(el).length > 0);
    }
    static activeFiles(input) {
      return (dom_default.private(input, "files") || []).filter((f) => UploadEntry.isActive(input, f));
    }
    static inputsAwaitingPreflight(formEl) {
      let fileInputs = dom_default.findUploadInputs(formEl);
      return Array.from(fileInputs).filter((input) => this.filesAwaitingPreflight(input).length > 0);
    }
    static filesAwaitingPreflight(input) {
      return this.activeFiles(input).filter((f) => !UploadEntry.isPreflighted(input, f) && !UploadEntry.isPreflightInProgress(f));
    }
    static markPreflightInProgress(entries) {
      entries.forEach((entry) => UploadEntry.markPreflightInProgress(entry.file));
    }
    constructor(inputEl, view, onComplete) {
      this.autoUpload = dom_default.isAutoUpload(inputEl);
      this.view = view;
      this.onComplete = onComplete;
      this._entries = Array.from(_LiveUploader.filesAwaitingPreflight(inputEl) || []).map((file) => new UploadEntry(inputEl, file, view, this.autoUpload));
      _LiveUploader.markPreflightInProgress(this._entries);
      this.numEntriesInProgress = this._entries.length;
    }
    isAutoUpload() {
      return this.autoUpload;
    }
    entries() {
      return this._entries;
    }
    initAdapterUpload(resp, onError, liveSocket2) {
      this._entries = this._entries.map((entry) => {
        if (entry.isCancelled()) {
          this.numEntriesInProgress--;
          if (this.numEntriesInProgress === 0) {
            this.onComplete();
          }
        } else {
          entry.zipPostFlight(resp);
          entry.onDone(() => {
            this.numEntriesInProgress--;
            if (this.numEntriesInProgress === 0) {
              this.onComplete();
            }
          });
        }
        return entry;
      });
      let groupedEntries = this._entries.reduce((acc, entry) => {
        if (!entry.meta) {
          return acc;
        }
        let { name, callback } = entry.uploader(liveSocket2.uploaders);
        acc[name] = acc[name] || { callback, entries: [] };
        acc[name].entries.push(entry);
        return acc;
      }, {});
      for (let name in groupedEntries) {
        let { callback, entries } = groupedEntries[name];
        callback(entries, onError, resp, liveSocket2);
      }
    }
  };
  var ARIA = {
    anyOf(instance, classes) {
      return classes.find((name) => instance instanceof name);
    },
    isFocusable(el, interactiveOnly) {
      return el instanceof HTMLAnchorElement && el.rel !== "ignore" || el instanceof HTMLAreaElement && el.href !== void 0 || !el.disabled && this.anyOf(el, [HTMLInputElement, HTMLSelectElement, HTMLTextAreaElement, HTMLButtonElement]) || el instanceof HTMLIFrameElement || (el.tabIndex > 0 || !interactiveOnly && el.getAttribute("tabindex") !== null && el.getAttribute("aria-hidden") !== "true");
    },
    attemptFocus(el, interactiveOnly) {
      if (this.isFocusable(el, interactiveOnly)) {
        try {
          el.focus();
        } catch (e) {
        }
      }
      return !!document.activeElement && document.activeElement.isSameNode(el);
    },
    focusFirstInteractive(el) {
      let child = el.firstElementChild;
      while (child) {
        if (this.attemptFocus(child, true) || this.focusFirstInteractive(child, true)) {
          return true;
        }
        child = child.nextElementSibling;
      }
    },
    focusFirst(el) {
      let child = el.firstElementChild;
      while (child) {
        if (this.attemptFocus(child) || this.focusFirst(child)) {
          return true;
        }
        child = child.nextElementSibling;
      }
    },
    focusLast(el) {
      let child = el.lastElementChild;
      while (child) {
        if (this.attemptFocus(child) || this.focusLast(child)) {
          return true;
        }
        child = child.previousElementSibling;
      }
    }
  };
  var aria_default = ARIA;
  var Hooks = {
    LiveFileUpload: {
      activeRefs() {
        return this.el.getAttribute(PHX_ACTIVE_ENTRY_REFS);
      },
      preflightedRefs() {
        return this.el.getAttribute(PHX_PREFLIGHTED_REFS);
      },
      mounted() {
        this.preflightedWas = this.preflightedRefs();
      },
      updated() {
        let newPreflights = this.preflightedRefs();
        if (this.preflightedWas !== newPreflights) {
          this.preflightedWas = newPreflights;
          if (newPreflights === "") {
            this.__view().cancelSubmit(this.el.form);
          }
        }
        if (this.activeRefs() === "") {
          this.el.value = null;
        }
        this.el.dispatchEvent(new CustomEvent(PHX_LIVE_FILE_UPDATED));
      }
    },
    LiveImgPreview: {
      mounted() {
        this.ref = this.el.getAttribute("data-phx-entry-ref");
        this.inputEl = document.getElementById(this.el.getAttribute(PHX_UPLOAD_REF));
        LiveUploader.getEntryDataURL(this.inputEl, this.ref, (url) => {
          this.url = url;
          this.el.src = url;
        });
      },
      destroyed() {
        URL.revokeObjectURL(this.url);
      }
    },
    FocusWrap: {
      mounted() {
        this.focusStart = this.el.firstElementChild;
        this.focusEnd = this.el.lastElementChild;
        this.focusStart.addEventListener("focus", (e) => {
          if (!e.relatedTarget || !this.el.contains(e.relatedTarget)) {
            const nextFocus = e.target.nextElementSibling;
            aria_default.attemptFocus(nextFocus) || aria_default.focusFirst(nextFocus);
          } else {
            aria_default.focusLast(this.el);
          }
        });
        this.focusEnd.addEventListener("focus", (e) => {
          if (!e.relatedTarget || !this.el.contains(e.relatedTarget)) {
            const nextFocus = e.target.previousElementSibling;
            aria_default.attemptFocus(nextFocus) || aria_default.focusLast(nextFocus);
          } else {
            aria_default.focusFirst(this.el);
          }
        });
        this.el.addEventListener("phx:show-end", () => this.el.focus());
        if (window.getComputedStyle(this.el).display !== "none") {
          aria_default.focusFirst(this.el);
        }
      }
    }
  };
  var findScrollContainer = (el) => {
    if (["HTML", "BODY"].indexOf(el.nodeName.toUpperCase()) >= 0)
      return null;
    if (["scroll", "auto"].indexOf(getComputedStyle(el).overflowY) >= 0)
      return el;
    return findScrollContainer(el.parentElement);
  };
  var scrollTop = (scrollContainer) => {
    if (scrollContainer) {
      return scrollContainer.scrollTop;
    } else {
      return document.documentElement.scrollTop || document.body.scrollTop;
    }
  };
  var bottom = (scrollContainer) => {
    if (scrollContainer) {
      return scrollContainer.getBoundingClientRect().bottom;
    } else {
      return window.innerHeight || document.documentElement.clientHeight;
    }
  };
  var top = (scrollContainer) => {
    if (scrollContainer) {
      return scrollContainer.getBoundingClientRect().top;
    } else {
      return 0;
    }
  };
  var isAtViewportTop = (el, scrollContainer) => {
    let rect = el.getBoundingClientRect();
    return Math.ceil(rect.top) >= top(scrollContainer) && Math.ceil(rect.left) >= 0 && Math.floor(rect.top) <= bottom(scrollContainer);
  };
  var isAtViewportBottom = (el, scrollContainer) => {
    let rect = el.getBoundingClientRect();
    return Math.ceil(rect.bottom) >= top(scrollContainer) && Math.ceil(rect.left) >= 0 && Math.floor(rect.bottom) <= bottom(scrollContainer);
  };
  var isWithinViewport = (el, scrollContainer) => {
    let rect = el.getBoundingClientRect();
    return Math.ceil(rect.top) >= top(scrollContainer) && Math.ceil(rect.left) >= 0 && Math.floor(rect.top) <= bottom(scrollContainer);
  };
  Hooks.InfiniteScroll = {
    mounted() {
      this.scrollContainer = findScrollContainer(this.el);
      let scrollBefore = scrollTop(this.scrollContainer);
      let topOverran = false;
      let throttleInterval = 500;
      let pendingOp = null;
      let onTopOverrun = this.throttle(throttleInterval, (topEvent, firstChild) => {
        pendingOp = () => true;
        this.liveSocket.execJSHookPush(this.el, topEvent, { id: firstChild.id, _overran: true }, () => {
          pendingOp = null;
        });
      });
      let onFirstChildAtTop = this.throttle(throttleInterval, (topEvent, firstChild) => {
        pendingOp = () => firstChild.scrollIntoView({ block: "start" });
        this.liveSocket.execJSHookPush(this.el, topEvent, { id: firstChild.id }, () => {
          pendingOp = null;
          window.requestAnimationFrame(() => {
            if (!isWithinViewport(firstChild, this.scrollContainer)) {
              firstChild.scrollIntoView({ block: "start" });
            }
          });
        });
      });
      let onLastChildAtBottom = this.throttle(throttleInterval, (bottomEvent, lastChild) => {
        pendingOp = () => lastChild.scrollIntoView({ block: "end" });
        this.liveSocket.execJSHookPush(this.el, bottomEvent, { id: lastChild.id }, () => {
          pendingOp = null;
          window.requestAnimationFrame(() => {
            if (!isWithinViewport(lastChild, this.scrollContainer)) {
              lastChild.scrollIntoView({ block: "end" });
            }
          });
        });
      });
      this.onScroll = (_e) => {
        let scrollNow = scrollTop(this.scrollContainer);
        if (pendingOp) {
          scrollBefore = scrollNow;
          return pendingOp();
        }
        let rect = this.el.getBoundingClientRect();
        let topEvent = this.el.getAttribute(this.liveSocket.binding("viewport-top"));
        let bottomEvent = this.el.getAttribute(this.liveSocket.binding("viewport-bottom"));
        let lastChild = this.el.lastElementChild;
        let firstChild = this.el.firstElementChild;
        let isScrollingUp = scrollNow < scrollBefore;
        let isScrollingDown = scrollNow > scrollBefore;
        if (isScrollingUp && topEvent && !topOverran && rect.top >= 0) {
          topOverran = true;
          onTopOverrun(topEvent, firstChild);
        } else if (isScrollingDown && topOverran && rect.top <= 0) {
          topOverran = false;
        }
        if (topEvent && isScrollingUp && isAtViewportTop(firstChild, this.scrollContainer)) {
          onFirstChildAtTop(topEvent, firstChild);
        } else if (bottomEvent && isScrollingDown && isAtViewportBottom(lastChild, this.scrollContainer)) {
          onLastChildAtBottom(bottomEvent, lastChild);
        }
        scrollBefore = scrollNow;
      };
      if (this.scrollContainer) {
        this.scrollContainer.addEventListener("scroll", this.onScroll);
      } else {
        window.addEventListener("scroll", this.onScroll);
      }
    },
    destroyed() {
      if (this.scrollContainer) {
        this.scrollContainer.removeEventListener("scroll", this.onScroll);
      } else {
        window.removeEventListener("scroll", this.onScroll);
      }
    },
    throttle(interval, callback) {
      let lastCallAt = 0;
      let timer;
      return (...args) => {
        let now = Date.now();
        let remainingTime = interval - (now - lastCallAt);
        if (remainingTime <= 0 || remainingTime > interval) {
          if (timer) {
            clearTimeout(timer);
            timer = null;
          }
          lastCallAt = now;
          callback(...args);
        } else if (!timer) {
          timer = setTimeout(() => {
            lastCallAt = Date.now();
            timer = null;
            callback(...args);
          }, remainingTime);
        }
      };
    }
  };
  var hooks_default = Hooks;
  var ElementRef = class {
    static onUnlock(el, callback) {
      if (!dom_default.isLocked(el) && !el.closest(`[${PHX_REF_LOCK}]`)) {
        return callback();
      }
      const closestLock = el.closest(`[${PHX_REF_LOCK}]`);
      const ref = closestLock.closest(`[${PHX_REF_LOCK}]`).getAttribute(PHX_REF_LOCK);
      closestLock.addEventListener(`phx:undo-lock:${ref}`, () => {
        callback();
      }, { once: true });
    }
    constructor(el) {
      this.el = el;
      this.loadingRef = el.hasAttribute(PHX_REF_LOADING) ? parseInt(el.getAttribute(PHX_REF_LOADING), 10) : null;
      this.lockRef = el.hasAttribute(PHX_REF_LOCK) ? parseInt(el.getAttribute(PHX_REF_LOCK), 10) : null;
    }
    // public
    maybeUndo(ref, phxEvent, eachCloneCallback) {
      if (!this.isWithin(ref)) {
        return;
      }
      this.undoLocks(ref, phxEvent, eachCloneCallback);
      this.undoLoading(ref, phxEvent);
      if (this.isFullyResolvedBy(ref)) {
        this.el.removeAttribute(PHX_REF_SRC);
      }
    }
    // private
    isWithin(ref) {
      return !(this.loadingRef !== null && this.loadingRef > ref && (this.lockRef !== null && this.lockRef > ref));
    }
    // Check for cloned PHX_REF_LOCK element that has been morphed behind
    // the scenes while this element was locked in the DOM.
    // When we apply the cloned tree to the active DOM element, we must
    //
    //   1. execute pending mounted hooks for nodes now in the DOM
    //   2. undo any ref inside the cloned tree that has since been ack'd
    undoLocks(ref, phxEvent, eachCloneCallback) {
      if (!this.isLockUndoneBy(ref)) {
        return;
      }
      let clonedTree = dom_default.private(this.el, PHX_REF_LOCK);
      if (clonedTree) {
        eachCloneCallback(clonedTree);
        dom_default.deletePrivate(this.el, PHX_REF_LOCK);
      }
      this.el.removeAttribute(PHX_REF_LOCK);
      let opts = { detail: { ref, event: phxEvent }, bubbles: true, cancelable: false };
      this.el.dispatchEvent(new CustomEvent(`phx:undo-lock:${this.lockRef}`, opts));
    }
    undoLoading(ref, phxEvent) {
      if (!this.isLoadingUndoneBy(ref)) {
        if (this.canUndoLoading(ref) && this.el.classList.contains("phx-submit-loading")) {
          this.el.classList.remove("phx-change-loading");
        }
        return;
      }
      if (this.canUndoLoading(ref)) {
        this.el.removeAttribute(PHX_REF_LOADING);
        let disabledVal = this.el.getAttribute(PHX_DISABLED);
        let readOnlyVal = this.el.getAttribute(PHX_READONLY);
        if (readOnlyVal !== null) {
          this.el.readOnly = readOnlyVal === "true" ? true : false;
          this.el.removeAttribute(PHX_READONLY);
        }
        if (disabledVal !== null) {
          this.el.disabled = disabledVal === "true" ? true : false;
          this.el.removeAttribute(PHX_DISABLED);
        }
        let disableRestore = this.el.getAttribute(PHX_DISABLE_WITH_RESTORE);
        if (disableRestore !== null) {
          this.el.innerText = disableRestore;
          this.el.removeAttribute(PHX_DISABLE_WITH_RESTORE);
        }
        let opts = { detail: { ref, event: phxEvent }, bubbles: true, cancelable: false };
        this.el.dispatchEvent(new CustomEvent(`phx:undo-loading:${this.loadingRef}`, opts));
      }
      PHX_EVENT_CLASSES.forEach((name) => {
        if (name !== "phx-submit-loading" || this.canUndoLoading(ref)) {
          dom_default.removeClass(this.el, name);
        }
      });
    }
    isLoadingUndoneBy(ref) {
      return this.loadingRef === null ? false : this.loadingRef <= ref;
    }
    isLockUndoneBy(ref) {
      return this.lockRef === null ? false : this.lockRef <= ref;
    }
    isFullyResolvedBy(ref) {
      return (this.loadingRef === null || this.loadingRef <= ref) && (this.lockRef === null || this.lockRef <= ref);
    }
    // only remove the phx-submit-loading class if we are not locked
    canUndoLoading(ref) {
      return this.lockRef === null || this.lockRef <= ref;
    }
  };
  var DOMPostMorphRestorer = class {
    constructor(containerBefore, containerAfter, updateType) {
      let idsBefore = /* @__PURE__ */ new Set();
      let idsAfter = new Set([...containerAfter.children].map((child) => child.id));
      let elementsToModify = [];
      Array.from(containerBefore.children).forEach((child) => {
        if (child.id) {
          idsBefore.add(child.id);
          if (idsAfter.has(child.id)) {
            let previousElementId = child.previousElementSibling && child.previousElementSibling.id;
            elementsToModify.push({ elementId: child.id, previousElementId });
          }
        }
      });
      this.containerId = containerAfter.id;
      this.updateType = updateType;
      this.elementsToModify = elementsToModify;
      this.elementIdsToAdd = [...idsAfter].filter((id) => !idsBefore.has(id));
    }
    // We do the following to optimize append/prepend operations:
    //   1) Track ids of modified elements & of new elements
    //   2) All the modified elements are put back in the correct position in the DOM tree
    //      by storing the id of their previous sibling
    //   3) New elements are going to be put in the right place by morphdom during append.
    //      For prepend, we move them to the first position in the container
    perform() {
      let container = dom_default.byId(this.containerId);
      this.elementsToModify.forEach((elementToModify) => {
        if (elementToModify.previousElementId) {
          maybe(document.getElementById(elementToModify.previousElementId), (previousElem) => {
            maybe(document.getElementById(elementToModify.elementId), (elem) => {
              let isInRightPlace = elem.previousElementSibling && elem.previousElementSibling.id == previousElem.id;
              if (!isInRightPlace) {
                previousElem.insertAdjacentElement("afterend", elem);
              }
            });
          });
        } else {
          maybe(document.getElementById(elementToModify.elementId), (elem) => {
            let isInRightPlace = elem.previousElementSibling == null;
            if (!isInRightPlace) {
              container.insertAdjacentElement("afterbegin", elem);
            }
          });
        }
      });
      if (this.updateType == "prepend") {
        this.elementIdsToAdd.reverse().forEach((elemId) => {
          maybe(document.getElementById(elemId), (elem) => container.insertAdjacentElement("afterbegin", elem));
        });
      }
    }
  };
  var DOCUMENT_FRAGMENT_NODE = 11;
  function morphAttrs(fromNode, toNode) {
    var toNodeAttrs = toNode.attributes;
    var attr;
    var attrName;
    var attrNamespaceURI;
    var attrValue;
    var fromValue;
    if (toNode.nodeType === DOCUMENT_FRAGMENT_NODE || fromNode.nodeType === DOCUMENT_FRAGMENT_NODE) {
      return;
    }
    for (var i = toNodeAttrs.length - 1; i >= 0; i--) {
      attr = toNodeAttrs[i];
      attrName = attr.name;
      attrNamespaceURI = attr.namespaceURI;
      attrValue = attr.value;
      if (attrNamespaceURI) {
        attrName = attr.localName || attrName;
        fromValue = fromNode.getAttributeNS(attrNamespaceURI, attrName);
        if (fromValue !== attrValue) {
          if (attr.prefix === "xmlns") {
            attrName = attr.name;
          }
          fromNode.setAttributeNS(attrNamespaceURI, attrName, attrValue);
        }
      } else {
        fromValue = fromNode.getAttribute(attrName);
        if (fromValue !== attrValue) {
          fromNode.setAttribute(attrName, attrValue);
        }
      }
    }
    var fromNodeAttrs = fromNode.attributes;
    for (var d = fromNodeAttrs.length - 1; d >= 0; d--) {
      attr = fromNodeAttrs[d];
      attrName = attr.name;
      attrNamespaceURI = attr.namespaceURI;
      if (attrNamespaceURI) {
        attrName = attr.localName || attrName;
        if (!toNode.hasAttributeNS(attrNamespaceURI, attrName)) {
          fromNode.removeAttributeNS(attrNamespaceURI, attrName);
        }
      } else {
        if (!toNode.hasAttribute(attrName)) {
          fromNode.removeAttribute(attrName);
        }
      }
    }
  }
  var range;
  var NS_XHTML = "http://www.w3.org/1999/xhtml";
  var doc = typeof document === "undefined" ? void 0 : document;
  var HAS_TEMPLATE_SUPPORT = !!doc && "content" in doc.createElement("template");
  var HAS_RANGE_SUPPORT = !!doc && doc.createRange && "createContextualFragment" in doc.createRange();
  function createFragmentFromTemplate(str) {
    var template = doc.createElement("template");
    template.innerHTML = str;
    return template.content.childNodes[0];
  }
  function createFragmentFromRange(str) {
    if (!range) {
      range = doc.createRange();
      range.selectNode(doc.body);
    }
    var fragment = range.createContextualFragment(str);
    return fragment.childNodes[0];
  }
  function createFragmentFromWrap(str) {
    var fragment = doc.createElement("body");
    fragment.innerHTML = str;
    return fragment.childNodes[0];
  }
  function toElement(str) {
    str = str.trim();
    if (HAS_TEMPLATE_SUPPORT) {
      return createFragmentFromTemplate(str);
    } else if (HAS_RANGE_SUPPORT) {
      return createFragmentFromRange(str);
    }
    return createFragmentFromWrap(str);
  }
  function compareNodeNames(fromEl, toEl) {
    var fromNodeName = fromEl.nodeName;
    var toNodeName = toEl.nodeName;
    var fromCodeStart, toCodeStart;
    if (fromNodeName === toNodeName) {
      return true;
    }
    fromCodeStart = fromNodeName.charCodeAt(0);
    toCodeStart = toNodeName.charCodeAt(0);
    if (fromCodeStart <= 90 && toCodeStart >= 97) {
      return fromNodeName === toNodeName.toUpperCase();
    } else if (toCodeStart <= 90 && fromCodeStart >= 97) {
      return toNodeName === fromNodeName.toUpperCase();
    } else {
      return false;
    }
  }
  function createElementNS(name, namespaceURI) {
    return !namespaceURI || namespaceURI === NS_XHTML ? doc.createElement(name) : doc.createElementNS(namespaceURI, name);
  }
  function moveChildren(fromEl, toEl) {
    var curChild = fromEl.firstChild;
    while (curChild) {
      var nextChild = curChild.nextSibling;
      toEl.appendChild(curChild);
      curChild = nextChild;
    }
    return toEl;
  }
  function syncBooleanAttrProp(fromEl, toEl, name) {
    if (fromEl[name] !== toEl[name]) {
      fromEl[name] = toEl[name];
      if (fromEl[name]) {
        fromEl.setAttribute(name, "");
      } else {
        fromEl.removeAttribute(name);
      }
    }
  }
  var specialElHandlers = {
    OPTION: function(fromEl, toEl) {
      var parentNode = fromEl.parentNode;
      if (parentNode) {
        var parentName = parentNode.nodeName.toUpperCase();
        if (parentName === "OPTGROUP") {
          parentNode = parentNode.parentNode;
          parentName = parentNode && parentNode.nodeName.toUpperCase();
        }
        if (parentName === "SELECT" && !parentNode.hasAttribute("multiple")) {
          if (fromEl.hasAttribute("selected") && !toEl.selected) {
            fromEl.setAttribute("selected", "selected");
            fromEl.removeAttribute("selected");
          }
          parentNode.selectedIndex = -1;
        }
      }
      syncBooleanAttrProp(fromEl, toEl, "selected");
    },
    /**
     * The "value" attribute is special for the <input> element since it sets
     * the initial value. Changing the "value" attribute without changing the
     * "value" property will have no effect since it is only used to the set the
     * initial value.  Similar for the "checked" attribute, and "disabled".
     */
    INPUT: function(fromEl, toEl) {
      syncBooleanAttrProp(fromEl, toEl, "checked");
      syncBooleanAttrProp(fromEl, toEl, "disabled");
      if (fromEl.value !== toEl.value) {
        fromEl.value = toEl.value;
      }
      if (!toEl.hasAttribute("value")) {
        fromEl.removeAttribute("value");
      }
    },
    TEXTAREA: function(fromEl, toEl) {
      var newValue = toEl.value;
      if (fromEl.value !== newValue) {
        fromEl.value = newValue;
      }
      var firstChild = fromEl.firstChild;
      if (firstChild) {
        var oldValue = firstChild.nodeValue;
        if (oldValue == newValue || !newValue && oldValue == fromEl.placeholder) {
          return;
        }
        firstChild.nodeValue = newValue;
      }
    },
    SELECT: function(fromEl, toEl) {
      if (!toEl.hasAttribute("multiple")) {
        var selectedIndex = -1;
        var i = 0;
        var curChild = fromEl.firstChild;
        var optgroup;
        var nodeName;
        while (curChild) {
          nodeName = curChild.nodeName && curChild.nodeName.toUpperCase();
          if (nodeName === "OPTGROUP") {
            optgroup = curChild;
            curChild = optgroup.firstChild;
          } else {
            if (nodeName === "OPTION") {
              if (curChild.hasAttribute("selected")) {
                selectedIndex = i;
                break;
              }
              i++;
            }
            curChild = curChild.nextSibling;
            if (!curChild && optgroup) {
              curChild = optgroup.nextSibling;
              optgroup = null;
            }
          }
        }
        fromEl.selectedIndex = selectedIndex;
      }
    }
  };
  var ELEMENT_NODE = 1;
  var DOCUMENT_FRAGMENT_NODE$1 = 11;
  var TEXT_NODE = 3;
  var COMMENT_NODE = 8;
  function noop() {
  }
  function defaultGetNodeKey(node) {
    if (node) {
      return node.getAttribute && node.getAttribute("id") || node.id;
    }
  }
  function morphdomFactory(morphAttrs2) {
    return function morphdom2(fromNode, toNode, options) {
      if (!options) {
        options = {};
      }
      if (typeof toNode === "string") {
        if (fromNode.nodeName === "#document" || fromNode.nodeName === "HTML" || fromNode.nodeName === "BODY") {
          var toNodeHtml = toNode;
          toNode = doc.createElement("html");
          toNode.innerHTML = toNodeHtml;
        } else {
          toNode = toElement(toNode);
        }
      } else if (toNode.nodeType === DOCUMENT_FRAGMENT_NODE$1) {
        toNode = toNode.firstElementChild;
      }
      var getNodeKey = options.getNodeKey || defaultGetNodeKey;
      var onBeforeNodeAdded = options.onBeforeNodeAdded || noop;
      var onNodeAdded = options.onNodeAdded || noop;
      var onBeforeElUpdated = options.onBeforeElUpdated || noop;
      var onElUpdated = options.onElUpdated || noop;
      var onBeforeNodeDiscarded = options.onBeforeNodeDiscarded || noop;
      var onNodeDiscarded = options.onNodeDiscarded || noop;
      var onBeforeElChildrenUpdated = options.onBeforeElChildrenUpdated || noop;
      var skipFromChildren = options.skipFromChildren || noop;
      var addChild = options.addChild || function(parent, child) {
        return parent.appendChild(child);
      };
      var childrenOnly = options.childrenOnly === true;
      var fromNodesLookup = /* @__PURE__ */ Object.create(null);
      var keyedRemovalList = [];
      function addKeyedRemoval(key) {
        keyedRemovalList.push(key);
      }
      function walkDiscardedChildNodes(node, skipKeyedNodes) {
        if (node.nodeType === ELEMENT_NODE) {
          var curChild = node.firstChild;
          while (curChild) {
            var key = void 0;
            if (skipKeyedNodes && (key = getNodeKey(curChild))) {
              addKeyedRemoval(key);
            } else {
              onNodeDiscarded(curChild);
              if (curChild.firstChild) {
                walkDiscardedChildNodes(curChild, skipKeyedNodes);
              }
            }
            curChild = curChild.nextSibling;
          }
        }
      }
      function removeNode(node, parentNode, skipKeyedNodes) {
        if (onBeforeNodeDiscarded(node) === false) {
          return;
        }
        if (parentNode) {
          parentNode.removeChild(node);
        }
        onNodeDiscarded(node);
        walkDiscardedChildNodes(node, skipKeyedNodes);
      }
      function indexTree(node) {
        if (node.nodeType === ELEMENT_NODE || node.nodeType === DOCUMENT_FRAGMENT_NODE$1) {
          var curChild = node.firstChild;
          while (curChild) {
            var key = getNodeKey(curChild);
            if (key) {
              fromNodesLookup[key] = curChild;
            }
            indexTree(curChild);
            curChild = curChild.nextSibling;
          }
        }
      }
      indexTree(fromNode);
      function handleNodeAdded(el) {
        onNodeAdded(el);
        var curChild = el.firstChild;
        while (curChild) {
          var nextSibling = curChild.nextSibling;
          var key = getNodeKey(curChild);
          if (key) {
            var unmatchedFromEl = fromNodesLookup[key];
            if (unmatchedFromEl && compareNodeNames(curChild, unmatchedFromEl)) {
              curChild.parentNode.replaceChild(unmatchedFromEl, curChild);
              morphEl(unmatchedFromEl, curChild);
            } else {
              handleNodeAdded(curChild);
            }
          } else {
            handleNodeAdded(curChild);
          }
          curChild = nextSibling;
        }
      }
      function cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey) {
        while (curFromNodeChild) {
          var fromNextSibling = curFromNodeChild.nextSibling;
          if (curFromNodeKey = getNodeKey(curFromNodeChild)) {
            addKeyedRemoval(curFromNodeKey);
          } else {
            removeNode(
              curFromNodeChild,
              fromEl,
              true
              /* skip keyed nodes */
            );
          }
          curFromNodeChild = fromNextSibling;
        }
      }
      function morphEl(fromEl, toEl, childrenOnly2) {
        var toElKey = getNodeKey(toEl);
        if (toElKey) {
          delete fromNodesLookup[toElKey];
        }
        if (!childrenOnly2) {
          var beforeUpdateResult = onBeforeElUpdated(fromEl, toEl);
          if (beforeUpdateResult === false) {
            return;
          } else if (beforeUpdateResult instanceof HTMLElement) {
            fromEl = beforeUpdateResult;
            indexTree(fromEl);
          }
          morphAttrs2(fromEl, toEl);
          onElUpdated(fromEl);
          if (onBeforeElChildrenUpdated(fromEl, toEl) === false) {
            return;
          }
        }
        if (fromEl.nodeName !== "TEXTAREA") {
          morphChildren(fromEl, toEl);
        } else {
          specialElHandlers.TEXTAREA(fromEl, toEl);
        }
      }
      function morphChildren(fromEl, toEl) {
        var skipFrom = skipFromChildren(fromEl, toEl);
        var curToNodeChild = toEl.firstChild;
        var curFromNodeChild = fromEl.firstChild;
        var curToNodeKey;
        var curFromNodeKey;
        var fromNextSibling;
        var toNextSibling;
        var matchingFromEl;
        outer:
          while (curToNodeChild) {
            toNextSibling = curToNodeChild.nextSibling;
            curToNodeKey = getNodeKey(curToNodeChild);
            while (!skipFrom && curFromNodeChild) {
              fromNextSibling = curFromNodeChild.nextSibling;
              if (curToNodeChild.isSameNode && curToNodeChild.isSameNode(curFromNodeChild)) {
                curToNodeChild = toNextSibling;
                curFromNodeChild = fromNextSibling;
                continue outer;
              }
              curFromNodeKey = getNodeKey(curFromNodeChild);
              var curFromNodeType = curFromNodeChild.nodeType;
              var isCompatible = void 0;
              if (curFromNodeType === curToNodeChild.nodeType) {
                if (curFromNodeType === ELEMENT_NODE) {
                  if (curToNodeKey) {
                    if (curToNodeKey !== curFromNodeKey) {
                      if (matchingFromEl = fromNodesLookup[curToNodeKey]) {
                        if (fromNextSibling === matchingFromEl) {
                          isCompatible = false;
                        } else {
                          fromEl.insertBefore(matchingFromEl, curFromNodeChild);
                          if (curFromNodeKey) {
                            addKeyedRemoval(curFromNodeKey);
                          } else {
                            removeNode(
                              curFromNodeChild,
                              fromEl,
                              true
                              /* skip keyed nodes */
                            );
                          }
                          curFromNodeChild = matchingFromEl;
                          curFromNodeKey = getNodeKey(curFromNodeChild);
                        }
                      } else {
                        isCompatible = false;
                      }
                    }
                  } else if (curFromNodeKey) {
                    isCompatible = false;
                  }
                  isCompatible = isCompatible !== false && compareNodeNames(curFromNodeChild, curToNodeChild);
                  if (isCompatible) {
                    morphEl(curFromNodeChild, curToNodeChild);
                  }
                } else if (curFromNodeType === TEXT_NODE || curFromNodeType == COMMENT_NODE) {
                  isCompatible = true;
                  if (curFromNodeChild.nodeValue !== curToNodeChild.nodeValue) {
                    curFromNodeChild.nodeValue = curToNodeChild.nodeValue;
                  }
                }
              }
              if (isCompatible) {
                curToNodeChild = toNextSibling;
                curFromNodeChild = fromNextSibling;
                continue outer;
              }
              if (curFromNodeKey) {
                addKeyedRemoval(curFromNodeKey);
              } else {
                removeNode(
                  curFromNodeChild,
                  fromEl,
                  true
                  /* skip keyed nodes */
                );
              }
              curFromNodeChild = fromNextSibling;
            }
            if (curToNodeKey && (matchingFromEl = fromNodesLookup[curToNodeKey]) && compareNodeNames(matchingFromEl, curToNodeChild)) {
              if (!skipFrom) {
                addChild(fromEl, matchingFromEl);
              }
              morphEl(matchingFromEl, curToNodeChild);
            } else {
              var onBeforeNodeAddedResult = onBeforeNodeAdded(curToNodeChild);
              if (onBeforeNodeAddedResult !== false) {
                if (onBeforeNodeAddedResult) {
                  curToNodeChild = onBeforeNodeAddedResult;
                }
                if (curToNodeChild.actualize) {
                  curToNodeChild = curToNodeChild.actualize(fromEl.ownerDocument || doc);
                }
                addChild(fromEl, curToNodeChild);
                handleNodeAdded(curToNodeChild);
              }
            }
            curToNodeChild = toNextSibling;
            curFromNodeChild = fromNextSibling;
          }
        cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey);
        var specialElHandler = specialElHandlers[fromEl.nodeName];
        if (specialElHandler) {
          specialElHandler(fromEl, toEl);
        }
      }
      var morphedNode = fromNode;
      var morphedNodeType = morphedNode.nodeType;
      var toNodeType = toNode.nodeType;
      if (!childrenOnly) {
        if (morphedNodeType === ELEMENT_NODE) {
          if (toNodeType === ELEMENT_NODE) {
            if (!compareNodeNames(fromNode, toNode)) {
              onNodeDiscarded(fromNode);
              morphedNode = moveChildren(fromNode, createElementNS(toNode.nodeName, toNode.namespaceURI));
            }
          } else {
            morphedNode = toNode;
          }
        } else if (morphedNodeType === TEXT_NODE || morphedNodeType === COMMENT_NODE) {
          if (toNodeType === morphedNodeType) {
            if (morphedNode.nodeValue !== toNode.nodeValue) {
              morphedNode.nodeValue = toNode.nodeValue;
            }
            return morphedNode;
          } else {
            morphedNode = toNode;
          }
        }
      }
      if (morphedNode === toNode) {
        onNodeDiscarded(fromNode);
      } else {
        if (toNode.isSameNode && toNode.isSameNode(morphedNode)) {
          return;
        }
        morphEl(morphedNode, toNode, childrenOnly);
        if (keyedRemovalList) {
          for (var i = 0, len = keyedRemovalList.length; i < len; i++) {
            var elToRemove = fromNodesLookup[keyedRemovalList[i]];
            if (elToRemove) {
              removeNode(elToRemove, elToRemove.parentNode, false);
            }
          }
        }
      }
      if (!childrenOnly && morphedNode !== fromNode && fromNode.parentNode) {
        if (morphedNode.actualize) {
          morphedNode = morphedNode.actualize(fromNode.ownerDocument || doc);
        }
        fromNode.parentNode.replaceChild(morphedNode, fromNode);
      }
      return morphedNode;
    };
  }
  var morphdom = morphdomFactory(morphAttrs);
  var morphdom_esm_default = morphdom;
  var DOMPatch = class {
    constructor(view, container, id, html, streams, targetCID, opts = {}) {
      this.view = view;
      this.liveSocket = view.liveSocket;
      this.container = container;
      this.id = id;
      this.rootID = view.root.id;
      this.html = html;
      this.streams = streams;
      this.streamInserts = {};
      this.streamComponentRestore = {};
      this.targetCID = targetCID;
      this.cidPatch = isCid(this.targetCID);
      this.pendingRemoves = [];
      this.phxRemove = this.liveSocket.binding("remove");
      this.targetContainer = this.isCIDPatch() ? this.targetCIDContainer(html) : container;
      this.callbacks = {
        beforeadded: [],
        beforeupdated: [],
        beforephxChildAdded: [],
        afteradded: [],
        afterupdated: [],
        afterdiscarded: [],
        afterphxChildAdded: [],
        aftertransitionsDiscarded: []
      };
      this.withChildren = opts.withChildren || opts.undoRef || false;
      this.undoRef = opts.undoRef;
    }
    before(kind, callback) {
      this.callbacks[`before${kind}`].push(callback);
    }
    after(kind, callback) {
      this.callbacks[`after${kind}`].push(callback);
    }
    trackBefore(kind, ...args) {
      this.callbacks[`before${kind}`].forEach((callback) => callback(...args));
    }
    trackAfter(kind, ...args) {
      this.callbacks[`after${kind}`].forEach((callback) => callback(...args));
    }
    markPrunableContentForRemoval() {
      let phxUpdate = this.liveSocket.binding(PHX_UPDATE);
      dom_default.all(this.container, `[${phxUpdate}=append] > *, [${phxUpdate}=prepend] > *`, (el) => {
        el.setAttribute(PHX_PRUNE, "");
      });
    }
    perform(isJoinPatch) {
      let { view, liveSocket: liveSocket2, html, container, targetContainer } = this;
      if (this.isCIDPatch() && !targetContainer) {
        return;
      }
      let focused = liveSocket2.getActiveElement();
      let { selectionStart, selectionEnd } = focused && dom_default.hasSelectionRange(focused) ? focused : {};
      let phxUpdate = liveSocket2.binding(PHX_UPDATE);
      let phxViewportTop = liveSocket2.binding(PHX_VIEWPORT_TOP);
      let phxViewportBottom = liveSocket2.binding(PHX_VIEWPORT_BOTTOM);
      let phxTriggerExternal = liveSocket2.binding(PHX_TRIGGER_ACTION);
      let added = [];
      let updates = [];
      let appendPrependUpdates = [];
      let externalFormTriggered = null;
      function morph(targetContainer2, source, withChildren = this.withChildren) {
        let morphCallbacks = {
          // normally, we are running with childrenOnly, as the patch HTML for a LV
          // does not include the LV attrs (data-phx-session, etc.)
          // when we are patching a live component, we do want to patch the root element as well;
          // another case is the recursive patch of a stream item that was kept on reset (-> onBeforeNodeAdded)
          childrenOnly: targetContainer2.getAttribute(PHX_COMPONENT) === null && !withChildren,
          getNodeKey: (node) => {
            if (dom_default.isPhxDestroyed(node)) {
              return null;
            }
            if (isJoinPatch) {
              return node.id;
            }
            return node.id || node.getAttribute && node.getAttribute(PHX_MAGIC_ID);
          },
          // skip indexing from children when container is stream
          skipFromChildren: (from) => {
            return from.getAttribute(phxUpdate) === PHX_STREAM;
          },
          // tell morphdom how to add a child
          addChild: (parent, child) => {
            let { ref, streamAt } = this.getStreamInsert(child);
            if (ref === void 0) {
              return parent.appendChild(child);
            }
            this.setStreamRef(child, ref);
            if (streamAt === 0) {
              parent.insertAdjacentElement("afterbegin", child);
            } else if (streamAt === -1) {
              let lastChild = parent.lastElementChild;
              if (lastChild && !lastChild.hasAttribute(PHX_STREAM_REF)) {
                let nonStreamChild = Array.from(parent.children).find((c) => !c.hasAttribute(PHX_STREAM_REF));
                parent.insertBefore(child, nonStreamChild);
              } else {
                parent.appendChild(child);
              }
            } else if (streamAt > 0) {
              let sibling = Array.from(parent.children)[streamAt];
              parent.insertBefore(child, sibling);
            }
          },
          onBeforeNodeAdded: (el) => {
            dom_default.maintainPrivateHooks(el, el, phxViewportTop, phxViewportBottom);
            this.trackBefore("added", el);
            let morphedEl = el;
            if (this.streamComponentRestore[el.id]) {
              morphedEl = this.streamComponentRestore[el.id];
              delete this.streamComponentRestore[el.id];
              morph.call(this, morphedEl, el, true);
            }
            return morphedEl;
          },
          onNodeAdded: (el) => {
            if (el.getAttribute) {
              this.maybeReOrderStream(el, true);
            }
            if (el instanceof HTMLImageElement && el.srcset) {
              el.srcset = el.srcset;
            } else if (el instanceof HTMLVideoElement && el.autoplay) {
              el.play();
            }
            if (dom_default.isNowTriggerFormExternal(el, phxTriggerExternal)) {
              externalFormTriggered = el;
            }
            if (dom_default.isPhxChild(el) && view.ownsElement(el) || dom_default.isPhxSticky(el) && view.ownsElement(el.parentNode)) {
              this.trackAfter("phxChildAdded", el);
            }
            added.push(el);
          },
          onNodeDiscarded: (el) => this.onNodeDiscarded(el),
          onBeforeNodeDiscarded: (el) => {
            if (el.getAttribute && el.getAttribute(PHX_PRUNE) !== null) {
              return true;
            }
            if (el.parentElement !== null && el.id && dom_default.isPhxUpdate(el.parentElement, phxUpdate, [PHX_STREAM, "append", "prepend"])) {
              return false;
            }
            if (this.maybePendingRemove(el)) {
              return false;
            }
            if (this.skipCIDSibling(el)) {
              return false;
            }
            return true;
          },
          onElUpdated: (el) => {
            if (dom_default.isNowTriggerFormExternal(el, phxTriggerExternal)) {
              externalFormTriggered = el;
            }
            updates.push(el);
            this.maybeReOrderStream(el, false);
          },
          onBeforeElUpdated: (fromEl, toEl) => {
            if (fromEl.id && fromEl.isSameNode(targetContainer2) && fromEl.id !== toEl.id) {
              morphCallbacks.onNodeDiscarded(fromEl);
              fromEl.replaceWith(toEl);
              return morphCallbacks.onNodeAdded(toEl);
            }
            dom_default.syncPendingAttrs(fromEl, toEl);
            dom_default.maintainPrivateHooks(fromEl, toEl, phxViewportTop, phxViewportBottom);
            dom_default.cleanChildNodes(toEl, phxUpdate);
            if (this.skipCIDSibling(toEl)) {
              this.maybeReOrderStream(fromEl);
              return false;
            }
            if (dom_default.isPhxSticky(fromEl)) {
              [PHX_SESSION, PHX_STATIC, PHX_ROOT_ID].map((attr) => [attr, fromEl.getAttribute(attr), toEl.getAttribute(attr)]).forEach(([attr, fromVal, toVal]) => {
                if (toVal && fromVal !== toVal) {
                  fromEl.setAttribute(attr, toVal);
                }
              });
              return false;
            }
            if (dom_default.isIgnored(fromEl, phxUpdate) || fromEl.form && fromEl.form.isSameNode(externalFormTriggered)) {
              this.trackBefore("updated", fromEl, toEl);
              dom_default.mergeAttrs(fromEl, toEl, { isIgnored: dom_default.isIgnored(fromEl, phxUpdate) });
              updates.push(fromEl);
              dom_default.applyStickyOperations(fromEl);
              return false;
            }
            if (fromEl.type === "number" && (fromEl.validity && fromEl.validity.badInput)) {
              return false;
            }
            let isFocusedFormEl = focused && fromEl.isSameNode(focused) && dom_default.isFormInput(fromEl);
            let focusedSelectChanged = isFocusedFormEl && this.isChangedSelect(fromEl, toEl);
            if (fromEl.hasAttribute(PHX_REF_SRC) && fromEl.getAttribute(PHX_REF_LOCK) != this.undoRef) {
              if (dom_default.isUploadInput(fromEl)) {
                dom_default.mergeAttrs(fromEl, toEl, { isIgnored: true });
                this.trackBefore("updated", fromEl, toEl);
                updates.push(fromEl);
              }
              dom_default.applyStickyOperations(fromEl);
              let isLocked = fromEl.hasAttribute(PHX_REF_LOCK);
              let clone2 = isLocked ? dom_default.private(fromEl, PHX_REF_LOCK) || fromEl.cloneNode(true) : null;
              if (clone2) {
                dom_default.putPrivate(fromEl, PHX_REF_LOCK, clone2);
                if (!isFocusedFormEl) {
                  fromEl = clone2;
                }
              }
            }
            if (dom_default.isPhxChild(toEl)) {
              let prevSession = fromEl.getAttribute(PHX_SESSION);
              dom_default.mergeAttrs(fromEl, toEl, { exclude: [PHX_STATIC] });
              if (prevSession !== "") {
                fromEl.setAttribute(PHX_SESSION, prevSession);
              }
              fromEl.setAttribute(PHX_ROOT_ID, this.rootID);
              dom_default.applyStickyOperations(fromEl);
              return false;
            }
            if (this.undoRef && dom_default.private(toEl, PHX_REF_LOCK)) {
              dom_default.putPrivate(fromEl, PHX_REF_LOCK, dom_default.private(toEl, PHX_REF_LOCK));
            }
            dom_default.copyPrivates(toEl, fromEl);
            if (isFocusedFormEl && fromEl.type !== "hidden" && !focusedSelectChanged) {
              this.trackBefore("updated", fromEl, toEl);
              dom_default.mergeFocusedInput(fromEl, toEl);
              dom_default.syncAttrsToProps(fromEl);
              updates.push(fromEl);
              dom_default.applyStickyOperations(fromEl);
              return false;
            } else {
              if (focusedSelectChanged) {
                fromEl.blur();
              }
              if (dom_default.isPhxUpdate(toEl, phxUpdate, ["append", "prepend"])) {
                appendPrependUpdates.push(new DOMPostMorphRestorer(fromEl, toEl, toEl.getAttribute(phxUpdate)));
              }
              dom_default.syncAttrsToProps(toEl);
              dom_default.applyStickyOperations(toEl);
              this.trackBefore("updated", fromEl, toEl);
              return fromEl;
            }
          }
        };
        morphdom_esm_default(targetContainer2, source, morphCallbacks);
      }
      this.trackBefore("added", container);
      this.trackBefore("updated", container, container);
      liveSocket2.time("morphdom", () => {
        this.streams.forEach(([ref, inserts, deleteIds, reset]) => {
          inserts.forEach(([key, streamAt, limit]) => {
            this.streamInserts[key] = { ref, streamAt, limit, reset };
          });
          if (reset !== void 0) {
            dom_default.all(container, `[${PHX_STREAM_REF}="${ref}"]`, (child) => {
              this.removeStreamChildElement(child);
            });
          }
          deleteIds.forEach((id) => {
            let child = container.querySelector(`[id="${id}"]`);
            if (child) {
              this.removeStreamChildElement(child);
            }
          });
        });
        if (isJoinPatch) {
          dom_default.all(this.container, `[${phxUpdate}=${PHX_STREAM}]`).filter((el) => this.view.ownsElement(el)).forEach((el) => {
            Array.from(el.children).forEach((child) => {
              this.removeStreamChildElement(child, true);
            });
          });
        }
        morph.call(this, targetContainer, html);
      });
      if (liveSocket2.isDebugEnabled()) {
        detectDuplicateIds();
        detectInvalidStreamInserts(this.streamInserts);
        Array.from(document.querySelectorAll("input[name=id]")).forEach((node) => {
          if (node.form) {
            console.error('Detected an input with name="id" inside a form! This will cause problems when patching the DOM.\n', node);
          }
        });
      }
      if (appendPrependUpdates.length > 0) {
        liveSocket2.time("post-morph append/prepend restoration", () => {
          appendPrependUpdates.forEach((update) => update.perform());
        });
      }
      liveSocket2.silenceEvents(() => dom_default.restoreFocus(focused, selectionStart, selectionEnd));
      dom_default.dispatchEvent(document, "phx:update");
      added.forEach((el) => this.trackAfter("added", el));
      updates.forEach((el) => this.trackAfter("updated", el));
      this.transitionPendingRemoves();
      if (externalFormTriggered) {
        liveSocket2.unload();
        Object.getPrototypeOf(externalFormTriggered).submit.call(externalFormTriggered);
      }
      return true;
    }
    onNodeDiscarded(el) {
      if (dom_default.isPhxChild(el) || dom_default.isPhxSticky(el)) {
        this.liveSocket.destroyViewByEl(el);
      }
      this.trackAfter("discarded", el);
    }
    maybePendingRemove(node) {
      if (node.getAttribute && node.getAttribute(this.phxRemove) !== null) {
        this.pendingRemoves.push(node);
        return true;
      } else {
        return false;
      }
    }
    removeStreamChildElement(child, force = false) {
      if (!force && !this.view.ownsElement(child)) {
        return;
      }
      if (this.streamInserts[child.id]) {
        this.streamComponentRestore[child.id] = child;
        child.remove();
      } else {
        if (!this.maybePendingRemove(child)) {
          child.remove();
          this.onNodeDiscarded(child);
        }
      }
    }
    getStreamInsert(el) {
      let insert = el.id ? this.streamInserts[el.id] : {};
      return insert || {};
    }
    setStreamRef(el, ref) {
      dom_default.putSticky(el, PHX_STREAM_REF, (el2) => el2.setAttribute(PHX_STREAM_REF, ref));
    }
    maybeReOrderStream(el, isNew) {
      let { ref, streamAt, reset } = this.getStreamInsert(el);
      if (streamAt === void 0) {
        return;
      }
      this.setStreamRef(el, ref);
      if (!reset && !isNew) {
        return;
      }
      if (!el.parentElement) {
        return;
      }
      if (streamAt === 0) {
        el.parentElement.insertBefore(el, el.parentElement.firstElementChild);
      } else if (streamAt > 0) {
        let children = Array.from(el.parentElement.children);
        let oldIndex = children.indexOf(el);
        if (streamAt >= children.length - 1) {
          el.parentElement.appendChild(el);
        } else {
          let sibling = children[streamAt];
          if (oldIndex > streamAt) {
            el.parentElement.insertBefore(el, sibling);
          } else {
            el.parentElement.insertBefore(el, sibling.nextElementSibling);
          }
        }
      }
      this.maybeLimitStream(el);
    }
    maybeLimitStream(el) {
      let { limit } = this.getStreamInsert(el);
      let children = limit !== null && Array.from(el.parentElement.children);
      if (limit && limit < 0 && children.length > limit * -1) {
        children.slice(0, children.length + limit).forEach((child) => this.removeStreamChildElement(child));
      } else if (limit && limit >= 0 && children.length > limit) {
        children.slice(limit).forEach((child) => this.removeStreamChildElement(child));
      }
    }
    transitionPendingRemoves() {
      let { pendingRemoves, liveSocket: liveSocket2 } = this;
      if (pendingRemoves.length > 0) {
        liveSocket2.transitionRemoves(pendingRemoves, () => {
          pendingRemoves.forEach((el) => {
            let child = dom_default.firstPhxChild(el);
            if (child) {
              liveSocket2.destroyViewByEl(child);
            }
            el.remove();
          });
          this.trackAfter("transitionsDiscarded", pendingRemoves);
        });
      }
    }
    isChangedSelect(fromEl, toEl) {
      if (!(fromEl instanceof HTMLSelectElement) || fromEl.multiple) {
        return false;
      }
      if (fromEl.options.length !== toEl.options.length) {
        return true;
      }
      toEl.value = fromEl.value;
      return !fromEl.isEqualNode(toEl);
    }
    isCIDPatch() {
      return this.cidPatch;
    }
    skipCIDSibling(el) {
      return el.nodeType === Node.ELEMENT_NODE && el.hasAttribute(PHX_SKIP);
    }
    targetCIDContainer(html) {
      if (!this.isCIDPatch()) {
        return;
      }
      let [first, ...rest] = dom_default.findComponentNodeList(this.container, this.targetCID);
      if (rest.length === 0 && dom_default.childNodeLength(html) === 1) {
        return first;
      } else {
        return first && first.parentNode;
      }
    }
    indexOf(parent, child) {
      return Array.from(parent.children).indexOf(child);
    }
  };
  var VOID_TAGS = /* @__PURE__ */ new Set([
    "area",
    "base",
    "br",
    "col",
    "command",
    "embed",
    "hr",
    "img",
    "input",
    "keygen",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr"
  ]);
  var quoteChars = /* @__PURE__ */ new Set(["'", '"']);
  var modifyRoot = (html, attrs, clearInnerHTML) => {
    let i = 0;
    let insideComment = false;
    let beforeTag, afterTag, tag, tagNameEndsAt, id, newHTML;
    let lookahead = html.match(/^(\s*(?:<!--.*?-->\s*)*)<([^\s\/>]+)/);
    if (lookahead === null) {
      throw new Error(`malformed html ${html}`);
    }
    i = lookahead[0].length;
    beforeTag = lookahead[1];
    tag = lookahead[2];
    tagNameEndsAt = i;
    for (i; i < html.length; i++) {
      if (html.charAt(i) === ">") {
        break;
      }
      if (html.charAt(i) === "=") {
        let isId = html.slice(i - 3, i) === " id";
        i++;
        let char = html.charAt(i);
        if (quoteChars.has(char)) {
          let attrStartsAt = i;
          i++;
          for (i; i < html.length; i++) {
            if (html.charAt(i) === char) {
              break;
            }
          }
          if (isId) {
            id = html.slice(attrStartsAt + 1, i);
            break;
          }
        }
      }
    }
    let closeAt = html.length - 1;
    insideComment = false;
    while (closeAt >= beforeTag.length + tag.length) {
      let char = html.charAt(closeAt);
      if (insideComment) {
        if (char === "-" && html.slice(closeAt - 3, closeAt) === "<!-") {
          insideComment = false;
          closeAt -= 4;
        } else {
          closeAt -= 1;
        }
      } else if (char === ">" && html.slice(closeAt - 2, closeAt) === "--") {
        insideComment = true;
        closeAt -= 3;
      } else if (char === ">") {
        break;
      } else {
        closeAt -= 1;
      }
    }
    afterTag = html.slice(closeAt + 1, html.length);
    let attrsStr = Object.keys(attrs).map((attr) => attrs[attr] === true ? attr : `${attr}="${attrs[attr]}"`).join(" ");
    if (clearInnerHTML) {
      let idAttrStr = id ? ` id="${id}"` : "";
      if (VOID_TAGS.has(tag)) {
        newHTML = `<${tag}${idAttrStr}${attrsStr === "" ? "" : " "}${attrsStr}/>`;
      } else {
        newHTML = `<${tag}${idAttrStr}${attrsStr === "" ? "" : " "}${attrsStr}></${tag}>`;
      }
    } else {
      let rest = html.slice(tagNameEndsAt, closeAt + 1);
      newHTML = `<${tag}${attrsStr === "" ? "" : " "}${attrsStr}${rest}`;
    }
    return [newHTML, beforeTag, afterTag];
  };
  var Rendered = class {
    static extract(diff) {
      let { [REPLY]: reply, [EVENTS]: events, [TITLE]: title } = diff;
      delete diff[REPLY];
      delete diff[EVENTS];
      delete diff[TITLE];
      return { diff, title, reply: reply || null, events: events || [] };
    }
    constructor(viewId, rendered) {
      this.viewId = viewId;
      this.rendered = {};
      this.magicId = 0;
      this.mergeDiff(rendered);
    }
    parentViewId() {
      return this.viewId;
    }
    toString(onlyCids) {
      let [str, streams] = this.recursiveToString(this.rendered, this.rendered[COMPONENTS], onlyCids, true, {});
      return [str, streams];
    }
    recursiveToString(rendered, components = rendered[COMPONENTS], onlyCids, changeTracking, rootAttrs) {
      onlyCids = onlyCids ? new Set(onlyCids) : null;
      let output = { buffer: "", components, onlyCids, streams: /* @__PURE__ */ new Set() };
      this.toOutputBuffer(rendered, null, output, changeTracking, rootAttrs);
      return [output.buffer, output.streams];
    }
    componentCIDs(diff) {
      return Object.keys(diff[COMPONENTS] || {}).map((i) => parseInt(i));
    }
    isComponentOnlyDiff(diff) {
      if (!diff[COMPONENTS]) {
        return false;
      }
      return Object.keys(diff).length === 1;
    }
    getComponent(diff, cid) {
      return diff[COMPONENTS][cid];
    }
    resetRender(cid) {
      if (this.rendered[COMPONENTS][cid]) {
        this.rendered[COMPONENTS][cid].reset = true;
      }
    }
    mergeDiff(diff) {
      let newc = diff[COMPONENTS];
      let cache = {};
      delete diff[COMPONENTS];
      this.rendered = this.mutableMerge(this.rendered, diff);
      this.rendered[COMPONENTS] = this.rendered[COMPONENTS] || {};
      if (newc) {
        let oldc = this.rendered[COMPONENTS];
        for (let cid in newc) {
          newc[cid] = this.cachedFindComponent(cid, newc[cid], oldc, newc, cache);
        }
        for (let cid in newc) {
          oldc[cid] = newc[cid];
        }
        diff[COMPONENTS] = newc;
      }
    }
    cachedFindComponent(cid, cdiff, oldc, newc, cache) {
      if (cache[cid]) {
        return cache[cid];
      } else {
        let ndiff, stat, scid = cdiff[STATIC];
        if (isCid(scid)) {
          let tdiff;
          if (scid > 0) {
            tdiff = this.cachedFindComponent(scid, newc[scid], oldc, newc, cache);
          } else {
            tdiff = oldc[-scid];
          }
          stat = tdiff[STATIC];
          ndiff = this.cloneMerge(tdiff, cdiff, true);
          ndiff[STATIC] = stat;
        } else {
          ndiff = cdiff[STATIC] !== void 0 || oldc[cid] === void 0 ? cdiff : this.cloneMerge(oldc[cid], cdiff, false);
        }
        cache[cid] = ndiff;
        return ndiff;
      }
    }
    mutableMerge(target, source) {
      if (source[STATIC] !== void 0) {
        return source;
      } else {
        this.doMutableMerge(target, source);
        return target;
      }
    }
    doMutableMerge(target, source) {
      for (let key in source) {
        let val = source[key];
        let targetVal = target[key];
        let isObjVal = isObject(val);
        if (isObjVal && val[STATIC] === void 0 && isObject(targetVal)) {
          this.doMutableMerge(targetVal, val);
        } else {
          target[key] = val;
        }
      }
      if (target[ROOT]) {
        target.newRender = true;
      }
    }
    // Merges cid trees together, copying statics from source tree.
    //
    // The `pruneMagicId` is passed to control pruning the magicId of the
    // target. We must always prune the magicId when we are sharing statics
    // from another component. If not pruning, we replicate the logic from
    // mutableMerge, where we set newRender to true if there is a root
    // (effectively forcing the new version to be rendered instead of skipped)
    //
    cloneMerge(target, source, pruneMagicId) {
      let merged = __spreadValues(__spreadValues({}, target), source);
      for (let key in merged) {
        let val = source[key];
        let targetVal = target[key];
        if (isObject(val) && val[STATIC] === void 0 && isObject(targetVal)) {
          merged[key] = this.cloneMerge(targetVal, val, pruneMagicId);
        } else if (val === void 0 && isObject(targetVal)) {
          merged[key] = this.cloneMerge(targetVal, {}, pruneMagicId);
        }
      }
      if (pruneMagicId) {
        delete merged.magicId;
        delete merged.newRender;
      } else if (target[ROOT]) {
        merged.newRender = true;
      }
      return merged;
    }
    componentToString(cid) {
      let [str, streams] = this.recursiveCIDToString(this.rendered[COMPONENTS], cid, null);
      let [strippedHTML, _before, _after] = modifyRoot(str, {});
      return [strippedHTML, streams];
    }
    pruneCIDs(cids) {
      cids.forEach((cid) => delete this.rendered[COMPONENTS][cid]);
    }
    // private
    get() {
      return this.rendered;
    }
    isNewFingerprint(diff = {}) {
      return !!diff[STATIC];
    }
    templateStatic(part, templates) {
      if (typeof part === "number") {
        return templates[part];
      } else {
        return part;
      }
    }
    nextMagicID() {
      this.magicId++;
      return `m${this.magicId}-${this.parentViewId()}`;
    }
    // Converts rendered tree to output buffer.
    //
    // changeTracking controls if we can apply the PHX_SKIP optimization.
    // It is disabled for comprehensions since we must re-render the entire collection
    // and no individual element is tracked inside the comprehension.
    toOutputBuffer(rendered, templates, output, changeTracking, rootAttrs = {}) {
      if (rendered[DYNAMICS]) {
        return this.comprehensionToBuffer(rendered, templates, output);
      }
      let { [STATIC]: statics } = rendered;
      statics = this.templateStatic(statics, templates);
      let isRoot = rendered[ROOT];
      let prevBuffer = output.buffer;
      if (isRoot) {
        output.buffer = "";
      }
      if (changeTracking && isRoot && !rendered.magicId) {
        rendered.newRender = true;
        rendered.magicId = this.nextMagicID();
      }
      output.buffer += statics[0];
      for (let i = 1; i < statics.length; i++) {
        this.dynamicToBuffer(rendered[i - 1], templates, output, changeTracking);
        output.buffer += statics[i];
      }
      if (isRoot) {
        let skip = false;
        let attrs;
        if (changeTracking || rendered.magicId) {
          skip = changeTracking && !rendered.newRender;
          attrs = __spreadValues({ [PHX_MAGIC_ID]: rendered.magicId }, rootAttrs);
        } else {
          attrs = rootAttrs;
        }
        if (skip) {
          attrs[PHX_SKIP] = true;
        }
        let [newRoot, commentBefore, commentAfter] = modifyRoot(output.buffer, attrs, skip);
        rendered.newRender = false;
        output.buffer = prevBuffer + commentBefore + newRoot + commentAfter;
      }
    }
    comprehensionToBuffer(rendered, templates, output) {
      let { [DYNAMICS]: dynamics, [STATIC]: statics, [STREAM]: stream } = rendered;
      let [_ref, _inserts, deleteIds, reset] = stream || [null, {}, [], null];
      statics = this.templateStatic(statics, templates);
      let compTemplates = templates || rendered[TEMPLATES];
      for (let d = 0; d < dynamics.length; d++) {
        let dynamic = dynamics[d];
        output.buffer += statics[0];
        for (let i = 1; i < statics.length; i++) {
          let changeTracking = false;
          this.dynamicToBuffer(dynamic[i - 1], compTemplates, output, changeTracking);
          output.buffer += statics[i];
        }
      }
      if (stream !== void 0 && (rendered[DYNAMICS].length > 0 || deleteIds.length > 0 || reset)) {
        delete rendered[STREAM];
        rendered[DYNAMICS] = [];
        output.streams.add(stream);
      }
    }
    dynamicToBuffer(rendered, templates, output, changeTracking) {
      if (typeof rendered === "number") {
        let [str, streams] = this.recursiveCIDToString(output.components, rendered, output.onlyCids);
        output.buffer += str;
        output.streams = /* @__PURE__ */ new Set([...output.streams, ...streams]);
      } else if (isObject(rendered)) {
        this.toOutputBuffer(rendered, templates, output, changeTracking, {});
      } else {
        output.buffer += rendered;
      }
    }
    recursiveCIDToString(components, cid, onlyCids) {
      let component = components[cid] || logError(`no component for CID ${cid}`, components);
      let attrs = { [PHX_COMPONENT]: cid };
      let skip = onlyCids && !onlyCids.has(cid);
      component.newRender = !skip;
      component.magicId = `c${cid}-${this.parentViewId()}`;
      let changeTracking = !component.reset;
      let [html, streams] = this.recursiveToString(component, components, onlyCids, changeTracking, attrs);
      delete component.reset;
      return [html, streams];
    }
  };
  var focusStack = [];
  var default_transition_time = 200;
  var JS = {
    // private
    exec(e, eventType, phxEvent, view, sourceEl, defaults) {
      let [defaultKind, defaultArgs] = defaults || [null, { callback: defaults && defaults.callback }];
      let commands = phxEvent.charAt(0) === "[" ? JSON.parse(phxEvent) : [[defaultKind, defaultArgs]];
      commands.forEach(([kind, args]) => {
        if (kind === defaultKind) {
          args = __spreadValues(__spreadValues({}, defaultArgs), args);
          args.callback = args.callback || defaultArgs.callback;
        }
        this.filterToEls(view.liveSocket, sourceEl, args).forEach((el) => {
          this[`exec_${kind}`](e, eventType, phxEvent, view, sourceEl, el, args);
        });
      });
    },
    isVisible(el) {
      return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length > 0);
    },
    // returns true if any part of the element is inside the viewport
    isInViewport(el) {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const windowWidth = window.innerWidth || document.documentElement.clientWidth;
      return rect.right > 0 && rect.bottom > 0 && rect.left < windowWidth && rect.top < windowHeight;
    },
    // private
    // commands
    exec_exec(e, eventType, phxEvent, view, sourceEl, el, { attr, to }) {
      let encodedJS = el.getAttribute(attr);
      if (!encodedJS) {
        throw new Error(`expected ${attr} to contain JS command on "${to}"`);
      }
      view.liveSocket.execJS(el, encodedJS, eventType);
    },
    exec_dispatch(e, eventType, phxEvent, view, sourceEl, el, { event, detail, bubbles }) {
      detail = detail || {};
      detail.dispatcher = sourceEl;
      dom_default.dispatchEvent(el, event, { detail, bubbles });
    },
    exec_push(e, eventType, phxEvent, view, sourceEl, el, args) {
      let { event, data, target, page_loading, loading, value, dispatcher, callback } = args;
      let pushOpts = { loading, value, target, page_loading: !!page_loading };
      let targetSrc = eventType === "change" && dispatcher ? dispatcher : sourceEl;
      let phxTarget = target || targetSrc.getAttribute(view.binding("target")) || targetSrc;
      const handler = (targetView, targetCtx) => {
        if (!targetView.isConnected()) {
          return;
        }
        if (eventType === "change") {
          let { newCid, _target } = args;
          _target = _target || (dom_default.isFormInput(sourceEl) ? sourceEl.name : void 0);
          if (_target) {
            pushOpts._target = _target;
          }
          targetView.pushInput(sourceEl, targetCtx, newCid, event || phxEvent, pushOpts, callback);
        } else if (eventType === "submit") {
          let { submitter } = args;
          targetView.submitForm(sourceEl, targetCtx, event || phxEvent, submitter, pushOpts, callback);
        } else {
          targetView.pushEvent(eventType, sourceEl, targetCtx, event || phxEvent, data, pushOpts, callback);
        }
      };
      if (args.targetView && args.targetCtx) {
        handler(args.targetView, args.targetCtx);
      } else {
        view.withinTargets(phxTarget, handler);
      }
    },
    exec_navigate(e, eventType, phxEvent, view, sourceEl, el, { href, replace }) {
      view.liveSocket.historyRedirect(e, href, replace ? "replace" : "push", null, sourceEl);
    },
    exec_patch(e, eventType, phxEvent, view, sourceEl, el, { href, replace }) {
      view.liveSocket.pushHistoryPatch(e, href, replace ? "replace" : "push", sourceEl);
    },
    exec_focus(e, eventType, phxEvent, view, sourceEl, el) {
      aria_default.attemptFocus(el);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => aria_default.attemptFocus(el));
      });
    },
    exec_focus_first(e, eventType, phxEvent, view, sourceEl, el) {
      aria_default.focusFirstInteractive(el) || aria_default.focusFirst(el);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => aria_default.focusFirstInteractive(el) || aria_default.focusFirst(el));
      });
    },
    exec_push_focus(e, eventType, phxEvent, view, sourceEl, el) {
      focusStack.push(el || sourceEl);
    },
    exec_pop_focus(_e, _eventType, _phxEvent, _view, _sourceEl, _el) {
      const el = focusStack.pop();
      if (el) {
        el.focus();
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => el.focus());
        });
      }
    },
    exec_add_class(e, eventType, phxEvent, view, sourceEl, el, { names, transition, time, blocking }) {
      this.addOrRemoveClasses(el, names, [], transition, time, view, blocking);
    },
    exec_remove_class(e, eventType, phxEvent, view, sourceEl, el, { names, transition, time, blocking }) {
      this.addOrRemoveClasses(el, [], names, transition, time, view, blocking);
    },
    exec_toggle_class(e, eventType, phxEvent, view, sourceEl, el, { names, transition, time, blocking }) {
      this.toggleClasses(el, names, transition, time, view, blocking);
    },
    exec_toggle_attr(e, eventType, phxEvent, view, sourceEl, el, { attr: [attr, val1, val2] }) {
      this.toggleAttr(el, attr, val1, val2);
    },
    exec_transition(e, eventType, phxEvent, view, sourceEl, el, { time, transition, blocking }) {
      this.addOrRemoveClasses(el, [], [], transition, time, view, blocking);
    },
    exec_toggle(e, eventType, phxEvent, view, sourceEl, el, { display, ins, outs, time, blocking }) {
      this.toggle(eventType, view, el, display, ins, outs, time, blocking);
    },
    exec_show(e, eventType, phxEvent, view, sourceEl, el, { display, transition, time, blocking }) {
      this.show(eventType, view, el, display, transition, time, blocking);
    },
    exec_hide(e, eventType, phxEvent, view, sourceEl, el, { display, transition, time, blocking }) {
      this.hide(eventType, view, el, display, transition, time, blocking);
    },
    exec_set_attr(e, eventType, phxEvent, view, sourceEl, el, { attr: [attr, val] }) {
      this.setOrRemoveAttrs(el, [[attr, val]], []);
    },
    exec_remove_attr(e, eventType, phxEvent, view, sourceEl, el, { attr }) {
      this.setOrRemoveAttrs(el, [], [attr]);
    },
    // utils for commands
    show(eventType, view, el, display, transition, time, blocking) {
      if (!this.isVisible(el)) {
        this.toggle(eventType, view, el, display, transition, null, time, blocking);
      }
    },
    hide(eventType, view, el, display, transition, time, blocking) {
      if (this.isVisible(el)) {
        this.toggle(eventType, view, el, display, null, transition, time, blocking);
      }
    },
    toggle(eventType, view, el, display, ins, outs, time, blocking) {
      time = time || default_transition_time;
      let [inClasses, inStartClasses, inEndClasses] = ins || [[], [], []];
      let [outClasses, outStartClasses, outEndClasses] = outs || [[], [], []];
      if (inClasses.length > 0 || outClasses.length > 0) {
        if (this.isVisible(el)) {
          let onStart = () => {
            this.addOrRemoveClasses(el, outStartClasses, inClasses.concat(inStartClasses).concat(inEndClasses));
            window.requestAnimationFrame(() => {
              this.addOrRemoveClasses(el, outClasses, []);
              window.requestAnimationFrame(() => this.addOrRemoveClasses(el, outEndClasses, outStartClasses));
            });
          };
          let onEnd = () => {
            this.addOrRemoveClasses(el, [], outClasses.concat(outEndClasses));
            dom_default.putSticky(el, "toggle", (currentEl) => currentEl.style.display = "none");
            el.dispatchEvent(new Event("phx:hide-end"));
          };
          el.dispatchEvent(new Event("phx:hide-start"));
          if (blocking === false) {
            onStart();
            setTimeout(onEnd, time);
          } else {
            view.transition(time, onStart, onEnd);
          }
        } else {
          if (eventType === "remove") {
            return;
          }
          let onStart = () => {
            this.addOrRemoveClasses(el, inStartClasses, outClasses.concat(outStartClasses).concat(outEndClasses));
            const stickyDisplay = display || this.defaultDisplay(el);
            window.requestAnimationFrame(() => {
              this.addOrRemoveClasses(el, inClasses, []);
              window.requestAnimationFrame(() => {
                dom_default.putSticky(el, "toggle", (currentEl) => currentEl.style.display = stickyDisplay);
                this.addOrRemoveClasses(el, inEndClasses, inStartClasses);
              });
            });
          };
          let onEnd = () => {
            this.addOrRemoveClasses(el, [], inClasses.concat(inEndClasses));
            el.dispatchEvent(new Event("phx:show-end"));
          };
          el.dispatchEvent(new Event("phx:show-start"));
          if (blocking === false) {
            onStart();
            setTimeout(onEnd, time);
          } else {
            view.transition(time, onStart, onEnd);
          }
        }
      } else {
        if (this.isVisible(el)) {
          window.requestAnimationFrame(() => {
            el.dispatchEvent(new Event("phx:hide-start"));
            dom_default.putSticky(el, "toggle", (currentEl) => currentEl.style.display = "none");
            el.dispatchEvent(new Event("phx:hide-end"));
          });
        } else {
          window.requestAnimationFrame(() => {
            el.dispatchEvent(new Event("phx:show-start"));
            let stickyDisplay = display || this.defaultDisplay(el);
            dom_default.putSticky(el, "toggle", (currentEl) => currentEl.style.display = stickyDisplay);
            el.dispatchEvent(new Event("phx:show-end"));
          });
        }
      }
    },
    toggleClasses(el, classes, transition, time, view, blocking) {
      window.requestAnimationFrame(() => {
        let [prevAdds, prevRemoves] = dom_default.getSticky(el, "classes", [[], []]);
        let newAdds = classes.filter((name) => prevAdds.indexOf(name) < 0 && !el.classList.contains(name));
        let newRemoves = classes.filter((name) => prevRemoves.indexOf(name) < 0 && el.classList.contains(name));
        this.addOrRemoveClasses(el, newAdds, newRemoves, transition, time, view, blocking);
      });
    },
    toggleAttr(el, attr, val1, val2) {
      if (el.hasAttribute(attr)) {
        if (val2 !== void 0) {
          if (el.getAttribute(attr) === val1) {
            this.setOrRemoveAttrs(el, [[attr, val2]], []);
          } else {
            this.setOrRemoveAttrs(el, [[attr, val1]], []);
          }
        } else {
          this.setOrRemoveAttrs(el, [], [attr]);
        }
      } else {
        this.setOrRemoveAttrs(el, [[attr, val1]], []);
      }
    },
    addOrRemoveClasses(el, adds, removes, transition, time, view, blocking) {
      time = time || default_transition_time;
      let [transitionRun, transitionStart, transitionEnd] = transition || [[], [], []];
      if (transitionRun.length > 0) {
        let onStart = () => {
          this.addOrRemoveClasses(el, transitionStart, [].concat(transitionRun).concat(transitionEnd));
          window.requestAnimationFrame(() => {
            this.addOrRemoveClasses(el, transitionRun, []);
            window.requestAnimationFrame(() => this.addOrRemoveClasses(el, transitionEnd, transitionStart));
          });
        };
        let onDone = () => this.addOrRemoveClasses(el, adds.concat(transitionEnd), removes.concat(transitionRun).concat(transitionStart));
        if (blocking === false) {
          onStart();
          setTimeout(onDone, time);
        } else {
          view.transition(time, onStart, onDone);
        }
        return;
      }
      window.requestAnimationFrame(() => {
        let [prevAdds, prevRemoves] = dom_default.getSticky(el, "classes", [[], []]);
        let keepAdds = adds.filter((name) => prevAdds.indexOf(name) < 0 && !el.classList.contains(name));
        let keepRemoves = removes.filter((name) => prevRemoves.indexOf(name) < 0 && el.classList.contains(name));
        let newAdds = prevAdds.filter((name) => removes.indexOf(name) < 0).concat(keepAdds);
        let newRemoves = prevRemoves.filter((name) => adds.indexOf(name) < 0).concat(keepRemoves);
        dom_default.putSticky(el, "classes", (currentEl) => {
          currentEl.classList.remove(...newRemoves);
          currentEl.classList.add(...newAdds);
          return [newAdds, newRemoves];
        });
      });
    },
    setOrRemoveAttrs(el, sets, removes) {
      let [prevSets, prevRemoves] = dom_default.getSticky(el, "attrs", [[], []]);
      let alteredAttrs = sets.map(([attr, _val]) => attr).concat(removes);
      let newSets = prevSets.filter(([attr, _val]) => !alteredAttrs.includes(attr)).concat(sets);
      let newRemoves = prevRemoves.filter((attr) => !alteredAttrs.includes(attr)).concat(removes);
      dom_default.putSticky(el, "attrs", (currentEl) => {
        newRemoves.forEach((attr) => currentEl.removeAttribute(attr));
        newSets.forEach(([attr, val]) => currentEl.setAttribute(attr, val));
        return [newSets, newRemoves];
      });
    },
    hasAllClasses(el, classes) {
      return classes.every((name) => el.classList.contains(name));
    },
    isToggledOut(el, outClasses) {
      return !this.isVisible(el) || this.hasAllClasses(el, outClasses);
    },
    filterToEls(liveSocket2, sourceEl, { to }) {
      let defaultQuery = () => {
        if (typeof to === "string") {
          return document.querySelectorAll(to);
        } else if (to.closest) {
          let toEl = sourceEl.closest(to.closest);
          return toEl ? [toEl] : [];
        } else if (to.inner) {
          return sourceEl.querySelectorAll(to.inner);
        }
      };
      return to ? liveSocket2.jsQuerySelectorAll(sourceEl, to, defaultQuery) : [sourceEl];
    },
    defaultDisplay(el) {
      return { tr: "table-row", td: "table-cell" }[el.tagName.toLowerCase()] || "block";
    },
    transitionClasses(val) {
      if (!val) {
        return null;
      }
      let [trans, tStart, tEnd] = Array.isArray(val) ? val : [val.split(" "), [], []];
      trans = Array.isArray(trans) ? trans : trans.split(" ");
      tStart = Array.isArray(tStart) ? tStart : tStart.split(" ");
      tEnd = Array.isArray(tEnd) ? tEnd : tEnd.split(" ");
      return [trans, tStart, tEnd];
    }
  };
  var js_default = JS;
  var HOOK_ID = "hookId";
  var viewHookID = 1;
  var ViewHook = class {
    static makeID() {
      return viewHookID++;
    }
    static elementID(el) {
      return dom_default.private(el, HOOK_ID);
    }
    constructor(view, el, callbacks) {
      this.el = el;
      this.__attachView(view);
      this.__callbacks = callbacks;
      this.__listeners = /* @__PURE__ */ new Set();
      this.__isDisconnected = false;
      dom_default.putPrivate(this.el, HOOK_ID, this.constructor.makeID());
      for (let key in this.__callbacks) {
        this[key] = this.__callbacks[key];
      }
    }
    __attachView(view) {
      if (view) {
        this.__view = () => view;
        this.liveSocket = view.liveSocket;
      } else {
        this.__view = () => {
          throw new Error(`hook not yet attached to a live view: ${this.el.outerHTML}`);
        };
        this.liveSocket = null;
      }
    }
    __mounted() {
      this.mounted && this.mounted();
    }
    __updated() {
      this.updated && this.updated();
    }
    __beforeUpdate() {
      this.beforeUpdate && this.beforeUpdate();
    }
    __destroyed() {
      this.destroyed && this.destroyed();
      dom_default.deletePrivate(this.el, HOOK_ID);
    }
    __reconnected() {
      if (this.__isDisconnected) {
        this.__isDisconnected = false;
        this.reconnected && this.reconnected();
      }
    }
    __disconnected() {
      this.__isDisconnected = true;
      this.disconnected && this.disconnected();
    }
    /**
     * Binds the hook to JS commands.
     *
     * @param {ViewHook} hook - The ViewHook instance to bind.
     *
     * @returns {Object} An object with methods to manipulate the DOM and execute JavaScript.
     */
    js() {
      let hook = this;
      return {
        /**
         * Executes encoded JavaScript in the context of the hook element.
         *
         * @param {string} encodedJS - The encoded JavaScript string to execute.
         */
        exec(encodedJS) {
          hook.__view().liveSocket.execJS(hook.el, encodedJS, "hook");
        },
        /**
         * Shows an element.
         *
         * @param {HTMLElement} el - The element to show.
         * @param {Object} [opts={}] - Optional settings.
         * @param {string} [opts.display] - The CSS display value to set. Defaults "block".
         * @param {string} [opts.transition] - The CSS transition classes to set when showing.
         * @param {number} [opts.time] - The transition duration in milliseconds. Defaults 200.
         * @param {boolean} [opts.blocking] - The boolean flag to block the UI during the transition.
         *  Defaults `true`.
         */
        show(el, opts = {}) {
          let owner = hook.__view().liveSocket.owner(el);
          js_default.show("hook", owner, el, opts.display, opts.transition, opts.time, opts.blocking);
        },
        /**
         * Hides an element.
         *
         * @param {HTMLElement} el - The element to hide.
         * @param {Object} [opts={}] - Optional settings.
         * @param {string} [opts.transition] - The CSS transition classes to set when hiding.
         * @param {number} [opts.time] - The transition duration in milliseconds. Defaults 200.
         * @param {boolean} [opts.blocking] - The boolean flag to block the UI during the transition.
         *   Defaults `true`.
         */
        hide(el, opts = {}) {
          let owner = hook.__view().liveSocket.owner(el);
          js_default.hide("hook", owner, el, null, opts.transition, opts.time, opts.blocking);
        },
        /**
         * Toggles the visibility of an element.
         *
         * @param {HTMLElement} el - The element to toggle.
         * @param {Object} [opts={}] - Optional settings.
         * @param {string} [opts.display] - The CSS display value to set. Defaults "block".
         * @param {string} [opts.in] - The CSS transition classes for showing.
         *   Accepts either the string of classes to apply when toggling in, or
         *   a 3-tuple containing the transition class, the class to apply
         *   to start the transition, and the ending transition class, such as:
         *
         *       ["ease-out duration-300", "opacity-0", "opacity-100"]
         *
         * @param {string} [opts.out] - The CSS transition classes for hiding.
         *   Accepts either string of classes to apply when toggling out, or
         *   a 3-tuple containing the transition class, the class to apply
         *   to start the transition, and the ending transition class, such as:
         *
         *       ["ease-out duration-300", "opacity-100", "opacity-0"]
         *
         * @param {number} [opts.time] - The transition duration in milliseconds.
         *
         * @param {boolean} [opts.blocking] - The boolean flag to block the UI during the transition.
         *   Defaults `true`.
         */
        toggle(el, opts = {}) {
          let owner = hook.__view().liveSocket.owner(el);
          opts.in = js_default.transitionClasses(opts.in);
          opts.out = js_default.transitionClasses(opts.out);
          js_default.toggle("hook", owner, el, opts.display, opts.in, opts.out, opts.time, opts.blocking);
        },
        /**
         * Adds CSS classes to an element.
         *
         * @param {HTMLElement} el - The element to add classes to.
         * @param {string|string[]} names - The class name(s) to add.
         * @param {Object} [opts={}] - Optional settings.
         * @param {string} [opts.transition] - The CSS transition property to set.
         *   Accepts a string of classes to apply when adding classes or
         *   a 3-tuple containing the transition class, the class to apply
         *   to start the transition, and the ending transition class, such as:
         *
         *       ["ease-out duration-300", "opacity-0", "opacity-100"]
         *
         * @param {number} [opts.time] - The transition duration in milliseconds.
         * @param {boolean} [opts.blocking] - The boolean flag to block the UI during the transition.
         *   Defaults `true`.
         */
        addClass(el, names, opts = {}) {
          names = Array.isArray(names) ? names : names.split(" ");
          let owner = hook.__view().liveSocket.owner(el);
          js_default.addOrRemoveClasses(el, names, [], opts.transition, opts.time, owner, opts.blocking);
        },
        /**
         * Removes CSS classes from an element.
         *
         * @param {HTMLElement} el - The element to remove classes from.
         * @param {string|string[]} names - The class name(s) to remove.
         * @param {Object} [opts={}] - Optional settings.
         * @param {string} [opts.transition] - The CSS transition classes to set.
         *   Accepts a string of classes to apply when removing classes or
         *   a 3-tuple containing the transition class, the class to apply
         *   to start the transition, and the ending transition class, such as:
         *
         *       ["ease-out duration-300", "opacity-100", "opacity-0"]
         *
         * @param {number} [opts.time] - The transition duration in milliseconds.
         * @param {boolean} [opts.blocking] - The boolean flag to block the UI during the transition.
         *   Defaults `true`.
         */
        removeClass(el, names, opts = {}) {
          opts.transition = js_default.transitionClasses(opts.transition);
          names = Array.isArray(names) ? names : names.split(" ");
          let owner = hook.__view().liveSocket.owner(el);
          js_default.addOrRemoveClasses(el, [], names, opts.transition, opts.time, owner, opts.blocking);
        },
        /**
         * Toggles CSS classes on an element.
         *
         * @param {HTMLElement} el - The element to toggle classes on.
         * @param {string|string[]} names - The class name(s) to toggle.
         * @param {Object} [opts={}] - Optional settings.
         * @param {string} [opts.transition] - The CSS transition classes to set.
         *   Accepts a string of classes to apply when toggling classes or
         *   a 3-tuple containing the transition class, the class to apply
         *   to start the transition, and the ending transition class, such as:
         *
         *       ["ease-out duration-300", "opacity-100", "opacity-0"]
         *
         * @param {number} [opts.time] - The transition duration in milliseconds.
         * @param {boolean} [opts.blocking] - The boolean flag to block the UI during the transition.
         *   Defaults `true`.
         */
        toggleClass(el, names, opts = {}) {
          opts.transition = js_default.transitionClasses(opts.transition);
          names = Array.isArray(names) ? names : names.split(" ");
          let owner = hook.__view().liveSocket.owner(el);
          js_default.toggleClasses(el, names, opts.transition, opts.time, owner, opts.blocking);
        },
        /**
         * Applies a CSS transition to an element.
         *
         * @param {HTMLElement} el - The element to apply the transition to.
         * @param {string|string[]} transition - The transition class(es) to apply.
         *   Accepts a string of classes to apply when transitioning or
         *   a 3-tuple containing the transition class, the class to apply
         *   to start the transition, and the ending transition class, such as:
         *
         *       ["ease-out duration-300", "opacity-100", "opacity-0"]
         *
         * @param {Object} [opts={}] - Optional settings.
         * @param {number} [opts.time] - The transition duration in milliseconds.
         * @param {boolean} [opts.blocking] - The boolean flag to block the UI during the transition.
         *   Defaults `true`.
         */
        transition(el, transition, opts = {}) {
          let owner = hook.__view().liveSocket.owner(el);
          js_default.addOrRemoveClasses(el, [], [], js_default.transitionClasses(transition), opts.time, owner, opts.blocking);
        },
        /**
         * Sets an attribute on an element.
         *
         * @param {HTMLElement} el - The element to set the attribute on.
         * @param {string} attr - The attribute name to set.
         * @param {string} val - The value to set for the attribute.
         */
        setAttribute(el, attr, val) {
          js_default.setOrRemoveAttrs(el, [[attr, val]], []);
        },
        /**
         * Removes an attribute from an element.
         *
         * @param {HTMLElement} el - The element to remove the attribute from.
         * @param {string} attr - The attribute name to remove.
         */
        removeAttribute(el, attr) {
          js_default.setOrRemoveAttrs(el, [], [attr]);
        },
        /**
         * Toggles an attribute on an element between two values.
         *
         * @param {HTMLElement} el - The element to toggle the attribute on.
         * @param {string} attr - The attribute name to toggle.
         * @param {string} val1 - The first value to toggle between.
         * @param {string} val2 - The second value to toggle between.
         */
        toggleAttribute(el, attr, val1, val2) {
          js_default.toggleAttr(el, attr, val1, val2);
        }
      };
    }
    pushEvent(event, payload = {}, onReply) {
      if (onReply === void 0) {
        return new Promise((resolve, reject) => {
          try {
            const ref = this.__view().pushHookEvent(this.el, null, event, payload, (reply, _ref) => resolve(reply));
            if (ref === false) {
              reject(new Error("unable to push hook event. LiveView not connected"));
            }
          } catch (error) {
            reject(error);
          }
        });
      }
      return this.__view().pushHookEvent(this.el, null, event, payload, onReply);
    }
    pushEventTo(phxTarget, event, payload = {}, onReply) {
      if (onReply === void 0) {
        return new Promise((resolve, reject) => {
          try {
            this.__view().withinTargets(phxTarget, (view, targetCtx) => {
              const ref = view.pushHookEvent(this.el, targetCtx, event, payload, (reply, _ref) => resolve(reply));
              if (ref === false) {
                reject(new Error("unable to push hook event. LiveView not connected"));
              }
            });
          } catch (error) {
            reject(error);
          }
        });
      }
      return this.__view().withinTargets(phxTarget, (view, targetCtx) => {
        return view.pushHookEvent(this.el, targetCtx, event, payload, onReply);
      });
    }
    handleEvent(event, callback) {
      let callbackRef = (customEvent, bypass) => bypass ? event : callback(customEvent.detail);
      window.addEventListener(`phx:${event}`, callbackRef);
      this.__listeners.add(callbackRef);
      return callbackRef;
    }
    removeHandleEvent(callbackRef) {
      let event = callbackRef(null, true);
      window.removeEventListener(`phx:${event}`, callbackRef);
      this.__listeners.delete(callbackRef);
    }
    upload(name, files) {
      return this.__view().dispatchUploads(null, name, files);
    }
    uploadTo(phxTarget, name, files) {
      return this.__view().withinTargets(phxTarget, (view, targetCtx) => {
        view.dispatchUploads(targetCtx, name, files);
      });
    }
    __cleanup__() {
      this.__listeners.forEach((callbackRef) => this.removeHandleEvent(callbackRef));
    }
  };
  var prependFormDataKey = (key, prefix) => {
    let isArray = key.endsWith("[]");
    let baseKey = isArray ? key.slice(0, -2) : key;
    baseKey = baseKey.replace(/([^\[\]]+)(\]?$)/, `${prefix}$1$2`);
    if (isArray) {
      baseKey += "[]";
    }
    return baseKey;
  };
  var serializeForm = (form, opts, onlyNames = []) => {
    const { submitter } = opts;
    let injectedElement;
    if (submitter && submitter.name) {
      const input = document.createElement("input");
      input.type = "hidden";
      const formId = submitter.getAttribute("form");
      if (formId) {
        input.setAttribute("form", formId);
      }
      input.name = submitter.name;
      input.value = submitter.value;
      submitter.parentElement.insertBefore(input, submitter);
      injectedElement = input;
    }
    const formData = new FormData(form);
    const toRemove = [];
    formData.forEach((val, key, _index) => {
      if (val instanceof File) {
        toRemove.push(key);
      }
    });
    toRemove.forEach((key) => formData.delete(key));
    const params = new URLSearchParams();
    const { inputsUnused, onlyHiddenInputs } = Array.from(form.elements).reduce((acc, input) => {
      const { inputsUnused: inputsUnused2, onlyHiddenInputs: onlyHiddenInputs2 } = acc;
      const key = input.name;
      if (!key) {
        return acc;
      }
      if (inputsUnused2[key] === void 0) {
        inputsUnused2[key] = true;
      }
      if (onlyHiddenInputs2[key] === void 0) {
        onlyHiddenInputs2[key] = true;
      }
      const isUsed = dom_default.private(input, PHX_HAS_FOCUSED) || dom_default.private(input, PHX_HAS_SUBMITTED);
      const isHidden = input.type === "hidden";
      inputsUnused2[key] = inputsUnused2[key] && !isUsed;
      onlyHiddenInputs2[key] = onlyHiddenInputs2[key] && isHidden;
      return acc;
    }, { inputsUnused: {}, onlyHiddenInputs: {} });
    for (let [key, val] of formData.entries()) {
      if (onlyNames.length === 0 || onlyNames.indexOf(key) >= 0) {
        let isUnused = inputsUnused[key];
        let hidden = onlyHiddenInputs[key];
        if (isUnused && !(submitter && submitter.name == key) && !hidden) {
          params.append(prependFormDataKey(key, "_unused_"), "");
        }
        params.append(key, val);
      }
    }
    if (submitter && injectedElement) {
      submitter.parentElement.removeChild(injectedElement);
    }
    return params.toString();
  };
  var View = class _View {
    static closestView(el) {
      let liveViewEl = el.closest(PHX_VIEW_SELECTOR);
      return liveViewEl ? dom_default.private(liveViewEl, "view") : null;
    }
    constructor(el, liveSocket2, parentView, flash, liveReferer) {
      this.isDead = false;
      this.liveSocket = liveSocket2;
      this.flash = flash;
      this.parent = parentView;
      this.root = parentView ? parentView.root : this;
      this.el = el;
      dom_default.putPrivate(this.el, "view", this);
      this.id = this.el.id;
      this.ref = 0;
      this.lastAckRef = null;
      this.childJoins = 0;
      this.loaderTimer = null;
      this.disconnectedTimer = null;
      this.pendingDiffs = [];
      this.pendingForms = /* @__PURE__ */ new Set();
      this.redirect = false;
      this.href = null;
      this.joinCount = this.parent ? this.parent.joinCount - 1 : 0;
      this.joinAttempts = 0;
      this.joinPending = true;
      this.destroyed = false;
      this.joinCallback = function(onDone) {
        onDone && onDone();
      };
      this.stopCallback = function() {
      };
      this.pendingJoinOps = this.parent ? null : [];
      this.viewHooks = {};
      this.formSubmits = [];
      this.children = this.parent ? null : {};
      this.root.children[this.id] = {};
      this.formsForRecovery = {};
      this.channel = this.liveSocket.channel(`lv:${this.id}`, () => {
        let url = this.href && this.expandURL(this.href);
        return {
          redirect: this.redirect ? url : void 0,
          url: this.redirect ? void 0 : url || void 0,
          params: this.connectParams(liveReferer),
          session: this.getSession(),
          static: this.getStatic(),
          flash: this.flash
        };
      });
    }
    setHref(href) {
      this.href = href;
    }
    setRedirect(href) {
      this.redirect = true;
      this.href = href;
    }
    isMain() {
      return this.el.hasAttribute(PHX_MAIN);
    }
    connectParams(liveReferer) {
      let params = this.liveSocket.params(this.el);
      let manifest = dom_default.all(document, `[${this.binding(PHX_TRACK_STATIC)}]`).map((node) => node.src || node.href).filter((url) => typeof url === "string");
      if (manifest.length > 0) {
        params["_track_static"] = manifest;
      }
      params["_mounts"] = this.joinCount;
      params["_mount_attempts"] = this.joinAttempts;
      params["_live_referer"] = liveReferer;
      this.joinAttempts++;
      return params;
    }
    isConnected() {
      return this.channel.canPush();
    }
    getSession() {
      return this.el.getAttribute(PHX_SESSION);
    }
    getStatic() {
      let val = this.el.getAttribute(PHX_STATIC);
      return val === "" ? null : val;
    }
    destroy(callback = function() {
    }) {
      this.destroyAllChildren();
      this.destroyed = true;
      delete this.root.children[this.id];
      if (this.parent) {
        delete this.root.children[this.parent.id][this.id];
      }
      clearTimeout(this.loaderTimer);
      let onFinished = () => {
        callback();
        for (let id in this.viewHooks) {
          this.destroyHook(this.viewHooks[id]);
        }
      };
      dom_default.markPhxChildDestroyed(this.el);
      this.log("destroyed", () => ["the child has been removed from the parent"]);
      this.channel.leave().receive("ok", onFinished).receive("error", onFinished).receive("timeout", onFinished);
    }
    setContainerClasses(...classes) {
      this.el.classList.remove(
        PHX_CONNECTED_CLASS,
        PHX_LOADING_CLASS,
        PHX_ERROR_CLASS,
        PHX_CLIENT_ERROR_CLASS,
        PHX_SERVER_ERROR_CLASS
      );
      this.el.classList.add(...classes);
    }
    showLoader(timeout) {
      clearTimeout(this.loaderTimer);
      if (timeout) {
        this.loaderTimer = setTimeout(() => this.showLoader(), timeout);
      } else {
        for (let id in this.viewHooks) {
          this.viewHooks[id].__disconnected();
        }
        this.setContainerClasses(PHX_LOADING_CLASS);
      }
    }
    execAll(binding) {
      dom_default.all(this.el, `[${binding}]`, (el) => this.liveSocket.execJS(el, el.getAttribute(binding)));
    }
    hideLoader() {
      clearTimeout(this.loaderTimer);
      clearTimeout(this.disconnectedTimer);
      this.setContainerClasses(PHX_CONNECTED_CLASS);
      this.execAll(this.binding("connected"));
    }
    triggerReconnected() {
      for (let id in this.viewHooks) {
        this.viewHooks[id].__reconnected();
      }
    }
    log(kind, msgCallback) {
      this.liveSocket.log(this, kind, msgCallback);
    }
    transition(time, onStart, onDone = function() {
    }) {
      this.liveSocket.transition(time, onStart, onDone);
    }
    // calls the callback with the view and target element for the given phxTarget
    // targets can be:
    //  * an element itself, then it is simply passed to liveSocket.owner;
    //  * a CID (Component ID), then we first search the component's element in the DOM
    //  * a selector, then we search the selector in the DOM and call the callback
    //    for each element found with the corresponding owner view
    withinTargets(phxTarget, callback, dom = document, viewEl) {
      if (phxTarget instanceof HTMLElement || phxTarget instanceof SVGElement) {
        return this.liveSocket.owner(phxTarget, (view) => callback(view, phxTarget));
      }
      if (isCid(phxTarget)) {
        let targets = dom_default.findComponentNodeList(viewEl || this.el, phxTarget);
        if (targets.length === 0) {
          logError(`no component found matching phx-target of ${phxTarget}`);
        } else {
          callback(this, parseInt(phxTarget));
        }
      } else {
        let targets = Array.from(dom.querySelectorAll(phxTarget));
        if (targets.length === 0) {
          logError(`nothing found matching the phx-target selector "${phxTarget}"`);
        }
        targets.forEach((target) => this.liveSocket.owner(target, (view) => callback(view, target)));
      }
    }
    applyDiff(type, rawDiff, callback) {
      this.log(type, () => ["", clone(rawDiff)]);
      let { diff, reply, events, title } = Rendered.extract(rawDiff);
      callback({ diff, reply, events });
      if (typeof title === "string" || type == "mount") {
        window.requestAnimationFrame(() => dom_default.putTitle(title));
      }
    }
    onJoin(resp) {
      let { rendered, container, liveview_version } = resp;
      if (container) {
        let [tag, attrs] = container;
        this.el = dom_default.replaceRootContainer(this.el, tag, attrs);
      }
      this.childJoins = 0;
      this.joinPending = true;
      this.flash = null;
      if (this.root === this) {
        this.formsForRecovery = this.getFormsForRecovery();
      }
      if (this.isMain() && window.history.state === null) {
        browser_default.pushState("replace", {
          type: "patch",
          id: this.id,
          position: this.liveSocket.currentHistoryPosition
        });
      }
      if (liveview_version !== this.liveSocket.version()) {
        console.error(`LiveView asset version mismatch. JavaScript version ${this.liveSocket.version()} vs. server ${liveview_version}. To avoid issues, please ensure that your assets use the same version as the server.`);
      }
      browser_default.dropLocal(this.liveSocket.localStorage, window.location.pathname, CONSECUTIVE_RELOADS);
      this.applyDiff("mount", rendered, ({ diff, events }) => {
        this.rendered = new Rendered(this.id, diff);
        let [html, streams] = this.renderContainer(null, "join");
        this.dropPendingRefs();
        this.joinCount++;
        this.joinAttempts = 0;
        this.maybeRecoverForms(html, () => {
          this.onJoinComplete(resp, html, streams, events);
        });
      });
    }
    dropPendingRefs() {
      dom_default.all(document, `[${PHX_REF_SRC}="${this.refSrc()}"]`, (el) => {
        el.removeAttribute(PHX_REF_LOADING);
        el.removeAttribute(PHX_REF_SRC);
        el.removeAttribute(PHX_REF_LOCK);
      });
    }
    onJoinComplete({ live_patch }, html, streams, events) {
      if (this.joinCount > 1 || this.parent && !this.parent.isJoinPending()) {
        return this.applyJoinPatch(live_patch, html, streams, events);
      }
      let newChildren = dom_default.findPhxChildrenInFragment(html, this.id).filter((toEl) => {
        let fromEl = toEl.id && this.el.querySelector(`[id="${toEl.id}"]`);
        let phxStatic = fromEl && fromEl.getAttribute(PHX_STATIC);
        if (phxStatic) {
          toEl.setAttribute(PHX_STATIC, phxStatic);
        }
        if (fromEl) {
          fromEl.setAttribute(PHX_ROOT_ID, this.root.id);
        }
        return this.joinChild(toEl);
      });
      if (newChildren.length === 0) {
        if (this.parent) {
          this.root.pendingJoinOps.push([this, () => this.applyJoinPatch(live_patch, html, streams, events)]);
          this.parent.ackJoin(this);
        } else {
          this.onAllChildJoinsComplete();
          this.applyJoinPatch(live_patch, html, streams, events);
        }
      } else {
        this.root.pendingJoinOps.push([this, () => this.applyJoinPatch(live_patch, html, streams, events)]);
      }
    }
    attachTrueDocEl() {
      this.el = dom_default.byId(this.id);
      this.el.setAttribute(PHX_ROOT_ID, this.root.id);
    }
    // this is invoked for dead and live views, so we must filter by
    // by owner to ensure we aren't duplicating hooks across disconnect
    // and connected states. This also handles cases where hooks exist
    // in a root layout with a LV in the body
    execNewMounted(parent = this.el) {
      let phxViewportTop = this.binding(PHX_VIEWPORT_TOP);
      let phxViewportBottom = this.binding(PHX_VIEWPORT_BOTTOM);
      dom_default.all(parent, `[${phxViewportTop}], [${phxViewportBottom}]`, (hookEl) => {
        if (this.ownsElement(hookEl)) {
          dom_default.maintainPrivateHooks(hookEl, hookEl, phxViewportTop, phxViewportBottom);
          this.maybeAddNewHook(hookEl);
        }
      });
      dom_default.all(parent, `[${this.binding(PHX_HOOK)}], [data-phx-${PHX_HOOK}]`, (hookEl) => {
        if (this.ownsElement(hookEl)) {
          this.maybeAddNewHook(hookEl);
        }
      });
      dom_default.all(parent, `[${this.binding(PHX_MOUNTED)}]`, (el) => {
        if (this.ownsElement(el)) {
          this.maybeMounted(el);
        }
      });
    }
    applyJoinPatch(live_patch, html, streams, events) {
      this.attachTrueDocEl();
      let patch = new DOMPatch(this, this.el, this.id, html, streams, null);
      patch.markPrunableContentForRemoval();
      this.performPatch(patch, false, true);
      this.joinNewChildren();
      this.execNewMounted();
      this.joinPending = false;
      this.liveSocket.dispatchEvents(events);
      this.applyPendingUpdates();
      if (live_patch) {
        let { kind, to } = live_patch;
        this.liveSocket.historyPatch(to, kind);
      }
      this.hideLoader();
      if (this.joinCount > 1) {
        this.triggerReconnected();
      }
      this.stopCallback();
    }
    triggerBeforeUpdateHook(fromEl, toEl) {
      this.liveSocket.triggerDOM("onBeforeElUpdated", [fromEl, toEl]);
      let hook = this.getHook(fromEl);
      let isIgnored = hook && dom_default.isIgnored(fromEl, this.binding(PHX_UPDATE));
      if (hook && !fromEl.isEqualNode(toEl) && !(isIgnored && isEqualObj(fromEl.dataset, toEl.dataset))) {
        hook.__beforeUpdate();
        return hook;
      }
    }
    maybeMounted(el) {
      let phxMounted = el.getAttribute(this.binding(PHX_MOUNTED));
      let hasBeenInvoked = phxMounted && dom_default.private(el, "mounted");
      if (phxMounted && !hasBeenInvoked) {
        this.liveSocket.execJS(el, phxMounted);
        dom_default.putPrivate(el, "mounted", true);
      }
    }
    maybeAddNewHook(el) {
      let newHook = this.addHook(el);
      if (newHook) {
        newHook.__mounted();
      }
    }
    performPatch(patch, pruneCids, isJoinPatch = false) {
      let removedEls = [];
      let phxChildrenAdded = false;
      let updatedHookIds = /* @__PURE__ */ new Set();
      this.liveSocket.triggerDOM("onPatchStart", [patch.targetContainer]);
      patch.after("added", (el) => {
        this.liveSocket.triggerDOM("onNodeAdded", [el]);
        let phxViewportTop = this.binding(PHX_VIEWPORT_TOP);
        let phxViewportBottom = this.binding(PHX_VIEWPORT_BOTTOM);
        dom_default.maintainPrivateHooks(el, el, phxViewportTop, phxViewportBottom);
        this.maybeAddNewHook(el);
        if (el.getAttribute) {
          this.maybeMounted(el);
        }
      });
      patch.after("phxChildAdded", (el) => {
        if (dom_default.isPhxSticky(el)) {
          this.liveSocket.joinRootViews();
        } else {
          phxChildrenAdded = true;
        }
      });
      patch.before("updated", (fromEl, toEl) => {
        let hook = this.triggerBeforeUpdateHook(fromEl, toEl);
        if (hook) {
          updatedHookIds.add(fromEl.id);
        }
      });
      patch.after("updated", (el) => {
        if (updatedHookIds.has(el.id)) {
          this.getHook(el).__updated();
        }
      });
      patch.after("discarded", (el) => {
        if (el.nodeType === Node.ELEMENT_NODE) {
          removedEls.push(el);
        }
      });
      patch.after("transitionsDiscarded", (els) => this.afterElementsRemoved(els, pruneCids));
      patch.perform(isJoinPatch);
      this.afterElementsRemoved(removedEls, pruneCids);
      this.liveSocket.triggerDOM("onPatchEnd", [patch.targetContainer]);
      return phxChildrenAdded;
    }
    afterElementsRemoved(elements, pruneCids) {
      let destroyedCIDs = [];
      elements.forEach((parent) => {
        let components = dom_default.all(parent, `[${PHX_COMPONENT}]`);
        let hooks = dom_default.all(parent, `[${this.binding(PHX_HOOK)}], [data-phx-hook]`);
        components.concat(parent).forEach((el) => {
          let cid = this.componentID(el);
          if (isCid(cid) && destroyedCIDs.indexOf(cid) === -1) {
            destroyedCIDs.push(cid);
          }
        });
        hooks.concat(parent).forEach((hookEl) => {
          let hook = this.getHook(hookEl);
          hook && this.destroyHook(hook);
        });
      });
      if (pruneCids) {
        this.maybePushComponentsDestroyed(destroyedCIDs);
      }
    }
    joinNewChildren() {
      dom_default.findPhxChildren(this.el, this.id).forEach((el) => this.joinChild(el));
    }
    maybeRecoverForms(html, callback) {
      const phxChange = this.binding("change");
      const oldForms = this.root.formsForRecovery;
      let template = document.createElement("template");
      template.innerHTML = html;
      const rootEl = template.content.firstElementChild;
      rootEl.id = this.id;
      rootEl.setAttribute(PHX_ROOT_ID, this.root.id);
      rootEl.setAttribute(PHX_SESSION, this.getSession());
      rootEl.setAttribute(PHX_STATIC, this.getStatic());
      rootEl.setAttribute(PHX_PARENT_ID, this.parent ? this.parent.id : null);
      const formsToRecover = (
        // we go over all forms in the new DOM; because this is only the HTML for the current
        // view, we can be sure that all forms are owned by this view:
        dom_default.all(template.content, "form").filter((newForm) => newForm.id && oldForms[newForm.id]).filter((newForm) => !this.pendingForms.has(newForm.id)).filter((newForm) => oldForms[newForm.id].getAttribute(phxChange) === newForm.getAttribute(phxChange)).map((newForm) => {
          return [oldForms[newForm.id], newForm];
        })
      );
      if (formsToRecover.length === 0) {
        return callback();
      }
      formsToRecover.forEach(([oldForm, newForm], i) => {
        this.pendingForms.add(newForm.id);
        this.pushFormRecovery(oldForm, newForm, template.content.firstElementChild, () => {
          this.pendingForms.delete(newForm.id);
          if (i === formsToRecover.length - 1) {
            callback();
          }
        });
      });
    }
    getChildById(id) {
      return this.root.children[this.id][id];
    }
    getDescendentByEl(el) {
      var _a;
      if (el.id === this.id) {
        return this;
      } else {
        return (_a = this.children[el.getAttribute(PHX_PARENT_ID)]) == null ? void 0 : _a[el.id];
      }
    }
    destroyDescendent(id) {
      for (let parentId in this.root.children) {
        for (let childId in this.root.children[parentId]) {
          if (childId === id) {
            return this.root.children[parentId][childId].destroy();
          }
        }
      }
    }
    joinChild(el) {
      let child = this.getChildById(el.id);
      if (!child) {
        let view = new _View(el, this.liveSocket, this);
        this.root.children[this.id][view.id] = view;
        view.join();
        this.childJoins++;
        return true;
      }
    }
    isJoinPending() {
      return this.joinPending;
    }
    ackJoin(_child) {
      this.childJoins--;
      if (this.childJoins === 0) {
        if (this.parent) {
          this.parent.ackJoin(this);
        } else {
          this.onAllChildJoinsComplete();
        }
      }
    }
    onAllChildJoinsComplete() {
      this.pendingForms.clear();
      this.formsForRecovery = {};
      this.joinCallback(() => {
        this.pendingJoinOps.forEach(([view, op]) => {
          if (!view.isDestroyed()) {
            op();
          }
        });
        this.pendingJoinOps = [];
      });
    }
    update(diff, events) {
      if (this.isJoinPending() || this.liveSocket.hasPendingLink() && this.root.isMain()) {
        return this.pendingDiffs.push({ diff, events });
      }
      this.rendered.mergeDiff(diff);
      let phxChildrenAdded = false;
      if (this.rendered.isComponentOnlyDiff(diff)) {
        this.liveSocket.time("component patch complete", () => {
          let parentCids = dom_default.findExistingParentCIDs(this.el, this.rendered.componentCIDs(diff));
          parentCids.forEach((parentCID) => {
            if (this.componentPatch(this.rendered.getComponent(diff, parentCID), parentCID)) {
              phxChildrenAdded = true;
            }
          });
        });
      } else if (!isEmpty(diff)) {
        this.liveSocket.time("full patch complete", () => {
          let [html, streams] = this.renderContainer(diff, "update");
          let patch = new DOMPatch(this, this.el, this.id, html, streams, null);
          phxChildrenAdded = this.performPatch(patch, true);
        });
      }
      this.liveSocket.dispatchEvents(events);
      if (phxChildrenAdded) {
        this.joinNewChildren();
      }
    }
    renderContainer(diff, kind) {
      return this.liveSocket.time(`toString diff (${kind})`, () => {
        let tag = this.el.tagName;
        let cids = diff ? this.rendered.componentCIDs(diff) : null;
        let [html, streams] = this.rendered.toString(cids);
        return [`<${tag}>${html}</${tag}>`, streams];
      });
    }
    componentPatch(diff, cid) {
      if (isEmpty(diff))
        return false;
      let [html, streams] = this.rendered.componentToString(cid);
      let patch = new DOMPatch(this, this.el, this.id, html, streams, cid);
      let childrenAdded = this.performPatch(patch, true);
      return childrenAdded;
    }
    getHook(el) {
      return this.viewHooks[ViewHook.elementID(el)];
    }
    addHook(el) {
      let hookElId = ViewHook.elementID(el);
      if (el.getAttribute && !this.ownsElement(el)) {
        return;
      }
      if (hookElId && !this.viewHooks[hookElId]) {
        let hook = dom_default.getCustomElHook(el) || logError(`no hook found for custom element: ${el.id}`);
        this.viewHooks[hookElId] = hook;
        hook.__attachView(this);
        return hook;
      } else if (hookElId || !el.getAttribute) {
        return;
      } else {
        let hookName = el.getAttribute(`data-phx-${PHX_HOOK}`) || el.getAttribute(this.binding(PHX_HOOK));
        let callbacks = this.liveSocket.getHookCallbacks(hookName);
        if (callbacks) {
          if (!el.id) {
            logError(`no DOM ID for hook "${hookName}". Hooks require a unique ID on each element.`, el);
          }
          let hook = new ViewHook(this, el, callbacks);
          this.viewHooks[ViewHook.elementID(hook.el)] = hook;
          return hook;
        } else if (hookName !== null) {
          logError(`unknown hook found for "${hookName}"`, el);
        }
      }
    }
    destroyHook(hook) {
      const hookId = ViewHook.elementID(hook.el);
      hook.__destroyed();
      hook.__cleanup__();
      delete this.viewHooks[hookId];
    }
    applyPendingUpdates() {
      if (this.liveSocket.hasPendingLink() && this.root.isMain()) {
        return;
      }
      this.pendingDiffs.forEach(({ diff, events }) => this.update(diff, events));
      this.pendingDiffs = [];
      this.eachChild((child) => child.applyPendingUpdates());
    }
    eachChild(callback) {
      let children = this.root.children[this.id] || {};
      for (let id in children) {
        callback(this.getChildById(id));
      }
    }
    onChannel(event, cb) {
      this.liveSocket.onChannel(this.channel, event, (resp) => {
        if (this.isJoinPending()) {
          this.root.pendingJoinOps.push([this, () => cb(resp)]);
        } else {
          this.liveSocket.requestDOMUpdate(() => cb(resp));
        }
      });
    }
    bindChannel() {
      this.liveSocket.onChannel(this.channel, "diff", (rawDiff) => {
        this.liveSocket.requestDOMUpdate(() => {
          this.applyDiff("update", rawDiff, ({ diff, events }) => this.update(diff, events));
        });
      });
      this.onChannel("redirect", ({ to, flash }) => this.onRedirect({ to, flash }));
      this.onChannel("live_patch", (redir) => this.onLivePatch(redir));
      this.onChannel("live_redirect", (redir) => this.onLiveRedirect(redir));
      this.channel.onError((reason) => this.onError(reason));
      this.channel.onClose((reason) => this.onClose(reason));
    }
    destroyAllChildren() {
      this.eachChild((child) => child.destroy());
    }
    onLiveRedirect(redir) {
      let { to, kind, flash } = redir;
      let url = this.expandURL(to);
      let e = new CustomEvent("phx:server-navigate", { detail: { to, kind, flash } });
      this.liveSocket.historyRedirect(e, url, kind, flash);
    }
    onLivePatch(redir) {
      let { to, kind } = redir;
      this.href = this.expandURL(to);
      this.liveSocket.historyPatch(to, kind);
    }
    expandURL(to) {
      return to.startsWith("/") ? `${window.location.protocol}//${window.location.host}${to}` : to;
    }
    onRedirect({ to, flash, reloadToken }) {
      this.liveSocket.redirect(to, flash, reloadToken);
    }
    isDestroyed() {
      return this.destroyed;
    }
    joinDead() {
      this.isDead = true;
    }
    joinPush() {
      this.joinPush = this.joinPush || this.channel.join();
      return this.joinPush;
    }
    join(callback) {
      this.showLoader(this.liveSocket.loaderTimeout);
      this.bindChannel();
      if (this.isMain()) {
        this.stopCallback = this.liveSocket.withPageLoading({ to: this.href, kind: "initial" });
      }
      this.joinCallback = (onDone) => {
        onDone = onDone || function() {
        };
        callback ? callback(this.joinCount, onDone) : onDone();
      };
      this.wrapPush(() => this.channel.join(), {
        ok: (resp) => this.liveSocket.requestDOMUpdate(() => this.onJoin(resp)),
        error: (error) => this.onJoinError(error),
        timeout: () => this.onJoinError({ reason: "timeout" })
      });
    }
    onJoinError(resp) {
      if (resp.reason === "reload") {
        this.log("error", () => [`failed mount with ${resp.status}. Falling back to page reload`, resp]);
        this.onRedirect({ to: this.root.href, reloadToken: resp.token });
        return;
      } else if (resp.reason === "unauthorized" || resp.reason === "stale") {
        this.log("error", () => ["unauthorized live_redirect. Falling back to page request", resp]);
        this.onRedirect({ to: this.root.href });
        return;
      }
      if (resp.redirect || resp.live_redirect) {
        this.joinPending = false;
        this.channel.leave();
      }
      if (resp.redirect) {
        return this.onRedirect(resp.redirect);
      }
      if (resp.live_redirect) {
        return this.onLiveRedirect(resp.live_redirect);
      }
      this.log("error", () => ["unable to join", resp]);
      if (this.isMain()) {
        this.displayError([PHX_LOADING_CLASS, PHX_ERROR_CLASS, PHX_SERVER_ERROR_CLASS]);
        if (this.liveSocket.isConnected()) {
          this.liveSocket.reloadWithJitter(this);
        }
      } else {
        if (this.joinAttempts >= MAX_CHILD_JOIN_ATTEMPTS) {
          this.root.displayError([PHX_LOADING_CLASS, PHX_ERROR_CLASS, PHX_SERVER_ERROR_CLASS]);
          this.log("error", () => [`giving up trying to mount after ${MAX_CHILD_JOIN_ATTEMPTS} tries`, resp]);
          this.destroy();
        }
        let trueChildEl = dom_default.byId(this.el.id);
        if (trueChildEl) {
          dom_default.mergeAttrs(trueChildEl, this.el);
          this.displayError([PHX_LOADING_CLASS, PHX_ERROR_CLASS, PHX_SERVER_ERROR_CLASS]);
          this.el = trueChildEl;
        } else {
          this.destroy();
        }
      }
    }
    onClose(reason) {
      if (this.isDestroyed()) {
        return;
      }
      if (this.isMain() && this.liveSocket.hasPendingLink() && reason !== "leave") {
        return this.liveSocket.reloadWithJitter(this);
      }
      this.destroyAllChildren();
      this.liveSocket.dropActiveElement(this);
      if (document.activeElement) {
        document.activeElement.blur();
      }
      if (this.liveSocket.isUnloaded()) {
        this.showLoader(BEFORE_UNLOAD_LOADER_TIMEOUT);
      }
    }
    onError(reason) {
      this.onClose(reason);
      if (this.liveSocket.isConnected()) {
        this.log("error", () => ["view crashed", reason]);
      }
      if (!this.liveSocket.isUnloaded()) {
        if (this.liveSocket.isConnected()) {
          this.displayError([PHX_LOADING_CLASS, PHX_ERROR_CLASS, PHX_SERVER_ERROR_CLASS]);
        } else {
          this.displayError([PHX_LOADING_CLASS, PHX_ERROR_CLASS, PHX_CLIENT_ERROR_CLASS]);
        }
      }
    }
    displayError(classes) {
      if (this.isMain()) {
        dom_default.dispatchEvent(window, "phx:page-loading-start", { detail: { to: this.href, kind: "error" } });
      }
      this.showLoader();
      this.setContainerClasses(...classes);
      this.delayedDisconnected();
    }
    delayedDisconnected() {
      this.disconnectedTimer = setTimeout(() => {
        this.execAll(this.binding("disconnected"));
      }, this.liveSocket.disconnectedTimeout);
    }
    wrapPush(callerPush, receives) {
      let latency = this.liveSocket.getLatencySim();
      let withLatency = latency ? (cb) => setTimeout(() => !this.isDestroyed() && cb(), latency) : (cb) => !this.isDestroyed() && cb();
      withLatency(() => {
        callerPush().receive("ok", (resp) => withLatency(() => receives.ok && receives.ok(resp))).receive("error", (reason) => withLatency(() => receives.error && receives.error(reason))).receive("timeout", () => withLatency(() => receives.timeout && receives.timeout()));
      });
    }
    pushWithReply(refGenerator, event, payload) {
      if (!this.isConnected()) {
        return Promise.reject({ error: "noconnection" });
      }
      let [ref, [el], opts] = refGenerator ? refGenerator() : [null, [], {}];
      let oldJoinCount = this.joinCount;
      let onLoadingDone = function() {
      };
      if (opts.page_loading) {
        onLoadingDone = this.liveSocket.withPageLoading({ kind: "element", target: el });
      }
      if (typeof payload.cid !== "number") {
        delete payload.cid;
      }
      return new Promise((resolve, reject) => {
        this.wrapPush(() => this.channel.push(event, payload, PUSH_TIMEOUT), {
          ok: (resp) => {
            if (ref !== null) {
              this.lastAckRef = ref;
            }
            let finish = (hookReply) => {
              if (resp.redirect) {
                this.onRedirect(resp.redirect);
              }
              if (resp.live_patch) {
                this.onLivePatch(resp.live_patch);
              }
              if (resp.live_redirect) {
                this.onLiveRedirect(resp.live_redirect);
              }
              onLoadingDone();
              resolve({ resp, reply: hookReply });
            };
            if (resp.diff) {
              this.liveSocket.requestDOMUpdate(() => {
                this.applyDiff("update", resp.diff, ({ diff, reply, events }) => {
                  if (ref !== null) {
                    this.undoRefs(ref, payload.event);
                  }
                  this.update(diff, events);
                  finish(reply);
                });
              });
            } else {
              if (ref !== null) {
                this.undoRefs(ref, payload.event);
              }
              finish(null);
            }
          },
          error: (reason) => reject({ error: reason }),
          timeout: () => {
            reject({ timeout: true });
            if (this.joinCount === oldJoinCount) {
              this.liveSocket.reloadWithJitter(this, () => {
                this.log("timeout", () => ["received timeout while communicating with server. Falling back to hard refresh for recovery"]);
              });
            }
          }
        });
      });
    }
    undoRefs(ref, phxEvent, onlyEls) {
      if (!this.isConnected()) {
        return;
      }
      let selector = `[${PHX_REF_SRC}="${this.refSrc()}"]`;
      if (onlyEls) {
        onlyEls = new Set(onlyEls);
        dom_default.all(document, selector, (parent) => {
          if (onlyEls && !onlyEls.has(parent)) {
            return;
          }
          dom_default.all(parent, selector, (child) => this.undoElRef(child, ref, phxEvent));
          this.undoElRef(parent, ref, phxEvent);
        });
      } else {
        dom_default.all(document, selector, (el) => this.undoElRef(el, ref, phxEvent));
      }
    }
    undoElRef(el, ref, phxEvent) {
      let elRef = new ElementRef(el);
      elRef.maybeUndo(ref, phxEvent, (clonedTree) => {
        let patch = new DOMPatch(this, el, this.id, clonedTree, [], null, { undoRef: ref });
        const phxChildrenAdded = this.performPatch(patch, true);
        dom_default.all(el, `[${PHX_REF_SRC}="${this.refSrc()}"]`, (child) => this.undoElRef(child, ref, phxEvent));
        if (phxChildrenAdded) {
          this.joinNewChildren();
        }
      });
    }
    refSrc() {
      return this.el.id;
    }
    putRef(elements, phxEvent, eventType, opts = {}) {
      let newRef = this.ref++;
      let disableWith = this.binding(PHX_DISABLE_WITH);
      if (opts.loading) {
        let loadingEls = dom_default.all(document, opts.loading).map((el) => {
          return { el, lock: true, loading: true };
        });
        elements = elements.concat(loadingEls);
      }
      for (let { el, lock, loading } of elements) {
        if (!lock && !loading) {
          throw new Error("putRef requires lock or loading");
        }
        el.setAttribute(PHX_REF_SRC, this.refSrc());
        if (loading) {
          el.setAttribute(PHX_REF_LOADING, newRef);
        }
        if (lock) {
          el.setAttribute(PHX_REF_LOCK, newRef);
        }
        if (!loading || opts.submitter && !(el === opts.submitter || el === opts.form)) {
          continue;
        }
        let lockCompletePromise = new Promise((resolve) => {
          el.addEventListener(`phx:undo-lock:${newRef}`, () => resolve(detail), { once: true });
        });
        let loadingCompletePromise = new Promise((resolve) => {
          el.addEventListener(`phx:undo-loading:${newRef}`, () => resolve(detail), { once: true });
        });
        el.classList.add(`phx-${eventType}-loading`);
        let disableText = el.getAttribute(disableWith);
        if (disableText !== null) {
          if (!el.getAttribute(PHX_DISABLE_WITH_RESTORE)) {
            el.setAttribute(PHX_DISABLE_WITH_RESTORE, el.innerText);
          }
          if (disableText !== "") {
            el.innerText = disableText;
          }
          el.setAttribute(PHX_DISABLED, el.getAttribute(PHX_DISABLED) || el.disabled);
          el.setAttribute("disabled", "");
        }
        let detail = {
          event: phxEvent,
          eventType,
          ref: newRef,
          isLoading: loading,
          isLocked: lock,
          lockElements: elements.filter(({ lock: lock2 }) => lock2).map(({ el: el2 }) => el2),
          loadingElements: elements.filter(({ loading: loading2 }) => loading2).map(({ el: el2 }) => el2),
          unlock: (els) => {
            els = Array.isArray(els) ? els : [els];
            this.undoRefs(newRef, phxEvent, els);
          },
          lockComplete: lockCompletePromise,
          loadingComplete: loadingCompletePromise,
          lock: (lockEl) => {
            return new Promise((resolve) => {
              if (this.isAcked(newRef)) {
                return resolve(detail);
              }
              lockEl.setAttribute(PHX_REF_LOCK, newRef);
              lockEl.setAttribute(PHX_REF_SRC, this.refSrc());
              lockEl.addEventListener(`phx:lock-stop:${newRef}`, () => resolve(detail), { once: true });
            });
          }
        };
        el.dispatchEvent(new CustomEvent("phx:push", {
          detail,
          bubbles: true,
          cancelable: false
        }));
        if (phxEvent) {
          el.dispatchEvent(new CustomEvent(`phx:push:${phxEvent}`, {
            detail,
            bubbles: true,
            cancelable: false
          }));
        }
      }
      return [newRef, elements.map(({ el }) => el), opts];
    }
    isAcked(ref) {
      return this.lastAckRef !== null && this.lastAckRef >= ref;
    }
    componentID(el) {
      let cid = el.getAttribute && el.getAttribute(PHX_COMPONENT);
      return cid ? parseInt(cid) : null;
    }
    targetComponentID(target, targetCtx, opts = {}) {
      if (isCid(targetCtx)) {
        return targetCtx;
      }
      let cidOrSelector = opts.target || target.getAttribute(this.binding("target"));
      if (isCid(cidOrSelector)) {
        return parseInt(cidOrSelector);
      } else if (targetCtx && (cidOrSelector !== null || opts.target)) {
        return this.closestComponentID(targetCtx);
      } else {
        return null;
      }
    }
    closestComponentID(targetCtx) {
      if (isCid(targetCtx)) {
        return targetCtx;
      } else if (targetCtx) {
        return maybe(targetCtx.closest(`[${PHX_COMPONENT}]`), (el) => this.ownsElement(el) && this.componentID(el));
      } else {
        return null;
      }
    }
    pushHookEvent(el, targetCtx, event, payload, onReply) {
      if (!this.isConnected()) {
        this.log("hook", () => ["unable to push hook event. LiveView not connected", event, payload]);
        return false;
      }
      let [ref, els, opts] = this.putRef([{ el, loading: true, lock: true }], event, "hook");
      this.pushWithReply(() => [ref, els, opts], "event", {
        type: "hook",
        event,
        value: payload,
        cid: this.closestComponentID(targetCtx)
      }).then(({ resp: _resp, reply: hookReply }) => onReply(hookReply, ref));
      return ref;
    }
    extractMeta(el, meta, value) {
      let prefix = this.binding("value-");
      for (let i = 0; i < el.attributes.length; i++) {
        if (!meta) {
          meta = {};
        }
        let name = el.attributes[i].name;
        if (name.startsWith(prefix)) {
          meta[name.replace(prefix, "")] = el.getAttribute(name);
        }
      }
      if (el.value !== void 0 && !(el instanceof HTMLFormElement)) {
        if (!meta) {
          meta = {};
        }
        meta.value = el.value;
        if (el.tagName === "INPUT" && CHECKABLE_INPUTS.indexOf(el.type) >= 0 && !el.checked) {
          delete meta.value;
        }
      }
      if (value) {
        if (!meta) {
          meta = {};
        }
        for (let key in value) {
          meta[key] = value[key];
        }
      }
      return meta;
    }
    pushEvent(type, el, targetCtx, phxEvent, meta, opts = {}, onReply) {
      this.pushWithReply(() => this.putRef([{ el, loading: true, lock: true }], phxEvent, type, opts), "event", {
        type,
        event: phxEvent,
        value: this.extractMeta(el, meta, opts.value),
        cid: this.targetComponentID(el, targetCtx, opts)
      }).then(({ reply }) => onReply && onReply(reply));
    }
    pushFileProgress(fileEl, entryRef, progress, onReply = function() {
    }) {
      this.liveSocket.withinOwners(fileEl.form, (view, targetCtx) => {
        view.pushWithReply(null, "progress", {
          event: fileEl.getAttribute(view.binding(PHX_PROGRESS)),
          ref: fileEl.getAttribute(PHX_UPLOAD_REF),
          entry_ref: entryRef,
          progress,
          cid: view.targetComponentID(fileEl.form, targetCtx)
        }).then(({ resp }) => onReply(resp));
      });
    }
    pushInput(inputEl, targetCtx, forceCid, phxEvent, opts, callback) {
      if (!inputEl.form) {
        throw new Error("form events require the input to be inside a form");
      }
      let uploads;
      let cid = isCid(forceCid) ? forceCid : this.targetComponentID(inputEl.form, targetCtx, opts);
      let refGenerator = () => {
        return this.putRef([
          { el: inputEl, loading: true, lock: true },
          { el: inputEl.form, loading: true, lock: true }
        ], phxEvent, "change", opts);
      };
      let formData;
      let meta = this.extractMeta(inputEl.form, {}, opts.value);
      let serializeOpts = {};
      if (inputEl instanceof HTMLButtonElement) {
        serializeOpts.submitter = inputEl;
      }
      if (inputEl.getAttribute(this.binding("change"))) {
        formData = serializeForm(inputEl.form, serializeOpts, [inputEl.name]);
      } else {
        formData = serializeForm(inputEl.form, serializeOpts);
      }
      if (dom_default.isUploadInput(inputEl) && inputEl.files && inputEl.files.length > 0) {
        LiveUploader.trackFiles(inputEl, Array.from(inputEl.files));
      }
      uploads = LiveUploader.serializeUploads(inputEl);
      let event = {
        type: "form",
        event: phxEvent,
        value: formData,
        meta: __spreadValues({
          // no target was implicitly sent as "undefined" in LV <= 1.0.5, therefore
          // we have to keep it. In 1.0.6 we switched from passing meta as URL encoded data
          // to passing it directly in the event, but the JSON encode would drop keys with
          // undefined values.
          _target: opts._target || "undefined"
        }, meta),
        uploads,
        cid
      };
      this.pushWithReply(refGenerator, "event", event).then(({ resp }) => {
        if (dom_default.isUploadInput(inputEl) && dom_default.isAutoUpload(inputEl)) {
          ElementRef.onUnlock(inputEl, () => {
            if (LiveUploader.filesAwaitingPreflight(inputEl).length > 0) {
              let [ref, _els] = refGenerator();
              this.undoRefs(ref, phxEvent, [inputEl.form]);
              this.uploadFiles(inputEl.form, phxEvent, targetCtx, ref, cid, (_uploads) => {
                callback && callback(resp);
                this.triggerAwaitingSubmit(inputEl.form, phxEvent);
                this.undoRefs(ref, phxEvent);
              });
            }
          });
        } else {
          callback && callback(resp);
        }
      });
    }
    triggerAwaitingSubmit(formEl, phxEvent) {
      let awaitingSubmit = this.getScheduledSubmit(formEl);
      if (awaitingSubmit) {
        let [_el, _ref, _opts, callback] = awaitingSubmit;
        this.cancelSubmit(formEl, phxEvent);
        callback();
      }
    }
    getScheduledSubmit(formEl) {
      return this.formSubmits.find(([el, _ref, _opts, _callback]) => el.isSameNode(formEl));
    }
    scheduleSubmit(formEl, ref, opts, callback) {
      if (this.getScheduledSubmit(formEl)) {
        return true;
      }
      this.formSubmits.push([formEl, ref, opts, callback]);
    }
    cancelSubmit(formEl, phxEvent) {
      this.formSubmits = this.formSubmits.filter(([el, ref, _opts, _callback]) => {
        if (el.isSameNode(formEl)) {
          this.undoRefs(ref, phxEvent);
          return false;
        } else {
          return true;
        }
      });
    }
    disableForm(formEl, phxEvent, opts = {}) {
      let filterIgnored = (el) => {
        let userIgnored = closestPhxBinding(el, `${this.binding(PHX_UPDATE)}=ignore`, el.form);
        return !(userIgnored || closestPhxBinding(el, "data-phx-update=ignore", el.form));
      };
      let filterDisables = (el) => {
        return el.hasAttribute(this.binding(PHX_DISABLE_WITH));
      };
      let filterButton = (el) => el.tagName == "BUTTON";
      let filterInput = (el) => ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName);
      let formElements = Array.from(formEl.elements);
      let disables = formElements.filter(filterDisables);
      let buttons = formElements.filter(filterButton).filter(filterIgnored);
      let inputs = formElements.filter(filterInput).filter(filterIgnored);
      buttons.forEach((button) => {
        button.setAttribute(PHX_DISABLED, button.disabled);
        button.disabled = true;
      });
      inputs.forEach((input) => {
        input.setAttribute(PHX_READONLY, input.readOnly);
        input.readOnly = true;
        if (input.files) {
          input.setAttribute(PHX_DISABLED, input.disabled);
          input.disabled = true;
        }
      });
      let formEls = disables.concat(buttons).concat(inputs).map((el) => {
        return { el, loading: true, lock: true };
      });
      let els = [{ el: formEl, loading: true, lock: false }].concat(formEls).reverse();
      return this.putRef(els, phxEvent, "submit", opts);
    }
    pushFormSubmit(formEl, targetCtx, phxEvent, submitter, opts, onReply) {
      let refGenerator = () => this.disableForm(formEl, phxEvent, __spreadProps(__spreadValues({}, opts), {
        form: formEl,
        submitter
      }));
      let cid = this.targetComponentID(formEl, targetCtx);
      if (LiveUploader.hasUploadsInProgress(formEl)) {
        let [ref, _els] = refGenerator();
        let push = () => this.pushFormSubmit(formEl, targetCtx, phxEvent, submitter, opts, onReply);
        return this.scheduleSubmit(formEl, ref, opts, push);
      } else if (LiveUploader.inputsAwaitingPreflight(formEl).length > 0) {
        let [ref, els] = refGenerator();
        let proxyRefGen = () => [ref, els, opts];
        this.uploadFiles(formEl, phxEvent, targetCtx, ref, cid, (_uploads) => {
          if (LiveUploader.inputsAwaitingPreflight(formEl).length > 0) {
            return this.undoRefs(ref, phxEvent);
          }
          let meta = this.extractMeta(formEl, {}, opts.value);
          let formData = serializeForm(formEl, { submitter });
          this.pushWithReply(proxyRefGen, "event", {
            type: "form",
            event: phxEvent,
            value: formData,
            meta,
            cid
          }).then(({ resp }) => onReply(resp));
        });
      } else if (!(formEl.hasAttribute(PHX_REF_SRC) && formEl.classList.contains("phx-submit-loading"))) {
        let meta = this.extractMeta(formEl, {}, opts.value);
        let formData = serializeForm(formEl, { submitter });
        this.pushWithReply(refGenerator, "event", {
          type: "form",
          event: phxEvent,
          value: formData,
          meta,
          cid
        }).then(({ resp }) => onReply(resp));
      }
    }
    uploadFiles(formEl, phxEvent, targetCtx, ref, cid, onComplete) {
      let joinCountAtUpload = this.joinCount;
      let inputEls = LiveUploader.activeFileInputs(formEl);
      let numFileInputsInProgress = inputEls.length;
      inputEls.forEach((inputEl) => {
        let uploader = new LiveUploader(inputEl, this, () => {
          numFileInputsInProgress--;
          if (numFileInputsInProgress === 0) {
            onComplete();
          }
        });
        let entries = uploader.entries().map((entry) => entry.toPreflightPayload());
        if (entries.length === 0) {
          numFileInputsInProgress--;
          return;
        }
        let payload = {
          ref: inputEl.getAttribute(PHX_UPLOAD_REF),
          entries,
          cid: this.targetComponentID(inputEl.form, targetCtx)
        };
        this.log("upload", () => ["sending preflight request", payload]);
        this.pushWithReply(null, "allow_upload", payload).then(({ resp }) => {
          this.log("upload", () => ["got preflight response", resp]);
          uploader.entries().forEach((entry) => {
            if (resp.entries && !resp.entries[entry.ref]) {
              this.handleFailedEntryPreflight(entry.ref, "failed preflight", uploader);
            }
          });
          if (resp.error || Object.keys(resp.entries).length === 0) {
            this.undoRefs(ref, phxEvent);
            let errors = resp.error || [];
            errors.map(([entry_ref, reason]) => {
              this.handleFailedEntryPreflight(entry_ref, reason, uploader);
            });
          } else {
            let onError = (callback) => {
              this.channel.onError(() => {
                if (this.joinCount === joinCountAtUpload) {
                  callback();
                }
              });
            };
            uploader.initAdapterUpload(resp, onError, this.liveSocket);
          }
        });
      });
    }
    handleFailedEntryPreflight(uploadRef, reason, uploader) {
      if (uploader.isAutoUpload()) {
        let entry = uploader.entries().find((entry2) => entry2.ref === uploadRef.toString());
        if (entry) {
          entry.cancel();
        }
      } else {
        uploader.entries().map((entry) => entry.cancel());
      }
      this.log("upload", () => [`error for entry ${uploadRef}`, reason]);
    }
    dispatchUploads(targetCtx, name, filesOrBlobs) {
      let targetElement = this.targetCtxElement(targetCtx) || this.el;
      let inputs = dom_default.findUploadInputs(targetElement).filter((el) => el.name === name);
      if (inputs.length === 0) {
        logError(`no live file inputs found matching the name "${name}"`);
      } else if (inputs.length > 1) {
        logError(`duplicate live file inputs found matching the name "${name}"`);
      } else {
        dom_default.dispatchEvent(inputs[0], PHX_TRACK_UPLOADS, { detail: { files: filesOrBlobs } });
      }
    }
    targetCtxElement(targetCtx) {
      if (isCid(targetCtx)) {
        let [target] = dom_default.findComponentNodeList(this.el, targetCtx);
        return target;
      } else if (targetCtx) {
        return targetCtx;
      } else {
        return null;
      }
    }
    pushFormRecovery(oldForm, newForm, templateDom, callback) {
      const phxChange = this.binding("change");
      const phxTarget = newForm.getAttribute(this.binding("target")) || newForm;
      const phxEvent = newForm.getAttribute(this.binding(PHX_AUTO_RECOVER)) || newForm.getAttribute(this.binding("change"));
      const inputs = Array.from(oldForm.elements).filter((el) => dom_default.isFormInput(el) && el.name && !el.hasAttribute(phxChange));
      if (inputs.length === 0) {
        return;
      }
      inputs.forEach((input2) => input2.hasAttribute(PHX_UPLOAD_REF) && LiveUploader.clearFiles(input2));
      let input = inputs.find((el) => el.type !== "hidden") || inputs[0];
      let pending = 0;
      this.withinTargets(phxTarget, (targetView, targetCtx) => {
        const cid = this.targetComponentID(newForm, targetCtx);
        pending++;
        let e = new CustomEvent("phx:form-recovery", { detail: { sourceElement: oldForm } });
        js_default.exec(e, "change", phxEvent, this, input, ["push", {
          _target: input.name,
          targetView,
          targetCtx,
          newCid: cid,
          callback: () => {
            pending--;
            if (pending === 0) {
              callback();
            }
          }
        }]);
      }, templateDom, templateDom);
    }
    pushLinkPatch(e, href, targetEl, callback) {
      let linkRef = this.liveSocket.setPendingLink(href);
      let loading = e.isTrusted && e.type !== "popstate";
      let refGen = targetEl ? () => this.putRef([{ el: targetEl, loading, lock: true }], null, "click") : null;
      let fallback = () => this.liveSocket.redirect(window.location.href);
      let url = href.startsWith("/") ? `${location.protocol}//${location.host}${href}` : href;
      this.pushWithReply(refGen, "live_patch", { url }).then(
        ({ resp }) => {
          this.liveSocket.requestDOMUpdate(() => {
            if (resp.link_redirect) {
              this.liveSocket.replaceMain(href, null, callback, linkRef);
            } else {
              if (this.liveSocket.commitPendingLink(linkRef)) {
                this.href = href;
              }
              this.applyPendingUpdates();
              callback && callback(linkRef);
            }
          });
        },
        ({ error: _error, timeout: _timeout }) => fallback()
      );
    }
    getFormsForRecovery() {
      if (this.joinCount === 0) {
        return {};
      }
      let phxChange = this.binding("change");
      return dom_default.all(this.el, `form[${phxChange}]`).filter((form) => form.id).filter((form) => form.elements.length > 0).filter((form) => form.getAttribute(this.binding(PHX_AUTO_RECOVER)) !== "ignore").map((form) => form.cloneNode(true)).reduce((acc, form) => {
        acc[form.id] = form;
        return acc;
      }, {});
    }
    maybePushComponentsDestroyed(destroyedCIDs) {
      let willDestroyCIDs = destroyedCIDs.filter((cid) => {
        return dom_default.findComponentNodeList(this.el, cid).length === 0;
      });
      if (willDestroyCIDs.length > 0) {
        willDestroyCIDs.forEach((cid) => this.rendered.resetRender(cid));
        this.pushWithReply(null, "cids_will_destroy", { cids: willDestroyCIDs }).then(() => {
          this.liveSocket.requestDOMUpdate(() => {
            let completelyDestroyCIDs = willDestroyCIDs.filter((cid) => {
              return dom_default.findComponentNodeList(this.el, cid).length === 0;
            });
            if (completelyDestroyCIDs.length > 0) {
              this.pushWithReply(null, "cids_destroyed", { cids: completelyDestroyCIDs }).then(({ resp }) => {
                this.rendered.pruneCIDs(resp.cids);
              });
            }
          });
        });
      }
    }
    ownsElement(el) {
      let parentViewEl = el.closest(PHX_VIEW_SELECTOR);
      return el.getAttribute(PHX_PARENT_ID) === this.id || parentViewEl && parentViewEl.id === this.id || !parentViewEl && this.isDead;
    }
    submitForm(form, targetCtx, phxEvent, submitter, opts = {}) {
      dom_default.putPrivate(form, PHX_HAS_SUBMITTED, true);
      const inputs = Array.from(form.elements);
      inputs.forEach((input) => dom_default.putPrivate(input, PHX_HAS_SUBMITTED, true));
      this.liveSocket.blurActiveElement(this);
      this.pushFormSubmit(form, targetCtx, phxEvent, submitter, opts, () => {
        this.liveSocket.restorePreviouslyActiveFocus();
      });
    }
    binding(kind) {
      return this.liveSocket.binding(kind);
    }
  };
  var LiveSocket = class {
    constructor(url, phxSocket, opts = {}) {
      this.unloaded = false;
      if (!phxSocket || phxSocket.constructor.name === "Object") {
        throw new Error(`
      a phoenix Socket must be provided as the second argument to the LiveSocket constructor. For example:

          import {Socket} from "phoenix"
          import {LiveSocket} from "phoenix_live_view"
          let liveSocket = new LiveSocket("/live", Socket, {...})
      `);
      }
      this.socket = new phxSocket(url, opts);
      this.bindingPrefix = opts.bindingPrefix || BINDING_PREFIX;
      this.opts = opts;
      this.params = closure2(opts.params || {});
      this.viewLogger = opts.viewLogger;
      this.metadataCallbacks = opts.metadata || {};
      this.defaults = Object.assign(clone(DEFAULTS), opts.defaults || {});
      this.activeElement = null;
      this.prevActive = null;
      this.silenced = false;
      this.main = null;
      this.outgoingMainEl = null;
      this.clickStartedAtTarget = null;
      this.linkRef = 1;
      this.roots = {};
      this.href = window.location.href;
      this.pendingLink = null;
      this.currentLocation = clone(window.location);
      this.hooks = opts.hooks || {};
      this.uploaders = opts.uploaders || {};
      this.loaderTimeout = opts.loaderTimeout || LOADER_TIMEOUT;
      this.disconnectedTimeout = opts.disconnectedTimeout || DISCONNECTED_TIMEOUT;
      this.reloadWithJitterTimer = null;
      this.maxReloads = opts.maxReloads || MAX_RELOADS;
      this.reloadJitterMin = opts.reloadJitterMin || RELOAD_JITTER_MIN;
      this.reloadJitterMax = opts.reloadJitterMax || RELOAD_JITTER_MAX;
      this.failsafeJitter = opts.failsafeJitter || FAILSAFE_JITTER;
      this.localStorage = opts.localStorage || window.localStorage;
      this.sessionStorage = opts.sessionStorage || window.sessionStorage;
      this.boundTopLevelEvents = false;
      this.boundEventNames = /* @__PURE__ */ new Set();
      this.serverCloseRef = null;
      this.domCallbacks = Object.assign(
        {
          jsQuerySelectorAll: null,
          onPatchStart: closure2(),
          onPatchEnd: closure2(),
          onNodeAdded: closure2(),
          onBeforeElUpdated: closure2()
        },
        opts.dom || {}
      );
      this.transitions = new TransitionSet();
      this.currentHistoryPosition = parseInt(this.sessionStorage.getItem(PHX_LV_HISTORY_POSITION)) || 0;
      window.addEventListener("pagehide", (_e) => {
        this.unloaded = true;
      });
      this.socket.onOpen(() => {
        if (this.isUnloaded()) {
          window.location.reload();
        }
      });
    }
    // public
    version() {
      return "1.0.9";
    }
    isProfileEnabled() {
      return this.sessionStorage.getItem(PHX_LV_PROFILE) === "true";
    }
    isDebugEnabled() {
      return this.sessionStorage.getItem(PHX_LV_DEBUG) === "true";
    }
    isDebugDisabled() {
      return this.sessionStorage.getItem(PHX_LV_DEBUG) === "false";
    }
    enableDebug() {
      this.sessionStorage.setItem(PHX_LV_DEBUG, "true");
    }
    enableProfiling() {
      this.sessionStorage.setItem(PHX_LV_PROFILE, "true");
    }
    disableDebug() {
      this.sessionStorage.setItem(PHX_LV_DEBUG, "false");
    }
    disableProfiling() {
      this.sessionStorage.removeItem(PHX_LV_PROFILE);
    }
    enableLatencySim(upperBoundMs) {
      this.enableDebug();
      console.log("latency simulator enabled for the duration of this browser session. Call disableLatencySim() to disable");
      this.sessionStorage.setItem(PHX_LV_LATENCY_SIM, upperBoundMs);
    }
    disableLatencySim() {
      this.sessionStorage.removeItem(PHX_LV_LATENCY_SIM);
    }
    getLatencySim() {
      let str = this.sessionStorage.getItem(PHX_LV_LATENCY_SIM);
      return str ? parseInt(str) : null;
    }
    getSocket() {
      return this.socket;
    }
    connect() {
      if (window.location.hostname === "localhost" && !this.isDebugDisabled()) {
        this.enableDebug();
      }
      let doConnect = () => {
        this.resetReloadStatus();
        if (this.joinRootViews()) {
          this.bindTopLevelEvents();
          this.socket.connect();
        } else if (this.main) {
          this.socket.connect();
        } else {
          this.bindTopLevelEvents({ dead: true });
        }
        this.joinDeadView();
      };
      if (["complete", "loaded", "interactive"].indexOf(document.readyState) >= 0) {
        doConnect();
      } else {
        document.addEventListener("DOMContentLoaded", () => doConnect());
      }
    }
    disconnect(callback) {
      clearTimeout(this.reloadWithJitterTimer);
      if (this.serverCloseRef) {
        this.socket.off(this.serverCloseRef);
        this.serverCloseRef = null;
      }
      this.socket.disconnect(callback);
    }
    replaceTransport(transport) {
      clearTimeout(this.reloadWithJitterTimer);
      this.socket.replaceTransport(transport);
      this.connect();
    }
    execJS(el, encodedJS, eventType = null) {
      let e = new CustomEvent("phx:exec", { detail: { sourceElement: el } });
      this.owner(el, (view) => js_default.exec(e, eventType, encodedJS, view, el));
    }
    // private
    execJSHookPush(el, phxEvent, data, callback) {
      this.withinOwners(el, (view) => {
        let e = new CustomEvent("phx:exec", { detail: { sourceElement: el } });
        js_default.exec(e, "hook", phxEvent, view, el, ["push", { data, callback }]);
      });
    }
    unload() {
      if (this.unloaded) {
        return;
      }
      if (this.main && this.isConnected()) {
        this.log(this.main, "socket", () => ["disconnect for page nav"]);
      }
      this.unloaded = true;
      this.destroyAllViews();
      this.disconnect();
    }
    triggerDOM(kind, args) {
      this.domCallbacks[kind](...args);
    }
    time(name, func) {
      if (!this.isProfileEnabled() || !console.time) {
        return func();
      }
      console.time(name);
      let result = func();
      console.timeEnd(name);
      return result;
    }
    log(view, kind, msgCallback) {
      if (this.viewLogger) {
        let [msg, obj] = msgCallback();
        this.viewLogger(view, kind, msg, obj);
      } else if (this.isDebugEnabled()) {
        let [msg, obj] = msgCallback();
        debug(view, kind, msg, obj);
      }
    }
    requestDOMUpdate(callback) {
      this.transitions.after(callback);
    }
    transition(time, onStart, onDone = function() {
    }) {
      this.transitions.addTransition(time, onStart, onDone);
    }
    onChannel(channel, event, cb) {
      channel.on(event, (data) => {
        let latency = this.getLatencySim();
        if (!latency) {
          cb(data);
        } else {
          setTimeout(() => cb(data), latency);
        }
      });
    }
    reloadWithJitter(view, log) {
      clearTimeout(this.reloadWithJitterTimer);
      this.disconnect();
      let minMs = this.reloadJitterMin;
      let maxMs = this.reloadJitterMax;
      let afterMs = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
      let tries = browser_default.updateLocal(this.localStorage, window.location.pathname, CONSECUTIVE_RELOADS, 0, (count) => count + 1);
      if (tries >= this.maxReloads) {
        afterMs = this.failsafeJitter;
      }
      this.reloadWithJitterTimer = setTimeout(() => {
        if (view.isDestroyed() || view.isConnected()) {
          return;
        }
        view.destroy();
        log ? log() : this.log(view, "join", () => [`encountered ${tries} consecutive reloads`]);
        if (tries >= this.maxReloads) {
          this.log(view, "join", () => [`exceeded ${this.maxReloads} consecutive reloads. Entering failsafe mode`]);
        }
        if (this.hasPendingLink()) {
          window.location = this.pendingLink;
        } else {
          window.location.reload();
        }
      }, afterMs);
    }
    getHookCallbacks(name) {
      return name && name.startsWith("Phoenix.") ? hooks_default[name.split(".")[1]] : this.hooks[name];
    }
    isUnloaded() {
      return this.unloaded;
    }
    isConnected() {
      return this.socket.isConnected();
    }
    getBindingPrefix() {
      return this.bindingPrefix;
    }
    binding(kind) {
      return `${this.getBindingPrefix()}${kind}`;
    }
    channel(topic, params) {
      return this.socket.channel(topic, params);
    }
    joinDeadView() {
      let body = document.body;
      if (body && !this.isPhxView(body) && !this.isPhxView(document.firstElementChild)) {
        let view = this.newRootView(body);
        view.setHref(this.getHref());
        view.joinDead();
        if (!this.main) {
          this.main = view;
        }
        window.requestAnimationFrame(() => {
          var _a;
          view.execNewMounted();
          this.maybeScroll((_a = history.state) == null ? void 0 : _a.scroll);
        });
      }
    }
    joinRootViews() {
      let rootsFound = false;
      dom_default.all(document, `${PHX_VIEW_SELECTOR}:not([${PHX_PARENT_ID}])`, (rootEl) => {
        if (!this.getRootById(rootEl.id)) {
          let view = this.newRootView(rootEl);
          if (!dom_default.isPhxSticky(rootEl)) {
            view.setHref(this.getHref());
          }
          view.join();
          if (rootEl.hasAttribute(PHX_MAIN)) {
            this.main = view;
          }
        }
        rootsFound = true;
      });
      return rootsFound;
    }
    redirect(to, flash, reloadToken) {
      if (reloadToken) {
        browser_default.setCookie(PHX_RELOAD_STATUS, reloadToken, 60);
      }
      this.unload();
      browser_default.redirect(to, flash);
    }
    replaceMain(href, flash, callback = null, linkRef = this.setPendingLink(href)) {
      const liveReferer = this.currentLocation.href;
      this.outgoingMainEl = this.outgoingMainEl || this.main.el;
      const stickies = dom_default.findPhxSticky(document) || [];
      const removeEls = dom_default.all(this.outgoingMainEl, `[${this.binding("remove")}]`).filter((el) => !dom_default.isChildOfAny(el, stickies));
      const newMainEl = dom_default.cloneNode(this.outgoingMainEl, "");
      this.main.showLoader(this.loaderTimeout);
      this.main.destroy();
      this.main = this.newRootView(newMainEl, flash, liveReferer);
      this.main.setRedirect(href);
      this.transitionRemoves(removeEls);
      this.main.join((joinCount, onDone) => {
        if (joinCount === 1 && this.commitPendingLink(linkRef)) {
          this.requestDOMUpdate(() => {
            removeEls.forEach((el) => el.remove());
            stickies.forEach((el) => newMainEl.appendChild(el));
            this.outgoingMainEl.replaceWith(newMainEl);
            this.outgoingMainEl = null;
            callback && callback(linkRef);
            onDone();
          });
        }
      });
    }
    transitionRemoves(elements, callback) {
      let removeAttr = this.binding("remove");
      let silenceEvents = (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
      };
      elements.forEach((el) => {
        for (let event of this.boundEventNames) {
          el.addEventListener(event, silenceEvents, true);
        }
        this.execJS(el, el.getAttribute(removeAttr), "remove");
      });
      this.requestDOMUpdate(() => {
        elements.forEach((el) => {
          for (let event of this.boundEventNames) {
            el.removeEventListener(event, silenceEvents, true);
          }
        });
        callback && callback();
      });
    }
    isPhxView(el) {
      return el.getAttribute && el.getAttribute(PHX_SESSION) !== null;
    }
    newRootView(el, flash, liveReferer) {
      let view = new View(el, this, null, flash, liveReferer);
      this.roots[view.id] = view;
      return view;
    }
    owner(childEl, callback) {
      let view = maybe(childEl.closest(PHX_VIEW_SELECTOR), (el) => this.getViewByEl(el)) || this.main;
      return view && callback ? callback(view) : view;
    }
    withinOwners(childEl, callback) {
      this.owner(childEl, (view) => callback(view, childEl));
    }
    getViewByEl(el) {
      let rootId = el.getAttribute(PHX_ROOT_ID);
      return maybe(this.getRootById(rootId), (root) => root.getDescendentByEl(el));
    }
    getRootById(id) {
      return this.roots[id];
    }
    destroyAllViews() {
      for (let id in this.roots) {
        this.roots[id].destroy();
        delete this.roots[id];
      }
      this.main = null;
    }
    destroyViewByEl(el) {
      let root = this.getRootById(el.getAttribute(PHX_ROOT_ID));
      if (root && root.id === el.id) {
        root.destroy();
        delete this.roots[root.id];
      } else if (root) {
        root.destroyDescendent(el.id);
      }
    }
    getActiveElement() {
      return document.activeElement;
    }
    dropActiveElement(view) {
      if (this.prevActive && view.ownsElement(this.prevActive)) {
        this.prevActive = null;
      }
    }
    restorePreviouslyActiveFocus() {
      if (this.prevActive && this.prevActive !== document.body) {
        this.prevActive.focus();
      }
    }
    blurActiveElement() {
      this.prevActive = this.getActiveElement();
      if (this.prevActive !== document.body) {
        this.prevActive.blur();
      }
    }
    bindTopLevelEvents({ dead } = {}) {
      if (this.boundTopLevelEvents) {
        return;
      }
      this.boundTopLevelEvents = true;
      this.serverCloseRef = this.socket.onClose((event) => {
        if (event && event.code === 1e3 && this.main) {
          return this.reloadWithJitter(this.main);
        }
      });
      document.body.addEventListener("click", function() {
      });
      window.addEventListener("pageshow", (e) => {
        if (e.persisted) {
          this.getSocket().disconnect();
          this.withPageLoading({ to: window.location.href, kind: "redirect" });
          window.location.reload();
        }
      }, true);
      if (!dead) {
        this.bindNav();
      }
      this.bindClicks();
      if (!dead) {
        this.bindForms();
      }
      this.bind({ keyup: "keyup", keydown: "keydown" }, (e, type, view, targetEl, phxEvent, _phxTarget) => {
        let matchKey = targetEl.getAttribute(this.binding(PHX_KEY));
        let pressedKey = e.key && e.key.toLowerCase();
        if (matchKey && matchKey.toLowerCase() !== pressedKey) {
          return;
        }
        let data = __spreadValues({ key: e.key }, this.eventMeta(type, e, targetEl));
        js_default.exec(e, type, phxEvent, view, targetEl, ["push", { data }]);
      });
      this.bind({ blur: "focusout", focus: "focusin" }, (e, type, view, targetEl, phxEvent, phxTarget) => {
        if (!phxTarget) {
          let data = __spreadValues({ key: e.key }, this.eventMeta(type, e, targetEl));
          js_default.exec(e, type, phxEvent, view, targetEl, ["push", { data }]);
        }
      });
      this.bind({ blur: "blur", focus: "focus" }, (e, type, view, targetEl, phxEvent, phxTarget) => {
        if (phxTarget === "window") {
          let data = this.eventMeta(type, e, targetEl);
          js_default.exec(e, type, phxEvent, view, targetEl, ["push", { data }]);
        }
      });
      this.on("dragover", (e) => e.preventDefault());
      this.on("drop", (e) => {
        e.preventDefault();
        let dropTargetId = maybe(closestPhxBinding(e.target, this.binding(PHX_DROP_TARGET)), (trueTarget) => {
          return trueTarget.getAttribute(this.binding(PHX_DROP_TARGET));
        });
        let dropTarget = dropTargetId && document.getElementById(dropTargetId);
        let files = Array.from(e.dataTransfer.files || []);
        if (!dropTarget || dropTarget.disabled || files.length === 0 || !(dropTarget.files instanceof FileList)) {
          return;
        }
        LiveUploader.trackFiles(dropTarget, files, e.dataTransfer);
        dropTarget.dispatchEvent(new Event("input", { bubbles: true }));
      });
      this.on(PHX_TRACK_UPLOADS, (e) => {
        let uploadTarget = e.target;
        if (!dom_default.isUploadInput(uploadTarget)) {
          return;
        }
        let files = Array.from(e.detail.files || []).filter((f) => f instanceof File || f instanceof Blob);
        LiveUploader.trackFiles(uploadTarget, files);
        uploadTarget.dispatchEvent(new Event("input", { bubbles: true }));
      });
    }
    eventMeta(eventName, e, targetEl) {
      let callback = this.metadataCallbacks[eventName];
      return callback ? callback(e, targetEl) : {};
    }
    setPendingLink(href) {
      this.linkRef++;
      this.pendingLink = href;
      this.resetReloadStatus();
      return this.linkRef;
    }
    // anytime we are navigating or connecting, drop reload cookie in case
    // we issue the cookie but the next request was interrupted and the server never dropped it
    resetReloadStatus() {
      browser_default.deleteCookie(PHX_RELOAD_STATUS);
    }
    commitPendingLink(linkRef) {
      if (this.linkRef !== linkRef) {
        return false;
      } else {
        this.href = this.pendingLink;
        this.pendingLink = null;
        return true;
      }
    }
    getHref() {
      return this.href;
    }
    hasPendingLink() {
      return !!this.pendingLink;
    }
    bind(events, callback) {
      for (let event in events) {
        let browserEventName = events[event];
        this.on(browserEventName, (e) => {
          let binding = this.binding(event);
          let windowBinding = this.binding(`window-${event}`);
          let targetPhxEvent = e.target.getAttribute && e.target.getAttribute(binding);
          if (targetPhxEvent) {
            this.debounce(e.target, e, browserEventName, () => {
              this.withinOwners(e.target, (view) => {
                callback(e, event, view, e.target, targetPhxEvent, null);
              });
            });
          } else {
            dom_default.all(document, `[${windowBinding}]`, (el) => {
              let phxEvent = el.getAttribute(windowBinding);
              this.debounce(el, e, browserEventName, () => {
                this.withinOwners(el, (view) => {
                  callback(e, event, view, el, phxEvent, "window");
                });
              });
            });
          }
        });
      }
    }
    bindClicks() {
      this.on("mousedown", (e) => this.clickStartedAtTarget = e.target);
      this.bindClick("click", "click");
    }
    bindClick(eventName, bindingName) {
      let click = this.binding(bindingName);
      window.addEventListener(eventName, (e) => {
        let target = null;
        if (e.detail === 0)
          this.clickStartedAtTarget = e.target;
        let clickStartedAtTarget = this.clickStartedAtTarget || e.target;
        target = closestPhxBinding(e.target, click);
        this.dispatchClickAway(e, clickStartedAtTarget);
        this.clickStartedAtTarget = null;
        let phxEvent = target && target.getAttribute(click);
        if (!phxEvent) {
          if (dom_default.isNewPageClick(e, window.location)) {
            this.unload();
          }
          return;
        }
        if (target.getAttribute("href") === "#") {
          e.preventDefault();
        }
        if (target.hasAttribute(PHX_REF_SRC)) {
          return;
        }
        this.debounce(target, e, "click", () => {
          this.withinOwners(target, (view) => {
            js_default.exec(e, "click", phxEvent, view, target, ["push", { data: this.eventMeta("click", e, target) }]);
          });
        });
      }, false);
    }
    dispatchClickAway(e, clickStartedAt) {
      let phxClickAway = this.binding("click-away");
      dom_default.all(document, `[${phxClickAway}]`, (el) => {
        if (!(el.isSameNode(clickStartedAt) || el.contains(clickStartedAt))) {
          this.withinOwners(el, (view) => {
            let phxEvent = el.getAttribute(phxClickAway);
            if (js_default.isVisible(el) && js_default.isInViewport(el)) {
              js_default.exec(e, "click", phxEvent, view, el, ["push", { data: this.eventMeta("click", e, e.target) }]);
            }
          });
        }
      });
    }
    bindNav() {
      if (!browser_default.canPushState()) {
        return;
      }
      if (history.scrollRestoration) {
        history.scrollRestoration = "manual";
      }
      let scrollTimer = null;
      window.addEventListener("scroll", (_e) => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
          browser_default.updateCurrentState((state) => Object.assign(state, { scroll: window.scrollY }));
        }, 100);
      });
      window.addEventListener("popstate", (event) => {
        if (!this.registerNewLocation(window.location)) {
          return;
        }
        let { type, backType, id, scroll, position } = event.state || {};
        let href = window.location.href;
        let isForward = position > this.currentHistoryPosition;
        type = isForward ? type : backType || type;
        this.currentHistoryPosition = position || 0;
        this.sessionStorage.setItem(PHX_LV_HISTORY_POSITION, this.currentHistoryPosition.toString());
        dom_default.dispatchEvent(window, "phx:navigate", { detail: { href, patch: type === "patch", pop: true, direction: isForward ? "forward" : "backward" } });
        this.requestDOMUpdate(() => {
          const callback = () => {
            this.maybeScroll(scroll);
          };
          if (this.main.isConnected() && (type === "patch" && id === this.main.id)) {
            this.main.pushLinkPatch(event, href, null, callback);
          } else {
            this.replaceMain(href, null, callback);
          }
        });
      }, false);
      window.addEventListener("click", (e) => {
        let target = closestPhxBinding(e.target, PHX_LIVE_LINK);
        let type = target && target.getAttribute(PHX_LIVE_LINK);
        if (!type || !this.isConnected() || !this.main || dom_default.wantsNewTab(e)) {
          return;
        }
        let href = target.href instanceof SVGAnimatedString ? target.href.baseVal : target.href;
        let linkState = target.getAttribute(PHX_LINK_STATE);
        e.preventDefault();
        e.stopImmediatePropagation();
        if (this.pendingLink === href) {
          return;
        }
        this.requestDOMUpdate(() => {
          if (type === "patch") {
            this.pushHistoryPatch(e, href, linkState, target);
          } else if (type === "redirect") {
            this.historyRedirect(e, href, linkState, null, target);
          } else {
            throw new Error(`expected ${PHX_LIVE_LINK} to be "patch" or "redirect", got: ${type}`);
          }
          let phxClick = target.getAttribute(this.binding("click"));
          if (phxClick) {
            this.requestDOMUpdate(() => this.execJS(target, phxClick, "click"));
          }
        });
      }, false);
    }
    maybeScroll(scroll) {
      if (typeof scroll === "number") {
        requestAnimationFrame(() => {
          window.scrollTo(0, scroll);
        });
      }
    }
    dispatchEvent(event, payload = {}) {
      dom_default.dispatchEvent(window, `phx:${event}`, { detail: payload });
    }
    dispatchEvents(events) {
      events.forEach(([event, payload]) => this.dispatchEvent(event, payload));
    }
    withPageLoading(info, callback) {
      dom_default.dispatchEvent(window, "phx:page-loading-start", { detail: info });
      let done = () => dom_default.dispatchEvent(window, "phx:page-loading-stop", { detail: info });
      return callback ? callback(done) : done;
    }
    pushHistoryPatch(e, href, linkState, targetEl) {
      if (!this.isConnected() || !this.main.isMain()) {
        return browser_default.redirect(href);
      }
      this.withPageLoading({ to: href, kind: "patch" }, (done) => {
        this.main.pushLinkPatch(e, href, targetEl, (linkRef) => {
          this.historyPatch(href, linkState, linkRef);
          done();
        });
      });
    }
    historyPatch(href, linkState, linkRef = this.setPendingLink(href)) {
      if (!this.commitPendingLink(linkRef)) {
        return;
      }
      this.currentHistoryPosition++;
      this.sessionStorage.setItem(PHX_LV_HISTORY_POSITION, this.currentHistoryPosition.toString());
      browser_default.updateCurrentState((state) => __spreadProps(__spreadValues({}, state), { backType: "patch" }));
      browser_default.pushState(linkState, {
        type: "patch",
        id: this.main.id,
        position: this.currentHistoryPosition
      }, href);
      dom_default.dispatchEvent(window, "phx:navigate", { detail: { patch: true, href, pop: false, direction: "forward" } });
      this.registerNewLocation(window.location);
    }
    historyRedirect(e, href, linkState, flash, targetEl) {
      const clickLoading = targetEl && e.isTrusted && e.type !== "popstate";
      if (clickLoading) {
        targetEl.classList.add("phx-click-loading");
      }
      if (!this.isConnected() || !this.main.isMain()) {
        return browser_default.redirect(href, flash);
      }
      if (/^\/$|^\/[^\/]+.*$/.test(href)) {
        let { protocol, host } = window.location;
        href = `${protocol}//${host}${href}`;
      }
      let scroll = window.scrollY;
      this.withPageLoading({ to: href, kind: "redirect" }, (done) => {
        this.replaceMain(href, flash, (linkRef) => {
          if (linkRef === this.linkRef) {
            this.currentHistoryPosition++;
            this.sessionStorage.setItem(PHX_LV_HISTORY_POSITION, this.currentHistoryPosition.toString());
            browser_default.updateCurrentState((state) => __spreadProps(__spreadValues({}, state), { backType: "redirect" }));
            browser_default.pushState(linkState, {
              type: "redirect",
              id: this.main.id,
              scroll,
              position: this.currentHistoryPosition
            }, href);
            dom_default.dispatchEvent(window, "phx:navigate", { detail: { href, patch: false, pop: false, direction: "forward" } });
            this.registerNewLocation(window.location);
          }
          if (clickLoading) {
            targetEl.classList.remove("phx-click-loading");
          }
          done();
        });
      });
    }
    registerNewLocation(newLocation) {
      let { pathname, search } = this.currentLocation;
      if (pathname + search === newLocation.pathname + newLocation.search) {
        return false;
      } else {
        this.currentLocation = clone(newLocation);
        return true;
      }
    }
    bindForms() {
      let iterations = 0;
      let externalFormSubmitted = false;
      this.on("submit", (e) => {
        let phxSubmit = e.target.getAttribute(this.binding("submit"));
        let phxChange = e.target.getAttribute(this.binding("change"));
        if (!externalFormSubmitted && phxChange && !phxSubmit) {
          externalFormSubmitted = true;
          e.preventDefault();
          this.withinOwners(e.target, (view) => {
            view.disableForm(e.target);
            window.requestAnimationFrame(() => {
              if (dom_default.isUnloadableFormSubmit(e)) {
                this.unload();
              }
              e.target.submit();
            });
          });
        }
      });
      this.on("submit", (e) => {
        let phxEvent = e.target.getAttribute(this.binding("submit"));
        if (!phxEvent) {
          if (dom_default.isUnloadableFormSubmit(e)) {
            this.unload();
          }
          return;
        }
        e.preventDefault();
        e.target.disabled = true;
        this.withinOwners(e.target, (view) => {
          js_default.exec(e, "submit", phxEvent, view, e.target, ["push", { submitter: e.submitter }]);
        });
      });
      for (let type of ["change", "input"]) {
        this.on(type, (e) => {
          if (e instanceof CustomEvent && e.target.form === void 0) {
            if (e.detail && e.detail.dispatcher) {
              throw new Error(`dispatching a custom ${type} event is only supported on input elements inside a form`);
            }
            return;
          }
          let phxChange = this.binding("change");
          let input = e.target;
          if (e.isComposing) {
            const key = `composition-listener-${type}`;
            if (!dom_default.private(input, key)) {
              dom_default.putPrivate(input, key, true);
              input.addEventListener("compositionend", () => {
                input.dispatchEvent(new Event(type, { bubbles: true }));
                dom_default.deletePrivate(input, key);
              }, { once: true });
            }
            return;
          }
          let inputEvent = input.getAttribute(phxChange);
          let formEvent = input.form && input.form.getAttribute(phxChange);
          let phxEvent = inputEvent || formEvent;
          if (!phxEvent) {
            return;
          }
          if (input.type === "number" && input.validity && input.validity.badInput) {
            return;
          }
          let dispatcher = inputEvent ? input : input.form;
          let currentIterations = iterations;
          iterations++;
          let { at, type: lastType } = dom_default.private(input, "prev-iteration") || {};
          if (at === currentIterations - 1 && type === "change" && lastType === "input") {
            return;
          }
          dom_default.putPrivate(input, "prev-iteration", { at: currentIterations, type });
          this.debounce(input, e, type, () => {
            this.withinOwners(dispatcher, (view) => {
              dom_default.putPrivate(input, PHX_HAS_FOCUSED, true);
              js_default.exec(e, "change", phxEvent, view, input, ["push", { _target: e.target.name, dispatcher }]);
            });
          });
        });
      }
      this.on("reset", (e) => {
        let form = e.target;
        dom_default.resetForm(form);
        let input = Array.from(form.elements).find((el) => el.type === "reset");
        if (input) {
          window.requestAnimationFrame(() => {
            input.dispatchEvent(new Event("input", { bubbles: true, cancelable: false }));
          });
        }
      });
    }
    debounce(el, event, eventType, callback) {
      if (eventType === "blur" || eventType === "focusout") {
        return callback();
      }
      let phxDebounce = this.binding(PHX_DEBOUNCE);
      let phxThrottle = this.binding(PHX_THROTTLE);
      let defaultDebounce = this.defaults.debounce.toString();
      let defaultThrottle = this.defaults.throttle.toString();
      this.withinOwners(el, (view) => {
        let asyncFilter = () => !view.isDestroyed() && document.body.contains(el);
        dom_default.debounce(el, event, phxDebounce, defaultDebounce, phxThrottle, defaultThrottle, asyncFilter, () => {
          callback();
        });
      });
    }
    silenceEvents(callback) {
      this.silenced = true;
      callback();
      this.silenced = false;
    }
    on(event, callback) {
      this.boundEventNames.add(event);
      window.addEventListener(event, (e) => {
        if (!this.silenced) {
          callback(e);
        }
      });
    }
    jsQuerySelectorAll(sourceEl, query, defaultQuery) {
      let all = this.domCallbacks.jsQuerySelectorAll;
      return all ? all(sourceEl, query, defaultQuery) : defaultQuery();
    }
  };
  var TransitionSet = class {
    constructor() {
      this.transitions = /* @__PURE__ */ new Set();
      this.pendingOps = [];
    }
    reset() {
      this.transitions.forEach((timer) => {
        clearTimeout(timer);
        this.transitions.delete(timer);
      });
      this.flushPendingOps();
    }
    after(callback) {
      if (this.size() === 0) {
        callback();
      } else {
        this.pushPendingOp(callback);
      }
    }
    addTransition(time, onStart, onDone) {
      onStart();
      let timer = setTimeout(() => {
        this.transitions.delete(timer);
        onDone();
        this.flushPendingOps();
      }, time);
      this.transitions.add(timer);
    }
    pushPendingOp(op) {
      this.pendingOps.push(op);
    }
    size() {
      return this.transitions.size;
    }
    flushPendingOps() {
      if (this.size() > 0) {
        return;
      }
      let op = this.pendingOps.shift();
      if (op) {
        op();
        this.flushPendingOps();
      }
    }
  };

  // js/app.js
  var import_topbar = __toESM(require_topbar());
  var csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content");
  var liveSocket = new LiveSocket("/live", Socket, {
    longPollFallbackMs: 2500,
    params: { _csrf_token: csrfToken }
  });
  import_topbar.default.config({ barColors: { 0: "#29d" }, shadowColor: "rgba(0, 0, 0, .3)" });
  window.addEventListener("phx:page-loading-start", (_info) => import_topbar.default.show(300));
  window.addEventListener("phx:page-loading-stop", (_info) => import_topbar.default.hide());
  liveSocket.connect();
  window.liveSocket = liveSocket;
})();
/**
 * @license MIT
 * topbar 2.0.0, 2023-02-04
 * https://buunguyen.github.io/topbar
 * Copyright (c) 2021 Buu Nguyen
 */
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vYXNzZXRzL3ZlbmRvci90b3BiYXIuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2h0bWwvcHJpdi9zdGF0aWMvcGhvZW5peF9odG1sLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peC9hc3NldHMvanMvcGhvZW5peC91dGlscy5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXgvYXNzZXRzL2pzL3Bob2VuaXgvY29uc3RhbnRzLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peC9hc3NldHMvanMvcGhvZW5peC9wdXNoLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peC9hc3NldHMvanMvcGhvZW5peC90aW1lci5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXgvYXNzZXRzL2pzL3Bob2VuaXgvY2hhbm5lbC5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXgvYXNzZXRzL2pzL3Bob2VuaXgvYWpheC5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXgvYXNzZXRzL2pzL3Bob2VuaXgvbG9uZ3BvbGwuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4L2Fzc2V0cy9qcy9waG9lbml4L3ByZXNlbmNlLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peC9hc3NldHMvanMvcGhvZW5peC9zZXJpYWxpemVyLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peC9hc3NldHMvanMvcGhvZW5peC9zb2NrZXQuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvY29uc3RhbnRzLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L2VudHJ5X3VwbG9hZGVyLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L3V0aWxzLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L2Jyb3dzZXIuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvZG9tLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L3VwbG9hZF9lbnRyeS5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXhfbGl2ZV92aWV3L2Fzc2V0cy9qcy9waG9lbml4X2xpdmVfdmlldy9saXZlX3VwbG9hZGVyLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L2FyaWEuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvaG9va3MuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvZWxlbWVudF9yZWYuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvZG9tX3Bvc3RfbW9ycGhfcmVzdG9yZXIuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9ub2RlX21vZHVsZXMvbW9ycGhkb20vZGlzdC9tb3JwaGRvbS1lc20uanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvZG9tX3BhdGNoLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L3JlbmRlcmVkLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L2pzLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L3ZpZXdfaG9vay5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXhfbGl2ZV92aWV3L2Fzc2V0cy9qcy9waG9lbml4X2xpdmVfdmlldy92aWV3LmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L2xpdmVfc29ja2V0LmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L2luZGV4LmpzIiwgIi4uLy4uLy4uL2Fzc2V0cy9qcy9hcHAuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8qKlxuICogQGxpY2Vuc2UgTUlUXG4gKiB0b3BiYXIgMi4wLjAsIDIwMjMtMDItMDRcbiAqIGh0dHBzOi8vYnV1bmd1eWVuLmdpdGh1Yi5pby90b3BiYXJcbiAqIENvcHlyaWdodCAoYykgMjAyMSBCdXUgTmd1eWVuXG4gKi9cbihmdW5jdGlvbiAod2luZG93LCBkb2N1bWVudCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICAvLyBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9wYXVsaXJpc2gvMTU3OTY3MVxuICAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBsYXN0VGltZSA9IDA7XG4gICAgdmFyIHZlbmRvcnMgPSBbXCJtc1wiLCBcIm1velwiLCBcIndlYmtpdFwiLCBcIm9cIl07XG4gICAgZm9yICh2YXIgeCA9IDA7IHggPCB2ZW5kb3JzLmxlbmd0aCAmJiAhd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZTsgKyt4KSB7XG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID1cbiAgICAgICAgd2luZG93W3ZlbmRvcnNbeF0gKyBcIlJlcXVlc3RBbmltYXRpb25GcmFtZVwiXTtcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9XG4gICAgICAgIHdpbmRvd1t2ZW5kb3JzW3hdICsgXCJDYW5jZWxBbmltYXRpb25GcmFtZVwiXSB8fFxuICAgICAgICB3aW5kb3dbdmVuZG9yc1t4XSArIFwiQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lXCJdO1xuICAgIH1cbiAgICBpZiAoIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpXG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24gKGNhbGxiYWNrLCBlbGVtZW50KSB7XG4gICAgICAgIHZhciBjdXJyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICB2YXIgdGltZVRvQ2FsbCA9IE1hdGgubWF4KDAsIDE2IC0gKGN1cnJUaW1lIC0gbGFzdFRpbWUpKTtcbiAgICAgICAgdmFyIGlkID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNhbGxiYWNrKGN1cnJUaW1lICsgdGltZVRvQ2FsbCk7XG4gICAgICAgIH0sIHRpbWVUb0NhbGwpO1xuICAgICAgICBsYXN0VGltZSA9IGN1cnJUaW1lICsgdGltZVRvQ2FsbDtcbiAgICAgICAgcmV0dXJuIGlkO1xuICAgICAgfTtcbiAgICBpZiAoIXdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSlcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICBjbGVhclRpbWVvdXQoaWQpO1xuICAgICAgfTtcbiAgfSkoKTtcblxuICB2YXIgY2FudmFzLFxuICAgIGN1cnJlbnRQcm9ncmVzcyxcbiAgICBzaG93aW5nLFxuICAgIHByb2dyZXNzVGltZXJJZCA9IG51bGwsXG4gICAgZmFkZVRpbWVySWQgPSBudWxsLFxuICAgIGRlbGF5VGltZXJJZCA9IG51bGwsXG4gICAgYWRkRXZlbnQgPSBmdW5jdGlvbiAoZWxlbSwgdHlwZSwgaGFuZGxlcikge1xuICAgICAgaWYgKGVsZW0uYWRkRXZlbnRMaXN0ZW5lcikgZWxlbS5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGhhbmRsZXIsIGZhbHNlKTtcbiAgICAgIGVsc2UgaWYgKGVsZW0uYXR0YWNoRXZlbnQpIGVsZW0uYXR0YWNoRXZlbnQoXCJvblwiICsgdHlwZSwgaGFuZGxlcik7XG4gICAgICBlbHNlIGVsZW1bXCJvblwiICsgdHlwZV0gPSBoYW5kbGVyO1xuICAgIH0sXG4gICAgb3B0aW9ucyA9IHtcbiAgICAgIGF1dG9SdW46IHRydWUsXG4gICAgICBiYXJUaGlja25lc3M6IDMsXG4gICAgICBiYXJDb2xvcnM6IHtcbiAgICAgICAgMDogXCJyZ2JhKDI2LCAgMTg4LCAxNTYsIC45KVwiLFxuICAgICAgICBcIi4yNVwiOiBcInJnYmEoNTIsICAxNTIsIDIxOSwgLjkpXCIsXG4gICAgICAgIFwiLjUwXCI6IFwicmdiYSgyNDEsIDE5NiwgMTUsICAuOSlcIixcbiAgICAgICAgXCIuNzVcIjogXCJyZ2JhKDIzMCwgMTI2LCAzNCwgIC45KVwiLFxuICAgICAgICBcIjEuMFwiOiBcInJnYmEoMjExLCA4NCwgIDAsICAgLjkpXCIsXG4gICAgICB9LFxuICAgICAgc2hhZG93Qmx1cjogMTAsXG4gICAgICBzaGFkb3dDb2xvcjogXCJyZ2JhKDAsICAgMCwgICAwLCAgIC42KVwiLFxuICAgICAgY2xhc3NOYW1lOiBudWxsLFxuICAgIH0sXG4gICAgcmVwYWludCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGNhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgY2FudmFzLmhlaWdodCA9IG9wdGlvbnMuYmFyVGhpY2tuZXNzICogNTsgLy8gbmVlZCBzcGFjZSBmb3Igc2hhZG93XG5cbiAgICAgIHZhciBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgY3R4LnNoYWRvd0JsdXIgPSBvcHRpb25zLnNoYWRvd0JsdXI7XG4gICAgICBjdHguc2hhZG93Q29sb3IgPSBvcHRpb25zLnNoYWRvd0NvbG9yO1xuXG4gICAgICB2YXIgbGluZUdyYWRpZW50ID0gY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIGNhbnZhcy53aWR0aCwgMCk7XG4gICAgICBmb3IgKHZhciBzdG9wIGluIG9wdGlvbnMuYmFyQ29sb3JzKVxuICAgICAgICBsaW5lR3JhZGllbnQuYWRkQ29sb3JTdG9wKHN0b3AsIG9wdGlvbnMuYmFyQ29sb3JzW3N0b3BdKTtcbiAgICAgIGN0eC5saW5lV2lkdGggPSBvcHRpb25zLmJhclRoaWNrbmVzcztcbiAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgIGN0eC5tb3ZlVG8oMCwgb3B0aW9ucy5iYXJUaGlja25lc3MgLyAyKTtcbiAgICAgIGN0eC5saW5lVG8oXG4gICAgICAgIE1hdGguY2VpbChjdXJyZW50UHJvZ3Jlc3MgKiBjYW52YXMud2lkdGgpLFxuICAgICAgICBvcHRpb25zLmJhclRoaWNrbmVzcyAvIDJcbiAgICAgICk7XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSBsaW5lR3JhZGllbnQ7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfSxcbiAgICBjcmVhdGVDYW52YXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgICAgdmFyIHN0eWxlID0gY2FudmFzLnN0eWxlO1xuICAgICAgc3R5bGUucG9zaXRpb24gPSBcImZpeGVkXCI7XG4gICAgICBzdHlsZS50b3AgPSBzdHlsZS5sZWZ0ID0gc3R5bGUucmlnaHQgPSBzdHlsZS5tYXJnaW4gPSBzdHlsZS5wYWRkaW5nID0gMDtcbiAgICAgIHN0eWxlLnpJbmRleCA9IDEwMDAwMTtcbiAgICAgIHN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgIGlmIChvcHRpb25zLmNsYXNzTmFtZSkgY2FudmFzLmNsYXNzTGlzdC5hZGQob3B0aW9ucy5jbGFzc05hbWUpO1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjYW52YXMpO1xuICAgICAgYWRkRXZlbnQod2luZG93LCBcInJlc2l6ZVwiLCByZXBhaW50KTtcbiAgICB9LFxuICAgIHRvcGJhciA9IHtcbiAgICAgIGNvbmZpZzogZnVuY3Rpb24gKG9wdHMpIHtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIG9wdHMpXG4gICAgICAgICAgaWYgKG9wdGlvbnMuaGFzT3duUHJvcGVydHkoa2V5KSkgb3B0aW9uc1trZXldID0gb3B0c1trZXldO1xuICAgICAgfSxcbiAgICAgIHNob3c6IGZ1bmN0aW9uIChkZWxheSkge1xuICAgICAgICBpZiAoc2hvd2luZykgcmV0dXJuO1xuICAgICAgICBpZiAoZGVsYXkpIHtcbiAgICAgICAgICBpZiAoZGVsYXlUaW1lcklkKSByZXR1cm47XG4gICAgICAgICAgZGVsYXlUaW1lcklkID0gc2V0VGltZW91dCgoKSA9PiB0b3BiYXIuc2hvdygpLCBkZWxheSk7XG4gICAgICAgIH0gZWxzZSAge1xuICAgICAgICAgIHNob3dpbmcgPSB0cnVlO1xuICAgICAgICAgIGlmIChmYWRlVGltZXJJZCAhPT0gbnVsbCkgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKGZhZGVUaW1lcklkKTtcbiAgICAgICAgICBpZiAoIWNhbnZhcykgY3JlYXRlQ2FudmFzKCk7XG4gICAgICAgICAgY2FudmFzLnN0eWxlLm9wYWNpdHkgPSAxO1xuICAgICAgICAgIGNhbnZhcy5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICAgIHRvcGJhci5wcm9ncmVzcygwKTtcbiAgICAgICAgICBpZiAob3B0aW9ucy5hdXRvUnVuKSB7XG4gICAgICAgICAgICAoZnVuY3Rpb24gbG9vcCgpIHtcbiAgICAgICAgICAgICAgcHJvZ3Jlc3NUaW1lcklkID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wKTtcbiAgICAgICAgICAgICAgdG9wYmFyLnByb2dyZXNzKFxuICAgICAgICAgICAgICAgIFwiK1wiICsgMC4wNSAqIE1hdGgucG93KDEgLSBNYXRoLnNxcnQoY3VycmVudFByb2dyZXNzKSwgMilcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgcHJvZ3Jlc3M6IGZ1bmN0aW9uICh0bykge1xuICAgICAgICBpZiAodHlwZW9mIHRvID09PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gY3VycmVudFByb2dyZXNzO1xuICAgICAgICBpZiAodHlwZW9mIHRvID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgdG8gPVxuICAgICAgICAgICAgKHRvLmluZGV4T2YoXCIrXCIpID49IDAgfHwgdG8uaW5kZXhPZihcIi1cIikgPj0gMFxuICAgICAgICAgICAgICA/IGN1cnJlbnRQcm9ncmVzc1xuICAgICAgICAgICAgICA6IDApICsgcGFyc2VGbG9hdCh0byk7XG4gICAgICAgIH1cbiAgICAgICAgY3VycmVudFByb2dyZXNzID0gdG8gPiAxID8gMSA6IHRvO1xuICAgICAgICByZXBhaW50KCk7XG4gICAgICAgIHJldHVybiBjdXJyZW50UHJvZ3Jlc3M7XG4gICAgICB9LFxuICAgICAgaGlkZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBjbGVhclRpbWVvdXQoZGVsYXlUaW1lcklkKTtcbiAgICAgICAgZGVsYXlUaW1lcklkID0gbnVsbDtcbiAgICAgICAgaWYgKCFzaG93aW5nKSByZXR1cm47XG4gICAgICAgIHNob3dpbmcgPSBmYWxzZTtcbiAgICAgICAgaWYgKHByb2dyZXNzVGltZXJJZCAhPSBudWxsKSB7XG4gICAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKHByb2dyZXNzVGltZXJJZCk7XG4gICAgICAgICAgcHJvZ3Jlc3NUaW1lcklkID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICAoZnVuY3Rpb24gbG9vcCgpIHtcbiAgICAgICAgICBpZiAodG9wYmFyLnByb2dyZXNzKFwiKy4xXCIpID49IDEpIHtcbiAgICAgICAgICAgIGNhbnZhcy5zdHlsZS5vcGFjaXR5IC09IDAuMDU7XG4gICAgICAgICAgICBpZiAoY2FudmFzLnN0eWxlLm9wYWNpdHkgPD0gMC4wNSkge1xuICAgICAgICAgICAgICBjYW52YXMuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICAgICAgICBmYWRlVGltZXJJZCA9IG51bGw7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgZmFkZVRpbWVySWQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3ApO1xuICAgICAgICB9KSgpO1xuICAgICAgfSxcbiAgICB9O1xuXG4gIGlmICh0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyA9PT0gXCJvYmplY3RcIikge1xuICAgIG1vZHVsZS5leHBvcnRzID0gdG9wYmFyO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0b3BiYXI7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy50b3BiYXIgPSB0b3BiYXI7XG4gIH1cbn0uY2FsbCh0aGlzLCB3aW5kb3csIGRvY3VtZW50KSk7XG4iLCAiXCJ1c2Ugc3RyaWN0XCI7XG5cbihmdW5jdGlvbigpIHtcbiAgdmFyIFBvbHlmaWxsRXZlbnQgPSBldmVudENvbnN0cnVjdG9yKCk7XG5cbiAgZnVuY3Rpb24gZXZlbnRDb25zdHJ1Y3RvcigpIHtcbiAgICBpZiAodHlwZW9mIHdpbmRvdy5DdXN0b21FdmVudCA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gd2luZG93LkN1c3RvbUV2ZW50O1xuICAgIC8vIElFPD05IFN1cHBvcnRcbiAgICBmdW5jdGlvbiBDdXN0b21FdmVudChldmVudCwgcGFyYW1zKSB7XG4gICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge2J1YmJsZXM6IGZhbHNlLCBjYW5jZWxhYmxlOiBmYWxzZSwgZGV0YWlsOiB1bmRlZmluZWR9O1xuICAgICAgdmFyIGV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdDdXN0b21FdmVudCcpO1xuICAgICAgZXZ0LmluaXRDdXN0b21FdmVudChldmVudCwgcGFyYW1zLmJ1YmJsZXMsIHBhcmFtcy5jYW5jZWxhYmxlLCBwYXJhbXMuZGV0YWlsKTtcbiAgICAgIHJldHVybiBldnQ7XG4gICAgfVxuICAgIEN1c3RvbUV2ZW50LnByb3RvdHlwZSA9IHdpbmRvdy5FdmVudC5wcm90b3R5cGU7XG4gICAgcmV0dXJuIEN1c3RvbUV2ZW50O1xuICB9XG5cbiAgZnVuY3Rpb24gYnVpbGRIaWRkZW5JbnB1dChuYW1lLCB2YWx1ZSkge1xuICAgIHZhciBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcbiAgICBpbnB1dC50eXBlID0gXCJoaWRkZW5cIjtcbiAgICBpbnB1dC5uYW1lID0gbmFtZTtcbiAgICBpbnB1dC52YWx1ZSA9IHZhbHVlO1xuICAgIHJldHVybiBpbnB1dDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZUNsaWNrKGVsZW1lbnQsIHRhcmdldE1vZGlmaWVyS2V5KSB7XG4gICAgdmFyIHRvID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRvXCIpLFxuICAgICAgICBtZXRob2QgPSBidWlsZEhpZGRlbklucHV0KFwiX21ldGhvZFwiLCBlbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtbWV0aG9kXCIpKSxcbiAgICAgICAgY3NyZiA9IGJ1aWxkSGlkZGVuSW5wdXQoXCJfY3NyZl90b2tlblwiLCBlbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtY3NyZlwiKSksXG4gICAgICAgIGZvcm0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZm9ybVwiKSxcbiAgICAgICAgc3VibWl0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpLFxuICAgICAgICB0YXJnZXQgPSBlbGVtZW50LmdldEF0dHJpYnV0ZShcInRhcmdldFwiKTtcblxuICAgIGZvcm0ubWV0aG9kID0gKGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1tZXRob2RcIikgPT09IFwiZ2V0XCIpID8gXCJnZXRcIiA6IFwicG9zdFwiO1xuICAgIGZvcm0uYWN0aW9uID0gdG87XG4gICAgZm9ybS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cbiAgICBpZiAodGFyZ2V0KSBmb3JtLnRhcmdldCA9IHRhcmdldDtcbiAgICBlbHNlIGlmICh0YXJnZXRNb2RpZmllcktleSkgZm9ybS50YXJnZXQgPSBcIl9ibGFua1wiO1xuXG4gICAgZm9ybS5hcHBlbmRDaGlsZChjc3JmKTtcbiAgICBmb3JtLmFwcGVuZENoaWxkKG1ldGhvZCk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChmb3JtKTtcblxuICAgIC8vIEluc2VydCBhIGJ1dHRvbiBhbmQgY2xpY2sgaXQgaW5zdGVhZCBvZiB1c2luZyBgZm9ybS5zdWJtaXRgXG4gICAgLy8gYmVjYXVzZSB0aGUgYHN1Ym1pdGAgZnVuY3Rpb24gZG9lcyBub3QgZW1pdCBhIGBzdWJtaXRgIGV2ZW50LlxuICAgIHN1Ym1pdC50eXBlID0gXCJzdWJtaXRcIjtcbiAgICBmb3JtLmFwcGVuZENoaWxkKHN1Ym1pdCk7XG4gICAgc3VibWl0LmNsaWNrKCk7XG4gIH1cblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgZWxlbWVudCA9IGUudGFyZ2V0O1xuICAgIGlmIChlLmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcblxuICAgIHdoaWxlIChlbGVtZW50ICYmIGVsZW1lbnQuZ2V0QXR0cmlidXRlKSB7XG4gICAgICB2YXIgcGhvZW5peExpbmtFdmVudCA9IG5ldyBQb2x5ZmlsbEV2ZW50KCdwaG9lbml4LmxpbmsuY2xpY2snLCB7XG4gICAgICAgIFwiYnViYmxlc1wiOiB0cnVlLCBcImNhbmNlbGFibGVcIjogdHJ1ZVxuICAgICAgfSk7XG5cbiAgICAgIGlmICghZWxlbWVudC5kaXNwYXRjaEV2ZW50KHBob2VuaXhMaW5rRXZlbnQpKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLW1ldGhvZFwiKSAmJiBlbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtdG9cIikpIHtcbiAgICAgICAgaGFuZGxlQ2xpY2soZWxlbWVudCwgZS5tZXRhS2V5IHx8IGUuc2hpZnRLZXkpO1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGU7XG4gICAgICB9XG4gICAgfVxuICB9LCBmYWxzZSk7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Bob2VuaXgubGluay5jbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIG1lc3NhZ2UgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWNvbmZpcm1cIik7XG4gICAgaWYobWVzc2FnZSAmJiAhd2luZG93LmNvbmZpcm0obWVzc2FnZSkpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gIH0sIGZhbHNlKTtcbn0pKCk7XG4iLCAiLy8gd3JhcHMgdmFsdWUgaW4gY2xvc3VyZSBvciByZXR1cm5zIGNsb3N1cmVcbmV4cG9ydCBsZXQgY2xvc3VyZSA9ICh2YWx1ZSkgPT4ge1xuICBpZih0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIil7XG4gICAgcmV0dXJuIHZhbHVlXG4gIH0gZWxzZSB7XG4gICAgbGV0IGNsb3N1cmUgPSBmdW5jdGlvbiAoKXsgcmV0dXJuIHZhbHVlIH1cbiAgICByZXR1cm4gY2xvc3VyZVxuICB9XG59XG4iLCAiZXhwb3J0IGNvbnN0IGdsb2JhbFNlbGYgPSB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiBudWxsXG5leHBvcnQgY29uc3QgcGh4V2luZG93ID0gdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IG51bGxcbmV4cG9ydCBjb25zdCBnbG9iYWwgPSBnbG9iYWxTZWxmIHx8IHBoeFdpbmRvdyB8fCBnbG9iYWxcbmV4cG9ydCBjb25zdCBERUZBVUxUX1ZTTiA9IFwiMi4wLjBcIlxuZXhwb3J0IGNvbnN0IFNPQ0tFVF9TVEFURVMgPSB7Y29ubmVjdGluZzogMCwgb3BlbjogMSwgY2xvc2luZzogMiwgY2xvc2VkOiAzfVxuZXhwb3J0IGNvbnN0IERFRkFVTFRfVElNRU9VVCA9IDEwMDAwXG5leHBvcnQgY29uc3QgV1NfQ0xPU0VfTk9STUFMID0gMTAwMFxuZXhwb3J0IGNvbnN0IENIQU5ORUxfU1RBVEVTID0ge1xuICBjbG9zZWQ6IFwiY2xvc2VkXCIsXG4gIGVycm9yZWQ6IFwiZXJyb3JlZFwiLFxuICBqb2luZWQ6IFwiam9pbmVkXCIsXG4gIGpvaW5pbmc6IFwiam9pbmluZ1wiLFxuICBsZWF2aW5nOiBcImxlYXZpbmdcIixcbn1cbmV4cG9ydCBjb25zdCBDSEFOTkVMX0VWRU5UUyA9IHtcbiAgY2xvc2U6IFwicGh4X2Nsb3NlXCIsXG4gIGVycm9yOiBcInBoeF9lcnJvclwiLFxuICBqb2luOiBcInBoeF9qb2luXCIsXG4gIHJlcGx5OiBcInBoeF9yZXBseVwiLFxuICBsZWF2ZTogXCJwaHhfbGVhdmVcIlxufVxuXG5leHBvcnQgY29uc3QgVFJBTlNQT1JUUyA9IHtcbiAgbG9uZ3BvbGw6IFwibG9uZ3BvbGxcIixcbiAgd2Vic29ja2V0OiBcIndlYnNvY2tldFwiXG59XG5leHBvcnQgY29uc3QgWEhSX1NUQVRFUyA9IHtcbiAgY29tcGxldGU6IDRcbn1cbiIsICIvKipcbiAqIEluaXRpYWxpemVzIHRoZSBQdXNoXG4gKiBAcGFyYW0ge0NoYW5uZWx9IGNoYW5uZWwgLSBUaGUgQ2hhbm5lbFxuICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50IC0gVGhlIGV2ZW50LCBmb3IgZXhhbXBsZSBgXCJwaHhfam9pblwiYFxuICogQHBhcmFtIHtPYmplY3R9IHBheWxvYWQgLSBUaGUgcGF5bG9hZCwgZm9yIGV4YW1wbGUgYHt1c2VyX2lkOiAxMjN9YFxuICogQHBhcmFtIHtudW1iZXJ9IHRpbWVvdXQgLSBUaGUgcHVzaCB0aW1lb3V0IGluIG1pbGxpc2Vjb25kc1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQdXNoIHtcbiAgY29uc3RydWN0b3IoY2hhbm5lbCwgZXZlbnQsIHBheWxvYWQsIHRpbWVvdXQpe1xuICAgIHRoaXMuY2hhbm5lbCA9IGNoYW5uZWxcbiAgICB0aGlzLmV2ZW50ID0gZXZlbnRcbiAgICB0aGlzLnBheWxvYWQgPSBwYXlsb2FkIHx8IGZ1bmN0aW9uICgpeyByZXR1cm4ge30gfVxuICAgIHRoaXMucmVjZWl2ZWRSZXNwID0gbnVsbFxuICAgIHRoaXMudGltZW91dCA9IHRpbWVvdXRcbiAgICB0aGlzLnRpbWVvdXRUaW1lciA9IG51bGxcbiAgICB0aGlzLnJlY0hvb2tzID0gW11cbiAgICB0aGlzLnNlbnQgPSBmYWxzZVxuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB0aW1lb3V0XG4gICAqL1xuICByZXNlbmQodGltZW91dCl7XG4gICAgdGhpcy50aW1lb3V0ID0gdGltZW91dFxuICAgIHRoaXMucmVzZXQoKVxuICAgIHRoaXMuc2VuZCgpXG4gIH1cblxuICAvKipcbiAgICpcbiAgICovXG4gIHNlbmQoKXtcbiAgICBpZih0aGlzLmhhc1JlY2VpdmVkKFwidGltZW91dFwiKSl7IHJldHVybiB9XG4gICAgdGhpcy5zdGFydFRpbWVvdXQoKVxuICAgIHRoaXMuc2VudCA9IHRydWVcbiAgICB0aGlzLmNoYW5uZWwuc29ja2V0LnB1c2goe1xuICAgICAgdG9waWM6IHRoaXMuY2hhbm5lbC50b3BpYyxcbiAgICAgIGV2ZW50OiB0aGlzLmV2ZW50LFxuICAgICAgcGF5bG9hZDogdGhpcy5wYXlsb2FkKCksXG4gICAgICByZWY6IHRoaXMucmVmLFxuICAgICAgam9pbl9yZWY6IHRoaXMuY2hhbm5lbC5qb2luUmVmKClcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSB7Kn0gc3RhdHVzXG4gICAqIEBwYXJhbSB7Kn0gY2FsbGJhY2tcbiAgICovXG4gIHJlY2VpdmUoc3RhdHVzLCBjYWxsYmFjayl7XG4gICAgaWYodGhpcy5oYXNSZWNlaXZlZChzdGF0dXMpKXtcbiAgICAgIGNhbGxiYWNrKHRoaXMucmVjZWl2ZWRSZXNwLnJlc3BvbnNlKVxuICAgIH1cblxuICAgIHRoaXMucmVjSG9va3MucHVzaCh7c3RhdHVzLCBjYWxsYmFja30pXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVzZXQoKXtcbiAgICB0aGlzLmNhbmNlbFJlZkV2ZW50KClcbiAgICB0aGlzLnJlZiA9IG51bGxcbiAgICB0aGlzLnJlZkV2ZW50ID0gbnVsbFxuICAgIHRoaXMucmVjZWl2ZWRSZXNwID0gbnVsbFxuICAgIHRoaXMuc2VudCA9IGZhbHNlXG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIG1hdGNoUmVjZWl2ZSh7c3RhdHVzLCByZXNwb25zZSwgX3JlZn0pe1xuICAgIHRoaXMucmVjSG9va3MuZmlsdGVyKGggPT4gaC5zdGF0dXMgPT09IHN0YXR1cylcbiAgICAgIC5mb3JFYWNoKGggPT4gaC5jYWxsYmFjayhyZXNwb25zZSkpXG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNhbmNlbFJlZkV2ZW50KCl7XG4gICAgaWYoIXRoaXMucmVmRXZlbnQpeyByZXR1cm4gfVxuICAgIHRoaXMuY2hhbm5lbC5vZmYodGhpcy5yZWZFdmVudClcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY2FuY2VsVGltZW91dCgpe1xuICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXRUaW1lcilcbiAgICB0aGlzLnRpbWVvdXRUaW1lciA9IG51bGxcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc3RhcnRUaW1lb3V0KCl7XG4gICAgaWYodGhpcy50aW1lb3V0VGltZXIpeyB0aGlzLmNhbmNlbFRpbWVvdXQoKSB9XG4gICAgdGhpcy5yZWYgPSB0aGlzLmNoYW5uZWwuc29ja2V0Lm1ha2VSZWYoKVxuICAgIHRoaXMucmVmRXZlbnQgPSB0aGlzLmNoYW5uZWwucmVwbHlFdmVudE5hbWUodGhpcy5yZWYpXG5cbiAgICB0aGlzLmNoYW5uZWwub24odGhpcy5yZWZFdmVudCwgcGF5bG9hZCA9PiB7XG4gICAgICB0aGlzLmNhbmNlbFJlZkV2ZW50KClcbiAgICAgIHRoaXMuY2FuY2VsVGltZW91dCgpXG4gICAgICB0aGlzLnJlY2VpdmVkUmVzcCA9IHBheWxvYWRcbiAgICAgIHRoaXMubWF0Y2hSZWNlaXZlKHBheWxvYWQpXG4gICAgfSlcblxuICAgIHRoaXMudGltZW91dFRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnRyaWdnZXIoXCJ0aW1lb3V0XCIsIHt9KVxuICAgIH0sIHRoaXMudGltZW91dClcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaGFzUmVjZWl2ZWQoc3RhdHVzKXtcbiAgICByZXR1cm4gdGhpcy5yZWNlaXZlZFJlc3AgJiYgdGhpcy5yZWNlaXZlZFJlc3Auc3RhdHVzID09PSBzdGF0dXNcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgdHJpZ2dlcihzdGF0dXMsIHJlc3BvbnNlKXtcbiAgICB0aGlzLmNoYW5uZWwudHJpZ2dlcih0aGlzLnJlZkV2ZW50LCB7c3RhdHVzLCByZXNwb25zZX0pXG4gIH1cbn1cbiIsICIvKipcbiAqXG4gKiBDcmVhdGVzIGEgdGltZXIgdGhhdCBhY2NlcHRzIGEgYHRpbWVyQ2FsY2AgZnVuY3Rpb24gdG8gcGVyZm9ybVxuICogY2FsY3VsYXRlZCB0aW1lb3V0IHJldHJpZXMsIHN1Y2ggYXMgZXhwb25lbnRpYWwgYmFja29mZi5cbiAqXG4gKiBAZXhhbXBsZVxuICogbGV0IHJlY29ubmVjdFRpbWVyID0gbmV3IFRpbWVyKCgpID0+IHRoaXMuY29ubmVjdCgpLCBmdW5jdGlvbih0cmllcyl7XG4gKiAgIHJldHVybiBbMTAwMCwgNTAwMCwgMTAwMDBdW3RyaWVzIC0gMV0gfHwgMTAwMDBcbiAqIH0pXG4gKiByZWNvbm5lY3RUaW1lci5zY2hlZHVsZVRpbWVvdXQoKSAvLyBmaXJlcyBhZnRlciAxMDAwXG4gKiByZWNvbm5lY3RUaW1lci5zY2hlZHVsZVRpbWVvdXQoKSAvLyBmaXJlcyBhZnRlciA1MDAwXG4gKiByZWNvbm5lY3RUaW1lci5yZXNldCgpXG4gKiByZWNvbm5lY3RUaW1lci5zY2hlZHVsZVRpbWVvdXQoKSAvLyBmaXJlcyBhZnRlciAxMDAwXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHRpbWVyQ2FsY1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaW1lciB7XG4gIGNvbnN0cnVjdG9yKGNhbGxiYWNrLCB0aW1lckNhbGMpe1xuICAgIHRoaXMuY2FsbGJhY2sgPSBjYWxsYmFja1xuICAgIHRoaXMudGltZXJDYWxjID0gdGltZXJDYWxjXG4gICAgdGhpcy50aW1lciA9IG51bGxcbiAgICB0aGlzLnRyaWVzID0gMFxuICB9XG5cbiAgcmVzZXQoKXtcbiAgICB0aGlzLnRyaWVzID0gMFxuICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVyKVxuICB9XG5cbiAgLyoqXG4gICAqIENhbmNlbHMgYW55IHByZXZpb3VzIHNjaGVkdWxlVGltZW91dCBhbmQgc2NoZWR1bGVzIGNhbGxiYWNrXG4gICAqL1xuICBzY2hlZHVsZVRpbWVvdXQoKXtcbiAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lcilcblxuICAgIHRoaXMudGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMudHJpZXMgPSB0aGlzLnRyaWVzICsgMVxuICAgICAgdGhpcy5jYWxsYmFjaygpXG4gICAgfSwgdGhpcy50aW1lckNhbGModGhpcy50cmllcyArIDEpKVxuICB9XG59XG4iLCAiaW1wb3J0IHtjbG9zdXJlfSBmcm9tIFwiLi91dGlsc1wiXG5pbXBvcnQge1xuICBDSEFOTkVMX0VWRU5UUyxcbiAgQ0hBTk5FTF9TVEFURVMsXG59IGZyb20gXCIuL2NvbnN0YW50c1wiXG5cbmltcG9ydCBQdXNoIGZyb20gXCIuL3B1c2hcIlxuaW1wb3J0IFRpbWVyIGZyb20gXCIuL3RpbWVyXCJcblxuLyoqXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRvcGljXG4gKiBAcGFyYW0geyhPYmplY3R8ZnVuY3Rpb24pfSBwYXJhbXNcbiAqIEBwYXJhbSB7U29ja2V0fSBzb2NrZXRcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2hhbm5lbCB7XG4gIGNvbnN0cnVjdG9yKHRvcGljLCBwYXJhbXMsIHNvY2tldCl7XG4gICAgdGhpcy5zdGF0ZSA9IENIQU5ORUxfU1RBVEVTLmNsb3NlZFxuICAgIHRoaXMudG9waWMgPSB0b3BpY1xuICAgIHRoaXMucGFyYW1zID0gY2xvc3VyZShwYXJhbXMgfHwge30pXG4gICAgdGhpcy5zb2NrZXQgPSBzb2NrZXRcbiAgICB0aGlzLmJpbmRpbmdzID0gW11cbiAgICB0aGlzLmJpbmRpbmdSZWYgPSAwXG4gICAgdGhpcy50aW1lb3V0ID0gdGhpcy5zb2NrZXQudGltZW91dFxuICAgIHRoaXMuam9pbmVkT25jZSA9IGZhbHNlXG4gICAgdGhpcy5qb2luUHVzaCA9IG5ldyBQdXNoKHRoaXMsIENIQU5ORUxfRVZFTlRTLmpvaW4sIHRoaXMucGFyYW1zLCB0aGlzLnRpbWVvdXQpXG4gICAgdGhpcy5wdXNoQnVmZmVyID0gW11cbiAgICB0aGlzLnN0YXRlQ2hhbmdlUmVmcyA9IFtdXG5cbiAgICB0aGlzLnJlam9pblRpbWVyID0gbmV3IFRpbWVyKCgpID0+IHtcbiAgICAgIGlmKHRoaXMuc29ja2V0LmlzQ29ubmVjdGVkKCkpeyB0aGlzLnJlam9pbigpIH1cbiAgICB9LCB0aGlzLnNvY2tldC5yZWpvaW5BZnRlck1zKVxuICAgIHRoaXMuc3RhdGVDaGFuZ2VSZWZzLnB1c2godGhpcy5zb2NrZXQub25FcnJvcigoKSA9PiB0aGlzLnJlam9pblRpbWVyLnJlc2V0KCkpKVxuICAgIHRoaXMuc3RhdGVDaGFuZ2VSZWZzLnB1c2godGhpcy5zb2NrZXQub25PcGVuKCgpID0+IHtcbiAgICAgIHRoaXMucmVqb2luVGltZXIucmVzZXQoKVxuICAgICAgaWYodGhpcy5pc0Vycm9yZWQoKSl7IHRoaXMucmVqb2luKCkgfVxuICAgIH0pXG4gICAgKVxuICAgIHRoaXMuam9pblB1c2gucmVjZWl2ZShcIm9rXCIsICgpID0+IHtcbiAgICAgIHRoaXMuc3RhdGUgPSBDSEFOTkVMX1NUQVRFUy5qb2luZWRcbiAgICAgIHRoaXMucmVqb2luVGltZXIucmVzZXQoKVxuICAgICAgdGhpcy5wdXNoQnVmZmVyLmZvckVhY2gocHVzaEV2ZW50ID0+IHB1c2hFdmVudC5zZW5kKCkpXG4gICAgICB0aGlzLnB1c2hCdWZmZXIgPSBbXVxuICAgIH0pXG4gICAgdGhpcy5qb2luUHVzaC5yZWNlaXZlKFwiZXJyb3JcIiwgKCkgPT4ge1xuICAgICAgdGhpcy5zdGF0ZSA9IENIQU5ORUxfU1RBVEVTLmVycm9yZWRcbiAgICAgIGlmKHRoaXMuc29ja2V0LmlzQ29ubmVjdGVkKCkpeyB0aGlzLnJlam9pblRpbWVyLnNjaGVkdWxlVGltZW91dCgpIH1cbiAgICB9KVxuICAgIHRoaXMub25DbG9zZSgoKSA9PiB7XG4gICAgICB0aGlzLnJlam9pblRpbWVyLnJlc2V0KClcbiAgICAgIGlmKHRoaXMuc29ja2V0Lmhhc0xvZ2dlcigpKSB0aGlzLnNvY2tldC5sb2coXCJjaGFubmVsXCIsIGBjbG9zZSAke3RoaXMudG9waWN9ICR7dGhpcy5qb2luUmVmKCl9YClcbiAgICAgIHRoaXMuc3RhdGUgPSBDSEFOTkVMX1NUQVRFUy5jbG9zZWRcbiAgICAgIHRoaXMuc29ja2V0LnJlbW92ZSh0aGlzKVxuICAgIH0pXG4gICAgdGhpcy5vbkVycm9yKHJlYXNvbiA9PiB7XG4gICAgICBpZih0aGlzLnNvY2tldC5oYXNMb2dnZXIoKSkgdGhpcy5zb2NrZXQubG9nKFwiY2hhbm5lbFwiLCBgZXJyb3IgJHt0aGlzLnRvcGljfWAsIHJlYXNvbilcbiAgICAgIGlmKHRoaXMuaXNKb2luaW5nKCkpeyB0aGlzLmpvaW5QdXNoLnJlc2V0KCkgfVxuICAgICAgdGhpcy5zdGF0ZSA9IENIQU5ORUxfU1RBVEVTLmVycm9yZWRcbiAgICAgIGlmKHRoaXMuc29ja2V0LmlzQ29ubmVjdGVkKCkpeyB0aGlzLnJlam9pblRpbWVyLnNjaGVkdWxlVGltZW91dCgpIH1cbiAgICB9KVxuICAgIHRoaXMuam9pblB1c2gucmVjZWl2ZShcInRpbWVvdXRcIiwgKCkgPT4ge1xuICAgICAgaWYodGhpcy5zb2NrZXQuaGFzTG9nZ2VyKCkpIHRoaXMuc29ja2V0LmxvZyhcImNoYW5uZWxcIiwgYHRpbWVvdXQgJHt0aGlzLnRvcGljfSAoJHt0aGlzLmpvaW5SZWYoKX0pYCwgdGhpcy5qb2luUHVzaC50aW1lb3V0KVxuICAgICAgbGV0IGxlYXZlUHVzaCA9IG5ldyBQdXNoKHRoaXMsIENIQU5ORUxfRVZFTlRTLmxlYXZlLCBjbG9zdXJlKHt9KSwgdGhpcy50aW1lb3V0KVxuICAgICAgbGVhdmVQdXNoLnNlbmQoKVxuICAgICAgdGhpcy5zdGF0ZSA9IENIQU5ORUxfU1RBVEVTLmVycm9yZWRcbiAgICAgIHRoaXMuam9pblB1c2gucmVzZXQoKVxuICAgICAgaWYodGhpcy5zb2NrZXQuaXNDb25uZWN0ZWQoKSl7IHRoaXMucmVqb2luVGltZXIuc2NoZWR1bGVUaW1lb3V0KCkgfVxuICAgIH0pXG4gICAgdGhpcy5vbihDSEFOTkVMX0VWRU5UUy5yZXBseSwgKHBheWxvYWQsIHJlZikgPT4ge1xuICAgICAgdGhpcy50cmlnZ2VyKHRoaXMucmVwbHlFdmVudE5hbWUocmVmKSwgcGF5bG9hZClcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIEpvaW4gdGhlIGNoYW5uZWxcbiAgICogQHBhcmFtIHtpbnRlZ2VyfSB0aW1lb3V0XG4gICAqIEByZXR1cm5zIHtQdXNofVxuICAgKi9cbiAgam9pbih0aW1lb3V0ID0gdGhpcy50aW1lb3V0KXtcbiAgICBpZih0aGlzLmpvaW5lZE9uY2Upe1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwidHJpZWQgdG8gam9pbiBtdWx0aXBsZSB0aW1lcy4gJ2pvaW4nIGNhbiBvbmx5IGJlIGNhbGxlZCBhIHNpbmdsZSB0aW1lIHBlciBjaGFubmVsIGluc3RhbmNlXCIpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudGltZW91dCA9IHRpbWVvdXRcbiAgICAgIHRoaXMuam9pbmVkT25jZSA9IHRydWVcbiAgICAgIHRoaXMucmVqb2luKClcbiAgICAgIHJldHVybiB0aGlzLmpvaW5QdXNoXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEhvb2sgaW50byBjaGFubmVsIGNsb3NlXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAqL1xuICBvbkNsb3NlKGNhbGxiYWNrKXtcbiAgICB0aGlzLm9uKENIQU5ORUxfRVZFTlRTLmNsb3NlLCBjYWxsYmFjaylcbiAgfVxuXG4gIC8qKlxuICAgKiBIb29rIGludG8gY2hhbm5lbCBlcnJvcnNcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICovXG4gIG9uRXJyb3IoY2FsbGJhY2spe1xuICAgIHJldHVybiB0aGlzLm9uKENIQU5ORUxfRVZFTlRTLmVycm9yLCByZWFzb24gPT4gY2FsbGJhY2socmVhc29uKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBTdWJzY3JpYmVzIG9uIGNoYW5uZWwgZXZlbnRzXG4gICAqXG4gICAqIFN1YnNjcmlwdGlvbiByZXR1cm5zIGEgcmVmIGNvdW50ZXIsIHdoaWNoIGNhbiBiZSB1c2VkIGxhdGVyIHRvXG4gICAqIHVuc3Vic2NyaWJlIHRoZSBleGFjdCBldmVudCBsaXN0ZW5lclxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBjb25zdCByZWYxID0gY2hhbm5lbC5vbihcImV2ZW50XCIsIGRvX3N0dWZmKVxuICAgKiBjb25zdCByZWYyID0gY2hhbm5lbC5vbihcImV2ZW50XCIsIGRvX290aGVyX3N0dWZmKVxuICAgKiBjaGFubmVsLm9mZihcImV2ZW50XCIsIHJlZjEpXG4gICAqIC8vIFNpbmNlIHVuc3Vic2NyaXB0aW9uLCBkb19zdHVmZiB3b24ndCBmaXJlLFxuICAgKiAvLyB3aGlsZSBkb19vdGhlcl9zdHVmZiB3aWxsIGtlZXAgZmlyaW5nIG9uIHRoZSBcImV2ZW50XCJcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50XG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAqIEByZXR1cm5zIHtpbnRlZ2VyfSByZWZcbiAgICovXG4gIG9uKGV2ZW50LCBjYWxsYmFjayl7XG4gICAgbGV0IHJlZiA9IHRoaXMuYmluZGluZ1JlZisrXG4gICAgdGhpcy5iaW5kaW5ncy5wdXNoKHtldmVudCwgcmVmLCBjYWxsYmFja30pXG4gICAgcmV0dXJuIHJlZlxuICB9XG5cbiAgLyoqXG4gICAqIFVuc3Vic2NyaWJlcyBvZmYgb2YgY2hhbm5lbCBldmVudHNcbiAgICpcbiAgICogVXNlIHRoZSByZWYgcmV0dXJuZWQgZnJvbSBhIGNoYW5uZWwub24oKSB0byB1bnN1YnNjcmliZSBvbmVcbiAgICogaGFuZGxlciwgb3IgcGFzcyBub3RoaW5nIGZvciB0aGUgcmVmIHRvIHVuc3Vic2NyaWJlIGFsbFxuICAgKiBoYW5kbGVycyBmb3IgdGhlIGdpdmVuIGV2ZW50LlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiAvLyBVbnN1YnNjcmliZSB0aGUgZG9fc3R1ZmYgaGFuZGxlclxuICAgKiBjb25zdCByZWYxID0gY2hhbm5lbC5vbihcImV2ZW50XCIsIGRvX3N0dWZmKVxuICAgKiBjaGFubmVsLm9mZihcImV2ZW50XCIsIHJlZjEpXG4gICAqXG4gICAqIC8vIFVuc3Vic2NyaWJlIGFsbCBoYW5kbGVycyBmcm9tIGV2ZW50XG4gICAqIGNoYW5uZWwub2ZmKFwiZXZlbnRcIilcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50XG4gICAqIEBwYXJhbSB7aW50ZWdlcn0gcmVmXG4gICAqL1xuICBvZmYoZXZlbnQsIHJlZil7XG4gICAgdGhpcy5iaW5kaW5ncyA9IHRoaXMuYmluZGluZ3MuZmlsdGVyKChiaW5kKSA9PiB7XG4gICAgICByZXR1cm4gIShiaW5kLmV2ZW50ID09PSBldmVudCAmJiAodHlwZW9mIHJlZiA9PT0gXCJ1bmRlZmluZWRcIiB8fCByZWYgPT09IGJpbmQucmVmKSlcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjYW5QdXNoKCl7IHJldHVybiB0aGlzLnNvY2tldC5pc0Nvbm5lY3RlZCgpICYmIHRoaXMuaXNKb2luZWQoKSB9XG5cbiAgLyoqXG4gICAqIFNlbmRzIGEgbWVzc2FnZSBgZXZlbnRgIHRvIHBob2VuaXggd2l0aCB0aGUgcGF5bG9hZCBgcGF5bG9hZGAuXG4gICAqIFBob2VuaXggcmVjZWl2ZXMgdGhpcyBpbiB0aGUgYGhhbmRsZV9pbihldmVudCwgcGF5bG9hZCwgc29ja2V0KWBcbiAgICogZnVuY3Rpb24uIGlmIHBob2VuaXggcmVwbGllcyBvciBpdCB0aW1lcyBvdXQgKGRlZmF1bHQgMTAwMDBtcyksXG4gICAqIHRoZW4gb3B0aW9uYWxseSB0aGUgcmVwbHkgY2FuIGJlIHJlY2VpdmVkLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBjaGFubmVsLnB1c2goXCJldmVudFwiKVxuICAgKiAgIC5yZWNlaXZlKFwib2tcIiwgcGF5bG9hZCA9PiBjb25zb2xlLmxvZyhcInBob2VuaXggcmVwbGllZDpcIiwgcGF5bG9hZCkpXG4gICAqICAgLnJlY2VpdmUoXCJlcnJvclwiLCBlcnIgPT4gY29uc29sZS5sb2coXCJwaG9lbml4IGVycm9yZWRcIiwgZXJyKSlcbiAgICogICAucmVjZWl2ZShcInRpbWVvdXRcIiwgKCkgPT4gY29uc29sZS5sb2coXCJ0aW1lZCBvdXQgcHVzaGluZ1wiKSlcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwYXlsb2FkXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBbdGltZW91dF1cbiAgICogQHJldHVybnMge1B1c2h9XG4gICAqL1xuICBwdXNoKGV2ZW50LCBwYXlsb2FkLCB0aW1lb3V0ID0gdGhpcy50aW1lb3V0KXtcbiAgICBwYXlsb2FkID0gcGF5bG9hZCB8fCB7fVxuICAgIGlmKCF0aGlzLmpvaW5lZE9uY2Upe1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGB0cmllZCB0byBwdXNoICcke2V2ZW50fScgdG8gJyR7dGhpcy50b3BpY30nIGJlZm9yZSBqb2luaW5nLiBVc2UgY2hhbm5lbC5qb2luKCkgYmVmb3JlIHB1c2hpbmcgZXZlbnRzYClcbiAgICB9XG4gICAgbGV0IHB1c2hFdmVudCA9IG5ldyBQdXNoKHRoaXMsIGV2ZW50LCBmdW5jdGlvbiAoKXsgcmV0dXJuIHBheWxvYWQgfSwgdGltZW91dClcbiAgICBpZih0aGlzLmNhblB1c2goKSl7XG4gICAgICBwdXNoRXZlbnQuc2VuZCgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHB1c2hFdmVudC5zdGFydFRpbWVvdXQoKVxuICAgICAgdGhpcy5wdXNoQnVmZmVyLnB1c2gocHVzaEV2ZW50KVxuICAgIH1cblxuICAgIHJldHVybiBwdXNoRXZlbnRcbiAgfVxuXG4gIC8qKiBMZWF2ZXMgdGhlIGNoYW5uZWxcbiAgICpcbiAgICogVW5zdWJzY3JpYmVzIGZyb20gc2VydmVyIGV2ZW50cywgYW5kXG4gICAqIGluc3RydWN0cyBjaGFubmVsIHRvIHRlcm1pbmF0ZSBvbiBzZXJ2ZXJcbiAgICpcbiAgICogVHJpZ2dlcnMgb25DbG9zZSgpIGhvb2tzXG4gICAqXG4gICAqIFRvIHJlY2VpdmUgbGVhdmUgYWNrbm93bGVkZ2VtZW50cywgdXNlIHRoZSBgcmVjZWl2ZWBcbiAgICogaG9vayB0byBiaW5kIHRvIHRoZSBzZXJ2ZXIgYWNrLCBpZTpcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogY2hhbm5lbC5sZWF2ZSgpLnJlY2VpdmUoXCJva1wiLCAoKSA9PiBhbGVydChcImxlZnQhXCIpIClcbiAgICpcbiAgICogQHBhcmFtIHtpbnRlZ2VyfSB0aW1lb3V0XG4gICAqIEByZXR1cm5zIHtQdXNofVxuICAgKi9cbiAgbGVhdmUodGltZW91dCA9IHRoaXMudGltZW91dCl7XG4gICAgdGhpcy5yZWpvaW5UaW1lci5yZXNldCgpXG4gICAgdGhpcy5qb2luUHVzaC5jYW5jZWxUaW1lb3V0KClcblxuICAgIHRoaXMuc3RhdGUgPSBDSEFOTkVMX1NUQVRFUy5sZWF2aW5nXG4gICAgbGV0IG9uQ2xvc2UgPSAoKSA9PiB7XG4gICAgICBpZih0aGlzLnNvY2tldC5oYXNMb2dnZXIoKSkgdGhpcy5zb2NrZXQubG9nKFwiY2hhbm5lbFwiLCBgbGVhdmUgJHt0aGlzLnRvcGljfWApXG4gICAgICB0aGlzLnRyaWdnZXIoQ0hBTk5FTF9FVkVOVFMuY2xvc2UsIFwibGVhdmVcIilcbiAgICB9XG4gICAgbGV0IGxlYXZlUHVzaCA9IG5ldyBQdXNoKHRoaXMsIENIQU5ORUxfRVZFTlRTLmxlYXZlLCBjbG9zdXJlKHt9KSwgdGltZW91dClcbiAgICBsZWF2ZVB1c2gucmVjZWl2ZShcIm9rXCIsICgpID0+IG9uQ2xvc2UoKSlcbiAgICAgIC5yZWNlaXZlKFwidGltZW91dFwiLCAoKSA9PiBvbkNsb3NlKCkpXG4gICAgbGVhdmVQdXNoLnNlbmQoKVxuICAgIGlmKCF0aGlzLmNhblB1c2goKSl7IGxlYXZlUHVzaC50cmlnZ2VyKFwib2tcIiwge30pIH1cblxuICAgIHJldHVybiBsZWF2ZVB1c2hcbiAgfVxuXG4gIC8qKlxuICAgKiBPdmVycmlkYWJsZSBtZXNzYWdlIGhvb2tcbiAgICpcbiAgICogUmVjZWl2ZXMgYWxsIGV2ZW50cyBmb3Igc3BlY2lhbGl6ZWQgbWVzc2FnZSBoYW5kbGluZ1xuICAgKiBiZWZvcmUgZGlzcGF0Y2hpbmcgdG8gdGhlIGNoYW5uZWwgY2FsbGJhY2tzLlxuICAgKlxuICAgKiBNdXN0IHJldHVybiB0aGUgcGF5bG9hZCwgbW9kaWZpZWQgb3IgdW5tb2RpZmllZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRcbiAgICogQHBhcmFtIHtPYmplY3R9IHBheWxvYWRcbiAgICogQHBhcmFtIHtpbnRlZ2VyfSByZWZcbiAgICogQHJldHVybnMge09iamVjdH1cbiAgICovXG4gIG9uTWVzc2FnZShfZXZlbnQsIHBheWxvYWQsIF9yZWYpeyByZXR1cm4gcGF5bG9hZCB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBpc01lbWJlcih0b3BpYywgZXZlbnQsIHBheWxvYWQsIGpvaW5SZWYpe1xuICAgIGlmKHRoaXMudG9waWMgIT09IHRvcGljKXsgcmV0dXJuIGZhbHNlIH1cblxuICAgIGlmKGpvaW5SZWYgJiYgam9pblJlZiAhPT0gdGhpcy5qb2luUmVmKCkpe1xuICAgICAgaWYodGhpcy5zb2NrZXQuaGFzTG9nZ2VyKCkpIHRoaXMuc29ja2V0LmxvZyhcImNoYW5uZWxcIiwgXCJkcm9wcGluZyBvdXRkYXRlZCBtZXNzYWdlXCIsIHt0b3BpYywgZXZlbnQsIHBheWxvYWQsIGpvaW5SZWZ9KVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBqb2luUmVmKCl7IHJldHVybiB0aGlzLmpvaW5QdXNoLnJlZiB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZWpvaW4odGltZW91dCA9IHRoaXMudGltZW91dCl7XG4gICAgaWYodGhpcy5pc0xlYXZpbmcoKSl7IHJldHVybiB9XG4gICAgdGhpcy5zb2NrZXQubGVhdmVPcGVuVG9waWModGhpcy50b3BpYylcbiAgICB0aGlzLnN0YXRlID0gQ0hBTk5FTF9TVEFURVMuam9pbmluZ1xuICAgIHRoaXMuam9pblB1c2gucmVzZW5kKHRpbWVvdXQpXG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHRyaWdnZXIoZXZlbnQsIHBheWxvYWQsIHJlZiwgam9pblJlZil7XG4gICAgbGV0IGhhbmRsZWRQYXlsb2FkID0gdGhpcy5vbk1lc3NhZ2UoZXZlbnQsIHBheWxvYWQsIHJlZiwgam9pblJlZilcbiAgICBpZihwYXlsb2FkICYmICFoYW5kbGVkUGF5bG9hZCl7IHRocm93IG5ldyBFcnJvcihcImNoYW5uZWwgb25NZXNzYWdlIGNhbGxiYWNrcyBtdXN0IHJldHVybiB0aGUgcGF5bG9hZCwgbW9kaWZpZWQgb3IgdW5tb2RpZmllZFwiKSB9XG5cbiAgICBsZXQgZXZlbnRCaW5kaW5ncyA9IHRoaXMuYmluZGluZ3MuZmlsdGVyKGJpbmQgPT4gYmluZC5ldmVudCA9PT0gZXZlbnQpXG5cbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgZXZlbnRCaW5kaW5ncy5sZW5ndGg7IGkrKyl7XG4gICAgICBsZXQgYmluZCA9IGV2ZW50QmluZGluZ3NbaV1cbiAgICAgIGJpbmQuY2FsbGJhY2soaGFuZGxlZFBheWxvYWQsIHJlZiwgam9pblJlZiB8fCB0aGlzLmpvaW5SZWYoKSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlcGx5RXZlbnROYW1lKHJlZil7IHJldHVybiBgY2hhbl9yZXBseV8ke3JlZn1gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGlzQ2xvc2VkKCl7IHJldHVybiB0aGlzLnN0YXRlID09PSBDSEFOTkVMX1NUQVRFUy5jbG9zZWQgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaXNFcnJvcmVkKCl7IHJldHVybiB0aGlzLnN0YXRlID09PSBDSEFOTkVMX1NUQVRFUy5lcnJvcmVkIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGlzSm9pbmVkKCl7IHJldHVybiB0aGlzLnN0YXRlID09PSBDSEFOTkVMX1NUQVRFUy5qb2luZWQgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaXNKb2luaW5nKCl7IHJldHVybiB0aGlzLnN0YXRlID09PSBDSEFOTkVMX1NUQVRFUy5qb2luaW5nIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGlzTGVhdmluZygpeyByZXR1cm4gdGhpcy5zdGF0ZSA9PT0gQ0hBTk5FTF9TVEFURVMubGVhdmluZyB9XG59XG4iLCAiaW1wb3J0IHtcbiAgZ2xvYmFsLFxuICBYSFJfU1RBVEVTXG59IGZyb20gXCIuL2NvbnN0YW50c1wiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFqYXgge1xuXG4gIHN0YXRpYyByZXF1ZXN0KG1ldGhvZCwgZW5kUG9pbnQsIGFjY2VwdCwgYm9keSwgdGltZW91dCwgb250aW1lb3V0LCBjYWxsYmFjayl7XG4gICAgaWYoZ2xvYmFsLlhEb21haW5SZXF1ZXN0KXtcbiAgICAgIGxldCByZXEgPSBuZXcgZ2xvYmFsLlhEb21haW5SZXF1ZXN0KCkgLy8gSUU4LCBJRTlcbiAgICAgIHJldHVybiB0aGlzLnhkb21haW5SZXF1ZXN0KHJlcSwgbWV0aG9kLCBlbmRQb2ludCwgYm9keSwgdGltZW91dCwgb250aW1lb3V0LCBjYWxsYmFjaylcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IHJlcSA9IG5ldyBnbG9iYWwuWE1MSHR0cFJlcXVlc3QoKSAvLyBJRTcrLCBGaXJlZm94LCBDaHJvbWUsIE9wZXJhLCBTYWZhcmlcbiAgICAgIHJldHVybiB0aGlzLnhoclJlcXVlc3QocmVxLCBtZXRob2QsIGVuZFBvaW50LCBhY2NlcHQsIGJvZHksIHRpbWVvdXQsIG9udGltZW91dCwgY2FsbGJhY2spXG4gICAgfVxuICB9XG5cbiAgc3RhdGljIHhkb21haW5SZXF1ZXN0KHJlcSwgbWV0aG9kLCBlbmRQb2ludCwgYm9keSwgdGltZW91dCwgb250aW1lb3V0LCBjYWxsYmFjayl7XG4gICAgcmVxLnRpbWVvdXQgPSB0aW1lb3V0XG4gICAgcmVxLm9wZW4obWV0aG9kLCBlbmRQb2ludClcbiAgICByZXEub25sb2FkID0gKCkgPT4ge1xuICAgICAgbGV0IHJlc3BvbnNlID0gdGhpcy5wYXJzZUpTT04ocmVxLnJlc3BvbnNlVGV4dClcbiAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKHJlc3BvbnNlKVxuICAgIH1cbiAgICBpZihvbnRpbWVvdXQpeyByZXEub250aW1lb3V0ID0gb250aW1lb3V0IH1cblxuICAgIC8vIFdvcmsgYXJvdW5kIGJ1ZyBpbiBJRTkgdGhhdCByZXF1aXJlcyBhbiBhdHRhY2hlZCBvbnByb2dyZXNzIGhhbmRsZXJcbiAgICByZXEub25wcm9ncmVzcyA9ICgpID0+IHsgfVxuXG4gICAgcmVxLnNlbmQoYm9keSlcbiAgICByZXR1cm4gcmVxXG4gIH1cblxuICBzdGF0aWMgeGhyUmVxdWVzdChyZXEsIG1ldGhvZCwgZW5kUG9pbnQsIGFjY2VwdCwgYm9keSwgdGltZW91dCwgb250aW1lb3V0LCBjYWxsYmFjayl7XG4gICAgcmVxLm9wZW4obWV0aG9kLCBlbmRQb2ludCwgdHJ1ZSlcbiAgICByZXEudGltZW91dCA9IHRpbWVvdXRcbiAgICByZXEuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBhY2NlcHQpXG4gICAgcmVxLm9uZXJyb3IgPSAoKSA9PiBjYWxsYmFjayAmJiBjYWxsYmFjayhudWxsKVxuICAgIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICBpZihyZXEucmVhZHlTdGF0ZSA9PT0gWEhSX1NUQVRFUy5jb21wbGV0ZSAmJiBjYWxsYmFjayl7XG4gICAgICAgIGxldCByZXNwb25zZSA9IHRoaXMucGFyc2VKU09OKHJlcS5yZXNwb25zZVRleHQpXG4gICAgICAgIGNhbGxiYWNrKHJlc3BvbnNlKVxuICAgICAgfVxuICAgIH1cbiAgICBpZihvbnRpbWVvdXQpeyByZXEub250aW1lb3V0ID0gb250aW1lb3V0IH1cblxuICAgIHJlcS5zZW5kKGJvZHkpXG4gICAgcmV0dXJuIHJlcVxuICB9XG5cbiAgc3RhdGljIHBhcnNlSlNPTihyZXNwKXtcbiAgICBpZighcmVzcCB8fCByZXNwID09PSBcIlwiKXsgcmV0dXJuIG51bGwgfVxuXG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKHJlc3ApXG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICBjb25zb2xlICYmIGNvbnNvbGUubG9nKFwiZmFpbGVkIHRvIHBhcnNlIEpTT04gcmVzcG9uc2VcIiwgcmVzcClcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICB9XG5cbiAgc3RhdGljIHNlcmlhbGl6ZShvYmosIHBhcmVudEtleSl7XG4gICAgbGV0IHF1ZXJ5U3RyID0gW11cbiAgICBmb3IodmFyIGtleSBpbiBvYmope1xuICAgICAgaWYoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpeyBjb250aW51ZSB9XG4gICAgICBsZXQgcGFyYW1LZXkgPSBwYXJlbnRLZXkgPyBgJHtwYXJlbnRLZXl9WyR7a2V5fV1gIDoga2V5XG4gICAgICBsZXQgcGFyYW1WYWwgPSBvYmpba2V5XVxuICAgICAgaWYodHlwZW9mIHBhcmFtVmFsID09PSBcIm9iamVjdFwiKXtcbiAgICAgICAgcXVlcnlTdHIucHVzaCh0aGlzLnNlcmlhbGl6ZShwYXJhbVZhbCwgcGFyYW1LZXkpKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcXVlcnlTdHIucHVzaChlbmNvZGVVUklDb21wb25lbnQocGFyYW1LZXkpICsgXCI9XCIgKyBlbmNvZGVVUklDb21wb25lbnQocGFyYW1WYWwpKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcXVlcnlTdHIuam9pbihcIiZcIilcbiAgfVxuXG4gIHN0YXRpYyBhcHBlbmRQYXJhbXModXJsLCBwYXJhbXMpe1xuICAgIGlmKE9iamVjdC5rZXlzKHBhcmFtcykubGVuZ3RoID09PSAwKXsgcmV0dXJuIHVybCB9XG5cbiAgICBsZXQgcHJlZml4ID0gdXJsLm1hdGNoKC9cXD8vKSA/IFwiJlwiIDogXCI/XCJcbiAgICByZXR1cm4gYCR7dXJsfSR7cHJlZml4fSR7dGhpcy5zZXJpYWxpemUocGFyYW1zKX1gXG4gIH1cbn1cbiIsICJpbXBvcnQge1xuICBTT0NLRVRfU1RBVEVTLFxuICBUUkFOU1BPUlRTXG59IGZyb20gXCIuL2NvbnN0YW50c1wiXG5cbmltcG9ydCBBamF4IGZyb20gXCIuL2FqYXhcIlxuXG5sZXQgYXJyYXlCdWZmZXJUb0Jhc2U2NCA9IChidWZmZXIpID0+IHtcbiAgbGV0IGJpbmFyeSA9IFwiXCJcbiAgbGV0IGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoYnVmZmVyKVxuICBsZXQgbGVuID0gYnl0ZXMuYnl0ZUxlbmd0aFxuICBmb3IobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspeyBiaW5hcnkgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSkgfVxuICByZXR1cm4gYnRvYShiaW5hcnkpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvbmdQb2xsIHtcblxuICBjb25zdHJ1Y3RvcihlbmRQb2ludCl7XG4gICAgdGhpcy5lbmRQb2ludCA9IG51bGxcbiAgICB0aGlzLnRva2VuID0gbnVsbFxuICAgIHRoaXMuc2tpcEhlYXJ0YmVhdCA9IHRydWVcbiAgICB0aGlzLnJlcXMgPSBuZXcgU2V0KClcbiAgICB0aGlzLmF3YWl0aW5nQmF0Y2hBY2sgPSBmYWxzZVxuICAgIHRoaXMuY3VycmVudEJhdGNoID0gbnVsbFxuICAgIHRoaXMuY3VycmVudEJhdGNoVGltZXIgPSBudWxsXG4gICAgdGhpcy5iYXRjaEJ1ZmZlciA9IFtdXG4gICAgdGhpcy5vbm9wZW4gPSBmdW5jdGlvbiAoKXsgfSAvLyBub29wXG4gICAgdGhpcy5vbmVycm9yID0gZnVuY3Rpb24gKCl7IH0gLy8gbm9vcFxuICAgIHRoaXMub25tZXNzYWdlID0gZnVuY3Rpb24gKCl7IH0gLy8gbm9vcFxuICAgIHRoaXMub25jbG9zZSA9IGZ1bmN0aW9uICgpeyB9IC8vIG5vb3BcbiAgICB0aGlzLnBvbGxFbmRwb2ludCA9IHRoaXMubm9ybWFsaXplRW5kcG9pbnQoZW5kUG9pbnQpXG4gICAgdGhpcy5yZWFkeVN0YXRlID0gU09DS0VUX1NUQVRFUy5jb25uZWN0aW5nXG4gICAgLy8gd2UgbXVzdCB3YWl0IGZvciB0aGUgY2FsbGVyIHRvIGZpbmlzaCBzZXR0aW5nIHVwIG91ciBjYWxsYmFja3MgYW5kIHRpbWVvdXQgcHJvcGVydGllc1xuICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5wb2xsKCksIDApXG4gIH1cblxuICBub3JtYWxpemVFbmRwb2ludChlbmRQb2ludCl7XG4gICAgcmV0dXJuIChlbmRQb2ludFxuICAgICAgLnJlcGxhY2UoXCJ3czovL1wiLCBcImh0dHA6Ly9cIilcbiAgICAgIC5yZXBsYWNlKFwid3NzOi8vXCIsIFwiaHR0cHM6Ly9cIilcbiAgICAgIC5yZXBsYWNlKG5ldyBSZWdFeHAoXCIoLiopXFwvXCIgKyBUUkFOU1BPUlRTLndlYnNvY2tldCksIFwiJDEvXCIgKyBUUkFOU1BPUlRTLmxvbmdwb2xsKSlcbiAgfVxuXG4gIGVuZHBvaW50VVJMKCl7XG4gICAgcmV0dXJuIEFqYXguYXBwZW5kUGFyYW1zKHRoaXMucG9sbEVuZHBvaW50LCB7dG9rZW46IHRoaXMudG9rZW59KVxuICB9XG5cbiAgY2xvc2VBbmRSZXRyeShjb2RlLCByZWFzb24sIHdhc0NsZWFuKXtcbiAgICB0aGlzLmNsb3NlKGNvZGUsIHJlYXNvbiwgd2FzQ2xlYW4pXG4gICAgdGhpcy5yZWFkeVN0YXRlID0gU09DS0VUX1NUQVRFUy5jb25uZWN0aW5nXG4gIH1cblxuICBvbnRpbWVvdXQoKXtcbiAgICB0aGlzLm9uZXJyb3IoXCJ0aW1lb3V0XCIpXG4gICAgdGhpcy5jbG9zZUFuZFJldHJ5KDEwMDUsIFwidGltZW91dFwiLCBmYWxzZSlcbiAgfVxuXG4gIGlzQWN0aXZlKCl7IHJldHVybiB0aGlzLnJlYWR5U3RhdGUgPT09IFNPQ0tFVF9TVEFURVMub3BlbiB8fCB0aGlzLnJlYWR5U3RhdGUgPT09IFNPQ0tFVF9TVEFURVMuY29ubmVjdGluZyB9XG5cbiAgcG9sbCgpe1xuICAgIHRoaXMuYWpheChcIkdFVFwiLCBcImFwcGxpY2F0aW9uL2pzb25cIiwgbnVsbCwgKCkgPT4gdGhpcy5vbnRpbWVvdXQoKSwgcmVzcCA9PiB7XG4gICAgICBpZihyZXNwKXtcbiAgICAgICAgdmFyIHtzdGF0dXMsIHRva2VuLCBtZXNzYWdlc30gPSByZXNwXG4gICAgICAgIHRoaXMudG9rZW4gPSB0b2tlblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RhdHVzID0gMFxuICAgICAgfVxuXG4gICAgICBzd2l0Y2goc3RhdHVzKXtcbiAgICAgICAgY2FzZSAyMDA6XG4gICAgICAgICAgbWVzc2FnZXMuZm9yRWFjaChtc2cgPT4ge1xuICAgICAgICAgICAgLy8gVGFza3MgYXJlIHdoYXQgdGhpbmdzIGxpa2UgZXZlbnQgaGFuZGxlcnMsIHNldFRpbWVvdXQgY2FsbGJhY2tzLFxuICAgICAgICAgICAgLy8gcHJvbWlzZSByZXNvbHZlcyBhbmQgbW9yZSBhcmUgcnVuIHdpdGhpbi5cbiAgICAgICAgICAgIC8vIEluIG1vZGVybiBicm93c2VycywgdGhlcmUgYXJlIHR3byBkaWZmZXJlbnQga2luZHMgb2YgdGFza3MsXG4gICAgICAgICAgICAvLyBtaWNyb3Rhc2tzIGFuZCBtYWNyb3Rhc2tzLlxuICAgICAgICAgICAgLy8gTWljcm90YXNrcyBhcmUgbWFpbmx5IHVzZWQgZm9yIFByb21pc2VzLCB3aGlsZSBtYWNyb3Rhc2tzIGFyZVxuICAgICAgICAgICAgLy8gdXNlZCBmb3IgZXZlcnl0aGluZyBlbHNlLlxuICAgICAgICAgICAgLy8gTWljcm90YXNrcyBhbHdheXMgaGF2ZSBwcmlvcml0eSBvdmVyIG1hY3JvdGFza3MuIElmIHRoZSBKUyBlbmdpbmVcbiAgICAgICAgICAgIC8vIGlzIGxvb2tpbmcgZm9yIGEgdGFzayB0byBydW4sIGl0IHdpbGwgYWx3YXlzIHRyeSB0byBlbXB0eSB0aGVcbiAgICAgICAgICAgIC8vIG1pY3JvdGFzayBxdWV1ZSBiZWZvcmUgYXR0ZW1wdGluZyB0byBydW4gYW55dGhpbmcgZnJvbSB0aGVcbiAgICAgICAgICAgIC8vIG1hY3JvdGFzayBxdWV1ZS5cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyBGb3IgdGhlIFdlYlNvY2tldCB0cmFuc3BvcnQsIG1lc3NhZ2VzIGFsd2F5cyBhcnJpdmUgaW4gdGhlaXIgb3duXG4gICAgICAgICAgICAvLyBldmVudC4gVGhpcyBtZWFucyB0aGF0IGlmIGFueSBwcm9taXNlcyBhcmUgcmVzb2x2ZWQgZnJvbSB3aXRoaW4sXG4gICAgICAgICAgICAvLyB0aGVpciBjYWxsYmFja3Mgd2lsbCBhbHdheXMgZmluaXNoIGV4ZWN1dGlvbiBieSB0aGUgdGltZSB0aGVcbiAgICAgICAgICAgIC8vIG5leHQgbWVzc2FnZSBldmVudCBoYW5kbGVyIGlzIHJ1bi5cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyBJbiBvcmRlciB0byBlbXVsYXRlIHRoaXMgYmVoYXZpb3VyLCB3ZSBuZWVkIHRvIG1ha2Ugc3VyZSBlYWNoXG4gICAgICAgICAgICAvLyBvbm1lc3NhZ2UgaGFuZGxlciBpcyBydW4gd2l0aGluIGl0cyBvd24gbWFjcm90YXNrLlxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLm9ubWVzc2FnZSh7ZGF0YTogbXNnfSksIDApXG4gICAgICAgICAgfSlcbiAgICAgICAgICB0aGlzLnBvbGwoKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMjA0OlxuICAgICAgICAgIHRoaXMucG9sbCgpXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSA0MTA6XG4gICAgICAgICAgdGhpcy5yZWFkeVN0YXRlID0gU09DS0VUX1NUQVRFUy5vcGVuXG4gICAgICAgICAgdGhpcy5vbm9wZW4oe30pXG4gICAgICAgICAgdGhpcy5wb2xsKClcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDQwMzpcbiAgICAgICAgICB0aGlzLm9uZXJyb3IoNDAzKVxuICAgICAgICAgIHRoaXMuY2xvc2UoMTAwOCwgXCJmb3JiaWRkZW5cIiwgZmFsc2UpXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICBjYXNlIDUwMDpcbiAgICAgICAgICB0aGlzLm9uZXJyb3IoNTAwKVxuICAgICAgICAgIHRoaXMuY2xvc2VBbmRSZXRyeSgxMDExLCBcImludGVybmFsIHNlcnZlciBlcnJvclwiLCA1MDApXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgZGVmYXVsdDogdGhyb3cgbmV3IEVycm9yKGB1bmhhbmRsZWQgcG9sbCBzdGF0dXMgJHtzdGF0dXN9YClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgLy8gd2UgY29sbGVjdCBhbGwgcHVzaGVzIHdpdGhpbiB0aGUgY3VycmVudCBldmVudCBsb29wIGJ5XG4gIC8vIHNldFRpbWVvdXQgMCwgd2hpY2ggb3B0aW1pemVzIGJhY2stdG8tYmFjayBwcm9jZWR1cmFsXG4gIC8vIHB1c2hlcyBhZ2FpbnN0IGFuIGVtcHR5IGJ1ZmZlclxuXG4gIHNlbmQoYm9keSl7XG4gICAgaWYodHlwZW9mKGJvZHkpICE9PSBcInN0cmluZ1wiKXsgYm9keSA9IGFycmF5QnVmZmVyVG9CYXNlNjQoYm9keSkgfVxuICAgIGlmKHRoaXMuY3VycmVudEJhdGNoKXtcbiAgICAgIHRoaXMuY3VycmVudEJhdGNoLnB1c2goYm9keSlcbiAgICB9IGVsc2UgaWYodGhpcy5hd2FpdGluZ0JhdGNoQWNrKXtcbiAgICAgIHRoaXMuYmF0Y2hCdWZmZXIucHVzaChib2R5KVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmN1cnJlbnRCYXRjaCA9IFtib2R5XVxuICAgICAgdGhpcy5jdXJyZW50QmF0Y2hUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLmJhdGNoU2VuZCh0aGlzLmN1cnJlbnRCYXRjaClcbiAgICAgICAgdGhpcy5jdXJyZW50QmF0Y2ggPSBudWxsXG4gICAgICB9LCAwKVxuICAgIH1cbiAgfVxuXG4gIGJhdGNoU2VuZChtZXNzYWdlcyl7XG4gICAgdGhpcy5hd2FpdGluZ0JhdGNoQWNrID0gdHJ1ZVxuICAgIHRoaXMuYWpheChcIlBPU1RcIiwgXCJhcHBsaWNhdGlvbi94LW5kanNvblwiLCBtZXNzYWdlcy5qb2luKFwiXFxuXCIpLCAoKSA9PiB0aGlzLm9uZXJyb3IoXCJ0aW1lb3V0XCIpLCByZXNwID0+IHtcbiAgICAgIHRoaXMuYXdhaXRpbmdCYXRjaEFjayA9IGZhbHNlXG4gICAgICBpZighcmVzcCB8fCByZXNwLnN0YXR1cyAhPT0gMjAwKXtcbiAgICAgICAgdGhpcy5vbmVycm9yKHJlc3AgJiYgcmVzcC5zdGF0dXMpXG4gICAgICAgIHRoaXMuY2xvc2VBbmRSZXRyeSgxMDExLCBcImludGVybmFsIHNlcnZlciBlcnJvclwiLCBmYWxzZSlcbiAgICAgIH0gZWxzZSBpZih0aGlzLmJhdGNoQnVmZmVyLmxlbmd0aCA+IDApe1xuICAgICAgICB0aGlzLmJhdGNoU2VuZCh0aGlzLmJhdGNoQnVmZmVyKVxuICAgICAgICB0aGlzLmJhdGNoQnVmZmVyID0gW11cbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgY2xvc2UoY29kZSwgcmVhc29uLCB3YXNDbGVhbil7XG4gICAgZm9yKGxldCByZXEgb2YgdGhpcy5yZXFzKXsgcmVxLmFib3J0KCkgfVxuICAgIHRoaXMucmVhZHlTdGF0ZSA9IFNPQ0tFVF9TVEFURVMuY2xvc2VkXG4gICAgbGV0IG9wdHMgPSBPYmplY3QuYXNzaWduKHtjb2RlOiAxMDAwLCByZWFzb246IHVuZGVmaW5lZCwgd2FzQ2xlYW46IHRydWV9LCB7Y29kZSwgcmVhc29uLCB3YXNDbGVhbn0pXG4gICAgdGhpcy5iYXRjaEJ1ZmZlciA9IFtdXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuY3VycmVudEJhdGNoVGltZXIpXG4gICAgdGhpcy5jdXJyZW50QmF0Y2hUaW1lciA9IG51bGxcbiAgICBpZih0eXBlb2YoQ2xvc2VFdmVudCkgIT09IFwidW5kZWZpbmVkXCIpe1xuICAgICAgdGhpcy5vbmNsb3NlKG5ldyBDbG9zZUV2ZW50KFwiY2xvc2VcIiwgb3B0cykpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub25jbG9zZShvcHRzKVxuICAgIH1cbiAgfVxuXG4gIGFqYXgobWV0aG9kLCBjb250ZW50VHlwZSwgYm9keSwgb25DYWxsZXJUaW1lb3V0LCBjYWxsYmFjayl7XG4gICAgbGV0IHJlcVxuICAgIGxldCBvbnRpbWVvdXQgPSAoKSA9PiB7XG4gICAgICB0aGlzLnJlcXMuZGVsZXRlKHJlcSlcbiAgICAgIG9uQ2FsbGVyVGltZW91dCgpXG4gICAgfVxuICAgIHJlcSA9IEFqYXgucmVxdWVzdChtZXRob2QsIHRoaXMuZW5kcG9pbnRVUkwoKSwgY29udGVudFR5cGUsIGJvZHksIHRoaXMudGltZW91dCwgb250aW1lb3V0LCByZXNwID0+IHtcbiAgICAgIHRoaXMucmVxcy5kZWxldGUocmVxKVxuICAgICAgaWYodGhpcy5pc0FjdGl2ZSgpKXsgY2FsbGJhY2socmVzcCkgfVxuICAgIH0pXG4gICAgdGhpcy5yZXFzLmFkZChyZXEpXG4gIH1cbn1cbiIsICIvKipcbiAqIEluaXRpYWxpemVzIHRoZSBQcmVzZW5jZVxuICogQHBhcmFtIHtDaGFubmVsfSBjaGFubmVsIC0gVGhlIENoYW5uZWxcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzIC0gVGhlIG9wdGlvbnMsXG4gKiAgICAgICAgZm9yIGV4YW1wbGUgYHtldmVudHM6IHtzdGF0ZTogXCJzdGF0ZVwiLCBkaWZmOiBcImRpZmZcIn19YFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQcmVzZW5jZSB7XG5cbiAgY29uc3RydWN0b3IoY2hhbm5lbCwgb3B0cyA9IHt9KXtcbiAgICBsZXQgZXZlbnRzID0gb3B0cy5ldmVudHMgfHwge3N0YXRlOiBcInByZXNlbmNlX3N0YXRlXCIsIGRpZmY6IFwicHJlc2VuY2VfZGlmZlwifVxuICAgIHRoaXMuc3RhdGUgPSB7fVxuICAgIHRoaXMucGVuZGluZ0RpZmZzID0gW11cbiAgICB0aGlzLmNoYW5uZWwgPSBjaGFubmVsXG4gICAgdGhpcy5qb2luUmVmID0gbnVsbFxuICAgIHRoaXMuY2FsbGVyID0ge1xuICAgICAgb25Kb2luOiBmdW5jdGlvbiAoKXsgfSxcbiAgICAgIG9uTGVhdmU6IGZ1bmN0aW9uICgpeyB9LFxuICAgICAgb25TeW5jOiBmdW5jdGlvbiAoKXsgfVxuICAgIH1cblxuICAgIHRoaXMuY2hhbm5lbC5vbihldmVudHMuc3RhdGUsIG5ld1N0YXRlID0+IHtcbiAgICAgIGxldCB7b25Kb2luLCBvbkxlYXZlLCBvblN5bmN9ID0gdGhpcy5jYWxsZXJcblxuICAgICAgdGhpcy5qb2luUmVmID0gdGhpcy5jaGFubmVsLmpvaW5SZWYoKVxuICAgICAgdGhpcy5zdGF0ZSA9IFByZXNlbmNlLnN5bmNTdGF0ZSh0aGlzLnN0YXRlLCBuZXdTdGF0ZSwgb25Kb2luLCBvbkxlYXZlKVxuXG4gICAgICB0aGlzLnBlbmRpbmdEaWZmcy5mb3JFYWNoKGRpZmYgPT4ge1xuICAgICAgICB0aGlzLnN0YXRlID0gUHJlc2VuY2Uuc3luY0RpZmYodGhpcy5zdGF0ZSwgZGlmZiwgb25Kb2luLCBvbkxlYXZlKVxuICAgICAgfSlcbiAgICAgIHRoaXMucGVuZGluZ0RpZmZzID0gW11cbiAgICAgIG9uU3luYygpXG4gICAgfSlcblxuICAgIHRoaXMuY2hhbm5lbC5vbihldmVudHMuZGlmZiwgZGlmZiA9PiB7XG4gICAgICBsZXQge29uSm9pbiwgb25MZWF2ZSwgb25TeW5jfSA9IHRoaXMuY2FsbGVyXG5cbiAgICAgIGlmKHRoaXMuaW5QZW5kaW5nU3luY1N0YXRlKCkpe1xuICAgICAgICB0aGlzLnBlbmRpbmdEaWZmcy5wdXNoKGRpZmYpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0YXRlID0gUHJlc2VuY2Uuc3luY0RpZmYodGhpcy5zdGF0ZSwgZGlmZiwgb25Kb2luLCBvbkxlYXZlKVxuICAgICAgICBvblN5bmMoKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBvbkpvaW4oY2FsbGJhY2speyB0aGlzLmNhbGxlci5vbkpvaW4gPSBjYWxsYmFjayB9XG5cbiAgb25MZWF2ZShjYWxsYmFjayl7IHRoaXMuY2FsbGVyLm9uTGVhdmUgPSBjYWxsYmFjayB9XG5cbiAgb25TeW5jKGNhbGxiYWNrKXsgdGhpcy5jYWxsZXIub25TeW5jID0gY2FsbGJhY2sgfVxuXG4gIGxpc3QoYnkpeyByZXR1cm4gUHJlc2VuY2UubGlzdCh0aGlzLnN0YXRlLCBieSkgfVxuXG4gIGluUGVuZGluZ1N5bmNTdGF0ZSgpe1xuICAgIHJldHVybiAhdGhpcy5qb2luUmVmIHx8ICh0aGlzLmpvaW5SZWYgIT09IHRoaXMuY2hhbm5lbC5qb2luUmVmKCkpXG4gIH1cblxuICAvLyBsb3dlci1sZXZlbCBwdWJsaWMgc3RhdGljIEFQSVxuXG4gIC8qKlxuICAgKiBVc2VkIHRvIHN5bmMgdGhlIGxpc3Qgb2YgcHJlc2VuY2VzIG9uIHRoZSBzZXJ2ZXJcbiAgICogd2l0aCB0aGUgY2xpZW50J3Mgc3RhdGUuIEFuIG9wdGlvbmFsIGBvbkpvaW5gIGFuZCBgb25MZWF2ZWAgY2FsbGJhY2sgY2FuXG4gICAqIGJlIHByb3ZpZGVkIHRvIHJlYWN0IHRvIGNoYW5nZXMgaW4gdGhlIGNsaWVudCdzIGxvY2FsIHByZXNlbmNlcyBhY3Jvc3NcbiAgICogZGlzY29ubmVjdHMgYW5kIHJlY29ubmVjdHMgd2l0aCB0aGUgc2VydmVyLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJlc2VuY2V9XG4gICAqL1xuICBzdGF0aWMgc3luY1N0YXRlKGN1cnJlbnRTdGF0ZSwgbmV3U3RhdGUsIG9uSm9pbiwgb25MZWF2ZSl7XG4gICAgbGV0IHN0YXRlID0gdGhpcy5jbG9uZShjdXJyZW50U3RhdGUpXG4gICAgbGV0IGpvaW5zID0ge31cbiAgICBsZXQgbGVhdmVzID0ge31cblxuICAgIHRoaXMubWFwKHN0YXRlLCAoa2V5LCBwcmVzZW5jZSkgPT4ge1xuICAgICAgaWYoIW5ld1N0YXRlW2tleV0pe1xuICAgICAgICBsZWF2ZXNba2V5XSA9IHByZXNlbmNlXG4gICAgICB9XG4gICAgfSlcbiAgICB0aGlzLm1hcChuZXdTdGF0ZSwgKGtleSwgbmV3UHJlc2VuY2UpID0+IHtcbiAgICAgIGxldCBjdXJyZW50UHJlc2VuY2UgPSBzdGF0ZVtrZXldXG4gICAgICBpZihjdXJyZW50UHJlc2VuY2Upe1xuICAgICAgICBsZXQgbmV3UmVmcyA9IG5ld1ByZXNlbmNlLm1ldGFzLm1hcChtID0+IG0ucGh4X3JlZilcbiAgICAgICAgbGV0IGN1clJlZnMgPSBjdXJyZW50UHJlc2VuY2UubWV0YXMubWFwKG0gPT4gbS5waHhfcmVmKVxuICAgICAgICBsZXQgam9pbmVkTWV0YXMgPSBuZXdQcmVzZW5jZS5tZXRhcy5maWx0ZXIobSA9PiBjdXJSZWZzLmluZGV4T2YobS5waHhfcmVmKSA8IDApXG4gICAgICAgIGxldCBsZWZ0TWV0YXMgPSBjdXJyZW50UHJlc2VuY2UubWV0YXMuZmlsdGVyKG0gPT4gbmV3UmVmcy5pbmRleE9mKG0ucGh4X3JlZikgPCAwKVxuICAgICAgICBpZihqb2luZWRNZXRhcy5sZW5ndGggPiAwKXtcbiAgICAgICAgICBqb2luc1trZXldID0gbmV3UHJlc2VuY2VcbiAgICAgICAgICBqb2luc1trZXldLm1ldGFzID0gam9pbmVkTWV0YXNcbiAgICAgICAgfVxuICAgICAgICBpZihsZWZ0TWV0YXMubGVuZ3RoID4gMCl7XG4gICAgICAgICAgbGVhdmVzW2tleV0gPSB0aGlzLmNsb25lKGN1cnJlbnRQcmVzZW5jZSlcbiAgICAgICAgICBsZWF2ZXNba2V5XS5tZXRhcyA9IGxlZnRNZXRhc1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBqb2luc1trZXldID0gbmV3UHJlc2VuY2VcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiB0aGlzLnN5bmNEaWZmKHN0YXRlLCB7am9pbnM6IGpvaW5zLCBsZWF2ZXM6IGxlYXZlc30sIG9uSm9pbiwgb25MZWF2ZSlcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBVc2VkIHRvIHN5bmMgYSBkaWZmIG9mIHByZXNlbmNlIGpvaW4gYW5kIGxlYXZlXG4gICAqIGV2ZW50cyBmcm9tIHRoZSBzZXJ2ZXIsIGFzIHRoZXkgaGFwcGVuLiBMaWtlIGBzeW5jU3RhdGVgLCBgc3luY0RpZmZgXG4gICAqIGFjY2VwdHMgb3B0aW9uYWwgYG9uSm9pbmAgYW5kIGBvbkxlYXZlYCBjYWxsYmFja3MgdG8gcmVhY3QgdG8gYSB1c2VyXG4gICAqIGpvaW5pbmcgb3IgbGVhdmluZyBmcm9tIGEgZGV2aWNlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJlc2VuY2V9XG4gICAqL1xuICBzdGF0aWMgc3luY0RpZmYoc3RhdGUsIGRpZmYsIG9uSm9pbiwgb25MZWF2ZSl7XG4gICAgbGV0IHtqb2lucywgbGVhdmVzfSA9IHRoaXMuY2xvbmUoZGlmZilcbiAgICBpZighb25Kb2luKXsgb25Kb2luID0gZnVuY3Rpb24gKCl7IH0gfVxuICAgIGlmKCFvbkxlYXZlKXsgb25MZWF2ZSA9IGZ1bmN0aW9uICgpeyB9IH1cblxuICAgIHRoaXMubWFwKGpvaW5zLCAoa2V5LCBuZXdQcmVzZW5jZSkgPT4ge1xuICAgICAgbGV0IGN1cnJlbnRQcmVzZW5jZSA9IHN0YXRlW2tleV1cbiAgICAgIHN0YXRlW2tleV0gPSB0aGlzLmNsb25lKG5ld1ByZXNlbmNlKVxuICAgICAgaWYoY3VycmVudFByZXNlbmNlKXtcbiAgICAgICAgbGV0IGpvaW5lZFJlZnMgPSBzdGF0ZVtrZXldLm1ldGFzLm1hcChtID0+IG0ucGh4X3JlZilcbiAgICAgICAgbGV0IGN1ck1ldGFzID0gY3VycmVudFByZXNlbmNlLm1ldGFzLmZpbHRlcihtID0+IGpvaW5lZFJlZnMuaW5kZXhPZihtLnBoeF9yZWYpIDwgMClcbiAgICAgICAgc3RhdGVba2V5XS5tZXRhcy51bnNoaWZ0KC4uLmN1ck1ldGFzKVxuICAgICAgfVxuICAgICAgb25Kb2luKGtleSwgY3VycmVudFByZXNlbmNlLCBuZXdQcmVzZW5jZSlcbiAgICB9KVxuICAgIHRoaXMubWFwKGxlYXZlcywgKGtleSwgbGVmdFByZXNlbmNlKSA9PiB7XG4gICAgICBsZXQgY3VycmVudFByZXNlbmNlID0gc3RhdGVba2V5XVxuICAgICAgaWYoIWN1cnJlbnRQcmVzZW5jZSl7IHJldHVybiB9XG4gICAgICBsZXQgcmVmc1RvUmVtb3ZlID0gbGVmdFByZXNlbmNlLm1ldGFzLm1hcChtID0+IG0ucGh4X3JlZilcbiAgICAgIGN1cnJlbnRQcmVzZW5jZS5tZXRhcyA9IGN1cnJlbnRQcmVzZW5jZS5tZXRhcy5maWx0ZXIocCA9PiB7XG4gICAgICAgIHJldHVybiByZWZzVG9SZW1vdmUuaW5kZXhPZihwLnBoeF9yZWYpIDwgMFxuICAgICAgfSlcbiAgICAgIG9uTGVhdmUoa2V5LCBjdXJyZW50UHJlc2VuY2UsIGxlZnRQcmVzZW5jZSlcbiAgICAgIGlmKGN1cnJlbnRQcmVzZW5jZS5tZXRhcy5sZW5ndGggPT09IDApe1xuICAgICAgICBkZWxldGUgc3RhdGVba2V5XVxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIHN0YXRlXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJlc2VuY2VzLCB3aXRoIHNlbGVjdGVkIG1ldGFkYXRhLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcHJlc2VuY2VzXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNob29zZXJcbiAgICpcbiAgICogQHJldHVybnMge1ByZXNlbmNlfVxuICAgKi9cbiAgc3RhdGljIGxpc3QocHJlc2VuY2VzLCBjaG9vc2VyKXtcbiAgICBpZighY2hvb3Nlcil7IGNob29zZXIgPSBmdW5jdGlvbiAoa2V5LCBwcmVzKXsgcmV0dXJuIHByZXMgfSB9XG5cbiAgICByZXR1cm4gdGhpcy5tYXAocHJlc2VuY2VzLCAoa2V5LCBwcmVzZW5jZSkgPT4ge1xuICAgICAgcmV0dXJuIGNob29zZXIoa2V5LCBwcmVzZW5jZSlcbiAgICB9KVxuICB9XG5cbiAgLy8gcHJpdmF0ZVxuXG4gIHN0YXRpYyBtYXAob2JqLCBmdW5jKXtcbiAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMob2JqKS5tYXAoa2V5ID0+IGZ1bmMoa2V5LCBvYmpba2V5XSkpXG4gIH1cblxuICBzdGF0aWMgY2xvbmUob2JqKXsgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkob2JqKSkgfVxufVxuIiwgIi8qIFRoZSBkZWZhdWx0IHNlcmlhbGl6ZXIgZm9yIGVuY29kaW5nIGFuZCBkZWNvZGluZyBtZXNzYWdlcyAqL1xuaW1wb3J0IHtcbiAgQ0hBTk5FTF9FVkVOVFNcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuZXhwb3J0IGRlZmF1bHQge1xuICBIRUFERVJfTEVOR1RIOiAxLFxuICBNRVRBX0xFTkdUSDogNCxcbiAgS0lORFM6IHtwdXNoOiAwLCByZXBseTogMSwgYnJvYWRjYXN0OiAyfSxcblxuICBlbmNvZGUobXNnLCBjYWxsYmFjayl7XG4gICAgaWYobXNnLnBheWxvYWQuY29uc3RydWN0b3IgPT09IEFycmF5QnVmZmVyKXtcbiAgICAgIHJldHVybiBjYWxsYmFjayh0aGlzLmJpbmFyeUVuY29kZShtc2cpKVxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgcGF5bG9hZCA9IFttc2cuam9pbl9yZWYsIG1zZy5yZWYsIG1zZy50b3BpYywgbXNnLmV2ZW50LCBtc2cucGF5bG9hZF1cbiAgICAgIHJldHVybiBjYWxsYmFjayhKU09OLnN0cmluZ2lmeShwYXlsb2FkKSlcbiAgICB9XG4gIH0sXG5cbiAgZGVjb2RlKHJhd1BheWxvYWQsIGNhbGxiYWNrKXtcbiAgICBpZihyYXdQYXlsb2FkLmNvbnN0cnVjdG9yID09PSBBcnJheUJ1ZmZlcil7XG4gICAgICByZXR1cm4gY2FsbGJhY2sodGhpcy5iaW5hcnlEZWNvZGUocmF3UGF5bG9hZCkpXG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBbam9pbl9yZWYsIHJlZiwgdG9waWMsIGV2ZW50LCBwYXlsb2FkXSA9IEpTT04ucGFyc2UocmF3UGF5bG9hZClcbiAgICAgIHJldHVybiBjYWxsYmFjayh7am9pbl9yZWYsIHJlZiwgdG9waWMsIGV2ZW50LCBwYXlsb2FkfSlcbiAgICB9XG4gIH0sXG5cbiAgLy8gcHJpdmF0ZVxuXG4gIGJpbmFyeUVuY29kZShtZXNzYWdlKXtcbiAgICBsZXQge2pvaW5fcmVmLCByZWYsIGV2ZW50LCB0b3BpYywgcGF5bG9hZH0gPSBtZXNzYWdlXG4gICAgbGV0IG1ldGFMZW5ndGggPSB0aGlzLk1FVEFfTEVOR1RIICsgam9pbl9yZWYubGVuZ3RoICsgcmVmLmxlbmd0aCArIHRvcGljLmxlbmd0aCArIGV2ZW50Lmxlbmd0aFxuICAgIGxldCBoZWFkZXIgPSBuZXcgQXJyYXlCdWZmZXIodGhpcy5IRUFERVJfTEVOR1RIICsgbWV0YUxlbmd0aClcbiAgICBsZXQgdmlldyA9IG5ldyBEYXRhVmlldyhoZWFkZXIpXG4gICAgbGV0IG9mZnNldCA9IDBcblxuICAgIHZpZXcuc2V0VWludDgob2Zmc2V0KyssIHRoaXMuS0lORFMucHVzaCkgLy8ga2luZFxuICAgIHZpZXcuc2V0VWludDgob2Zmc2V0KyssIGpvaW5fcmVmLmxlbmd0aClcbiAgICB2aWV3LnNldFVpbnQ4KG9mZnNldCsrLCByZWYubGVuZ3RoKVxuICAgIHZpZXcuc2V0VWludDgob2Zmc2V0KyssIHRvcGljLmxlbmd0aClcbiAgICB2aWV3LnNldFVpbnQ4KG9mZnNldCsrLCBldmVudC5sZW5ndGgpXG4gICAgQXJyYXkuZnJvbShqb2luX3JlZiwgY2hhciA9PiB2aWV3LnNldFVpbnQ4KG9mZnNldCsrLCBjaGFyLmNoYXJDb2RlQXQoMCkpKVxuICAgIEFycmF5LmZyb20ocmVmLCBjaGFyID0+IHZpZXcuc2V0VWludDgob2Zmc2V0KyssIGNoYXIuY2hhckNvZGVBdCgwKSkpXG4gICAgQXJyYXkuZnJvbSh0b3BpYywgY2hhciA9PiB2aWV3LnNldFVpbnQ4KG9mZnNldCsrLCBjaGFyLmNoYXJDb2RlQXQoMCkpKVxuICAgIEFycmF5LmZyb20oZXZlbnQsIGNoYXIgPT4gdmlldy5zZXRVaW50OChvZmZzZXQrKywgY2hhci5jaGFyQ29kZUF0KDApKSlcblxuICAgIHZhciBjb21iaW5lZCA9IG5ldyBVaW50OEFycmF5KGhlYWRlci5ieXRlTGVuZ3RoICsgcGF5bG9hZC5ieXRlTGVuZ3RoKVxuICAgIGNvbWJpbmVkLnNldChuZXcgVWludDhBcnJheShoZWFkZXIpLCAwKVxuICAgIGNvbWJpbmVkLnNldChuZXcgVWludDhBcnJheShwYXlsb2FkKSwgaGVhZGVyLmJ5dGVMZW5ndGgpXG5cbiAgICByZXR1cm4gY29tYmluZWQuYnVmZmVyXG4gIH0sXG5cbiAgYmluYXJ5RGVjb2RlKGJ1ZmZlcil7XG4gICAgbGV0IHZpZXcgPSBuZXcgRGF0YVZpZXcoYnVmZmVyKVxuICAgIGxldCBraW5kID0gdmlldy5nZXRVaW50OCgwKVxuICAgIGxldCBkZWNvZGVyID0gbmV3IFRleHREZWNvZGVyKClcbiAgICBzd2l0Y2goa2luZCl7XG4gICAgICBjYXNlIHRoaXMuS0lORFMucHVzaDogcmV0dXJuIHRoaXMuZGVjb2RlUHVzaChidWZmZXIsIHZpZXcsIGRlY29kZXIpXG4gICAgICBjYXNlIHRoaXMuS0lORFMucmVwbHk6IHJldHVybiB0aGlzLmRlY29kZVJlcGx5KGJ1ZmZlciwgdmlldywgZGVjb2RlcilcbiAgICAgIGNhc2UgdGhpcy5LSU5EUy5icm9hZGNhc3Q6IHJldHVybiB0aGlzLmRlY29kZUJyb2FkY2FzdChidWZmZXIsIHZpZXcsIGRlY29kZXIpXG4gICAgfVxuICB9LFxuXG4gIGRlY29kZVB1c2goYnVmZmVyLCB2aWV3LCBkZWNvZGVyKXtcbiAgICBsZXQgam9pblJlZlNpemUgPSB2aWV3LmdldFVpbnQ4KDEpXG4gICAgbGV0IHRvcGljU2l6ZSA9IHZpZXcuZ2V0VWludDgoMilcbiAgICBsZXQgZXZlbnRTaXplID0gdmlldy5nZXRVaW50OCgzKVxuICAgIGxldCBvZmZzZXQgPSB0aGlzLkhFQURFUl9MRU5HVEggKyB0aGlzLk1FVEFfTEVOR1RIIC0gMSAvLyBwdXNoZXMgaGF2ZSBubyByZWZcbiAgICBsZXQgam9pblJlZiA9IGRlY29kZXIuZGVjb2RlKGJ1ZmZlci5zbGljZShvZmZzZXQsIG9mZnNldCArIGpvaW5SZWZTaXplKSlcbiAgICBvZmZzZXQgPSBvZmZzZXQgKyBqb2luUmVmU2l6ZVxuICAgIGxldCB0b3BpYyA9IGRlY29kZXIuZGVjb2RlKGJ1ZmZlci5zbGljZShvZmZzZXQsIG9mZnNldCArIHRvcGljU2l6ZSkpXG4gICAgb2Zmc2V0ID0gb2Zmc2V0ICsgdG9waWNTaXplXG4gICAgbGV0IGV2ZW50ID0gZGVjb2Rlci5kZWNvZGUoYnVmZmVyLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgZXZlbnRTaXplKSlcbiAgICBvZmZzZXQgPSBvZmZzZXQgKyBldmVudFNpemVcbiAgICBsZXQgZGF0YSA9IGJ1ZmZlci5zbGljZShvZmZzZXQsIGJ1ZmZlci5ieXRlTGVuZ3RoKVxuICAgIHJldHVybiB7am9pbl9yZWY6IGpvaW5SZWYsIHJlZjogbnVsbCwgdG9waWM6IHRvcGljLCBldmVudDogZXZlbnQsIHBheWxvYWQ6IGRhdGF9XG4gIH0sXG5cbiAgZGVjb2RlUmVwbHkoYnVmZmVyLCB2aWV3LCBkZWNvZGVyKXtcbiAgICBsZXQgam9pblJlZlNpemUgPSB2aWV3LmdldFVpbnQ4KDEpXG4gICAgbGV0IHJlZlNpemUgPSB2aWV3LmdldFVpbnQ4KDIpXG4gICAgbGV0IHRvcGljU2l6ZSA9IHZpZXcuZ2V0VWludDgoMylcbiAgICBsZXQgZXZlbnRTaXplID0gdmlldy5nZXRVaW50OCg0KVxuICAgIGxldCBvZmZzZXQgPSB0aGlzLkhFQURFUl9MRU5HVEggKyB0aGlzLk1FVEFfTEVOR1RIXG4gICAgbGV0IGpvaW5SZWYgPSBkZWNvZGVyLmRlY29kZShidWZmZXIuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyBqb2luUmVmU2l6ZSkpXG4gICAgb2Zmc2V0ID0gb2Zmc2V0ICsgam9pblJlZlNpemVcbiAgICBsZXQgcmVmID0gZGVjb2Rlci5kZWNvZGUoYnVmZmVyLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgcmVmU2l6ZSkpXG4gICAgb2Zmc2V0ID0gb2Zmc2V0ICsgcmVmU2l6ZVxuICAgIGxldCB0b3BpYyA9IGRlY29kZXIuZGVjb2RlKGJ1ZmZlci5zbGljZShvZmZzZXQsIG9mZnNldCArIHRvcGljU2l6ZSkpXG4gICAgb2Zmc2V0ID0gb2Zmc2V0ICsgdG9waWNTaXplXG4gICAgbGV0IGV2ZW50ID0gZGVjb2Rlci5kZWNvZGUoYnVmZmVyLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgZXZlbnRTaXplKSlcbiAgICBvZmZzZXQgPSBvZmZzZXQgKyBldmVudFNpemVcbiAgICBsZXQgZGF0YSA9IGJ1ZmZlci5zbGljZShvZmZzZXQsIGJ1ZmZlci5ieXRlTGVuZ3RoKVxuICAgIGxldCBwYXlsb2FkID0ge3N0YXR1czogZXZlbnQsIHJlc3BvbnNlOiBkYXRhfVxuICAgIHJldHVybiB7am9pbl9yZWY6IGpvaW5SZWYsIHJlZjogcmVmLCB0b3BpYzogdG9waWMsIGV2ZW50OiBDSEFOTkVMX0VWRU5UUy5yZXBseSwgcGF5bG9hZDogcGF5bG9hZH1cbiAgfSxcblxuICBkZWNvZGVCcm9hZGNhc3QoYnVmZmVyLCB2aWV3LCBkZWNvZGVyKXtcbiAgICBsZXQgdG9waWNTaXplID0gdmlldy5nZXRVaW50OCgxKVxuICAgIGxldCBldmVudFNpemUgPSB2aWV3LmdldFVpbnQ4KDIpXG4gICAgbGV0IG9mZnNldCA9IHRoaXMuSEVBREVSX0xFTkdUSCArIDJcbiAgICBsZXQgdG9waWMgPSBkZWNvZGVyLmRlY29kZShidWZmZXIuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyB0b3BpY1NpemUpKVxuICAgIG9mZnNldCA9IG9mZnNldCArIHRvcGljU2l6ZVxuICAgIGxldCBldmVudCA9IGRlY29kZXIuZGVjb2RlKGJ1ZmZlci5zbGljZShvZmZzZXQsIG9mZnNldCArIGV2ZW50U2l6ZSkpXG4gICAgb2Zmc2V0ID0gb2Zmc2V0ICsgZXZlbnRTaXplXG4gICAgbGV0IGRhdGEgPSBidWZmZXIuc2xpY2Uob2Zmc2V0LCBidWZmZXIuYnl0ZUxlbmd0aClcblxuICAgIHJldHVybiB7am9pbl9yZWY6IG51bGwsIHJlZjogbnVsbCwgdG9waWM6IHRvcGljLCBldmVudDogZXZlbnQsIHBheWxvYWQ6IGRhdGF9XG4gIH1cbn1cbiIsICJpbXBvcnQge1xuICBnbG9iYWwsXG4gIHBoeFdpbmRvdyxcbiAgQ0hBTk5FTF9FVkVOVFMsXG4gIERFRkFVTFRfVElNRU9VVCxcbiAgREVGQVVMVF9WU04sXG4gIFNPQ0tFVF9TVEFURVMsXG4gIFRSQU5TUE9SVFMsXG4gIFdTX0NMT1NFX05PUk1BTFxufSBmcm9tIFwiLi9jb25zdGFudHNcIlxuXG5pbXBvcnQge1xuICBjbG9zdXJlXG59IGZyb20gXCIuL3V0aWxzXCJcblxuaW1wb3J0IEFqYXggZnJvbSBcIi4vYWpheFwiXG5pbXBvcnQgQ2hhbm5lbCBmcm9tIFwiLi9jaGFubmVsXCJcbmltcG9ydCBMb25nUG9sbCBmcm9tIFwiLi9sb25ncG9sbFwiXG5pbXBvcnQgU2VyaWFsaXplciBmcm9tIFwiLi9zZXJpYWxpemVyXCJcbmltcG9ydCBUaW1lciBmcm9tIFwiLi90aW1lclwiXG5cbi8qKiBJbml0aWFsaXplcyB0aGUgU29ja2V0ICpcbiAqXG4gKiBGb3IgSUU4IHN1cHBvcnQgdXNlIGFuIEVTNS1zaGltIChodHRwczovL2dpdGh1Yi5jb20vZXMtc2hpbXMvZXM1LXNoaW0pXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGVuZFBvaW50IC0gVGhlIHN0cmluZyBXZWJTb2NrZXQgZW5kcG9pbnQsIGllLCBgXCJ3czovL2V4YW1wbGUuY29tL3NvY2tldFwiYCxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgXCJ3c3M6Ly9leGFtcGxlLmNvbVwiYFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBcIi9zb2NrZXRcImAgKGluaGVyaXRlZCBob3N0ICYgcHJvdG9jb2wpXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdHNdIC0gT3B0aW9uYWwgY29uZmlndXJhdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdHMudHJhbnNwb3J0XSAtIFRoZSBXZWJzb2NrZXQgVHJhbnNwb3J0LCBmb3IgZXhhbXBsZSBXZWJTb2NrZXQgb3IgUGhvZW5peC5Mb25nUG9sbC5cbiAqXG4gKiBEZWZhdWx0cyB0byBXZWJTb2NrZXQgd2l0aCBhdXRvbWF0aWMgTG9uZ1BvbGwgZmFsbGJhY2sgaWYgV2ViU29ja2V0IGlzIG5vdCBkZWZpbmVkLlxuICogVG8gZmFsbGJhY2sgdG8gTG9uZ1BvbGwgd2hlbiBXZWJTb2NrZXQgYXR0ZW1wdHMgZmFpbCwgdXNlIGBsb25nUG9sbEZhbGxiYWNrTXM6IDI1MDBgLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRzLmxvbmdQb2xsRmFsbGJhY2tNc10gLSBUaGUgbWlsbGlzZWNvbmQgdGltZSB0byBhdHRlbXB0IHRoZSBwcmltYXJ5IHRyYW5zcG9ydFxuICogYmVmb3JlIGZhbGxpbmcgYmFjayB0byB0aGUgTG9uZ1BvbGwgdHJhbnNwb3J0LiBEaXNhYmxlZCBieSBkZWZhdWx0LlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRzLmRlYnVnXSAtIFdoZW4gdHJ1ZSwgZW5hYmxlcyBkZWJ1ZyBsb2dnaW5nLiBEZWZhdWx0IGZhbHNlLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRzLmVuY29kZV0gLSBUaGUgZnVuY3Rpb24gdG8gZW5jb2RlIG91dGdvaW5nIG1lc3NhZ2VzLlxuICpcbiAqIERlZmF1bHRzIHRvIEpTT04gZW5jb2Rlci5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0cy5kZWNvZGVdIC0gVGhlIGZ1bmN0aW9uIHRvIGRlY29kZSBpbmNvbWluZyBtZXNzYWdlcy5cbiAqXG4gKiBEZWZhdWx0cyB0byBKU09OOlxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIChwYXlsb2FkLCBjYWxsYmFjaykgPT4gY2FsbGJhY2soSlNPTi5wYXJzZShwYXlsb2FkKSlcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0cy50aW1lb3V0XSAtIFRoZSBkZWZhdWx0IHRpbWVvdXQgaW4gbWlsbGlzZWNvbmRzIHRvIHRyaWdnZXIgcHVzaCB0aW1lb3V0cy5cbiAqXG4gKiBEZWZhdWx0cyBgREVGQVVMVF9USU1FT1VUYFxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRzLmhlYXJ0YmVhdEludGVydmFsTXNdIC0gVGhlIG1pbGxpc2VjIGludGVydmFsIHRvIHNlbmQgYSBoZWFydGJlYXQgbWVzc2FnZVxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRzLnJlY29ubmVjdEFmdGVyTXNdIC0gVGhlIG9wdGlvbmFsIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgbWlsbGlzZWNcbiAqIHNvY2tldCByZWNvbm5lY3QgaW50ZXJ2YWwuXG4gKlxuICogRGVmYXVsdHMgdG8gc3RlcHBlZCBiYWNrb2ZmIG9mOlxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGZ1bmN0aW9uKHRyaWVzKXtcbiAqICAgcmV0dXJuIFsxMCwgNTAsIDEwMCwgMTUwLCAyMDAsIDI1MCwgNTAwLCAxMDAwLCAyMDAwXVt0cmllcyAtIDFdIHx8IDUwMDBcbiAqIH1cbiAqIGBgYGBcbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gW29wdHMucmVqb2luQWZ0ZXJNc10gLSBUaGUgb3B0aW9uYWwgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBtaWxsaXNlY1xuICogcmVqb2luIGludGVydmFsIGZvciBpbmRpdmlkdWFsIGNoYW5uZWxzLlxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGZ1bmN0aW9uKHRyaWVzKXtcbiAqICAgcmV0dXJuIFsxMDAwLCAyMDAwLCA1MDAwXVt0cmllcyAtIDFdIHx8IDEwMDAwXG4gKiB9XG4gKiBgYGBgXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdHMubG9nZ2VyXSAtIFRoZSBvcHRpb25hbCBmdW5jdGlvbiBmb3Igc3BlY2lhbGl6ZWQgbG9nZ2luZywgaWU6XG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogZnVuY3Rpb24oa2luZCwgbXNnLCBkYXRhKSB7XG4gKiAgIGNvbnNvbGUubG9nKGAke2tpbmR9OiAke21zZ31gLCBkYXRhKVxuICogfVxuICogYGBgXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRzLmxvbmdwb2xsZXJUaW1lb3V0XSAtIFRoZSBtYXhpbXVtIHRpbWVvdXQgb2YgYSBsb25nIHBvbGwgQUpBWCByZXF1ZXN0LlxuICpcbiAqIERlZmF1bHRzIHRvIDIwcyAoZG91YmxlIHRoZSBzZXJ2ZXIgbG9uZyBwb2xsIHRpbWVyKS5cbiAqXG4gKiBAcGFyYW0geyhPYmplY3R8ZnVuY3Rpb24pfSBbb3B0cy5wYXJhbXNdIC0gVGhlIG9wdGlvbmFsIHBhcmFtcyB0byBwYXNzIHdoZW4gY29ubmVjdGluZ1xuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRzLmJpbmFyeVR5cGVdIC0gVGhlIGJpbmFyeSB0eXBlIHRvIHVzZSBmb3IgYmluYXJ5IFdlYlNvY2tldCBmcmFtZXMuXG4gKlxuICogRGVmYXVsdHMgdG8gXCJhcnJheWJ1ZmZlclwiXG4gKlxuICogQHBhcmFtIHt2c259IFtvcHRzLnZzbl0gLSBUaGUgc2VyaWFsaXplcidzIHByb3RvY29sIHZlcnNpb24gdG8gc2VuZCBvbiBjb25uZWN0LlxuICpcbiAqIERlZmF1bHRzIHRvIERFRkFVTFRfVlNOLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0cy5zZXNzaW9uU3RvcmFnZV0gLSBBbiBvcHRpb25hbCBTdG9yYWdlIGNvbXBhdGlibGUgb2JqZWN0XG4gKiBQaG9lbml4IHVzZXMgc2Vzc2lvblN0b3JhZ2UgZm9yIGxvbmdwb2xsIGZhbGxiYWNrIGhpc3RvcnkuIE92ZXJyaWRpbmcgdGhlIHN0b3JlIGlzXG4gKiB1c2VmdWwgd2hlbiBQaG9lbml4IHdvbid0IGhhdmUgYWNjZXNzIHRvIGBzZXNzaW9uU3RvcmFnZWAuIEZvciBleGFtcGxlLCBUaGlzIGNvdWxkXG4gKiBoYXBwZW4gaWYgYSBzaXRlIGxvYWRzIGEgY3Jvc3MtZG9tYWluIGNoYW5uZWwgaW4gYW4gaWZyYW1lLiBFeGFtcGxlIHVzYWdlOlxuICpcbiAqICAgICBjbGFzcyBJbk1lbW9yeVN0b3JhZ2Uge1xuICogICAgICAgY29uc3RydWN0b3IoKSB7IHRoaXMuc3RvcmFnZSA9IHt9IH1cbiAqICAgICAgIGdldEl0ZW0oa2V5TmFtZSkgeyByZXR1cm4gdGhpcy5zdG9yYWdlW2tleU5hbWVdIHx8IG51bGwgfVxuICogICAgICAgcmVtb3ZlSXRlbShrZXlOYW1lKSB7IGRlbGV0ZSB0aGlzLnN0b3JhZ2Vba2V5TmFtZV0gfVxuICogICAgICAgc2V0SXRlbShrZXlOYW1lLCBrZXlWYWx1ZSkgeyB0aGlzLnN0b3JhZ2Vba2V5TmFtZV0gPSBrZXlWYWx1ZSB9XG4gKiAgICAgfVxuICpcbiovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTb2NrZXQge1xuICBjb25zdHJ1Y3RvcihlbmRQb2ludCwgb3B0cyA9IHt9KXtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzID0ge29wZW46IFtdLCBjbG9zZTogW10sIGVycm9yOiBbXSwgbWVzc2FnZTogW119XG4gICAgdGhpcy5jaGFubmVscyA9IFtdXG4gICAgdGhpcy5zZW5kQnVmZmVyID0gW11cbiAgICB0aGlzLnJlZiA9IDBcbiAgICB0aGlzLnRpbWVvdXQgPSBvcHRzLnRpbWVvdXQgfHwgREVGQVVMVF9USU1FT1VUXG4gICAgdGhpcy50cmFuc3BvcnQgPSBvcHRzLnRyYW5zcG9ydCB8fCBnbG9iYWwuV2ViU29ja2V0IHx8IExvbmdQb2xsXG4gICAgdGhpcy5wcmltYXJ5UGFzc2VkSGVhbHRoQ2hlY2sgPSBmYWxzZVxuICAgIHRoaXMubG9uZ1BvbGxGYWxsYmFja01zID0gb3B0cy5sb25nUG9sbEZhbGxiYWNrTXNcbiAgICB0aGlzLmZhbGxiYWNrVGltZXIgPSBudWxsXG4gICAgdGhpcy5zZXNzaW9uU3RvcmUgPSBvcHRzLnNlc3Npb25TdG9yYWdlIHx8IChnbG9iYWwgJiYgZ2xvYmFsLnNlc3Npb25TdG9yYWdlKVxuICAgIHRoaXMuZXN0YWJsaXNoZWRDb25uZWN0aW9ucyA9IDBcbiAgICB0aGlzLmRlZmF1bHRFbmNvZGVyID0gU2VyaWFsaXplci5lbmNvZGUuYmluZChTZXJpYWxpemVyKVxuICAgIHRoaXMuZGVmYXVsdERlY29kZXIgPSBTZXJpYWxpemVyLmRlY29kZS5iaW5kKFNlcmlhbGl6ZXIpXG4gICAgdGhpcy5jbG9zZVdhc0NsZWFuID0gZmFsc2VcbiAgICB0aGlzLmRpc2Nvbm5lY3RpbmcgPSBmYWxzZVxuICAgIHRoaXMuYmluYXJ5VHlwZSA9IG9wdHMuYmluYXJ5VHlwZSB8fCBcImFycmF5YnVmZmVyXCJcbiAgICB0aGlzLmNvbm5lY3RDbG9jayA9IDFcbiAgICBpZih0aGlzLnRyYW5zcG9ydCAhPT0gTG9uZ1BvbGwpe1xuICAgICAgdGhpcy5lbmNvZGUgPSBvcHRzLmVuY29kZSB8fCB0aGlzLmRlZmF1bHRFbmNvZGVyXG4gICAgICB0aGlzLmRlY29kZSA9IG9wdHMuZGVjb2RlIHx8IHRoaXMuZGVmYXVsdERlY29kZXJcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbmNvZGUgPSB0aGlzLmRlZmF1bHRFbmNvZGVyXG4gICAgICB0aGlzLmRlY29kZSA9IHRoaXMuZGVmYXVsdERlY29kZXJcbiAgICB9XG4gICAgbGV0IGF3YWl0aW5nQ29ubmVjdGlvbk9uUGFnZVNob3cgPSBudWxsXG4gICAgaWYocGh4V2luZG93ICYmIHBoeFdpbmRvdy5hZGRFdmVudExpc3RlbmVyKXtcbiAgICAgIHBoeFdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicGFnZWhpZGVcIiwgX2UgPT4ge1xuICAgICAgICBpZih0aGlzLmNvbm4pe1xuICAgICAgICAgIHRoaXMuZGlzY29ubmVjdCgpXG4gICAgICAgICAgYXdhaXRpbmdDb25uZWN0aW9uT25QYWdlU2hvdyA9IHRoaXMuY29ubmVjdENsb2NrXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICBwaHhXaW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInBhZ2VzaG93XCIsIF9lID0+IHtcbiAgICAgICAgaWYoYXdhaXRpbmdDb25uZWN0aW9uT25QYWdlU2hvdyA9PT0gdGhpcy5jb25uZWN0Q2xvY2spe1xuICAgICAgICAgIGF3YWl0aW5nQ29ubmVjdGlvbk9uUGFnZVNob3cgPSBudWxsXG4gICAgICAgICAgdGhpcy5jb25uZWN0KClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gICAgdGhpcy5oZWFydGJlYXRJbnRlcnZhbE1zID0gb3B0cy5oZWFydGJlYXRJbnRlcnZhbE1zIHx8IDMwMDAwXG4gICAgdGhpcy5yZWpvaW5BZnRlck1zID0gKHRyaWVzKSA9PiB7XG4gICAgICBpZihvcHRzLnJlam9pbkFmdGVyTXMpe1xuICAgICAgICByZXR1cm4gb3B0cy5yZWpvaW5BZnRlck1zKHRyaWVzKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFsxMDAwLCAyMDAwLCA1MDAwXVt0cmllcyAtIDFdIHx8IDEwMDAwXG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMucmVjb25uZWN0QWZ0ZXJNcyA9ICh0cmllcykgPT4ge1xuICAgICAgaWYob3B0cy5yZWNvbm5lY3RBZnRlck1zKXtcbiAgICAgICAgcmV0dXJuIG9wdHMucmVjb25uZWN0QWZ0ZXJNcyh0cmllcylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBbMTAsIDUwLCAxMDAsIDE1MCwgMjAwLCAyNTAsIDUwMCwgMTAwMCwgMjAwMF1bdHJpZXMgLSAxXSB8fCA1MDAwXG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMubG9nZ2VyID0gb3B0cy5sb2dnZXIgfHwgbnVsbFxuICAgIGlmKCF0aGlzLmxvZ2dlciAmJiBvcHRzLmRlYnVnKXtcbiAgICAgIHRoaXMubG9nZ2VyID0gKGtpbmQsIG1zZywgZGF0YSkgPT4geyBjb25zb2xlLmxvZyhgJHtraW5kfTogJHttc2d9YCwgZGF0YSkgfVxuICAgIH1cbiAgICB0aGlzLmxvbmdwb2xsZXJUaW1lb3V0ID0gb3B0cy5sb25ncG9sbGVyVGltZW91dCB8fCAyMDAwMFxuICAgIHRoaXMucGFyYW1zID0gY2xvc3VyZShvcHRzLnBhcmFtcyB8fCB7fSlcbiAgICB0aGlzLmVuZFBvaW50ID0gYCR7ZW5kUG9pbnR9LyR7VFJBTlNQT1JUUy53ZWJzb2NrZXR9YFxuICAgIHRoaXMudnNuID0gb3B0cy52c24gfHwgREVGQVVMVF9WU05cbiAgICB0aGlzLmhlYXJ0YmVhdFRpbWVvdXRUaW1lciA9IG51bGxcbiAgICB0aGlzLmhlYXJ0YmVhdFRpbWVyID0gbnVsbFxuICAgIHRoaXMucGVuZGluZ0hlYXJ0YmVhdFJlZiA9IG51bGxcbiAgICB0aGlzLnJlY29ubmVjdFRpbWVyID0gbmV3IFRpbWVyKCgpID0+IHtcbiAgICAgIHRoaXMudGVhcmRvd24oKCkgPT4gdGhpcy5jb25uZWN0KCkpXG4gICAgfSwgdGhpcy5yZWNvbm5lY3RBZnRlck1zKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIExvbmdQb2xsIHRyYW5zcG9ydCByZWZlcmVuY2VcbiAgICovXG4gIGdldExvbmdQb2xsVHJhbnNwb3J0KCl7IHJldHVybiBMb25nUG9sbCB9XG5cbiAgLyoqXG4gICAqIERpc2Nvbm5lY3RzIGFuZCByZXBsYWNlcyB0aGUgYWN0aXZlIHRyYW5zcG9ydFxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBuZXdUcmFuc3BvcnQgLSBUaGUgbmV3IHRyYW5zcG9ydCBjbGFzcyB0byBpbnN0YW50aWF0ZVxuICAgKlxuICAgKi9cbiAgcmVwbGFjZVRyYW5zcG9ydChuZXdUcmFuc3BvcnQpe1xuICAgIHRoaXMuY29ubmVjdENsb2NrKytcbiAgICB0aGlzLmNsb3NlV2FzQ2xlYW4gPSB0cnVlXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuZmFsbGJhY2tUaW1lcilcbiAgICB0aGlzLnJlY29ubmVjdFRpbWVyLnJlc2V0KClcbiAgICBpZih0aGlzLmNvbm4pe1xuICAgICAgdGhpcy5jb25uLmNsb3NlKClcbiAgICAgIHRoaXMuY29ubiA9IG51bGxcbiAgICB9XG4gICAgdGhpcy50cmFuc3BvcnQgPSBuZXdUcmFuc3BvcnRcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBzb2NrZXQgcHJvdG9jb2xcbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG4gIHByb3RvY29sKCl7IHJldHVybiBsb2NhdGlvbi5wcm90b2NvbC5tYXRjaCgvXmh0dHBzLykgPyBcIndzc1wiIDogXCJ3c1wiIH1cblxuICAvKipcbiAgICogVGhlIGZ1bGx5IHF1YWxpZmllZCBzb2NrZXQgdXJsXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuICBlbmRQb2ludFVSTCgpe1xuICAgIGxldCB1cmkgPSBBamF4LmFwcGVuZFBhcmFtcyhcbiAgICAgIEFqYXguYXBwZW5kUGFyYW1zKHRoaXMuZW5kUG9pbnQsIHRoaXMucGFyYW1zKCkpLCB7dnNuOiB0aGlzLnZzbn0pXG4gICAgaWYodXJpLmNoYXJBdCgwKSAhPT0gXCIvXCIpeyByZXR1cm4gdXJpIH1cbiAgICBpZih1cmkuY2hhckF0KDEpID09PSBcIi9cIil7IHJldHVybiBgJHt0aGlzLnByb3RvY29sKCl9OiR7dXJpfWAgfVxuXG4gICAgcmV0dXJuIGAke3RoaXMucHJvdG9jb2woKX06Ly8ke2xvY2F0aW9uLmhvc3R9JHt1cml9YFxuICB9XG5cbiAgLyoqXG4gICAqIERpc2Nvbm5lY3RzIHRoZSBzb2NrZXRcbiAgICpcbiAgICogU2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9DbG9zZUV2ZW50I1N0YXR1c19jb2RlcyBmb3IgdmFsaWQgc3RhdHVzIGNvZGVzLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIE9wdGlvbmFsIGNhbGxiYWNrIHdoaWNoIGlzIGNhbGxlZCBhZnRlciBzb2NrZXQgaXMgZGlzY29ubmVjdGVkLlxuICAgKiBAcGFyYW0ge2ludGVnZXJ9IGNvZGUgLSBBIHN0YXR1cyBjb2RlIGZvciBkaXNjb25uZWN0aW9uIChPcHRpb25hbCkuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSByZWFzb24gLSBBIHRleHR1YWwgZGVzY3JpcHRpb24gb2YgdGhlIHJlYXNvbiB0byBkaXNjb25uZWN0LiAoT3B0aW9uYWwpXG4gICAqL1xuICBkaXNjb25uZWN0KGNhbGxiYWNrLCBjb2RlLCByZWFzb24pe1xuICAgIHRoaXMuY29ubmVjdENsb2NrKytcbiAgICB0aGlzLmRpc2Nvbm5lY3RpbmcgPSB0cnVlXG4gICAgdGhpcy5jbG9zZVdhc0NsZWFuID0gdHJ1ZVxuICAgIGNsZWFyVGltZW91dCh0aGlzLmZhbGxiYWNrVGltZXIpXG4gICAgdGhpcy5yZWNvbm5lY3RUaW1lci5yZXNldCgpXG4gICAgdGhpcy50ZWFyZG93bigoKSA9PiB7XG4gICAgICB0aGlzLmRpc2Nvbm5lY3RpbmcgPSBmYWxzZVxuICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soKVxuICAgIH0sIGNvZGUsIHJlYXNvbilcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zIC0gVGhlIHBhcmFtcyB0byBzZW5kIHdoZW4gY29ubmVjdGluZywgZm9yIGV4YW1wbGUgYHt1c2VyX2lkOiB1c2VyVG9rZW59YFxuICAgKlxuICAgKiBQYXNzaW5nIHBhcmFtcyB0byBjb25uZWN0IGlzIGRlcHJlY2F0ZWQ7IHBhc3MgdGhlbSBpbiB0aGUgU29ja2V0IGNvbnN0cnVjdG9yIGluc3RlYWQ6XG4gICAqIGBuZXcgU29ja2V0KFwiL3NvY2tldFwiLCB7cGFyYW1zOiB7dXNlcl9pZDogdXNlclRva2VufX0pYC5cbiAgICovXG4gIGNvbm5lY3QocGFyYW1zKXtcbiAgICBpZihwYXJhbXMpe1xuICAgICAgY29uc29sZSAmJiBjb25zb2xlLmxvZyhcInBhc3NpbmcgcGFyYW1zIHRvIGNvbm5lY3QgaXMgZGVwcmVjYXRlZC4gSW5zdGVhZCBwYXNzIDpwYXJhbXMgdG8gdGhlIFNvY2tldCBjb25zdHJ1Y3RvclwiKVxuICAgICAgdGhpcy5wYXJhbXMgPSBjbG9zdXJlKHBhcmFtcylcbiAgICB9XG4gICAgaWYodGhpcy5jb25uICYmICF0aGlzLmRpc2Nvbm5lY3RpbmcpeyByZXR1cm4gfVxuICAgIGlmKHRoaXMubG9uZ1BvbGxGYWxsYmFja01zICYmIHRoaXMudHJhbnNwb3J0ICE9PSBMb25nUG9sbCl7XG4gICAgICB0aGlzLmNvbm5lY3RXaXRoRmFsbGJhY2soTG9uZ1BvbGwsIHRoaXMubG9uZ1BvbGxGYWxsYmFja01zKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnRyYW5zcG9ydENvbm5lY3QoKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBMb2dzIHRoZSBtZXNzYWdlLiBPdmVycmlkZSBgdGhpcy5sb2dnZXJgIGZvciBzcGVjaWFsaXplZCBsb2dnaW5nLiBub29wcyBieSBkZWZhdWx0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBraW5kXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtc2dcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICovXG4gIGxvZyhraW5kLCBtc2csIGRhdGEpeyB0aGlzLmxvZ2dlciAmJiB0aGlzLmxvZ2dlcihraW5kLCBtc2csIGRhdGEpIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIGEgbG9nZ2VyIGhhcyBiZWVuIHNldCBvbiB0aGlzIHNvY2tldC5cbiAgICovXG4gIGhhc0xvZ2dlcigpeyByZXR1cm4gdGhpcy5sb2dnZXIgIT09IG51bGwgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgY2FsbGJhY2tzIGZvciBjb25uZWN0aW9uIG9wZW4gZXZlbnRzXG4gICAqXG4gICAqIEBleGFtcGxlIHNvY2tldC5vbk9wZW4oZnVuY3Rpb24oKXsgY29uc29sZS5pbmZvKFwidGhlIHNvY2tldCB3YXMgb3BlbmVkXCIpIH0pXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAqL1xuICBvbk9wZW4oY2FsbGJhY2spe1xuICAgIGxldCByZWYgPSB0aGlzLm1ha2VSZWYoKVxuICAgIHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3Mub3Blbi5wdXNoKFtyZWYsIGNhbGxiYWNrXSlcbiAgICByZXR1cm4gcmVmXG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGNhbGxiYWNrcyBmb3IgY29ubmVjdGlvbiBjbG9zZSBldmVudHNcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICovXG4gIG9uQ2xvc2UoY2FsbGJhY2spe1xuICAgIGxldCByZWYgPSB0aGlzLm1ha2VSZWYoKVxuICAgIHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3MuY2xvc2UucHVzaChbcmVmLCBjYWxsYmFja10pXG4gICAgcmV0dXJuIHJlZlxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBjYWxsYmFja3MgZm9yIGNvbm5lY3Rpb24gZXJyb3IgZXZlbnRzXG4gICAqXG4gICAqIEBleGFtcGxlIHNvY2tldC5vbkVycm9yKGZ1bmN0aW9uKGVycm9yKXsgYWxlcnQoXCJBbiBlcnJvciBvY2N1cnJlZFwiKSB9KVxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKi9cbiAgb25FcnJvcihjYWxsYmFjayl7XG4gICAgbGV0IHJlZiA9IHRoaXMubWFrZVJlZigpXG4gICAgdGhpcy5zdGF0ZUNoYW5nZUNhbGxiYWNrcy5lcnJvci5wdXNoKFtyZWYsIGNhbGxiYWNrXSlcbiAgICByZXR1cm4gcmVmXG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGNhbGxiYWNrcyBmb3IgY29ubmVjdGlvbiBtZXNzYWdlIGV2ZW50c1xuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKi9cbiAgb25NZXNzYWdlKGNhbGxiYWNrKXtcbiAgICBsZXQgcmVmID0gdGhpcy5tYWtlUmVmKClcbiAgICB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzLm1lc3NhZ2UucHVzaChbcmVmLCBjYWxsYmFja10pXG4gICAgcmV0dXJuIHJlZlxuICB9XG5cbiAgLyoqXG4gICAqIFBpbmdzIHRoZSBzZXJ2ZXIgYW5kIGludm9rZXMgdGhlIGNhbGxiYWNrIHdpdGggdGhlIFJUVCBpbiBtaWxsaXNlY29uZHNcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICpcbiAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBwaW5nIHdhcyBwdXNoZWQgb3IgZmFsc2UgaWYgdW5hYmxlIHRvIGJlIHB1c2hlZC5cbiAgICovXG4gIHBpbmcoY2FsbGJhY2spe1xuICAgIGlmKCF0aGlzLmlzQ29ubmVjdGVkKCkpeyByZXR1cm4gZmFsc2UgfVxuICAgIGxldCByZWYgPSB0aGlzLm1ha2VSZWYoKVxuICAgIGxldCBzdGFydFRpbWUgPSBEYXRlLm5vdygpXG4gICAgdGhpcy5wdXNoKHt0b3BpYzogXCJwaG9lbml4XCIsIGV2ZW50OiBcImhlYXJ0YmVhdFwiLCBwYXlsb2FkOiB7fSwgcmVmOiByZWZ9KVxuICAgIGxldCBvbk1zZ1JlZiA9IHRoaXMub25NZXNzYWdlKG1zZyA9PiB7XG4gICAgICBpZihtc2cucmVmID09PSByZWYpe1xuICAgICAgICB0aGlzLm9mZihbb25Nc2dSZWZdKVxuICAgICAgICBjYWxsYmFjayhEYXRlLm5vdygpIC0gc3RhcnRUaW1lKVxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cblxuICB0cmFuc3BvcnRDb25uZWN0KCl7XG4gICAgdGhpcy5jb25uZWN0Q2xvY2srK1xuICAgIHRoaXMuY2xvc2VXYXNDbGVhbiA9IGZhbHNlXG4gICAgdGhpcy5jb25uID0gbmV3IHRoaXMudHJhbnNwb3J0KHRoaXMuZW5kUG9pbnRVUkwoKSlcbiAgICB0aGlzLmNvbm4uYmluYXJ5VHlwZSA9IHRoaXMuYmluYXJ5VHlwZVxuICAgIHRoaXMuY29ubi50aW1lb3V0ID0gdGhpcy5sb25ncG9sbGVyVGltZW91dFxuICAgIHRoaXMuY29ubi5vbm9wZW4gPSAoKSA9PiB0aGlzLm9uQ29ubk9wZW4oKVxuICAgIHRoaXMuY29ubi5vbmVycm9yID0gZXJyb3IgPT4gdGhpcy5vbkNvbm5FcnJvcihlcnJvcilcbiAgICB0aGlzLmNvbm4ub25tZXNzYWdlID0gZXZlbnQgPT4gdGhpcy5vbkNvbm5NZXNzYWdlKGV2ZW50KVxuICAgIHRoaXMuY29ubi5vbmNsb3NlID0gZXZlbnQgPT4gdGhpcy5vbkNvbm5DbG9zZShldmVudClcbiAgfVxuXG4gIGdldFNlc3Npb24oa2V5KXsgcmV0dXJuIHRoaXMuc2Vzc2lvblN0b3JlICYmIHRoaXMuc2Vzc2lvblN0b3JlLmdldEl0ZW0oa2V5KSB9XG5cbiAgc3RvcmVTZXNzaW9uKGtleSwgdmFsKXsgdGhpcy5zZXNzaW9uU3RvcmUgJiYgdGhpcy5zZXNzaW9uU3RvcmUuc2V0SXRlbShrZXksIHZhbCkgfVxuXG4gIGNvbm5lY3RXaXRoRmFsbGJhY2soZmFsbGJhY2tUcmFuc3BvcnQsIGZhbGxiYWNrVGhyZXNob2xkID0gMjUwMCl7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuZmFsbGJhY2tUaW1lcilcbiAgICBsZXQgZXN0YWJsaXNoZWQgPSBmYWxzZVxuICAgIGxldCBwcmltYXJ5VHJhbnNwb3J0ID0gdHJ1ZVxuICAgIGxldCBvcGVuUmVmLCBlcnJvclJlZlxuICAgIGxldCBmYWxsYmFjayA9IChyZWFzb24pID0+IHtcbiAgICAgIHRoaXMubG9nKFwidHJhbnNwb3J0XCIsIGBmYWxsaW5nIGJhY2sgdG8gJHtmYWxsYmFja1RyYW5zcG9ydC5uYW1lfS4uLmAsIHJlYXNvbilcbiAgICAgIHRoaXMub2ZmKFtvcGVuUmVmLCBlcnJvclJlZl0pXG4gICAgICBwcmltYXJ5VHJhbnNwb3J0ID0gZmFsc2VcbiAgICAgIHRoaXMucmVwbGFjZVRyYW5zcG9ydChmYWxsYmFja1RyYW5zcG9ydClcbiAgICAgIHRoaXMudHJhbnNwb3J0Q29ubmVjdCgpXG4gICAgfVxuICAgIGlmKHRoaXMuZ2V0U2Vzc2lvbihgcGh4OmZhbGxiYWNrOiR7ZmFsbGJhY2tUcmFuc3BvcnQubmFtZX1gKSl7IHJldHVybiBmYWxsYmFjayhcIm1lbW9yaXplZFwiKSB9XG5cbiAgICB0aGlzLmZhbGxiYWNrVGltZXIgPSBzZXRUaW1lb3V0KGZhbGxiYWNrLCBmYWxsYmFja1RocmVzaG9sZClcblxuICAgIGVycm9yUmVmID0gdGhpcy5vbkVycm9yKHJlYXNvbiA9PiB7XG4gICAgICB0aGlzLmxvZyhcInRyYW5zcG9ydFwiLCBcImVycm9yXCIsIHJlYXNvbilcbiAgICAgIGlmKHByaW1hcnlUcmFuc3BvcnQgJiYgIWVzdGFibGlzaGVkKXtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuZmFsbGJhY2tUaW1lcilcbiAgICAgICAgZmFsbGJhY2socmVhc29uKVxuICAgICAgfVxuICAgIH0pXG4gICAgdGhpcy5vbk9wZW4oKCkgPT4ge1xuICAgICAgZXN0YWJsaXNoZWQgPSB0cnVlXG4gICAgICBpZighcHJpbWFyeVRyYW5zcG9ydCl7XG4gICAgICAgIC8vIG9ubHkgbWVtb3JpemUgTFAgaWYgd2UgbmV2ZXIgY29ubmVjdGVkIHRvIHByaW1hcnlcbiAgICAgICAgaWYoIXRoaXMucHJpbWFyeVBhc3NlZEhlYWx0aENoZWNrKXsgdGhpcy5zdG9yZVNlc3Npb24oYHBoeDpmYWxsYmFjazoke2ZhbGxiYWNrVHJhbnNwb3J0Lm5hbWV9YCwgXCJ0cnVlXCIpIH1cbiAgICAgICAgcmV0dXJuIHRoaXMubG9nKFwidHJhbnNwb3J0XCIsIGBlc3RhYmxpc2hlZCAke2ZhbGxiYWNrVHJhbnNwb3J0Lm5hbWV9IGZhbGxiYWNrYClcbiAgICAgIH1cbiAgICAgIC8vIGlmIHdlJ3ZlIGVzdGFibGlzaGVkIHByaW1hcnksIGdpdmUgdGhlIGZhbGxiYWNrIGEgbmV3IHBlcmlvZCB0byBhdHRlbXB0IHBpbmdcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLmZhbGxiYWNrVGltZXIpXG4gICAgICB0aGlzLmZhbGxiYWNrVGltZXIgPSBzZXRUaW1lb3V0KGZhbGxiYWNrLCBmYWxsYmFja1RocmVzaG9sZClcbiAgICAgIHRoaXMucGluZyhydHQgPT4ge1xuICAgICAgICB0aGlzLmxvZyhcInRyYW5zcG9ydFwiLCBcImNvbm5lY3RlZCB0byBwcmltYXJ5IGFmdGVyXCIsIHJ0dClcbiAgICAgICAgdGhpcy5wcmltYXJ5UGFzc2VkSGVhbHRoQ2hlY2sgPSB0cnVlXG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLmZhbGxiYWNrVGltZXIpXG4gICAgICB9KVxuICAgIH0pXG4gICAgdGhpcy50cmFuc3BvcnRDb25uZWN0KClcbiAgfVxuXG4gIGNsZWFySGVhcnRiZWF0cygpe1xuICAgIGNsZWFyVGltZW91dCh0aGlzLmhlYXJ0YmVhdFRpbWVyKVxuICAgIGNsZWFyVGltZW91dCh0aGlzLmhlYXJ0YmVhdFRpbWVvdXRUaW1lcilcbiAgfVxuXG4gIG9uQ29ubk9wZW4oKXtcbiAgICBpZih0aGlzLmhhc0xvZ2dlcigpKSB0aGlzLmxvZyhcInRyYW5zcG9ydFwiLCBgJHt0aGlzLnRyYW5zcG9ydC5uYW1lfSBjb25uZWN0ZWQgdG8gJHt0aGlzLmVuZFBvaW50VVJMKCl9YClcbiAgICB0aGlzLmNsb3NlV2FzQ2xlYW4gPSBmYWxzZVxuICAgIHRoaXMuZGlzY29ubmVjdGluZyA9IGZhbHNlXG4gICAgdGhpcy5lc3RhYmxpc2hlZENvbm5lY3Rpb25zKytcbiAgICB0aGlzLmZsdXNoU2VuZEJ1ZmZlcigpXG4gICAgdGhpcy5yZWNvbm5lY3RUaW1lci5yZXNldCgpXG4gICAgdGhpcy5yZXNldEhlYXJ0YmVhdCgpXG4gICAgdGhpcy5zdGF0ZUNoYW5nZUNhbGxiYWNrcy5vcGVuLmZvckVhY2goKFssIGNhbGxiYWNrXSkgPT4gY2FsbGJhY2soKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cblxuICBoZWFydGJlYXRUaW1lb3V0KCl7XG4gICAgaWYodGhpcy5wZW5kaW5nSGVhcnRiZWF0UmVmKXtcbiAgICAgIHRoaXMucGVuZGluZ0hlYXJ0YmVhdFJlZiA9IG51bGxcbiAgICAgIGlmKHRoaXMuaGFzTG9nZ2VyKCkpeyB0aGlzLmxvZyhcInRyYW5zcG9ydFwiLCBcImhlYXJ0YmVhdCB0aW1lb3V0LiBBdHRlbXB0aW5nIHRvIHJlLWVzdGFibGlzaCBjb25uZWN0aW9uXCIpIH1cbiAgICAgIHRoaXMudHJpZ2dlckNoYW5FcnJvcigpXG4gICAgICB0aGlzLmNsb3NlV2FzQ2xlYW4gPSBmYWxzZVxuICAgICAgdGhpcy50ZWFyZG93bigoKSA9PiB0aGlzLnJlY29ubmVjdFRpbWVyLnNjaGVkdWxlVGltZW91dCgpLCBXU19DTE9TRV9OT1JNQUwsIFwiaGVhcnRiZWF0IHRpbWVvdXRcIilcbiAgICB9XG4gIH1cblxuICByZXNldEhlYXJ0YmVhdCgpe1xuICAgIGlmKHRoaXMuY29ubiAmJiB0aGlzLmNvbm4uc2tpcEhlYXJ0YmVhdCl7IHJldHVybiB9XG4gICAgdGhpcy5wZW5kaW5nSGVhcnRiZWF0UmVmID0gbnVsbFxuICAgIHRoaXMuY2xlYXJIZWFydGJlYXRzKClcbiAgICB0aGlzLmhlYXJ0YmVhdFRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB0aGlzLnNlbmRIZWFydGJlYXQoKSwgdGhpcy5oZWFydGJlYXRJbnRlcnZhbE1zKVxuICB9XG5cbiAgdGVhcmRvd24oY2FsbGJhY2ssIGNvZGUsIHJlYXNvbil7XG4gICAgaWYoIXRoaXMuY29ubil7XG4gICAgICByZXR1cm4gY2FsbGJhY2sgJiYgY2FsbGJhY2soKVxuICAgIH1cbiAgICBsZXQgY29ubmVjdENsb2NrID0gdGhpcy5jb25uZWN0Q2xvY2tcblxuICAgIHRoaXMud2FpdEZvckJ1ZmZlckRvbmUoKCkgPT4ge1xuICAgICAgaWYoY29ubmVjdENsb2NrICE9PSB0aGlzLmNvbm5lY3RDbG9jayl7IHJldHVybiB9XG4gICAgICBpZih0aGlzLmNvbm4pe1xuICAgICAgICBpZihjb2RlKXsgdGhpcy5jb25uLmNsb3NlKGNvZGUsIHJlYXNvbiB8fCBcIlwiKSB9IGVsc2UgeyB0aGlzLmNvbm4uY2xvc2UoKSB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMud2FpdEZvclNvY2tldENsb3NlZCgoKSA9PiB7XG4gICAgICAgIGlmKGNvbm5lY3RDbG9jayAhPT0gdGhpcy5jb25uZWN0Q2xvY2speyByZXR1cm4gfVxuICAgICAgICBpZih0aGlzLmNvbm4pe1xuICAgICAgICAgIHRoaXMuY29ubi5vbm9wZW4gPSBmdW5jdGlvbiAoKXsgfSAvLyBub29wXG4gICAgICAgICAgdGhpcy5jb25uLm9uZXJyb3IgPSBmdW5jdGlvbiAoKXsgfSAvLyBub29wXG4gICAgICAgICAgdGhpcy5jb25uLm9ubWVzc2FnZSA9IGZ1bmN0aW9uICgpeyB9IC8vIG5vb3BcbiAgICAgICAgICB0aGlzLmNvbm4ub25jbG9zZSA9IGZ1bmN0aW9uICgpeyB9IC8vIG5vb3BcbiAgICAgICAgICB0aGlzLmNvbm4gPSBudWxsXG4gICAgICAgIH1cblxuICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjaygpXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICB3YWl0Rm9yQnVmZmVyRG9uZShjYWxsYmFjaywgdHJpZXMgPSAxKXtcbiAgICBpZih0cmllcyA9PT0gNSB8fCAhdGhpcy5jb25uIHx8ICF0aGlzLmNvbm4uYnVmZmVyZWRBbW91bnQpe1xuICAgICAgY2FsbGJhY2soKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLndhaXRGb3JCdWZmZXJEb25lKGNhbGxiYWNrLCB0cmllcyArIDEpXG4gICAgfSwgMTUwICogdHJpZXMpXG4gIH1cblxuICB3YWl0Rm9yU29ja2V0Q2xvc2VkKGNhbGxiYWNrLCB0cmllcyA9IDEpe1xuICAgIGlmKHRyaWVzID09PSA1IHx8ICF0aGlzLmNvbm4gfHwgdGhpcy5jb25uLnJlYWR5U3RhdGUgPT09IFNPQ0tFVF9TVEFURVMuY2xvc2VkKXtcbiAgICAgIGNhbGxiYWNrKClcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy53YWl0Rm9yU29ja2V0Q2xvc2VkKGNhbGxiYWNrLCB0cmllcyArIDEpXG4gICAgfSwgMTUwICogdHJpZXMpXG4gIH1cblxuICBvbkNvbm5DbG9zZShldmVudCl7XG4gICAgbGV0IGNsb3NlQ29kZSA9IGV2ZW50ICYmIGV2ZW50LmNvZGVcbiAgICBpZih0aGlzLmhhc0xvZ2dlcigpKSB0aGlzLmxvZyhcInRyYW5zcG9ydFwiLCBcImNsb3NlXCIsIGV2ZW50KVxuICAgIHRoaXMudHJpZ2dlckNoYW5FcnJvcigpXG4gICAgdGhpcy5jbGVhckhlYXJ0YmVhdHMoKVxuICAgIGlmKCF0aGlzLmNsb3NlV2FzQ2xlYW4gJiYgY2xvc2VDb2RlICE9PSAxMDAwKXtcbiAgICAgIHRoaXMucmVjb25uZWN0VGltZXIuc2NoZWR1bGVUaW1lb3V0KClcbiAgICB9XG4gICAgdGhpcy5zdGF0ZUNoYW5nZUNhbGxiYWNrcy5jbG9zZS5mb3JFYWNoKChbLCBjYWxsYmFja10pID0+IGNhbGxiYWNrKGV2ZW50KSlcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgb25Db25uRXJyb3IoZXJyb3Ipe1xuICAgIGlmKHRoaXMuaGFzTG9nZ2VyKCkpIHRoaXMubG9nKFwidHJhbnNwb3J0XCIsIGVycm9yKVxuICAgIGxldCB0cmFuc3BvcnRCZWZvcmUgPSB0aGlzLnRyYW5zcG9ydFxuICAgIGxldCBlc3RhYmxpc2hlZEJlZm9yZSA9IHRoaXMuZXN0YWJsaXNoZWRDb25uZWN0aW9uc1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3MuZXJyb3IuZm9yRWFjaCgoWywgY2FsbGJhY2tdKSA9PiB7XG4gICAgICBjYWxsYmFjayhlcnJvciwgdHJhbnNwb3J0QmVmb3JlLCBlc3RhYmxpc2hlZEJlZm9yZSlcbiAgICB9KVxuICAgIGlmKHRyYW5zcG9ydEJlZm9yZSA9PT0gdGhpcy50cmFuc3BvcnQgfHwgZXN0YWJsaXNoZWRCZWZvcmUgPiAwKXtcbiAgICAgIHRoaXMudHJpZ2dlckNoYW5FcnJvcigpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICB0cmlnZ2VyQ2hhbkVycm9yKCl7XG4gICAgdGhpcy5jaGFubmVscy5mb3JFYWNoKGNoYW5uZWwgPT4ge1xuICAgICAgaWYoIShjaGFubmVsLmlzRXJyb3JlZCgpIHx8IGNoYW5uZWwuaXNMZWF2aW5nKCkgfHwgY2hhbm5lbC5pc0Nsb3NlZCgpKSl7XG4gICAgICAgIGNoYW5uZWwudHJpZ2dlcihDSEFOTkVMX0VWRU5UUy5lcnJvcilcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuICBjb25uZWN0aW9uU3RhdGUoKXtcbiAgICBzd2l0Y2godGhpcy5jb25uICYmIHRoaXMuY29ubi5yZWFkeVN0YXRlKXtcbiAgICAgIGNhc2UgU09DS0VUX1NUQVRFUy5jb25uZWN0aW5nOiByZXR1cm4gXCJjb25uZWN0aW5nXCJcbiAgICAgIGNhc2UgU09DS0VUX1NUQVRFUy5vcGVuOiByZXR1cm4gXCJvcGVuXCJcbiAgICAgIGNhc2UgU09DS0VUX1NUQVRFUy5jbG9zaW5nOiByZXR1cm4gXCJjbG9zaW5nXCJcbiAgICAgIGRlZmF1bHQ6IHJldHVybiBcImNsb3NlZFwiXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgaXNDb25uZWN0ZWQoKXsgcmV0dXJuIHRoaXMuY29ubmVjdGlvblN0YXRlKCkgPT09IFwib3BlblwiIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICpcbiAgICogQHBhcmFtIHtDaGFubmVsfVxuICAgKi9cbiAgcmVtb3ZlKGNoYW5uZWwpe1xuICAgIHRoaXMub2ZmKGNoYW5uZWwuc3RhdGVDaGFuZ2VSZWZzKVxuICAgIHRoaXMuY2hhbm5lbHMgPSB0aGlzLmNoYW5uZWxzLmZpbHRlcihjID0+IGMgIT09IGNoYW5uZWwpXG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBgb25PcGVuYCwgYG9uQ2xvc2VgLCBgb25FcnJvcixgIGFuZCBgb25NZXNzYWdlYCByZWdpc3RyYXRpb25zLlxuICAgKlxuICAgKiBAcGFyYW0ge3JlZnN9IC0gbGlzdCBvZiByZWZzIHJldHVybmVkIGJ5IGNhbGxzIHRvXG4gICAqICAgICAgICAgICAgICAgICBgb25PcGVuYCwgYG9uQ2xvc2VgLCBgb25FcnJvcixgIGFuZCBgb25NZXNzYWdlYFxuICAgKi9cbiAgb2ZmKHJlZnMpe1xuICAgIGZvcihsZXQga2V5IGluIHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3Mpe1xuICAgICAgdGhpcy5zdGF0ZUNoYW5nZUNhbGxiYWNrc1trZXldID0gdGhpcy5zdGF0ZUNoYW5nZUNhbGxiYWNrc1trZXldLmZpbHRlcigoW3JlZl0pID0+IHtcbiAgICAgICAgcmV0dXJuIHJlZnMuaW5kZXhPZihyZWYpID09PSAtMVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhdGVzIGEgbmV3IGNoYW5uZWwgZm9yIHRoZSBnaXZlbiB0b3BpY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNcbiAgICogQHBhcmFtIHtPYmplY3R9IGNoYW5QYXJhbXMgLSBQYXJhbWV0ZXJzIGZvciB0aGUgY2hhbm5lbFxuICAgKiBAcmV0dXJucyB7Q2hhbm5lbH1cbiAgICovXG4gIGNoYW5uZWwodG9waWMsIGNoYW5QYXJhbXMgPSB7fSl7XG4gICAgbGV0IGNoYW4gPSBuZXcgQ2hhbm5lbCh0b3BpYywgY2hhblBhcmFtcywgdGhpcylcbiAgICB0aGlzLmNoYW5uZWxzLnB1c2goY2hhbilcbiAgICByZXR1cm4gY2hhblxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAqL1xuICBwdXNoKGRhdGEpe1xuICAgIGlmKHRoaXMuaGFzTG9nZ2VyKCkpe1xuICAgICAgbGV0IHt0b3BpYywgZXZlbnQsIHBheWxvYWQsIHJlZiwgam9pbl9yZWZ9ID0gZGF0YVxuICAgICAgdGhpcy5sb2coXCJwdXNoXCIsIGAke3RvcGljfSAke2V2ZW50fSAoJHtqb2luX3JlZn0sICR7cmVmfSlgLCBwYXlsb2FkKVxuICAgIH1cblxuICAgIGlmKHRoaXMuaXNDb25uZWN0ZWQoKSl7XG4gICAgICB0aGlzLmVuY29kZShkYXRhLCByZXN1bHQgPT4gdGhpcy5jb25uLnNlbmQocmVzdWx0KSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZW5kQnVmZmVyLnB1c2goKCkgPT4gdGhpcy5lbmNvZGUoZGF0YSwgcmVzdWx0ID0+IHRoaXMuY29ubi5zZW5kKHJlc3VsdCkpKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIG5leHQgbWVzc2FnZSByZWYsIGFjY291bnRpbmcgZm9yIG92ZXJmbG93c1xuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cbiAgbWFrZVJlZigpe1xuICAgIGxldCBuZXdSZWYgPSB0aGlzLnJlZiArIDFcbiAgICBpZihuZXdSZWYgPT09IHRoaXMucmVmKXsgdGhpcy5yZWYgPSAwIH0gZWxzZSB7IHRoaXMucmVmID0gbmV3UmVmIH1cblxuICAgIHJldHVybiB0aGlzLnJlZi50b1N0cmluZygpXG4gIH1cblxuICBzZW5kSGVhcnRiZWF0KCl7XG4gICAgaWYodGhpcy5wZW5kaW5nSGVhcnRiZWF0UmVmICYmICF0aGlzLmlzQ29ubmVjdGVkKCkpeyByZXR1cm4gfVxuICAgIHRoaXMucGVuZGluZ0hlYXJ0YmVhdFJlZiA9IHRoaXMubWFrZVJlZigpXG4gICAgdGhpcy5wdXNoKHt0b3BpYzogXCJwaG9lbml4XCIsIGV2ZW50OiBcImhlYXJ0YmVhdFwiLCBwYXlsb2FkOiB7fSwgcmVmOiB0aGlzLnBlbmRpbmdIZWFydGJlYXRSZWZ9KVxuICAgIHRoaXMuaGVhcnRiZWF0VGltZW91dFRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB0aGlzLmhlYXJ0YmVhdFRpbWVvdXQoKSwgdGhpcy5oZWFydGJlYXRJbnRlcnZhbE1zKVxuICB9XG5cbiAgZmx1c2hTZW5kQnVmZmVyKCl7XG4gICAgaWYodGhpcy5pc0Nvbm5lY3RlZCgpICYmIHRoaXMuc2VuZEJ1ZmZlci5sZW5ndGggPiAwKXtcbiAgICAgIHRoaXMuc2VuZEJ1ZmZlci5mb3JFYWNoKGNhbGxiYWNrID0+IGNhbGxiYWNrKCkpXG4gICAgICB0aGlzLnNlbmRCdWZmZXIgPSBbXVxuICAgIH1cbiAgfVxuXG4gIG9uQ29ubk1lc3NhZ2UocmF3TWVzc2FnZSl7XG4gICAgdGhpcy5kZWNvZGUocmF3TWVzc2FnZS5kYXRhLCBtc2cgPT4ge1xuICAgICAgbGV0IHt0b3BpYywgZXZlbnQsIHBheWxvYWQsIHJlZiwgam9pbl9yZWZ9ID0gbXNnXG4gICAgICBpZihyZWYgJiYgcmVmID09PSB0aGlzLnBlbmRpbmdIZWFydGJlYXRSZWYpe1xuICAgICAgICB0aGlzLmNsZWFySGVhcnRiZWF0cygpXG4gICAgICAgIHRoaXMucGVuZGluZ0hlYXJ0YmVhdFJlZiA9IG51bGxcbiAgICAgICAgdGhpcy5oZWFydGJlYXRUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5zZW5kSGVhcnRiZWF0KCksIHRoaXMuaGVhcnRiZWF0SW50ZXJ2YWxNcylcbiAgICAgIH1cblxuICAgICAgaWYodGhpcy5oYXNMb2dnZXIoKSkgdGhpcy5sb2coXCJyZWNlaXZlXCIsIGAke3BheWxvYWQuc3RhdHVzIHx8IFwiXCJ9ICR7dG9waWN9ICR7ZXZlbnR9ICR7cmVmICYmIFwiKFwiICsgcmVmICsgXCIpXCIgfHwgXCJcIn1gLCBwYXlsb2FkKVxuXG4gICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5jaGFubmVscy5sZW5ndGg7IGkrKyl7XG4gICAgICAgIGNvbnN0IGNoYW5uZWwgPSB0aGlzLmNoYW5uZWxzW2ldXG4gICAgICAgIGlmKCFjaGFubmVsLmlzTWVtYmVyKHRvcGljLCBldmVudCwgcGF5bG9hZCwgam9pbl9yZWYpKXsgY29udGludWUgfVxuICAgICAgICBjaGFubmVsLnRyaWdnZXIoZXZlbnQsIHBheWxvYWQsIHJlZiwgam9pbl9yZWYpXG4gICAgICB9XG5cbiAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzLm1lc3NhZ2UubGVuZ3RoOyBpKyspe1xuICAgICAgICBsZXQgWywgY2FsbGJhY2tdID0gdGhpcy5zdGF0ZUNoYW5nZUNhbGxiYWNrcy5tZXNzYWdlW2ldXG4gICAgICAgIGNhbGxiYWNrKG1zZylcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgbGVhdmVPcGVuVG9waWModG9waWMpe1xuICAgIGxldCBkdXBDaGFubmVsID0gdGhpcy5jaGFubmVscy5maW5kKGMgPT4gYy50b3BpYyA9PT0gdG9waWMgJiYgKGMuaXNKb2luZWQoKSB8fCBjLmlzSm9pbmluZygpKSlcbiAgICBpZihkdXBDaGFubmVsKXtcbiAgICAgIGlmKHRoaXMuaGFzTG9nZ2VyKCkpIHRoaXMubG9nKFwidHJhbnNwb3J0XCIsIGBsZWF2aW5nIGR1cGxpY2F0ZSB0b3BpYyBcIiR7dG9waWN9XCJgKVxuICAgICAgZHVwQ2hhbm5lbC5sZWF2ZSgpXG4gICAgfVxuICB9XG59XG4iLCAiZXhwb3J0IGNvbnN0IENPTlNFQ1VUSVZFX1JFTE9BRFMgPSBcImNvbnNlY3V0aXZlLXJlbG9hZHNcIlxuZXhwb3J0IGNvbnN0IE1BWF9SRUxPQURTID0gMTBcbmV4cG9ydCBjb25zdCBSRUxPQURfSklUVEVSX01JTiA9IDUwMDBcbmV4cG9ydCBjb25zdCBSRUxPQURfSklUVEVSX01BWCA9IDEwMDAwXG5leHBvcnQgY29uc3QgRkFJTFNBRkVfSklUVEVSID0gMzAwMDBcbmV4cG9ydCBjb25zdCBQSFhfRVZFTlRfQ0xBU1NFUyA9IFtcbiAgXCJwaHgtY2xpY2stbG9hZGluZ1wiLCBcInBoeC1jaGFuZ2UtbG9hZGluZ1wiLCBcInBoeC1zdWJtaXQtbG9hZGluZ1wiLFxuICBcInBoeC1rZXlkb3duLWxvYWRpbmdcIiwgXCJwaHgta2V5dXAtbG9hZGluZ1wiLCBcInBoeC1ibHVyLWxvYWRpbmdcIiwgXCJwaHgtZm9jdXMtbG9hZGluZ1wiLFxuICBcInBoeC1ob29rLWxvYWRpbmdcIlxuXVxuZXhwb3J0IGNvbnN0IFBIWF9DT01QT05FTlQgPSBcImRhdGEtcGh4LWNvbXBvbmVudFwiXG5leHBvcnQgY29uc3QgUEhYX0xJVkVfTElOSyA9IFwiZGF0YS1waHgtbGlua1wiXG5leHBvcnQgY29uc3QgUEhYX1RSQUNLX1NUQVRJQyA9IFwidHJhY2stc3RhdGljXCJcbmV4cG9ydCBjb25zdCBQSFhfTElOS19TVEFURSA9IFwiZGF0YS1waHgtbGluay1zdGF0ZVwiXG5leHBvcnQgY29uc3QgUEhYX1JFRl9MT0FESU5HID0gXCJkYXRhLXBoeC1yZWYtbG9hZGluZ1wiXG5leHBvcnQgY29uc3QgUEhYX1JFRl9TUkMgPSBcImRhdGEtcGh4LXJlZi1zcmNcIlxuZXhwb3J0IGNvbnN0IFBIWF9SRUZfTE9DSyA9IFwiZGF0YS1waHgtcmVmLWxvY2tcIlxuZXhwb3J0IGNvbnN0IFBIWF9UUkFDS19VUExPQURTID0gXCJ0cmFjay11cGxvYWRzXCJcbmV4cG9ydCBjb25zdCBQSFhfVVBMT0FEX1JFRiA9IFwiZGF0YS1waHgtdXBsb2FkLXJlZlwiXG5leHBvcnQgY29uc3QgUEhYX1BSRUZMSUdIVEVEX1JFRlMgPSBcImRhdGEtcGh4LXByZWZsaWdodGVkLXJlZnNcIlxuZXhwb3J0IGNvbnN0IFBIWF9ET05FX1JFRlMgPSBcImRhdGEtcGh4LWRvbmUtcmVmc1wiXG5leHBvcnQgY29uc3QgUEhYX0RST1BfVEFSR0VUID0gXCJkcm9wLXRhcmdldFwiXG5leHBvcnQgY29uc3QgUEhYX0FDVElWRV9FTlRSWV9SRUZTID0gXCJkYXRhLXBoeC1hY3RpdmUtcmVmc1wiXG5leHBvcnQgY29uc3QgUEhYX0xJVkVfRklMRV9VUERBVEVEID0gXCJwaHg6bGl2ZS1maWxlOnVwZGF0ZWRcIlxuZXhwb3J0IGNvbnN0IFBIWF9TS0lQID0gXCJkYXRhLXBoeC1za2lwXCJcbmV4cG9ydCBjb25zdCBQSFhfTUFHSUNfSUQgPSBcImRhdGEtcGh4LWlkXCJcbmV4cG9ydCBjb25zdCBQSFhfUFJVTkUgPSBcImRhdGEtcGh4LXBydW5lXCJcbmV4cG9ydCBjb25zdCBQSFhfQ09OTkVDVEVEX0NMQVNTID0gXCJwaHgtY29ubmVjdGVkXCJcbmV4cG9ydCBjb25zdCBQSFhfTE9BRElOR19DTEFTUyA9IFwicGh4LWxvYWRpbmdcIlxuZXhwb3J0IGNvbnN0IFBIWF9FUlJPUl9DTEFTUyA9IFwicGh4LWVycm9yXCJcbmV4cG9ydCBjb25zdCBQSFhfQ0xJRU5UX0VSUk9SX0NMQVNTID0gXCJwaHgtY2xpZW50LWVycm9yXCJcbmV4cG9ydCBjb25zdCBQSFhfU0VSVkVSX0VSUk9SX0NMQVNTID0gXCJwaHgtc2VydmVyLWVycm9yXCJcbmV4cG9ydCBjb25zdCBQSFhfUEFSRU5UX0lEID0gXCJkYXRhLXBoeC1wYXJlbnQtaWRcIlxuZXhwb3J0IGNvbnN0IFBIWF9NQUlOID0gXCJkYXRhLXBoeC1tYWluXCJcbmV4cG9ydCBjb25zdCBQSFhfUk9PVF9JRCA9IFwiZGF0YS1waHgtcm9vdC1pZFwiXG5leHBvcnQgY29uc3QgUEhYX1ZJRVdQT1JUX1RPUCA9IFwidmlld3BvcnQtdG9wXCJcbmV4cG9ydCBjb25zdCBQSFhfVklFV1BPUlRfQk9UVE9NID0gXCJ2aWV3cG9ydC1ib3R0b21cIlxuZXhwb3J0IGNvbnN0IFBIWF9UUklHR0VSX0FDVElPTiA9IFwidHJpZ2dlci1hY3Rpb25cIlxuZXhwb3J0IGNvbnN0IFBIWF9IQVNfRk9DVVNFRCA9IFwicGh4LWhhcy1mb2N1c2VkXCJcbmV4cG9ydCBjb25zdCBGT0NVU0FCTEVfSU5QVVRTID0gW1widGV4dFwiLCBcInRleHRhcmVhXCIsIFwibnVtYmVyXCIsIFwiZW1haWxcIiwgXCJwYXNzd29yZFwiLCBcInNlYXJjaFwiLCBcInRlbFwiLCBcInVybFwiLCBcImRhdGVcIiwgXCJ0aW1lXCIsIFwiZGF0ZXRpbWUtbG9jYWxcIiwgXCJjb2xvclwiLCBcInJhbmdlXCJdXG5leHBvcnQgY29uc3QgQ0hFQ0tBQkxFX0lOUFVUUyA9IFtcImNoZWNrYm94XCIsIFwicmFkaW9cIl1cbmV4cG9ydCBjb25zdCBQSFhfSEFTX1NVQk1JVFRFRCA9IFwicGh4LWhhcy1zdWJtaXR0ZWRcIlxuZXhwb3J0IGNvbnN0IFBIWF9TRVNTSU9OID0gXCJkYXRhLXBoeC1zZXNzaW9uXCJcbmV4cG9ydCBjb25zdCBQSFhfVklFV19TRUxFQ1RPUiA9IGBbJHtQSFhfU0VTU0lPTn1dYFxuZXhwb3J0IGNvbnN0IFBIWF9TVElDS1kgPSBcImRhdGEtcGh4LXN0aWNreVwiXG5leHBvcnQgY29uc3QgUEhYX1NUQVRJQyA9IFwiZGF0YS1waHgtc3RhdGljXCJcbmV4cG9ydCBjb25zdCBQSFhfUkVBRE9OTFkgPSBcImRhdGEtcGh4LXJlYWRvbmx5XCJcbmV4cG9ydCBjb25zdCBQSFhfRElTQUJMRUQgPSBcImRhdGEtcGh4LWRpc2FibGVkXCJcbmV4cG9ydCBjb25zdCBQSFhfRElTQUJMRV9XSVRIID0gXCJkaXNhYmxlLXdpdGhcIlxuZXhwb3J0IGNvbnN0IFBIWF9ESVNBQkxFX1dJVEhfUkVTVE9SRSA9IFwiZGF0YS1waHgtZGlzYWJsZS13aXRoLXJlc3RvcmVcIlxuZXhwb3J0IGNvbnN0IFBIWF9IT09LID0gXCJob29rXCJcbmV4cG9ydCBjb25zdCBQSFhfREVCT1VOQ0UgPSBcImRlYm91bmNlXCJcbmV4cG9ydCBjb25zdCBQSFhfVEhST1RUTEUgPSBcInRocm90dGxlXCJcbmV4cG9ydCBjb25zdCBQSFhfVVBEQVRFID0gXCJ1cGRhdGVcIlxuZXhwb3J0IGNvbnN0IFBIWF9TVFJFQU0gPSBcInN0cmVhbVwiXG5leHBvcnQgY29uc3QgUEhYX1NUUkVBTV9SRUYgPSBcImRhdGEtcGh4LXN0cmVhbVwiXG5leHBvcnQgY29uc3QgUEhYX0tFWSA9IFwia2V5XCJcbmV4cG9ydCBjb25zdCBQSFhfUFJJVkFURSA9IFwicGh4UHJpdmF0ZVwiXG5leHBvcnQgY29uc3QgUEhYX0FVVE9fUkVDT1ZFUiA9IFwiYXV0by1yZWNvdmVyXCJcbmV4cG9ydCBjb25zdCBQSFhfTFZfREVCVUcgPSBcInBoeDpsaXZlLXNvY2tldDpkZWJ1Z1wiXG5leHBvcnQgY29uc3QgUEhYX0xWX1BST0ZJTEUgPSBcInBoeDpsaXZlLXNvY2tldDpwcm9maWxpbmdcIlxuZXhwb3J0IGNvbnN0IFBIWF9MVl9MQVRFTkNZX1NJTSA9IFwicGh4OmxpdmUtc29ja2V0OmxhdGVuY3ktc2ltXCJcbmV4cG9ydCBjb25zdCBQSFhfTFZfSElTVE9SWV9QT1NJVElPTiA9IFwicGh4Om5hdi1oaXN0b3J5LXBvc2l0aW9uXCJcbmV4cG9ydCBjb25zdCBQSFhfUFJPR1JFU1MgPSBcInByb2dyZXNzXCJcbmV4cG9ydCBjb25zdCBQSFhfTU9VTlRFRCA9IFwibW91bnRlZFwiXG5leHBvcnQgY29uc3QgUEhYX1JFTE9BRF9TVEFUVVMgPSBcIl9fcGhvZW5peF9yZWxvYWRfc3RhdHVzX19cIlxuZXhwb3J0IGNvbnN0IExPQURFUl9USU1FT1VUID0gMVxuZXhwb3J0IGNvbnN0IE1BWF9DSElMRF9KT0lOX0FUVEVNUFRTID0gM1xuZXhwb3J0IGNvbnN0IEJFRk9SRV9VTkxPQURfTE9BREVSX1RJTUVPVVQgPSAyMDBcbmV4cG9ydCBjb25zdCBESVNDT05ORUNURURfVElNRU9VVCA9IDUwMFxuZXhwb3J0IGNvbnN0IEJJTkRJTkdfUFJFRklYID0gXCJwaHgtXCJcbmV4cG9ydCBjb25zdCBQVVNIX1RJTUVPVVQgPSAzMDAwMFxuZXhwb3J0IGNvbnN0IExJTktfSEVBREVSID0gXCJ4LXJlcXVlc3RlZC13aXRoXCJcbmV4cG9ydCBjb25zdCBSRVNQT05TRV9VUkxfSEVBREVSID0gXCJ4LXJlc3BvbnNlLXVybFwiXG5leHBvcnQgY29uc3QgREVCT1VOQ0VfVFJJR0dFUiA9IFwiZGVib3VuY2UtdHJpZ2dlclwiXG5leHBvcnQgY29uc3QgVEhST1RUTEVEID0gXCJ0aHJvdHRsZWRcIlxuZXhwb3J0IGNvbnN0IERFQk9VTkNFX1BSRVZfS0VZID0gXCJkZWJvdW5jZS1wcmV2LWtleVwiXG5leHBvcnQgY29uc3QgREVGQVVMVFMgPSB7XG4gIGRlYm91bmNlOiAzMDAsXG4gIHRocm90dGxlOiAzMDBcbn1cbmV4cG9ydCBjb25zdCBQSFhfUEVORElOR19BVFRSUyA9IFtQSFhfUkVGX0xPQURJTkcsIFBIWF9SRUZfU1JDLCBQSFhfUkVGX0xPQ0tdXG4vLyBSZW5kZXJlZFxuZXhwb3J0IGNvbnN0IERZTkFNSUNTID0gXCJkXCJcbmV4cG9ydCBjb25zdCBTVEFUSUMgPSBcInNcIlxuZXhwb3J0IGNvbnN0IFJPT1QgPSBcInJcIlxuZXhwb3J0IGNvbnN0IENPTVBPTkVOVFMgPSBcImNcIlxuZXhwb3J0IGNvbnN0IEVWRU5UUyA9IFwiZVwiXG5leHBvcnQgY29uc3QgUkVQTFkgPSBcInJcIlxuZXhwb3J0IGNvbnN0IFRJVExFID0gXCJ0XCJcbmV4cG9ydCBjb25zdCBURU1QTEFURVMgPSBcInBcIlxuZXhwb3J0IGNvbnN0IFNUUkVBTSA9IFwic3RyZWFtXCJcbiIsICJpbXBvcnQge1xuICBsb2dFcnJvclxufSBmcm9tIFwiLi91dGlsc1wiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVudHJ5VXBsb2FkZXIge1xuICBjb25zdHJ1Y3RvcihlbnRyeSwgY29uZmlnLCBsaXZlU29ja2V0KXtcbiAgICBsZXQge2NodW5rX3NpemUsIGNodW5rX3RpbWVvdXR9ID0gY29uZmlnXG4gICAgdGhpcy5saXZlU29ja2V0ID0gbGl2ZVNvY2tldFxuICAgIHRoaXMuZW50cnkgPSBlbnRyeVxuICAgIHRoaXMub2Zmc2V0ID0gMFxuICAgIHRoaXMuY2h1bmtTaXplID0gY2h1bmtfc2l6ZVxuICAgIHRoaXMuY2h1bmtUaW1lb3V0ID0gY2h1bmtfdGltZW91dFxuICAgIHRoaXMuY2h1bmtUaW1lciA9IG51bGxcbiAgICB0aGlzLmVycm9yZWQgPSBmYWxzZVxuICAgIHRoaXMudXBsb2FkQ2hhbm5lbCA9IGxpdmVTb2NrZXQuY2hhbm5lbChgbHZ1OiR7ZW50cnkucmVmfWAsIHt0b2tlbjogZW50cnkubWV0YWRhdGEoKX0pXG4gIH1cblxuICBlcnJvcihyZWFzb24pe1xuICAgIGlmKHRoaXMuZXJyb3JlZCl7IHJldHVybiB9XG4gICAgdGhpcy51cGxvYWRDaGFubmVsLmxlYXZlKClcbiAgICB0aGlzLmVycm9yZWQgPSB0cnVlXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuY2h1bmtUaW1lcilcbiAgICB0aGlzLmVudHJ5LmVycm9yKHJlYXNvbilcbiAgfVxuXG4gIHVwbG9hZCgpe1xuICAgIHRoaXMudXBsb2FkQ2hhbm5lbC5vbkVycm9yKHJlYXNvbiA9PiB0aGlzLmVycm9yKHJlYXNvbikpXG4gICAgdGhpcy51cGxvYWRDaGFubmVsLmpvaW4oKVxuICAgICAgLnJlY2VpdmUoXCJva1wiLCBfZGF0YSA9PiB0aGlzLnJlYWROZXh0Q2h1bmsoKSlcbiAgICAgIC5yZWNlaXZlKFwiZXJyb3JcIiwgcmVhc29uID0+IHRoaXMuZXJyb3IocmVhc29uKSlcbiAgfVxuXG4gIGlzRG9uZSgpeyByZXR1cm4gdGhpcy5vZmZzZXQgPj0gdGhpcy5lbnRyeS5maWxlLnNpemUgfVxuXG4gIHJlYWROZXh0Q2h1bmsoKXtcbiAgICBsZXQgcmVhZGVyID0gbmV3IHdpbmRvdy5GaWxlUmVhZGVyKClcbiAgICBsZXQgYmxvYiA9IHRoaXMuZW50cnkuZmlsZS5zbGljZSh0aGlzLm9mZnNldCwgdGhpcy5jaHVua1NpemUgKyB0aGlzLm9mZnNldClcbiAgICByZWFkZXIub25sb2FkID0gKGUpID0+IHtcbiAgICAgIGlmKGUudGFyZ2V0LmVycm9yID09PSBudWxsKXtcbiAgICAgICAgdGhpcy5vZmZzZXQgKz0gZS50YXJnZXQucmVzdWx0LmJ5dGVMZW5ndGhcbiAgICAgICAgdGhpcy5wdXNoQ2h1bmsoZS50YXJnZXQucmVzdWx0KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGxvZ0Vycm9yKFwiUmVhZCBlcnJvcjogXCIgKyBlLnRhcmdldC5lcnJvcilcbiAgICAgIH1cbiAgICB9XG4gICAgcmVhZGVyLnJlYWRBc0FycmF5QnVmZmVyKGJsb2IpXG4gIH1cblxuICBwdXNoQ2h1bmsoY2h1bmspe1xuICAgIGlmKCF0aGlzLnVwbG9hZENoYW5uZWwuaXNKb2luZWQoKSl7IHJldHVybiB9XG4gICAgdGhpcy51cGxvYWRDaGFubmVsLnB1c2goXCJjaHVua1wiLCBjaHVuaywgdGhpcy5jaHVua1RpbWVvdXQpXG4gICAgICAucmVjZWl2ZShcIm9rXCIsICgpID0+IHtcbiAgICAgICAgdGhpcy5lbnRyeS5wcm9ncmVzcygodGhpcy5vZmZzZXQgLyB0aGlzLmVudHJ5LmZpbGUuc2l6ZSkgKiAxMDApXG4gICAgICAgIGlmKCF0aGlzLmlzRG9uZSgpKXtcbiAgICAgICAgICB0aGlzLmNodW5rVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMucmVhZE5leHRDaHVuaygpLCB0aGlzLmxpdmVTb2NrZXQuZ2V0TGF0ZW5jeVNpbSgpIHx8IDApXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAucmVjZWl2ZShcImVycm9yXCIsICh7cmVhc29ufSkgPT4gdGhpcy5lcnJvcihyZWFzb24pKVxuICB9XG59XG4iLCAiaW1wb3J0IHtcbiAgUEhYX1ZJRVdfU0VMRUNUT1Jcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuaW1wb3J0IEVudHJ5VXBsb2FkZXIgZnJvbSBcIi4vZW50cnlfdXBsb2FkZXJcIlxuXG5leHBvcnQgbGV0IGxvZ0Vycm9yID0gKG1zZywgb2JqKSA9PiBjb25zb2xlLmVycm9yICYmIGNvbnNvbGUuZXJyb3IobXNnLCBvYmopXG5cbmV4cG9ydCBsZXQgaXNDaWQgPSAoY2lkKSA9PiB7XG4gIGxldCB0eXBlID0gdHlwZW9mKGNpZClcbiAgcmV0dXJuIHR5cGUgPT09IFwibnVtYmVyXCIgfHwgKHR5cGUgPT09IFwic3RyaW5nXCIgJiYgL14oMHxbMS05XVxcZCopJC8udGVzdChjaWQpKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGV0ZWN0RHVwbGljYXRlSWRzKCl7XG4gIGxldCBpZHMgPSBuZXcgU2V0KClcbiAgbGV0IGVsZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIipbaWRdXCIpXG4gIGZvcihsZXQgaSA9IDAsIGxlbiA9IGVsZW1zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKXtcbiAgICBpZihpZHMuaGFzKGVsZW1zW2ldLmlkKSl7XG4gICAgICBjb25zb2xlLmVycm9yKGBNdWx0aXBsZSBJRHMgZGV0ZWN0ZWQ6ICR7ZWxlbXNbaV0uaWR9LiBFbnN1cmUgdW5pcXVlIGVsZW1lbnQgaWRzLmApXG4gICAgfSBlbHNlIHtcbiAgICAgIGlkcy5hZGQoZWxlbXNbaV0uaWQpXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZXRlY3RJbnZhbGlkU3RyZWFtSW5zZXJ0cyhpbnNlcnRzKXtcbiAgY29uc3QgZXJyb3JzID0gbmV3IFNldCgpXG4gIE9iamVjdC5rZXlzKGluc2VydHMpLmZvckVhY2goKGlkKSA9PiB7XG4gICAgY29uc3Qgc3RyZWFtRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZClcbiAgICBpZihzdHJlYW1FbCAmJiBzdHJlYW1FbC5wYXJlbnRFbGVtZW50ICYmIHN0cmVhbUVsLnBhcmVudEVsZW1lbnQuZ2V0QXR0cmlidXRlKFwicGh4LXVwZGF0ZVwiKSAhPT0gXCJzdHJlYW1cIil7XG4gICAgICBlcnJvcnMuYWRkKGBUaGUgc3RyZWFtIGNvbnRhaW5lciB3aXRoIGlkIFwiJHtzdHJlYW1FbC5wYXJlbnRFbGVtZW50LmlkfVwiIGlzIG1pc3NpbmcgdGhlIHBoeC11cGRhdGU9XCJzdHJlYW1cIiBhdHRyaWJ1dGUuIEVuc3VyZSBpdCBpcyBzZXQgZm9yIHN0cmVhbXMgdG8gd29yayBwcm9wZXJseS5gKVxuICAgIH1cbiAgfSlcbiAgZXJyb3JzLmZvckVhY2goZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpXG59XG5cbmV4cG9ydCBsZXQgZGVidWcgPSAodmlldywga2luZCwgbXNnLCBvYmopID0+IHtcbiAgaWYodmlldy5saXZlU29ja2V0LmlzRGVidWdFbmFibGVkKCkpe1xuICAgIGNvbnNvbGUubG9nKGAke3ZpZXcuaWR9ICR7a2luZH06ICR7bXNnfSAtIGAsIG9iailcbiAgfVxufVxuXG4vLyB3cmFwcyB2YWx1ZSBpbiBjbG9zdXJlIG9yIHJldHVybnMgY2xvc3VyZVxuZXhwb3J0IGxldCBjbG9zdXJlID0gKHZhbCkgPT4gdHlwZW9mIHZhbCA9PT0gXCJmdW5jdGlvblwiID8gdmFsIDogZnVuY3Rpb24gKCl7IHJldHVybiB2YWwgfVxuXG5leHBvcnQgbGV0IGNsb25lID0gKG9iaikgPT4geyByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvYmopKSB9XG5cbmV4cG9ydCBsZXQgY2xvc2VzdFBoeEJpbmRpbmcgPSAoZWwsIGJpbmRpbmcsIGJvcmRlckVsKSA9PiB7XG4gIGRvIHtcbiAgICBpZihlbC5tYXRjaGVzKGBbJHtiaW5kaW5nfV1gKSAmJiAhZWwuZGlzYWJsZWQpeyByZXR1cm4gZWwgfVxuICAgIGVsID0gZWwucGFyZW50RWxlbWVudCB8fCBlbC5wYXJlbnROb2RlXG4gIH0gd2hpbGUoZWwgIT09IG51bGwgJiYgZWwubm9kZVR5cGUgPT09IDEgJiYgISgoYm9yZGVyRWwgJiYgYm9yZGVyRWwuaXNTYW1lTm9kZShlbCkpIHx8IGVsLm1hdGNoZXMoUEhYX1ZJRVdfU0VMRUNUT1IpKSlcbiAgcmV0dXJuIG51bGxcbn1cblxuZXhwb3J0IGxldCBpc09iamVjdCA9IChvYmopID0+IHtcbiAgcmV0dXJuIG9iaiAhPT0gbnVsbCAmJiB0eXBlb2Ygb2JqID09PSBcIm9iamVjdFwiICYmICEob2JqIGluc3RhbmNlb2YgQXJyYXkpXG59XG5cbmV4cG9ydCBsZXQgaXNFcXVhbE9iaiA9IChvYmoxLCBvYmoyKSA9PiBKU09OLnN0cmluZ2lmeShvYmoxKSA9PT0gSlNPTi5zdHJpbmdpZnkob2JqMilcblxuZXhwb3J0IGxldCBpc0VtcHR5ID0gKG9iaikgPT4ge1xuICBmb3IobGV0IHggaW4gb2JqKXsgcmV0dXJuIGZhbHNlIH1cbiAgcmV0dXJuIHRydWVcbn1cblxuZXhwb3J0IGxldCBtYXliZSA9IChlbCwgY2FsbGJhY2spID0+IGVsICYmIGNhbGxiYWNrKGVsKVxuXG5leHBvcnQgbGV0IGNoYW5uZWxVcGxvYWRlciA9IGZ1bmN0aW9uIChlbnRyaWVzLCBvbkVycm9yLCByZXNwLCBsaXZlU29ja2V0KXtcbiAgZW50cmllcy5mb3JFYWNoKGVudHJ5ID0+IHtcbiAgICBsZXQgZW50cnlVcGxvYWRlciA9IG5ldyBFbnRyeVVwbG9hZGVyKGVudHJ5LCByZXNwLmNvbmZpZywgbGl2ZVNvY2tldClcbiAgICBlbnRyeVVwbG9hZGVyLnVwbG9hZCgpXG4gIH0pXG59XG4iLCAibGV0IEJyb3dzZXIgPSB7XG4gIGNhblB1c2hTdGF0ZSgpeyByZXR1cm4gKHR5cGVvZiAoaGlzdG9yeS5wdXNoU3RhdGUpICE9PSBcInVuZGVmaW5lZFwiKSB9LFxuXG4gIGRyb3BMb2NhbChsb2NhbFN0b3JhZ2UsIG5hbWVzcGFjZSwgc3Via2V5KXtcbiAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0odGhpcy5sb2NhbEtleShuYW1lc3BhY2UsIHN1YmtleSkpXG4gIH0sXG5cbiAgdXBkYXRlTG9jYWwobG9jYWxTdG9yYWdlLCBuYW1lc3BhY2UsIHN1YmtleSwgaW5pdGlhbCwgZnVuYyl7XG4gICAgbGV0IGN1cnJlbnQgPSB0aGlzLmdldExvY2FsKGxvY2FsU3RvcmFnZSwgbmFtZXNwYWNlLCBzdWJrZXkpXG4gICAgbGV0IGtleSA9IHRoaXMubG9jYWxLZXkobmFtZXNwYWNlLCBzdWJrZXkpXG4gICAgbGV0IG5ld1ZhbCA9IGN1cnJlbnQgPT09IG51bGwgPyBpbml0aWFsIDogZnVuYyhjdXJyZW50KVxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkobmV3VmFsKSlcbiAgICByZXR1cm4gbmV3VmFsXG4gIH0sXG5cbiAgZ2V0TG9jYWwobG9jYWxTdG9yYWdlLCBuYW1lc3BhY2UsIHN1YmtleSl7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5sb2NhbEtleShuYW1lc3BhY2UsIHN1YmtleSkpKVxuICB9LFxuXG4gIHVwZGF0ZUN1cnJlbnRTdGF0ZShjYWxsYmFjayl7XG4gICAgaWYoIXRoaXMuY2FuUHVzaFN0YXRlKCkpeyByZXR1cm4gfVxuICAgIGhpc3RvcnkucmVwbGFjZVN0YXRlKGNhbGxiYWNrKGhpc3Rvcnkuc3RhdGUgfHwge30pLCBcIlwiLCB3aW5kb3cubG9jYXRpb24uaHJlZilcbiAgfSxcblxuICBwdXNoU3RhdGUoa2luZCwgbWV0YSwgdG8pe1xuICAgIGlmKHRoaXMuY2FuUHVzaFN0YXRlKCkpe1xuICAgICAgaWYodG8gIT09IHdpbmRvdy5sb2NhdGlvbi5ocmVmKXtcbiAgICAgICAgaWYobWV0YS50eXBlID09IFwicmVkaXJlY3RcIiAmJiBtZXRhLnNjcm9sbCl7XG4gICAgICAgICAgLy8gSWYgd2UncmUgcmVkaXJlY3Rpbmcgc3RvcmUgdGhlIGN1cnJlbnQgc2Nyb2xsWSBmb3IgdGhlIGN1cnJlbnQgaGlzdG9yeSBzdGF0ZS5cbiAgICAgICAgICBsZXQgY3VycmVudFN0YXRlID0gaGlzdG9yeS5zdGF0ZSB8fCB7fVxuICAgICAgICAgIGN1cnJlbnRTdGF0ZS5zY3JvbGwgPSBtZXRhLnNjcm9sbFxuICAgICAgICAgIGhpc3RvcnkucmVwbGFjZVN0YXRlKGN1cnJlbnRTdGF0ZSwgXCJcIiwgd2luZG93LmxvY2F0aW9uLmhyZWYpXG4gICAgICAgIH1cblxuICAgICAgICBkZWxldGUgbWV0YS5zY3JvbGwgLy8gT25seSBzdG9yZSB0aGUgc2Nyb2xsIGluIHRoZSByZWRpcmVjdCBjYXNlLlxuICAgICAgICBoaXN0b3J5W2tpbmQgKyBcIlN0YXRlXCJdKG1ldGEsIFwiXCIsIHRvIHx8IG51bGwpIC8vIElFIHdpbGwgY29lcmNlIHVuZGVmaW5lZCB0byBzdHJpbmdcblxuICAgICAgICAvLyB3aGVuIHVzaW5nIG5hdmlnYXRlLCB3ZSdkIGNhbGwgcHVzaFN0YXRlIGltbWVkaWF0ZWx5IGJlZm9yZSBwYXRjaGluZyB0aGUgRE9NLFxuICAgICAgICAvLyBqdW1waW5nIGJhY2sgdG8gdGhlIHRvcCBvZiB0aGUgcGFnZSwgZWZmZWN0aXZlbHkgaWdub3JpbmcgdGhlIHNjcm9sbEludG9WaWV3O1xuICAgICAgICAvLyB0aGVyZWZvcmUgd2Ugd2FpdCBmb3IgdGhlIG5leHQgZnJhbWUgKGFmdGVyIHRoZSBET00gcGF0Y2gpIGFuZCBvbmx5IHRoZW4gdHJ5XG4gICAgICAgIC8vIHRvIHNjcm9sbCB0byB0aGUgaGFzaEVsXG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgIGxldCBoYXNoRWwgPSB0aGlzLmdldEhhc2hUYXJnZXRFbCh3aW5kb3cubG9jYXRpb24uaGFzaClcbiAgXG4gICAgICAgICAgaWYoaGFzaEVsKXtcbiAgICAgICAgICAgIGhhc2hFbC5zY3JvbGxJbnRvVmlldygpXG4gICAgICAgICAgfSBlbHNlIGlmKG1ldGEudHlwZSA9PT0gXCJyZWRpcmVjdFwiKXtcbiAgICAgICAgICAgIHdpbmRvdy5zY3JvbGwoMCwgMClcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVkaXJlY3QodG8pXG4gICAgfVxuICB9LFxuXG4gIHNldENvb2tpZShuYW1lLCB2YWx1ZSwgbWF4QWdlU2Vjb25kcyl7XG4gICAgbGV0IGV4cGlyZXMgPSB0eXBlb2YobWF4QWdlU2Vjb25kcykgPT09IFwibnVtYmVyXCIgPyBgIG1heC1hZ2U9JHttYXhBZ2VTZWNvbmRzfTtgIDogXCJcIlxuICAgIGRvY3VtZW50LmNvb2tpZSA9IGAke25hbWV9PSR7dmFsdWV9OyR7ZXhwaXJlc30gcGF0aD0vYFxuICB9LFxuXG4gIGdldENvb2tpZShuYW1lKXtcbiAgICByZXR1cm4gZG9jdW1lbnQuY29va2llLnJlcGxhY2UobmV3IFJlZ0V4cChgKD86KD86XnwuKjtcXHMqKSR7bmFtZX1cXHMqXFw9XFxzKihbXjtdKikuKiQpfF4uKiRgKSwgXCIkMVwiKVxuICB9LFxuXG4gIGRlbGV0ZUNvb2tpZShuYW1lKXtcbiAgICBkb2N1bWVudC5jb29raWUgPSBgJHtuYW1lfT07IG1heC1hZ2U9LTE7IHBhdGg9L2BcbiAgfSxcblxuICByZWRpcmVjdCh0b1VSTCwgZmxhc2gpe1xuICAgIGlmKGZsYXNoKXsgdGhpcy5zZXRDb29raWUoXCJfX3Bob2VuaXhfZmxhc2hfX1wiLCBmbGFzaCwgNjApIH1cbiAgICB3aW5kb3cubG9jYXRpb24gPSB0b1VSTFxuICB9LFxuXG4gIGxvY2FsS2V5KG5hbWVzcGFjZSwgc3Via2V5KXsgcmV0dXJuIGAke25hbWVzcGFjZX0tJHtzdWJrZXl9YCB9LFxuXG4gIGdldEhhc2hUYXJnZXRFbChtYXliZUhhc2gpe1xuICAgIGxldCBoYXNoID0gbWF5YmVIYXNoLnRvU3RyaW5nKCkuc3Vic3RyaW5nKDEpXG4gICAgaWYoaGFzaCA9PT0gXCJcIil7IHJldHVybiB9XG4gICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGhhc2gpIHx8IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGFbbmFtZT1cIiR7aGFzaH1cIl1gKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJyb3dzZXJcbiIsICJpbXBvcnQge1xuICBDSEVDS0FCTEVfSU5QVVRTLFxuICBERUJPVU5DRV9QUkVWX0tFWSxcbiAgREVCT1VOQ0VfVFJJR0dFUixcbiAgRk9DVVNBQkxFX0lOUFVUUyxcbiAgUEhYX0NPTVBPTkVOVCxcbiAgUEhYX0hBU19GT0NVU0VELFxuICBQSFhfSEFTX1NVQk1JVFRFRCxcbiAgUEhYX01BSU4sXG4gIFBIWF9QQVJFTlRfSUQsXG4gIFBIWF9QUklWQVRFLFxuICBQSFhfUkVGX1NSQyxcbiAgUEhYX1JFRl9MT0NLLFxuICBQSFhfUEVORElOR19BVFRSUyxcbiAgUEhYX1JPT1RfSUQsXG4gIFBIWF9TRVNTSU9OLFxuICBQSFhfU1RBVElDLFxuICBQSFhfVVBMT0FEX1JFRixcbiAgUEhYX1ZJRVdfU0VMRUNUT1IsXG4gIFBIWF9TVElDS1ksXG4gIFBIWF9FVkVOVF9DTEFTU0VTLFxuICBUSFJPVFRMRUQsXG59IGZyb20gXCIuL2NvbnN0YW50c1wiXG5cbmltcG9ydCB7XG4gIGxvZ0Vycm9yXG59IGZyb20gXCIuL3V0aWxzXCJcblxubGV0IERPTSA9IHtcbiAgYnlJZChpZCl7IHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkgfHwgbG9nRXJyb3IoYG5vIGlkIGZvdW5kIGZvciAke2lkfWApIH0sXG5cbiAgcmVtb3ZlQ2xhc3MoZWwsIGNsYXNzTmFtZSl7XG4gICAgZWwuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpXG4gICAgaWYoZWwuY2xhc3NMaXN0Lmxlbmd0aCA9PT0gMCl7IGVsLnJlbW92ZUF0dHJpYnV0ZShcImNsYXNzXCIpIH1cbiAgfSxcblxuICBhbGwobm9kZSwgcXVlcnksIGNhbGxiYWNrKXtcbiAgICBpZighbm9kZSl7IHJldHVybiBbXSB9XG4gICAgbGV0IGFycmF5ID0gQXJyYXkuZnJvbShub2RlLnF1ZXJ5U2VsZWN0b3JBbGwocXVlcnkpKVxuICAgIHJldHVybiBjYWxsYmFjayA/IGFycmF5LmZvckVhY2goY2FsbGJhY2spIDogYXJyYXlcbiAgfSxcblxuICBjaGlsZE5vZGVMZW5ndGgoaHRtbCl7XG4gICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRlbXBsYXRlXCIpXG4gICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gaHRtbFxuICAgIHJldHVybiB0ZW1wbGF0ZS5jb250ZW50LmNoaWxkRWxlbWVudENvdW50XG4gIH0sXG5cbiAgaXNVcGxvYWRJbnB1dChlbCl7IHJldHVybiBlbC50eXBlID09PSBcImZpbGVcIiAmJiBlbC5nZXRBdHRyaWJ1dGUoUEhYX1VQTE9BRF9SRUYpICE9PSBudWxsIH0sXG5cbiAgaXNBdXRvVXBsb2FkKGlucHV0RWwpeyByZXR1cm4gaW5wdXRFbC5oYXNBdHRyaWJ1dGUoXCJkYXRhLXBoeC1hdXRvLXVwbG9hZFwiKSB9LFxuXG4gIGZpbmRVcGxvYWRJbnB1dHMobm9kZSl7XG4gICAgY29uc3QgZm9ybUlkID0gbm9kZS5pZFxuICAgIGNvbnN0IGlucHV0c091dHNpZGVGb3JtID0gdGhpcy5hbGwoZG9jdW1lbnQsIGBpbnB1dFt0eXBlPVwiZmlsZVwiXVske1BIWF9VUExPQURfUkVGfV1bZm9ybT1cIiR7Zm9ybUlkfVwiXWApXG4gICAgcmV0dXJuIHRoaXMuYWxsKG5vZGUsIGBpbnB1dFt0eXBlPVwiZmlsZVwiXVske1BIWF9VUExPQURfUkVGfV1gKS5jb25jYXQoaW5wdXRzT3V0c2lkZUZvcm0pXG4gIH0sXG5cbiAgZmluZENvbXBvbmVudE5vZGVMaXN0KG5vZGUsIGNpZCl7XG4gICAgcmV0dXJuIHRoaXMuZmlsdGVyV2l0aGluU2FtZUxpdmVWaWV3KHRoaXMuYWxsKG5vZGUsIGBbJHtQSFhfQ09NUE9ORU5UfT1cIiR7Y2lkfVwiXWApLCBub2RlKVxuICB9LFxuXG4gIGlzUGh4RGVzdHJveWVkKG5vZGUpe1xuICAgIHJldHVybiBub2RlLmlkICYmIERPTS5wcml2YXRlKG5vZGUsIFwiZGVzdHJveWVkXCIpID8gdHJ1ZSA6IGZhbHNlXG4gIH0sXG5cbiAgd2FudHNOZXdUYWIoZSl7XG4gICAgbGV0IHdhbnRzTmV3VGFiID0gZS5jdHJsS2V5IHx8IGUuc2hpZnRLZXkgfHwgZS5tZXRhS2V5IHx8IChlLmJ1dHRvbiAmJiBlLmJ1dHRvbiA9PT0gMSlcbiAgICBsZXQgaXNEb3dubG9hZCA9IChlLnRhcmdldCBpbnN0YW5jZW9mIEhUTUxBbmNob3JFbGVtZW50ICYmIGUudGFyZ2V0Lmhhc0F0dHJpYnV0ZShcImRvd25sb2FkXCIpKVxuICAgIGxldCBpc1RhcmdldEJsYW5rID0gZS50YXJnZXQuaGFzQXR0cmlidXRlKFwidGFyZ2V0XCIpICYmIGUudGFyZ2V0LmdldEF0dHJpYnV0ZShcInRhcmdldFwiKS50b0xvd2VyQ2FzZSgpID09PSBcIl9ibGFua1wiXG4gICAgbGV0IGlzVGFyZ2V0TmFtZWRUYWIgPSBlLnRhcmdldC5oYXNBdHRyaWJ1dGUoXCJ0YXJnZXRcIikgJiYgIWUudGFyZ2V0LmdldEF0dHJpYnV0ZShcInRhcmdldFwiKS5zdGFydHNXaXRoKFwiX1wiKVxuICAgIHJldHVybiB3YW50c05ld1RhYiB8fCBpc1RhcmdldEJsYW5rIHx8IGlzRG93bmxvYWQgfHwgaXNUYXJnZXROYW1lZFRhYlxuICB9LFxuXG4gIGlzVW5sb2FkYWJsZUZvcm1TdWJtaXQoZSl7XG4gICAgLy8gSWdub3JlIGZvcm0gc3VibWlzc2lvbnMgaW50ZW5kZWQgdG8gY2xvc2UgYSBuYXRpdmUgPGRpYWxvZz4gZWxlbWVudFxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0hUTUwvRWxlbWVudC9kaWFsb2cjdXNhZ2Vfbm90ZXNcbiAgICBsZXQgaXNEaWFsb2dTdWJtaXQgPSAoZS50YXJnZXQgJiYgZS50YXJnZXQuZ2V0QXR0cmlidXRlKFwibWV0aG9kXCIpID09PSBcImRpYWxvZ1wiKSB8fFxuICAgICAgKGUuc3VibWl0dGVyICYmIGUuc3VibWl0dGVyLmdldEF0dHJpYnV0ZShcImZvcm1tZXRob2RcIikgPT09IFwiZGlhbG9nXCIpXG5cbiAgICBpZihpc0RpYWxvZ1N1Ym1pdCl7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICFlLmRlZmF1bHRQcmV2ZW50ZWQgJiYgIXRoaXMud2FudHNOZXdUYWIoZSlcbiAgICB9XG4gIH0sXG5cbiAgaXNOZXdQYWdlQ2xpY2soZSwgY3VycmVudExvY2F0aW9uKXtcbiAgICBsZXQgaHJlZiA9IGUudGFyZ2V0IGluc3RhbmNlb2YgSFRNTEFuY2hvckVsZW1lbnQgPyBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJocmVmXCIpIDogbnVsbFxuICAgIGxldCB1cmxcblxuICAgIGlmKGUuZGVmYXVsdFByZXZlbnRlZCB8fCBocmVmID09PSBudWxsIHx8IHRoaXMud2FudHNOZXdUYWIoZSkpeyByZXR1cm4gZmFsc2UgfVxuICAgIGlmKGhyZWYuc3RhcnRzV2l0aChcIm1haWx0bzpcIikgfHwgaHJlZi5zdGFydHNXaXRoKFwidGVsOlwiKSl7IHJldHVybiBmYWxzZSB9XG4gICAgaWYoZS50YXJnZXQuaXNDb250ZW50RWRpdGFibGUpeyByZXR1cm4gZmFsc2UgfVxuXG4gICAgdHJ5IHtcbiAgICAgIHVybCA9IG5ldyBVUkwoaHJlZilcbiAgICB9IGNhdGNoIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHVybCA9IG5ldyBVUkwoaHJlZiwgY3VycmVudExvY2F0aW9uKVxuICAgICAgfSBjYXRjaCB7XG4gICAgICAgIC8vIGJhZCBVUkwsIGZhbGxiYWNrIHRvIGxldCBicm93c2VyIHRyeSBpdCBhcyBleHRlcm5hbFxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmKHVybC5ob3N0ID09PSBjdXJyZW50TG9jYXRpb24uaG9zdCAmJiB1cmwucHJvdG9jb2wgPT09IGN1cnJlbnRMb2NhdGlvbi5wcm90b2NvbCl7XG4gICAgICBpZih1cmwucGF0aG5hbWUgPT09IGN1cnJlbnRMb2NhdGlvbi5wYXRobmFtZSAmJiB1cmwuc2VhcmNoID09PSBjdXJyZW50TG9jYXRpb24uc2VhcmNoKXtcbiAgICAgICAgcmV0dXJuIHVybC5oYXNoID09PSBcIlwiICYmICF1cmwuaHJlZi5lbmRzV2l0aChcIiNcIilcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHVybC5wcm90b2NvbC5zdGFydHNXaXRoKFwiaHR0cFwiKVxuICB9LFxuXG4gIG1hcmtQaHhDaGlsZERlc3Ryb3llZChlbCl7XG4gICAgaWYodGhpcy5pc1BoeENoaWxkKGVsKSl7IGVsLnNldEF0dHJpYnV0ZShQSFhfU0VTU0lPTiwgXCJcIikgfVxuICAgIHRoaXMucHV0UHJpdmF0ZShlbCwgXCJkZXN0cm95ZWRcIiwgdHJ1ZSlcbiAgfSxcblxuICBmaW5kUGh4Q2hpbGRyZW5JbkZyYWdtZW50KGh0bWwsIHBhcmVudElkKXtcbiAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGVtcGxhdGVcIilcbiAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBodG1sXG4gICAgcmV0dXJuIHRoaXMuZmluZFBoeENoaWxkcmVuKHRlbXBsYXRlLmNvbnRlbnQsIHBhcmVudElkKVxuICB9LFxuXG4gIGlzSWdub3JlZChlbCwgcGh4VXBkYXRlKXtcbiAgICByZXR1cm4gKGVsLmdldEF0dHJpYnV0ZShwaHhVcGRhdGUpIHx8IGVsLmdldEF0dHJpYnV0ZShcImRhdGEtcGh4LXVwZGF0ZVwiKSkgPT09IFwiaWdub3JlXCJcbiAgfSxcblxuICBpc1BoeFVwZGF0ZShlbCwgcGh4VXBkYXRlLCB1cGRhdGVUeXBlcyl7XG4gICAgcmV0dXJuIGVsLmdldEF0dHJpYnV0ZSAmJiB1cGRhdGVUeXBlcy5pbmRleE9mKGVsLmdldEF0dHJpYnV0ZShwaHhVcGRhdGUpKSA+PSAwXG4gIH0sXG5cbiAgZmluZFBoeFN0aWNreShlbCl7IHJldHVybiB0aGlzLmFsbChlbCwgYFske1BIWF9TVElDS1l9XWApIH0sXG5cbiAgZmluZFBoeENoaWxkcmVuKGVsLCBwYXJlbnRJZCl7XG4gICAgcmV0dXJuIHRoaXMuYWxsKGVsLCBgJHtQSFhfVklFV19TRUxFQ1RPUn1bJHtQSFhfUEFSRU5UX0lEfT1cIiR7cGFyZW50SWR9XCJdYClcbiAgfSxcblxuICBmaW5kRXhpc3RpbmdQYXJlbnRDSURzKG5vZGUsIGNpZHMpe1xuICAgIC8vIHdlIG9ubHkgd2FudCB0byBmaW5kIHBhcmVudHMgdGhhdCBleGlzdCBvbiB0aGUgcGFnZVxuICAgIC8vIGlmIGEgY2lkIGlzIG5vdCBvbiB0aGUgcGFnZSwgdGhlIG9ubHkgd2F5IGl0IGNhbiBiZSBhZGRlZCBiYWNrIHRvIHRoZSBwYWdlXG4gICAgLy8gaXMgaWYgYSBwYXJlbnQgYWRkcyBpdCBiYWNrLCB0aGVyZWZvcmUgaWYgYSBjaWQgZG9lcyBub3QgZXhpc3Qgb24gdGhlIHBhZ2UsXG4gICAgLy8gd2Ugc2hvdWxkIG5vdCB0cnkgdG8gcmVuZGVyIGl0IGJ5IGl0c2VsZiAoYmVjYXVzZSBpdCB3b3VsZCBiZSByZW5kZXJlZCB0d2ljZSxcbiAgICAvLyBvbmUgYnkgdGhlIHBhcmVudCwgYW5kIGEgc2Vjb25kIHRpbWUgYnkgaXRzZWxmKVxuICAgIGxldCBwYXJlbnRDaWRzID0gbmV3IFNldCgpXG4gICAgbGV0IGNoaWxkcmVuQ2lkcyA9IG5ldyBTZXQoKVxuXG4gICAgY2lkcy5mb3JFYWNoKGNpZCA9PiB7XG4gICAgICB0aGlzLmZpbHRlcldpdGhpblNhbWVMaXZlVmlldyh0aGlzLmFsbChub2RlLCBgWyR7UEhYX0NPTVBPTkVOVH09XCIke2NpZH1cIl1gKSwgbm9kZSkuZm9yRWFjaChwYXJlbnQgPT4ge1xuICAgICAgICBwYXJlbnRDaWRzLmFkZChjaWQpXG4gICAgICAgIHRoaXMuZmlsdGVyV2l0aGluU2FtZUxpdmVWaWV3KHRoaXMuYWxsKHBhcmVudCwgYFske1BIWF9DT01QT05FTlR9XWApLCBwYXJlbnQpXG4gICAgICAgICAgLm1hcChlbCA9PiBwYXJzZUludChlbC5nZXRBdHRyaWJ1dGUoUEhYX0NPTVBPTkVOVCkpKVxuICAgICAgICAgIC5mb3JFYWNoKGNoaWxkQ0lEID0+IGNoaWxkcmVuQ2lkcy5hZGQoY2hpbGRDSUQpKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgY2hpbGRyZW5DaWRzLmZvckVhY2goY2hpbGRDaWQgPT4gcGFyZW50Q2lkcy5kZWxldGUoY2hpbGRDaWQpKVxuXG4gICAgcmV0dXJuIHBhcmVudENpZHNcbiAgfSxcblxuICBmaWx0ZXJXaXRoaW5TYW1lTGl2ZVZpZXcobm9kZXMsIHBhcmVudCl7XG4gICAgaWYocGFyZW50LnF1ZXJ5U2VsZWN0b3IoUEhYX1ZJRVdfU0VMRUNUT1IpKXtcbiAgICAgIHJldHVybiBub2Rlcy5maWx0ZXIoZWwgPT4gdGhpcy53aXRoaW5TYW1lTGl2ZVZpZXcoZWwsIHBhcmVudCkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBub2Rlc1xuICAgIH1cbiAgfSxcblxuICB3aXRoaW5TYW1lTGl2ZVZpZXcobm9kZSwgcGFyZW50KXtcbiAgICB3aGlsZShub2RlID0gbm9kZS5wYXJlbnROb2RlKXtcbiAgICAgIGlmKG5vZGUuaXNTYW1lTm9kZShwYXJlbnQpKXsgcmV0dXJuIHRydWUgfVxuICAgICAgaWYobm9kZS5nZXRBdHRyaWJ1dGUoUEhYX1NFU1NJT04pICE9PSBudWxsKXsgcmV0dXJuIGZhbHNlIH1cbiAgICB9XG4gIH0sXG5cbiAgcHJpdmF0ZShlbCwga2V5KXsgcmV0dXJuIGVsW1BIWF9QUklWQVRFXSAmJiBlbFtQSFhfUFJJVkFURV1ba2V5XSB9LFxuXG4gIGRlbGV0ZVByaXZhdGUoZWwsIGtleSl7IGVsW1BIWF9QUklWQVRFXSAmJiBkZWxldGUgKGVsW1BIWF9QUklWQVRFXVtrZXldKSB9LFxuXG4gIHB1dFByaXZhdGUoZWwsIGtleSwgdmFsdWUpe1xuICAgIGlmKCFlbFtQSFhfUFJJVkFURV0peyBlbFtQSFhfUFJJVkFURV0gPSB7fSB9XG4gICAgZWxbUEhYX1BSSVZBVEVdW2tleV0gPSB2YWx1ZVxuICB9LFxuXG4gIHVwZGF0ZVByaXZhdGUoZWwsIGtleSwgZGVmYXVsdFZhbCwgdXBkYXRlRnVuYyl7XG4gICAgbGV0IGV4aXN0aW5nID0gdGhpcy5wcml2YXRlKGVsLCBrZXkpXG4gICAgaWYoZXhpc3RpbmcgPT09IHVuZGVmaW5lZCl7XG4gICAgICB0aGlzLnB1dFByaXZhdGUoZWwsIGtleSwgdXBkYXRlRnVuYyhkZWZhdWx0VmFsKSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wdXRQcml2YXRlKGVsLCBrZXksIHVwZGF0ZUZ1bmMoZXhpc3RpbmcpKVxuICAgIH1cbiAgfSxcblxuICBzeW5jUGVuZGluZ0F0dHJzKGZyb21FbCwgdG9FbCl7XG4gICAgaWYoIWZyb21FbC5oYXNBdHRyaWJ1dGUoUEhYX1JFRl9TUkMpKXsgcmV0dXJuIH1cbiAgICBQSFhfRVZFTlRfQ0xBU1NFUy5mb3JFYWNoKGNsYXNzTmFtZSA9PiB7XG4gICAgICBmcm9tRWwuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSkgJiYgdG9FbC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSlcbiAgICB9KVxuICAgIFBIWF9QRU5ESU5HX0FUVFJTLmZpbHRlcihhdHRyID0+IGZyb21FbC5oYXNBdHRyaWJ1dGUoYXR0cikpLmZvckVhY2goYXR0ciA9PiB7XG4gICAgICB0b0VsLnNldEF0dHJpYnV0ZShhdHRyLCBmcm9tRWwuZ2V0QXR0cmlidXRlKGF0dHIpKVxuICAgIH0pXG4gIH0sXG5cbiAgY29weVByaXZhdGVzKHRhcmdldCwgc291cmNlKXtcbiAgICBpZihzb3VyY2VbUEhYX1BSSVZBVEVdKXtcbiAgICAgIHRhcmdldFtQSFhfUFJJVkFURV0gPSBzb3VyY2VbUEhYX1BSSVZBVEVdXG4gICAgfVxuICB9LFxuXG4gIHB1dFRpdGxlKHN0cil7XG4gICAgbGV0IHRpdGxlRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwidGl0bGVcIilcbiAgICBpZih0aXRsZUVsKXtcbiAgICAgIGxldCB7cHJlZml4LCBzdWZmaXgsIGRlZmF1bHQ6IGRlZmF1bHRUaXRsZX0gPSB0aXRsZUVsLmRhdGFzZXRcbiAgICAgIGxldCBpc0VtcHR5ID0gdHlwZW9mKHN0cikgIT09IFwic3RyaW5nXCIgfHwgc3RyLnRyaW0oKSA9PT0gXCJcIlxuICAgICAgaWYoaXNFbXB0eSAmJiB0eXBlb2YoZGVmYXVsdFRpdGxlKSAhPT0gXCJzdHJpbmdcIil7IHJldHVybiB9XG5cbiAgICAgIGxldCBpbm5lciA9IGlzRW1wdHkgPyBkZWZhdWx0VGl0bGUgOiBzdHJcbiAgICAgIGRvY3VtZW50LnRpdGxlID0gYCR7cHJlZml4IHx8IFwiXCJ9JHtpbm5lciB8fCBcIlwifSR7c3VmZml4IHx8IFwiXCJ9YFxuICAgIH0gZWxzZSB7XG4gICAgICBkb2N1bWVudC50aXRsZSA9IHN0clxuICAgIH1cbiAgfSxcblxuICBkZWJvdW5jZShlbCwgZXZlbnQsIHBoeERlYm91bmNlLCBkZWZhdWx0RGVib3VuY2UsIHBoeFRocm90dGxlLCBkZWZhdWx0VGhyb3R0bGUsIGFzeW5jRmlsdGVyLCBjYWxsYmFjayl7XG4gICAgbGV0IGRlYm91bmNlID0gZWwuZ2V0QXR0cmlidXRlKHBoeERlYm91bmNlKVxuICAgIGxldCB0aHJvdHRsZSA9IGVsLmdldEF0dHJpYnV0ZShwaHhUaHJvdHRsZSlcblxuICAgIGlmKGRlYm91bmNlID09PSBcIlwiKXsgZGVib3VuY2UgPSBkZWZhdWx0RGVib3VuY2UgfVxuICAgIGlmKHRocm90dGxlID09PSBcIlwiKXsgdGhyb3R0bGUgPSBkZWZhdWx0VGhyb3R0bGUgfVxuICAgIGxldCB2YWx1ZSA9IGRlYm91bmNlIHx8IHRocm90dGxlXG4gICAgc3dpdGNoKHZhbHVlKXtcbiAgICAgIGNhc2UgbnVsbDogcmV0dXJuIGNhbGxiYWNrKClcblxuICAgICAgY2FzZSBcImJsdXJcIjpcbiAgICAgICAgdGhpcy5pbmNDeWNsZShlbCwgXCJkZWJvdW5jZS1ibHVyLWN5Y2xlXCIsICgpID0+IHtcbiAgICAgICAgICBpZihhc3luY0ZpbHRlcigpKXsgY2FsbGJhY2soKSB9XG4gICAgICAgIH0pXG4gICAgICAgIGlmKHRoaXMub25jZShlbCwgXCJkZWJvdW5jZS1ibHVyXCIpKXtcbiAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLCAoKSA9PiB0aGlzLnRyaWdnZXJDeWNsZShlbCwgXCJkZWJvdW5jZS1ibHVyLWN5Y2xlXCIpKVxuICAgICAgICB9XG4gICAgICAgIHJldHVyblxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBsZXQgdGltZW91dCA9IHBhcnNlSW50KHZhbHVlKVxuICAgICAgICBsZXQgdHJpZ2dlciA9ICgpID0+IHRocm90dGxlID8gdGhpcy5kZWxldGVQcml2YXRlKGVsLCBUSFJPVFRMRUQpIDogY2FsbGJhY2soKVxuICAgICAgICBsZXQgY3VycmVudEN5Y2xlID0gdGhpcy5pbmNDeWNsZShlbCwgREVCT1VOQ0VfVFJJR0dFUiwgdHJpZ2dlcilcbiAgICAgICAgaWYoaXNOYU4odGltZW91dCkpeyByZXR1cm4gbG9nRXJyb3IoYGludmFsaWQgdGhyb3R0bGUvZGVib3VuY2UgdmFsdWU6ICR7dmFsdWV9YCkgfVxuICAgICAgICBpZih0aHJvdHRsZSl7XG4gICAgICAgICAgbGV0IG5ld0tleURvd24gPSBmYWxzZVxuICAgICAgICAgIGlmKGV2ZW50LnR5cGUgPT09IFwia2V5ZG93blwiKXtcbiAgICAgICAgICAgIGxldCBwcmV2S2V5ID0gdGhpcy5wcml2YXRlKGVsLCBERUJPVU5DRV9QUkVWX0tFWSlcbiAgICAgICAgICAgIHRoaXMucHV0UHJpdmF0ZShlbCwgREVCT1VOQ0VfUFJFVl9LRVksIGV2ZW50LmtleSlcbiAgICAgICAgICAgIG5ld0tleURvd24gPSBwcmV2S2V5ICE9PSBldmVudC5rZXlcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZighbmV3S2V5RG93biAmJiB0aGlzLnByaXZhdGUoZWwsIFRIUk9UVExFRCkpe1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKClcbiAgICAgICAgICAgIGNvbnN0IHQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgaWYoYXN5bmNGaWx0ZXIoKSl7IHRoaXMudHJpZ2dlckN5Y2xlKGVsLCBERUJPVU5DRV9UUklHR0VSKSB9XG4gICAgICAgICAgICB9LCB0aW1lb3V0KVxuICAgICAgICAgICAgdGhpcy5wdXRQcml2YXRlKGVsLCBUSFJPVFRMRUQsIHQpXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgaWYoYXN5bmNGaWx0ZXIoKSl7IHRoaXMudHJpZ2dlckN5Y2xlKGVsLCBERUJPVU5DRV9UUklHR0VSLCBjdXJyZW50Q3ljbGUpIH1cbiAgICAgICAgICB9LCB0aW1lb3V0KVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGZvcm0gPSBlbC5mb3JtXG4gICAgICAgIGlmKGZvcm0gJiYgdGhpcy5vbmNlKGZvcm0sIFwiYmluZC1kZWJvdW5jZVwiKSl7XG4gICAgICAgICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsICgpID0+IHtcbiAgICAgICAgICAgIEFycmF5LmZyb20oKG5ldyBGb3JtRGF0YShmb3JtKSkuZW50cmllcygpLCAoW25hbWVdKSA9PiB7XG4gICAgICAgICAgICAgIGxldCBpbnB1dCA9IGZvcm0ucXVlcnlTZWxlY3RvcihgW25hbWU9XCIke25hbWV9XCJdYClcbiAgICAgICAgICAgICAgdGhpcy5pbmNDeWNsZShpbnB1dCwgREVCT1VOQ0VfVFJJR0dFUilcbiAgICAgICAgICAgICAgdGhpcy5kZWxldGVQcml2YXRlKGlucHV0LCBUSFJPVFRMRUQpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgaWYodGhpcy5vbmNlKGVsLCBcImJpbmQtZGVib3VuY2VcIikpe1xuICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJibHVyXCIsICgpID0+IHtcbiAgICAgICAgICAgIC8vIGJlY2F1c2Ugd2UgdHJpZ2dlciB0aGUgY2FsbGJhY2sgaGVyZSxcbiAgICAgICAgICAgIC8vIHdlIGFsc28gY2xlYXIgdGhlIHRocm90dGxlIHRpbWVvdXQgdG8gcHJldmVudCB0aGUgY2FsbGJhY2tcbiAgICAgICAgICAgIC8vIGZyb20gYmVpbmcgY2FsbGVkIGFnYWluIGFmdGVyIHRoZSB0aW1lb3V0IGZpcmVzXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5wcml2YXRlKGVsLCBUSFJPVFRMRUQpKVxuICAgICAgICAgICAgdGhpcy50cmlnZ2VyQ3ljbGUoZWwsIERFQk9VTkNFX1RSSUdHRVIpXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cbiAgfSxcblxuICB0cmlnZ2VyQ3ljbGUoZWwsIGtleSwgY3VycmVudEN5Y2xlKXtcbiAgICBsZXQgW2N5Y2xlLCB0cmlnZ2VyXSA9IHRoaXMucHJpdmF0ZShlbCwga2V5KVxuICAgIGlmKCFjdXJyZW50Q3ljbGUpeyBjdXJyZW50Q3ljbGUgPSBjeWNsZSB9XG4gICAgaWYoY3VycmVudEN5Y2xlID09PSBjeWNsZSl7XG4gICAgICB0aGlzLmluY0N5Y2xlKGVsLCBrZXkpXG4gICAgICB0cmlnZ2VyKClcbiAgICB9XG4gIH0sXG5cbiAgb25jZShlbCwga2V5KXtcbiAgICBpZih0aGlzLnByaXZhdGUoZWwsIGtleSkgPT09IHRydWUpeyByZXR1cm4gZmFsc2UgfVxuICAgIHRoaXMucHV0UHJpdmF0ZShlbCwga2V5LCB0cnVlKVxuICAgIHJldHVybiB0cnVlXG4gIH0sXG5cbiAgaW5jQ3ljbGUoZWwsIGtleSwgdHJpZ2dlciA9IGZ1bmN0aW9uICgpeyB9KXtcbiAgICBsZXQgW2N1cnJlbnRDeWNsZV0gPSB0aGlzLnByaXZhdGUoZWwsIGtleSkgfHwgWzAsIHRyaWdnZXJdXG4gICAgY3VycmVudEN5Y2xlKytcbiAgICB0aGlzLnB1dFByaXZhdGUoZWwsIGtleSwgW2N1cnJlbnRDeWNsZSwgdHJpZ2dlcl0pXG4gICAgcmV0dXJuIGN1cnJlbnRDeWNsZVxuICB9LFxuXG4gIC8vIG1haW50YWlucyBvciBhZGRzIHByaXZhdGVseSB1c2VkIGhvb2sgaW5mb3JtYXRpb25cbiAgLy8gZnJvbUVsIGFuZCB0b0VsIGNhbiBiZSB0aGUgc2FtZSBlbGVtZW50IGluIHRoZSBjYXNlIG9mIGEgbmV3bHkgYWRkZWQgbm9kZVxuICAvLyBmcm9tRWwgYW5kIHRvRWwgY2FuIGJlIGFueSBIVE1MIG5vZGUgdHlwZSwgc28gd2UgbmVlZCB0byBjaGVjayBpZiBpdCdzIGFuIGVsZW1lbnQgbm9kZVxuICBtYWludGFpblByaXZhdGVIb29rcyhmcm9tRWwsIHRvRWwsIHBoeFZpZXdwb3J0VG9wLCBwaHhWaWV3cG9ydEJvdHRvbSl7XG4gICAgLy8gbWFpbnRhaW4gdGhlIGhvb2tzIGNyZWF0ZWQgd2l0aCBjcmVhdGVIb29rXG4gICAgaWYoZnJvbUVsLmhhc0F0dHJpYnV0ZSAmJiBmcm9tRWwuaGFzQXR0cmlidXRlKFwiZGF0YS1waHgtaG9va1wiKSAmJiAhdG9FbC5oYXNBdHRyaWJ1dGUoXCJkYXRhLXBoeC1ob29rXCIpKXtcbiAgICAgIHRvRWwuc2V0QXR0cmlidXRlKFwiZGF0YS1waHgtaG9va1wiLCBmcm9tRWwuZ2V0QXR0cmlidXRlKFwiZGF0YS1waHgtaG9va1wiKSlcbiAgICB9XG4gICAgLy8gYWRkIGhvb2tzIHRvIGVsZW1lbnRzIHdpdGggdmlld3BvcnQgYXR0cmlidXRlc1xuICAgIGlmKHRvRWwuaGFzQXR0cmlidXRlICYmICh0b0VsLmhhc0F0dHJpYnV0ZShwaHhWaWV3cG9ydFRvcCkgfHwgdG9FbC5oYXNBdHRyaWJ1dGUocGh4Vmlld3BvcnRCb3R0b20pKSl7XG4gICAgICB0b0VsLnNldEF0dHJpYnV0ZShcImRhdGEtcGh4LWhvb2tcIiwgXCJQaG9lbml4LkluZmluaXRlU2Nyb2xsXCIpXG4gICAgfVxuICB9LFxuXG4gIHB1dEN1c3RvbUVsSG9vayhlbCwgaG9vayl7XG4gICAgaWYoZWwuaXNDb25uZWN0ZWQpe1xuICAgICAgZWwuc2V0QXR0cmlidXRlKFwiZGF0YS1waHgtaG9va1wiLCBcIlwiKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBcbiAgICAgICAgaG9vayBhdHRhY2hlZCB0byBub24tY29ubmVjdGVkIERPTSBlbGVtZW50XG4gICAgICAgIGVuc3VyZSB5b3UgYXJlIGNhbGxpbmcgY3JlYXRlSG9vayB3aXRoaW4geW91ciBjb25uZWN0ZWRDYWxsYmFjay4gJHtlbC5vdXRlckhUTUx9XG4gICAgICBgKVxuICAgIH1cbiAgICB0aGlzLnB1dFByaXZhdGUoZWwsIFwiY3VzdG9tLWVsLWhvb2tcIiwgaG9vaylcbiAgfSxcblxuICBnZXRDdXN0b21FbEhvb2soZWwpeyByZXR1cm4gdGhpcy5wcml2YXRlKGVsLCBcImN1c3RvbS1lbC1ob29rXCIpIH0sXG5cbiAgaXNVc2VkSW5wdXQoZWwpe1xuICAgIHJldHVybiAoZWwubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFICYmXG4gICAgICAodGhpcy5wcml2YXRlKGVsLCBQSFhfSEFTX0ZPQ1VTRUQpIHx8IHRoaXMucHJpdmF0ZShlbCwgUEhYX0hBU19TVUJNSVRURUQpKSlcbiAgfSxcblxuICByZXNldEZvcm0oZm9ybSl7XG4gICAgQXJyYXkuZnJvbShmb3JtLmVsZW1lbnRzKS5mb3JFYWNoKGlucHV0ID0+IHtcbiAgICAgIHRoaXMuZGVsZXRlUHJpdmF0ZShpbnB1dCwgUEhYX0hBU19GT0NVU0VEKVxuICAgICAgdGhpcy5kZWxldGVQcml2YXRlKGlucHV0LCBQSFhfSEFTX1NVQk1JVFRFRClcbiAgICB9KVxuICB9LFxuXG4gIGlzUGh4Q2hpbGQobm9kZSl7XG4gICAgcmV0dXJuIG5vZGUuZ2V0QXR0cmlidXRlICYmIG5vZGUuZ2V0QXR0cmlidXRlKFBIWF9QQVJFTlRfSUQpXG4gIH0sXG5cbiAgaXNQaHhTdGlja3kobm9kZSl7XG4gICAgcmV0dXJuIG5vZGUuZ2V0QXR0cmlidXRlICYmIG5vZGUuZ2V0QXR0cmlidXRlKFBIWF9TVElDS1kpICE9PSBudWxsXG4gIH0sXG5cbiAgaXNDaGlsZE9mQW55KGVsLCBwYXJlbnRzKXtcbiAgICByZXR1cm4gISFwYXJlbnRzLmZpbmQocGFyZW50ID0+IHBhcmVudC5jb250YWlucyhlbCkpXG4gIH0sXG5cbiAgZmlyc3RQaHhDaGlsZChlbCl7XG4gICAgcmV0dXJuIHRoaXMuaXNQaHhDaGlsZChlbCkgPyBlbCA6IHRoaXMuYWxsKGVsLCBgWyR7UEhYX1BBUkVOVF9JRH1dYClbMF1cbiAgfSxcblxuICBkaXNwYXRjaEV2ZW50KHRhcmdldCwgbmFtZSwgb3B0cyA9IHt9KXtcbiAgICBsZXQgZGVmYXVsdEJ1YmJsZSA9IHRydWVcbiAgICBsZXQgaXNVcGxvYWRUYXJnZXQgPSB0YXJnZXQubm9kZU5hbWUgPT09IFwiSU5QVVRcIiAmJiB0YXJnZXQudHlwZSA9PT0gXCJmaWxlXCJcbiAgICBpZihpc1VwbG9hZFRhcmdldCAmJiBuYW1lID09PSBcImNsaWNrXCIpe1xuICAgICAgZGVmYXVsdEJ1YmJsZSA9IGZhbHNlXG4gICAgfVxuICAgIGxldCBidWJibGVzID0gb3B0cy5idWJibGVzID09PSB1bmRlZmluZWQgPyBkZWZhdWx0QnViYmxlIDogISFvcHRzLmJ1YmJsZXNcbiAgICBsZXQgZXZlbnRPcHRzID0ge2J1YmJsZXM6IGJ1YmJsZXMsIGNhbmNlbGFibGU6IHRydWUsIGRldGFpbDogb3B0cy5kZXRhaWwgfHwge319XG4gICAgbGV0IGV2ZW50ID0gbmFtZSA9PT0gXCJjbGlja1wiID8gbmV3IE1vdXNlRXZlbnQoXCJjbGlja1wiLCBldmVudE9wdHMpIDogbmV3IEN1c3RvbUV2ZW50KG5hbWUsIGV2ZW50T3B0cylcbiAgICB0YXJnZXQuZGlzcGF0Y2hFdmVudChldmVudClcbiAgfSxcblxuICBjbG9uZU5vZGUobm9kZSwgaHRtbCl7XG4gICAgaWYodHlwZW9mIChodG1sKSA9PT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICByZXR1cm4gbm9kZS5jbG9uZU5vZGUodHJ1ZSlcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IGNsb25lZCA9IG5vZGUuY2xvbmVOb2RlKGZhbHNlKVxuICAgICAgY2xvbmVkLmlubmVySFRNTCA9IGh0bWxcbiAgICAgIHJldHVybiBjbG9uZWRcbiAgICB9XG4gIH0sXG5cbiAgLy8gbWVyZ2UgYXR0cmlidXRlcyBmcm9tIHNvdXJjZSB0byB0YXJnZXRcbiAgLy8gaWYgYW4gZWxlbWVudCBpcyBpZ25vcmVkLCB3ZSBvbmx5IG1lcmdlIGRhdGEgYXR0cmlidXRlc1xuICAvLyBpbmNsdWRpbmcgcmVtb3ZpbmcgZGF0YSBhdHRyaWJ1dGVzIHRoYXQgYXJlIG5vIGxvbmdlciBpbiB0aGUgc291cmNlXG4gIG1lcmdlQXR0cnModGFyZ2V0LCBzb3VyY2UsIG9wdHMgPSB7fSl7XG4gICAgbGV0IGV4Y2x1ZGUgPSBuZXcgU2V0KG9wdHMuZXhjbHVkZSB8fCBbXSlcbiAgICBsZXQgaXNJZ25vcmVkID0gb3B0cy5pc0lnbm9yZWRcbiAgICBsZXQgc291cmNlQXR0cnMgPSBzb3VyY2UuYXR0cmlidXRlc1xuICAgIGZvcihsZXQgaSA9IHNvdXJjZUF0dHJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKXtcbiAgICAgIGxldCBuYW1lID0gc291cmNlQXR0cnNbaV0ubmFtZVxuICAgICAgaWYoIWV4Y2x1ZGUuaGFzKG5hbWUpKXtcbiAgICAgICAgY29uc3Qgc291cmNlVmFsdWUgPSBzb3VyY2UuZ2V0QXR0cmlidXRlKG5hbWUpXG4gICAgICAgIGlmKHRhcmdldC5nZXRBdHRyaWJ1dGUobmFtZSkgIT09IHNvdXJjZVZhbHVlICYmICghaXNJZ25vcmVkIHx8IChpc0lnbm9yZWQgJiYgbmFtZS5zdGFydHNXaXRoKFwiZGF0YS1cIikpKSl7XG4gICAgICAgICAgdGFyZ2V0LnNldEF0dHJpYnV0ZShuYW1lLCBzb3VyY2VWYWx1ZSlcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gV2UgZXhjbHVkZSB0aGUgdmFsdWUgZnJvbSBiZWluZyBtZXJnZWQgb24gZm9jdXNlZCBpbnB1dHMsIGJlY2F1c2UgdGhlXG4gICAgICAgIC8vIHVzZXIncyBpbnB1dCBzaG91bGQgYWx3YXlzIHdpbi5cbiAgICAgICAgLy8gV2UgY2FuIHN0aWxsIGFzc2lnbiBpdCBhcyBsb25nIGFzIHRoZSB2YWx1ZSBwcm9wZXJ0eSBpcyB0aGUgc2FtZSwgdGhvdWdoLlxuICAgICAgICAvLyBUaGlzIHByZXZlbnRzIGEgc2l0dWF0aW9uIHdoZXJlIHRoZSB1cGRhdGVkIGhvb2sgaXMgbm90IGJlaW5nIHRyaWdnZXJlZFxuICAgICAgICAvLyB3aGVuIGFuIGlucHV0IGlzIGJhY2sgaW4gaXRzIFwib3JpZ2luYWwgc3RhdGVcIiwgYmVjYXVzZSB0aGUgYXR0cmlidXRlXG4gICAgICAgIC8vIHdhcyBuZXZlciBjaGFuZ2VkLCBzZWU6XG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9waG9lbml4ZnJhbWV3b3JrL3Bob2VuaXhfbGl2ZV92aWV3L2lzc3Vlcy8yMTYzXG4gICAgICAgIGlmKG5hbWUgPT09IFwidmFsdWVcIiAmJiB0YXJnZXQudmFsdWUgPT09IHNvdXJjZS52YWx1ZSl7XG4gICAgICAgICAgLy8gYWN0dWFsbHkgc2V0IHRoZSB2YWx1ZSBhdHRyaWJ1dGUgdG8gc3luYyBpdCB3aXRoIHRoZSB2YWx1ZSBwcm9wZXJ0eVxuICAgICAgICAgIHRhcmdldC5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLCBzb3VyY2UuZ2V0QXR0cmlidXRlKG5hbWUpKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IHRhcmdldEF0dHJzID0gdGFyZ2V0LmF0dHJpYnV0ZXNcbiAgICBmb3IobGV0IGkgPSB0YXJnZXRBdHRycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSl7XG4gICAgICBsZXQgbmFtZSA9IHRhcmdldEF0dHJzW2ldLm5hbWVcbiAgICAgIGlmKGlzSWdub3JlZCl7XG4gICAgICAgIGlmKG5hbWUuc3RhcnRzV2l0aChcImRhdGEtXCIpICYmICFzb3VyY2UuaGFzQXR0cmlidXRlKG5hbWUpICYmICFQSFhfUEVORElOR19BVFRSUy5pbmNsdWRlcyhuYW1lKSl7IHRhcmdldC5yZW1vdmVBdHRyaWJ1dGUobmFtZSkgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYoIXNvdXJjZS5oYXNBdHRyaWJ1dGUobmFtZSkpeyB0YXJnZXQucmVtb3ZlQXR0cmlidXRlKG5hbWUpIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgbWVyZ2VGb2N1c2VkSW5wdXQodGFyZ2V0LCBzb3VyY2Upe1xuICAgIC8vIHNraXAgc2VsZWN0cyBiZWNhdXNlIEZGIHdpbGwgcmVzZXQgaGlnaGxpZ2h0ZWQgaW5kZXggZm9yIGFueSBzZXRBdHRyaWJ1dGVcbiAgICBpZighKHRhcmdldCBpbnN0YW5jZW9mIEhUTUxTZWxlY3RFbGVtZW50KSl7IERPTS5tZXJnZUF0dHJzKHRhcmdldCwgc291cmNlLCB7ZXhjbHVkZTogW1widmFsdWVcIl19KSB9XG5cbiAgICBpZihzb3VyY2UucmVhZE9ubHkpe1xuICAgICAgdGFyZ2V0LnNldEF0dHJpYnV0ZShcInJlYWRvbmx5XCIsIHRydWUpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRhcmdldC5yZW1vdmVBdHRyaWJ1dGUoXCJyZWFkb25seVwiKVxuICAgIH1cbiAgfSxcblxuICBoYXNTZWxlY3Rpb25SYW5nZShlbCl7XG4gICAgcmV0dXJuIGVsLnNldFNlbGVjdGlvblJhbmdlICYmIChlbC50eXBlID09PSBcInRleHRcIiB8fCBlbC50eXBlID09PSBcInRleHRhcmVhXCIpXG4gIH0sXG5cbiAgcmVzdG9yZUZvY3VzKGZvY3VzZWQsIHNlbGVjdGlvblN0YXJ0LCBzZWxlY3Rpb25FbmQpe1xuICAgIGlmKGZvY3VzZWQgaW5zdGFuY2VvZiBIVE1MU2VsZWN0RWxlbWVudCl7IGZvY3VzZWQuZm9jdXMoKSB9XG4gICAgaWYoIURPTS5pc1RleHR1YWxJbnB1dChmb2N1c2VkKSl7IHJldHVybiB9XG5cbiAgICBsZXQgd2FzRm9jdXNlZCA9IGZvY3VzZWQubWF0Y2hlcyhcIjpmb2N1c1wiKVxuICAgIGlmKCF3YXNGb2N1c2VkKXsgZm9jdXNlZC5mb2N1cygpIH1cbiAgICBpZih0aGlzLmhhc1NlbGVjdGlvblJhbmdlKGZvY3VzZWQpKXtcbiAgICAgIGZvY3VzZWQuc2V0U2VsZWN0aW9uUmFuZ2Uoc2VsZWN0aW9uU3RhcnQsIHNlbGVjdGlvbkVuZClcbiAgICB9XG4gIH0sXG5cbiAgaXNGb3JtSW5wdXQoZWwpeyByZXR1cm4gL14oPzppbnB1dHxzZWxlY3R8dGV4dGFyZWEpJC9pLnRlc3QoZWwudGFnTmFtZSkgJiYgZWwudHlwZSAhPT0gXCJidXR0b25cIiB9LFxuXG4gIHN5bmNBdHRyc1RvUHJvcHMoZWwpe1xuICAgIGlmKGVsIGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCAmJiBDSEVDS0FCTEVfSU5QVVRTLmluZGV4T2YoZWwudHlwZS50b0xvY2FsZUxvd2VyQ2FzZSgpKSA+PSAwKXtcbiAgICAgIGVsLmNoZWNrZWQgPSBlbC5nZXRBdHRyaWJ1dGUoXCJjaGVja2VkXCIpICE9PSBudWxsXG4gICAgfVxuICB9LFxuXG4gIGlzVGV4dHVhbElucHV0KGVsKXsgcmV0dXJuIEZPQ1VTQUJMRV9JTlBVVFMuaW5kZXhPZihlbC50eXBlKSA+PSAwIH0sXG5cbiAgaXNOb3dUcmlnZ2VyRm9ybUV4dGVybmFsKGVsLCBwaHhUcmlnZ2VyRXh0ZXJuYWwpe1xuICAgIHJldHVybiBlbC5nZXRBdHRyaWJ1dGUgJiYgZWwuZ2V0QXR0cmlidXRlKHBoeFRyaWdnZXJFeHRlcm5hbCkgIT09IG51bGwgJiYgZG9jdW1lbnQuYm9keS5jb250YWlucyhlbClcbiAgfSxcblxuICBjbGVhbkNoaWxkTm9kZXMoY29udGFpbmVyLCBwaHhVcGRhdGUpe1xuICAgIGlmKERPTS5pc1BoeFVwZGF0ZShjb250YWluZXIsIHBoeFVwZGF0ZSwgW1wiYXBwZW5kXCIsIFwicHJlcGVuZFwiXSkpe1xuICAgICAgbGV0IHRvUmVtb3ZlID0gW11cbiAgICAgIGNvbnRhaW5lci5jaGlsZE5vZGVzLmZvckVhY2goY2hpbGROb2RlID0+IHtcbiAgICAgICAgaWYoIWNoaWxkTm9kZS5pZCl7XG4gICAgICAgICAgLy8gU2tpcCB3YXJuaW5nIGlmIGl0J3MgYW4gZW1wdHkgdGV4dCBub2RlIChlLmcuIGEgbmV3LWxpbmUpXG4gICAgICAgICAgbGV0IGlzRW1wdHlUZXh0Tm9kZSA9IGNoaWxkTm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUgJiYgY2hpbGROb2RlLm5vZGVWYWx1ZS50cmltKCkgPT09IFwiXCJcbiAgICAgICAgICBpZighaXNFbXB0eVRleHROb2RlICYmIGNoaWxkTm9kZS5ub2RlVHlwZSAhPT0gTm9kZS5DT01NRU5UX05PREUpe1xuICAgICAgICAgICAgbG9nRXJyb3IoXCJvbmx5IEhUTUwgZWxlbWVudCB0YWdzIHdpdGggYW4gaWQgYXJlIGFsbG93ZWQgaW5zaWRlIGNvbnRhaW5lcnMgd2l0aCBwaHgtdXBkYXRlLlxcblxcblwiICtcbiAgICAgICAgICAgICAgYHJlbW92aW5nIGlsbGVnYWwgbm9kZTogXCIkeyhjaGlsZE5vZGUub3V0ZXJIVE1MIHx8IGNoaWxkTm9kZS5ub2RlVmFsdWUpLnRyaW0oKX1cIlxcblxcbmApXG4gICAgICAgICAgfVxuICAgICAgICAgIHRvUmVtb3ZlLnB1c2goY2hpbGROb2RlKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgdG9SZW1vdmUuZm9yRWFjaChjaGlsZE5vZGUgPT4gY2hpbGROb2RlLnJlbW92ZSgpKVxuICAgIH1cbiAgfSxcblxuICByZXBsYWNlUm9vdENvbnRhaW5lcihjb250YWluZXIsIHRhZ05hbWUsIGF0dHJzKXtcbiAgICBsZXQgcmV0YWluZWRBdHRycyA9IG5ldyBTZXQoW1wiaWRcIiwgUEhYX1NFU1NJT04sIFBIWF9TVEFUSUMsIFBIWF9NQUlOLCBQSFhfUk9PVF9JRF0pXG4gICAgaWYoY29udGFpbmVyLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gdGFnTmFtZS50b0xvd2VyQ2FzZSgpKXtcbiAgICAgIEFycmF5LmZyb20oY29udGFpbmVyLmF0dHJpYnV0ZXMpXG4gICAgICAgIC5maWx0ZXIoYXR0ciA9PiAhcmV0YWluZWRBdHRycy5oYXMoYXR0ci5uYW1lLnRvTG93ZXJDYXNlKCkpKVxuICAgICAgICAuZm9yRWFjaChhdHRyID0+IGNvbnRhaW5lci5yZW1vdmVBdHRyaWJ1dGUoYXR0ci5uYW1lKSlcblxuICAgICAgT2JqZWN0LmtleXMoYXR0cnMpXG4gICAgICAgIC5maWx0ZXIobmFtZSA9PiAhcmV0YWluZWRBdHRycy5oYXMobmFtZS50b0xvd2VyQ2FzZSgpKSlcbiAgICAgICAgLmZvckVhY2goYXR0ciA9PiBjb250YWluZXIuc2V0QXR0cmlidXRlKGF0dHIsIGF0dHJzW2F0dHJdKSlcblxuICAgICAgcmV0dXJuIGNvbnRhaW5lclxuXG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBuZXdDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZ05hbWUpXG4gICAgICBPYmplY3Qua2V5cyhhdHRycykuZm9yRWFjaChhdHRyID0+IG5ld0NvbnRhaW5lci5zZXRBdHRyaWJ1dGUoYXR0ciwgYXR0cnNbYXR0cl0pKVxuICAgICAgcmV0YWluZWRBdHRycy5mb3JFYWNoKGF0dHIgPT4gbmV3Q29udGFpbmVyLnNldEF0dHJpYnV0ZShhdHRyLCBjb250YWluZXIuZ2V0QXR0cmlidXRlKGF0dHIpKSlcbiAgICAgIG5ld0NvbnRhaW5lci5pbm5lckhUTUwgPSBjb250YWluZXIuaW5uZXJIVE1MXG4gICAgICBjb250YWluZXIucmVwbGFjZVdpdGgobmV3Q29udGFpbmVyKVxuICAgICAgcmV0dXJuIG5ld0NvbnRhaW5lclxuICAgIH1cbiAgfSxcblxuICBnZXRTdGlja3koZWwsIG5hbWUsIGRlZmF1bHRWYWwpe1xuICAgIGxldCBvcCA9IChET00ucHJpdmF0ZShlbCwgXCJzdGlja3lcIikgfHwgW10pLmZpbmQoKFtleGlzdGluZ05hbWUsXSkgPT4gbmFtZSA9PT0gZXhpc3RpbmdOYW1lKVxuICAgIGlmKG9wKXtcbiAgICAgIGxldCBbX25hbWUsIF9vcCwgc3Rhc2hlZFJlc3VsdF0gPSBvcFxuICAgICAgcmV0dXJuIHN0YXNoZWRSZXN1bHRcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHR5cGVvZihkZWZhdWx0VmFsKSA9PT0gXCJmdW5jdGlvblwiID8gZGVmYXVsdFZhbCgpIDogZGVmYXVsdFZhbFxuICAgIH1cbiAgfSxcblxuICBkZWxldGVTdGlja3koZWwsIG5hbWUpe1xuICAgIHRoaXMudXBkYXRlUHJpdmF0ZShlbCwgXCJzdGlja3lcIiwgW10sIG9wcyA9PiB7XG4gICAgICByZXR1cm4gb3BzLmZpbHRlcigoW2V4aXN0aW5nTmFtZSwgX10pID0+IGV4aXN0aW5nTmFtZSAhPT0gbmFtZSlcbiAgICB9KVxuICB9LFxuXG4gIHB1dFN0aWNreShlbCwgbmFtZSwgb3Ape1xuICAgIGxldCBzdGFzaGVkUmVzdWx0ID0gb3AoZWwpXG4gICAgdGhpcy51cGRhdGVQcml2YXRlKGVsLCBcInN0aWNreVwiLCBbXSwgb3BzID0+IHtcbiAgICAgIGxldCBleGlzdGluZ0luZGV4ID0gb3BzLmZpbmRJbmRleCgoW2V4aXN0aW5nTmFtZSxdKSA9PiBuYW1lID09PSBleGlzdGluZ05hbWUpXG4gICAgICBpZihleGlzdGluZ0luZGV4ID49IDApe1xuICAgICAgICBvcHNbZXhpc3RpbmdJbmRleF0gPSBbbmFtZSwgb3AsIHN0YXNoZWRSZXN1bHRdXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvcHMucHVzaChbbmFtZSwgb3AsIHN0YXNoZWRSZXN1bHRdKVxuICAgICAgfVxuICAgICAgcmV0dXJuIG9wc1xuICAgIH0pXG4gIH0sXG5cbiAgYXBwbHlTdGlja3lPcGVyYXRpb25zKGVsKXtcbiAgICBsZXQgb3BzID0gRE9NLnByaXZhdGUoZWwsIFwic3RpY2t5XCIpXG4gICAgaWYoIW9wcyl7IHJldHVybiB9XG5cbiAgICBvcHMuZm9yRWFjaCgoW25hbWUsIG9wLCBfc3Rhc2hlZF0pID0+IHRoaXMucHV0U3RpY2t5KGVsLCBuYW1lLCBvcCkpXG4gIH0sXG5cbiAgaXNMb2NrZWQoZWwpe1xuICAgIHJldHVybiBlbC5oYXNBdHRyaWJ1dGUgJiYgZWwuaGFzQXR0cmlidXRlKFBIWF9SRUZfTE9DSylcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBET01cbiIsICJpbXBvcnQge1xuICBQSFhfQUNUSVZFX0VOVFJZX1JFRlMsXG4gIFBIWF9MSVZFX0ZJTEVfVVBEQVRFRCxcbiAgUEhYX1BSRUZMSUdIVEVEX1JFRlNcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuaW1wb3J0IHtcbiAgY2hhbm5lbFVwbG9hZGVyLFxuICBsb2dFcnJvclxufSBmcm9tIFwiLi91dGlsc1wiXG5cbmltcG9ydCBMaXZlVXBsb2FkZXIgZnJvbSBcIi4vbGl2ZV91cGxvYWRlclwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFVwbG9hZEVudHJ5IHtcbiAgc3RhdGljIGlzQWN0aXZlKGZpbGVFbCwgZmlsZSl7XG4gICAgbGV0IGlzTmV3ID0gZmlsZS5fcGh4UmVmID09PSB1bmRlZmluZWRcbiAgICBsZXQgYWN0aXZlUmVmcyA9IGZpbGVFbC5nZXRBdHRyaWJ1dGUoUEhYX0FDVElWRV9FTlRSWV9SRUZTKS5zcGxpdChcIixcIilcbiAgICBsZXQgaXNBY3RpdmUgPSBhY3RpdmVSZWZzLmluZGV4T2YoTGl2ZVVwbG9hZGVyLmdlbkZpbGVSZWYoZmlsZSkpID49IDBcbiAgICByZXR1cm4gZmlsZS5zaXplID4gMCAmJiAoaXNOZXcgfHwgaXNBY3RpdmUpXG4gIH1cblxuICBzdGF0aWMgaXNQcmVmbGlnaHRlZChmaWxlRWwsIGZpbGUpe1xuICAgIGxldCBwcmVmbGlnaHRlZFJlZnMgPSBmaWxlRWwuZ2V0QXR0cmlidXRlKFBIWF9QUkVGTElHSFRFRF9SRUZTKS5zcGxpdChcIixcIilcbiAgICBsZXQgaXNQcmVmbGlnaHRlZCA9IHByZWZsaWdodGVkUmVmcy5pbmRleE9mKExpdmVVcGxvYWRlci5nZW5GaWxlUmVmKGZpbGUpKSA+PSAwXG4gICAgcmV0dXJuIGlzUHJlZmxpZ2h0ZWQgJiYgdGhpcy5pc0FjdGl2ZShmaWxlRWwsIGZpbGUpXG4gIH1cblxuICBzdGF0aWMgaXNQcmVmbGlnaHRJblByb2dyZXNzKGZpbGUpe1xuICAgIHJldHVybiBmaWxlLl9wcmVmbGlnaHRJblByb2dyZXNzID09PSB0cnVlXG4gIH1cblxuICBzdGF0aWMgbWFya1ByZWZsaWdodEluUHJvZ3Jlc3MoZmlsZSl7XG4gICAgZmlsZS5fcHJlZmxpZ2h0SW5Qcm9ncmVzcyA9IHRydWVcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKGZpbGVFbCwgZmlsZSwgdmlldywgYXV0b1VwbG9hZCl7XG4gICAgdGhpcy5yZWYgPSBMaXZlVXBsb2FkZXIuZ2VuRmlsZVJlZihmaWxlKVxuICAgIHRoaXMuZmlsZUVsID0gZmlsZUVsXG4gICAgdGhpcy5maWxlID0gZmlsZVxuICAgIHRoaXMudmlldyA9IHZpZXdcbiAgICB0aGlzLm1ldGEgPSBudWxsXG4gICAgdGhpcy5faXNDYW5jZWxsZWQgPSBmYWxzZVxuICAgIHRoaXMuX2lzRG9uZSA9IGZhbHNlXG4gICAgdGhpcy5fcHJvZ3Jlc3MgPSAwXG4gICAgdGhpcy5fbGFzdFByb2dyZXNzU2VudCA9IC0xXG4gICAgdGhpcy5fb25Eb25lID0gZnVuY3Rpb24oKXsgfVxuICAgIHRoaXMuX29uRWxVcGRhdGVkID0gdGhpcy5vbkVsVXBkYXRlZC5iaW5kKHRoaXMpXG4gICAgdGhpcy5maWxlRWwuYWRkRXZlbnRMaXN0ZW5lcihQSFhfTElWRV9GSUxFX1VQREFURUQsIHRoaXMuX29uRWxVcGRhdGVkKVxuICAgIHRoaXMuYXV0b1VwbG9hZCA9IGF1dG9VcGxvYWRcbiAgfVxuXG4gIG1ldGFkYXRhKCl7IHJldHVybiB0aGlzLm1ldGEgfVxuXG4gIHByb2dyZXNzKHByb2dyZXNzKXtcbiAgICB0aGlzLl9wcm9ncmVzcyA9IE1hdGguZmxvb3IocHJvZ3Jlc3MpXG4gICAgaWYodGhpcy5fcHJvZ3Jlc3MgPiB0aGlzLl9sYXN0UHJvZ3Jlc3NTZW50KXtcbiAgICAgIGlmKHRoaXMuX3Byb2dyZXNzID49IDEwMCl7XG4gICAgICAgIHRoaXMuX3Byb2dyZXNzID0gMTAwXG4gICAgICAgIHRoaXMuX2xhc3RQcm9ncmVzc1NlbnQgPSAxMDBcbiAgICAgICAgdGhpcy5faXNEb25lID0gdHJ1ZVxuICAgICAgICB0aGlzLnZpZXcucHVzaEZpbGVQcm9ncmVzcyh0aGlzLmZpbGVFbCwgdGhpcy5yZWYsIDEwMCwgKCkgPT4ge1xuICAgICAgICAgIExpdmVVcGxvYWRlci51bnRyYWNrRmlsZSh0aGlzLmZpbGVFbCwgdGhpcy5maWxlKVxuICAgICAgICAgIHRoaXMuX29uRG9uZSgpXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9sYXN0UHJvZ3Jlc3NTZW50ID0gdGhpcy5fcHJvZ3Jlc3NcbiAgICAgICAgdGhpcy52aWV3LnB1c2hGaWxlUHJvZ3Jlc3ModGhpcy5maWxlRWwsIHRoaXMucmVmLCB0aGlzLl9wcm9ncmVzcylcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpc0NhbmNlbGxlZCgpeyByZXR1cm4gdGhpcy5faXNDYW5jZWxsZWQgfVxuXG4gIGNhbmNlbCgpe1xuICAgIHRoaXMuZmlsZS5fcHJlZmxpZ2h0SW5Qcm9ncmVzcyA9IGZhbHNlXG4gICAgdGhpcy5faXNDYW5jZWxsZWQgPSB0cnVlXG4gICAgdGhpcy5faXNEb25lID0gdHJ1ZVxuICAgIHRoaXMuX29uRG9uZSgpXG4gIH1cblxuICBpc0RvbmUoKXsgcmV0dXJuIHRoaXMuX2lzRG9uZSB9XG5cbiAgZXJyb3IocmVhc29uID0gXCJmYWlsZWRcIil7XG4gICAgdGhpcy5maWxlRWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihQSFhfTElWRV9GSUxFX1VQREFURUQsIHRoaXMuX29uRWxVcGRhdGVkKVxuICAgIHRoaXMudmlldy5wdXNoRmlsZVByb2dyZXNzKHRoaXMuZmlsZUVsLCB0aGlzLnJlZiwge2Vycm9yOiByZWFzb259KVxuICAgIGlmKCF0aGlzLmlzQXV0b1VwbG9hZCgpKXsgTGl2ZVVwbG9hZGVyLmNsZWFyRmlsZXModGhpcy5maWxlRWwpIH1cbiAgfVxuXG4gIGlzQXV0b1VwbG9hZCgpeyByZXR1cm4gdGhpcy5hdXRvVXBsb2FkIH1cblxuICAvL3ByaXZhdGVcblxuICBvbkRvbmUoY2FsbGJhY2spe1xuICAgIHRoaXMuX29uRG9uZSA9ICgpID0+IHtcbiAgICAgIHRoaXMuZmlsZUVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoUEhYX0xJVkVfRklMRV9VUERBVEVELCB0aGlzLl9vbkVsVXBkYXRlZClcbiAgICAgIGNhbGxiYWNrKClcbiAgICB9XG4gIH1cblxuICBvbkVsVXBkYXRlZCgpe1xuICAgIGxldCBhY3RpdmVSZWZzID0gdGhpcy5maWxlRWwuZ2V0QXR0cmlidXRlKFBIWF9BQ1RJVkVfRU5UUllfUkVGUykuc3BsaXQoXCIsXCIpXG4gICAgaWYoYWN0aXZlUmVmcy5pbmRleE9mKHRoaXMucmVmKSA9PT0gLTEpe1xuICAgICAgTGl2ZVVwbG9hZGVyLnVudHJhY2tGaWxlKHRoaXMuZmlsZUVsLCB0aGlzLmZpbGUpXG4gICAgICB0aGlzLmNhbmNlbCgpXG4gICAgfVxuICB9XG5cbiAgdG9QcmVmbGlnaHRQYXlsb2FkKCl7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxhc3RfbW9kaWZpZWQ6IHRoaXMuZmlsZS5sYXN0TW9kaWZpZWQsXG4gICAgICBuYW1lOiB0aGlzLmZpbGUubmFtZSxcbiAgICAgIHJlbGF0aXZlX3BhdGg6IHRoaXMuZmlsZS53ZWJraXRSZWxhdGl2ZVBhdGgsXG4gICAgICBzaXplOiB0aGlzLmZpbGUuc2l6ZSxcbiAgICAgIHR5cGU6IHRoaXMuZmlsZS50eXBlLFxuICAgICAgcmVmOiB0aGlzLnJlZixcbiAgICAgIG1ldGE6IHR5cGVvZih0aGlzLmZpbGUubWV0YSkgPT09IFwiZnVuY3Rpb25cIiA/IHRoaXMuZmlsZS5tZXRhKCkgOiB1bmRlZmluZWRcbiAgICB9XG4gIH1cblxuICB1cGxvYWRlcih1cGxvYWRlcnMpe1xuICAgIGlmKHRoaXMubWV0YS51cGxvYWRlcil7XG4gICAgICBsZXQgY2FsbGJhY2sgPSB1cGxvYWRlcnNbdGhpcy5tZXRhLnVwbG9hZGVyXSB8fCBsb2dFcnJvcihgbm8gdXBsb2FkZXIgY29uZmlndXJlZCBmb3IgJHt0aGlzLm1ldGEudXBsb2FkZXJ9YClcbiAgICAgIHJldHVybiB7bmFtZTogdGhpcy5tZXRhLnVwbG9hZGVyLCBjYWxsYmFjazogY2FsbGJhY2t9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7bmFtZTogXCJjaGFubmVsXCIsIGNhbGxiYWNrOiBjaGFubmVsVXBsb2FkZXJ9XG4gICAgfVxuICB9XG5cbiAgemlwUG9zdEZsaWdodChyZXNwKXtcbiAgICB0aGlzLm1ldGEgPSByZXNwLmVudHJpZXNbdGhpcy5yZWZdXG4gICAgaWYoIXRoaXMubWV0YSl7IGxvZ0Vycm9yKGBubyBwcmVmbGlnaHQgdXBsb2FkIHJlc3BvbnNlIHJldHVybmVkIHdpdGggcmVmICR7dGhpcy5yZWZ9YCwge2lucHV0OiB0aGlzLmZpbGVFbCwgcmVzcG9uc2U6IHJlc3B9KSB9XG4gIH1cbn1cbiIsICJpbXBvcnQge1xuICBQSFhfRE9ORV9SRUZTLFxuICBQSFhfUFJFRkxJR0hURURfUkVGUyxcbiAgUEhYX1VQTE9BRF9SRUZcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuaW1wb3J0IHtcbn0gZnJvbSBcIi4vdXRpbHNcIlxuXG5pbXBvcnQgRE9NIGZyb20gXCIuL2RvbVwiXG5pbXBvcnQgVXBsb2FkRW50cnkgZnJvbSBcIi4vdXBsb2FkX2VudHJ5XCJcblxubGV0IGxpdmVVcGxvYWRlckZpbGVSZWYgPSAwXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpdmVVcGxvYWRlciB7XG4gIHN0YXRpYyBnZW5GaWxlUmVmKGZpbGUpe1xuICAgIGxldCByZWYgPSBmaWxlLl9waHhSZWZcbiAgICBpZihyZWYgIT09IHVuZGVmaW5lZCl7XG4gICAgICByZXR1cm4gcmVmXG4gICAgfSBlbHNlIHtcbiAgICAgIGZpbGUuX3BoeFJlZiA9IChsaXZlVXBsb2FkZXJGaWxlUmVmKyspLnRvU3RyaW5nKClcbiAgICAgIHJldHVybiBmaWxlLl9waHhSZWZcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgZ2V0RW50cnlEYXRhVVJMKGlucHV0RWwsIHJlZiwgY2FsbGJhY2spe1xuICAgIGxldCBmaWxlID0gdGhpcy5hY3RpdmVGaWxlcyhpbnB1dEVsKS5maW5kKGZpbGUgPT4gdGhpcy5nZW5GaWxlUmVmKGZpbGUpID09PSByZWYpXG4gICAgY2FsbGJhY2soVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlKSlcbiAgfVxuXG4gIHN0YXRpYyBoYXNVcGxvYWRzSW5Qcm9ncmVzcyhmb3JtRWwpe1xuICAgIGxldCBhY3RpdmUgPSAwXG4gICAgRE9NLmZpbmRVcGxvYWRJbnB1dHMoZm9ybUVsKS5mb3JFYWNoKGlucHV0ID0+IHtcbiAgICAgIGlmKGlucHV0LmdldEF0dHJpYnV0ZShQSFhfUFJFRkxJR0hURURfUkVGUykgIT09IGlucHV0LmdldEF0dHJpYnV0ZShQSFhfRE9ORV9SRUZTKSl7XG4gICAgICAgIGFjdGl2ZSsrXG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gYWN0aXZlID4gMFxuICB9XG5cbiAgc3RhdGljIHNlcmlhbGl6ZVVwbG9hZHMoaW5wdXRFbCl7XG4gICAgbGV0IGZpbGVzID0gdGhpcy5hY3RpdmVGaWxlcyhpbnB1dEVsKVxuICAgIGxldCBmaWxlRGF0YSA9IHt9XG4gICAgZmlsZXMuZm9yRWFjaChmaWxlID0+IHtcbiAgICAgIGxldCBlbnRyeSA9IHtwYXRoOiBpbnB1dEVsLm5hbWV9XG4gICAgICBsZXQgdXBsb2FkUmVmID0gaW5wdXRFbC5nZXRBdHRyaWJ1dGUoUEhYX1VQTE9BRF9SRUYpXG4gICAgICBmaWxlRGF0YVt1cGxvYWRSZWZdID0gZmlsZURhdGFbdXBsb2FkUmVmXSB8fCBbXVxuICAgICAgZW50cnkucmVmID0gdGhpcy5nZW5GaWxlUmVmKGZpbGUpXG4gICAgICBlbnRyeS5sYXN0X21vZGlmaWVkID0gZmlsZS5sYXN0TW9kaWZpZWRcbiAgICAgIGVudHJ5Lm5hbWUgPSBmaWxlLm5hbWUgfHwgZW50cnkucmVmXG4gICAgICBlbnRyeS5yZWxhdGl2ZV9wYXRoID0gZmlsZS53ZWJraXRSZWxhdGl2ZVBhdGhcbiAgICAgIGVudHJ5LnR5cGUgPSBmaWxlLnR5cGVcbiAgICAgIGVudHJ5LnNpemUgPSBmaWxlLnNpemVcbiAgICAgIGlmKHR5cGVvZihmaWxlLm1ldGEpID09PSBcImZ1bmN0aW9uXCIpeyBlbnRyeS5tZXRhID0gZmlsZS5tZXRhKCkgfVxuICAgICAgZmlsZURhdGFbdXBsb2FkUmVmXS5wdXNoKGVudHJ5KVxuICAgIH0pXG4gICAgcmV0dXJuIGZpbGVEYXRhXG4gIH1cblxuICBzdGF0aWMgY2xlYXJGaWxlcyhpbnB1dEVsKXtcbiAgICBpbnB1dEVsLnZhbHVlID0gbnVsbFxuICAgIGlucHV0RWwucmVtb3ZlQXR0cmlidXRlKFBIWF9VUExPQURfUkVGKVxuICAgIERPTS5wdXRQcml2YXRlKGlucHV0RWwsIFwiZmlsZXNcIiwgW10pXG4gIH1cblxuICBzdGF0aWMgdW50cmFja0ZpbGUoaW5wdXRFbCwgZmlsZSl7XG4gICAgRE9NLnB1dFByaXZhdGUoaW5wdXRFbCwgXCJmaWxlc1wiLCBET00ucHJpdmF0ZShpbnB1dEVsLCBcImZpbGVzXCIpLmZpbHRlcihmID0+ICFPYmplY3QuaXMoZiwgZmlsZSkpKVxuICB9XG5cbiAgc3RhdGljIHRyYWNrRmlsZXMoaW5wdXRFbCwgZmlsZXMsIGRhdGFUcmFuc2Zlcil7XG4gICAgaWYoaW5wdXRFbC5nZXRBdHRyaWJ1dGUoXCJtdWx0aXBsZVwiKSAhPT0gbnVsbCl7XG4gICAgICBsZXQgbmV3RmlsZXMgPSBmaWxlcy5maWx0ZXIoZmlsZSA9PiAhdGhpcy5hY3RpdmVGaWxlcyhpbnB1dEVsKS5maW5kKGYgPT4gT2JqZWN0LmlzKGYsIGZpbGUpKSlcbiAgICAgIERPTS51cGRhdGVQcml2YXRlKGlucHV0RWwsIFwiZmlsZXNcIiwgW10sIChleGlzdGluZykgPT4gZXhpc3RpbmcuY29uY2F0KG5ld0ZpbGVzKSlcbiAgICAgIGlucHV0RWwudmFsdWUgPSBudWxsXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJlc2V0IGlucHV0RWwgZmlsZXMgdG8gYWxpZ24gb3V0cHV0IHdpdGggcHJvZ3JhbW1hdGljIGNoYW5nZXMgKGkuZS4gZHJhZyBhbmQgZHJvcClcbiAgICAgIGlmKGRhdGFUcmFuc2ZlciAmJiBkYXRhVHJhbnNmZXIuZmlsZXMubGVuZ3RoID4gMCl7IGlucHV0RWwuZmlsZXMgPSBkYXRhVHJhbnNmZXIuZmlsZXMgfVxuICAgICAgRE9NLnB1dFByaXZhdGUoaW5wdXRFbCwgXCJmaWxlc1wiLCBmaWxlcylcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgYWN0aXZlRmlsZUlucHV0cyhmb3JtRWwpe1xuICAgIGxldCBmaWxlSW5wdXRzID0gRE9NLmZpbmRVcGxvYWRJbnB1dHMoZm9ybUVsKVxuICAgIHJldHVybiBBcnJheS5mcm9tKGZpbGVJbnB1dHMpLmZpbHRlcihlbCA9PiBlbC5maWxlcyAmJiB0aGlzLmFjdGl2ZUZpbGVzKGVsKS5sZW5ndGggPiAwKVxuICB9XG5cbiAgc3RhdGljIGFjdGl2ZUZpbGVzKGlucHV0KXtcbiAgICByZXR1cm4gKERPTS5wcml2YXRlKGlucHV0LCBcImZpbGVzXCIpIHx8IFtdKS5maWx0ZXIoZiA9PiBVcGxvYWRFbnRyeS5pc0FjdGl2ZShpbnB1dCwgZikpXG4gIH1cblxuICBzdGF0aWMgaW5wdXRzQXdhaXRpbmdQcmVmbGlnaHQoZm9ybUVsKXtcbiAgICBsZXQgZmlsZUlucHV0cyA9IERPTS5maW5kVXBsb2FkSW5wdXRzKGZvcm1FbClcbiAgICByZXR1cm4gQXJyYXkuZnJvbShmaWxlSW5wdXRzKS5maWx0ZXIoaW5wdXQgPT4gdGhpcy5maWxlc0F3YWl0aW5nUHJlZmxpZ2h0KGlucHV0KS5sZW5ndGggPiAwKVxuICB9XG5cbiAgc3RhdGljIGZpbGVzQXdhaXRpbmdQcmVmbGlnaHQoaW5wdXQpe1xuICAgIHJldHVybiB0aGlzLmFjdGl2ZUZpbGVzKGlucHV0KS5maWx0ZXIoZiA9PiAhVXBsb2FkRW50cnkuaXNQcmVmbGlnaHRlZChpbnB1dCwgZikgJiYgIVVwbG9hZEVudHJ5LmlzUHJlZmxpZ2h0SW5Qcm9ncmVzcyhmKSlcbiAgfVxuXG4gIHN0YXRpYyBtYXJrUHJlZmxpZ2h0SW5Qcm9ncmVzcyhlbnRyaWVzKXtcbiAgICBlbnRyaWVzLmZvckVhY2goZW50cnkgPT4gVXBsb2FkRW50cnkubWFya1ByZWZsaWdodEluUHJvZ3Jlc3MoZW50cnkuZmlsZSkpXG4gIH1cblxuICBjb25zdHJ1Y3RvcihpbnB1dEVsLCB2aWV3LCBvbkNvbXBsZXRlKXtcbiAgICB0aGlzLmF1dG9VcGxvYWQgPSBET00uaXNBdXRvVXBsb2FkKGlucHV0RWwpXG4gICAgdGhpcy52aWV3ID0gdmlld1xuICAgIHRoaXMub25Db21wbGV0ZSA9IG9uQ29tcGxldGVcbiAgICB0aGlzLl9lbnRyaWVzID1cbiAgICAgIEFycmF5LmZyb20oTGl2ZVVwbG9hZGVyLmZpbGVzQXdhaXRpbmdQcmVmbGlnaHQoaW5wdXRFbCkgfHwgW10pXG4gICAgICAgIC5tYXAoZmlsZSA9PiBuZXcgVXBsb2FkRW50cnkoaW5wdXRFbCwgZmlsZSwgdmlldywgdGhpcy5hdXRvVXBsb2FkKSlcblxuICAgIC8vIHByZXZlbnQgc2VuZGluZyBkdXBsaWNhdGUgcHJlZmxpZ2h0IHJlcXVlc3RzXG4gICAgTGl2ZVVwbG9hZGVyLm1hcmtQcmVmbGlnaHRJblByb2dyZXNzKHRoaXMuX2VudHJpZXMpXG5cbiAgICB0aGlzLm51bUVudHJpZXNJblByb2dyZXNzID0gdGhpcy5fZW50cmllcy5sZW5ndGhcbiAgfVxuXG4gIGlzQXV0b1VwbG9hZCgpeyByZXR1cm4gdGhpcy5hdXRvVXBsb2FkIH1cblxuICBlbnRyaWVzKCl7IHJldHVybiB0aGlzLl9lbnRyaWVzIH1cblxuICBpbml0QWRhcHRlclVwbG9hZChyZXNwLCBvbkVycm9yLCBsaXZlU29ja2V0KXtcbiAgICB0aGlzLl9lbnRyaWVzID1cbiAgICAgIHRoaXMuX2VudHJpZXMubWFwKGVudHJ5ID0+IHtcbiAgICAgICAgaWYoZW50cnkuaXNDYW5jZWxsZWQoKSl7XG4gICAgICAgICAgdGhpcy5udW1FbnRyaWVzSW5Qcm9ncmVzcy0tXG4gICAgICAgICAgaWYodGhpcy5udW1FbnRyaWVzSW5Qcm9ncmVzcyA9PT0gMCl7IHRoaXMub25Db21wbGV0ZSgpIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbnRyeS56aXBQb3N0RmxpZ2h0KHJlc3ApXG4gICAgICAgICAgZW50cnkub25Eb25lKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMubnVtRW50cmllc0luUHJvZ3Jlc3MtLVxuICAgICAgICAgICAgaWYodGhpcy5udW1FbnRyaWVzSW5Qcm9ncmVzcyA9PT0gMCl7IHRoaXMub25Db21wbGV0ZSgpIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbnRyeVxuICAgICAgfSlcblxuICAgIGxldCBncm91cGVkRW50cmllcyA9IHRoaXMuX2VudHJpZXMucmVkdWNlKChhY2MsIGVudHJ5KSA9PiB7XG4gICAgICBpZighZW50cnkubWV0YSl7IHJldHVybiBhY2MgfVxuICAgICAgbGV0IHtuYW1lLCBjYWxsYmFja30gPSBlbnRyeS51cGxvYWRlcihsaXZlU29ja2V0LnVwbG9hZGVycylcbiAgICAgIGFjY1tuYW1lXSA9IGFjY1tuYW1lXSB8fCB7Y2FsbGJhY2s6IGNhbGxiYWNrLCBlbnRyaWVzOiBbXX1cbiAgICAgIGFjY1tuYW1lXS5lbnRyaWVzLnB1c2goZW50cnkpXG4gICAgICByZXR1cm4gYWNjXG4gICAgfSwge30pXG5cbiAgICBmb3IobGV0IG5hbWUgaW4gZ3JvdXBlZEVudHJpZXMpe1xuICAgICAgbGV0IHtjYWxsYmFjaywgZW50cmllc30gPSBncm91cGVkRW50cmllc1tuYW1lXVxuICAgICAgY2FsbGJhY2soZW50cmllcywgb25FcnJvciwgcmVzcCwgbGl2ZVNvY2tldClcbiAgICB9XG4gIH1cbn1cbiIsICJsZXQgQVJJQSA9IHtcbiAgYW55T2YoaW5zdGFuY2UsIGNsYXNzZXMpeyByZXR1cm4gY2xhc3Nlcy5maW5kKG5hbWUgPT4gaW5zdGFuY2UgaW5zdGFuY2VvZiBuYW1lKSB9LFxuXG4gIGlzRm9jdXNhYmxlKGVsLCBpbnRlcmFjdGl2ZU9ubHkpe1xuICAgIHJldHVybiAoXG4gICAgICAoZWwgaW5zdGFuY2VvZiBIVE1MQW5jaG9yRWxlbWVudCAmJiBlbC5yZWwgIT09IFwiaWdub3JlXCIpIHx8XG4gICAgICAoZWwgaW5zdGFuY2VvZiBIVE1MQXJlYUVsZW1lbnQgJiYgZWwuaHJlZiAhPT0gdW5kZWZpbmVkKSB8fFxuICAgICAgKCFlbC5kaXNhYmxlZCAmJiAodGhpcy5hbnlPZihlbCwgW0hUTUxJbnB1dEVsZW1lbnQsIEhUTUxTZWxlY3RFbGVtZW50LCBIVE1MVGV4dEFyZWFFbGVtZW50LCBIVE1MQnV0dG9uRWxlbWVudF0pKSkgfHxcbiAgICAgIChlbCBpbnN0YW5jZW9mIEhUTUxJRnJhbWVFbGVtZW50KSB8fFxuICAgICAgKGVsLnRhYkluZGV4ID4gMCB8fCAoIWludGVyYWN0aXZlT25seSAmJiBlbC5nZXRBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiKSAhPT0gbnVsbCAmJiBlbC5nZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiKSAhPT0gXCJ0cnVlXCIpKVxuICAgIClcbiAgfSxcblxuICBhdHRlbXB0Rm9jdXMoZWwsIGludGVyYWN0aXZlT25seSl7XG4gICAgaWYodGhpcy5pc0ZvY3VzYWJsZShlbCwgaW50ZXJhY3RpdmVPbmx5KSl7IHRyeSB7IGVsLmZvY3VzKCkgfSBjYXRjaCB7fSB9XG4gICAgcmV0dXJuICEhZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50LmlzU2FtZU5vZGUoZWwpXG4gIH0sXG5cbiAgZm9jdXNGaXJzdEludGVyYWN0aXZlKGVsKXtcbiAgICBsZXQgY2hpbGQgPSBlbC5maXJzdEVsZW1lbnRDaGlsZFxuICAgIHdoaWxlKGNoaWxkKXtcbiAgICAgIGlmKHRoaXMuYXR0ZW1wdEZvY3VzKGNoaWxkLCB0cnVlKSB8fCB0aGlzLmZvY3VzRmlyc3RJbnRlcmFjdGl2ZShjaGlsZCwgdHJ1ZSkpe1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgICAgY2hpbGQgPSBjaGlsZC5uZXh0RWxlbWVudFNpYmxpbmdcbiAgICB9XG4gIH0sXG5cbiAgZm9jdXNGaXJzdChlbCl7XG4gICAgbGV0IGNoaWxkID0gZWwuZmlyc3RFbGVtZW50Q2hpbGRcbiAgICB3aGlsZShjaGlsZCl7XG4gICAgICBpZih0aGlzLmF0dGVtcHRGb2N1cyhjaGlsZCkgfHwgdGhpcy5mb2N1c0ZpcnN0KGNoaWxkKSl7XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG4gICAgICBjaGlsZCA9IGNoaWxkLm5leHRFbGVtZW50U2libGluZ1xuICAgIH1cbiAgfSxcblxuICBmb2N1c0xhc3QoZWwpe1xuICAgIGxldCBjaGlsZCA9IGVsLmxhc3RFbGVtZW50Q2hpbGRcbiAgICB3aGlsZShjaGlsZCl7XG4gICAgICBpZih0aGlzLmF0dGVtcHRGb2N1cyhjaGlsZCkgfHwgdGhpcy5mb2N1c0xhc3QoY2hpbGQpKXtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICAgIGNoaWxkID0gY2hpbGQucHJldmlvdXNFbGVtZW50U2libGluZ1xuICAgIH1cbiAgfVxufVxuZXhwb3J0IGRlZmF1bHQgQVJJQVxuIiwgImltcG9ydCB7XG4gIFBIWF9BQ1RJVkVfRU5UUllfUkVGUyxcbiAgUEhYX0xJVkVfRklMRV9VUERBVEVELFxuICBQSFhfUFJFRkxJR0hURURfUkVGUyxcbiAgUEhYX1VQTE9BRF9SRUZcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuaW1wb3J0IExpdmVVcGxvYWRlciBmcm9tIFwiLi9saXZlX3VwbG9hZGVyXCJcbmltcG9ydCBBUklBIGZyb20gXCIuL2FyaWFcIlxuXG5sZXQgSG9va3MgPSB7XG4gIExpdmVGaWxlVXBsb2FkOiB7XG4gICAgYWN0aXZlUmVmcygpeyByZXR1cm4gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoUEhYX0FDVElWRV9FTlRSWV9SRUZTKSB9LFxuXG4gICAgcHJlZmxpZ2h0ZWRSZWZzKCl7IHJldHVybiB0aGlzLmVsLmdldEF0dHJpYnV0ZShQSFhfUFJFRkxJR0hURURfUkVGUykgfSxcblxuICAgIG1vdW50ZWQoKXsgdGhpcy5wcmVmbGlnaHRlZFdhcyA9IHRoaXMucHJlZmxpZ2h0ZWRSZWZzKCkgfSxcblxuICAgIHVwZGF0ZWQoKXtcbiAgICAgIGxldCBuZXdQcmVmbGlnaHRzID0gdGhpcy5wcmVmbGlnaHRlZFJlZnMoKVxuICAgICAgaWYodGhpcy5wcmVmbGlnaHRlZFdhcyAhPT0gbmV3UHJlZmxpZ2h0cyl7XG4gICAgICAgIHRoaXMucHJlZmxpZ2h0ZWRXYXMgPSBuZXdQcmVmbGlnaHRzXG4gICAgICAgIGlmKG5ld1ByZWZsaWdodHMgPT09IFwiXCIpe1xuICAgICAgICAgIHRoaXMuX192aWV3KCkuY2FuY2VsU3VibWl0KHRoaXMuZWwuZm9ybSlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZih0aGlzLmFjdGl2ZVJlZnMoKSA9PT0gXCJcIil7IHRoaXMuZWwudmFsdWUgPSBudWxsIH1cbiAgICAgIHRoaXMuZWwuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoUEhYX0xJVkVfRklMRV9VUERBVEVEKSlcbiAgICB9XG4gIH0sXG5cbiAgTGl2ZUltZ1ByZXZpZXc6IHtcbiAgICBtb3VudGVkKCl7XG4gICAgICB0aGlzLnJlZiA9IHRoaXMuZWwuZ2V0QXR0cmlidXRlKFwiZGF0YS1waHgtZW50cnktcmVmXCIpXG4gICAgICB0aGlzLmlucHV0RWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmVsLmdldEF0dHJpYnV0ZShQSFhfVVBMT0FEX1JFRikpXG4gICAgICBMaXZlVXBsb2FkZXIuZ2V0RW50cnlEYXRhVVJMKHRoaXMuaW5wdXRFbCwgdGhpcy5yZWYsIHVybCA9PiB7XG4gICAgICAgIHRoaXMudXJsID0gdXJsXG4gICAgICAgIHRoaXMuZWwuc3JjID0gdXJsXG4gICAgICB9KVxuICAgIH0sXG4gICAgZGVzdHJveWVkKCl7XG4gICAgICBVUkwucmV2b2tlT2JqZWN0VVJMKHRoaXMudXJsKVxuICAgIH1cbiAgfSxcbiAgRm9jdXNXcmFwOiB7XG4gICAgbW91bnRlZCgpe1xuICAgICAgdGhpcy5mb2N1c1N0YXJ0ID0gdGhpcy5lbC5maXJzdEVsZW1lbnRDaGlsZFxuICAgICAgdGhpcy5mb2N1c0VuZCA9IHRoaXMuZWwubGFzdEVsZW1lbnRDaGlsZFxuICAgICAgdGhpcy5mb2N1c1N0YXJ0LmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLCAoZSkgPT4ge1xuICAgICAgICBpZighZS5yZWxhdGVkVGFyZ2V0IHx8ICF0aGlzLmVsLmNvbnRhaW5zKGUucmVsYXRlZFRhcmdldCkpeyBcbiAgICAgICAgICAvLyBIYW5kbGUgZm9jdXMgZW50ZXJpbmcgZnJvbSBvdXRzaWRlIChlLmcuIFRhYiB3aGVuIGJvZHkgaXMgZm9jdXNlZClcbiAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vcGhvZW5peGZyYW1ld29yay9waG9lbml4X2xpdmVfdmlldy9pc3N1ZXMvMzYzNlxuICAgICAgICAgIGNvbnN0IG5leHRGb2N1cyA9IGUudGFyZ2V0Lm5leHRFbGVtZW50U2libGluZ1xuICAgICAgICAgIEFSSUEuYXR0ZW1wdEZvY3VzKG5leHRGb2N1cykgfHwgQVJJQS5mb2N1c0ZpcnN0KG5leHRGb2N1cylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBBUklBLmZvY3VzTGFzdCh0aGlzLmVsKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgdGhpcy5mb2N1c0VuZC5hZGRFdmVudExpc3RlbmVyKFwiZm9jdXNcIiwgKGUpID0+IHtcbiAgICAgICAgaWYoIWUucmVsYXRlZFRhcmdldCB8fCAhdGhpcy5lbC5jb250YWlucyhlLnJlbGF0ZWRUYXJnZXQpKXsgXG4gICAgICAgICAgLy8gSGFuZGxlIGZvY3VzIGVudGVyaW5nIGZyb20gb3V0c2lkZSAoZS5nLiBTaGlmdCtUYWIgd2hlbiBib2R5IGlzIGZvY3VzZWQpXG4gICAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3Bob2VuaXhmcmFtZXdvcmsvcGhvZW5peF9saXZlX3ZpZXcvaXNzdWVzLzM2MzZcbiAgICAgICAgICBjb25zdCBuZXh0Rm9jdXMgPSBlLnRhcmdldC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nXG4gICAgICAgICAgQVJJQS5hdHRlbXB0Rm9jdXMobmV4dEZvY3VzKSB8fCBBUklBLmZvY3VzTGFzdChuZXh0Rm9jdXMpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgQVJJQS5mb2N1c0ZpcnN0KHRoaXMuZWwpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoXCJwaHg6c2hvdy1lbmRcIiwgKCkgPT4gdGhpcy5lbC5mb2N1cygpKVxuICAgICAgaWYod2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5lbCkuZGlzcGxheSAhPT0gXCJub25lXCIpe1xuICAgICAgICBBUklBLmZvY3VzRmlyc3QodGhpcy5lbClcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxubGV0IGZpbmRTY3JvbGxDb250YWluZXIgPSAoZWwpID0+IHtcbiAgLy8gdGhlIHNjcm9sbCBldmVudCB3b24ndCBiZSBmaXJlZCBvbiB0aGUgaHRtbC9ib2R5IGVsZW1lbnQgZXZlbiBpZiBvdmVyZmxvdyBpcyBzZXRcbiAgLy8gdGhlcmVmb3JlIHdlIHJldHVybiBudWxsIHRvIGluc3RlYWQgbGlzdGVuIGZvciBzY3JvbGwgZXZlbnRzIG9uIGRvY3VtZW50XG4gIGlmKFtcIkhUTUxcIiwgXCJCT0RZXCJdLmluZGV4T2YoZWwubm9kZU5hbWUudG9VcHBlckNhc2UoKSkgPj0gMCkgcmV0dXJuIG51bGxcbiAgaWYoW1wic2Nyb2xsXCIsIFwiYXV0b1wiXS5pbmRleE9mKGdldENvbXB1dGVkU3R5bGUoZWwpLm92ZXJmbG93WSkgPj0gMCkgcmV0dXJuIGVsXG4gIHJldHVybiBmaW5kU2Nyb2xsQ29udGFpbmVyKGVsLnBhcmVudEVsZW1lbnQpXG59XG5cbmxldCBzY3JvbGxUb3AgPSAoc2Nyb2xsQ29udGFpbmVyKSA9PiB7XG4gIGlmKHNjcm9sbENvbnRhaW5lcil7XG4gICAgcmV0dXJuIHNjcm9sbENvbnRhaW5lci5zY3JvbGxUb3BcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcCB8fCBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcFxuICB9XG59XG5cbmxldCBib3R0b20gPSAoc2Nyb2xsQ29udGFpbmVyKSA9PiB7XG4gIGlmKHNjcm9sbENvbnRhaW5lcil7XG4gICAgcmV0dXJuIHNjcm9sbENvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5ib3R0b21cbiAgfSBlbHNlIHtcbiAgICAvLyB3aGVuIHdlIGhhdmUgbm8gY29udGFpbmVyLCB0aGUgd2hvbGUgcGFnZSBzY3JvbGxzLFxuICAgIC8vIHRoZXJlZm9yZSB0aGUgYm90dG9tIGNvb3JkaW5hdGUgaXMgdGhlIHZpZXdwb3J0IGhlaWdodFxuICAgIHJldHVybiB3aW5kb3cuaW5uZXJIZWlnaHQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodFxuICB9XG59XG5cbmxldCB0b3AgPSAoc2Nyb2xsQ29udGFpbmVyKSA9PiB7XG4gIGlmKHNjcm9sbENvbnRhaW5lcil7XG4gICAgcmV0dXJuIHNjcm9sbENvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3BcbiAgfSBlbHNlIHtcbiAgICAvLyB3aGVuIHdlIGhhdmUgbm8gY29udGFpbmVyIHRoZSB3aG9sZSBwYWdlIHNjcm9sbHMsXG4gICAgLy8gdGhlcmVmb3JlIHRoZSB0b3AgY29vcmRpbmF0ZSBpcyAwXG4gICAgcmV0dXJuIDBcbiAgfVxufVxuXG5sZXQgaXNBdFZpZXdwb3J0VG9wID0gKGVsLCBzY3JvbGxDb250YWluZXIpID0+IHtcbiAgbGV0IHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICByZXR1cm4gTWF0aC5jZWlsKHJlY3QudG9wKSA+PSB0b3Aoc2Nyb2xsQ29udGFpbmVyKSAmJiBNYXRoLmNlaWwocmVjdC5sZWZ0KSA+PSAwICYmIE1hdGguZmxvb3IocmVjdC50b3ApIDw9IGJvdHRvbShzY3JvbGxDb250YWluZXIpXG59XG5cbmxldCBpc0F0Vmlld3BvcnRCb3R0b20gPSAoZWwsIHNjcm9sbENvbnRhaW5lcikgPT4ge1xuICBsZXQgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gIHJldHVybiBNYXRoLmNlaWwocmVjdC5ib3R0b20pID49IHRvcChzY3JvbGxDb250YWluZXIpICYmIE1hdGguY2VpbChyZWN0LmxlZnQpID49IDAgJiYgTWF0aC5mbG9vcihyZWN0LmJvdHRvbSkgPD0gYm90dG9tKHNjcm9sbENvbnRhaW5lcilcbn1cblxubGV0IGlzV2l0aGluVmlld3BvcnQgPSAoZWwsIHNjcm9sbENvbnRhaW5lcikgPT4ge1xuICBsZXQgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gIHJldHVybiBNYXRoLmNlaWwocmVjdC50b3ApID49IHRvcChzY3JvbGxDb250YWluZXIpICYmIE1hdGguY2VpbChyZWN0LmxlZnQpID49IDAgJiYgTWF0aC5mbG9vcihyZWN0LnRvcCkgPD0gYm90dG9tKHNjcm9sbENvbnRhaW5lcilcbn1cblxuSG9va3MuSW5maW5pdGVTY3JvbGwgPSB7XG4gIG1vdW50ZWQoKXtcbiAgICB0aGlzLnNjcm9sbENvbnRhaW5lciA9IGZpbmRTY3JvbGxDb250YWluZXIodGhpcy5lbClcbiAgICBsZXQgc2Nyb2xsQmVmb3JlID0gc2Nyb2xsVG9wKHRoaXMuc2Nyb2xsQ29udGFpbmVyKVxuICAgIGxldCB0b3BPdmVycmFuID0gZmFsc2VcbiAgICBsZXQgdGhyb3R0bGVJbnRlcnZhbCA9IDUwMFxuICAgIGxldCBwZW5kaW5nT3AgPSBudWxsXG5cbiAgICBsZXQgb25Ub3BPdmVycnVuID0gdGhpcy50aHJvdHRsZSh0aHJvdHRsZUludGVydmFsLCAodG9wRXZlbnQsIGZpcnN0Q2hpbGQpID0+IHtcbiAgICAgIHBlbmRpbmdPcCA9ICgpID0+IHRydWVcbiAgICAgIHRoaXMubGl2ZVNvY2tldC5leGVjSlNIb29rUHVzaCh0aGlzLmVsLCB0b3BFdmVudCwge2lkOiBmaXJzdENoaWxkLmlkLCBfb3ZlcnJhbjogdHJ1ZX0sICgpID0+IHtcbiAgICAgICAgcGVuZGluZ09wID0gbnVsbFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgbGV0IG9uRmlyc3RDaGlsZEF0VG9wID0gdGhpcy50aHJvdHRsZSh0aHJvdHRsZUludGVydmFsLCAodG9wRXZlbnQsIGZpcnN0Q2hpbGQpID0+IHtcbiAgICAgIHBlbmRpbmdPcCA9ICgpID0+IGZpcnN0Q2hpbGQuc2Nyb2xsSW50b1ZpZXcoe2Jsb2NrOiBcInN0YXJ0XCJ9KVxuICAgICAgdGhpcy5saXZlU29ja2V0LmV4ZWNKU0hvb2tQdXNoKHRoaXMuZWwsIHRvcEV2ZW50LCB7aWQ6IGZpcnN0Q2hpbGQuaWR9LCAoKSA9PiB7XG4gICAgICAgIHBlbmRpbmdPcCA9IG51bGxcbiAgICAgICAgLy8gbWFrZSBzdXJlIHRoYXQgdGhlIERPTSBpcyBwYXRjaGVkIGJ5IHdhaXRpbmcgZm9yIHRoZSBuZXh0IHRpY2tcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgaWYoIWlzV2l0aGluVmlld3BvcnQoZmlyc3RDaGlsZCwgdGhpcy5zY3JvbGxDb250YWluZXIpKXtcbiAgICAgICAgICAgIGZpcnN0Q2hpbGQuc2Nyb2xsSW50b1ZpZXcoe2Jsb2NrOiBcInN0YXJ0XCJ9KVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGxldCBvbkxhc3RDaGlsZEF0Qm90dG9tID0gdGhpcy50aHJvdHRsZSh0aHJvdHRsZUludGVydmFsLCAoYm90dG9tRXZlbnQsIGxhc3RDaGlsZCkgPT4ge1xuICAgICAgcGVuZGluZ09wID0gKCkgPT4gbGFzdENoaWxkLnNjcm9sbEludG9WaWV3KHtibG9jazogXCJlbmRcIn0pXG4gICAgICB0aGlzLmxpdmVTb2NrZXQuZXhlY0pTSG9va1B1c2godGhpcy5lbCwgYm90dG9tRXZlbnQsIHtpZDogbGFzdENoaWxkLmlkfSwgKCkgPT4ge1xuICAgICAgICBwZW5kaW5nT3AgPSBudWxsXG4gICAgICAgIC8vIG1ha2Ugc3VyZSB0aGF0IHRoZSBET00gaXMgcGF0Y2hlZCBieSB3YWl0aW5nIGZvciB0aGUgbmV4dCB0aWNrXG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgIGlmKCFpc1dpdGhpblZpZXdwb3J0KGxhc3RDaGlsZCwgdGhpcy5zY3JvbGxDb250YWluZXIpKXtcbiAgICAgICAgICAgIGxhc3RDaGlsZC5zY3JvbGxJbnRvVmlldyh7YmxvY2s6IFwiZW5kXCJ9KVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIHRoaXMub25TY3JvbGwgPSAoX2UpID0+IHtcbiAgICAgIGxldCBzY3JvbGxOb3cgPSBzY3JvbGxUb3AodGhpcy5zY3JvbGxDb250YWluZXIpXG5cbiAgICAgIGlmKHBlbmRpbmdPcCl7XG4gICAgICAgIHNjcm9sbEJlZm9yZSA9IHNjcm9sbE5vd1xuICAgICAgICByZXR1cm4gcGVuZGluZ09wKClcbiAgICAgIH1cbiAgICAgIGxldCByZWN0ID0gdGhpcy5lbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgbGV0IHRvcEV2ZW50ID0gdGhpcy5lbC5nZXRBdHRyaWJ1dGUodGhpcy5saXZlU29ja2V0LmJpbmRpbmcoXCJ2aWV3cG9ydC10b3BcIikpXG4gICAgICBsZXQgYm90dG9tRXZlbnQgPSB0aGlzLmVsLmdldEF0dHJpYnV0ZSh0aGlzLmxpdmVTb2NrZXQuYmluZGluZyhcInZpZXdwb3J0LWJvdHRvbVwiKSlcbiAgICAgIGxldCBsYXN0Q2hpbGQgPSB0aGlzLmVsLmxhc3RFbGVtZW50Q2hpbGRcbiAgICAgIGxldCBmaXJzdENoaWxkID0gdGhpcy5lbC5maXJzdEVsZW1lbnRDaGlsZFxuICAgICAgbGV0IGlzU2Nyb2xsaW5nVXAgPSBzY3JvbGxOb3cgPCBzY3JvbGxCZWZvcmVcbiAgICAgIGxldCBpc1Njcm9sbGluZ0Rvd24gPSBzY3JvbGxOb3cgPiBzY3JvbGxCZWZvcmVcblxuICAgICAgLy8gZWwgb3ZlcnJhbiB3aGlsZSBzY3JvbGxpbmcgdXBcbiAgICAgIGlmKGlzU2Nyb2xsaW5nVXAgJiYgdG9wRXZlbnQgJiYgIXRvcE92ZXJyYW4gJiYgcmVjdC50b3AgPj0gMCl7XG4gICAgICAgIHRvcE92ZXJyYW4gPSB0cnVlXG4gICAgICAgIG9uVG9wT3ZlcnJ1bih0b3BFdmVudCwgZmlyc3RDaGlsZClcbiAgICAgIH0gZWxzZSBpZihpc1Njcm9sbGluZ0Rvd24gJiYgdG9wT3ZlcnJhbiAmJiByZWN0LnRvcCA8PSAwKXtcbiAgICAgICAgdG9wT3ZlcnJhbiA9IGZhbHNlXG4gICAgICB9XG5cbiAgICAgIGlmKHRvcEV2ZW50ICYmIGlzU2Nyb2xsaW5nVXAgJiYgaXNBdFZpZXdwb3J0VG9wKGZpcnN0Q2hpbGQsIHRoaXMuc2Nyb2xsQ29udGFpbmVyKSl7XG4gICAgICAgIG9uRmlyc3RDaGlsZEF0VG9wKHRvcEV2ZW50LCBmaXJzdENoaWxkKVxuICAgICAgfSBlbHNlIGlmKGJvdHRvbUV2ZW50ICYmIGlzU2Nyb2xsaW5nRG93biAmJiBpc0F0Vmlld3BvcnRCb3R0b20obGFzdENoaWxkLCB0aGlzLnNjcm9sbENvbnRhaW5lcikpe1xuICAgICAgICBvbkxhc3RDaGlsZEF0Qm90dG9tKGJvdHRvbUV2ZW50LCBsYXN0Q2hpbGQpXG4gICAgICB9XG4gICAgICBzY3JvbGxCZWZvcmUgPSBzY3JvbGxOb3dcbiAgICB9XG5cbiAgICBpZih0aGlzLnNjcm9sbENvbnRhaW5lcil7XG4gICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIHRoaXMub25TY3JvbGwpXG4gICAgfSBlbHNlIHtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIHRoaXMub25TY3JvbGwpXG4gICAgfVxuICB9LFxuICBcbiAgZGVzdHJveWVkKCl7XG4gICAgaWYodGhpcy5zY3JvbGxDb250YWluZXIpe1xuICAgICAgdGhpcy5zY3JvbGxDb250YWluZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCB0aGlzLm9uU2Nyb2xsKVxuICAgIH0gZWxzZSB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCB0aGlzLm9uU2Nyb2xsKVxuICAgIH1cbiAgfSxcblxuICB0aHJvdHRsZShpbnRlcnZhbCwgY2FsbGJhY2spe1xuICAgIGxldCBsYXN0Q2FsbEF0ID0gMFxuICAgIGxldCB0aW1lclxuXG4gICAgcmV0dXJuICguLi5hcmdzKSA9PiB7XG4gICAgICBsZXQgbm93ID0gRGF0ZS5ub3coKVxuICAgICAgbGV0IHJlbWFpbmluZ1RpbWUgPSBpbnRlcnZhbCAtIChub3cgLSBsYXN0Q2FsbEF0KVxuXG4gICAgICBpZihyZW1haW5pbmdUaW1lIDw9IDAgfHwgcmVtYWluaW5nVGltZSA+IGludGVydmFsKXtcbiAgICAgICAgaWYodGltZXIpe1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lcilcbiAgICAgICAgICB0aW1lciA9IG51bGxcbiAgICAgICAgfVxuICAgICAgICBsYXN0Q2FsbEF0ID0gbm93XG4gICAgICAgIGNhbGxiYWNrKC4uLmFyZ3MpXG4gICAgICB9IGVsc2UgaWYoIXRpbWVyKXtcbiAgICAgICAgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBsYXN0Q2FsbEF0ID0gRGF0ZS5ub3coKVxuICAgICAgICAgIHRpbWVyID0gbnVsbFxuICAgICAgICAgIGNhbGxiYWNrKC4uLmFyZ3MpXG4gICAgICAgIH0sIHJlbWFpbmluZ1RpbWUpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5leHBvcnQgZGVmYXVsdCBIb29rc1xuIiwgImltcG9ydCB7XG4gIFBIWF9SRUZfTE9BRElORyxcbiAgUEhYX1JFRl9MT0NLLFxuICBQSFhfUkVGX1NSQyxcbiAgUEhYX0VWRU5UX0NMQVNTRVMsXG4gIFBIWF9ESVNBQkxFRCxcbiAgUEhYX1JFQURPTkxZLFxuICBQSFhfRElTQUJMRV9XSVRIX1JFU1RPUkVcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuaW1wb3J0IERPTSBmcm9tIFwiLi9kb21cIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbGVtZW50UmVmIHtcbiAgc3RhdGljIG9uVW5sb2NrKGVsLCBjYWxsYmFjayl7XG4gICAgaWYoIURPTS5pc0xvY2tlZChlbCkgJiYgIWVsLmNsb3Nlc3QoYFske1BIWF9SRUZfTE9DS31dYCkpeyByZXR1cm4gY2FsbGJhY2soKSB9XG4gICAgY29uc3QgY2xvc2VzdExvY2sgPSBlbC5jbG9zZXN0KGBbJHtQSFhfUkVGX0xPQ0t9XWApXG4gICAgY29uc3QgcmVmID0gY2xvc2VzdExvY2suY2xvc2VzdChgWyR7UEhYX1JFRl9MT0NLfV1gKS5nZXRBdHRyaWJ1dGUoUEhYX1JFRl9MT0NLKVxuICAgIGNsb3Nlc3RMb2NrLmFkZEV2ZW50TGlzdGVuZXIoYHBoeDp1bmRvLWxvY2s6JHtyZWZ9YCwgKCkgPT4ge1xuICAgICAgY2FsbGJhY2soKVxuICAgIH0sIHtvbmNlOiB0cnVlfSlcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKGVsKXtcbiAgICB0aGlzLmVsID0gZWxcbiAgICB0aGlzLmxvYWRpbmdSZWYgPSBlbC5oYXNBdHRyaWJ1dGUoUEhYX1JFRl9MT0FESU5HKSA/IHBhcnNlSW50KGVsLmdldEF0dHJpYnV0ZShQSFhfUkVGX0xPQURJTkcpLCAxMCkgOiBudWxsXG4gICAgdGhpcy5sb2NrUmVmID0gZWwuaGFzQXR0cmlidXRlKFBIWF9SRUZfTE9DSykgPyBwYXJzZUludChlbC5nZXRBdHRyaWJ1dGUoUEhYX1JFRl9MT0NLKSwgMTApIDogbnVsbFxuICB9XG5cbiAgLy8gcHVibGljXG5cbiAgbWF5YmVVbmRvKHJlZiwgcGh4RXZlbnQsIGVhY2hDbG9uZUNhbGxiYWNrKXtcbiAgICBpZighdGhpcy5pc1dpdGhpbihyZWYpKXsgcmV0dXJuIH1cblxuICAgIC8vIHVuZG8gbG9ja3MgYW5kIGFwcGx5IGNsb25lc1xuICAgIHRoaXMudW5kb0xvY2tzKHJlZiwgcGh4RXZlbnQsIGVhY2hDbG9uZUNhbGxiYWNrKVxuXG4gICAgLy8gdW5kbyBsb2FkaW5nIHN0YXRlc1xuICAgIHRoaXMudW5kb0xvYWRpbmcocmVmLCBwaHhFdmVudClcblxuICAgIC8vIGNsZWFuIHVwIGlmIGZ1bGx5IHJlc29sdmVkXG4gICAgaWYodGhpcy5pc0Z1bGx5UmVzb2x2ZWRCeShyZWYpKXsgdGhpcy5lbC5yZW1vdmVBdHRyaWJ1dGUoUEhYX1JFRl9TUkMpIH1cbiAgfVxuXG4gIC8vIHByaXZhdGVcblxuICBpc1dpdGhpbihyZWYpe1xuICAgIHJldHVybiAhKCh0aGlzLmxvYWRpbmdSZWYgIT09IG51bGwgJiYgdGhpcy5sb2FkaW5nUmVmID4gcmVmKSAmJiAodGhpcy5sb2NrUmVmICE9PSBudWxsICYmIHRoaXMubG9ja1JlZiA+IHJlZikpXG4gIH1cblxuICAvLyBDaGVjayBmb3IgY2xvbmVkIFBIWF9SRUZfTE9DSyBlbGVtZW50IHRoYXQgaGFzIGJlZW4gbW9ycGhlZCBiZWhpbmRcbiAgLy8gdGhlIHNjZW5lcyB3aGlsZSB0aGlzIGVsZW1lbnQgd2FzIGxvY2tlZCBpbiB0aGUgRE9NLlxuICAvLyBXaGVuIHdlIGFwcGx5IHRoZSBjbG9uZWQgdHJlZSB0byB0aGUgYWN0aXZlIERPTSBlbGVtZW50LCB3ZSBtdXN0XG4gIC8vXG4gIC8vICAgMS4gZXhlY3V0ZSBwZW5kaW5nIG1vdW50ZWQgaG9va3MgZm9yIG5vZGVzIG5vdyBpbiB0aGUgRE9NXG4gIC8vICAgMi4gdW5kbyBhbnkgcmVmIGluc2lkZSB0aGUgY2xvbmVkIHRyZWUgdGhhdCBoYXMgc2luY2UgYmVlbiBhY2snZFxuICB1bmRvTG9ja3MocmVmLCBwaHhFdmVudCwgZWFjaENsb25lQ2FsbGJhY2spe1xuICAgIGlmKCF0aGlzLmlzTG9ja1VuZG9uZUJ5KHJlZikpeyByZXR1cm4gfVxuXG4gICAgbGV0IGNsb25lZFRyZWUgPSBET00ucHJpdmF0ZSh0aGlzLmVsLCBQSFhfUkVGX0xPQ0spXG4gICAgaWYoY2xvbmVkVHJlZSl7XG4gICAgICBlYWNoQ2xvbmVDYWxsYmFjayhjbG9uZWRUcmVlKVxuICAgICAgRE9NLmRlbGV0ZVByaXZhdGUodGhpcy5lbCwgUEhYX1JFRl9MT0NLKVxuICAgIH1cbiAgICB0aGlzLmVsLnJlbW92ZUF0dHJpYnV0ZShQSFhfUkVGX0xPQ0spXG5cbiAgICBsZXQgb3B0cyA9IHtkZXRhaWw6IHtyZWY6IHJlZiwgZXZlbnQ6IHBoeEV2ZW50fSwgYnViYmxlczogdHJ1ZSwgY2FuY2VsYWJsZTogZmFsc2V9XG4gICAgdGhpcy5lbC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChgcGh4OnVuZG8tbG9jazoke3RoaXMubG9ja1JlZn1gLCBvcHRzKSlcbiAgfVxuXG4gIHVuZG9Mb2FkaW5nKHJlZiwgcGh4RXZlbnQpe1xuICAgIGlmKCF0aGlzLmlzTG9hZGluZ1VuZG9uZUJ5KHJlZikpe1xuICAgICAgaWYodGhpcy5jYW5VbmRvTG9hZGluZyhyZWYpICYmIHRoaXMuZWwuY2xhc3NMaXN0LmNvbnRhaW5zKFwicGh4LXN1Ym1pdC1sb2FkaW5nXCIpKXtcbiAgICAgICAgdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKFwicGh4LWNoYW5nZS1sb2FkaW5nXCIpXG4gICAgICB9XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZih0aGlzLmNhblVuZG9Mb2FkaW5nKHJlZikpe1xuICAgICAgdGhpcy5lbC5yZW1vdmVBdHRyaWJ1dGUoUEhYX1JFRl9MT0FESU5HKVxuICAgICAgbGV0IGRpc2FibGVkVmFsID0gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoUEhYX0RJU0FCTEVEKVxuICAgICAgbGV0IHJlYWRPbmx5VmFsID0gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoUEhYX1JFQURPTkxZKVxuICAgICAgLy8gcmVzdG9yZSBpbnB1dHNcbiAgICAgIGlmKHJlYWRPbmx5VmFsICE9PSBudWxsKXtcbiAgICAgICAgdGhpcy5lbC5yZWFkT25seSA9IHJlYWRPbmx5VmFsID09PSBcInRydWVcIiA/IHRydWUgOiBmYWxzZVxuICAgICAgICB0aGlzLmVsLnJlbW92ZUF0dHJpYnV0ZShQSFhfUkVBRE9OTFkpXG4gICAgICB9XG4gICAgICBpZihkaXNhYmxlZFZhbCAhPT0gbnVsbCl7XG4gICAgICAgIHRoaXMuZWwuZGlzYWJsZWQgPSBkaXNhYmxlZFZhbCA9PT0gXCJ0cnVlXCIgPyB0cnVlIDogZmFsc2VcbiAgICAgICAgdGhpcy5lbC5yZW1vdmVBdHRyaWJ1dGUoUEhYX0RJU0FCTEVEKVxuICAgICAgfVxuICAgICAgLy8gcmVzdG9yZSBkaXNhYmxlc1xuICAgICAgbGV0IGRpc2FibGVSZXN0b3JlID0gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoUEhYX0RJU0FCTEVfV0lUSF9SRVNUT1JFKVxuICAgICAgaWYoZGlzYWJsZVJlc3RvcmUgIT09IG51bGwpe1xuICAgICAgICB0aGlzLmVsLmlubmVyVGV4dCA9IGRpc2FibGVSZXN0b3JlXG4gICAgICAgIHRoaXMuZWwucmVtb3ZlQXR0cmlidXRlKFBIWF9ESVNBQkxFX1dJVEhfUkVTVE9SRSlcbiAgICAgIH1cblxuICAgICAgbGV0IG9wdHMgPSB7ZGV0YWlsOiB7cmVmOiByZWYsIGV2ZW50OiBwaHhFdmVudH0sIGJ1YmJsZXM6IHRydWUsIGNhbmNlbGFibGU6IGZhbHNlfVxuICAgICAgdGhpcy5lbC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChgcGh4OnVuZG8tbG9hZGluZzoke3RoaXMubG9hZGluZ1JlZn1gLCBvcHRzKSlcbiAgICB9XG5cbiAgICAvLyByZW1vdmUgY2xhc3Nlc1xuICAgIFBIWF9FVkVOVF9DTEFTU0VTLmZvckVhY2gobmFtZSA9PiB7XG4gICAgICBpZihuYW1lICE9PSBcInBoeC1zdWJtaXQtbG9hZGluZ1wiIHx8IHRoaXMuY2FuVW5kb0xvYWRpbmcocmVmKSl7XG4gICAgICAgIERPTS5yZW1vdmVDbGFzcyh0aGlzLmVsLCBuYW1lKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBpc0xvYWRpbmdVbmRvbmVCeShyZWYpeyByZXR1cm4gdGhpcy5sb2FkaW5nUmVmID09PSBudWxsID8gZmFsc2UgOiB0aGlzLmxvYWRpbmdSZWYgPD0gcmVmIH1cbiAgaXNMb2NrVW5kb25lQnkocmVmKXsgcmV0dXJuIHRoaXMubG9ja1JlZiA9PT0gbnVsbCA/IGZhbHNlIDogdGhpcy5sb2NrUmVmIDw9IHJlZiB9XG5cbiAgaXNGdWxseVJlc29sdmVkQnkocmVmKXtcbiAgICByZXR1cm4gKHRoaXMubG9hZGluZ1JlZiA9PT0gbnVsbCB8fCB0aGlzLmxvYWRpbmdSZWYgPD0gcmVmKSAmJiAodGhpcy5sb2NrUmVmID09PSBudWxsIHx8IHRoaXMubG9ja1JlZiA8PSByZWYpXG4gIH1cblxuICAvLyBvbmx5IHJlbW92ZSB0aGUgcGh4LXN1Ym1pdC1sb2FkaW5nIGNsYXNzIGlmIHdlIGFyZSBub3QgbG9ja2VkXG4gIGNhblVuZG9Mb2FkaW5nKHJlZil7IHJldHVybiB0aGlzLmxvY2tSZWYgPT09IG51bGwgfHwgdGhpcy5sb2NrUmVmIDw9IHJlZiB9XG59XG4iLCAiaW1wb3J0IHtcbiAgbWF5YmVcbn0gZnJvbSBcIi4vdXRpbHNcIlxuXG5pbXBvcnQgRE9NIGZyb20gXCIuL2RvbVwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERPTVBvc3RNb3JwaFJlc3RvcmVyIHtcbiAgY29uc3RydWN0b3IoY29udGFpbmVyQmVmb3JlLCBjb250YWluZXJBZnRlciwgdXBkYXRlVHlwZSl7XG4gICAgbGV0IGlkc0JlZm9yZSA9IG5ldyBTZXQoKVxuICAgIGxldCBpZHNBZnRlciA9IG5ldyBTZXQoWy4uLmNvbnRhaW5lckFmdGVyLmNoaWxkcmVuXS5tYXAoY2hpbGQgPT4gY2hpbGQuaWQpKVxuXG4gICAgbGV0IGVsZW1lbnRzVG9Nb2RpZnkgPSBbXVxuXG4gICAgQXJyYXkuZnJvbShjb250YWluZXJCZWZvcmUuY2hpbGRyZW4pLmZvckVhY2goY2hpbGQgPT4ge1xuICAgICAgaWYoY2hpbGQuaWQpeyAvLyBhbGwgb2Ygb3VyIGNoaWxkcmVuIHNob3VsZCBiZSBlbGVtZW50cyB3aXRoIGlkc1xuICAgICAgICBpZHNCZWZvcmUuYWRkKGNoaWxkLmlkKVxuICAgICAgICBpZihpZHNBZnRlci5oYXMoY2hpbGQuaWQpKXtcbiAgICAgICAgICBsZXQgcHJldmlvdXNFbGVtZW50SWQgPSBjaGlsZC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nICYmIGNoaWxkLnByZXZpb3VzRWxlbWVudFNpYmxpbmcuaWRcbiAgICAgICAgICBlbGVtZW50c1RvTW9kaWZ5LnB1c2goe2VsZW1lbnRJZDogY2hpbGQuaWQsIHByZXZpb3VzRWxlbWVudElkOiBwcmV2aW91c0VsZW1lbnRJZH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy5jb250YWluZXJJZCA9IGNvbnRhaW5lckFmdGVyLmlkXG4gICAgdGhpcy51cGRhdGVUeXBlID0gdXBkYXRlVHlwZVxuICAgIHRoaXMuZWxlbWVudHNUb01vZGlmeSA9IGVsZW1lbnRzVG9Nb2RpZnlcbiAgICB0aGlzLmVsZW1lbnRJZHNUb0FkZCA9IFsuLi5pZHNBZnRlcl0uZmlsdGVyKGlkID0+ICFpZHNCZWZvcmUuaGFzKGlkKSlcbiAgfVxuXG4gIC8vIFdlIGRvIHRoZSBmb2xsb3dpbmcgdG8gb3B0aW1pemUgYXBwZW5kL3ByZXBlbmQgb3BlcmF0aW9uczpcbiAgLy8gICAxKSBUcmFjayBpZHMgb2YgbW9kaWZpZWQgZWxlbWVudHMgJiBvZiBuZXcgZWxlbWVudHNcbiAgLy8gICAyKSBBbGwgdGhlIG1vZGlmaWVkIGVsZW1lbnRzIGFyZSBwdXQgYmFjayBpbiB0aGUgY29ycmVjdCBwb3NpdGlvbiBpbiB0aGUgRE9NIHRyZWVcbiAgLy8gICAgICBieSBzdG9yaW5nIHRoZSBpZCBvZiB0aGVpciBwcmV2aW91cyBzaWJsaW5nXG4gIC8vICAgMykgTmV3IGVsZW1lbnRzIGFyZSBnb2luZyB0byBiZSBwdXQgaW4gdGhlIHJpZ2h0IHBsYWNlIGJ5IG1vcnBoZG9tIGR1cmluZyBhcHBlbmQuXG4gIC8vICAgICAgRm9yIHByZXBlbmQsIHdlIG1vdmUgdGhlbSB0byB0aGUgZmlyc3QgcG9zaXRpb24gaW4gdGhlIGNvbnRhaW5lclxuICBwZXJmb3JtKCl7XG4gICAgbGV0IGNvbnRhaW5lciA9IERPTS5ieUlkKHRoaXMuY29udGFpbmVySWQpXG4gICAgdGhpcy5lbGVtZW50c1RvTW9kaWZ5LmZvckVhY2goZWxlbWVudFRvTW9kaWZ5ID0+IHtcbiAgICAgIGlmKGVsZW1lbnRUb01vZGlmeS5wcmV2aW91c0VsZW1lbnRJZCl7XG4gICAgICAgIG1heWJlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnRUb01vZGlmeS5wcmV2aW91c0VsZW1lbnRJZCksIHByZXZpb3VzRWxlbSA9PiB7XG4gICAgICAgICAgbWF5YmUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudFRvTW9kaWZ5LmVsZW1lbnRJZCksIGVsZW0gPT4ge1xuICAgICAgICAgICAgbGV0IGlzSW5SaWdodFBsYWNlID0gZWxlbS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nICYmIGVsZW0ucHJldmlvdXNFbGVtZW50U2libGluZy5pZCA9PSBwcmV2aW91c0VsZW0uaWRcbiAgICAgICAgICAgIGlmKCFpc0luUmlnaHRQbGFjZSl7XG4gICAgICAgICAgICAgIHByZXZpb3VzRWxlbS5pbnNlcnRBZGphY2VudEVsZW1lbnQoXCJhZnRlcmVuZFwiLCBlbGVtKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBUaGlzIGlzIHRoZSBmaXJzdCBlbGVtZW50IGluIHRoZSBjb250YWluZXJcbiAgICAgICAgbWF5YmUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudFRvTW9kaWZ5LmVsZW1lbnRJZCksIGVsZW0gPT4ge1xuICAgICAgICAgIGxldCBpc0luUmlnaHRQbGFjZSA9IGVsZW0ucHJldmlvdXNFbGVtZW50U2libGluZyA9PSBudWxsXG4gICAgICAgICAgaWYoIWlzSW5SaWdodFBsYWNlKXtcbiAgICAgICAgICAgIGNvbnRhaW5lci5pbnNlcnRBZGphY2VudEVsZW1lbnQoXCJhZnRlcmJlZ2luXCIsIGVsZW0pXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBpZih0aGlzLnVwZGF0ZVR5cGUgPT0gXCJwcmVwZW5kXCIpe1xuICAgICAgdGhpcy5lbGVtZW50SWRzVG9BZGQucmV2ZXJzZSgpLmZvckVhY2goZWxlbUlkID0+IHtcbiAgICAgICAgbWF5YmUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbUlkKSwgZWxlbSA9PiBjb250YWluZXIuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KFwiYWZ0ZXJiZWdpblwiLCBlbGVtKSlcbiAgICAgIH0pXG4gICAgfVxuICB9XG59XG4iLCAidmFyIERPQ1VNRU5UX0ZSQUdNRU5UX05PREUgPSAxMTtcblxuZnVuY3Rpb24gbW9ycGhBdHRycyhmcm9tTm9kZSwgdG9Ob2RlKSB7XG4gICAgdmFyIHRvTm9kZUF0dHJzID0gdG9Ob2RlLmF0dHJpYnV0ZXM7XG4gICAgdmFyIGF0dHI7XG4gICAgdmFyIGF0dHJOYW1lO1xuICAgIHZhciBhdHRyTmFtZXNwYWNlVVJJO1xuICAgIHZhciBhdHRyVmFsdWU7XG4gICAgdmFyIGZyb21WYWx1ZTtcblxuICAgIC8vIGRvY3VtZW50LWZyYWdtZW50cyBkb250IGhhdmUgYXR0cmlidXRlcyBzbyBsZXRzIG5vdCBkbyBhbnl0aGluZ1xuICAgIGlmICh0b05vZGUubm9kZVR5cGUgPT09IERPQ1VNRU5UX0ZSQUdNRU5UX05PREUgfHwgZnJvbU5vZGUubm9kZVR5cGUgPT09IERPQ1VNRU5UX0ZSQUdNRU5UX05PREUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgYXR0cmlidXRlcyBvbiBvcmlnaW5hbCBET00gZWxlbWVudFxuICAgIGZvciAodmFyIGkgPSB0b05vZGVBdHRycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBhdHRyID0gdG9Ob2RlQXR0cnNbaV07XG4gICAgICAgIGF0dHJOYW1lID0gYXR0ci5uYW1lO1xuICAgICAgICBhdHRyTmFtZXNwYWNlVVJJID0gYXR0ci5uYW1lc3BhY2VVUkk7XG4gICAgICAgIGF0dHJWYWx1ZSA9IGF0dHIudmFsdWU7XG5cbiAgICAgICAgaWYgKGF0dHJOYW1lc3BhY2VVUkkpIHtcbiAgICAgICAgICAgIGF0dHJOYW1lID0gYXR0ci5sb2NhbE5hbWUgfHwgYXR0ck5hbWU7XG4gICAgICAgICAgICBmcm9tVmFsdWUgPSBmcm9tTm9kZS5nZXRBdHRyaWJ1dGVOUyhhdHRyTmFtZXNwYWNlVVJJLCBhdHRyTmFtZSk7XG5cbiAgICAgICAgICAgIGlmIChmcm9tVmFsdWUgIT09IGF0dHJWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmIChhdHRyLnByZWZpeCA9PT0gJ3htbG5zJyl7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJOYW1lID0gYXR0ci5uYW1lOyAvLyBJdCdzIG5vdCBhbGxvd2VkIHRvIHNldCBhbiBhdHRyaWJ1dGUgd2l0aCB0aGUgWE1MTlMgbmFtZXNwYWNlIHdpdGhvdXQgc3BlY2lmeWluZyB0aGUgYHhtbG5zYCBwcmVmaXhcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZnJvbU5vZGUuc2V0QXR0cmlidXRlTlMoYXR0ck5hbWVzcGFjZVVSSSwgYXR0ck5hbWUsIGF0dHJWYWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmcm9tVmFsdWUgPSBmcm9tTm9kZS5nZXRBdHRyaWJ1dGUoYXR0ck5hbWUpO1xuXG4gICAgICAgICAgICBpZiAoZnJvbVZhbHVlICE9PSBhdHRyVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBmcm9tTm9kZS5zZXRBdHRyaWJ1dGUoYXR0ck5hbWUsIGF0dHJWYWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgYW55IGV4dHJhIGF0dHJpYnV0ZXMgZm91bmQgb24gdGhlIG9yaWdpbmFsIERPTSBlbGVtZW50IHRoYXRcbiAgICAvLyB3ZXJlbid0IGZvdW5kIG9uIHRoZSB0YXJnZXQgZWxlbWVudC5cbiAgICB2YXIgZnJvbU5vZGVBdHRycyA9IGZyb21Ob2RlLmF0dHJpYnV0ZXM7XG5cbiAgICBmb3IgKHZhciBkID0gZnJvbU5vZGVBdHRycy5sZW5ndGggLSAxOyBkID49IDA7IGQtLSkge1xuICAgICAgICBhdHRyID0gZnJvbU5vZGVBdHRyc1tkXTtcbiAgICAgICAgYXR0ck5hbWUgPSBhdHRyLm5hbWU7XG4gICAgICAgIGF0dHJOYW1lc3BhY2VVUkkgPSBhdHRyLm5hbWVzcGFjZVVSSTtcblxuICAgICAgICBpZiAoYXR0ck5hbWVzcGFjZVVSSSkge1xuICAgICAgICAgICAgYXR0ck5hbWUgPSBhdHRyLmxvY2FsTmFtZSB8fCBhdHRyTmFtZTtcblxuICAgICAgICAgICAgaWYgKCF0b05vZGUuaGFzQXR0cmlidXRlTlMoYXR0ck5hbWVzcGFjZVVSSSwgYXR0ck5hbWUpKSB7XG4gICAgICAgICAgICAgICAgZnJvbU5vZGUucmVtb3ZlQXR0cmlidXRlTlMoYXR0ck5hbWVzcGFjZVVSSSwgYXR0ck5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCF0b05vZGUuaGFzQXR0cmlidXRlKGF0dHJOYW1lKSkge1xuICAgICAgICAgICAgICAgIGZyb21Ob2RlLnJlbW92ZUF0dHJpYnV0ZShhdHRyTmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbnZhciByYW5nZTsgLy8gQ3JlYXRlIGEgcmFuZ2Ugb2JqZWN0IGZvciBlZmZpY2VudGx5IHJlbmRlcmluZyBzdHJpbmdzIHRvIGVsZW1lbnRzLlxudmFyIE5TX1hIVE1MID0gJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwnO1xuXG52YXIgZG9jID0gdHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJyA/IHVuZGVmaW5lZCA6IGRvY3VtZW50O1xudmFyIEhBU19URU1QTEFURV9TVVBQT1JUID0gISFkb2MgJiYgJ2NvbnRlbnQnIGluIGRvYy5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xudmFyIEhBU19SQU5HRV9TVVBQT1JUID0gISFkb2MgJiYgZG9jLmNyZWF0ZVJhbmdlICYmICdjcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQnIGluIGRvYy5jcmVhdGVSYW5nZSgpO1xuXG5mdW5jdGlvbiBjcmVhdGVGcmFnbWVudEZyb21UZW1wbGF0ZShzdHIpIHtcbiAgICB2YXIgdGVtcGxhdGUgPSBkb2MuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBzdHI7XG4gICAgcmV0dXJuIHRlbXBsYXRlLmNvbnRlbnQuY2hpbGROb2Rlc1swXTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlRnJhZ21lbnRGcm9tUmFuZ2Uoc3RyKSB7XG4gICAgaWYgKCFyYW5nZSkge1xuICAgICAgICByYW5nZSA9IGRvYy5jcmVhdGVSYW5nZSgpO1xuICAgICAgICByYW5nZS5zZWxlY3ROb2RlKGRvYy5ib2R5KTtcbiAgICB9XG5cbiAgICB2YXIgZnJhZ21lbnQgPSByYW5nZS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoc3RyKTtcbiAgICByZXR1cm4gZnJhZ21lbnQuY2hpbGROb2Rlc1swXTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlRnJhZ21lbnRGcm9tV3JhcChzdHIpIHtcbiAgICB2YXIgZnJhZ21lbnQgPSBkb2MuY3JlYXRlRWxlbWVudCgnYm9keScpO1xuICAgIGZyYWdtZW50LmlubmVySFRNTCA9IHN0cjtcbiAgICByZXR1cm4gZnJhZ21lbnQuY2hpbGROb2Rlc1swXTtcbn1cblxuLyoqXG4gKiBUaGlzIGlzIGFib3V0IHRoZSBzYW1lXG4gKiB2YXIgaHRtbCA9IG5ldyBET01QYXJzZXIoKS5wYXJzZUZyb21TdHJpbmcoc3RyLCAndGV4dC9odG1sJyk7XG4gKiByZXR1cm4gaHRtbC5ib2R5LmZpcnN0Q2hpbGQ7XG4gKlxuICogQG1ldGhvZCB0b0VsZW1lbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqL1xuZnVuY3Rpb24gdG9FbGVtZW50KHN0cikge1xuICAgIHN0ciA9IHN0ci50cmltKCk7XG4gICAgaWYgKEhBU19URU1QTEFURV9TVVBQT1JUKSB7XG4gICAgICAvLyBhdm9pZCByZXN0cmljdGlvbnMgb24gY29udGVudCBmb3IgdGhpbmdzIGxpa2UgYDx0cj48dGg+SGk8L3RoPjwvdHI+YCB3aGljaFxuICAgICAgLy8gY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50IGRvZXNuJ3Qgc3VwcG9ydFxuICAgICAgLy8gPHRlbXBsYXRlPiBzdXBwb3J0IG5vdCBhdmFpbGFibGUgaW4gSUVcbiAgICAgIHJldHVybiBjcmVhdGVGcmFnbWVudEZyb21UZW1wbGF0ZShzdHIpO1xuICAgIH0gZWxzZSBpZiAoSEFTX1JBTkdFX1NVUFBPUlQpIHtcbiAgICAgIHJldHVybiBjcmVhdGVGcmFnbWVudEZyb21SYW5nZShzdHIpO1xuICAgIH1cblxuICAgIHJldHVybiBjcmVhdGVGcmFnbWVudEZyb21XcmFwKHN0cik7XG59XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHR3byBub2RlJ3MgbmFtZXMgYXJlIHRoZSBzYW1lLlxuICpcbiAqIE5PVEU6IFdlIGRvbid0IGJvdGhlciBjaGVja2luZyBgbmFtZXNwYWNlVVJJYCBiZWNhdXNlIHlvdSB3aWxsIG5ldmVyIGZpbmQgdHdvIEhUTUwgZWxlbWVudHMgd2l0aCB0aGUgc2FtZVxuICogICAgICAgbm9kZU5hbWUgYW5kIGRpZmZlcmVudCBuYW1lc3BhY2UgVVJJcy5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGFcbiAqIEBwYXJhbSB7RWxlbWVudH0gYiBUaGUgdGFyZ2V0IGVsZW1lbnRcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGNvbXBhcmVOb2RlTmFtZXMoZnJvbUVsLCB0b0VsKSB7XG4gICAgdmFyIGZyb21Ob2RlTmFtZSA9IGZyb21FbC5ub2RlTmFtZTtcbiAgICB2YXIgdG9Ob2RlTmFtZSA9IHRvRWwubm9kZU5hbWU7XG4gICAgdmFyIGZyb21Db2RlU3RhcnQsIHRvQ29kZVN0YXJ0O1xuXG4gICAgaWYgKGZyb21Ob2RlTmFtZSA9PT0gdG9Ob2RlTmFtZSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBmcm9tQ29kZVN0YXJ0ID0gZnJvbU5vZGVOYW1lLmNoYXJDb2RlQXQoMCk7XG4gICAgdG9Db2RlU3RhcnQgPSB0b05vZGVOYW1lLmNoYXJDb2RlQXQoMCk7XG5cbiAgICAvLyBJZiB0aGUgdGFyZ2V0IGVsZW1lbnQgaXMgYSB2aXJ0dWFsIERPTSBub2RlIG9yIFNWRyBub2RlIHRoZW4gd2UgbWF5XG4gICAgLy8gbmVlZCB0byBub3JtYWxpemUgdGhlIHRhZyBuYW1lIGJlZm9yZSBjb21wYXJpbmcuIE5vcm1hbCBIVE1MIGVsZW1lbnRzIHRoYXQgYXJlXG4gICAgLy8gaW4gdGhlIFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbFwiXG4gICAgLy8gYXJlIGNvbnZlcnRlZCB0byB1cHBlciBjYXNlXG4gICAgaWYgKGZyb21Db2RlU3RhcnQgPD0gOTAgJiYgdG9Db2RlU3RhcnQgPj0gOTcpIHsgLy8gZnJvbSBpcyB1cHBlciBhbmQgdG8gaXMgbG93ZXJcbiAgICAgICAgcmV0dXJuIGZyb21Ob2RlTmFtZSA9PT0gdG9Ob2RlTmFtZS50b1VwcGVyQ2FzZSgpO1xuICAgIH0gZWxzZSBpZiAodG9Db2RlU3RhcnQgPD0gOTAgJiYgZnJvbUNvZGVTdGFydCA+PSA5NykgeyAvLyB0byBpcyB1cHBlciBhbmQgZnJvbSBpcyBsb3dlclxuICAgICAgICByZXR1cm4gdG9Ob2RlTmFtZSA9PT0gZnJvbU5vZGVOYW1lLnRvVXBwZXJDYXNlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cblxuLyoqXG4gKiBDcmVhdGUgYW4gZWxlbWVudCwgb3B0aW9uYWxseSB3aXRoIGEga25vd24gbmFtZXNwYWNlIFVSSS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSB0aGUgZWxlbWVudCBuYW1lLCBlLmcuICdkaXYnIG9yICdzdmcnXG4gKiBAcGFyYW0ge3N0cmluZ30gW25hbWVzcGFjZVVSSV0gdGhlIGVsZW1lbnQncyBuYW1lc3BhY2UgVVJJLCBpLmUuIHRoZSB2YWx1ZSBvZlxuICogaXRzIGB4bWxuc2AgYXR0cmlidXRlIG9yIGl0cyBpbmZlcnJlZCBuYW1lc3BhY2UuXG4gKlxuICogQHJldHVybiB7RWxlbWVudH1cbiAqL1xuZnVuY3Rpb24gY3JlYXRlRWxlbWVudE5TKG5hbWUsIG5hbWVzcGFjZVVSSSkge1xuICAgIHJldHVybiAhbmFtZXNwYWNlVVJJIHx8IG5hbWVzcGFjZVVSSSA9PT0gTlNfWEhUTUwgP1xuICAgICAgICBkb2MuY3JlYXRlRWxlbWVudChuYW1lKSA6XG4gICAgICAgIGRvYy5jcmVhdGVFbGVtZW50TlMobmFtZXNwYWNlVVJJLCBuYW1lKTtcbn1cblxuLyoqXG4gKiBDb3BpZXMgdGhlIGNoaWxkcmVuIG9mIG9uZSBET00gZWxlbWVudCB0byBhbm90aGVyIERPTSBlbGVtZW50XG4gKi9cbmZ1bmN0aW9uIG1vdmVDaGlsZHJlbihmcm9tRWwsIHRvRWwpIHtcbiAgICB2YXIgY3VyQ2hpbGQgPSBmcm9tRWwuZmlyc3RDaGlsZDtcbiAgICB3aGlsZSAoY3VyQ2hpbGQpIHtcbiAgICAgICAgdmFyIG5leHRDaGlsZCA9IGN1ckNoaWxkLm5leHRTaWJsaW5nO1xuICAgICAgICB0b0VsLmFwcGVuZENoaWxkKGN1ckNoaWxkKTtcbiAgICAgICAgY3VyQ2hpbGQgPSBuZXh0Q2hpbGQ7XG4gICAgfVxuICAgIHJldHVybiB0b0VsO1xufVxuXG5mdW5jdGlvbiBzeW5jQm9vbGVhbkF0dHJQcm9wKGZyb21FbCwgdG9FbCwgbmFtZSkge1xuICAgIGlmIChmcm9tRWxbbmFtZV0gIT09IHRvRWxbbmFtZV0pIHtcbiAgICAgICAgZnJvbUVsW25hbWVdID0gdG9FbFtuYW1lXTtcbiAgICAgICAgaWYgKGZyb21FbFtuYW1lXSkge1xuICAgICAgICAgICAgZnJvbUVsLnNldEF0dHJpYnV0ZShuYW1lLCAnJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmcm9tRWwucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG52YXIgc3BlY2lhbEVsSGFuZGxlcnMgPSB7XG4gICAgT1BUSU9OOiBmdW5jdGlvbihmcm9tRWwsIHRvRWwpIHtcbiAgICAgICAgdmFyIHBhcmVudE5vZGUgPSBmcm9tRWwucGFyZW50Tm9kZTtcbiAgICAgICAgaWYgKHBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgIHZhciBwYXJlbnROYW1lID0gcGFyZW50Tm9kZS5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgaWYgKHBhcmVudE5hbWUgPT09ICdPUFRHUk9VUCcpIHtcbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlID0gcGFyZW50Tm9kZS5wYXJlbnROb2RlO1xuICAgICAgICAgICAgICAgIHBhcmVudE5hbWUgPSBwYXJlbnROb2RlICYmIHBhcmVudE5vZGUubm9kZU5hbWUudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwYXJlbnROYW1lID09PSAnU0VMRUNUJyAmJiAhcGFyZW50Tm9kZS5oYXNBdHRyaWJ1dGUoJ211bHRpcGxlJykpIHtcbiAgICAgICAgICAgICAgICBpZiAoZnJvbUVsLmhhc0F0dHJpYnV0ZSgnc2VsZWN0ZWQnKSAmJiAhdG9FbC5zZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBXb3JrYXJvdW5kIGZvciBNUyBFZGdlIGJ1ZyB3aGVyZSB0aGUgJ3NlbGVjdGVkJyBhdHRyaWJ1dGUgY2FuIG9ubHkgYmVcbiAgICAgICAgICAgICAgICAgICAgLy8gcmVtb3ZlZCBpZiBzZXQgdG8gYSBub24tZW1wdHkgdmFsdWU6XG4gICAgICAgICAgICAgICAgICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1pY3Jvc29mdC5jb20vZW4tdXMvbWljcm9zb2Z0LWVkZ2UvcGxhdGZvcm0vaXNzdWVzLzEyMDg3Njc5L1xuICAgICAgICAgICAgICAgICAgICBmcm9tRWwuc2V0QXR0cmlidXRlKCdzZWxlY3RlZCcsICdzZWxlY3RlZCcpO1xuICAgICAgICAgICAgICAgICAgICBmcm9tRWwucmVtb3ZlQXR0cmlidXRlKCdzZWxlY3RlZCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBXZSBoYXZlIHRvIHJlc2V0IHNlbGVjdCBlbGVtZW50J3Mgc2VsZWN0ZWRJbmRleCB0byAtMSwgb3RoZXJ3aXNlIHNldHRpbmdcbiAgICAgICAgICAgICAgICAvLyBmcm9tRWwuc2VsZWN0ZWQgdXNpbmcgdGhlIHN5bmNCb29sZWFuQXR0clByb3AgYmVsb3cgaGFzIG5vIGVmZmVjdC5cbiAgICAgICAgICAgICAgICAvLyBUaGUgY29ycmVjdCBzZWxlY3RlZEluZGV4IHdpbGwgYmUgc2V0IGluIHRoZSBTRUxFQ1Qgc3BlY2lhbCBoYW5kbGVyIGJlbG93LlxuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuc2VsZWN0ZWRJbmRleCA9IC0xO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHN5bmNCb29sZWFuQXR0clByb3AoZnJvbUVsLCB0b0VsLCAnc2VsZWN0ZWQnKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFRoZSBcInZhbHVlXCIgYXR0cmlidXRlIGlzIHNwZWNpYWwgZm9yIHRoZSA8aW5wdXQ+IGVsZW1lbnQgc2luY2UgaXQgc2V0c1xuICAgICAqIHRoZSBpbml0aWFsIHZhbHVlLiBDaGFuZ2luZyB0aGUgXCJ2YWx1ZVwiIGF0dHJpYnV0ZSB3aXRob3V0IGNoYW5naW5nIHRoZVxuICAgICAqIFwidmFsdWVcIiBwcm9wZXJ0eSB3aWxsIGhhdmUgbm8gZWZmZWN0IHNpbmNlIGl0IGlzIG9ubHkgdXNlZCB0byB0aGUgc2V0IHRoZVxuICAgICAqIGluaXRpYWwgdmFsdWUuICBTaW1pbGFyIGZvciB0aGUgXCJjaGVja2VkXCIgYXR0cmlidXRlLCBhbmQgXCJkaXNhYmxlZFwiLlxuICAgICAqL1xuICAgIElOUFVUOiBmdW5jdGlvbihmcm9tRWwsIHRvRWwpIHtcbiAgICAgICAgc3luY0Jvb2xlYW5BdHRyUHJvcChmcm9tRWwsIHRvRWwsICdjaGVja2VkJyk7XG4gICAgICAgIHN5bmNCb29sZWFuQXR0clByb3AoZnJvbUVsLCB0b0VsLCAnZGlzYWJsZWQnKTtcblxuICAgICAgICBpZiAoZnJvbUVsLnZhbHVlICE9PSB0b0VsLnZhbHVlKSB7XG4gICAgICAgICAgICBmcm9tRWwudmFsdWUgPSB0b0VsLnZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0b0VsLmhhc0F0dHJpYnV0ZSgndmFsdWUnKSkge1xuICAgICAgICAgICAgZnJvbUVsLnJlbW92ZUF0dHJpYnV0ZSgndmFsdWUnKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBURVhUQVJFQTogZnVuY3Rpb24oZnJvbUVsLCB0b0VsKSB7XG4gICAgICAgIHZhciBuZXdWYWx1ZSA9IHRvRWwudmFsdWU7XG4gICAgICAgIGlmIChmcm9tRWwudmFsdWUgIT09IG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICBmcm9tRWwudmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBmaXJzdENoaWxkID0gZnJvbUVsLmZpcnN0Q2hpbGQ7XG4gICAgICAgIGlmIChmaXJzdENoaWxkKSB7XG4gICAgICAgICAgICAvLyBOZWVkZWQgZm9yIElFLiBBcHBhcmVudGx5IElFIHNldHMgdGhlIHBsYWNlaG9sZGVyIGFzIHRoZVxuICAgICAgICAgICAgLy8gbm9kZSB2YWx1ZSBhbmQgdmlzZSB2ZXJzYS4gVGhpcyBpZ25vcmVzIGFuIGVtcHR5IHVwZGF0ZS5cbiAgICAgICAgICAgIHZhciBvbGRWYWx1ZSA9IGZpcnN0Q2hpbGQubm9kZVZhbHVlO1xuXG4gICAgICAgICAgICBpZiAob2xkVmFsdWUgPT0gbmV3VmFsdWUgfHwgKCFuZXdWYWx1ZSAmJiBvbGRWYWx1ZSA9PSBmcm9tRWwucGxhY2Vob2xkZXIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmaXJzdENoaWxkLm5vZGVWYWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBTRUxFQ1Q6IGZ1bmN0aW9uKGZyb21FbCwgdG9FbCkge1xuICAgICAgICBpZiAoIXRvRWwuaGFzQXR0cmlidXRlKCdtdWx0aXBsZScpKSB7XG4gICAgICAgICAgICB2YXIgc2VsZWN0ZWRJbmRleCA9IC0xO1xuICAgICAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICAgICAgLy8gV2UgaGF2ZSB0byBsb29wIHRocm91Z2ggY2hpbGRyZW4gb2YgZnJvbUVsLCBub3QgdG9FbCBzaW5jZSBub2RlcyBjYW4gYmUgbW92ZWRcbiAgICAgICAgICAgIC8vIGZyb20gdG9FbCB0byBmcm9tRWwgZGlyZWN0bHkgd2hlbiBtb3JwaGluZy5cbiAgICAgICAgICAgIC8vIEF0IHRoZSB0aW1lIHRoaXMgc3BlY2lhbCBoYW5kbGVyIGlzIGludm9rZWQsIGFsbCBjaGlsZHJlbiBoYXZlIGFscmVhZHkgYmVlbiBtb3JwaGVkXG4gICAgICAgICAgICAvLyBhbmQgYXBwZW5kZWQgdG8gLyByZW1vdmVkIGZyb20gZnJvbUVsLCBzbyB1c2luZyBmcm9tRWwgaGVyZSBpcyBzYWZlIGFuZCBjb3JyZWN0LlxuICAgICAgICAgICAgdmFyIGN1ckNoaWxkID0gZnJvbUVsLmZpcnN0Q2hpbGQ7XG4gICAgICAgICAgICB2YXIgb3B0Z3JvdXA7XG4gICAgICAgICAgICB2YXIgbm9kZU5hbWU7XG4gICAgICAgICAgICB3aGlsZShjdXJDaGlsZCkge1xuICAgICAgICAgICAgICAgIG5vZGVOYW1lID0gY3VyQ2hpbGQubm9kZU5hbWUgJiYgY3VyQ2hpbGQubm9kZU5hbWUudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICBpZiAobm9kZU5hbWUgPT09ICdPUFRHUk9VUCcpIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0Z3JvdXAgPSBjdXJDaGlsZDtcbiAgICAgICAgICAgICAgICAgICAgY3VyQ2hpbGQgPSBvcHRncm91cC5maXJzdENoaWxkO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChub2RlTmFtZSA9PT0gJ09QVElPTicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJDaGlsZC5oYXNBdHRyaWJ1dGUoJ3NlbGVjdGVkJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZEluZGV4ID0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjdXJDaGlsZCA9IGN1ckNoaWxkLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWN1ckNoaWxkICYmIG9wdGdyb3VwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJDaGlsZCA9IG9wdGdyb3VwLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgb3B0Z3JvdXAgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmcm9tRWwuc2VsZWN0ZWRJbmRleCA9IHNlbGVjdGVkSW5kZXg7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG52YXIgRUxFTUVOVF9OT0RFID0gMTtcbnZhciBET0NVTUVOVF9GUkFHTUVOVF9OT0RFJDEgPSAxMTtcbnZhciBURVhUX05PREUgPSAzO1xudmFyIENPTU1FTlRfTk9ERSA9IDg7XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5mdW5jdGlvbiBkZWZhdWx0R2V0Tm9kZUtleShub2RlKSB7XG4gIGlmIChub2RlKSB7XG4gICAgcmV0dXJuIChub2RlLmdldEF0dHJpYnV0ZSAmJiBub2RlLmdldEF0dHJpYnV0ZSgnaWQnKSkgfHwgbm9kZS5pZDtcbiAgfVxufVxuXG5mdW5jdGlvbiBtb3JwaGRvbUZhY3RvcnkobW9ycGhBdHRycykge1xuXG4gIHJldHVybiBmdW5jdGlvbiBtb3JwaGRvbShmcm9tTm9kZSwgdG9Ob2RlLCBvcHRpb25zKSB7XG4gICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB0b05vZGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpZiAoZnJvbU5vZGUubm9kZU5hbWUgPT09ICcjZG9jdW1lbnQnIHx8IGZyb21Ob2RlLm5vZGVOYW1lID09PSAnSFRNTCcgfHwgZnJvbU5vZGUubm9kZU5hbWUgPT09ICdCT0RZJykge1xuICAgICAgICB2YXIgdG9Ob2RlSHRtbCA9IHRvTm9kZTtcbiAgICAgICAgdG9Ob2RlID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2h0bWwnKTtcbiAgICAgICAgdG9Ob2RlLmlubmVySFRNTCA9IHRvTm9kZUh0bWw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0b05vZGUgPSB0b0VsZW1lbnQodG9Ob2RlKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRvTm9kZS5ub2RlVHlwZSA9PT0gRE9DVU1FTlRfRlJBR01FTlRfTk9ERSQxKSB7XG4gICAgICB0b05vZGUgPSB0b05vZGUuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgfVxuXG4gICAgdmFyIGdldE5vZGVLZXkgPSBvcHRpb25zLmdldE5vZGVLZXkgfHwgZGVmYXVsdEdldE5vZGVLZXk7XG4gICAgdmFyIG9uQmVmb3JlTm9kZUFkZGVkID0gb3B0aW9ucy5vbkJlZm9yZU5vZGVBZGRlZCB8fCBub29wO1xuICAgIHZhciBvbk5vZGVBZGRlZCA9IG9wdGlvbnMub25Ob2RlQWRkZWQgfHwgbm9vcDtcbiAgICB2YXIgb25CZWZvcmVFbFVwZGF0ZWQgPSBvcHRpb25zLm9uQmVmb3JlRWxVcGRhdGVkIHx8IG5vb3A7XG4gICAgdmFyIG9uRWxVcGRhdGVkID0gb3B0aW9ucy5vbkVsVXBkYXRlZCB8fCBub29wO1xuICAgIHZhciBvbkJlZm9yZU5vZGVEaXNjYXJkZWQgPSBvcHRpb25zLm9uQmVmb3JlTm9kZURpc2NhcmRlZCB8fCBub29wO1xuICAgIHZhciBvbk5vZGVEaXNjYXJkZWQgPSBvcHRpb25zLm9uTm9kZURpc2NhcmRlZCB8fCBub29wO1xuICAgIHZhciBvbkJlZm9yZUVsQ2hpbGRyZW5VcGRhdGVkID0gb3B0aW9ucy5vbkJlZm9yZUVsQ2hpbGRyZW5VcGRhdGVkIHx8IG5vb3A7XG4gICAgdmFyIHNraXBGcm9tQ2hpbGRyZW4gPSBvcHRpb25zLnNraXBGcm9tQ2hpbGRyZW4gfHwgbm9vcDtcbiAgICB2YXIgYWRkQ2hpbGQgPSBvcHRpb25zLmFkZENoaWxkIHx8IGZ1bmN0aW9uKHBhcmVudCwgY2hpbGQpeyByZXR1cm4gcGFyZW50LmFwcGVuZENoaWxkKGNoaWxkKTsgfTtcbiAgICB2YXIgY2hpbGRyZW5Pbmx5ID0gb3B0aW9ucy5jaGlsZHJlbk9ubHkgPT09IHRydWU7XG5cbiAgICAvLyBUaGlzIG9iamVjdCBpcyB1c2VkIGFzIGEgbG9va3VwIHRvIHF1aWNrbHkgZmluZCBhbGwga2V5ZWQgZWxlbWVudHMgaW4gdGhlIG9yaWdpbmFsIERPTSB0cmVlLlxuICAgIHZhciBmcm9tTm9kZXNMb29rdXAgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIHZhciBrZXllZFJlbW92YWxMaXN0ID0gW107XG5cbiAgICBmdW5jdGlvbiBhZGRLZXllZFJlbW92YWwoa2V5KSB7XG4gICAgICBrZXllZFJlbW92YWxMaXN0LnB1c2goa2V5KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB3YWxrRGlzY2FyZGVkQ2hpbGROb2Rlcyhub2RlLCBza2lwS2V5ZWROb2Rlcykge1xuICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IEVMRU1FTlRfTk9ERSkge1xuICAgICAgICB2YXIgY3VyQ2hpbGQgPSBub2RlLmZpcnN0Q2hpbGQ7XG4gICAgICAgIHdoaWxlIChjdXJDaGlsZCkge1xuXG4gICAgICAgICAgdmFyIGtleSA9IHVuZGVmaW5lZDtcblxuICAgICAgICAgIGlmIChza2lwS2V5ZWROb2RlcyAmJiAoa2V5ID0gZ2V0Tm9kZUtleShjdXJDaGlsZCkpKSB7XG4gICAgICAgICAgICAvLyBJZiB3ZSBhcmUgc2tpcHBpbmcga2V5ZWQgbm9kZXMgdGhlbiB3ZSBhZGQgdGhlIGtleVxuICAgICAgICAgICAgLy8gdG8gYSBsaXN0IHNvIHRoYXQgaXQgY2FuIGJlIGhhbmRsZWQgYXQgdGhlIHZlcnkgZW5kLlxuICAgICAgICAgICAgYWRkS2V5ZWRSZW1vdmFsKGtleSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIE9ubHkgcmVwb3J0IHRoZSBub2RlIGFzIGRpc2NhcmRlZCBpZiBpdCBpcyBub3Qga2V5ZWQuIFdlIGRvIHRoaXMgYmVjYXVzZVxuICAgICAgICAgICAgLy8gYXQgdGhlIGVuZCB3ZSBsb29wIHRocm91Z2ggYWxsIGtleWVkIGVsZW1lbnRzIHRoYXQgd2VyZSB1bm1hdGNoZWRcbiAgICAgICAgICAgIC8vIGFuZCB0aGVuIGRpc2NhcmQgdGhlbSBpbiBvbmUgZmluYWwgcGFzcy5cbiAgICAgICAgICAgIG9uTm9kZURpc2NhcmRlZChjdXJDaGlsZCk7XG4gICAgICAgICAgICBpZiAoY3VyQ2hpbGQuZmlyc3RDaGlsZCkge1xuICAgICAgICAgICAgICB3YWxrRGlzY2FyZGVkQ2hpbGROb2RlcyhjdXJDaGlsZCwgc2tpcEtleWVkTm9kZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGN1ckNoaWxkID0gY3VyQ2hpbGQubmV4dFNpYmxpbmc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAqIFJlbW92ZXMgYSBET00gbm9kZSBvdXQgb2YgdGhlIG9yaWdpbmFsIERPTVxuICAgICpcbiAgICAqIEBwYXJhbSAge05vZGV9IG5vZGUgVGhlIG5vZGUgdG8gcmVtb3ZlXG4gICAgKiBAcGFyYW0gIHtOb2RlfSBwYXJlbnROb2RlIFRoZSBub2RlcyBwYXJlbnRcbiAgICAqIEBwYXJhbSAge0Jvb2xlYW59IHNraXBLZXllZE5vZGVzIElmIHRydWUgdGhlbiBlbGVtZW50cyB3aXRoIGtleXMgd2lsbCBiZSBza2lwcGVkIGFuZCBub3QgZGlzY2FyZGVkLlxuICAgICogQHJldHVybiB7dW5kZWZpbmVkfVxuICAgICovXG4gICAgZnVuY3Rpb24gcmVtb3ZlTm9kZShub2RlLCBwYXJlbnROb2RlLCBza2lwS2V5ZWROb2Rlcykge1xuICAgICAgaWYgKG9uQmVmb3JlTm9kZURpc2NhcmRlZChub2RlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAocGFyZW50Tm9kZSkge1xuICAgICAgICBwYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGUpO1xuICAgICAgfVxuXG4gICAgICBvbk5vZGVEaXNjYXJkZWQobm9kZSk7XG4gICAgICB3YWxrRGlzY2FyZGVkQ2hpbGROb2Rlcyhub2RlLCBza2lwS2V5ZWROb2Rlcyk7XG4gICAgfVxuXG4gICAgLy8gLy8gVHJlZVdhbGtlciBpbXBsZW1lbnRhdGlvbiBpcyBubyBmYXN0ZXIsIGJ1dCBrZWVwaW5nIHRoaXMgYXJvdW5kIGluIGNhc2UgdGhpcyBjaGFuZ2VzIGluIHRoZSBmdXR1cmVcbiAgICAvLyBmdW5jdGlvbiBpbmRleFRyZWUocm9vdCkge1xuICAgIC8vICAgICB2YXIgdHJlZVdhbGtlciA9IGRvY3VtZW50LmNyZWF0ZVRyZWVXYWxrZXIoXG4gICAgLy8gICAgICAgICByb290LFxuICAgIC8vICAgICAgICAgTm9kZUZpbHRlci5TSE9XX0VMRU1FTlQpO1xuICAgIC8vXG4gICAgLy8gICAgIHZhciBlbDtcbiAgICAvLyAgICAgd2hpbGUoKGVsID0gdHJlZVdhbGtlci5uZXh0Tm9kZSgpKSkge1xuICAgIC8vICAgICAgICAgdmFyIGtleSA9IGdldE5vZGVLZXkoZWwpO1xuICAgIC8vICAgICAgICAgaWYgKGtleSkge1xuICAgIC8vICAgICAgICAgICAgIGZyb21Ob2Rlc0xvb2t1cFtrZXldID0gZWw7XG4gICAgLy8gICAgICAgICB9XG4gICAgLy8gICAgIH1cbiAgICAvLyB9XG5cbiAgICAvLyAvLyBOb2RlSXRlcmF0b3IgaW1wbGVtZW50YXRpb24gaXMgbm8gZmFzdGVyLCBidXQga2VlcGluZyB0aGlzIGFyb3VuZCBpbiBjYXNlIHRoaXMgY2hhbmdlcyBpbiB0aGUgZnV0dXJlXG4gICAgLy9cbiAgICAvLyBmdW5jdGlvbiBpbmRleFRyZWUobm9kZSkge1xuICAgIC8vICAgICB2YXIgbm9kZUl0ZXJhdG9yID0gZG9jdW1lbnQuY3JlYXRlTm9kZUl0ZXJhdG9yKG5vZGUsIE5vZGVGaWx0ZXIuU0hPV19FTEVNRU5UKTtcbiAgICAvLyAgICAgdmFyIGVsO1xuICAgIC8vICAgICB3aGlsZSgoZWwgPSBub2RlSXRlcmF0b3IubmV4dE5vZGUoKSkpIHtcbiAgICAvLyAgICAgICAgIHZhciBrZXkgPSBnZXROb2RlS2V5KGVsKTtcbiAgICAvLyAgICAgICAgIGlmIChrZXkpIHtcbiAgICAvLyAgICAgICAgICAgICBmcm9tTm9kZXNMb29rdXBba2V5XSA9IGVsO1xuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICB9XG4gICAgLy8gfVxuXG4gICAgZnVuY3Rpb24gaW5kZXhUcmVlKG5vZGUpIHtcbiAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSBFTEVNRU5UX05PREUgfHwgbm9kZS5ub2RlVHlwZSA9PT0gRE9DVU1FTlRfRlJBR01FTlRfTk9ERSQxKSB7XG4gICAgICAgIHZhciBjdXJDaGlsZCA9IG5vZGUuZmlyc3RDaGlsZDtcbiAgICAgICAgd2hpbGUgKGN1ckNoaWxkKSB7XG4gICAgICAgICAgdmFyIGtleSA9IGdldE5vZGVLZXkoY3VyQ2hpbGQpO1xuICAgICAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgICAgIGZyb21Ob2Rlc0xvb2t1cFtrZXldID0gY3VyQ2hpbGQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gV2FsayByZWN1cnNpdmVseVxuICAgICAgICAgIGluZGV4VHJlZShjdXJDaGlsZCk7XG5cbiAgICAgICAgICBjdXJDaGlsZCA9IGN1ckNoaWxkLm5leHRTaWJsaW5nO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaW5kZXhUcmVlKGZyb21Ob2RlKTtcblxuICAgIGZ1bmN0aW9uIGhhbmRsZU5vZGVBZGRlZChlbCkge1xuICAgICAgb25Ob2RlQWRkZWQoZWwpO1xuXG4gICAgICB2YXIgY3VyQ2hpbGQgPSBlbC5maXJzdENoaWxkO1xuICAgICAgd2hpbGUgKGN1ckNoaWxkKSB7XG4gICAgICAgIHZhciBuZXh0U2libGluZyA9IGN1ckNoaWxkLm5leHRTaWJsaW5nO1xuXG4gICAgICAgIHZhciBrZXkgPSBnZXROb2RlS2V5KGN1ckNoaWxkKTtcbiAgICAgICAgaWYgKGtleSkge1xuICAgICAgICAgIHZhciB1bm1hdGNoZWRGcm9tRWwgPSBmcm9tTm9kZXNMb29rdXBba2V5XTtcbiAgICAgICAgICAvLyBpZiB3ZSBmaW5kIGEgZHVwbGljYXRlICNpZCBub2RlIGluIGNhY2hlLCByZXBsYWNlIGBlbGAgd2l0aCBjYWNoZSB2YWx1ZVxuICAgICAgICAgIC8vIGFuZCBtb3JwaCBpdCB0byB0aGUgY2hpbGQgbm9kZS5cbiAgICAgICAgICBpZiAodW5tYXRjaGVkRnJvbUVsICYmIGNvbXBhcmVOb2RlTmFtZXMoY3VyQ2hpbGQsIHVubWF0Y2hlZEZyb21FbCkpIHtcbiAgICAgICAgICAgIGN1ckNoaWxkLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHVubWF0Y2hlZEZyb21FbCwgY3VyQ2hpbGQpO1xuICAgICAgICAgICAgbW9ycGhFbCh1bm1hdGNoZWRGcm9tRWwsIGN1ckNoaWxkKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaGFuZGxlTm9kZUFkZGVkKGN1ckNoaWxkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gcmVjdXJzaXZlbHkgY2FsbCBmb3IgY3VyQ2hpbGQgYW5kIGl0J3MgY2hpbGRyZW4gdG8gc2VlIGlmIHdlIGZpbmQgc29tZXRoaW5nIGluXG4gICAgICAgICAgLy8gZnJvbU5vZGVzTG9va3VwXG4gICAgICAgICAgaGFuZGxlTm9kZUFkZGVkKGN1ckNoaWxkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGN1ckNoaWxkID0gbmV4dFNpYmxpbmc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYW51cEZyb21FbChmcm9tRWwsIGN1ckZyb21Ob2RlQ2hpbGQsIGN1ckZyb21Ob2RlS2V5KSB7XG4gICAgICAvLyBXZSBoYXZlIHByb2Nlc3NlZCBhbGwgb2YgdGhlIFwidG8gbm9kZXNcIi4gSWYgY3VyRnJvbU5vZGVDaGlsZCBpc1xuICAgICAgLy8gbm9uLW51bGwgdGhlbiB3ZSBzdGlsbCBoYXZlIHNvbWUgZnJvbSBub2RlcyBsZWZ0IG92ZXIgdGhhdCBuZWVkXG4gICAgICAvLyB0byBiZSByZW1vdmVkXG4gICAgICB3aGlsZSAoY3VyRnJvbU5vZGVDaGlsZCkge1xuICAgICAgICB2YXIgZnJvbU5leHRTaWJsaW5nID0gY3VyRnJvbU5vZGVDaGlsZC5uZXh0U2libGluZztcbiAgICAgICAgaWYgKChjdXJGcm9tTm9kZUtleSA9IGdldE5vZGVLZXkoY3VyRnJvbU5vZGVDaGlsZCkpKSB7XG4gICAgICAgICAgLy8gU2luY2UgdGhlIG5vZGUgaXMga2V5ZWQgaXQgbWlnaHQgYmUgbWF0Y2hlZCB1cCBsYXRlciBzbyB3ZSBkZWZlclxuICAgICAgICAgIC8vIHRoZSBhY3R1YWwgcmVtb3ZhbCB0byBsYXRlclxuICAgICAgICAgIGFkZEtleWVkUmVtb3ZhbChjdXJGcm9tTm9kZUtleSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gTk9URTogd2Ugc2tpcCBuZXN0ZWQga2V5ZWQgbm9kZXMgZnJvbSBiZWluZyByZW1vdmVkIHNpbmNlIHRoZXJlIGlzXG4gICAgICAgICAgLy8gICAgICAgc3RpbGwgYSBjaGFuY2UgdGhleSB3aWxsIGJlIG1hdGNoZWQgdXAgbGF0ZXJcbiAgICAgICAgICByZW1vdmVOb2RlKGN1ckZyb21Ob2RlQ2hpbGQsIGZyb21FbCwgdHJ1ZSAvKiBza2lwIGtleWVkIG5vZGVzICovKTtcbiAgICAgICAgfVxuICAgICAgICBjdXJGcm9tTm9kZUNoaWxkID0gZnJvbU5leHRTaWJsaW5nO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1vcnBoRWwoZnJvbUVsLCB0b0VsLCBjaGlsZHJlbk9ubHkpIHtcbiAgICAgIHZhciB0b0VsS2V5ID0gZ2V0Tm9kZUtleSh0b0VsKTtcblxuICAgICAgaWYgKHRvRWxLZXkpIHtcbiAgICAgICAgLy8gSWYgYW4gZWxlbWVudCB3aXRoIGFuIElEIGlzIGJlaW5nIG1vcnBoZWQgdGhlbiBpdCB3aWxsIGJlIGluIHRoZSBmaW5hbFxuICAgICAgICAvLyBET00gc28gY2xlYXIgaXQgb3V0IG9mIHRoZSBzYXZlZCBlbGVtZW50cyBjb2xsZWN0aW9uXG4gICAgICAgIGRlbGV0ZSBmcm9tTm9kZXNMb29rdXBbdG9FbEtleV07XG4gICAgICB9XG5cbiAgICAgIGlmICghY2hpbGRyZW5Pbmx5KSB7XG4gICAgICAgIC8vIG9wdGlvbmFsXG4gICAgICAgIHZhciBiZWZvcmVVcGRhdGVSZXN1bHQgPSBvbkJlZm9yZUVsVXBkYXRlZChmcm9tRWwsIHRvRWwpO1xuICAgICAgICBpZiAoYmVmb3JlVXBkYXRlUmVzdWx0ID09PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIGlmIChiZWZvcmVVcGRhdGVSZXN1bHQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgIGZyb21FbCA9IGJlZm9yZVVwZGF0ZVJlc3VsdDtcbiAgICAgICAgICAvLyByZWluZGV4IHRoZSBuZXcgZnJvbUVsIGluIGNhc2UgaXQncyBub3QgaW4gdGhlIHNhbWVcbiAgICAgICAgICAvLyB0cmVlIGFzIHRoZSBvcmlnaW5hbCBmcm9tRWxcbiAgICAgICAgICAvLyAoUGhvZW5peCBMaXZlVmlldyBzb21ldGltZXMgcmV0dXJucyBhIGNsb25lZCB0cmVlLFxuICAgICAgICAgIC8vICBidXQga2V5ZWQgbG9va3VwcyB3b3VsZCBzdGlsbCBwb2ludCB0byB0aGUgb3JpZ2luYWwgdHJlZSlcbiAgICAgICAgICBpbmRleFRyZWUoZnJvbUVsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHVwZGF0ZSBhdHRyaWJ1dGVzIG9uIG9yaWdpbmFsIERPTSBlbGVtZW50IGZpcnN0XG4gICAgICAgIG1vcnBoQXR0cnMoZnJvbUVsLCB0b0VsKTtcbiAgICAgICAgLy8gb3B0aW9uYWxcbiAgICAgICAgb25FbFVwZGF0ZWQoZnJvbUVsKTtcblxuICAgICAgICBpZiAob25CZWZvcmVFbENoaWxkcmVuVXBkYXRlZChmcm9tRWwsIHRvRWwpID09PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZnJvbUVsLm5vZGVOYW1lICE9PSAnVEVYVEFSRUEnKSB7XG4gICAgICAgIG1vcnBoQ2hpbGRyZW4oZnJvbUVsLCB0b0VsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNwZWNpYWxFbEhhbmRsZXJzLlRFWFRBUkVBKGZyb21FbCwgdG9FbCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW9ycGhDaGlsZHJlbihmcm9tRWwsIHRvRWwpIHtcbiAgICAgIHZhciBza2lwRnJvbSA9IHNraXBGcm9tQ2hpbGRyZW4oZnJvbUVsLCB0b0VsKTtcbiAgICAgIHZhciBjdXJUb05vZGVDaGlsZCA9IHRvRWwuZmlyc3RDaGlsZDtcbiAgICAgIHZhciBjdXJGcm9tTm9kZUNoaWxkID0gZnJvbUVsLmZpcnN0Q2hpbGQ7XG4gICAgICB2YXIgY3VyVG9Ob2RlS2V5O1xuICAgICAgdmFyIGN1ckZyb21Ob2RlS2V5O1xuXG4gICAgICB2YXIgZnJvbU5leHRTaWJsaW5nO1xuICAgICAgdmFyIHRvTmV4dFNpYmxpbmc7XG4gICAgICB2YXIgbWF0Y2hpbmdGcm9tRWw7XG5cbiAgICAgIC8vIHdhbGsgdGhlIGNoaWxkcmVuXG4gICAgICBvdXRlcjogd2hpbGUgKGN1clRvTm9kZUNoaWxkKSB7XG4gICAgICAgIHRvTmV4dFNpYmxpbmcgPSBjdXJUb05vZGVDaGlsZC5uZXh0U2libGluZztcbiAgICAgICAgY3VyVG9Ob2RlS2V5ID0gZ2V0Tm9kZUtleShjdXJUb05vZGVDaGlsZCk7XG5cbiAgICAgICAgLy8gd2FsayB0aGUgZnJvbU5vZGUgY2hpbGRyZW4gYWxsIHRoZSB3YXkgdGhyb3VnaFxuICAgICAgICB3aGlsZSAoIXNraXBGcm9tICYmIGN1ckZyb21Ob2RlQ2hpbGQpIHtcbiAgICAgICAgICBmcm9tTmV4dFNpYmxpbmcgPSBjdXJGcm9tTm9kZUNoaWxkLm5leHRTaWJsaW5nO1xuXG4gICAgICAgICAgaWYgKGN1clRvTm9kZUNoaWxkLmlzU2FtZU5vZGUgJiYgY3VyVG9Ob2RlQ2hpbGQuaXNTYW1lTm9kZShjdXJGcm9tTm9kZUNoaWxkKSkge1xuICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQgPSB0b05leHRTaWJsaW5nO1xuICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IGZyb21OZXh0U2libGluZztcbiAgICAgICAgICAgIGNvbnRpbnVlIG91dGVyO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGN1ckZyb21Ob2RlS2V5ID0gZ2V0Tm9kZUtleShjdXJGcm9tTm9kZUNoaWxkKTtcblxuICAgICAgICAgIHZhciBjdXJGcm9tTm9kZVR5cGUgPSBjdXJGcm9tTm9kZUNoaWxkLm5vZGVUeXBlO1xuXG4gICAgICAgICAgLy8gdGhpcyBtZWFucyBpZiB0aGUgY3VyRnJvbU5vZGVDaGlsZCBkb2VzbnQgaGF2ZSBhIG1hdGNoIHdpdGggdGhlIGN1clRvTm9kZUNoaWxkXG4gICAgICAgICAgdmFyIGlzQ29tcGF0aWJsZSA9IHVuZGVmaW5lZDtcblxuICAgICAgICAgIGlmIChjdXJGcm9tTm9kZVR5cGUgPT09IGN1clRvTm9kZUNoaWxkLm5vZGVUeXBlKSB7XG4gICAgICAgICAgICBpZiAoY3VyRnJvbU5vZGVUeXBlID09PSBFTEVNRU5UX05PREUpIHtcbiAgICAgICAgICAgICAgLy8gQm90aCBub2RlcyBiZWluZyBjb21wYXJlZCBhcmUgRWxlbWVudCBub2Rlc1xuXG4gICAgICAgICAgICAgIGlmIChjdXJUb05vZGVLZXkpIHtcbiAgICAgICAgICAgICAgICAvLyBUaGUgdGFyZ2V0IG5vZGUgaGFzIGEga2V5IHNvIHdlIHdhbnQgdG8gbWF0Y2ggaXQgdXAgd2l0aCB0aGUgY29ycmVjdCBlbGVtZW50XG4gICAgICAgICAgICAgICAgLy8gaW4gdGhlIG9yaWdpbmFsIERPTSB0cmVlXG4gICAgICAgICAgICAgICAgaWYgKGN1clRvTm9kZUtleSAhPT0gY3VyRnJvbU5vZGVLZXkpIHtcbiAgICAgICAgICAgICAgICAgIC8vIFRoZSBjdXJyZW50IGVsZW1lbnQgaW4gdGhlIG9yaWdpbmFsIERPTSB0cmVlIGRvZXMgbm90IGhhdmUgYSBtYXRjaGluZyBrZXkgc29cbiAgICAgICAgICAgICAgICAgIC8vIGxldCdzIGNoZWNrIG91ciBsb29rdXAgdG8gc2VlIGlmIHRoZXJlIGlzIGEgbWF0Y2hpbmcgZWxlbWVudCBpbiB0aGUgb3JpZ2luYWxcbiAgICAgICAgICAgICAgICAgIC8vIERPTSB0cmVlXG4gICAgICAgICAgICAgICAgICBpZiAoKG1hdGNoaW5nRnJvbUVsID0gZnJvbU5vZGVzTG9va3VwW2N1clRvTm9kZUtleV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmcm9tTmV4dFNpYmxpbmcgPT09IG1hdGNoaW5nRnJvbUVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgLy8gU3BlY2lhbCBjYXNlIGZvciBzaW5nbGUgZWxlbWVudCByZW1vdmFscy4gVG8gYXZvaWQgcmVtb3ZpbmcgdGhlIG9yaWdpbmFsXG4gICAgICAgICAgICAgICAgICAgICAgLy8gRE9NIG5vZGUgb3V0IG9mIHRoZSB0cmVlIChzaW5jZSB0aGF0IGNhbiBicmVhayBDU1MgdHJhbnNpdGlvbnMsIGV0Yy4pLFxuICAgICAgICAgICAgICAgICAgICAgIC8vIHdlIHdpbGwgaW5zdGVhZCBkaXNjYXJkIHRoZSBjdXJyZW50IG5vZGUgYW5kIHdhaXQgdW50aWwgdGhlIG5leHRcbiAgICAgICAgICAgICAgICAgICAgICAvLyBpdGVyYXRpb24gdG8gcHJvcGVybHkgbWF0Y2ggdXAgdGhlIGtleWVkIHRhcmdldCBlbGVtZW50IHdpdGggaXRzIG1hdGNoaW5nXG4gICAgICAgICAgICAgICAgICAgICAgLy8gZWxlbWVudCBpbiB0aGUgb3JpZ2luYWwgdHJlZVxuICAgICAgICAgICAgICAgICAgICAgIGlzQ29tcGF0aWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgIC8vIFdlIGZvdW5kIGEgbWF0Y2hpbmcga2V5ZWQgZWxlbWVudCBzb21ld2hlcmUgaW4gdGhlIG9yaWdpbmFsIERPTSB0cmVlLlxuICAgICAgICAgICAgICAgICAgICAgIC8vIExldCdzIG1vdmUgdGhlIG9yaWdpbmFsIERPTSBub2RlIGludG8gdGhlIGN1cnJlbnQgcG9zaXRpb24gYW5kIG1vcnBoXG4gICAgICAgICAgICAgICAgICAgICAgLy8gaXQuXG5cbiAgICAgICAgICAgICAgICAgICAgICAvLyBOT1RFOiBXZSB1c2UgaW5zZXJ0QmVmb3JlIGluc3RlYWQgb2YgcmVwbGFjZUNoaWxkIGJlY2F1c2Ugd2Ugd2FudCB0byBnbyB0aHJvdWdoXG4gICAgICAgICAgICAgICAgICAgICAgLy8gdGhlIGByZW1vdmVOb2RlKClgIGZ1bmN0aW9uIGZvciB0aGUgbm9kZSB0aGF0IGlzIGJlaW5nIGRpc2NhcmRlZCBzbyB0aGF0XG4gICAgICAgICAgICAgICAgICAgICAgLy8gYWxsIGxpZmVjeWNsZSBob29rcyBhcmUgY29ycmVjdGx5IGludm9rZWRcbiAgICAgICAgICAgICAgICAgICAgICBmcm9tRWwuaW5zZXJ0QmVmb3JlKG1hdGNoaW5nRnJvbUVsLCBjdXJGcm9tTm9kZUNoaWxkKTtcblxuICAgICAgICAgICAgICAgICAgICAgIC8vIGZyb21OZXh0U2libGluZyA9IGN1ckZyb21Ob2RlQ2hpbGQubmV4dFNpYmxpbmc7XG5cbiAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VyRnJvbU5vZGVLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNpbmNlIHRoZSBub2RlIGlzIGtleWVkIGl0IG1pZ2h0IGJlIG1hdGNoZWQgdXAgbGF0ZXIgc28gd2UgZGVmZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoZSBhY3R1YWwgcmVtb3ZhbCB0byBsYXRlclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkS2V5ZWRSZW1vdmFsKGN1ckZyb21Ob2RlS2V5KTtcbiAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gTk9URTogd2Ugc2tpcCBuZXN0ZWQga2V5ZWQgbm9kZXMgZnJvbSBiZWluZyByZW1vdmVkIHNpbmNlIHRoZXJlIGlzXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICBzdGlsbCBhIGNoYW5jZSB0aGV5IHdpbGwgYmUgbWF0Y2hlZCB1cCBsYXRlclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlTm9kZShjdXJGcm9tTm9kZUNoaWxkLCBmcm9tRWwsIHRydWUgLyogc2tpcCBrZXllZCBub2RlcyAqLyk7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IG1hdGNoaW5nRnJvbUVsO1xuICAgICAgICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlS2V5ID0gZ2V0Tm9kZUtleShjdXJGcm9tTm9kZUNoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhlIG5vZGVzIGFyZSBub3QgY29tcGF0aWJsZSBzaW5jZSB0aGUgXCJ0b1wiIG5vZGUgaGFzIGEga2V5IGFuZCB0aGVyZVxuICAgICAgICAgICAgICAgICAgICAvLyBpcyBubyBtYXRjaGluZyBrZXllZCBub2RlIGluIHRoZSBzb3VyY2UgdHJlZVxuICAgICAgICAgICAgICAgICAgICBpc0NvbXBhdGlibGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoY3VyRnJvbU5vZGVLZXkpIHtcbiAgICAgICAgICAgICAgICAvLyBUaGUgb3JpZ2luYWwgaGFzIGEga2V5XG4gICAgICAgICAgICAgICAgaXNDb21wYXRpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpc0NvbXBhdGlibGUgPSBpc0NvbXBhdGlibGUgIT09IGZhbHNlICYmIGNvbXBhcmVOb2RlTmFtZXMoY3VyRnJvbU5vZGVDaGlsZCwgY3VyVG9Ob2RlQ2hpbGQpO1xuICAgICAgICAgICAgICBpZiAoaXNDb21wYXRpYmxlKSB7XG4gICAgICAgICAgICAgICAgLy8gV2UgZm91bmQgY29tcGF0aWJsZSBET00gZWxlbWVudHMgc28gdHJhbnNmb3JtXG4gICAgICAgICAgICAgICAgLy8gdGhlIGN1cnJlbnQgXCJmcm9tXCIgbm9kZSB0byBtYXRjaCB0aGUgY3VycmVudFxuICAgICAgICAgICAgICAgIC8vIHRhcmdldCBET00gbm9kZS5cbiAgICAgICAgICAgICAgICAvLyBNT1JQSFxuICAgICAgICAgICAgICAgIG1vcnBoRWwoY3VyRnJvbU5vZGVDaGlsZCwgY3VyVG9Ob2RlQ2hpbGQpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY3VyRnJvbU5vZGVUeXBlID09PSBURVhUX05PREUgfHwgY3VyRnJvbU5vZGVUeXBlID09IENPTU1FTlRfTk9ERSkge1xuICAgICAgICAgICAgICAvLyBCb3RoIG5vZGVzIGJlaW5nIGNvbXBhcmVkIGFyZSBUZXh0IG9yIENvbW1lbnQgbm9kZXNcbiAgICAgICAgICAgICAgaXNDb21wYXRpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgLy8gU2ltcGx5IHVwZGF0ZSBub2RlVmFsdWUgb24gdGhlIG9yaWdpbmFsIG5vZGUgdG9cbiAgICAgICAgICAgICAgLy8gY2hhbmdlIHRoZSB0ZXh0IHZhbHVlXG4gICAgICAgICAgICAgIGlmIChjdXJGcm9tTm9kZUNoaWxkLm5vZGVWYWx1ZSAhPT0gY3VyVG9Ob2RlQ2hpbGQubm9kZVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZC5ub2RlVmFsdWUgPSBjdXJUb05vZGVDaGlsZC5ub2RlVmFsdWU7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChpc0NvbXBhdGlibGUpIHtcbiAgICAgICAgICAgIC8vIEFkdmFuY2UgYm90aCB0aGUgXCJ0b1wiIGNoaWxkIGFuZCB0aGUgXCJmcm9tXCIgY2hpbGQgc2luY2Ugd2UgZm91bmQgYSBtYXRjaFxuICAgICAgICAgICAgLy8gTm90aGluZyBlbHNlIHRvIGRvIGFzIHdlIGFscmVhZHkgcmVjdXJzaXZlbHkgY2FsbGVkIG1vcnBoQ2hpbGRyZW4gYWJvdmVcbiAgICAgICAgICAgIGN1clRvTm9kZUNoaWxkID0gdG9OZXh0U2libGluZztcbiAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICAgICAgICBjb250aW51ZSBvdXRlcjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBObyBjb21wYXRpYmxlIG1hdGNoIHNvIHJlbW92ZSB0aGUgb2xkIG5vZGUgZnJvbSB0aGUgRE9NIGFuZCBjb250aW51ZSB0cnlpbmcgdG8gZmluZCBhXG4gICAgICAgICAgLy8gbWF0Y2ggaW4gdGhlIG9yaWdpbmFsIERPTS4gSG93ZXZlciwgd2Ugb25seSBkbyB0aGlzIGlmIHRoZSBmcm9tIG5vZGUgaXMgbm90IGtleWVkXG4gICAgICAgICAgLy8gc2luY2UgaXQgaXMgcG9zc2libGUgdGhhdCBhIGtleWVkIG5vZGUgbWlnaHQgbWF0Y2ggdXAgd2l0aCBhIG5vZGUgc29tZXdoZXJlIGVsc2UgaW4gdGhlXG4gICAgICAgICAgLy8gdGFyZ2V0IHRyZWUgYW5kIHdlIGRvbid0IHdhbnQgdG8gZGlzY2FyZCBpdCBqdXN0IHlldCBzaW5jZSBpdCBzdGlsbCBtaWdodCBmaW5kIGFcbiAgICAgICAgICAvLyBob21lIGluIHRoZSBmaW5hbCBET00gdHJlZS4gQWZ0ZXIgZXZlcnl0aGluZyBpcyBkb25lIHdlIHdpbGwgcmVtb3ZlIGFueSBrZXllZCBub2Rlc1xuICAgICAgICAgIC8vIHRoYXQgZGlkbid0IGZpbmQgYSBob21lXG4gICAgICAgICAgaWYgKGN1ckZyb21Ob2RlS2V5KSB7XG4gICAgICAgICAgICAvLyBTaW5jZSB0aGUgbm9kZSBpcyBrZXllZCBpdCBtaWdodCBiZSBtYXRjaGVkIHVwIGxhdGVyIHNvIHdlIGRlZmVyXG4gICAgICAgICAgICAvLyB0aGUgYWN0dWFsIHJlbW92YWwgdG8gbGF0ZXJcbiAgICAgICAgICAgIGFkZEtleWVkUmVtb3ZhbChjdXJGcm9tTm9kZUtleSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIE5PVEU6IHdlIHNraXAgbmVzdGVkIGtleWVkIG5vZGVzIGZyb20gYmVpbmcgcmVtb3ZlZCBzaW5jZSB0aGVyZSBpc1xuICAgICAgICAgICAgLy8gICAgICAgc3RpbGwgYSBjaGFuY2UgdGhleSB3aWxsIGJlIG1hdGNoZWQgdXAgbGF0ZXJcbiAgICAgICAgICAgIHJlbW92ZU5vZGUoY3VyRnJvbU5vZGVDaGlsZCwgZnJvbUVsLCB0cnVlIC8qIHNraXAga2V5ZWQgbm9kZXMgKi8pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICAgIH0gLy8gRU5EOiB3aGlsZShjdXJGcm9tTm9kZUNoaWxkKSB7fVxuXG4gICAgICAgIC8vIElmIHdlIGdvdCB0aGlzIGZhciB0aGVuIHdlIGRpZCBub3QgZmluZCBhIGNhbmRpZGF0ZSBtYXRjaCBmb3JcbiAgICAgICAgLy8gb3VyIFwidG8gbm9kZVwiIGFuZCB3ZSBleGhhdXN0ZWQgYWxsIG9mIHRoZSBjaGlsZHJlbiBcImZyb21cIlxuICAgICAgICAvLyBub2Rlcy4gVGhlcmVmb3JlLCB3ZSB3aWxsIGp1c3QgYXBwZW5kIHRoZSBjdXJyZW50IFwidG9cIiBub2RlXG4gICAgICAgIC8vIHRvIHRoZSBlbmRcbiAgICAgICAgaWYgKGN1clRvTm9kZUtleSAmJiAobWF0Y2hpbmdGcm9tRWwgPSBmcm9tTm9kZXNMb29rdXBbY3VyVG9Ob2RlS2V5XSkgJiYgY29tcGFyZU5vZGVOYW1lcyhtYXRjaGluZ0Zyb21FbCwgY3VyVG9Ob2RlQ2hpbGQpKSB7XG4gICAgICAgICAgLy8gTU9SUEhcbiAgICAgICAgICBpZighc2tpcEZyb20peyBhZGRDaGlsZChmcm9tRWwsIG1hdGNoaW5nRnJvbUVsKTsgfVxuICAgICAgICAgIG1vcnBoRWwobWF0Y2hpbmdGcm9tRWwsIGN1clRvTm9kZUNoaWxkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgb25CZWZvcmVOb2RlQWRkZWRSZXN1bHQgPSBvbkJlZm9yZU5vZGVBZGRlZChjdXJUb05vZGVDaGlsZCk7XG4gICAgICAgICAgaWYgKG9uQmVmb3JlTm9kZUFkZGVkUmVzdWx0ICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgaWYgKG9uQmVmb3JlTm9kZUFkZGVkUmVzdWx0KSB7XG4gICAgICAgICAgICAgIGN1clRvTm9kZUNoaWxkID0gb25CZWZvcmVOb2RlQWRkZWRSZXN1bHQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjdXJUb05vZGVDaGlsZC5hY3R1YWxpemUpIHtcbiAgICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQgPSBjdXJUb05vZGVDaGlsZC5hY3R1YWxpemUoZnJvbUVsLm93bmVyRG9jdW1lbnQgfHwgZG9jKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFkZENoaWxkKGZyb21FbCwgY3VyVG9Ob2RlQ2hpbGQpO1xuICAgICAgICAgICAgaGFuZGxlTm9kZUFkZGVkKGN1clRvTm9kZUNoaWxkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjdXJUb05vZGVDaGlsZCA9IHRvTmV4dFNpYmxpbmc7XG4gICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICB9XG5cbiAgICAgIGNsZWFudXBGcm9tRWwoZnJvbUVsLCBjdXJGcm9tTm9kZUNoaWxkLCBjdXJGcm9tTm9kZUtleSk7XG5cbiAgICAgIHZhciBzcGVjaWFsRWxIYW5kbGVyID0gc3BlY2lhbEVsSGFuZGxlcnNbZnJvbUVsLm5vZGVOYW1lXTtcbiAgICAgIGlmIChzcGVjaWFsRWxIYW5kbGVyKSB7XG4gICAgICAgIHNwZWNpYWxFbEhhbmRsZXIoZnJvbUVsLCB0b0VsKTtcbiAgICAgIH1cbiAgICB9IC8vIEVORDogbW9ycGhDaGlsZHJlbiguLi4pXG5cbiAgICB2YXIgbW9ycGhlZE5vZGUgPSBmcm9tTm9kZTtcbiAgICB2YXIgbW9ycGhlZE5vZGVUeXBlID0gbW9ycGhlZE5vZGUubm9kZVR5cGU7XG4gICAgdmFyIHRvTm9kZVR5cGUgPSB0b05vZGUubm9kZVR5cGU7XG5cbiAgICBpZiAoIWNoaWxkcmVuT25seSkge1xuICAgICAgLy8gSGFuZGxlIHRoZSBjYXNlIHdoZXJlIHdlIGFyZSBnaXZlbiB0d28gRE9NIG5vZGVzIHRoYXQgYXJlIG5vdFxuICAgICAgLy8gY29tcGF0aWJsZSAoZS5nLiA8ZGl2PiAtLT4gPHNwYW4+IG9yIDxkaXY+IC0tPiBURVhUKVxuICAgICAgaWYgKG1vcnBoZWROb2RlVHlwZSA9PT0gRUxFTUVOVF9OT0RFKSB7XG4gICAgICAgIGlmICh0b05vZGVUeXBlID09PSBFTEVNRU5UX05PREUpIHtcbiAgICAgICAgICBpZiAoIWNvbXBhcmVOb2RlTmFtZXMoZnJvbU5vZGUsIHRvTm9kZSkpIHtcbiAgICAgICAgICAgIG9uTm9kZURpc2NhcmRlZChmcm9tTm9kZSk7XG4gICAgICAgICAgICBtb3JwaGVkTm9kZSA9IG1vdmVDaGlsZHJlbihmcm9tTm9kZSwgY3JlYXRlRWxlbWVudE5TKHRvTm9kZS5ub2RlTmFtZSwgdG9Ob2RlLm5hbWVzcGFjZVVSSSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBHb2luZyBmcm9tIGFuIGVsZW1lbnQgbm9kZSB0byBhIHRleHQgbm9kZVxuICAgICAgICAgIG1vcnBoZWROb2RlID0gdG9Ob2RlO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKG1vcnBoZWROb2RlVHlwZSA9PT0gVEVYVF9OT0RFIHx8IG1vcnBoZWROb2RlVHlwZSA9PT0gQ09NTUVOVF9OT0RFKSB7IC8vIFRleHQgb3IgY29tbWVudCBub2RlXG4gICAgICAgIGlmICh0b05vZGVUeXBlID09PSBtb3JwaGVkTm9kZVR5cGUpIHtcbiAgICAgICAgICBpZiAobW9ycGhlZE5vZGUubm9kZVZhbHVlICE9PSB0b05vZGUubm9kZVZhbHVlKSB7XG4gICAgICAgICAgICBtb3JwaGVkTm9kZS5ub2RlVmFsdWUgPSB0b05vZGUubm9kZVZhbHVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBtb3JwaGVkTm9kZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBUZXh0IG5vZGUgdG8gc29tZXRoaW5nIGVsc2VcbiAgICAgICAgICBtb3JwaGVkTm9kZSA9IHRvTm9kZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChtb3JwaGVkTm9kZSA9PT0gdG9Ob2RlKSB7XG4gICAgICAvLyBUaGUgXCJ0byBub2RlXCIgd2FzIG5vdCBjb21wYXRpYmxlIHdpdGggdGhlIFwiZnJvbSBub2RlXCIgc28gd2UgaGFkIHRvXG4gICAgICAvLyB0b3NzIG91dCB0aGUgXCJmcm9tIG5vZGVcIiBhbmQgdXNlIHRoZSBcInRvIG5vZGVcIlxuICAgICAgb25Ob2RlRGlzY2FyZGVkKGZyb21Ob2RlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRvTm9kZS5pc1NhbWVOb2RlICYmIHRvTm9kZS5pc1NhbWVOb2RlKG1vcnBoZWROb2RlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIG1vcnBoRWwobW9ycGhlZE5vZGUsIHRvTm9kZSwgY2hpbGRyZW5Pbmx5KTtcblxuICAgICAgLy8gV2Ugbm93IG5lZWQgdG8gbG9vcCBvdmVyIGFueSBrZXllZCBub2RlcyB0aGF0IG1pZ2h0IG5lZWQgdG8gYmVcbiAgICAgIC8vIHJlbW92ZWQuIFdlIG9ubHkgZG8gdGhlIHJlbW92YWwgaWYgd2Uga25vdyB0aGF0IHRoZSBrZXllZCBub2RlXG4gICAgICAvLyBuZXZlciBmb3VuZCBhIG1hdGNoLiBXaGVuIGEga2V5ZWQgbm9kZSBpcyBtYXRjaGVkIHVwIHdlIHJlbW92ZVxuICAgICAgLy8gaXQgb3V0IG9mIGZyb21Ob2Rlc0xvb2t1cCBhbmQgd2UgdXNlIGZyb21Ob2Rlc0xvb2t1cCB0byBkZXRlcm1pbmVcbiAgICAgIC8vIGlmIGEga2V5ZWQgbm9kZSBoYXMgYmVlbiBtYXRjaGVkIHVwIG9yIG5vdFxuICAgICAgaWYgKGtleWVkUmVtb3ZhbExpc3QpIHtcbiAgICAgICAgZm9yICh2YXIgaT0wLCBsZW49a2V5ZWRSZW1vdmFsTGlzdC5sZW5ndGg7IGk8bGVuOyBpKyspIHtcbiAgICAgICAgICB2YXIgZWxUb1JlbW92ZSA9IGZyb21Ob2Rlc0xvb2t1cFtrZXllZFJlbW92YWxMaXN0W2ldXTtcbiAgICAgICAgICBpZiAoZWxUb1JlbW92ZSkge1xuICAgICAgICAgICAgcmVtb3ZlTm9kZShlbFRvUmVtb3ZlLCBlbFRvUmVtb3ZlLnBhcmVudE5vZGUsIGZhbHNlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIWNoaWxkcmVuT25seSAmJiBtb3JwaGVkTm9kZSAhPT0gZnJvbU5vZGUgJiYgZnJvbU5vZGUucGFyZW50Tm9kZSkge1xuICAgICAgaWYgKG1vcnBoZWROb2RlLmFjdHVhbGl6ZSkge1xuICAgICAgICBtb3JwaGVkTm9kZSA9IG1vcnBoZWROb2RlLmFjdHVhbGl6ZShmcm9tTm9kZS5vd25lckRvY3VtZW50IHx8IGRvYyk7XG4gICAgICB9XG4gICAgICAvLyBJZiB3ZSBoYWQgdG8gc3dhcCBvdXQgdGhlIGZyb20gbm9kZSB3aXRoIGEgbmV3IG5vZGUgYmVjYXVzZSB0aGUgb2xkXG4gICAgICAvLyBub2RlIHdhcyBub3QgY29tcGF0aWJsZSB3aXRoIHRoZSB0YXJnZXQgbm9kZSB0aGVuIHdlIG5lZWQgdG9cbiAgICAgIC8vIHJlcGxhY2UgdGhlIG9sZCBET00gbm9kZSBpbiB0aGUgb3JpZ2luYWwgRE9NIHRyZWUuIFRoaXMgaXMgb25seVxuICAgICAgLy8gcG9zc2libGUgaWYgdGhlIG9yaWdpbmFsIERPTSBub2RlIHdhcyBwYXJ0IG9mIGEgRE9NIHRyZWUgd2hpY2hcbiAgICAgIC8vIHdlIGtub3cgaXMgdGhlIGNhc2UgaWYgaXQgaGFzIGEgcGFyZW50IG5vZGUuXG4gICAgICBmcm9tTm9kZS5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChtb3JwaGVkTm9kZSwgZnJvbU5vZGUpO1xuICAgIH1cblxuICAgIHJldHVybiBtb3JwaGVkTm9kZTtcbiAgfTtcbn1cblxudmFyIG1vcnBoZG9tID0gbW9ycGhkb21GYWN0b3J5KG1vcnBoQXR0cnMpO1xuXG5leHBvcnQgZGVmYXVsdCBtb3JwaGRvbTtcbiIsICJpbXBvcnQge1xuICBQSFhfQ09NUE9ORU5ULFxuICBQSFhfUFJVTkUsXG4gIFBIWF9ST09UX0lELFxuICBQSFhfU0VTU0lPTixcbiAgUEhYX1NLSVAsXG4gIFBIWF9NQUdJQ19JRCxcbiAgUEhYX1NUQVRJQyxcbiAgUEhYX1RSSUdHRVJfQUNUSU9OLFxuICBQSFhfVVBEQVRFLFxuICBQSFhfUkVGX1NSQyxcbiAgUEhYX1JFRl9MT0NLLFxuICBQSFhfU1RSRUFNLFxuICBQSFhfU1RSRUFNX1JFRixcbiAgUEhYX1ZJRVdQT1JUX1RPUCxcbiAgUEhYX1ZJRVdQT1JUX0JPVFRPTSxcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuaW1wb3J0IHtcbiAgZGV0ZWN0RHVwbGljYXRlSWRzLFxuICBkZXRlY3RJbnZhbGlkU3RyZWFtSW5zZXJ0cyxcbiAgaXNDaWRcbn0gZnJvbSBcIi4vdXRpbHNcIlxuXG5pbXBvcnQgRE9NIGZyb20gXCIuL2RvbVwiXG5pbXBvcnQgRE9NUG9zdE1vcnBoUmVzdG9yZXIgZnJvbSBcIi4vZG9tX3Bvc3RfbW9ycGhfcmVzdG9yZXJcIlxuaW1wb3J0IG1vcnBoZG9tIGZyb20gXCJtb3JwaGRvbVwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERPTVBhdGNoIHtcbiAgY29uc3RydWN0b3IodmlldywgY29udGFpbmVyLCBpZCwgaHRtbCwgc3RyZWFtcywgdGFyZ2V0Q0lELCBvcHRzPXt9KXtcbiAgICB0aGlzLnZpZXcgPSB2aWV3XG4gICAgdGhpcy5saXZlU29ja2V0ID0gdmlldy5saXZlU29ja2V0XG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXJcbiAgICB0aGlzLmlkID0gaWRcbiAgICB0aGlzLnJvb3RJRCA9IHZpZXcucm9vdC5pZFxuICAgIHRoaXMuaHRtbCA9IGh0bWxcbiAgICB0aGlzLnN0cmVhbXMgPSBzdHJlYW1zXG4gICAgdGhpcy5zdHJlYW1JbnNlcnRzID0ge31cbiAgICB0aGlzLnN0cmVhbUNvbXBvbmVudFJlc3RvcmUgPSB7fVxuICAgIHRoaXMudGFyZ2V0Q0lEID0gdGFyZ2V0Q0lEXG4gICAgdGhpcy5jaWRQYXRjaCA9IGlzQ2lkKHRoaXMudGFyZ2V0Q0lEKVxuICAgIHRoaXMucGVuZGluZ1JlbW92ZXMgPSBbXVxuICAgIHRoaXMucGh4UmVtb3ZlID0gdGhpcy5saXZlU29ja2V0LmJpbmRpbmcoXCJyZW1vdmVcIilcbiAgICB0aGlzLnRhcmdldENvbnRhaW5lciA9IHRoaXMuaXNDSURQYXRjaCgpID8gdGhpcy50YXJnZXRDSURDb250YWluZXIoaHRtbCkgOiBjb250YWluZXJcbiAgICB0aGlzLmNhbGxiYWNrcyA9IHtcbiAgICAgIGJlZm9yZWFkZGVkOiBbXSwgYmVmb3JldXBkYXRlZDogW10sIGJlZm9yZXBoeENoaWxkQWRkZWQ6IFtdLFxuICAgICAgYWZ0ZXJhZGRlZDogW10sIGFmdGVydXBkYXRlZDogW10sIGFmdGVyZGlzY2FyZGVkOiBbXSwgYWZ0ZXJwaHhDaGlsZEFkZGVkOiBbXSxcbiAgICAgIGFmdGVydHJhbnNpdGlvbnNEaXNjYXJkZWQ6IFtdXG4gICAgfVxuICAgIHRoaXMud2l0aENoaWxkcmVuID0gb3B0cy53aXRoQ2hpbGRyZW4gfHwgb3B0cy51bmRvUmVmIHx8IGZhbHNlXG4gICAgdGhpcy51bmRvUmVmID0gb3B0cy51bmRvUmVmXG4gIH1cblxuICBiZWZvcmUoa2luZCwgY2FsbGJhY2speyB0aGlzLmNhbGxiYWNrc1tgYmVmb3JlJHtraW5kfWBdLnB1c2goY2FsbGJhY2spIH1cbiAgYWZ0ZXIoa2luZCwgY2FsbGJhY2speyB0aGlzLmNhbGxiYWNrc1tgYWZ0ZXIke2tpbmR9YF0ucHVzaChjYWxsYmFjaykgfVxuXG4gIHRyYWNrQmVmb3JlKGtpbmQsIC4uLmFyZ3Mpe1xuICAgIHRoaXMuY2FsbGJhY2tzW2BiZWZvcmUke2tpbmR9YF0uZm9yRWFjaChjYWxsYmFjayA9PiBjYWxsYmFjayguLi5hcmdzKSlcbiAgfVxuXG4gIHRyYWNrQWZ0ZXIoa2luZCwgLi4uYXJncyl7XG4gICAgdGhpcy5jYWxsYmFja3NbYGFmdGVyJHtraW5kfWBdLmZvckVhY2goY2FsbGJhY2sgPT4gY2FsbGJhY2soLi4uYXJncykpXG4gIH1cblxuICBtYXJrUHJ1bmFibGVDb250ZW50Rm9yUmVtb3ZhbCgpe1xuICAgIGxldCBwaHhVcGRhdGUgPSB0aGlzLmxpdmVTb2NrZXQuYmluZGluZyhQSFhfVVBEQVRFKVxuICAgIERPTS5hbGwodGhpcy5jb250YWluZXIsIGBbJHtwaHhVcGRhdGV9PWFwcGVuZF0gPiAqLCBbJHtwaHhVcGRhdGV9PXByZXBlbmRdID4gKmAsIGVsID0+IHtcbiAgICAgIGVsLnNldEF0dHJpYnV0ZShQSFhfUFJVTkUsIFwiXCIpXG4gICAgfSlcbiAgfVxuXG4gIHBlcmZvcm0oaXNKb2luUGF0Y2gpe1xuICAgIGxldCB7dmlldywgbGl2ZVNvY2tldCwgaHRtbCwgY29udGFpbmVyLCB0YXJnZXRDb250YWluZXJ9ID0gdGhpc1xuICAgIGlmKHRoaXMuaXNDSURQYXRjaCgpICYmICF0YXJnZXRDb250YWluZXIpeyByZXR1cm4gfVxuXG4gICAgbGV0IGZvY3VzZWQgPSBsaXZlU29ja2V0LmdldEFjdGl2ZUVsZW1lbnQoKVxuICAgIGxldCB7c2VsZWN0aW9uU3RhcnQsIHNlbGVjdGlvbkVuZH0gPSBmb2N1c2VkICYmIERPTS5oYXNTZWxlY3Rpb25SYW5nZShmb2N1c2VkKSA/IGZvY3VzZWQgOiB7fVxuICAgIGxldCBwaHhVcGRhdGUgPSBsaXZlU29ja2V0LmJpbmRpbmcoUEhYX1VQREFURSlcbiAgICBsZXQgcGh4Vmlld3BvcnRUb3AgPSBsaXZlU29ja2V0LmJpbmRpbmcoUEhYX1ZJRVdQT1JUX1RPUClcbiAgICBsZXQgcGh4Vmlld3BvcnRCb3R0b20gPSBsaXZlU29ja2V0LmJpbmRpbmcoUEhYX1ZJRVdQT1JUX0JPVFRPTSlcbiAgICBsZXQgcGh4VHJpZ2dlckV4dGVybmFsID0gbGl2ZVNvY2tldC5iaW5kaW5nKFBIWF9UUklHR0VSX0FDVElPTilcbiAgICBsZXQgYWRkZWQgPSBbXVxuICAgIGxldCB1cGRhdGVzID0gW11cbiAgICBsZXQgYXBwZW5kUHJlcGVuZFVwZGF0ZXMgPSBbXVxuXG4gICAgbGV0IGV4dGVybmFsRm9ybVRyaWdnZXJlZCA9IG51bGxcblxuICAgIGZ1bmN0aW9uIG1vcnBoKHRhcmdldENvbnRhaW5lciwgc291cmNlLCB3aXRoQ2hpbGRyZW49dGhpcy53aXRoQ2hpbGRyZW4pe1xuICAgICAgbGV0IG1vcnBoQ2FsbGJhY2tzID0ge1xuICAgICAgICAvLyBub3JtYWxseSwgd2UgYXJlIHJ1bm5pbmcgd2l0aCBjaGlsZHJlbk9ubHksIGFzIHRoZSBwYXRjaCBIVE1MIGZvciBhIExWXG4gICAgICAgIC8vIGRvZXMgbm90IGluY2x1ZGUgdGhlIExWIGF0dHJzIChkYXRhLXBoeC1zZXNzaW9uLCBldGMuKVxuICAgICAgICAvLyB3aGVuIHdlIGFyZSBwYXRjaGluZyBhIGxpdmUgY29tcG9uZW50LCB3ZSBkbyB3YW50IHRvIHBhdGNoIHRoZSByb290IGVsZW1lbnQgYXMgd2VsbDtcbiAgICAgICAgLy8gYW5vdGhlciBjYXNlIGlzIHRoZSByZWN1cnNpdmUgcGF0Y2ggb2YgYSBzdHJlYW0gaXRlbSB0aGF0IHdhcyBrZXB0IG9uIHJlc2V0ICgtPiBvbkJlZm9yZU5vZGVBZGRlZClcbiAgICAgICAgY2hpbGRyZW5Pbmx5OiB0YXJnZXRDb250YWluZXIuZ2V0QXR0cmlidXRlKFBIWF9DT01QT05FTlQpID09PSBudWxsICYmICF3aXRoQ2hpbGRyZW4sXG4gICAgICAgIGdldE5vZGVLZXk6IChub2RlKSA9PiB7XG4gICAgICAgICAgaWYoRE9NLmlzUGh4RGVzdHJveWVkKG5vZGUpKXsgcmV0dXJuIG51bGwgfVxuICAgICAgICAgIC8vIElmIHdlIGhhdmUgYSBqb2luIHBhdGNoLCB0aGVuIGJ5IGRlZmluaXRpb24gdGhlcmUgd2FzIG5vIFBIWF9NQUdJQ19JRC5cbiAgICAgICAgICAvLyBUaGlzIGlzIGltcG9ydGFudCB0byByZWR1Y2UgdGhlIGFtb3VudCBvZiBlbGVtZW50cyBtb3JwaGRvbSBkaXNjYXJkcy5cbiAgICAgICAgICBpZihpc0pvaW5QYXRjaCl7IHJldHVybiBub2RlLmlkIH1cbiAgICAgICAgICByZXR1cm4gbm9kZS5pZCB8fCAobm9kZS5nZXRBdHRyaWJ1dGUgJiYgbm9kZS5nZXRBdHRyaWJ1dGUoUEhYX01BR0lDX0lEKSlcbiAgICAgICAgfSxcbiAgICAgICAgLy8gc2tpcCBpbmRleGluZyBmcm9tIGNoaWxkcmVuIHdoZW4gY29udGFpbmVyIGlzIHN0cmVhbVxuICAgICAgICBza2lwRnJvbUNoaWxkcmVuOiAoZnJvbSkgPT4geyByZXR1cm4gZnJvbS5nZXRBdHRyaWJ1dGUocGh4VXBkYXRlKSA9PT0gUEhYX1NUUkVBTSB9LFxuICAgICAgICAvLyB0ZWxsIG1vcnBoZG9tIGhvdyB0byBhZGQgYSBjaGlsZFxuICAgICAgICBhZGRDaGlsZDogKHBhcmVudCwgY2hpbGQpID0+IHtcbiAgICAgICAgICBsZXQge3JlZiwgc3RyZWFtQXR9ID0gdGhpcy5nZXRTdHJlYW1JbnNlcnQoY2hpbGQpXG4gICAgICAgICAgaWYocmVmID09PSB1bmRlZmluZWQpeyByZXR1cm4gcGFyZW50LmFwcGVuZENoaWxkKGNoaWxkKSB9XG5cbiAgICAgICAgICB0aGlzLnNldFN0cmVhbVJlZihjaGlsZCwgcmVmKVxuXG4gICAgICAgICAgLy8gc3RyZWFtaW5nXG4gICAgICAgICAgaWYoc3RyZWFtQXQgPT09IDApe1xuICAgICAgICAgICAgcGFyZW50Lmluc2VydEFkamFjZW50RWxlbWVudChcImFmdGVyYmVnaW5cIiwgY2hpbGQpXG4gICAgICAgICAgfSBlbHNlIGlmKHN0cmVhbUF0ID09PSAtMSl7XG4gICAgICAgICAgICBsZXQgbGFzdENoaWxkID0gcGFyZW50Lmxhc3RFbGVtZW50Q2hpbGRcbiAgICAgICAgICAgIGlmKGxhc3RDaGlsZCAmJiAhbGFzdENoaWxkLmhhc0F0dHJpYnV0ZShQSFhfU1RSRUFNX1JFRikpe1xuICAgICAgICAgICAgICBsZXQgbm9uU3RyZWFtQ2hpbGQgPSBBcnJheS5mcm9tKHBhcmVudC5jaGlsZHJlbikuZmluZChjID0+ICFjLmhhc0F0dHJpYnV0ZShQSFhfU1RSRUFNX1JFRikpXG4gICAgICAgICAgICAgIHBhcmVudC5pbnNlcnRCZWZvcmUoY2hpbGQsIG5vblN0cmVhbUNoaWxkKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGNoaWxkKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZihzdHJlYW1BdCA+IDApe1xuICAgICAgICAgICAgbGV0IHNpYmxpbmcgPSBBcnJheS5mcm9tKHBhcmVudC5jaGlsZHJlbilbc3RyZWFtQXRdXG4gICAgICAgICAgICBwYXJlbnQuaW5zZXJ0QmVmb3JlKGNoaWxkLCBzaWJsaW5nKVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgb25CZWZvcmVOb2RlQWRkZWQ6IChlbCkgPT4ge1xuICAgICAgICAgIERPTS5tYWludGFpblByaXZhdGVIb29rcyhlbCwgZWwsIHBoeFZpZXdwb3J0VG9wLCBwaHhWaWV3cG9ydEJvdHRvbSlcbiAgICAgICAgICB0aGlzLnRyYWNrQmVmb3JlKFwiYWRkZWRcIiwgZWwpXG5cbiAgICAgICAgICBsZXQgbW9ycGhlZEVsID0gZWxcbiAgICAgICAgICAvLyB0aGlzIGlzIGEgc3RyZWFtIGl0ZW0gdGhhdCB3YXMga2VwdCBvbiByZXNldCwgcmVjdXJzaXZlbHkgbW9ycGggaXRcbiAgICAgICAgICBpZih0aGlzLnN0cmVhbUNvbXBvbmVudFJlc3RvcmVbZWwuaWRdKXtcbiAgICAgICAgICAgIG1vcnBoZWRFbCA9IHRoaXMuc3RyZWFtQ29tcG9uZW50UmVzdG9yZVtlbC5pZF1cbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnN0cmVhbUNvbXBvbmVudFJlc3RvcmVbZWwuaWRdXG4gICAgICAgICAgICBtb3JwaC5jYWxsKHRoaXMsIG1vcnBoZWRFbCwgZWwsIHRydWUpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIG1vcnBoZWRFbFxuICAgICAgICB9LFxuICAgICAgICBvbk5vZGVBZGRlZDogKGVsKSA9PiB7XG4gICAgICAgICAgaWYoZWwuZ2V0QXR0cmlidXRlKXsgdGhpcy5tYXliZVJlT3JkZXJTdHJlYW0oZWwsIHRydWUpIH1cblxuICAgICAgICAgIC8vIGhhY2sgdG8gZml4IFNhZmFyaSBoYW5kbGluZyBvZiBpbWcgc3Jjc2V0IGFuZCB2aWRlbyB0YWdzXG4gICAgICAgICAgaWYoZWwgaW5zdGFuY2VvZiBIVE1MSW1hZ2VFbGVtZW50ICYmIGVsLnNyY3NldCl7XG4gICAgICAgICAgICBlbC5zcmNzZXQgPSBlbC5zcmNzZXRcbiAgICAgICAgICB9IGVsc2UgaWYoZWwgaW5zdGFuY2VvZiBIVE1MVmlkZW9FbGVtZW50ICYmIGVsLmF1dG9wbGF5KXtcbiAgICAgICAgICAgIGVsLnBsYXkoKVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZihET00uaXNOb3dUcmlnZ2VyRm9ybUV4dGVybmFsKGVsLCBwaHhUcmlnZ2VyRXh0ZXJuYWwpKXtcbiAgICAgICAgICAgIGV4dGVybmFsRm9ybVRyaWdnZXJlZCA9IGVsXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gbmVzdGVkIHZpZXcgaGFuZGxpbmdcbiAgICAgICAgICBpZigoRE9NLmlzUGh4Q2hpbGQoZWwpICYmIHZpZXcub3duc0VsZW1lbnQoZWwpKSB8fCBET00uaXNQaHhTdGlja3koZWwpICYmIHZpZXcub3duc0VsZW1lbnQoZWwucGFyZW50Tm9kZSkpe1xuICAgICAgICAgICAgdGhpcy50cmFja0FmdGVyKFwicGh4Q2hpbGRBZGRlZFwiLCBlbClcbiAgICAgICAgICB9XG4gICAgICAgICAgYWRkZWQucHVzaChlbClcbiAgICAgICAgfSxcbiAgICAgICAgb25Ob2RlRGlzY2FyZGVkOiAoZWwpID0+IHRoaXMub25Ob2RlRGlzY2FyZGVkKGVsKSxcbiAgICAgICAgb25CZWZvcmVOb2RlRGlzY2FyZGVkOiAoZWwpID0+IHtcbiAgICAgICAgICBpZihlbC5nZXRBdHRyaWJ1dGUgJiYgZWwuZ2V0QXR0cmlidXRlKFBIWF9QUlVORSkgIT09IG51bGwpeyByZXR1cm4gdHJ1ZSB9XG4gICAgICAgICAgaWYoZWwucGFyZW50RWxlbWVudCAhPT0gbnVsbCAmJiBlbC5pZCAmJlxuICAgICAgICAgICAgRE9NLmlzUGh4VXBkYXRlKGVsLnBhcmVudEVsZW1lbnQsIHBoeFVwZGF0ZSwgW1BIWF9TVFJFQU0sIFwiYXBwZW5kXCIsIFwicHJlcGVuZFwiXSkpe1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKHRoaXMubWF5YmVQZW5kaW5nUmVtb3ZlKGVsKSl7IHJldHVybiBmYWxzZSB9XG4gICAgICAgICAgaWYodGhpcy5za2lwQ0lEU2libGluZyhlbCkpeyByZXR1cm4gZmFsc2UgfVxuXG4gICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgb25FbFVwZGF0ZWQ6IChlbCkgPT4ge1xuICAgICAgICAgIGlmKERPTS5pc05vd1RyaWdnZXJGb3JtRXh0ZXJuYWwoZWwsIHBoeFRyaWdnZXJFeHRlcm5hbCkpe1xuICAgICAgICAgICAgZXh0ZXJuYWxGb3JtVHJpZ2dlcmVkID0gZWxcbiAgICAgICAgICB9XG4gICAgICAgICAgdXBkYXRlcy5wdXNoKGVsKVxuICAgICAgICAgIHRoaXMubWF5YmVSZU9yZGVyU3RyZWFtKGVsLCBmYWxzZSlcbiAgICAgICAgfSxcbiAgICAgICAgb25CZWZvcmVFbFVwZGF0ZWQ6IChmcm9tRWwsIHRvRWwpID0+IHtcbiAgICAgICAgICAvLyBpZiB3ZSBhcmUgcGF0Y2hpbmcgdGhlIHJvb3QgdGFyZ2V0IGNvbnRhaW5lciBhbmQgdGhlIGlkIGhhcyBjaGFuZ2VkLCB0cmVhdCBpdCBhcyBhIG5ldyBub2RlXG4gICAgICAgICAgLy8gYnkgcmVwbGFjaW5nIHRoZSBmcm9tRWwgd2l0aCB0aGUgdG9FbCwgd2hpY2ggZW5zdXJlcyBob29rcyBhcmUgdG9ybiBkb3duIGFuZCByZS1jcmVhdGVkXG4gICAgICAgICAgaWYoZnJvbUVsLmlkICYmIGZyb21FbC5pc1NhbWVOb2RlKHRhcmdldENvbnRhaW5lcikgJiYgZnJvbUVsLmlkICE9PSB0b0VsLmlkKXtcbiAgICAgICAgICAgIG1vcnBoQ2FsbGJhY2tzLm9uTm9kZURpc2NhcmRlZChmcm9tRWwpXG4gICAgICAgICAgICBmcm9tRWwucmVwbGFjZVdpdGgodG9FbClcbiAgICAgICAgICAgIHJldHVybiBtb3JwaENhbGxiYWNrcy5vbk5vZGVBZGRlZCh0b0VsKVxuICAgICAgICAgIH1cbiAgICAgICAgICBET00uc3luY1BlbmRpbmdBdHRycyhmcm9tRWwsIHRvRWwpXG4gICAgICAgICAgRE9NLm1haW50YWluUHJpdmF0ZUhvb2tzKGZyb21FbCwgdG9FbCwgcGh4Vmlld3BvcnRUb3AsIHBoeFZpZXdwb3J0Qm90dG9tKVxuICAgICAgICAgIERPTS5jbGVhbkNoaWxkTm9kZXModG9FbCwgcGh4VXBkYXRlKVxuICAgICAgICAgIGlmKHRoaXMuc2tpcENJRFNpYmxpbmcodG9FbCkpe1xuICAgICAgICAgICAgLy8gaWYgdGhpcyBpcyBhIGxpdmUgY29tcG9uZW50IHVzZWQgaW4gYSBzdHJlYW0sIHdlIG1heSBuZWVkIHRvIHJlb3JkZXIgaXRcbiAgICAgICAgICAgIHRoaXMubWF5YmVSZU9yZGVyU3RyZWFtKGZyb21FbClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZihET00uaXNQaHhTdGlja3koZnJvbUVsKSl7XG4gICAgICAgICAgICBbUEhYX1NFU1NJT04sIFBIWF9TVEFUSUMsIFBIWF9ST09UX0lEXVxuICAgICAgICAgICAgICAubWFwKGF0dHIgPT4gW2F0dHIsIGZyb21FbC5nZXRBdHRyaWJ1dGUoYXR0ciksIHRvRWwuZ2V0QXR0cmlidXRlKGF0dHIpXSlcbiAgICAgICAgICAgICAgLmZvckVhY2goKFthdHRyLCBmcm9tVmFsLCB0b1ZhbF0pID0+IHtcbiAgICAgICAgICAgICAgICBpZih0b1ZhbCAmJiBmcm9tVmFsICE9PSB0b1ZhbCl7IGZyb21FbC5zZXRBdHRyaWJ1dGUoYXR0ciwgdG9WYWwpIH1cbiAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKERPTS5pc0lnbm9yZWQoZnJvbUVsLCBwaHhVcGRhdGUpIHx8IChmcm9tRWwuZm9ybSAmJiBmcm9tRWwuZm9ybS5pc1NhbWVOb2RlKGV4dGVybmFsRm9ybVRyaWdnZXJlZCkpKXtcbiAgICAgICAgICAgIHRoaXMudHJhY2tCZWZvcmUoXCJ1cGRhdGVkXCIsIGZyb21FbCwgdG9FbClcbiAgICAgICAgICAgIERPTS5tZXJnZUF0dHJzKGZyb21FbCwgdG9FbCwge2lzSWdub3JlZDogRE9NLmlzSWdub3JlZChmcm9tRWwsIHBoeFVwZGF0ZSl9KVxuICAgICAgICAgICAgdXBkYXRlcy5wdXNoKGZyb21FbClcbiAgICAgICAgICAgIERPTS5hcHBseVN0aWNreU9wZXJhdGlvbnMoZnJvbUVsKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKGZyb21FbC50eXBlID09PSBcIm51bWJlclwiICYmIChmcm9tRWwudmFsaWRpdHkgJiYgZnJvbUVsLnZhbGlkaXR5LmJhZElucHV0KSl7IHJldHVybiBmYWxzZSB9XG4gICAgICAgICAgLy8gSWYgdGhlIGVsZW1lbnQgaGFzIFBIWF9SRUZfU1JDLCBpdCBpcyBsb2FkaW5nIG9yIGxvY2tlZCBhbmQgYXdhaXRpbmcgYW4gYWNrLlxuICAgICAgICAgIC8vIElmIGl0J3MgbG9ja2VkLCB3ZSBjbG9uZSB0aGUgZnJvbUVsIHRyZWUgYW5kIGluc3RydWN0IG1vcnBoZG9tIHRvIHVzZVxuICAgICAgICAgIC8vIHRoZSBjbG9uZWQgdHJlZSBhcyB0aGUgc291cmNlIG9mIHRoZSBtb3JwaCBmb3IgdGhpcyBicmFuY2ggZnJvbSBoZXJlIG9uIG91dC5cbiAgICAgICAgICAvLyBXZSBrZWVwIGEgcmVmZXJlbmNlIHRvIHRoZSBjbG9uZWQgdHJlZSBpbiB0aGUgZWxlbWVudCdzIHByaXZhdGUgZGF0YSwgYW5kXG4gICAgICAgICAgLy8gb24gYWNrICh2aWV3LnVuZG9SZWZzKSwgd2UgbW9ycGggdGhlIGNsb25lZCB0cmVlIHdpdGggdGhlIHRydWUgZnJvbUVsIGluIHRoZSBET00gdG9cbiAgICAgICAgICAvLyBhcHBseSBhbnkgY2hhbmdlcyB0aGF0IGhhcHBlbmVkIHdoaWxlIHRoZSBlbGVtZW50IHdhcyBsb2NrZWQuXG4gICAgICAgICAgbGV0IGlzRm9jdXNlZEZvcm1FbCA9IGZvY3VzZWQgJiYgZnJvbUVsLmlzU2FtZU5vZGUoZm9jdXNlZCkgJiYgRE9NLmlzRm9ybUlucHV0KGZyb21FbClcbiAgICAgICAgICBsZXQgZm9jdXNlZFNlbGVjdENoYW5nZWQgPSBpc0ZvY3VzZWRGb3JtRWwgJiYgdGhpcy5pc0NoYW5nZWRTZWxlY3QoZnJvbUVsLCB0b0VsKVxuICAgICAgICAgIC8vIG9ubHkgcGVyZm9ybSB0aGUgY2xvbmUgc3RlcCBpZiB0aGlzIGlzIG5vdCBhIHBhdGNoIHRoYXQgdW5sb2Nrc1xuICAgICAgICAgIGlmKGZyb21FbC5oYXNBdHRyaWJ1dGUoUEhYX1JFRl9TUkMpICYmIGZyb21FbC5nZXRBdHRyaWJ1dGUoUEhYX1JFRl9MT0NLKSAhPSB0aGlzLnVuZG9SZWYpe1xuICAgICAgICAgICAgaWYoRE9NLmlzVXBsb2FkSW5wdXQoZnJvbUVsKSl7XG4gICAgICAgICAgICAgIERPTS5tZXJnZUF0dHJzKGZyb21FbCwgdG9FbCwge2lzSWdub3JlZDogdHJ1ZX0pXG4gICAgICAgICAgICAgIHRoaXMudHJhY2tCZWZvcmUoXCJ1cGRhdGVkXCIsIGZyb21FbCwgdG9FbClcbiAgICAgICAgICAgICAgdXBkYXRlcy5wdXNoKGZyb21FbClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIERPTS5hcHBseVN0aWNreU9wZXJhdGlvbnMoZnJvbUVsKVxuICAgICAgICAgICAgbGV0IGlzTG9ja2VkID0gZnJvbUVsLmhhc0F0dHJpYnV0ZShQSFhfUkVGX0xPQ0spXG4gICAgICAgICAgICBsZXQgY2xvbmUgPSBpc0xvY2tlZCA/IERPTS5wcml2YXRlKGZyb21FbCwgUEhYX1JFRl9MT0NLKSB8fCBmcm9tRWwuY2xvbmVOb2RlKHRydWUpIDogbnVsbFxuICAgICAgICAgICAgaWYoY2xvbmUpe1xuICAgICAgICAgICAgICBET00ucHV0UHJpdmF0ZShmcm9tRWwsIFBIWF9SRUZfTE9DSywgY2xvbmUpXG4gICAgICAgICAgICAgIGlmKCFpc0ZvY3VzZWRGb3JtRWwpe1xuICAgICAgICAgICAgICAgIGZyb21FbCA9IGNsb25lXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBuZXN0ZWQgdmlldyBoYW5kbGluZ1xuICAgICAgICAgIGlmKERPTS5pc1BoeENoaWxkKHRvRWwpKXtcbiAgICAgICAgICAgIGxldCBwcmV2U2Vzc2lvbiA9IGZyb21FbC5nZXRBdHRyaWJ1dGUoUEhYX1NFU1NJT04pXG4gICAgICAgICAgICBET00ubWVyZ2VBdHRycyhmcm9tRWwsIHRvRWwsIHtleGNsdWRlOiBbUEhYX1NUQVRJQ119KVxuICAgICAgICAgICAgaWYocHJldlNlc3Npb24gIT09IFwiXCIpeyBmcm9tRWwuc2V0QXR0cmlidXRlKFBIWF9TRVNTSU9OLCBwcmV2U2Vzc2lvbikgfVxuICAgICAgICAgICAgZnJvbUVsLnNldEF0dHJpYnV0ZShQSFhfUk9PVF9JRCwgdGhpcy5yb290SUQpXG4gICAgICAgICAgICBET00uYXBwbHlTdGlja3lPcGVyYXRpb25zKGZyb21FbClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIGlmIHdlIGFyZSB1bmRvaW5nIGEgbG9jaywgY29weSBwb3RlbnRpYWxseSBuZXN0ZWQgY2xvbmVzIG92ZXJcbiAgICAgICAgICBpZih0aGlzLnVuZG9SZWYgJiYgRE9NLnByaXZhdGUodG9FbCwgUEhYX1JFRl9MT0NLKSl7XG4gICAgICAgICAgICBET00ucHV0UHJpdmF0ZShmcm9tRWwsIFBIWF9SRUZfTE9DSywgRE9NLnByaXZhdGUodG9FbCwgUEhYX1JFRl9MT0NLKSlcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gbm93IGNvcHkgcmVndWxhciBET00ucHJpdmF0ZSBkYXRhXG4gICAgICAgICAgRE9NLmNvcHlQcml2YXRlcyh0b0VsLCBmcm9tRWwpXG5cbiAgICAgICAgICAvLyBza2lwIHBhdGNoaW5nIGZvY3VzZWQgaW5wdXRzIHVubGVzcyBmb2N1cyBpcyBhIHNlbGVjdCB0aGF0IGhhcyBjaGFuZ2VkIG9wdGlvbnNcbiAgICAgICAgICBpZihpc0ZvY3VzZWRGb3JtRWwgJiYgZnJvbUVsLnR5cGUgIT09IFwiaGlkZGVuXCIgJiYgIWZvY3VzZWRTZWxlY3RDaGFuZ2VkKXtcbiAgICAgICAgICAgIHRoaXMudHJhY2tCZWZvcmUoXCJ1cGRhdGVkXCIsIGZyb21FbCwgdG9FbClcbiAgICAgICAgICAgIERPTS5tZXJnZUZvY3VzZWRJbnB1dChmcm9tRWwsIHRvRWwpXG4gICAgICAgICAgICBET00uc3luY0F0dHJzVG9Qcm9wcyhmcm9tRWwpXG4gICAgICAgICAgICB1cGRhdGVzLnB1c2goZnJvbUVsKVxuICAgICAgICAgICAgRE9NLmFwcGx5U3RpY2t5T3BlcmF0aW9ucyhmcm9tRWwpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gYmx1ciBmb2N1c2VkIHNlbGVjdCBpZiBpdCBjaGFuZ2VkIHNvIG5hdGl2ZSBVSSBpcyB1cGRhdGVkIChpZSBzYWZhcmkgd29uJ3QgdXBkYXRlIHZpc2libGUgb3B0aW9ucylcbiAgICAgICAgICAgIGlmKGZvY3VzZWRTZWxlY3RDaGFuZ2VkKXsgZnJvbUVsLmJsdXIoKSB9XG4gICAgICAgICAgICBpZihET00uaXNQaHhVcGRhdGUodG9FbCwgcGh4VXBkYXRlLCBbXCJhcHBlbmRcIiwgXCJwcmVwZW5kXCJdKSl7XG4gICAgICAgICAgICAgIGFwcGVuZFByZXBlbmRVcGRhdGVzLnB1c2gobmV3IERPTVBvc3RNb3JwaFJlc3RvcmVyKGZyb21FbCwgdG9FbCwgdG9FbC5nZXRBdHRyaWJ1dGUocGh4VXBkYXRlKSkpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIERPTS5zeW5jQXR0cnNUb1Byb3BzKHRvRWwpXG4gICAgICAgICAgICBET00uYXBwbHlTdGlja3lPcGVyYXRpb25zKHRvRWwpXG4gICAgICAgICAgICB0aGlzLnRyYWNrQmVmb3JlKFwidXBkYXRlZFwiLCBmcm9tRWwsIHRvRWwpXG4gICAgICAgICAgICByZXR1cm4gZnJvbUVsXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBtb3JwaGRvbSh0YXJnZXRDb250YWluZXIsIHNvdXJjZSwgbW9ycGhDYWxsYmFja3MpXG4gICAgfVxuXG4gICAgdGhpcy50cmFja0JlZm9yZShcImFkZGVkXCIsIGNvbnRhaW5lcilcbiAgICB0aGlzLnRyYWNrQmVmb3JlKFwidXBkYXRlZFwiLCBjb250YWluZXIsIGNvbnRhaW5lcilcblxuICAgIGxpdmVTb2NrZXQudGltZShcIm1vcnBoZG9tXCIsICgpID0+IHtcbiAgICAgIHRoaXMuc3RyZWFtcy5mb3JFYWNoKChbcmVmLCBpbnNlcnRzLCBkZWxldGVJZHMsIHJlc2V0XSkgPT4ge1xuICAgICAgICBpbnNlcnRzLmZvckVhY2goKFtrZXksIHN0cmVhbUF0LCBsaW1pdF0pID0+IHtcbiAgICAgICAgICB0aGlzLnN0cmVhbUluc2VydHNba2V5XSA9IHtyZWYsIHN0cmVhbUF0LCBsaW1pdCwgcmVzZXR9XG4gICAgICAgIH0pXG4gICAgICAgIGlmKHJlc2V0ICE9PSB1bmRlZmluZWQpe1xuICAgICAgICAgIERPTS5hbGwoY29udGFpbmVyLCBgWyR7UEhYX1NUUkVBTV9SRUZ9PVwiJHtyZWZ9XCJdYCwgY2hpbGQgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVTdHJlYW1DaGlsZEVsZW1lbnQoY2hpbGQpXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBkZWxldGVJZHMuZm9yRWFjaChpZCA9PiB7XG4gICAgICAgICAgbGV0IGNoaWxkID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoYFtpZD1cIiR7aWR9XCJdYClcbiAgICAgICAgICBpZihjaGlsZCl7IHRoaXMucmVtb3ZlU3RyZWFtQ2hpbGRFbGVtZW50KGNoaWxkKSB9XG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICAvLyBjbGVhciBzdHJlYW0gaXRlbXMgZnJvbSB0aGUgZGVhZCByZW5kZXIgaWYgdGhleSBhcmUgbm90IGluc2VydGVkIGFnYWluXG4gICAgICBpZihpc0pvaW5QYXRjaCl7XG4gICAgICAgIERPTS5hbGwodGhpcy5jb250YWluZXIsIGBbJHtwaHhVcGRhdGV9PSR7UEhYX1NUUkVBTX1dYClcbiAgICAgICAgICAvLyBpdCBpcyBpbXBvcnRhbnQgdG8gZmlsdGVyIHRoZSBlbGVtZW50IGJlZm9yZSByZW1vdmluZyB0aGVtLCBhc1xuICAgICAgICAgIC8vIGl0IG1heSBoYXBwZW4gdGhhdCBzdHJlYW1zIGFyZSBuZXN0ZWQgYW5kIHRoZSBvd25lciBjaGVjayBmYWlscyBpZlxuICAgICAgICAgIC8vIGEgcGFyZW50IGlzIHJlbW92ZWQgYmVmb3JlIGEgY2hpbGRcbiAgICAgICAgICAuZmlsdGVyKGVsID0+IHRoaXMudmlldy5vd25zRWxlbWVudChlbCkpXG4gICAgICAgICAgLmZvckVhY2goZWwgPT4ge1xuICAgICAgICAgICAgQXJyYXkuZnJvbShlbC5jaGlsZHJlbikuZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICAgICAgICAgIC8vIHdlIGFscmVhZHkgcGVyZm9ybWVkIHRoZSBvd25lciBjaGVjaywgZWFjaCBjaGlsZCBpcyBndWFyYW50ZWVkIHRvIGJlIG93bmVkXG4gICAgICAgICAgICAgIC8vIGJ5IHRoZSB2aWV3LiBUbyBwcmV2ZW50IHRoZSBuZXN0ZWQgb3duZXIgY2hlY2sgZnJvbSBmYWlsaW5nIGluIGNhc2Ugb2YgbmVzdGVkXG4gICAgICAgICAgICAgIC8vIHN0cmVhbXMgd2hlcmUgdGhlIHBhcmVudCBpcyByZW1vdmVkIGJlZm9yZSB0aGUgY2hpbGQsIHdlIGZvcmNlIHRoZSByZW1vdmFsXG4gICAgICAgICAgICAgIHRoaXMucmVtb3ZlU3RyZWFtQ2hpbGRFbGVtZW50KGNoaWxkLCB0cnVlKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICBtb3JwaC5jYWxsKHRoaXMsIHRhcmdldENvbnRhaW5lciwgaHRtbClcbiAgICB9KVxuXG4gICAgaWYobGl2ZVNvY2tldC5pc0RlYnVnRW5hYmxlZCgpKXtcbiAgICAgIGRldGVjdER1cGxpY2F0ZUlkcygpXG4gICAgICBkZXRlY3RJbnZhbGlkU3RyZWFtSW5zZXJ0cyh0aGlzLnN0cmVhbUluc2VydHMpXG4gICAgICAvLyB3YXJuIGlmIHRoZXJlIGFyZSBhbnkgaW5wdXRzIG5hbWVkIFwiaWRcIlxuICAgICAgQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXRbbmFtZT1pZF1cIikpLmZvckVhY2gobm9kZSA9PiB7XG4gICAgICAgIGlmKG5vZGUuZm9ybSl7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcIkRldGVjdGVkIGFuIGlucHV0IHdpdGggbmFtZT1cXFwiaWRcXFwiIGluc2lkZSBhIGZvcm0hIFRoaXMgd2lsbCBjYXVzZSBwcm9ibGVtcyB3aGVuIHBhdGNoaW5nIHRoZSBET00uXFxuXCIsIG5vZGUpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgaWYoYXBwZW5kUHJlcGVuZFVwZGF0ZXMubGVuZ3RoID4gMCl7XG4gICAgICBsaXZlU29ja2V0LnRpbWUoXCJwb3N0LW1vcnBoIGFwcGVuZC9wcmVwZW5kIHJlc3RvcmF0aW9uXCIsICgpID0+IHtcbiAgICAgICAgYXBwZW5kUHJlcGVuZFVwZGF0ZXMuZm9yRWFjaCh1cGRhdGUgPT4gdXBkYXRlLnBlcmZvcm0oKSlcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgbGl2ZVNvY2tldC5zaWxlbmNlRXZlbnRzKCgpID0+IERPTS5yZXN0b3JlRm9jdXMoZm9jdXNlZCwgc2VsZWN0aW9uU3RhcnQsIHNlbGVjdGlvbkVuZCkpXG4gICAgRE9NLmRpc3BhdGNoRXZlbnQoZG9jdW1lbnQsIFwicGh4OnVwZGF0ZVwiKVxuICAgIGFkZGVkLmZvckVhY2goZWwgPT4gdGhpcy50cmFja0FmdGVyKFwiYWRkZWRcIiwgZWwpKVxuICAgIHVwZGF0ZXMuZm9yRWFjaChlbCA9PiB0aGlzLnRyYWNrQWZ0ZXIoXCJ1cGRhdGVkXCIsIGVsKSlcblxuICAgIHRoaXMudHJhbnNpdGlvblBlbmRpbmdSZW1vdmVzKClcblxuICAgIGlmKGV4dGVybmFsRm9ybVRyaWdnZXJlZCl7XG4gICAgICBsaXZlU29ja2V0LnVubG9hZCgpXG4gICAgICAvLyB1c2UgcHJvdG90eXBlJ3Mgc3VibWl0IGluIGNhc2UgdGhlcmUncyBhIGZvcm0gY29udHJvbCB3aXRoIG5hbWUgb3IgaWQgb2YgXCJzdWJtaXRcIlxuICAgICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0hUTUxGb3JtRWxlbWVudC9zdWJtaXRcbiAgICAgIE9iamVjdC5nZXRQcm90b3R5cGVPZihleHRlcm5hbEZvcm1UcmlnZ2VyZWQpLnN1Ym1pdC5jYWxsKGV4dGVybmFsRm9ybVRyaWdnZXJlZClcbiAgICB9XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIG9uTm9kZURpc2NhcmRlZChlbCl7XG4gICAgLy8gbmVzdGVkIHZpZXcgaGFuZGxpbmdcbiAgICBpZihET00uaXNQaHhDaGlsZChlbCkgfHwgRE9NLmlzUGh4U3RpY2t5KGVsKSl7IHRoaXMubGl2ZVNvY2tldC5kZXN0cm95Vmlld0J5RWwoZWwpIH1cbiAgICB0aGlzLnRyYWNrQWZ0ZXIoXCJkaXNjYXJkZWRcIiwgZWwpXG4gIH1cblxuICBtYXliZVBlbmRpbmdSZW1vdmUobm9kZSl7XG4gICAgaWYobm9kZS5nZXRBdHRyaWJ1dGUgJiYgbm9kZS5nZXRBdHRyaWJ1dGUodGhpcy5waHhSZW1vdmUpICE9PSBudWxsKXtcbiAgICAgIHRoaXMucGVuZGluZ1JlbW92ZXMucHVzaChub2RlKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlU3RyZWFtQ2hpbGRFbGVtZW50KGNoaWxkLCBmb3JjZT1mYWxzZSl7XG4gICAgLy8gbWFrZSBzdXJlIHRvIG9ubHkgcmVtb3ZlIGVsZW1lbnRzIG93bmVkIGJ5IHRoZSBjdXJyZW50IHZpZXdcbiAgICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3Bob2VuaXhmcmFtZXdvcmsvcGhvZW5peF9saXZlX3ZpZXcvaXNzdWVzLzMwNDdcbiAgICAvLyBhbmQgaHR0cHM6Ly9naXRodWIuY29tL3Bob2VuaXhmcmFtZXdvcmsvcGhvZW5peF9saXZlX3ZpZXcvaXNzdWVzLzM2ODFcbiAgICBpZighZm9yY2UgJiYgIXRoaXMudmlldy5vd25zRWxlbWVudChjaGlsZCkpeyByZXR1cm4gfVxuXG4gICAgLy8gd2UgbmVlZCB0byBzdG9yZSB0aGUgbm9kZSBpZiBpdCBpcyBhY3R1YWxseSByZS1hZGRlZCBpbiB0aGUgc2FtZSBwYXRjaFxuICAgIC8vIHdlIGRvIE5PVCB3YW50IHRvIGV4ZWN1dGUgcGh4LXJlbW92ZSwgd2UgZG8gTk9UIHdhbnQgdG8gY2FsbCBvbk5vZGVEaXNjYXJkZWRcbiAgICBpZih0aGlzLnN0cmVhbUluc2VydHNbY2hpbGQuaWRdKXtcbiAgICAgIHRoaXMuc3RyZWFtQ29tcG9uZW50UmVzdG9yZVtjaGlsZC5pZF0gPSBjaGlsZFxuICAgICAgY2hpbGQucmVtb3ZlKClcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gb25seSByZW1vdmUgdGhlIGVsZW1lbnQgbm93IGlmIGl0IGhhcyBubyBwaHgtcmVtb3ZlIGJpbmRpbmdcbiAgICAgIGlmKCF0aGlzLm1heWJlUGVuZGluZ1JlbW92ZShjaGlsZCkpe1xuICAgICAgICBjaGlsZC5yZW1vdmUoKVxuICAgICAgICB0aGlzLm9uTm9kZURpc2NhcmRlZChjaGlsZClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXRTdHJlYW1JbnNlcnQoZWwpe1xuICAgIGxldCBpbnNlcnQgPSBlbC5pZCA/IHRoaXMuc3RyZWFtSW5zZXJ0c1tlbC5pZF0gOiB7fVxuICAgIHJldHVybiBpbnNlcnQgfHwge31cbiAgfVxuXG4gIHNldFN0cmVhbVJlZihlbCwgcmVmKXtcbiAgICBET00ucHV0U3RpY2t5KGVsLCBQSFhfU1RSRUFNX1JFRiwgZWwgPT4gZWwuc2V0QXR0cmlidXRlKFBIWF9TVFJFQU1fUkVGLCByZWYpKVxuICB9XG5cbiAgbWF5YmVSZU9yZGVyU3RyZWFtKGVsLCBpc05ldyl7XG4gICAgbGV0IHtyZWYsIHN0cmVhbUF0LCByZXNldH0gPSB0aGlzLmdldFN0cmVhbUluc2VydChlbClcbiAgICBpZihzdHJlYW1BdCA9PT0gdW5kZWZpbmVkKXsgcmV0dXJuIH1cblxuICAgIC8vIHdlIG5lZWQgdG8gc2V0IHRoZSBQSFhfU1RSRUFNX1JFRiBoZXJlIGFzIHdlbGwgYXMgYWRkQ2hpbGQgaXMgaW52b2tlZCBvbmx5IGZvciBwYXJlbnRzXG4gICAgdGhpcy5zZXRTdHJlYW1SZWYoZWwsIHJlZilcblxuICAgIGlmKCFyZXNldCAmJiAhaXNOZXcpe1xuICAgICAgLy8gd2Ugb25seSByZW9yZGVyIGlmIHRoZSBlbGVtZW50IGlzIG5ldyBvciBpdCdzIGEgc3RyZWFtIHJlc2V0XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAvLyBjaGVjayBpZiB0aGUgZWxlbWVudCBoYXMgYSBwYXJlbnQgZWxlbWVudDtcbiAgICAvLyBpdCBkb2Vzbid0IGlmIHdlIGFyZSBjdXJyZW50bHkgcmVjdXJzaXZlbHkgbW9ycGhpbmcgKHJlc3RvcmluZyBhIHNhdmVkIHN0cmVhbSBjaGlsZClcbiAgICAvLyBiZWNhdXNlIHRoZSBlbGVtZW50IGlzIG5vdCB5ZXQgYWRkZWQgdG8gdGhlIHJlYWwgZG9tO1xuICAgIC8vIHJlb3JkZXJpbmcgZG9lcyBub3QgbWFrZSBzZW5zZSBpbiB0aGF0IGNhc2UgYW55d2F5XG4gICAgaWYoIWVsLnBhcmVudEVsZW1lbnQpeyByZXR1cm4gfVxuXG4gICAgaWYoc3RyZWFtQXQgPT09IDApe1xuICAgICAgZWwucGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUoZWwsIGVsLnBhcmVudEVsZW1lbnQuZmlyc3RFbGVtZW50Q2hpbGQpXG4gICAgfSBlbHNlIGlmKHN0cmVhbUF0ID4gMCl7XG4gICAgICBsZXQgY2hpbGRyZW4gPSBBcnJheS5mcm9tKGVsLnBhcmVudEVsZW1lbnQuY2hpbGRyZW4pXG4gICAgICBsZXQgb2xkSW5kZXggPSBjaGlsZHJlbi5pbmRleE9mKGVsKVxuICAgICAgaWYoc3RyZWFtQXQgPj0gY2hpbGRyZW4ubGVuZ3RoIC0gMSl7XG4gICAgICAgIGVsLnBhcmVudEVsZW1lbnQuYXBwZW5kQ2hpbGQoZWwpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgc2libGluZyA9IGNoaWxkcmVuW3N0cmVhbUF0XVxuICAgICAgICBpZihvbGRJbmRleCA+IHN0cmVhbUF0KXtcbiAgICAgICAgICBlbC5wYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShlbCwgc2libGluZylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbC5wYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShlbCwgc2libGluZy5uZXh0RWxlbWVudFNpYmxpbmcpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLm1heWJlTGltaXRTdHJlYW0oZWwpXG4gIH1cblxuICBtYXliZUxpbWl0U3RyZWFtKGVsKXtcbiAgICBsZXQge2xpbWl0fSA9IHRoaXMuZ2V0U3RyZWFtSW5zZXJ0KGVsKVxuICAgIGxldCBjaGlsZHJlbiA9IGxpbWl0ICE9PSBudWxsICYmIEFycmF5LmZyb20oZWwucGFyZW50RWxlbWVudC5jaGlsZHJlbilcbiAgICBpZihsaW1pdCAmJiBsaW1pdCA8IDAgJiYgY2hpbGRyZW4ubGVuZ3RoID4gbGltaXQgKiAtMSl7XG4gICAgICBjaGlsZHJlbi5zbGljZSgwLCBjaGlsZHJlbi5sZW5ndGggKyBsaW1pdCkuZm9yRWFjaChjaGlsZCA9PiB0aGlzLnJlbW92ZVN0cmVhbUNoaWxkRWxlbWVudChjaGlsZCkpXG4gICAgfSBlbHNlIGlmKGxpbWl0ICYmIGxpbWl0ID49IDAgJiYgY2hpbGRyZW4ubGVuZ3RoID4gbGltaXQpe1xuICAgICAgY2hpbGRyZW4uc2xpY2UobGltaXQpLmZvckVhY2goY2hpbGQgPT4gdGhpcy5yZW1vdmVTdHJlYW1DaGlsZEVsZW1lbnQoY2hpbGQpKVxuICAgIH1cbiAgfVxuXG4gIHRyYW5zaXRpb25QZW5kaW5nUmVtb3Zlcygpe1xuICAgIGxldCB7cGVuZGluZ1JlbW92ZXMsIGxpdmVTb2NrZXR9ID0gdGhpc1xuICAgIGlmKHBlbmRpbmdSZW1vdmVzLmxlbmd0aCA+IDApe1xuICAgICAgbGl2ZVNvY2tldC50cmFuc2l0aW9uUmVtb3ZlcyhwZW5kaW5nUmVtb3ZlcywgKCkgPT4ge1xuICAgICAgICBwZW5kaW5nUmVtb3Zlcy5mb3JFYWNoKGVsID0+IHtcbiAgICAgICAgICBsZXQgY2hpbGQgPSBET00uZmlyc3RQaHhDaGlsZChlbClcbiAgICAgICAgICBpZihjaGlsZCl7IGxpdmVTb2NrZXQuZGVzdHJveVZpZXdCeUVsKGNoaWxkKSB9XG4gICAgICAgICAgZWwucmVtb3ZlKClcbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy50cmFja0FmdGVyKFwidHJhbnNpdGlvbnNEaXNjYXJkZWRcIiwgcGVuZGluZ1JlbW92ZXMpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGlzQ2hhbmdlZFNlbGVjdChmcm9tRWwsIHRvRWwpe1xuICAgIGlmKCEoZnJvbUVsIGluc3RhbmNlb2YgSFRNTFNlbGVjdEVsZW1lbnQpIHx8IGZyb21FbC5tdWx0aXBsZSl7IHJldHVybiBmYWxzZSB9XG4gICAgaWYoZnJvbUVsLm9wdGlvbnMubGVuZ3RoICE9PSB0b0VsLm9wdGlvbnMubGVuZ3RoKXsgcmV0dXJuIHRydWUgfVxuXG4gICAgLy8ga2VlcCB0aGUgY3VycmVudCB2YWx1ZVxuICAgIHRvRWwudmFsdWUgPSBmcm9tRWwudmFsdWVcblxuICAgIC8vIGluIGdlbmVyYWwgd2UgaGF2ZSB0byBiZSB2ZXJ5IGNhcmVmdWwgd2l0aCB1c2luZyBpc0VxdWFsTm9kZSBhcyBpdCBkb2VzIG5vdCBhIHJlbGlhYmxlXG4gICAgLy8gRE9NIHRyZWUgZXF1YWxpdHkgY2hlY2ssIGJ1dCBmb3Igc2VsZWN0aW9uIGF0dHJpYnV0ZXMgYW5kIG9wdGlvbnMgaXQgd29ya3MgZmluZVxuICAgIHJldHVybiAhZnJvbUVsLmlzRXF1YWxOb2RlKHRvRWwpXG4gIH1cblxuICBpc0NJRFBhdGNoKCl7IHJldHVybiB0aGlzLmNpZFBhdGNoIH1cblxuICBza2lwQ0lEU2libGluZyhlbCl7XG4gICAgcmV0dXJuIGVsLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSAmJiBlbC5oYXNBdHRyaWJ1dGUoUEhYX1NLSVApXG4gIH1cblxuICB0YXJnZXRDSURDb250YWluZXIoaHRtbCl7XG4gICAgaWYoIXRoaXMuaXNDSURQYXRjaCgpKXsgcmV0dXJuIH1cbiAgICBsZXQgW2ZpcnN0LCAuLi5yZXN0XSA9IERPTS5maW5kQ29tcG9uZW50Tm9kZUxpc3QodGhpcy5jb250YWluZXIsIHRoaXMudGFyZ2V0Q0lEKVxuICAgIGlmKHJlc3QubGVuZ3RoID09PSAwICYmIERPTS5jaGlsZE5vZGVMZW5ndGgoaHRtbCkgPT09IDEpe1xuICAgICAgcmV0dXJuIGZpcnN0XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmaXJzdCAmJiBmaXJzdC5wYXJlbnROb2RlXG4gICAgfVxuICB9XG5cbiAgaW5kZXhPZihwYXJlbnQsIGNoaWxkKXsgcmV0dXJuIEFycmF5LmZyb20ocGFyZW50LmNoaWxkcmVuKS5pbmRleE9mKGNoaWxkKSB9XG59XG4iLCAiaW1wb3J0IHtcbiAgQ09NUE9ORU5UUyxcbiAgRFlOQU1JQ1MsXG4gIFRFTVBMQVRFUyxcbiAgRVZFTlRTLFxuICBQSFhfQ09NUE9ORU5ULFxuICBQSFhfU0tJUCxcbiAgUEhYX01BR0lDX0lELFxuICBSRVBMWSxcbiAgU1RBVElDLFxuICBUSVRMRSxcbiAgU1RSRUFNLFxuICBST09ULFxufSBmcm9tIFwiLi9jb25zdGFudHNcIlxuXG5pbXBvcnQge1xuICBpc09iamVjdCxcbiAgbG9nRXJyb3IsXG4gIGlzQ2lkLFxufSBmcm9tIFwiLi91dGlsc1wiXG5cbmNvbnN0IFZPSURfVEFHUyA9IG5ldyBTZXQoW1xuICBcImFyZWFcIixcbiAgXCJiYXNlXCIsXG4gIFwiYnJcIixcbiAgXCJjb2xcIixcbiAgXCJjb21tYW5kXCIsXG4gIFwiZW1iZWRcIixcbiAgXCJoclwiLFxuICBcImltZ1wiLFxuICBcImlucHV0XCIsXG4gIFwia2V5Z2VuXCIsXG4gIFwibGlua1wiLFxuICBcIm1ldGFcIixcbiAgXCJwYXJhbVwiLFxuICBcInNvdXJjZVwiLFxuICBcInRyYWNrXCIsXG4gIFwid2JyXCJcbl0pXG5jb25zdCBxdW90ZUNoYXJzID0gbmV3IFNldChbXCInXCIsIFwiXFxcIlwiXSlcblxuZXhwb3J0IGxldCBtb2RpZnlSb290ID0gKGh0bWwsIGF0dHJzLCBjbGVhcklubmVySFRNTCkgPT4ge1xuICBsZXQgaSA9IDBcbiAgbGV0IGluc2lkZUNvbW1lbnQgPSBmYWxzZVxuICBsZXQgYmVmb3JlVGFnLCBhZnRlclRhZywgdGFnLCB0YWdOYW1lRW5kc0F0LCBpZCwgbmV3SFRNTFxuXG4gIGxldCBsb29rYWhlYWQgPSBodG1sLm1hdGNoKC9eKFxccyooPzo8IS0tLio/LS0+XFxzKikqKTwoW15cXHNcXC8+XSspLylcbiAgaWYobG9va2FoZWFkID09PSBudWxsKXsgdGhyb3cgbmV3IEVycm9yKGBtYWxmb3JtZWQgaHRtbCAke2h0bWx9YCkgfVxuXG4gIGkgPSBsb29rYWhlYWRbMF0ubGVuZ3RoXG4gIGJlZm9yZVRhZyA9IGxvb2thaGVhZFsxXVxuICB0YWcgPSBsb29rYWhlYWRbMl1cbiAgdGFnTmFtZUVuZHNBdCA9IGlcblxuICAvLyBTY2FuIHRoZSBvcGVuaW5nIHRhZyBmb3IgaWQsIGlmIHRoZXJlIGlzIGFueVxuICBmb3IoaTsgaSA8IGh0bWwubGVuZ3RoOyBpKyspe1xuICAgIGlmKGh0bWwuY2hhckF0KGkpID09PSBcIj5cIiApeyBicmVhayB9XG4gICAgaWYoaHRtbC5jaGFyQXQoaSkgPT09IFwiPVwiKXtcbiAgICAgIGxldCBpc0lkID0gaHRtbC5zbGljZShpIC0gMywgaSkgPT09IFwiIGlkXCJcbiAgICAgIGkrK1xuICAgICAgbGV0IGNoYXIgPSBodG1sLmNoYXJBdChpKVxuICAgICAgaWYocXVvdGVDaGFycy5oYXMoY2hhcikpe1xuICAgICAgICBsZXQgYXR0clN0YXJ0c0F0ID0gaVxuICAgICAgICBpKytcbiAgICAgICAgZm9yKGk7IGkgPCBodG1sLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICBpZihodG1sLmNoYXJBdChpKSA9PT0gY2hhcil7IGJyZWFrIH1cbiAgICAgICAgfVxuICAgICAgICBpZihpc0lkKXtcbiAgICAgICAgICBpZCA9IGh0bWwuc2xpY2UoYXR0clN0YXJ0c0F0ICsgMSwgaSlcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbGV0IGNsb3NlQXQgPSBodG1sLmxlbmd0aCAtIDFcbiAgaW5zaWRlQ29tbWVudCA9IGZhbHNlXG4gIHdoaWxlKGNsb3NlQXQgPj0gYmVmb3JlVGFnLmxlbmd0aCArIHRhZy5sZW5ndGgpe1xuICAgIGxldCBjaGFyID0gaHRtbC5jaGFyQXQoY2xvc2VBdClcbiAgICBpZihpbnNpZGVDb21tZW50KXtcbiAgICAgIGlmKGNoYXIgPT09IFwiLVwiICYmIGh0bWwuc2xpY2UoY2xvc2VBdCAtIDMsIGNsb3NlQXQpID09PSBcIjwhLVwiKXtcbiAgICAgICAgaW5zaWRlQ29tbWVudCA9IGZhbHNlXG4gICAgICAgIGNsb3NlQXQgLT0gNFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2xvc2VBdCAtPSAxXG4gICAgICB9XG4gICAgfSBlbHNlIGlmKGNoYXIgPT09IFwiPlwiICYmIGh0bWwuc2xpY2UoY2xvc2VBdCAtIDIsIGNsb3NlQXQpID09PSBcIi0tXCIpe1xuICAgICAgaW5zaWRlQ29tbWVudCA9IHRydWVcbiAgICAgIGNsb3NlQXQgLT0gM1xuICAgIH0gZWxzZSBpZihjaGFyID09PSBcIj5cIil7XG4gICAgICBicmVha1xuICAgIH0gZWxzZSB7XG4gICAgICBjbG9zZUF0IC09IDFcbiAgICB9XG4gIH1cbiAgYWZ0ZXJUYWcgPSBodG1sLnNsaWNlKGNsb3NlQXQgKyAxLCBodG1sLmxlbmd0aClcblxuICBsZXQgYXR0cnNTdHIgPVxuICAgIE9iamVjdC5rZXlzKGF0dHJzKVxuICAgICAgLm1hcChhdHRyID0+IGF0dHJzW2F0dHJdID09PSB0cnVlID8gYXR0ciA6IGAke2F0dHJ9PVwiJHthdHRyc1thdHRyXX1cImApXG4gICAgICAuam9pbihcIiBcIilcblxuICBpZihjbGVhcklubmVySFRNTCl7XG4gICAgLy8gS2VlcCB0aGUgaWQgaWYgYW55XG4gICAgbGV0IGlkQXR0clN0ciA9IGlkID8gYCBpZD1cIiR7aWR9XCJgIDogXCJcIlxuICAgIGlmKFZPSURfVEFHUy5oYXModGFnKSl7XG4gICAgICBuZXdIVE1MID0gYDwke3RhZ30ke2lkQXR0clN0cn0ke2F0dHJzU3RyID09PSBcIlwiID8gXCJcIiA6IFwiIFwifSR7YXR0cnNTdHJ9Lz5gXG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld0hUTUwgPSBgPCR7dGFnfSR7aWRBdHRyU3RyfSR7YXR0cnNTdHIgPT09IFwiXCIgPyBcIlwiIDogXCIgXCJ9JHthdHRyc1N0cn0+PC8ke3RhZ30+YFxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBsZXQgcmVzdCA9IGh0bWwuc2xpY2UodGFnTmFtZUVuZHNBdCwgY2xvc2VBdCArIDEpXG4gICAgbmV3SFRNTCA9IGA8JHt0YWd9JHthdHRyc1N0ciA9PT0gXCJcIiA/IFwiXCIgOiBcIiBcIn0ke2F0dHJzU3RyfSR7cmVzdH1gXG4gIH1cblxuICByZXR1cm4gW25ld0hUTUwsIGJlZm9yZVRhZywgYWZ0ZXJUYWddXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlbmRlcmVkIHtcbiAgc3RhdGljIGV4dHJhY3QoZGlmZil7XG4gICAgbGV0IHtbUkVQTFldOiByZXBseSwgW0VWRU5UU106IGV2ZW50cywgW1RJVExFXTogdGl0bGV9ID0gZGlmZlxuICAgIGRlbGV0ZSBkaWZmW1JFUExZXVxuICAgIGRlbGV0ZSBkaWZmW0VWRU5UU11cbiAgICBkZWxldGUgZGlmZltUSVRMRV1cbiAgICByZXR1cm4ge2RpZmYsIHRpdGxlLCByZXBseTogcmVwbHkgfHwgbnVsbCwgZXZlbnRzOiBldmVudHMgfHwgW119XG4gIH1cblxuICBjb25zdHJ1Y3Rvcih2aWV3SWQsIHJlbmRlcmVkKXtcbiAgICB0aGlzLnZpZXdJZCA9IHZpZXdJZFxuICAgIHRoaXMucmVuZGVyZWQgPSB7fVxuICAgIHRoaXMubWFnaWNJZCA9IDBcbiAgICB0aGlzLm1lcmdlRGlmZihyZW5kZXJlZClcbiAgfVxuXG4gIHBhcmVudFZpZXdJZCgpeyByZXR1cm4gdGhpcy52aWV3SWQgfVxuXG4gIHRvU3RyaW5nKG9ubHlDaWRzKXtcbiAgICBsZXQgW3N0ciwgc3RyZWFtc10gPSB0aGlzLnJlY3Vyc2l2ZVRvU3RyaW5nKHRoaXMucmVuZGVyZWQsIHRoaXMucmVuZGVyZWRbQ09NUE9ORU5UU10sIG9ubHlDaWRzLCB0cnVlLCB7fSlcbiAgICByZXR1cm4gW3N0ciwgc3RyZWFtc11cbiAgfVxuXG4gIHJlY3Vyc2l2ZVRvU3RyaW5nKHJlbmRlcmVkLCBjb21wb25lbnRzID0gcmVuZGVyZWRbQ09NUE9ORU5UU10sIG9ubHlDaWRzLCBjaGFuZ2VUcmFja2luZywgcm9vdEF0dHJzKXtcbiAgICBvbmx5Q2lkcyA9IG9ubHlDaWRzID8gbmV3IFNldChvbmx5Q2lkcykgOiBudWxsXG4gICAgbGV0IG91dHB1dCA9IHtidWZmZXI6IFwiXCIsIGNvbXBvbmVudHM6IGNvbXBvbmVudHMsIG9ubHlDaWRzOiBvbmx5Q2lkcywgc3RyZWFtczogbmV3IFNldCgpfVxuICAgIHRoaXMudG9PdXRwdXRCdWZmZXIocmVuZGVyZWQsIG51bGwsIG91dHB1dCwgY2hhbmdlVHJhY2tpbmcsIHJvb3RBdHRycylcbiAgICByZXR1cm4gW291dHB1dC5idWZmZXIsIG91dHB1dC5zdHJlYW1zXVxuICB9XG5cbiAgY29tcG9uZW50Q0lEcyhkaWZmKXsgcmV0dXJuIE9iamVjdC5rZXlzKGRpZmZbQ09NUE9ORU5UU10gfHwge30pLm1hcChpID0+IHBhcnNlSW50KGkpKSB9XG5cbiAgaXNDb21wb25lbnRPbmx5RGlmZihkaWZmKXtcbiAgICBpZighZGlmZltDT01QT05FTlRTXSl7IHJldHVybiBmYWxzZSB9XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKGRpZmYpLmxlbmd0aCA9PT0gMVxuICB9XG5cbiAgZ2V0Q29tcG9uZW50KGRpZmYsIGNpZCl7IHJldHVybiBkaWZmW0NPTVBPTkVOVFNdW2NpZF0gfVxuXG4gIHJlc2V0UmVuZGVyKGNpZCl7XG4gICAgLy8gd2UgYXJlIHJhY2luZyBhIGNvbXBvbmVudCBkZXN0cm95LCBpdCBjb3VsZCBub3QgZXhpc3QsIHNvXG4gICAgLy8gbWFrZSBzdXJlIHRoYXQgd2UgZG9uJ3QgdHJ5IHRvIHNldCByZXNldCBvbiB1bmRlZmluZWRcbiAgICBpZih0aGlzLnJlbmRlcmVkW0NPTVBPTkVOVFNdW2NpZF0pe1xuICAgICAgdGhpcy5yZW5kZXJlZFtDT01QT05FTlRTXVtjaWRdLnJlc2V0ID0gdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIG1lcmdlRGlmZihkaWZmKXtcbiAgICBsZXQgbmV3YyA9IGRpZmZbQ09NUE9ORU5UU11cbiAgICBsZXQgY2FjaGUgPSB7fVxuICAgIGRlbGV0ZSBkaWZmW0NPTVBPTkVOVFNdXG4gICAgdGhpcy5yZW5kZXJlZCA9IHRoaXMubXV0YWJsZU1lcmdlKHRoaXMucmVuZGVyZWQsIGRpZmYpXG4gICAgdGhpcy5yZW5kZXJlZFtDT01QT05FTlRTXSA9IHRoaXMucmVuZGVyZWRbQ09NUE9ORU5UU10gfHwge31cblxuICAgIGlmKG5ld2Mpe1xuICAgICAgbGV0IG9sZGMgPSB0aGlzLnJlbmRlcmVkW0NPTVBPTkVOVFNdXG5cbiAgICAgIGZvcihsZXQgY2lkIGluIG5ld2Mpe1xuICAgICAgICBuZXdjW2NpZF0gPSB0aGlzLmNhY2hlZEZpbmRDb21wb25lbnQoY2lkLCBuZXdjW2NpZF0sIG9sZGMsIG5ld2MsIGNhY2hlKVxuICAgICAgfVxuXG4gICAgICBmb3IobGV0IGNpZCBpbiBuZXdjKXsgb2xkY1tjaWRdID0gbmV3Y1tjaWRdIH1cbiAgICAgIGRpZmZbQ09NUE9ORU5UU10gPSBuZXdjXG4gICAgfVxuICB9XG5cbiAgY2FjaGVkRmluZENvbXBvbmVudChjaWQsIGNkaWZmLCBvbGRjLCBuZXdjLCBjYWNoZSl7XG4gICAgaWYoY2FjaGVbY2lkXSl7XG4gICAgICByZXR1cm4gY2FjaGVbY2lkXVxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgbmRpZmYsIHN0YXQsIHNjaWQgPSBjZGlmZltTVEFUSUNdXG5cbiAgICAgIGlmKGlzQ2lkKHNjaWQpKXtcbiAgICAgICAgbGV0IHRkaWZmXG5cbiAgICAgICAgaWYoc2NpZCA+IDApe1xuICAgICAgICAgIHRkaWZmID0gdGhpcy5jYWNoZWRGaW5kQ29tcG9uZW50KHNjaWQsIG5ld2Nbc2NpZF0sIG9sZGMsIG5ld2MsIGNhY2hlKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRkaWZmID0gb2xkY1stc2NpZF1cbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXQgPSB0ZGlmZltTVEFUSUNdXG4gICAgICAgIG5kaWZmID0gdGhpcy5jbG9uZU1lcmdlKHRkaWZmLCBjZGlmZiwgdHJ1ZSlcbiAgICAgICAgbmRpZmZbU1RBVElDXSA9IHN0YXRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5kaWZmID0gY2RpZmZbU1RBVElDXSAhPT0gdW5kZWZpbmVkIHx8IG9sZGNbY2lkXSA9PT0gdW5kZWZpbmVkID9cbiAgICAgICAgICBjZGlmZiA6IHRoaXMuY2xvbmVNZXJnZShvbGRjW2NpZF0sIGNkaWZmLCBmYWxzZSlcbiAgICAgIH1cblxuICAgICAgY2FjaGVbY2lkXSA9IG5kaWZmXG4gICAgICByZXR1cm4gbmRpZmZcbiAgICB9XG4gIH1cblxuICBtdXRhYmxlTWVyZ2UodGFyZ2V0LCBzb3VyY2Upe1xuICAgIGlmKHNvdXJjZVtTVEFUSUNdICE9PSB1bmRlZmluZWQpe1xuICAgICAgcmV0dXJuIHNvdXJjZVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRvTXV0YWJsZU1lcmdlKHRhcmdldCwgc291cmNlKVxuICAgICAgcmV0dXJuIHRhcmdldFxuICAgIH1cbiAgfVxuXG4gIGRvTXV0YWJsZU1lcmdlKHRhcmdldCwgc291cmNlKXtcbiAgICBmb3IobGV0IGtleSBpbiBzb3VyY2Upe1xuICAgICAgbGV0IHZhbCA9IHNvdXJjZVtrZXldXG4gICAgICBsZXQgdGFyZ2V0VmFsID0gdGFyZ2V0W2tleV1cbiAgICAgIGxldCBpc09ialZhbCA9IGlzT2JqZWN0KHZhbClcbiAgICAgIGlmKGlzT2JqVmFsICYmIHZhbFtTVEFUSUNdID09PSB1bmRlZmluZWQgJiYgaXNPYmplY3QodGFyZ2V0VmFsKSl7XG4gICAgICAgIHRoaXMuZG9NdXRhYmxlTWVyZ2UodGFyZ2V0VmFsLCB2YWwpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0YXJnZXRba2V5XSA9IHZhbFxuICAgICAgfVxuICAgIH1cbiAgICBpZih0YXJnZXRbUk9PVF0pe1xuICAgICAgdGFyZ2V0Lm5ld1JlbmRlciA9IHRydWVcbiAgICB9XG4gIH1cblxuICAvLyBNZXJnZXMgY2lkIHRyZWVzIHRvZ2V0aGVyLCBjb3B5aW5nIHN0YXRpY3MgZnJvbSBzb3VyY2UgdHJlZS5cbiAgLy9cbiAgLy8gVGhlIGBwcnVuZU1hZ2ljSWRgIGlzIHBhc3NlZCB0byBjb250cm9sIHBydW5pbmcgdGhlIG1hZ2ljSWQgb2YgdGhlXG4gIC8vIHRhcmdldC4gV2UgbXVzdCBhbHdheXMgcHJ1bmUgdGhlIG1hZ2ljSWQgd2hlbiB3ZSBhcmUgc2hhcmluZyBzdGF0aWNzXG4gIC8vIGZyb20gYW5vdGhlciBjb21wb25lbnQuIElmIG5vdCBwcnVuaW5nLCB3ZSByZXBsaWNhdGUgdGhlIGxvZ2ljIGZyb21cbiAgLy8gbXV0YWJsZU1lcmdlLCB3aGVyZSB3ZSBzZXQgbmV3UmVuZGVyIHRvIHRydWUgaWYgdGhlcmUgaXMgYSByb290XG4gIC8vIChlZmZlY3RpdmVseSBmb3JjaW5nIHRoZSBuZXcgdmVyc2lvbiB0byBiZSByZW5kZXJlZCBpbnN0ZWFkIG9mIHNraXBwZWQpXG4gIC8vXG4gIGNsb25lTWVyZ2UodGFyZ2V0LCBzb3VyY2UsIHBydW5lTWFnaWNJZCl7XG4gICAgbGV0IG1lcmdlZCA9IHsuLi50YXJnZXQsIC4uLnNvdXJjZX1cbiAgICBmb3IobGV0IGtleSBpbiBtZXJnZWQpe1xuICAgICAgbGV0IHZhbCA9IHNvdXJjZVtrZXldXG4gICAgICBsZXQgdGFyZ2V0VmFsID0gdGFyZ2V0W2tleV1cbiAgICAgIGlmKGlzT2JqZWN0KHZhbCkgJiYgdmFsW1NUQVRJQ10gPT09IHVuZGVmaW5lZCAmJiBpc09iamVjdCh0YXJnZXRWYWwpKXtcbiAgICAgICAgbWVyZ2VkW2tleV0gPSB0aGlzLmNsb25lTWVyZ2UodGFyZ2V0VmFsLCB2YWwsIHBydW5lTWFnaWNJZClcbiAgICAgIH0gZWxzZSBpZih2YWwgPT09IHVuZGVmaW5lZCAmJiBpc09iamVjdCh0YXJnZXRWYWwpKXtcbiAgICAgICAgbWVyZ2VkW2tleV0gPSB0aGlzLmNsb25lTWVyZ2UodGFyZ2V0VmFsLCB7fSwgcHJ1bmVNYWdpY0lkKVxuICAgICAgfVxuICAgIH1cbiAgICBpZihwcnVuZU1hZ2ljSWQpe1xuICAgICAgZGVsZXRlIG1lcmdlZC5tYWdpY0lkXG4gICAgICBkZWxldGUgbWVyZ2VkLm5ld1JlbmRlclxuICAgIH0gZWxzZSBpZih0YXJnZXRbUk9PVF0pe1xuICAgICAgbWVyZ2VkLm5ld1JlbmRlciA9IHRydWVcbiAgICB9XG4gICAgcmV0dXJuIG1lcmdlZFxuICB9XG5cbiAgY29tcG9uZW50VG9TdHJpbmcoY2lkKXtcbiAgICBsZXQgW3N0ciwgc3RyZWFtc10gPSB0aGlzLnJlY3Vyc2l2ZUNJRFRvU3RyaW5nKHRoaXMucmVuZGVyZWRbQ09NUE9ORU5UU10sIGNpZCwgbnVsbClcbiAgICBsZXQgW3N0cmlwcGVkSFRNTCwgX2JlZm9yZSwgX2FmdGVyXSA9IG1vZGlmeVJvb3Qoc3RyLCB7fSlcbiAgICByZXR1cm4gW3N0cmlwcGVkSFRNTCwgc3RyZWFtc11cbiAgfVxuXG4gIHBydW5lQ0lEcyhjaWRzKXtcbiAgICBjaWRzLmZvckVhY2goY2lkID0+IGRlbGV0ZSB0aGlzLnJlbmRlcmVkW0NPTVBPTkVOVFNdW2NpZF0pXG4gIH1cblxuICAvLyBwcml2YXRlXG5cbiAgZ2V0KCl7IHJldHVybiB0aGlzLnJlbmRlcmVkIH1cblxuICBpc05ld0ZpbmdlcnByaW50KGRpZmYgPSB7fSl7IHJldHVybiAhIWRpZmZbU1RBVElDXSB9XG5cbiAgdGVtcGxhdGVTdGF0aWMocGFydCwgdGVtcGxhdGVzKXtcbiAgICBpZih0eXBlb2YgKHBhcnQpID09PSBcIm51bWJlclwiKXtcbiAgICAgIHJldHVybiB0ZW1wbGF0ZXNbcGFydF1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHBhcnRcbiAgICB9XG4gIH1cblxuICBuZXh0TWFnaWNJRCgpe1xuICAgIHRoaXMubWFnaWNJZCsrXG4gICAgcmV0dXJuIGBtJHt0aGlzLm1hZ2ljSWR9LSR7dGhpcy5wYXJlbnRWaWV3SWQoKX1gXG4gIH1cblxuICAvLyBDb252ZXJ0cyByZW5kZXJlZCB0cmVlIHRvIG91dHB1dCBidWZmZXIuXG4gIC8vXG4gIC8vIGNoYW5nZVRyYWNraW5nIGNvbnRyb2xzIGlmIHdlIGNhbiBhcHBseSB0aGUgUEhYX1NLSVAgb3B0aW1pemF0aW9uLlxuICAvLyBJdCBpcyBkaXNhYmxlZCBmb3IgY29tcHJlaGVuc2lvbnMgc2luY2Ugd2UgbXVzdCByZS1yZW5kZXIgdGhlIGVudGlyZSBjb2xsZWN0aW9uXG4gIC8vIGFuZCBubyBpbmRpdmlkdWFsIGVsZW1lbnQgaXMgdHJhY2tlZCBpbnNpZGUgdGhlIGNvbXByZWhlbnNpb24uXG4gIHRvT3V0cHV0QnVmZmVyKHJlbmRlcmVkLCB0ZW1wbGF0ZXMsIG91dHB1dCwgY2hhbmdlVHJhY2tpbmcsIHJvb3RBdHRycyA9IHt9KXtcbiAgICBpZihyZW5kZXJlZFtEWU5BTUlDU10peyByZXR1cm4gdGhpcy5jb21wcmVoZW5zaW9uVG9CdWZmZXIocmVuZGVyZWQsIHRlbXBsYXRlcywgb3V0cHV0KSB9XG4gICAgbGV0IHtbU1RBVElDXTogc3RhdGljc30gPSByZW5kZXJlZFxuICAgIHN0YXRpY3MgPSB0aGlzLnRlbXBsYXRlU3RhdGljKHN0YXRpY3MsIHRlbXBsYXRlcylcbiAgICBsZXQgaXNSb290ID0gcmVuZGVyZWRbUk9PVF1cbiAgICBsZXQgcHJldkJ1ZmZlciA9IG91dHB1dC5idWZmZXJcbiAgICBpZihpc1Jvb3QpeyBvdXRwdXQuYnVmZmVyID0gXCJcIiB9XG5cbiAgICAvLyB0aGlzIGNvbmRpdGlvbiBpcyBjYWxsZWQgd2hlbiBmaXJzdCByZW5kZXJpbmcgYW4gb3B0aW1pemFibGUgZnVuY3Rpb24gY29tcG9uZW50LlxuICAgIC8vIExDIGhhdmUgdGhlaXIgbWFnaWNJZCBwcmV2aW91c2x5IHNldFxuICAgIGlmKGNoYW5nZVRyYWNraW5nICYmIGlzUm9vdCAmJiAhcmVuZGVyZWQubWFnaWNJZCl7XG4gICAgICByZW5kZXJlZC5uZXdSZW5kZXIgPSB0cnVlXG4gICAgICByZW5kZXJlZC5tYWdpY0lkID0gdGhpcy5uZXh0TWFnaWNJRCgpXG4gICAgfVxuXG4gICAgb3V0cHV0LmJ1ZmZlciArPSBzdGF0aWNzWzBdXG4gICAgZm9yKGxldCBpID0gMTsgaSA8IHN0YXRpY3MubGVuZ3RoOyBpKyspe1xuICAgICAgdGhpcy5keW5hbWljVG9CdWZmZXIocmVuZGVyZWRbaSAtIDFdLCB0ZW1wbGF0ZXMsIG91dHB1dCwgY2hhbmdlVHJhY2tpbmcpXG4gICAgICBvdXRwdXQuYnVmZmVyICs9IHN0YXRpY3NbaV1cbiAgICB9XG5cbiAgICAvLyBBcHBsaWVzIHRoZSByb290IHRhZyBcInNraXBcIiBvcHRpbWl6YXRpb24gaWYgc3VwcG9ydGVkLCB3aGljaCBjbGVhcnNcbiAgICAvLyB0aGUgcm9vdCB0YWcgYXR0cmlidXRlcyBhbmQgaW5uZXJIVE1MLCBhbmQgb25seSBtYWludGFpbnMgdGhlIG1hZ2ljSWQuXG4gICAgLy8gV2UgY2FuIG9ubHkgc2tpcCB3aGVuIGNoYW5nZVRyYWNraW5nIGlzIHN1cHBvcnRlZCAob3V0c2lkZSBvZiBhIGNvbXByZWhlbnNpb24pLFxuICAgIC8vIGFuZCB3aGVuIHRoZSByb290IGVsZW1lbnQgaGFzbid0IGV4cGVyaWVuY2VkIGFuIHVucmVuZGVyZWQgbWVyZ2UgKG5ld1JlbmRlciB0cnVlKS5cbiAgICBpZihpc1Jvb3Qpe1xuICAgICAgbGV0IHNraXAgPSBmYWxzZVxuICAgICAgbGV0IGF0dHJzXG4gICAgICAvLyBXaGVuIGEgTEMgaXMgcmUtYWRkZWQgdG8gdGhlIHBhZ2UsIHdlIG5lZWQgdG8gcmUtcmVuZGVyIHRoZSBlbnRpcmUgTEMgdHJlZSxcbiAgICAgIC8vIHRoZXJlZm9yZSBjaGFuZ2VUcmFja2luZyBpcyBmYWxzZTsgaG93ZXZlciwgd2UgbmVlZCB0byBrZWVwIGFsbCB0aGUgbWFnaWNJZHNcbiAgICAgIC8vIGZyb20gYW55IGZ1bmN0aW9uIGNvbXBvbmVudCBzbyB0aGUgbmV4dCB0aW1lIHRoZSBMQyBpcyB1cGRhdGVkLCB3ZSBjYW4gYXBwbHlcbiAgICAgIC8vIHRoZSBza2lwIG9wdGltaXphdGlvblxuICAgICAgaWYoY2hhbmdlVHJhY2tpbmcgfHwgcmVuZGVyZWQubWFnaWNJZCl7XG4gICAgICAgIHNraXAgPSBjaGFuZ2VUcmFja2luZyAmJiAhcmVuZGVyZWQubmV3UmVuZGVyXG4gICAgICAgIGF0dHJzID0ge1tQSFhfTUFHSUNfSURdOiByZW5kZXJlZC5tYWdpY0lkLCAuLi5yb290QXR0cnN9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhdHRycyA9IHJvb3RBdHRyc1xuICAgICAgfVxuICAgICAgaWYoc2tpcCl7IGF0dHJzW1BIWF9TS0lQXSA9IHRydWUgfVxuICAgICAgbGV0IFtuZXdSb290LCBjb21tZW50QmVmb3JlLCBjb21tZW50QWZ0ZXJdID0gbW9kaWZ5Um9vdChvdXRwdXQuYnVmZmVyLCBhdHRycywgc2tpcClcbiAgICAgIHJlbmRlcmVkLm5ld1JlbmRlciA9IGZhbHNlXG4gICAgICBvdXRwdXQuYnVmZmVyID0gcHJldkJ1ZmZlciArIGNvbW1lbnRCZWZvcmUgKyBuZXdSb290ICsgY29tbWVudEFmdGVyXG4gICAgfVxuICB9XG5cbiAgY29tcHJlaGVuc2lvblRvQnVmZmVyKHJlbmRlcmVkLCB0ZW1wbGF0ZXMsIG91dHB1dCl7XG4gICAgbGV0IHtbRFlOQU1JQ1NdOiBkeW5hbWljcywgW1NUQVRJQ106IHN0YXRpY3MsIFtTVFJFQU1dOiBzdHJlYW19ID0gcmVuZGVyZWRcbiAgICBsZXQgW19yZWYsIF9pbnNlcnRzLCBkZWxldGVJZHMsIHJlc2V0XSA9IHN0cmVhbSB8fCBbbnVsbCwge30sIFtdLCBudWxsXVxuICAgIHN0YXRpY3MgPSB0aGlzLnRlbXBsYXRlU3RhdGljKHN0YXRpY3MsIHRlbXBsYXRlcylcbiAgICBsZXQgY29tcFRlbXBsYXRlcyA9IHRlbXBsYXRlcyB8fCByZW5kZXJlZFtURU1QTEFURVNdXG4gICAgZm9yKGxldCBkID0gMDsgZCA8IGR5bmFtaWNzLmxlbmd0aDsgZCsrKXtcbiAgICAgIGxldCBkeW5hbWljID0gZHluYW1pY3NbZF1cbiAgICAgIG91dHB1dC5idWZmZXIgKz0gc3RhdGljc1swXVxuICAgICAgZm9yKGxldCBpID0gMTsgaSA8IHN0YXRpY3MubGVuZ3RoOyBpKyspe1xuICAgICAgICAvLyBJbnNpZGUgYSBjb21wcmVoZW5zaW9uLCB3ZSBkb24ndCB0cmFjayBob3cgZHluYW1pY3MgY2hhbmdlXG4gICAgICAgIC8vIG92ZXIgdGltZSAoYW5kIGZlYXR1cmVzIGxpa2Ugc3RyZWFtcyB3b3VsZCBtYWtlIHRoYXQgaW1wb3NzaWJsZVxuICAgICAgICAvLyB1bmxlc3Mgd2UgbW92ZSB0aGUgc3RyZWFtIGRpZmZpbmcgYXdheSBmcm9tIG1vcnBoZG9tKSxcbiAgICAgICAgLy8gc28gd2UgY2FuJ3QgcGVyZm9ybSByb290IGNoYW5nZSB0cmFja2luZy5cbiAgICAgICAgbGV0IGNoYW5nZVRyYWNraW5nID0gZmFsc2VcbiAgICAgICAgdGhpcy5keW5hbWljVG9CdWZmZXIoZHluYW1pY1tpIC0gMV0sIGNvbXBUZW1wbGF0ZXMsIG91dHB1dCwgY2hhbmdlVHJhY2tpbmcpXG4gICAgICAgIG91dHB1dC5idWZmZXIgKz0gc3RhdGljc1tpXVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmKHN0cmVhbSAhPT0gdW5kZWZpbmVkICYmIChyZW5kZXJlZFtEWU5BTUlDU10ubGVuZ3RoID4gMCB8fCBkZWxldGVJZHMubGVuZ3RoID4gMCB8fCByZXNldCkpe1xuICAgICAgZGVsZXRlIHJlbmRlcmVkW1NUUkVBTV1cbiAgICAgIHJlbmRlcmVkW0RZTkFNSUNTXSA9IFtdXG4gICAgICBvdXRwdXQuc3RyZWFtcy5hZGQoc3RyZWFtKVxuICAgIH1cbiAgfVxuXG4gIGR5bmFtaWNUb0J1ZmZlcihyZW5kZXJlZCwgdGVtcGxhdGVzLCBvdXRwdXQsIGNoYW5nZVRyYWNraW5nKXtcbiAgICBpZih0eXBlb2YgKHJlbmRlcmVkKSA9PT0gXCJudW1iZXJcIil7XG4gICAgICBsZXQgW3N0ciwgc3RyZWFtc10gPSB0aGlzLnJlY3Vyc2l2ZUNJRFRvU3RyaW5nKG91dHB1dC5jb21wb25lbnRzLCByZW5kZXJlZCwgb3V0cHV0Lm9ubHlDaWRzKVxuICAgICAgb3V0cHV0LmJ1ZmZlciArPSBzdHJcbiAgICAgIG91dHB1dC5zdHJlYW1zID0gbmV3IFNldChbLi4ub3V0cHV0LnN0cmVhbXMsIC4uLnN0cmVhbXNdKVxuICAgIH0gZWxzZSBpZihpc09iamVjdChyZW5kZXJlZCkpe1xuICAgICAgdGhpcy50b091dHB1dEJ1ZmZlcihyZW5kZXJlZCwgdGVtcGxhdGVzLCBvdXRwdXQsIGNoYW5nZVRyYWNraW5nLCB7fSlcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0cHV0LmJ1ZmZlciArPSByZW5kZXJlZFxuICAgIH1cbiAgfVxuXG4gIHJlY3Vyc2l2ZUNJRFRvU3RyaW5nKGNvbXBvbmVudHMsIGNpZCwgb25seUNpZHMpe1xuICAgIGxldCBjb21wb25lbnQgPSBjb21wb25lbnRzW2NpZF0gfHwgbG9nRXJyb3IoYG5vIGNvbXBvbmVudCBmb3IgQ0lEICR7Y2lkfWAsIGNvbXBvbmVudHMpXG4gICAgbGV0IGF0dHJzID0ge1tQSFhfQ09NUE9ORU5UXTogY2lkfVxuICAgIGxldCBza2lwID0gb25seUNpZHMgJiYgIW9ubHlDaWRzLmhhcyhjaWQpXG4gICAgLy8gVHdvIG9wdGltaXphdGlvbiBwYXRocyBhcHBseSBoZXJlOlxuICAgIC8vXG4gICAgLy8gICAxLiBUaGUgb25seUNpZHMgb3B0aW1pemF0aW9uIHdvcmtzIGJ5IHRoZSBzZXJ2ZXIgZGlmZiB0ZWxsaW5nIHVzIG9ubHkgc3BlY2lmaWNcbiAgICAvLyAgICAgY2lkJ3MgaGF2ZSBjaGFuZ2VkLiBUaGlzIGFsbG93cyB1cyB0byBza2lwIHJlbmRlcmluZyBhbnkgY29tcG9uZW50IHRoYXQgaGFzbid0IGNoYW5nZWQsXG4gICAgLy8gICAgIHdoaWNoIHVsdGltYXRlbHkgc2V0cyBQSFhfU0tJUCByb290IGF0dHJpYnV0ZSBhbmQgYXZvaWRzIHJlbmRlcmluZyB0aGUgaW5uZXJIVE1MLlxuICAgIC8vXG4gICAgLy8gICAyLiBUaGUgcm9vdCBQSFhfU0tJUCBvcHRpbWl6YXRpb24gZ2VuZXJhbGl6ZXMgdG8gYWxsIEhFRXggZnVuY3Rpb24gY29tcG9uZW50cywgYW5kXG4gICAgLy8gICAgIHdvcmtzIGluIHRoZSBzYW1lIFBIWF9TS0lQIGF0dHJpYnV0ZSBmYXNoaW9uIGFzIDEsIGJ1dCB0aGUgbmV3UmVuZGVyIHRyYWNraW5nIGlzIGRvbmVcbiAgICAvLyAgICAgYXQgdGhlIGdlbmVyYWwgZGlmZiBtZXJnZSBsZXZlbC4gSWYgd2UgbWVyZ2UgYSBkaWZmIHdpdGggbmV3IGR5bmFtaWNzLCB3ZSBuZWNlc3NhcmlseSBoYXZlXG4gICAgLy8gICAgIGV4cGVyaWVuY2VkIGEgY2hhbmdlIHdoaWNoIG11c3QgYmUgYSBuZXdSZW5kZXIsIGFuZCB0aHVzIHdlIGNhbid0IHNraXAgdGhlIHJlbmRlci5cbiAgICAvL1xuICAgIC8vIEJvdGggb3B0aW1pemF0aW9uIGZsb3dzIGFwcGx5IGhlcmUuIG5ld1JlbmRlciBpcyBzZXQgYmFzZWQgb24gdGhlIG9ubHlDaWRzIG9wdGltaXphdGlvbiwgYW5kXG4gICAgLy8gd2UgdHJhY2sgYSBkZXRlcm1pbmlzdGljIG1hZ2ljSWQgYmFzZWQgb24gdGhlIGNpZC5cbiAgICAvL1xuICAgIC8vIGNoYW5nZVRyYWNraW5nIGlzIGFib3V0IHRoZSBlbnRpcmUgdHJlZVxuICAgIC8vIG5ld1JlbmRlciBpcyBhYm91dCB0aGUgY3VycmVudCByb290IGluIHRoZSB0cmVlXG4gICAgLy9cbiAgICAvLyBCeSBkZWZhdWx0IGNoYW5nZVRyYWNraW5nIGlzIGVuYWJsZWQsIGJ1dCB3ZSBzcGVjaWFsIGNhc2UgdGhlIGZsb3cgd2hlcmUgdGhlIGNsaWVudCBpcyBwcnVuaW5nXG4gICAgLy8gY2lkcyBhbmQgdGhlIHNlcnZlciBhZGRzIHRoZSBjb21wb25lbnQgYmFjay4gSW4gc3VjaCBjYXNlcywgd2UgZXhwbGljaXRseSBkaXNhYmxlIGNoYW5nZVRyYWNraW5nXG4gICAgLy8gd2l0aCByZXNldFJlbmRlciBmb3IgdGhpcyBjaWQsIHRoZW4gcmUtZW5hYmxlIGl0IGFmdGVyIHRoZSByZWN1cnNpdmUgY2FsbCB0byBza2lwIHRoZSBvcHRpbWl6YXRpb25cbiAgICAvLyBmb3IgdGhlIGVudGlyZSBjb21wb25lbnQgdHJlZS5cbiAgICBjb21wb25lbnQubmV3UmVuZGVyID0gIXNraXBcbiAgICBjb21wb25lbnQubWFnaWNJZCA9IGBjJHtjaWR9LSR7dGhpcy5wYXJlbnRWaWV3SWQoKX1gXG4gICAgLy8gZW5hYmxlIGNoYW5nZSB0cmFja2luZyBhcyBsb25nIGFzIHRoZSBjb21wb25lbnQgaGFzbid0IGJlZW4gcmVzZXRcbiAgICBsZXQgY2hhbmdlVHJhY2tpbmcgPSAhY29tcG9uZW50LnJlc2V0XG4gICAgbGV0IFtodG1sLCBzdHJlYW1zXSA9IHRoaXMucmVjdXJzaXZlVG9TdHJpbmcoY29tcG9uZW50LCBjb21wb25lbnRzLCBvbmx5Q2lkcywgY2hhbmdlVHJhY2tpbmcsIGF0dHJzKVxuICAgIC8vIGRpc2FibGUgcmVzZXQgYWZ0ZXIgd2UndmUgcmVuZGVyZWRcbiAgICBkZWxldGUgY29tcG9uZW50LnJlc2V0XG5cbiAgICByZXR1cm4gW2h0bWwsIHN0cmVhbXNdXG4gIH1cbn1cbiIsICJpbXBvcnQgRE9NIGZyb20gXCIuL2RvbVwiXG5pbXBvcnQgQVJJQSBmcm9tIFwiLi9hcmlhXCJcblxubGV0IGZvY3VzU3RhY2sgPSBbXVxubGV0IGRlZmF1bHRfdHJhbnNpdGlvbl90aW1lID0gMjAwXG5cbmxldCBKUyA9IHtcbiAgLy8gcHJpdmF0ZVxuICBleGVjKGUsIGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBkZWZhdWx0cyl7XG4gICAgbGV0IFtkZWZhdWx0S2luZCwgZGVmYXVsdEFyZ3NdID0gZGVmYXVsdHMgfHwgW251bGwsIHtjYWxsYmFjazogZGVmYXVsdHMgJiYgZGVmYXVsdHMuY2FsbGJhY2t9XVxuICAgIGxldCBjb21tYW5kcyA9IHBoeEV2ZW50LmNoYXJBdCgwKSA9PT0gXCJbXCIgP1xuICAgICAgSlNPTi5wYXJzZShwaHhFdmVudCkgOiBbW2RlZmF1bHRLaW5kLCBkZWZhdWx0QXJnc11dXG5cbiAgICBjb21tYW5kcy5mb3JFYWNoKChba2luZCwgYXJnc10pID0+IHtcbiAgICAgIGlmKGtpbmQgPT09IGRlZmF1bHRLaW5kKXtcbiAgICAgICAgLy8gYWx3YXlzIHByZWZlciB0aGUgYXJncywgYnV0IGtlZXAgZXhpc3Rpbmcga2V5cyBmcm9tIHRoZSBkZWZhdWx0QXJnc1xuICAgICAgICBhcmdzID0gey4uLmRlZmF1bHRBcmdzLCAuLi5hcmdzfVxuICAgICAgICBhcmdzLmNhbGxiYWNrID0gYXJncy5jYWxsYmFjayB8fCBkZWZhdWx0QXJncy5jYWxsYmFja1xuICAgICAgfVxuICAgICAgdGhpcy5maWx0ZXJUb0Vscyh2aWV3LmxpdmVTb2NrZXQsIHNvdXJjZUVsLCBhcmdzKS5mb3JFYWNoKGVsID0+IHtcbiAgICAgICAgdGhpc1tgZXhlY18ke2tpbmR9YF0oZSwgZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCBhcmdzKVxuICAgICAgfSlcbiAgICB9KVxuICB9LFxuXG4gIGlzVmlzaWJsZShlbCl7XG4gICAgcmV0dXJuICEhKGVsLm9mZnNldFdpZHRoIHx8IGVsLm9mZnNldEhlaWdodCB8fCBlbC5nZXRDbGllbnRSZWN0cygpLmxlbmd0aCA+IDApXG4gIH0sXG5cbiAgLy8gcmV0dXJucyB0cnVlIGlmIGFueSBwYXJ0IG9mIHRoZSBlbGVtZW50IGlzIGluc2lkZSB0aGUgdmlld3BvcnRcbiAgaXNJblZpZXdwb3J0KGVsKXtcbiAgICBjb25zdCByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICBjb25zdCB3aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodFxuICAgIGNvbnN0IHdpbmRvd1dpZHRoID0gd2luZG93LmlubmVyV2lkdGggfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoXG5cbiAgICByZXR1cm4gKFxuICAgICAgcmVjdC5yaWdodCA+IDAgJiZcbiAgICAgIHJlY3QuYm90dG9tID4gMCAmJlxuICAgICAgcmVjdC5sZWZ0IDwgd2luZG93V2lkdGggJiZcbiAgICAgIHJlY3QudG9wIDwgd2luZG93SGVpZ2h0XG4gICAgKVxuICB9LFxuXG4gIC8vIHByaXZhdGVcblxuICAvLyBjb21tYW5kc1xuXG4gIGV4ZWNfZXhlYyhlLCBldmVudFR5cGUsIHBoeEV2ZW50LCB2aWV3LCBzb3VyY2VFbCwgZWwsIHthdHRyLCB0b30pe1xuICAgIGxldCBlbmNvZGVkSlMgPSBlbC5nZXRBdHRyaWJ1dGUoYXR0cilcbiAgICBpZighZW5jb2RlZEpTKXsgdGhyb3cgbmV3IEVycm9yKGBleHBlY3RlZCAke2F0dHJ9IHRvIGNvbnRhaW4gSlMgY29tbWFuZCBvbiBcIiR7dG99XCJgKSB9XG4gICAgdmlldy5saXZlU29ja2V0LmV4ZWNKUyhlbCwgZW5jb2RlZEpTLCBldmVudFR5cGUpXG4gIH0sXG5cbiAgZXhlY19kaXNwYXRjaChlLCBldmVudFR5cGUsIHBoeEV2ZW50LCB2aWV3LCBzb3VyY2VFbCwgZWwsIHtldmVudCwgZGV0YWlsLCBidWJibGVzfSl7XG4gICAgZGV0YWlsID0gZGV0YWlsIHx8IHt9XG4gICAgZGV0YWlsLmRpc3BhdGNoZXIgPSBzb3VyY2VFbFxuICAgIERPTS5kaXNwYXRjaEV2ZW50KGVsLCBldmVudCwge2RldGFpbCwgYnViYmxlc30pXG4gIH0sXG5cbiAgZXhlY19wdXNoKGUsIGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCwgYXJncyl7XG4gICAgbGV0IHtldmVudCwgZGF0YSwgdGFyZ2V0LCBwYWdlX2xvYWRpbmcsIGxvYWRpbmcsIHZhbHVlLCBkaXNwYXRjaGVyLCBjYWxsYmFja30gPSBhcmdzXG4gICAgbGV0IHB1c2hPcHRzID0ge2xvYWRpbmcsIHZhbHVlLCB0YXJnZXQsIHBhZ2VfbG9hZGluZzogISFwYWdlX2xvYWRpbmd9XG4gICAgbGV0IHRhcmdldFNyYyA9IGV2ZW50VHlwZSA9PT0gXCJjaGFuZ2VcIiAmJiBkaXNwYXRjaGVyID8gZGlzcGF0Y2hlciA6IHNvdXJjZUVsXG4gICAgbGV0IHBoeFRhcmdldCA9IHRhcmdldCB8fCB0YXJnZXRTcmMuZ2V0QXR0cmlidXRlKHZpZXcuYmluZGluZyhcInRhcmdldFwiKSkgfHwgdGFyZ2V0U3JjXG4gICAgY29uc3QgaGFuZGxlciA9ICh0YXJnZXRWaWV3LCB0YXJnZXRDdHgpID0+IHtcbiAgICAgIGlmKCF0YXJnZXRWaWV3LmlzQ29ubmVjdGVkKCkpeyByZXR1cm4gfVxuICAgICAgaWYoZXZlbnRUeXBlID09PSBcImNoYW5nZVwiKXtcbiAgICAgICAgbGV0IHtuZXdDaWQsIF90YXJnZXR9ID0gYXJnc1xuICAgICAgICBfdGFyZ2V0ID0gX3RhcmdldCB8fCAoRE9NLmlzRm9ybUlucHV0KHNvdXJjZUVsKSA/IHNvdXJjZUVsLm5hbWUgOiB1bmRlZmluZWQpXG4gICAgICAgIGlmKF90YXJnZXQpeyBwdXNoT3B0cy5fdGFyZ2V0ID0gX3RhcmdldCB9XG4gICAgICAgIHRhcmdldFZpZXcucHVzaElucHV0KHNvdXJjZUVsLCB0YXJnZXRDdHgsIG5ld0NpZCwgZXZlbnQgfHwgcGh4RXZlbnQsIHB1c2hPcHRzLCBjYWxsYmFjaylcbiAgICAgIH0gZWxzZSBpZihldmVudFR5cGUgPT09IFwic3VibWl0XCIpe1xuICAgICAgICBsZXQge3N1Ym1pdHRlcn0gPSBhcmdzXG4gICAgICAgIHRhcmdldFZpZXcuc3VibWl0Rm9ybShzb3VyY2VFbCwgdGFyZ2V0Q3R4LCBldmVudCB8fCBwaHhFdmVudCwgc3VibWl0dGVyLCBwdXNoT3B0cywgY2FsbGJhY2spXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0YXJnZXRWaWV3LnB1c2hFdmVudChldmVudFR5cGUsIHNvdXJjZUVsLCB0YXJnZXRDdHgsIGV2ZW50IHx8IHBoeEV2ZW50LCBkYXRhLCBwdXNoT3B0cywgY2FsbGJhY2spXG4gICAgICB9XG4gICAgfVxuICAgIC8vIGluIGNhc2Ugb2YgZm9ybVJlY292ZXJ5LCB0YXJnZXRWaWV3IGFuZCB0YXJnZXRDdHggYXJlIHBhc3NlZCBhcyBhcmd1bWVudFxuICAgIC8vIGFzIHRoZXkgYXJlIGxvb2tlZCB1cCBpbiBhIHRlbXBsYXRlIGVsZW1lbnQsIG5vdCB0aGUgcmVhbCBET01cbiAgICBpZihhcmdzLnRhcmdldFZpZXcgJiYgYXJncy50YXJnZXRDdHgpe1xuICAgICAgaGFuZGxlcihhcmdzLnRhcmdldFZpZXcsIGFyZ3MudGFyZ2V0Q3R4KVxuICAgIH0gZWxzZSB7XG4gICAgICB2aWV3LndpdGhpblRhcmdldHMocGh4VGFyZ2V0LCBoYW5kbGVyKVxuICAgIH1cbiAgfSxcblxuICBleGVjX25hdmlnYXRlKGUsIGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCwge2hyZWYsIHJlcGxhY2V9KXtcbiAgICB2aWV3LmxpdmVTb2NrZXQuaGlzdG9yeVJlZGlyZWN0KGUsIGhyZWYsIHJlcGxhY2UgPyBcInJlcGxhY2VcIiA6IFwicHVzaFwiLCBudWxsLCBzb3VyY2VFbClcbiAgfSxcblxuICBleGVjX3BhdGNoKGUsIGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCwge2hyZWYsIHJlcGxhY2V9KXtcbiAgICB2aWV3LmxpdmVTb2NrZXQucHVzaEhpc3RvcnlQYXRjaChlLCBocmVmLCByZXBsYWNlID8gXCJyZXBsYWNlXCIgOiBcInB1c2hcIiwgc291cmNlRWwpXG4gIH0sXG5cbiAgZXhlY19mb2N1cyhlLCBldmVudFR5cGUsIHBoeEV2ZW50LCB2aWV3LCBzb3VyY2VFbCwgZWwpe1xuICAgIEFSSUEuYXR0ZW1wdEZvY3VzKGVsKVxuICAgIC8vIGluIGNhc2UgdGhlIEpTLmZvY3VzIGNvbW1hbmQgaXMgaW4gYSBKUy5zaG93L2hpZGUvdG9nZ2xlIGNoYWluLCBmb3Igc2hvdyB3ZSBuZWVkXG4gICAgLy8gdG8gd2FpdCBmb3IgSlMuc2hvdyB0byBoYXZlIHVwZGF0ZWQgdGhlIGVsZW1lbnQncyBkaXNwbGF5IHByb3BlcnR5IChzZWUgZXhlY190b2dnbGUpXG4gICAgLy8gYnV0IHRoYXQgcnVuIGluIG5lc3RlZCBhbmltYXRpb24gZnJhbWVzLCB0aGVyZWZvcmUgd2UgbmVlZCB0byB1c2UgdGhlbSBoZXJlIGFzIHdlbGxcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gQVJJQS5hdHRlbXB0Rm9jdXMoZWwpKVxuICAgIH0pXG4gIH0sXG5cbiAgZXhlY19mb2N1c19maXJzdChlLCBldmVudFR5cGUsIHBoeEV2ZW50LCB2aWV3LCBzb3VyY2VFbCwgZWwpe1xuICAgIEFSSUEuZm9jdXNGaXJzdEludGVyYWN0aXZlKGVsKSB8fCBBUklBLmZvY3VzRmlyc3QoZWwpXG4gICAgLy8gaWYgeW91IHdvbmRlciBhYm91dCB0aGUgbmVzdGVkIGFuaW1hdGlvbiBmcmFtZXMsIHNlZSBleGVjX2ZvY3VzXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IEFSSUEuZm9jdXNGaXJzdEludGVyYWN0aXZlKGVsKSB8fCBBUklBLmZvY3VzRmlyc3QoZWwpKVxuICAgIH0pXG4gIH0sXG5cbiAgZXhlY19wdXNoX2ZvY3VzKGUsIGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCl7XG4gICAgZm9jdXNTdGFjay5wdXNoKGVsIHx8IHNvdXJjZUVsKVxuICB9LFxuXG4gIGV4ZWNfcG9wX2ZvY3VzKF9lLCBfZXZlbnRUeXBlLCBfcGh4RXZlbnQsIF92aWV3LCBfc291cmNlRWwsIF9lbCl7XG4gICAgY29uc3QgZWwgPSBmb2N1c1N0YWNrLnBvcCgpXG4gICAgaWYoZWwpe1xuICAgICAgZWwuZm9jdXMoKVxuICAgICAgLy8gaWYgeW91IHdvbmRlciBhYm91dCB0aGUgbmVzdGVkIGFuaW1hdGlvbiBmcmFtZXMsIHNlZSBleGVjX2ZvY3VzXG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiBlbC5mb2N1cygpKVxuICAgICAgfSlcbiAgICB9XG4gIH0sXG5cbiAgZXhlY19hZGRfY2xhc3MoZSwgZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCB7bmFtZXMsIHRyYW5zaXRpb24sIHRpbWUsIGJsb2NraW5nfSl7XG4gICAgdGhpcy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIG5hbWVzLCBbXSwgdHJhbnNpdGlvbiwgdGltZSwgdmlldywgYmxvY2tpbmcpXG4gIH0sXG5cbiAgZXhlY19yZW1vdmVfY2xhc3MoZSwgZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCB7bmFtZXMsIHRyYW5zaXRpb24sIHRpbWUsIGJsb2NraW5nfSl7XG4gICAgdGhpcy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIFtdLCBuYW1lcywgdHJhbnNpdGlvbiwgdGltZSwgdmlldywgYmxvY2tpbmcpXG4gIH0sXG5cbiAgZXhlY190b2dnbGVfY2xhc3MoZSwgZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCB7bmFtZXMsIHRyYW5zaXRpb24sIHRpbWUsIGJsb2NraW5nfSl7XG4gICAgdGhpcy50b2dnbGVDbGFzc2VzKGVsLCBuYW1lcywgdHJhbnNpdGlvbiwgdGltZSwgdmlldywgYmxvY2tpbmcpXG4gIH0sXG5cbiAgZXhlY190b2dnbGVfYXR0cihlLCBldmVudFR5cGUsIHBoeEV2ZW50LCB2aWV3LCBzb3VyY2VFbCwgZWwsIHthdHRyOiBbYXR0ciwgdmFsMSwgdmFsMl19KXtcbiAgICB0aGlzLnRvZ2dsZUF0dHIoZWwsIGF0dHIsIHZhbDEsIHZhbDIpXG4gIH0sXG5cbiAgZXhlY190cmFuc2l0aW9uKGUsIGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCwge3RpbWUsIHRyYW5zaXRpb24sIGJsb2NraW5nfSl7XG4gICAgdGhpcy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIFtdLCBbXSwgdHJhbnNpdGlvbiwgdGltZSwgdmlldywgYmxvY2tpbmcpXG4gIH0sXG5cbiAgZXhlY190b2dnbGUoZSwgZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCB7ZGlzcGxheSwgaW5zLCBvdXRzLCB0aW1lLCBibG9ja2luZ30pe1xuICAgIHRoaXMudG9nZ2xlKGV2ZW50VHlwZSwgdmlldywgZWwsIGRpc3BsYXksIGlucywgb3V0cywgdGltZSwgYmxvY2tpbmcpXG4gIH0sXG5cbiAgZXhlY19zaG93KGUsIGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCwge2Rpc3BsYXksIHRyYW5zaXRpb24sIHRpbWUsIGJsb2NraW5nfSl7XG4gICAgdGhpcy5zaG93KGV2ZW50VHlwZSwgdmlldywgZWwsIGRpc3BsYXksIHRyYW5zaXRpb24sIHRpbWUsIGJsb2NraW5nKVxuICB9LFxuXG4gIGV4ZWNfaGlkZShlLCBldmVudFR5cGUsIHBoeEV2ZW50LCB2aWV3LCBzb3VyY2VFbCwgZWwsIHtkaXNwbGF5LCB0cmFuc2l0aW9uLCB0aW1lLCBibG9ja2luZ30pe1xuICAgIHRoaXMuaGlkZShldmVudFR5cGUsIHZpZXcsIGVsLCBkaXNwbGF5LCB0cmFuc2l0aW9uLCB0aW1lLCBibG9ja2luZylcbiAgfSxcblxuICBleGVjX3NldF9hdHRyKGUsIGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCwge2F0dHI6IFthdHRyLCB2YWxdfSl7XG4gICAgdGhpcy5zZXRPclJlbW92ZUF0dHJzKGVsLCBbW2F0dHIsIHZhbF1dLCBbXSlcbiAgfSxcblxuICBleGVjX3JlbW92ZV9hdHRyKGUsIGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCwge2F0dHJ9KXtcbiAgICB0aGlzLnNldE9yUmVtb3ZlQXR0cnMoZWwsIFtdLCBbYXR0cl0pXG4gIH0sXG5cbiAgLy8gdXRpbHMgZm9yIGNvbW1hbmRzXG5cbiAgc2hvdyhldmVudFR5cGUsIHZpZXcsIGVsLCBkaXNwbGF5LCB0cmFuc2l0aW9uLCB0aW1lLCBibG9ja2luZyl7XG4gICAgaWYoIXRoaXMuaXNWaXNpYmxlKGVsKSl7XG4gICAgICB0aGlzLnRvZ2dsZShldmVudFR5cGUsIHZpZXcsIGVsLCBkaXNwbGF5LCB0cmFuc2l0aW9uLCBudWxsLCB0aW1lLCBibG9ja2luZylcbiAgICB9XG4gIH0sXG5cbiAgaGlkZShldmVudFR5cGUsIHZpZXcsIGVsLCBkaXNwbGF5LCB0cmFuc2l0aW9uLCB0aW1lLCBibG9ja2luZyl7XG4gICAgaWYodGhpcy5pc1Zpc2libGUoZWwpKXtcbiAgICAgIHRoaXMudG9nZ2xlKGV2ZW50VHlwZSwgdmlldywgZWwsIGRpc3BsYXksIG51bGwsIHRyYW5zaXRpb24sIHRpbWUsIGJsb2NraW5nKVxuICAgIH1cbiAgfSxcblxuICB0b2dnbGUoZXZlbnRUeXBlLCB2aWV3LCBlbCwgZGlzcGxheSwgaW5zLCBvdXRzLCB0aW1lLCBibG9ja2luZyl7XG4gICAgdGltZSA9IHRpbWUgfHwgZGVmYXVsdF90cmFuc2l0aW9uX3RpbWVcbiAgICBsZXQgW2luQ2xhc3NlcywgaW5TdGFydENsYXNzZXMsIGluRW5kQ2xhc3Nlc10gPSBpbnMgfHwgW1tdLCBbXSwgW11dXG4gICAgbGV0IFtvdXRDbGFzc2VzLCBvdXRTdGFydENsYXNzZXMsIG91dEVuZENsYXNzZXNdID0gb3V0cyB8fCBbW10sIFtdLCBbXV1cbiAgICBpZihpbkNsYXNzZXMubGVuZ3RoID4gMCB8fCBvdXRDbGFzc2VzLmxlbmd0aCA+IDApe1xuICAgICAgaWYodGhpcy5pc1Zpc2libGUoZWwpKXtcbiAgICAgICAgbGV0IG9uU3RhcnQgPSAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIG91dFN0YXJ0Q2xhc3NlcywgaW5DbGFzc2VzLmNvbmNhdChpblN0YXJ0Q2xhc3NlcykuY29uY2F0KGluRW5kQ2xhc3NlcykpXG4gICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgb3V0Q2xhc3NlcywgW10pXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCBvdXRFbmRDbGFzc2VzLCBvdXRTdGFydENsYXNzZXMpKVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgbGV0IG9uRW5kID0gKCkgPT4ge1xuICAgICAgICAgIHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCBbXSwgb3V0Q2xhc3Nlcy5jb25jYXQob3V0RW5kQ2xhc3NlcykpXG4gICAgICAgICAgRE9NLnB1dFN0aWNreShlbCwgXCJ0b2dnbGVcIiwgY3VycmVudEVsID0+IGN1cnJlbnRFbC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCIpXG4gICAgICAgICAgZWwuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJwaHg6aGlkZS1lbmRcIikpXG4gICAgICAgIH1cbiAgICAgICAgZWwuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJwaHg6aGlkZS1zdGFydFwiKSlcbiAgICAgICAgaWYoYmxvY2tpbmcgPT09IGZhbHNlKXtcbiAgICAgICAgICBvblN0YXJ0KClcbiAgICAgICAgICBzZXRUaW1lb3V0KG9uRW5kLCB0aW1lKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZpZXcudHJhbnNpdGlvbih0aW1lLCBvblN0YXJ0LCBvbkVuZClcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYoZXZlbnRUeXBlID09PSBcInJlbW92ZVwiKXsgcmV0dXJuIH1cbiAgICAgICAgbGV0IG9uU3RhcnQgPSAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIGluU3RhcnRDbGFzc2VzLCBvdXRDbGFzc2VzLmNvbmNhdChvdXRTdGFydENsYXNzZXMpLmNvbmNhdChvdXRFbmRDbGFzc2VzKSlcbiAgICAgICAgICBjb25zdCBzdGlja3lEaXNwbGF5ID0gZGlzcGxheSB8fCB0aGlzLmRlZmF1bHREaXNwbGF5KGVsKVxuICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgICAgLy8gZmlyc3QgYWRkIHRoZSBzdGFydGluZyArIGFjdGl2ZSBjbGFzcywgVEhFTiBtYWtlIHRoZSBlbGVtZW50IHZpc2libGVcbiAgICAgICAgICAgIC8vIG90aGVyd2lzZSBpZiB3ZSB0b2dnbGVkIHRoZSB2aXNpYmlsaXR5IGVhcmxpZXIgY3NzIGFuaW1hdGlvbnNcbiAgICAgICAgICAgIC8vIHdvdWxkIGZsaWNrZXIsIGFzIHRoZSBlbGVtZW50IGJlY29tZXMgdmlzaWJsZSBiZWZvcmUgdGhlIGFjdGl2ZSBhbmltYXRpb25cbiAgICAgICAgICAgIC8vIGNsYXNzIGlzIHNldCAoc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9waG9lbml4ZnJhbWV3b3JrL3Bob2VuaXhfbGl2ZV92aWV3L2lzc3Vlcy8zNDU2KVxuICAgICAgICAgICAgdGhpcy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIGluQ2xhc3NlcywgW10pXG4gICAgICAgICAgICAvLyBhZGRPclJlbW92ZUNsYXNzZXMgdXNlcyBhIHJlcXVlc3RBbmltYXRpb25GcmFtZSBpdHNlbGYsIHRoZXJlZm9yZSB3ZSBuZWVkIHRvIG1vdmUgdGhlIHB1dFN0aWNreVxuICAgICAgICAgICAgLy8gaW50byB0aGUgbmV4dCByZXF1ZXN0QW5pbWF0aW9uRnJhbWUuLi5cbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgICAgICBET00ucHV0U3RpY2t5KGVsLCBcInRvZ2dsZVwiLCBjdXJyZW50RWwgPT4gY3VycmVudEVsLnN0eWxlLmRpc3BsYXkgPSBzdGlja3lEaXNwbGF5KVxuICAgICAgICAgICAgICB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgaW5FbmRDbGFzc2VzLCBpblN0YXJ0Q2xhc3NlcylcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBsZXQgb25FbmQgPSAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIFtdLCBpbkNsYXNzZXMuY29uY2F0KGluRW5kQ2xhc3NlcykpXG4gICAgICAgICAgZWwuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJwaHg6c2hvdy1lbmRcIikpXG4gICAgICAgIH1cbiAgICAgICAgZWwuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJwaHg6c2hvdy1zdGFydFwiKSlcbiAgICAgICAgaWYoYmxvY2tpbmcgPT09IGZhbHNlKXtcbiAgICAgICAgICBvblN0YXJ0KClcbiAgICAgICAgICBzZXRUaW1lb3V0KG9uRW5kLCB0aW1lKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZpZXcudHJhbnNpdGlvbih0aW1lLCBvblN0YXJ0LCBvbkVuZClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZih0aGlzLmlzVmlzaWJsZShlbCkpe1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcInBoeDpoaWRlLXN0YXJ0XCIpKVxuICAgICAgICAgIERPTS5wdXRTdGlja3koZWwsIFwidG9nZ2xlXCIsIGN1cnJlbnRFbCA9PiBjdXJyZW50RWwuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiKVxuICAgICAgICAgIGVsLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwicGh4OmhpZGUtZW5kXCIpKVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgZWwuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJwaHg6c2hvdy1zdGFydFwiKSlcbiAgICAgICAgICBsZXQgc3RpY2t5RGlzcGxheSA9IGRpc3BsYXkgfHwgdGhpcy5kZWZhdWx0RGlzcGxheShlbClcbiAgICAgICAgICBET00ucHV0U3RpY2t5KGVsLCBcInRvZ2dsZVwiLCBjdXJyZW50RWwgPT4gY3VycmVudEVsLnN0eWxlLmRpc3BsYXkgPSBzdGlja3lEaXNwbGF5KVxuICAgICAgICAgIGVsLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwicGh4OnNob3ctZW5kXCIpKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICB0b2dnbGVDbGFzc2VzKGVsLCBjbGFzc2VzLCB0cmFuc2l0aW9uLCB0aW1lLCB2aWV3LCBibG9ja2luZyl7XG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICBsZXQgW3ByZXZBZGRzLCBwcmV2UmVtb3Zlc10gPSBET00uZ2V0U3RpY2t5KGVsLCBcImNsYXNzZXNcIiwgW1tdLCBbXV0pXG4gICAgICBsZXQgbmV3QWRkcyA9IGNsYXNzZXMuZmlsdGVyKG5hbWUgPT4gcHJldkFkZHMuaW5kZXhPZihuYW1lKSA8IDAgJiYgIWVsLmNsYXNzTGlzdC5jb250YWlucyhuYW1lKSlcbiAgICAgIGxldCBuZXdSZW1vdmVzID0gY2xhc3Nlcy5maWx0ZXIobmFtZSA9PiBwcmV2UmVtb3Zlcy5pbmRleE9mKG5hbWUpIDwgMCAmJiBlbC5jbGFzc0xpc3QuY29udGFpbnMobmFtZSkpXG4gICAgICB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgbmV3QWRkcywgbmV3UmVtb3ZlcywgdHJhbnNpdGlvbiwgdGltZSwgdmlldywgYmxvY2tpbmcpXG4gICAgfSlcbiAgfSxcblxuICB0b2dnbGVBdHRyKGVsLCBhdHRyLCB2YWwxLCB2YWwyKXtcbiAgICBpZihlbC5oYXNBdHRyaWJ1dGUoYXR0cikpe1xuICAgICAgaWYodmFsMiAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgLy8gdG9nZ2xlIGJldHdlZW4gdmFsMSBhbmQgdmFsMlxuICAgICAgICBpZihlbC5nZXRBdHRyaWJ1dGUoYXR0cikgPT09IHZhbDEpe1xuICAgICAgICAgIHRoaXMuc2V0T3JSZW1vdmVBdHRycyhlbCwgW1thdHRyLCB2YWwyXV0sIFtdKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc2V0T3JSZW1vdmVBdHRycyhlbCwgW1thdHRyLCB2YWwxXV0sIFtdKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyByZW1vdmUgYXR0clxuICAgICAgICB0aGlzLnNldE9yUmVtb3ZlQXR0cnMoZWwsIFtdLCBbYXR0cl0pXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0T3JSZW1vdmVBdHRycyhlbCwgW1thdHRyLCB2YWwxXV0sIFtdKVxuICAgIH1cbiAgfSxcblxuICBhZGRPclJlbW92ZUNsYXNzZXMoZWwsIGFkZHMsIHJlbW92ZXMsIHRyYW5zaXRpb24sIHRpbWUsIHZpZXcsIGJsb2NraW5nKXtcbiAgICB0aW1lID0gdGltZSB8fCBkZWZhdWx0X3RyYW5zaXRpb25fdGltZVxuICAgIGxldCBbdHJhbnNpdGlvblJ1biwgdHJhbnNpdGlvblN0YXJ0LCB0cmFuc2l0aW9uRW5kXSA9IHRyYW5zaXRpb24gfHwgW1tdLCBbXSwgW11dXG4gICAgaWYodHJhbnNpdGlvblJ1bi5sZW5ndGggPiAwKXtcbiAgICAgIGxldCBvblN0YXJ0ID0gKCkgPT4ge1xuICAgICAgICB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgdHJhbnNpdGlvblN0YXJ0LCBbXS5jb25jYXQodHJhbnNpdGlvblJ1bikuY29uY2F0KHRyYW5zaXRpb25FbmQpKVxuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgdHJhbnNpdGlvblJ1biwgW10pXG4gICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgdHJhbnNpdGlvbkVuZCwgdHJhbnNpdGlvblN0YXJ0KSlcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIGxldCBvbkRvbmUgPSAoKSA9PiB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgYWRkcy5jb25jYXQodHJhbnNpdGlvbkVuZCksIHJlbW92ZXMuY29uY2F0KHRyYW5zaXRpb25SdW4pLmNvbmNhdCh0cmFuc2l0aW9uU3RhcnQpKVxuICAgICAgaWYoYmxvY2tpbmcgPT09IGZhbHNlKXtcbiAgICAgICAgb25TdGFydCgpXG4gICAgICAgIHNldFRpbWVvdXQob25Eb25lLCB0aW1lKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmlldy50cmFuc2l0aW9uKHRpbWUsIG9uU3RhcnQsIG9uRG9uZSlcbiAgICAgIH1cbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgbGV0IFtwcmV2QWRkcywgcHJldlJlbW92ZXNdID0gRE9NLmdldFN0aWNreShlbCwgXCJjbGFzc2VzXCIsIFtbXSwgW11dKVxuICAgICAgbGV0IGtlZXBBZGRzID0gYWRkcy5maWx0ZXIobmFtZSA9PiBwcmV2QWRkcy5pbmRleE9mKG5hbWUpIDwgMCAmJiAhZWwuY2xhc3NMaXN0LmNvbnRhaW5zKG5hbWUpKVxuICAgICAgbGV0IGtlZXBSZW1vdmVzID0gcmVtb3Zlcy5maWx0ZXIobmFtZSA9PiBwcmV2UmVtb3Zlcy5pbmRleE9mKG5hbWUpIDwgMCAmJiBlbC5jbGFzc0xpc3QuY29udGFpbnMobmFtZSkpXG4gICAgICBsZXQgbmV3QWRkcyA9IHByZXZBZGRzLmZpbHRlcihuYW1lID0+IHJlbW92ZXMuaW5kZXhPZihuYW1lKSA8IDApLmNvbmNhdChrZWVwQWRkcylcbiAgICAgIGxldCBuZXdSZW1vdmVzID0gcHJldlJlbW92ZXMuZmlsdGVyKG5hbWUgPT4gYWRkcy5pbmRleE9mKG5hbWUpIDwgMCkuY29uY2F0KGtlZXBSZW1vdmVzKVxuXG4gICAgICBET00ucHV0U3RpY2t5KGVsLCBcImNsYXNzZXNcIiwgY3VycmVudEVsID0+IHtcbiAgICAgICAgY3VycmVudEVsLmNsYXNzTGlzdC5yZW1vdmUoLi4ubmV3UmVtb3ZlcylcbiAgICAgICAgY3VycmVudEVsLmNsYXNzTGlzdC5hZGQoLi4ubmV3QWRkcylcbiAgICAgICAgcmV0dXJuIFtuZXdBZGRzLCBuZXdSZW1vdmVzXVxuICAgICAgfSlcbiAgICB9KVxuICB9LFxuXG4gIHNldE9yUmVtb3ZlQXR0cnMoZWwsIHNldHMsIHJlbW92ZXMpe1xuICAgIGxldCBbcHJldlNldHMsIHByZXZSZW1vdmVzXSA9IERPTS5nZXRTdGlja3koZWwsIFwiYXR0cnNcIiwgW1tdLCBbXV0pXG5cbiAgICBsZXQgYWx0ZXJlZEF0dHJzID0gc2V0cy5tYXAoKFthdHRyLCBfdmFsXSkgPT4gYXR0cikuY29uY2F0KHJlbW92ZXMpXG4gICAgbGV0IG5ld1NldHMgPSBwcmV2U2V0cy5maWx0ZXIoKFthdHRyLCBfdmFsXSkgPT4gIWFsdGVyZWRBdHRycy5pbmNsdWRlcyhhdHRyKSkuY29uY2F0KHNldHMpXG4gICAgbGV0IG5ld1JlbW92ZXMgPSBwcmV2UmVtb3Zlcy5maWx0ZXIoKGF0dHIpID0+ICFhbHRlcmVkQXR0cnMuaW5jbHVkZXMoYXR0cikpLmNvbmNhdChyZW1vdmVzKVxuXG4gICAgRE9NLnB1dFN0aWNreShlbCwgXCJhdHRyc1wiLCBjdXJyZW50RWwgPT4ge1xuICAgICAgbmV3UmVtb3Zlcy5mb3JFYWNoKGF0dHIgPT4gY3VycmVudEVsLnJlbW92ZUF0dHJpYnV0ZShhdHRyKSlcbiAgICAgIG5ld1NldHMuZm9yRWFjaCgoW2F0dHIsIHZhbF0pID0+IGN1cnJlbnRFbC5zZXRBdHRyaWJ1dGUoYXR0ciwgdmFsKSlcbiAgICAgIHJldHVybiBbbmV3U2V0cywgbmV3UmVtb3Zlc11cbiAgICB9KVxuICB9LFxuXG4gIGhhc0FsbENsYXNzZXMoZWwsIGNsYXNzZXMpeyByZXR1cm4gY2xhc3Nlcy5ldmVyeShuYW1lID0+IGVsLmNsYXNzTGlzdC5jb250YWlucyhuYW1lKSkgfSxcblxuICBpc1RvZ2dsZWRPdXQoZWwsIG91dENsYXNzZXMpe1xuICAgIHJldHVybiAhdGhpcy5pc1Zpc2libGUoZWwpIHx8IHRoaXMuaGFzQWxsQ2xhc3NlcyhlbCwgb3V0Q2xhc3NlcylcbiAgfSxcblxuICBmaWx0ZXJUb0VscyhsaXZlU29ja2V0LCBzb3VyY2VFbCwge3RvfSl7XG4gICAgbGV0IGRlZmF1bHRRdWVyeSA9ICgpID0+IHtcbiAgICAgIGlmKHR5cGVvZih0bykgPT09IFwic3RyaW5nXCIpe1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCh0bylcbiAgICAgIH0gZWxzZSBpZih0by5jbG9zZXN0KXtcbiAgICAgICAgbGV0IHRvRWwgPSBzb3VyY2VFbC5jbG9zZXN0KHRvLmNsb3Nlc3QpXG4gICAgICAgIHJldHVybiB0b0VsID8gW3RvRWxdIDogW11cbiAgICAgIH0gZWxzZSBpZih0by5pbm5lcil7XG4gICAgICAgIHJldHVybiBzb3VyY2VFbC5xdWVyeVNlbGVjdG9yQWxsKHRvLmlubmVyKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdG8gPyBsaXZlU29ja2V0LmpzUXVlcnlTZWxlY3RvckFsbChzb3VyY2VFbCwgdG8sIGRlZmF1bHRRdWVyeSkgOiBbc291cmNlRWxdXG4gIH0sXG5cbiAgZGVmYXVsdERpc3BsYXkoZWwpe1xuICAgIHJldHVybiB7dHI6IFwidGFibGUtcm93XCIsIHRkOiBcInRhYmxlLWNlbGxcIn1bZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpXSB8fCBcImJsb2NrXCJcbiAgfSxcblxuICB0cmFuc2l0aW9uQ2xhc3Nlcyh2YWwpe1xuICAgIGlmKCF2YWwpeyByZXR1cm4gbnVsbCB9XG5cbiAgICBsZXQgW3RyYW5zLCB0U3RhcnQsIHRFbmRdID0gQXJyYXkuaXNBcnJheSh2YWwpID8gdmFsIDogW3ZhbC5zcGxpdChcIiBcIiksIFtdLCBbXV1cbiAgICB0cmFucyA9IEFycmF5LmlzQXJyYXkodHJhbnMpID8gdHJhbnMgOiB0cmFucy5zcGxpdChcIiBcIilcbiAgICB0U3RhcnQgPSBBcnJheS5pc0FycmF5KHRTdGFydCkgPyB0U3RhcnQgOiB0U3RhcnQuc3BsaXQoXCIgXCIpXG4gICAgdEVuZCA9IEFycmF5LmlzQXJyYXkodEVuZCkgPyB0RW5kIDogdEVuZC5zcGxpdChcIiBcIilcbiAgICByZXR1cm4gW3RyYW5zLCB0U3RhcnQsIHRFbmRdXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgSlNcbiIsICJpbXBvcnQgSlMgZnJvbSBcIi4vanNcIlxuaW1wb3J0IERPTSBmcm9tIFwiLi9kb21cIlxuXG5jb25zdCBIT09LX0lEID0gXCJob29rSWRcIlxuXG5sZXQgdmlld0hvb2tJRCA9IDFcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZpZXdIb29rIHtcbiAgc3RhdGljIG1ha2VJRCgpeyByZXR1cm4gdmlld0hvb2tJRCsrIH1cbiAgc3RhdGljIGVsZW1lbnRJRChlbCl7IHJldHVybiBET00ucHJpdmF0ZShlbCwgSE9PS19JRCkgfVxuXG4gIGNvbnN0cnVjdG9yKHZpZXcsIGVsLCBjYWxsYmFja3Mpe1xuICAgIHRoaXMuZWwgPSBlbFxuICAgIHRoaXMuX19hdHRhY2hWaWV3KHZpZXcpXG4gICAgdGhpcy5fX2NhbGxiYWNrcyA9IGNhbGxiYWNrc1xuICAgIHRoaXMuX19saXN0ZW5lcnMgPSBuZXcgU2V0KClcbiAgICB0aGlzLl9faXNEaXNjb25uZWN0ZWQgPSBmYWxzZVxuICAgIERPTS5wdXRQcml2YXRlKHRoaXMuZWwsIEhPT0tfSUQsIHRoaXMuY29uc3RydWN0b3IubWFrZUlEKCkpXG4gICAgZm9yKGxldCBrZXkgaW4gdGhpcy5fX2NhbGxiYWNrcyl7IHRoaXNba2V5XSA9IHRoaXMuX19jYWxsYmFja3Nba2V5XSB9XG4gIH1cblxuICBfX2F0dGFjaFZpZXcodmlldyl7XG4gICAgaWYodmlldyl7XG4gICAgICB0aGlzLl9fdmlldyA9ICgpID0+IHZpZXdcbiAgICAgIHRoaXMubGl2ZVNvY2tldCA9IHZpZXcubGl2ZVNvY2tldFxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9fdmlldyA9ICgpID0+IHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBob29rIG5vdCB5ZXQgYXR0YWNoZWQgdG8gYSBsaXZlIHZpZXc6ICR7dGhpcy5lbC5vdXRlckhUTUx9YClcbiAgICAgIH1cbiAgICAgIHRoaXMubGl2ZVNvY2tldCA9IG51bGxcbiAgICB9XG4gIH1cblxuICBfX21vdW50ZWQoKXsgdGhpcy5tb3VudGVkICYmIHRoaXMubW91bnRlZCgpIH1cbiAgX191cGRhdGVkKCl7IHRoaXMudXBkYXRlZCAmJiB0aGlzLnVwZGF0ZWQoKSB9XG4gIF9fYmVmb3JlVXBkYXRlKCl7IHRoaXMuYmVmb3JlVXBkYXRlICYmIHRoaXMuYmVmb3JlVXBkYXRlKCkgfVxuICBfX2Rlc3Ryb3llZCgpe1xuICAgIHRoaXMuZGVzdHJveWVkICYmIHRoaXMuZGVzdHJveWVkKClcbiAgICBET00uZGVsZXRlUHJpdmF0ZSh0aGlzLmVsLCBIT09LX0lEKSAvLyBodHRwczovL2dpdGh1Yi5jb20vcGhvZW5peGZyYW1ld29yay9waG9lbml4X2xpdmVfdmlldy9pc3N1ZXMvMzQ5NlxuICB9XG4gIF9fcmVjb25uZWN0ZWQoKXtcbiAgICBpZih0aGlzLl9faXNEaXNjb25uZWN0ZWQpe1xuICAgICAgdGhpcy5fX2lzRGlzY29ubmVjdGVkID0gZmFsc2VcbiAgICAgIHRoaXMucmVjb25uZWN0ZWQgJiYgdGhpcy5yZWNvbm5lY3RlZCgpXG4gICAgfVxuICB9XG4gIF9fZGlzY29ubmVjdGVkKCl7XG4gICAgdGhpcy5fX2lzRGlzY29ubmVjdGVkID0gdHJ1ZVxuICAgIHRoaXMuZGlzY29ubmVjdGVkICYmIHRoaXMuZGlzY29ubmVjdGVkKClcbiAgfVxuXG4gIC8qKlxuICAgKiBCaW5kcyB0aGUgaG9vayB0byBKUyBjb21tYW5kcy5cbiAgICpcbiAgICogQHBhcmFtIHtWaWV3SG9va30gaG9vayAtIFRoZSBWaWV3SG9vayBpbnN0YW5jZSB0byBiaW5kLlxuICAgKlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBBbiBvYmplY3Qgd2l0aCBtZXRob2RzIHRvIG1hbmlwdWxhdGUgdGhlIERPTSBhbmQgZXhlY3V0ZSBKYXZhU2NyaXB0LlxuICAgKi9cbiAganMoKXtcbiAgICBsZXQgaG9vayA9IHRoaXNcblxuICAgIHJldHVybiB7XG4gICAgICAvKipcbiAgICAgICAqIEV4ZWN1dGVzIGVuY29kZWQgSmF2YVNjcmlwdCBpbiB0aGUgY29udGV4dCBvZiB0aGUgaG9vayBlbGVtZW50LlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBlbmNvZGVkSlMgLSBUaGUgZW5jb2RlZCBKYXZhU2NyaXB0IHN0cmluZyB0byBleGVjdXRlLlxuICAgICAgICovXG4gICAgICBleGVjKGVuY29kZWRKUyl7XG4gICAgICAgIGhvb2suX192aWV3KCkubGl2ZVNvY2tldC5leGVjSlMoaG9vay5lbCwgZW5jb2RlZEpTLCBcImhvb2tcIilcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogU2hvd3MgYW4gZWxlbWVudC5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCAtIFRoZSBlbGVtZW50IHRvIHNob3cuXG4gICAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdHM9e31dIC0gT3B0aW9uYWwgc2V0dGluZ3MuXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdHMuZGlzcGxheV0gLSBUaGUgQ1NTIGRpc3BsYXkgdmFsdWUgdG8gc2V0LiBEZWZhdWx0cyBcImJsb2NrXCIuXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdHMudHJhbnNpdGlvbl0gLSBUaGUgQ1NTIHRyYW5zaXRpb24gY2xhc3NlcyB0byBzZXQgd2hlbiBzaG93aW5nLlxuICAgICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRzLnRpbWVdIC0gVGhlIHRyYW5zaXRpb24gZHVyYXRpb24gaW4gbWlsbGlzZWNvbmRzLiBEZWZhdWx0cyAyMDAuXG4gICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRzLmJsb2NraW5nXSAtIFRoZSBib29sZWFuIGZsYWcgdG8gYmxvY2sgdGhlIFVJIGR1cmluZyB0aGUgdHJhbnNpdGlvbi5cbiAgICAgICAqICBEZWZhdWx0cyBgdHJ1ZWAuXG4gICAgICAgKi9cbiAgICAgIHNob3coZWwsIG9wdHMgPSB7fSl7XG4gICAgICAgIGxldCBvd25lciA9IGhvb2suX192aWV3KCkubGl2ZVNvY2tldC5vd25lcihlbClcbiAgICAgICAgSlMuc2hvdyhcImhvb2tcIiwgb3duZXIsIGVsLCBvcHRzLmRpc3BsYXksIG9wdHMudHJhbnNpdGlvbiwgb3B0cy50aW1lLCBvcHRzLmJsb2NraW5nKVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBIaWRlcyBhbiBlbGVtZW50LlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIC0gVGhlIGVsZW1lbnQgdG8gaGlkZS5cbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0cz17fV0gLSBPcHRpb25hbCBzZXR0aW5ncy5cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0cy50cmFuc2l0aW9uXSAtIFRoZSBDU1MgdHJhbnNpdGlvbiBjbGFzc2VzIHRvIHNldCB3aGVuIGhpZGluZy5cbiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0cy50aW1lXSAtIFRoZSB0cmFuc2l0aW9uIGR1cmF0aW9uIGluIG1pbGxpc2Vjb25kcy4gRGVmYXVsdHMgMjAwLlxuICAgICAgICogQHBhcmFtIHtib29sZWFufSBbb3B0cy5ibG9ja2luZ10gLSBUaGUgYm9vbGVhbiBmbGFnIHRvIGJsb2NrIHRoZSBVSSBkdXJpbmcgdGhlIHRyYW5zaXRpb24uXG4gICAgICAgKiAgIERlZmF1bHRzIGB0cnVlYC5cbiAgICAgICAqL1xuICAgICAgaGlkZShlbCwgb3B0cyA9IHt9KXtcbiAgICAgICAgbGV0IG93bmVyID0gaG9vay5fX3ZpZXcoKS5saXZlU29ja2V0Lm93bmVyKGVsKVxuICAgICAgICBKUy5oaWRlKFwiaG9va1wiLCBvd25lciwgZWwsIG51bGwsIG9wdHMudHJhbnNpdGlvbiwgb3B0cy50aW1lLCBvcHRzLmJsb2NraW5nKVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBUb2dnbGVzIHRoZSB2aXNpYmlsaXR5IG9mIGFuIGVsZW1lbnQuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgLSBUaGUgZWxlbWVudCB0byB0b2dnbGUuXG4gICAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdHM9e31dIC0gT3B0aW9uYWwgc2V0dGluZ3MuXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdHMuZGlzcGxheV0gLSBUaGUgQ1NTIGRpc3BsYXkgdmFsdWUgdG8gc2V0LiBEZWZhdWx0cyBcImJsb2NrXCIuXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdHMuaW5dIC0gVGhlIENTUyB0cmFuc2l0aW9uIGNsYXNzZXMgZm9yIHNob3dpbmcuXG4gICAgICAgKiAgIEFjY2VwdHMgZWl0aGVyIHRoZSBzdHJpbmcgb2YgY2xhc3NlcyB0byBhcHBseSB3aGVuIHRvZ2dsaW5nIGluLCBvclxuICAgICAgICogICBhIDMtdHVwbGUgY29udGFpbmluZyB0aGUgdHJhbnNpdGlvbiBjbGFzcywgdGhlIGNsYXNzIHRvIGFwcGx5XG4gICAgICAgKiAgIHRvIHN0YXJ0IHRoZSB0cmFuc2l0aW9uLCBhbmQgdGhlIGVuZGluZyB0cmFuc2l0aW9uIGNsYXNzLCBzdWNoIGFzOlxuICAgICAgICpcbiAgICAgICAqICAgICAgIFtcImVhc2Utb3V0IGR1cmF0aW9uLTMwMFwiLCBcIm9wYWNpdHktMFwiLCBcIm9wYWNpdHktMTAwXCJdXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRzLm91dF0gLSBUaGUgQ1NTIHRyYW5zaXRpb24gY2xhc3NlcyBmb3IgaGlkaW5nLlxuICAgICAgICogICBBY2NlcHRzIGVpdGhlciBzdHJpbmcgb2YgY2xhc3NlcyB0byBhcHBseSB3aGVuIHRvZ2dsaW5nIG91dCwgb3JcbiAgICAgICAqICAgYSAzLXR1cGxlIGNvbnRhaW5pbmcgdGhlIHRyYW5zaXRpb24gY2xhc3MsIHRoZSBjbGFzcyB0byBhcHBseVxuICAgICAgICogICB0byBzdGFydCB0aGUgdHJhbnNpdGlvbiwgYW5kIHRoZSBlbmRpbmcgdHJhbnNpdGlvbiBjbGFzcywgc3VjaCBhczpcbiAgICAgICAqXG4gICAgICAgKiAgICAgICBbXCJlYXNlLW91dCBkdXJhdGlvbi0zMDBcIiwgXCJvcGFjaXR5LTEwMFwiLCBcIm9wYWNpdHktMFwiXVxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0cy50aW1lXSAtIFRoZSB0cmFuc2l0aW9uIGR1cmF0aW9uIGluIG1pbGxpc2Vjb25kcy5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRzLmJsb2NraW5nXSAtIFRoZSBib29sZWFuIGZsYWcgdG8gYmxvY2sgdGhlIFVJIGR1cmluZyB0aGUgdHJhbnNpdGlvbi5cbiAgICAgICAqICAgRGVmYXVsdHMgYHRydWVgLlxuICAgICAgICovXG4gICAgICB0b2dnbGUoZWwsIG9wdHMgPSB7fSl7XG4gICAgICAgIGxldCBvd25lciA9IGhvb2suX192aWV3KCkubGl2ZVNvY2tldC5vd25lcihlbClcbiAgICAgICAgb3B0cy5pbiA9IEpTLnRyYW5zaXRpb25DbGFzc2VzKG9wdHMuaW4pXG4gICAgICAgIG9wdHMub3V0ID0gSlMudHJhbnNpdGlvbkNsYXNzZXMob3B0cy5vdXQpXG4gICAgICAgIEpTLnRvZ2dsZShcImhvb2tcIiwgb3duZXIsIGVsLCBvcHRzLmRpc3BsYXksIG9wdHMuaW4sIG9wdHMub3V0LCBvcHRzLnRpbWUsIG9wdHMuYmxvY2tpbmcpXG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIEFkZHMgQ1NTIGNsYXNzZXMgdG8gYW4gZWxlbWVudC5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCAtIFRoZSBlbGVtZW50IHRvIGFkZCBjbGFzc2VzIHRvLlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd8c3RyaW5nW119IG5hbWVzIC0gVGhlIGNsYXNzIG5hbWUocykgdG8gYWRkLlxuICAgICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRzPXt9XSAtIE9wdGlvbmFsIHNldHRpbmdzLlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRzLnRyYW5zaXRpb25dIC0gVGhlIENTUyB0cmFuc2l0aW9uIHByb3BlcnR5IHRvIHNldC5cbiAgICAgICAqICAgQWNjZXB0cyBhIHN0cmluZyBvZiBjbGFzc2VzIHRvIGFwcGx5IHdoZW4gYWRkaW5nIGNsYXNzZXMgb3JcbiAgICAgICAqICAgYSAzLXR1cGxlIGNvbnRhaW5pbmcgdGhlIHRyYW5zaXRpb24gY2xhc3MsIHRoZSBjbGFzcyB0byBhcHBseVxuICAgICAgICogICB0byBzdGFydCB0aGUgdHJhbnNpdGlvbiwgYW5kIHRoZSBlbmRpbmcgdHJhbnNpdGlvbiBjbGFzcywgc3VjaCBhczpcbiAgICAgICAqXG4gICAgICAgKiAgICAgICBbXCJlYXNlLW91dCBkdXJhdGlvbi0zMDBcIiwgXCJvcGFjaXR5LTBcIiwgXCJvcGFjaXR5LTEwMFwiXVxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0cy50aW1lXSAtIFRoZSB0cmFuc2l0aW9uIGR1cmF0aW9uIGluIG1pbGxpc2Vjb25kcy5cbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdHMuYmxvY2tpbmddIC0gVGhlIGJvb2xlYW4gZmxhZyB0byBibG9jayB0aGUgVUkgZHVyaW5nIHRoZSB0cmFuc2l0aW9uLlxuICAgICAgICogICBEZWZhdWx0cyBgdHJ1ZWAuXG4gICAgICAgKi9cbiAgICAgIGFkZENsYXNzKGVsLCBuYW1lcywgb3B0cyA9IHt9KXtcbiAgICAgICAgbmFtZXMgPSBBcnJheS5pc0FycmF5KG5hbWVzKSA/IG5hbWVzIDogbmFtZXMuc3BsaXQoXCIgXCIpXG4gICAgICAgIGxldCBvd25lciA9IGhvb2suX192aWV3KCkubGl2ZVNvY2tldC5vd25lcihlbClcbiAgICAgICAgSlMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCBuYW1lcywgW10sIG9wdHMudHJhbnNpdGlvbiwgb3B0cy50aW1lLCBvd25lciwgb3B0cy5ibG9ja2luZylcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogUmVtb3ZlcyBDU1MgY2xhc3NlcyBmcm9tIGFuIGVsZW1lbnQuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgLSBUaGUgZWxlbWVudCB0byByZW1vdmUgY2xhc3NlcyBmcm9tLlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd8c3RyaW5nW119IG5hbWVzIC0gVGhlIGNsYXNzIG5hbWUocykgdG8gcmVtb3ZlLlxuICAgICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRzPXt9XSAtIE9wdGlvbmFsIHNldHRpbmdzLlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRzLnRyYW5zaXRpb25dIC0gVGhlIENTUyB0cmFuc2l0aW9uIGNsYXNzZXMgdG8gc2V0LlxuICAgICAgICogICBBY2NlcHRzIGEgc3RyaW5nIG9mIGNsYXNzZXMgdG8gYXBwbHkgd2hlbiByZW1vdmluZyBjbGFzc2VzIG9yXG4gICAgICAgKiAgIGEgMy10dXBsZSBjb250YWluaW5nIHRoZSB0cmFuc2l0aW9uIGNsYXNzLCB0aGUgY2xhc3MgdG8gYXBwbHlcbiAgICAgICAqICAgdG8gc3RhcnQgdGhlIHRyYW5zaXRpb24sIGFuZCB0aGUgZW5kaW5nIHRyYW5zaXRpb24gY2xhc3MsIHN1Y2ggYXM6XG4gICAgICAgKlxuICAgICAgICogICAgICAgW1wiZWFzZS1vdXQgZHVyYXRpb24tMzAwXCIsIFwib3BhY2l0eS0xMDBcIiwgXCJvcGFjaXR5LTBcIl1cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdHMudGltZV0gLSBUaGUgdHJhbnNpdGlvbiBkdXJhdGlvbiBpbiBtaWxsaXNlY29uZHMuXG4gICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRzLmJsb2NraW5nXSAtIFRoZSBib29sZWFuIGZsYWcgdG8gYmxvY2sgdGhlIFVJIGR1cmluZyB0aGUgdHJhbnNpdGlvbi5cbiAgICAgICAqICAgRGVmYXVsdHMgYHRydWVgLlxuICAgICAgICovXG4gICAgICByZW1vdmVDbGFzcyhlbCwgbmFtZXMsIG9wdHMgPSB7fSl7XG4gICAgICAgIG9wdHMudHJhbnNpdGlvbiA9IEpTLnRyYW5zaXRpb25DbGFzc2VzKG9wdHMudHJhbnNpdGlvbilcbiAgICAgICAgbmFtZXMgPSBBcnJheS5pc0FycmF5KG5hbWVzKSA/IG5hbWVzIDogbmFtZXMuc3BsaXQoXCIgXCIpXG4gICAgICAgIGxldCBvd25lciA9IGhvb2suX192aWV3KCkubGl2ZVNvY2tldC5vd25lcihlbClcbiAgICAgICAgSlMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCBbXSwgbmFtZXMsIG9wdHMudHJhbnNpdGlvbiwgb3B0cy50aW1lLCBvd25lciwgb3B0cy5ibG9ja2luZylcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogVG9nZ2xlcyBDU1MgY2xhc3NlcyBvbiBhbiBlbGVtZW50LlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIC0gVGhlIGVsZW1lbnQgdG8gdG9nZ2xlIGNsYXNzZXMgb24uXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ3xzdHJpbmdbXX0gbmFtZXMgLSBUaGUgY2xhc3MgbmFtZShzKSB0byB0b2dnbGUuXG4gICAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdHM9e31dIC0gT3B0aW9uYWwgc2V0dGluZ3MuXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdHMudHJhbnNpdGlvbl0gLSBUaGUgQ1NTIHRyYW5zaXRpb24gY2xhc3NlcyB0byBzZXQuXG4gICAgICAgKiAgIEFjY2VwdHMgYSBzdHJpbmcgb2YgY2xhc3NlcyB0byBhcHBseSB3aGVuIHRvZ2dsaW5nIGNsYXNzZXMgb3JcbiAgICAgICAqICAgYSAzLXR1cGxlIGNvbnRhaW5pbmcgdGhlIHRyYW5zaXRpb24gY2xhc3MsIHRoZSBjbGFzcyB0byBhcHBseVxuICAgICAgICogICB0byBzdGFydCB0aGUgdHJhbnNpdGlvbiwgYW5kIHRoZSBlbmRpbmcgdHJhbnNpdGlvbiBjbGFzcywgc3VjaCBhczpcbiAgICAgICAqXG4gICAgICAgKiAgICAgICBbXCJlYXNlLW91dCBkdXJhdGlvbi0zMDBcIiwgXCJvcGFjaXR5LTEwMFwiLCBcIm9wYWNpdHktMFwiXVxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0cy50aW1lXSAtIFRoZSB0cmFuc2l0aW9uIGR1cmF0aW9uIGluIG1pbGxpc2Vjb25kcy5cbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdHMuYmxvY2tpbmddIC0gVGhlIGJvb2xlYW4gZmxhZyB0byBibG9jayB0aGUgVUkgZHVyaW5nIHRoZSB0cmFuc2l0aW9uLlxuICAgICAgICogICBEZWZhdWx0cyBgdHJ1ZWAuXG4gICAgICAgKi9cbiAgICAgIHRvZ2dsZUNsYXNzKGVsLCBuYW1lcywgb3B0cyA9IHt9KXtcbiAgICAgICAgb3B0cy50cmFuc2l0aW9uID0gSlMudHJhbnNpdGlvbkNsYXNzZXMob3B0cy50cmFuc2l0aW9uKVxuICAgICAgICBuYW1lcyA9IEFycmF5LmlzQXJyYXkobmFtZXMpID8gbmFtZXMgOiBuYW1lcy5zcGxpdChcIiBcIilcbiAgICAgICAgbGV0IG93bmVyID0gaG9vay5fX3ZpZXcoKS5saXZlU29ja2V0Lm93bmVyKGVsKVxuICAgICAgICBKUy50b2dnbGVDbGFzc2VzKGVsLCBuYW1lcywgb3B0cy50cmFuc2l0aW9uLCBvcHRzLnRpbWUsIG93bmVyLCBvcHRzLmJsb2NraW5nKVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBBcHBsaWVzIGEgQ1NTIHRyYW5zaXRpb24gdG8gYW4gZWxlbWVudC5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCAtIFRoZSBlbGVtZW50IHRvIGFwcGx5IHRoZSB0cmFuc2l0aW9uIHRvLlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd8c3RyaW5nW119IHRyYW5zaXRpb24gLSBUaGUgdHJhbnNpdGlvbiBjbGFzcyhlcykgdG8gYXBwbHkuXG4gICAgICAgKiAgIEFjY2VwdHMgYSBzdHJpbmcgb2YgY2xhc3NlcyB0byBhcHBseSB3aGVuIHRyYW5zaXRpb25pbmcgb3JcbiAgICAgICAqICAgYSAzLXR1cGxlIGNvbnRhaW5pbmcgdGhlIHRyYW5zaXRpb24gY2xhc3MsIHRoZSBjbGFzcyB0byBhcHBseVxuICAgICAgICogICB0byBzdGFydCB0aGUgdHJhbnNpdGlvbiwgYW5kIHRoZSBlbmRpbmcgdHJhbnNpdGlvbiBjbGFzcywgc3VjaCBhczpcbiAgICAgICAqXG4gICAgICAgKiAgICAgICBbXCJlYXNlLW91dCBkdXJhdGlvbi0zMDBcIiwgXCJvcGFjaXR5LTEwMFwiLCBcIm9wYWNpdHktMFwiXVxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0cz17fV0gLSBPcHRpb25hbCBzZXR0aW5ncy5cbiAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0cy50aW1lXSAtIFRoZSB0cmFuc2l0aW9uIGR1cmF0aW9uIGluIG1pbGxpc2Vjb25kcy5cbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdHMuYmxvY2tpbmddIC0gVGhlIGJvb2xlYW4gZmxhZyB0byBibG9jayB0aGUgVUkgZHVyaW5nIHRoZSB0cmFuc2l0aW9uLlxuICAgICAgICogICBEZWZhdWx0cyBgdHJ1ZWAuXG4gICAgICAgKi9cbiAgICAgIHRyYW5zaXRpb24oZWwsIHRyYW5zaXRpb24sIG9wdHMgPSB7fSl7XG4gICAgICAgIGxldCBvd25lciA9IGhvb2suX192aWV3KCkubGl2ZVNvY2tldC5vd25lcihlbClcbiAgICAgICAgSlMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCBbXSwgW10sIEpTLnRyYW5zaXRpb25DbGFzc2VzKHRyYW5zaXRpb24pLCBvcHRzLnRpbWUsIG93bmVyLCBvcHRzLmJsb2NraW5nKVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBTZXRzIGFuIGF0dHJpYnV0ZSBvbiBhbiBlbGVtZW50LlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIC0gVGhlIGVsZW1lbnQgdG8gc2V0IHRoZSBhdHRyaWJ1dGUgb24uXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gYXR0ciAtIFRoZSBhdHRyaWJ1dGUgbmFtZSB0byBzZXQuXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsIC0gVGhlIHZhbHVlIHRvIHNldCBmb3IgdGhlIGF0dHJpYnV0ZS5cbiAgICAgICAqL1xuICAgICAgc2V0QXR0cmlidXRlKGVsLCBhdHRyLCB2YWwpeyBKUy5zZXRPclJlbW92ZUF0dHJzKGVsLCBbW2F0dHIsIHZhbF1dLCBbXSkgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBSZW1vdmVzIGFuIGF0dHJpYnV0ZSBmcm9tIGFuIGVsZW1lbnQuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgLSBUaGUgZWxlbWVudCB0byByZW1vdmUgdGhlIGF0dHJpYnV0ZSBmcm9tLlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGF0dHIgLSBUaGUgYXR0cmlidXRlIG5hbWUgdG8gcmVtb3ZlLlxuICAgICAgICovXG4gICAgICByZW1vdmVBdHRyaWJ1dGUoZWwsIGF0dHIpeyBKUy5zZXRPclJlbW92ZUF0dHJzKGVsLCBbXSwgW2F0dHJdKSB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFRvZ2dsZXMgYW4gYXR0cmlidXRlIG9uIGFuIGVsZW1lbnQgYmV0d2VlbiB0d28gdmFsdWVzLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIC0gVGhlIGVsZW1lbnQgdG8gdG9nZ2xlIHRoZSBhdHRyaWJ1dGUgb24uXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gYXR0ciAtIFRoZSBhdHRyaWJ1dGUgbmFtZSB0byB0b2dnbGUuXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsMSAtIFRoZSBmaXJzdCB2YWx1ZSB0byB0b2dnbGUgYmV0d2Vlbi5cbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWwyIC0gVGhlIHNlY29uZCB2YWx1ZSB0byB0b2dnbGUgYmV0d2Vlbi5cbiAgICAgICAqL1xuICAgICAgdG9nZ2xlQXR0cmlidXRlKGVsLCBhdHRyLCB2YWwxLCB2YWwyKXsgSlMudG9nZ2xlQXR0cihlbCwgYXR0ciwgdmFsMSwgdmFsMikgfSxcbiAgICB9XG4gIH1cblxuICBwdXNoRXZlbnQoZXZlbnQsIHBheWxvYWQgPSB7fSwgb25SZXBseSl7XG4gICAgaWYob25SZXBseSA9PT0gdW5kZWZpbmVkKXtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgcmVmID0gdGhpcy5fX3ZpZXcoKS5wdXNoSG9va0V2ZW50KHRoaXMuZWwsIG51bGwsIGV2ZW50LCBwYXlsb2FkLCAocmVwbHksIF9yZWYpID0+IHJlc29sdmUocmVwbHkpKVxuICAgICAgICAgIGlmKHJlZiA9PT0gZmFsc2Upe1xuICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihcInVuYWJsZSB0byBwdXNoIGhvb2sgZXZlbnQuIExpdmVWaWV3IG5vdCBjb25uZWN0ZWRcIikpXG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcil7XG4gICAgICAgICAgcmVqZWN0KGVycm9yKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fX3ZpZXcoKS5wdXNoSG9va0V2ZW50KHRoaXMuZWwsIG51bGwsIGV2ZW50LCBwYXlsb2FkLCBvblJlcGx5KVxuICB9XG5cbiAgcHVzaEV2ZW50VG8ocGh4VGFyZ2V0LCBldmVudCwgcGF5bG9hZCA9IHt9LCBvblJlcGx5KXtcbiAgICBpZihvblJlcGx5ID09PSB1bmRlZmluZWQpe1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB0aGlzLl9fdmlldygpLndpdGhpblRhcmdldHMocGh4VGFyZ2V0LCAodmlldywgdGFyZ2V0Q3R4KSA9PiB7XG4gICAgICAgICAgICBjb25zdCByZWYgPSB2aWV3LnB1c2hIb29rRXZlbnQodGhpcy5lbCwgdGFyZ2V0Q3R4LCBldmVudCwgcGF5bG9hZCwgKHJlcGx5LCBfcmVmKSA9PiByZXNvbHZlKHJlcGx5KSlcbiAgICAgICAgICAgIGlmKHJlZiA9PT0gZmFsc2Upe1xuICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKFwidW5hYmxlIHRvIHB1c2ggaG9vayBldmVudC4gTGl2ZVZpZXcgbm90IGNvbm5lY3RlZFwiKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9IGNhdGNoIChlcnJvcil7XG4gICAgICAgICAgcmVqZWN0KGVycm9yKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fX3ZpZXcoKS53aXRoaW5UYXJnZXRzKHBoeFRhcmdldCwgKHZpZXcsIHRhcmdldEN0eCkgPT4ge1xuICAgICAgcmV0dXJuIHZpZXcucHVzaEhvb2tFdmVudCh0aGlzLmVsLCB0YXJnZXRDdHgsIGV2ZW50LCBwYXlsb2FkLCBvblJlcGx5KVxuICAgIH0pXG4gIH1cblxuICBoYW5kbGVFdmVudChldmVudCwgY2FsbGJhY2spe1xuICAgIGxldCBjYWxsYmFja1JlZiA9IChjdXN0b21FdmVudCwgYnlwYXNzKSA9PiBieXBhc3MgPyBldmVudCA6IGNhbGxiYWNrKGN1c3RvbUV2ZW50LmRldGFpbClcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihgcGh4OiR7ZXZlbnR9YCwgY2FsbGJhY2tSZWYpXG4gICAgdGhpcy5fX2xpc3RlbmVycy5hZGQoY2FsbGJhY2tSZWYpXG4gICAgcmV0dXJuIGNhbGxiYWNrUmVmXG4gIH1cblxuICByZW1vdmVIYW5kbGVFdmVudChjYWxsYmFja1JlZil7XG4gICAgbGV0IGV2ZW50ID0gY2FsbGJhY2tSZWYobnVsbCwgdHJ1ZSlcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihgcGh4OiR7ZXZlbnR9YCwgY2FsbGJhY2tSZWYpXG4gICAgdGhpcy5fX2xpc3RlbmVycy5kZWxldGUoY2FsbGJhY2tSZWYpXG4gIH1cblxuICB1cGxvYWQobmFtZSwgZmlsZXMpe1xuICAgIHJldHVybiB0aGlzLl9fdmlldygpLmRpc3BhdGNoVXBsb2FkcyhudWxsLCBuYW1lLCBmaWxlcylcbiAgfVxuXG4gIHVwbG9hZFRvKHBoeFRhcmdldCwgbmFtZSwgZmlsZXMpe1xuICAgIHJldHVybiB0aGlzLl9fdmlldygpLndpdGhpblRhcmdldHMocGh4VGFyZ2V0LCAodmlldywgdGFyZ2V0Q3R4KSA9PiB7XG4gICAgICB2aWV3LmRpc3BhdGNoVXBsb2Fkcyh0YXJnZXRDdHgsIG5hbWUsIGZpbGVzKVxuICAgIH0pXG4gIH1cblxuICBfX2NsZWFudXBfXygpe1xuICAgIHRoaXMuX19saXN0ZW5lcnMuZm9yRWFjaChjYWxsYmFja1JlZiA9PiB0aGlzLnJlbW92ZUhhbmRsZUV2ZW50KGNhbGxiYWNrUmVmKSlcbiAgfVxufVxuIiwgImltcG9ydCB7XG4gIEJFRk9SRV9VTkxPQURfTE9BREVSX1RJTUVPVVQsXG4gIENIRUNLQUJMRV9JTlBVVFMsXG4gIENPTlNFQ1VUSVZFX1JFTE9BRFMsXG4gIFBIWF9BVVRPX1JFQ09WRVIsXG4gIFBIWF9DT01QT05FTlQsXG4gIFBIWF9DT05ORUNURURfQ0xBU1MsXG4gIFBIWF9ESVNBQkxFX1dJVEgsXG4gIFBIWF9ESVNBQkxFX1dJVEhfUkVTVE9SRSxcbiAgUEhYX0RJU0FCTEVELFxuICBQSFhfTE9BRElOR19DTEFTUyxcbiAgUEhYX0VSUk9SX0NMQVNTLFxuICBQSFhfQ0xJRU5UX0VSUk9SX0NMQVNTLFxuICBQSFhfU0VSVkVSX0VSUk9SX0NMQVNTLFxuICBQSFhfSEFTX0ZPQ1VTRUQsXG4gIFBIWF9IQVNfU1VCTUlUVEVELFxuICBQSFhfSE9PSyxcbiAgUEhYX1BBUkVOVF9JRCxcbiAgUEhYX1BST0dSRVNTLFxuICBQSFhfUkVBRE9OTFksXG4gIFBIWF9SRUZfTE9BRElORyxcbiAgUEhYX1JFRl9TUkMsXG4gIFBIWF9SRUZfTE9DSyxcbiAgUEhYX1JPT1RfSUQsXG4gIFBIWF9TRVNTSU9OLFxuICBQSFhfU1RBVElDLFxuICBQSFhfVFJBQ0tfU1RBVElDLFxuICBQSFhfVFJBQ0tfVVBMT0FEUyxcbiAgUEhYX1VQREFURSxcbiAgUEhYX1VQTE9BRF9SRUYsXG4gIFBIWF9WSUVXX1NFTEVDVE9SLFxuICBQSFhfTUFJTixcbiAgUEhYX01PVU5URUQsXG4gIFBVU0hfVElNRU9VVCxcbiAgUEhYX1ZJRVdQT1JUX1RPUCxcbiAgUEhYX1ZJRVdQT1JUX0JPVFRPTSxcbiAgTUFYX0NISUxEX0pPSU5fQVRURU1QVFNcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuaW1wb3J0IHtcbiAgY2xvbmUsXG4gIGNsb3Nlc3RQaHhCaW5kaW5nLFxuICBpc0VtcHR5LFxuICBpc0VxdWFsT2JqLFxuICBsb2dFcnJvcixcbiAgbWF5YmUsXG4gIGlzQ2lkLFxufSBmcm9tIFwiLi91dGlsc1wiXG5cbmltcG9ydCBCcm93c2VyIGZyb20gXCIuL2Jyb3dzZXJcIlxuaW1wb3J0IERPTSBmcm9tIFwiLi9kb21cIlxuaW1wb3J0IEVsZW1lbnRSZWYgZnJvbSBcIi4vZWxlbWVudF9yZWZcIlxuaW1wb3J0IERPTVBhdGNoIGZyb20gXCIuL2RvbV9wYXRjaFwiXG5pbXBvcnQgTGl2ZVVwbG9hZGVyIGZyb20gXCIuL2xpdmVfdXBsb2FkZXJcIlxuaW1wb3J0IFJlbmRlcmVkIGZyb20gXCIuL3JlbmRlcmVkXCJcbmltcG9ydCBWaWV3SG9vayBmcm9tIFwiLi92aWV3X2hvb2tcIlxuaW1wb3J0IEpTIGZyb20gXCIuL2pzXCJcblxuZXhwb3J0IGxldCBwcmVwZW5kRm9ybURhdGFLZXkgPSAoa2V5LCBwcmVmaXgpID0+IHtcbiAgbGV0IGlzQXJyYXkgPSBrZXkuZW5kc1dpdGgoXCJbXVwiKVxuICAvLyBSZW1vdmUgdGhlIFwiW11cIiBpZiBpdCdzIGFuIGFycmF5XG4gIGxldCBiYXNlS2V5ID0gaXNBcnJheSA/IGtleS5zbGljZSgwLCAtMikgOiBrZXlcbiAgLy8gUmVwbGFjZSBsYXN0IG9jY3VycmVuY2Ugb2Yga2V5IGJlZm9yZSBhIGNsb3NpbmcgYnJhY2tldCBvciB0aGUgZW5kIHdpdGgga2V5IHBsdXMgc3VmZml4XG4gIGJhc2VLZXkgPSBiYXNlS2V5LnJlcGxhY2UoLyhbXlxcW1xcXV0rKShcXF0/JCkvLCBgJHtwcmVmaXh9JDEkMmApXG4gIC8vIEFkZCBiYWNrIHRoZSBcIltdXCIgaWYgaXQgd2FzIGFuIGFycmF5XG4gIGlmKGlzQXJyYXkpeyBiYXNlS2V5ICs9IFwiW11cIiB9XG4gIHJldHVybiBiYXNlS2V5XG59XG5cbmxldCBzZXJpYWxpemVGb3JtID0gKGZvcm0sIG9wdHMsIG9ubHlOYW1lcyA9IFtdKSA9PiB7XG4gIGNvbnN0IHtzdWJtaXR0ZXJ9ID0gb3B0c1xuXG4gIC8vIFdlIG11c3QgaW5qZWN0IHRoZSBzdWJtaXR0ZXIgaW4gdGhlIG9yZGVyIHRoYXQgaXQgZXhpc3RzIGluIHRoZSBET01cbiAgLy8gcmVsYXRpdmUgdG8gb3RoZXIgaW5wdXRzLiBGb3IgZXhhbXBsZSwgZm9yIGNoZWNrYm94IGdyb3VwcywgdGhlIG9yZGVyIG11c3QgYmUgbWFpbnRhaW5lZC5cbiAgbGV0IGluamVjdGVkRWxlbWVudFxuICBpZihzdWJtaXR0ZXIgJiYgc3VibWl0dGVyLm5hbWUpe1xuICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpXG4gICAgaW5wdXQudHlwZSA9IFwiaGlkZGVuXCJcbiAgICAvLyBzZXQgdGhlIGZvcm0gYXR0cmlidXRlIGlmIHRoZSBzdWJtaXR0ZXIgaGFzIG9uZTtcbiAgICAvLyB0aGlzIGNhbiBoYXBwZW4gaWYgdGhlIGVsZW1lbnQgaXMgb3V0c2lkZSB0aGUgYWN0dWFsIGZvcm0gZWxlbWVudFxuICAgIGNvbnN0IGZvcm1JZCA9IHN1Ym1pdHRlci5nZXRBdHRyaWJ1dGUoXCJmb3JtXCIpXG4gICAgaWYoZm9ybUlkKXtcbiAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShcImZvcm1cIiwgZm9ybUlkKVxuICAgIH1cbiAgICBpbnB1dC5uYW1lID0gc3VibWl0dGVyLm5hbWVcbiAgICBpbnB1dC52YWx1ZSA9IHN1Ym1pdHRlci52YWx1ZVxuICAgIHN1Ym1pdHRlci5wYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShpbnB1dCwgc3VibWl0dGVyKVxuICAgIGluamVjdGVkRWxlbWVudCA9IGlucHV0XG4gIH1cblxuICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShmb3JtKVxuICBjb25zdCB0b1JlbW92ZSA9IFtdXG5cbiAgZm9ybURhdGEuZm9yRWFjaCgodmFsLCBrZXksIF9pbmRleCkgPT4ge1xuICAgIGlmKHZhbCBpbnN0YW5jZW9mIEZpbGUpeyB0b1JlbW92ZS5wdXNoKGtleSkgfVxuICB9KVxuXG4gIC8vIENsZWFudXAgYWZ0ZXIgYnVpbGRpbmcgZmlsZURhdGFcbiAgdG9SZW1vdmUuZm9yRWFjaChrZXkgPT4gZm9ybURhdGEuZGVsZXRlKGtleSkpXG5cbiAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcygpXG5cbiAgY29uc3Qge2lucHV0c1VudXNlZCwgb25seUhpZGRlbklucHV0c30gPSBBcnJheS5mcm9tKGZvcm0uZWxlbWVudHMpLnJlZHVjZSgoYWNjLCBpbnB1dCkgPT4ge1xuICAgIGNvbnN0IHtpbnB1dHNVbnVzZWQsIG9ubHlIaWRkZW5JbnB1dHN9ID0gYWNjXG4gICAgY29uc3Qga2V5ID0gaW5wdXQubmFtZVxuICAgIGlmKCFrZXkpeyByZXR1cm4gYWNjIH1cblxuICAgIGlmKGlucHV0c1VudXNlZFtrZXldID09PSB1bmRlZmluZWQpeyBpbnB1dHNVbnVzZWRba2V5XSA9IHRydWUgfVxuICAgIGlmKG9ubHlIaWRkZW5JbnB1dHNba2V5XSA9PT0gdW5kZWZpbmVkKXsgb25seUhpZGRlbklucHV0c1trZXldID0gdHJ1ZSB9XG5cbiAgICBjb25zdCBpc1VzZWQgPSBET00ucHJpdmF0ZShpbnB1dCwgUEhYX0hBU19GT0NVU0VEKSB8fCBET00ucHJpdmF0ZShpbnB1dCwgUEhYX0hBU19TVUJNSVRURUQpXG4gICAgY29uc3QgaXNIaWRkZW4gPSBpbnB1dC50eXBlID09PSBcImhpZGRlblwiXG4gICAgaW5wdXRzVW51c2VkW2tleV0gPSBpbnB1dHNVbnVzZWRba2V5XSAmJiAhaXNVc2VkXG4gICAgb25seUhpZGRlbklucHV0c1trZXldID0gb25seUhpZGRlbklucHV0c1trZXldICYmIGlzSGlkZGVuXG5cbiAgICByZXR1cm4gYWNjXG4gIH0sIHtpbnB1dHNVbnVzZWQ6IHt9LCBvbmx5SGlkZGVuSW5wdXRzOiB7fX0pXG5cbiAgZm9yKGxldCBba2V5LCB2YWxdIG9mIGZvcm1EYXRhLmVudHJpZXMoKSl7XG4gICAgaWYob25seU5hbWVzLmxlbmd0aCA9PT0gMCB8fCBvbmx5TmFtZXMuaW5kZXhPZihrZXkpID49IDApe1xuICAgICAgbGV0IGlzVW51c2VkID0gaW5wdXRzVW51c2VkW2tleV1cbiAgICAgIGxldCBoaWRkZW4gPSBvbmx5SGlkZGVuSW5wdXRzW2tleV1cbiAgICAgIGlmKGlzVW51c2VkICYmICEoc3VibWl0dGVyICYmIHN1Ym1pdHRlci5uYW1lID09IGtleSkgJiYgIWhpZGRlbil7XG4gICAgICAgIHBhcmFtcy5hcHBlbmQocHJlcGVuZEZvcm1EYXRhS2V5KGtleSwgXCJfdW51c2VkX1wiKSwgXCJcIilcbiAgICAgIH1cbiAgICAgIHBhcmFtcy5hcHBlbmQoa2V5LCB2YWwpXG4gICAgfVxuICB9XG5cbiAgLy8gcmVtb3ZlIHRoZSBpbmplY3RlZCBlbGVtZW50IGFnYWluXG4gIC8vIChpdCB3b3VsZCBiZSByZW1vdmVkIGJ5IHRoZSBuZXh0IGRvbSBwYXRjaCBhbnl3YXksIGJ1dCB0aGlzIGlzIGNsZWFuZXIpXG4gIGlmKHN1Ym1pdHRlciAmJiBpbmplY3RlZEVsZW1lbnQpe1xuICAgIHN1Ym1pdHRlci5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKGluamVjdGVkRWxlbWVudClcbiAgfVxuXG4gIHJldHVybiBwYXJhbXMudG9TdHJpbmcoKVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWaWV3IHtcbiAgc3RhdGljIGNsb3Nlc3RWaWV3KGVsKXtcbiAgICBsZXQgbGl2ZVZpZXdFbCA9IGVsLmNsb3Nlc3QoUEhYX1ZJRVdfU0VMRUNUT1IpXG4gICAgcmV0dXJuIGxpdmVWaWV3RWwgPyBET00ucHJpdmF0ZShsaXZlVmlld0VsLCBcInZpZXdcIikgOiBudWxsXG4gIH1cblxuICBjb25zdHJ1Y3RvcihlbCwgbGl2ZVNvY2tldCwgcGFyZW50VmlldywgZmxhc2gsIGxpdmVSZWZlcmVyKXtcbiAgICB0aGlzLmlzRGVhZCA9IGZhbHNlXG4gICAgdGhpcy5saXZlU29ja2V0ID0gbGl2ZVNvY2tldFxuICAgIHRoaXMuZmxhc2ggPSBmbGFzaFxuICAgIHRoaXMucGFyZW50ID0gcGFyZW50Vmlld1xuICAgIHRoaXMucm9vdCA9IHBhcmVudFZpZXcgPyBwYXJlbnRWaWV3LnJvb3QgOiB0aGlzXG4gICAgdGhpcy5lbCA9IGVsXG4gICAgRE9NLnB1dFByaXZhdGUodGhpcy5lbCwgXCJ2aWV3XCIsIHRoaXMpXG4gICAgdGhpcy5pZCA9IHRoaXMuZWwuaWRcbiAgICB0aGlzLnJlZiA9IDBcbiAgICB0aGlzLmxhc3RBY2tSZWYgPSBudWxsXG4gICAgdGhpcy5jaGlsZEpvaW5zID0gMFxuICAgIHRoaXMubG9hZGVyVGltZXIgPSBudWxsXG4gICAgdGhpcy5kaXNjb25uZWN0ZWRUaW1lciA9IG51bGxcbiAgICB0aGlzLnBlbmRpbmdEaWZmcyA9IFtdXG4gICAgdGhpcy5wZW5kaW5nRm9ybXMgPSBuZXcgU2V0KClcbiAgICB0aGlzLnJlZGlyZWN0ID0gZmFsc2VcbiAgICB0aGlzLmhyZWYgPSBudWxsXG4gICAgdGhpcy5qb2luQ291bnQgPSB0aGlzLnBhcmVudCA/IHRoaXMucGFyZW50LmpvaW5Db3VudCAtIDEgOiAwXG4gICAgdGhpcy5qb2luQXR0ZW1wdHMgPSAwXG4gICAgdGhpcy5qb2luUGVuZGluZyA9IHRydWVcbiAgICB0aGlzLmRlc3Ryb3llZCA9IGZhbHNlXG4gICAgdGhpcy5qb2luQ2FsbGJhY2sgPSBmdW5jdGlvbihvbkRvbmUpeyBvbkRvbmUgJiYgb25Eb25lKCkgfVxuICAgIHRoaXMuc3RvcENhbGxiYWNrID0gZnVuY3Rpb24oKXsgfVxuICAgIHRoaXMucGVuZGluZ0pvaW5PcHMgPSB0aGlzLnBhcmVudCA/IG51bGwgOiBbXVxuICAgIHRoaXMudmlld0hvb2tzID0ge31cbiAgICB0aGlzLmZvcm1TdWJtaXRzID0gW11cbiAgICB0aGlzLmNoaWxkcmVuID0gdGhpcy5wYXJlbnQgPyBudWxsIDoge31cbiAgICB0aGlzLnJvb3QuY2hpbGRyZW5bdGhpcy5pZF0gPSB7fVxuICAgIHRoaXMuZm9ybXNGb3JSZWNvdmVyeSA9IHt9XG4gICAgdGhpcy5jaGFubmVsID0gdGhpcy5saXZlU29ja2V0LmNoYW5uZWwoYGx2OiR7dGhpcy5pZH1gLCAoKSA9PiB7XG4gICAgICBsZXQgdXJsID0gdGhpcy5ocmVmICYmIHRoaXMuZXhwYW5kVVJMKHRoaXMuaHJlZilcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHJlZGlyZWN0OiB0aGlzLnJlZGlyZWN0ID8gdXJsIDogdW5kZWZpbmVkLFxuICAgICAgICB1cmw6IHRoaXMucmVkaXJlY3QgPyB1bmRlZmluZWQgOiB1cmwgfHwgdW5kZWZpbmVkLFxuICAgICAgICBwYXJhbXM6IHRoaXMuY29ubmVjdFBhcmFtcyhsaXZlUmVmZXJlciksXG4gICAgICAgIHNlc3Npb246IHRoaXMuZ2V0U2Vzc2lvbigpLFxuICAgICAgICBzdGF0aWM6IHRoaXMuZ2V0U3RhdGljKCksXG4gICAgICAgIGZsYXNoOiB0aGlzLmZsYXNoLFxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBzZXRIcmVmKGhyZWYpeyB0aGlzLmhyZWYgPSBocmVmIH1cblxuICBzZXRSZWRpcmVjdChocmVmKXtcbiAgICB0aGlzLnJlZGlyZWN0ID0gdHJ1ZVxuICAgIHRoaXMuaHJlZiA9IGhyZWZcbiAgfVxuXG4gIGlzTWFpbigpeyByZXR1cm4gdGhpcy5lbC5oYXNBdHRyaWJ1dGUoUEhYX01BSU4pIH1cblxuICBjb25uZWN0UGFyYW1zKGxpdmVSZWZlcmVyKXtcbiAgICBsZXQgcGFyYW1zID0gdGhpcy5saXZlU29ja2V0LnBhcmFtcyh0aGlzLmVsKVxuICAgIGxldCBtYW5pZmVzdCA9XG4gICAgICBET00uYWxsKGRvY3VtZW50LCBgWyR7dGhpcy5iaW5kaW5nKFBIWF9UUkFDS19TVEFUSUMpfV1gKVxuICAgICAgICAubWFwKG5vZGUgPT4gbm9kZS5zcmMgfHwgbm9kZS5ocmVmKS5maWx0ZXIodXJsID0+IHR5cGVvZiAodXJsKSA9PT0gXCJzdHJpbmdcIilcblxuICAgIGlmKG1hbmlmZXN0Lmxlbmd0aCA+IDApeyBwYXJhbXNbXCJfdHJhY2tfc3RhdGljXCJdID0gbWFuaWZlc3QgfVxuICAgIHBhcmFtc1tcIl9tb3VudHNcIl0gPSB0aGlzLmpvaW5Db3VudFxuICAgIHBhcmFtc1tcIl9tb3VudF9hdHRlbXB0c1wiXSA9IHRoaXMuam9pbkF0dGVtcHRzXG4gICAgcGFyYW1zW1wiX2xpdmVfcmVmZXJlclwiXSA9IGxpdmVSZWZlcmVyXG4gICAgdGhpcy5qb2luQXR0ZW1wdHMrK1xuXG4gICAgcmV0dXJuIHBhcmFtc1xuICB9XG5cbiAgaXNDb25uZWN0ZWQoKXsgcmV0dXJuIHRoaXMuY2hhbm5lbC5jYW5QdXNoKCkgfVxuXG4gIGdldFNlc3Npb24oKXsgcmV0dXJuIHRoaXMuZWwuZ2V0QXR0cmlidXRlKFBIWF9TRVNTSU9OKSB9XG5cbiAgZ2V0U3RhdGljKCl7XG4gICAgbGV0IHZhbCA9IHRoaXMuZWwuZ2V0QXR0cmlidXRlKFBIWF9TVEFUSUMpXG4gICAgcmV0dXJuIHZhbCA9PT0gXCJcIiA/IG51bGwgOiB2YWxcbiAgfVxuXG4gIGRlc3Ryb3koY2FsbGJhY2sgPSBmdW5jdGlvbiAoKXsgfSl7XG4gICAgdGhpcy5kZXN0cm95QWxsQ2hpbGRyZW4oKVxuICAgIHRoaXMuZGVzdHJveWVkID0gdHJ1ZVxuICAgIGRlbGV0ZSB0aGlzLnJvb3QuY2hpbGRyZW5bdGhpcy5pZF1cbiAgICBpZih0aGlzLnBhcmVudCl7IGRlbGV0ZSB0aGlzLnJvb3QuY2hpbGRyZW5bdGhpcy5wYXJlbnQuaWRdW3RoaXMuaWRdIH1cbiAgICBjbGVhclRpbWVvdXQodGhpcy5sb2FkZXJUaW1lcilcbiAgICBsZXQgb25GaW5pc2hlZCA9ICgpID0+IHtcbiAgICAgIGNhbGxiYWNrKClcbiAgICAgIGZvcihsZXQgaWQgaW4gdGhpcy52aWV3SG9va3Mpe1xuICAgICAgICB0aGlzLmRlc3Ryb3lIb29rKHRoaXMudmlld0hvb2tzW2lkXSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBET00ubWFya1BoeENoaWxkRGVzdHJveWVkKHRoaXMuZWwpXG5cbiAgICB0aGlzLmxvZyhcImRlc3Ryb3llZFwiLCAoKSA9PiBbXCJ0aGUgY2hpbGQgaGFzIGJlZW4gcmVtb3ZlZCBmcm9tIHRoZSBwYXJlbnRcIl0pXG4gICAgdGhpcy5jaGFubmVsLmxlYXZlKClcbiAgICAgIC5yZWNlaXZlKFwib2tcIiwgb25GaW5pc2hlZClcbiAgICAgIC5yZWNlaXZlKFwiZXJyb3JcIiwgb25GaW5pc2hlZClcbiAgICAgIC5yZWNlaXZlKFwidGltZW91dFwiLCBvbkZpbmlzaGVkKVxuICB9XG5cbiAgc2V0Q29udGFpbmVyQ2xhc3NlcyguLi5jbGFzc2VzKXtcbiAgICB0aGlzLmVsLmNsYXNzTGlzdC5yZW1vdmUoXG4gICAgICBQSFhfQ09OTkVDVEVEX0NMQVNTLFxuICAgICAgUEhYX0xPQURJTkdfQ0xBU1MsXG4gICAgICBQSFhfRVJST1JfQ0xBU1MsXG4gICAgICBQSFhfQ0xJRU5UX0VSUk9SX0NMQVNTLFxuICAgICAgUEhYX1NFUlZFUl9FUlJPUl9DTEFTU1xuICAgIClcbiAgICB0aGlzLmVsLmNsYXNzTGlzdC5hZGQoLi4uY2xhc3NlcylcbiAgfVxuXG4gIHNob3dMb2FkZXIodGltZW91dCl7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMubG9hZGVyVGltZXIpXG4gICAgaWYodGltZW91dCl7XG4gICAgICB0aGlzLmxvYWRlclRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB0aGlzLnNob3dMb2FkZXIoKSwgdGltZW91dClcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yKGxldCBpZCBpbiB0aGlzLnZpZXdIb29rcyl7IHRoaXMudmlld0hvb2tzW2lkXS5fX2Rpc2Nvbm5lY3RlZCgpIH1cbiAgICAgIHRoaXMuc2V0Q29udGFpbmVyQ2xhc3NlcyhQSFhfTE9BRElOR19DTEFTUylcbiAgICB9XG4gIH1cblxuICBleGVjQWxsKGJpbmRpbmcpe1xuICAgIERPTS5hbGwodGhpcy5lbCwgYFske2JpbmRpbmd9XWAsIGVsID0+IHRoaXMubGl2ZVNvY2tldC5leGVjSlMoZWwsIGVsLmdldEF0dHJpYnV0ZShiaW5kaW5nKSkpXG4gIH1cblxuICBoaWRlTG9hZGVyKCl7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMubG9hZGVyVGltZXIpXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuZGlzY29ubmVjdGVkVGltZXIpXG4gICAgdGhpcy5zZXRDb250YWluZXJDbGFzc2VzKFBIWF9DT05ORUNURURfQ0xBU1MpXG4gICAgdGhpcy5leGVjQWxsKHRoaXMuYmluZGluZyhcImNvbm5lY3RlZFwiKSlcbiAgfVxuXG4gIHRyaWdnZXJSZWNvbm5lY3RlZCgpe1xuICAgIGZvcihsZXQgaWQgaW4gdGhpcy52aWV3SG9va3MpeyB0aGlzLnZpZXdIb29rc1tpZF0uX19yZWNvbm5lY3RlZCgpIH1cbiAgfVxuXG4gIGxvZyhraW5kLCBtc2dDYWxsYmFjayl7XG4gICAgdGhpcy5saXZlU29ja2V0LmxvZyh0aGlzLCBraW5kLCBtc2dDYWxsYmFjaylcbiAgfVxuXG4gIHRyYW5zaXRpb24odGltZSwgb25TdGFydCwgb25Eb25lID0gZnVuY3Rpb24oKXt9KXtcbiAgICB0aGlzLmxpdmVTb2NrZXQudHJhbnNpdGlvbih0aW1lLCBvblN0YXJ0LCBvbkRvbmUpXG4gIH1cblxuICAvLyBjYWxscyB0aGUgY2FsbGJhY2sgd2l0aCB0aGUgdmlldyBhbmQgdGFyZ2V0IGVsZW1lbnQgZm9yIHRoZSBnaXZlbiBwaHhUYXJnZXRcbiAgLy8gdGFyZ2V0cyBjYW4gYmU6XG4gIC8vICAqIGFuIGVsZW1lbnQgaXRzZWxmLCB0aGVuIGl0IGlzIHNpbXBseSBwYXNzZWQgdG8gbGl2ZVNvY2tldC5vd25lcjtcbiAgLy8gICogYSBDSUQgKENvbXBvbmVudCBJRCksIHRoZW4gd2UgZmlyc3Qgc2VhcmNoIHRoZSBjb21wb25lbnQncyBlbGVtZW50IGluIHRoZSBET01cbiAgLy8gICogYSBzZWxlY3RvciwgdGhlbiB3ZSBzZWFyY2ggdGhlIHNlbGVjdG9yIGluIHRoZSBET00gYW5kIGNhbGwgdGhlIGNhbGxiYWNrXG4gIC8vICAgIGZvciBlYWNoIGVsZW1lbnQgZm91bmQgd2l0aCB0aGUgY29ycmVzcG9uZGluZyBvd25lciB2aWV3XG4gIHdpdGhpblRhcmdldHMocGh4VGFyZ2V0LCBjYWxsYmFjaywgZG9tID0gZG9jdW1lbnQsIHZpZXdFbCl7XG4gICAgLy8gaW4gdGhlIGZvcm0gcmVjb3ZlcnkgY2FzZSB3ZSBzZWFyY2ggaW4gYSB0ZW1wbGF0ZSBmcmFnbWVudCBpbnN0ZWFkIG9mXG4gICAgLy8gdGhlIHJlYWwgZG9tLCB0aGVyZWZvcmUgd2Ugb3B0aW9uYWxseSBwYXNzIGRvbSBhbmQgdmlld0VsXG5cbiAgICBpZihwaHhUYXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCB8fCBwaHhUYXJnZXQgaW5zdGFuY2VvZiBTVkdFbGVtZW50KXtcbiAgICAgIHJldHVybiB0aGlzLmxpdmVTb2NrZXQub3duZXIocGh4VGFyZ2V0LCB2aWV3ID0+IGNhbGxiYWNrKHZpZXcsIHBoeFRhcmdldCkpXG4gICAgfVxuXG4gICAgaWYoaXNDaWQocGh4VGFyZ2V0KSl7XG4gICAgICBsZXQgdGFyZ2V0cyA9IERPTS5maW5kQ29tcG9uZW50Tm9kZUxpc3Qodmlld0VsIHx8IHRoaXMuZWwsIHBoeFRhcmdldClcbiAgICAgIGlmKHRhcmdldHMubGVuZ3RoID09PSAwKXtcbiAgICAgICAgbG9nRXJyb3IoYG5vIGNvbXBvbmVudCBmb3VuZCBtYXRjaGluZyBwaHgtdGFyZ2V0IG9mICR7cGh4VGFyZ2V0fWApXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsYmFjayh0aGlzLCBwYXJzZUludChwaHhUYXJnZXQpKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgdGFyZ2V0cyA9IEFycmF5LmZyb20oZG9tLnF1ZXJ5U2VsZWN0b3JBbGwocGh4VGFyZ2V0KSlcbiAgICAgIGlmKHRhcmdldHMubGVuZ3RoID09PSAwKXsgbG9nRXJyb3IoYG5vdGhpbmcgZm91bmQgbWF0Y2hpbmcgdGhlIHBoeC10YXJnZXQgc2VsZWN0b3IgXCIke3BoeFRhcmdldH1cImApIH1cbiAgICAgIHRhcmdldHMuZm9yRWFjaCh0YXJnZXQgPT4gdGhpcy5saXZlU29ja2V0Lm93bmVyKHRhcmdldCwgdmlldyA9PiBjYWxsYmFjayh2aWV3LCB0YXJnZXQpKSlcbiAgICB9XG4gIH1cblxuICBhcHBseURpZmYodHlwZSwgcmF3RGlmZiwgY2FsbGJhY2spe1xuICAgIHRoaXMubG9nKHR5cGUsICgpID0+IFtcIlwiLCBjbG9uZShyYXdEaWZmKV0pXG4gICAgbGV0IHtkaWZmLCByZXBseSwgZXZlbnRzLCB0aXRsZX0gPSBSZW5kZXJlZC5leHRyYWN0KHJhd0RpZmYpXG4gICAgY2FsbGJhY2soe2RpZmYsIHJlcGx5LCBldmVudHN9KVxuICAgIGlmKHR5cGVvZiB0aXRsZSA9PT0gXCJzdHJpbmdcIiB8fCB0eXBlID09IFwibW91bnRcIil7IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gRE9NLnB1dFRpdGxlKHRpdGxlKSkgfVxuICB9XG5cbiAgb25Kb2luKHJlc3Ape1xuICAgIGxldCB7cmVuZGVyZWQsIGNvbnRhaW5lciwgbGl2ZXZpZXdfdmVyc2lvbn0gPSByZXNwXG4gICAgaWYoY29udGFpbmVyKXtcbiAgICAgIGxldCBbdGFnLCBhdHRyc10gPSBjb250YWluZXJcbiAgICAgIHRoaXMuZWwgPSBET00ucmVwbGFjZVJvb3RDb250YWluZXIodGhpcy5lbCwgdGFnLCBhdHRycylcbiAgICB9XG4gICAgdGhpcy5jaGlsZEpvaW5zID0gMFxuICAgIHRoaXMuam9pblBlbmRpbmcgPSB0cnVlXG4gICAgdGhpcy5mbGFzaCA9IG51bGxcbiAgICBpZih0aGlzLnJvb3QgPT09IHRoaXMpe1xuICAgICAgdGhpcy5mb3Jtc0ZvclJlY292ZXJ5ID0gdGhpcy5nZXRGb3Jtc0ZvclJlY292ZXJ5KClcbiAgICB9XG4gICAgaWYodGhpcy5pc01haW4oKSAmJiB3aW5kb3cuaGlzdG9yeS5zdGF0ZSA9PT0gbnVsbCl7XG4gICAgICAvLyBzZXQgaW5pdGlhbCBoaXN0b3J5IGVudHJ5IGlmIHRoaXMgaXMgdGhlIGZpcnN0IHBhZ2UgbG9hZCAobm8gaGlzdG9yeSlcbiAgICAgIEJyb3dzZXIucHVzaFN0YXRlKFwicmVwbGFjZVwiLCB7XG4gICAgICAgIHR5cGU6IFwicGF0Y2hcIixcbiAgICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICAgIHBvc2l0aW9uOiB0aGlzLmxpdmVTb2NrZXQuY3VycmVudEhpc3RvcnlQb3NpdGlvblxuICAgICAgfSlcbiAgICB9XG5cbiAgICBpZihsaXZldmlld192ZXJzaW9uICE9PSB0aGlzLmxpdmVTb2NrZXQudmVyc2lvbigpKXtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYExpdmVWaWV3IGFzc2V0IHZlcnNpb24gbWlzbWF0Y2guIEphdmFTY3JpcHQgdmVyc2lvbiAke3RoaXMubGl2ZVNvY2tldC52ZXJzaW9uKCl9IHZzLiBzZXJ2ZXIgJHtsaXZldmlld192ZXJzaW9ufS4gVG8gYXZvaWQgaXNzdWVzLCBwbGVhc2UgZW5zdXJlIHRoYXQgeW91ciBhc3NldHMgdXNlIHRoZSBzYW1lIHZlcnNpb24gYXMgdGhlIHNlcnZlci5gKVxuICAgIH1cblxuICAgIEJyb3dzZXIuZHJvcExvY2FsKHRoaXMubGl2ZVNvY2tldC5sb2NhbFN0b3JhZ2UsIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSwgQ09OU0VDVVRJVkVfUkVMT0FEUylcbiAgICB0aGlzLmFwcGx5RGlmZihcIm1vdW50XCIsIHJlbmRlcmVkLCAoe2RpZmYsIGV2ZW50c30pID0+IHtcbiAgICAgIHRoaXMucmVuZGVyZWQgPSBuZXcgUmVuZGVyZWQodGhpcy5pZCwgZGlmZilcbiAgICAgIGxldCBbaHRtbCwgc3RyZWFtc10gPSB0aGlzLnJlbmRlckNvbnRhaW5lcihudWxsLCBcImpvaW5cIilcbiAgICAgIHRoaXMuZHJvcFBlbmRpbmdSZWZzKClcbiAgICAgIHRoaXMuam9pbkNvdW50KytcbiAgICAgIHRoaXMuam9pbkF0dGVtcHRzID0gMFxuXG4gICAgICB0aGlzLm1heWJlUmVjb3ZlckZvcm1zKGh0bWwsICgpID0+IHtcbiAgICAgICAgdGhpcy5vbkpvaW5Db21wbGV0ZShyZXNwLCBodG1sLCBzdHJlYW1zLCBldmVudHMpXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBkcm9wUGVuZGluZ1JlZnMoKXtcbiAgICBET00uYWxsKGRvY3VtZW50LCBgWyR7UEhYX1JFRl9TUkN9PVwiJHt0aGlzLnJlZlNyYygpfVwiXWAsIGVsID0+IHtcbiAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShQSFhfUkVGX0xPQURJTkcpXG4gICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoUEhYX1JFRl9TUkMpXG4gICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoUEhYX1JFRl9MT0NLKVxuICAgIH0pXG4gIH1cblxuICBvbkpvaW5Db21wbGV0ZSh7bGl2ZV9wYXRjaH0sIGh0bWwsIHN0cmVhbXMsIGV2ZW50cyl7XG4gICAgLy8gSW4gb3JkZXIgdG8gcHJvdmlkZSBhIGJldHRlciBleHBlcmllbmNlLCB3ZSB3YW50IHRvIGpvaW5cbiAgICAvLyBhbGwgTGl2ZVZpZXdzIGZpcnN0IGFuZCBvbmx5IHRoZW4gYXBwbHkgdGhlaXIgcGF0Y2hlcy5cbiAgICBpZih0aGlzLmpvaW5Db3VudCA+IDEgfHwgKHRoaXMucGFyZW50ICYmICF0aGlzLnBhcmVudC5pc0pvaW5QZW5kaW5nKCkpKXtcbiAgICAgIHJldHVybiB0aGlzLmFwcGx5Sm9pblBhdGNoKGxpdmVfcGF0Y2gsIGh0bWwsIHN0cmVhbXMsIGV2ZW50cylcbiAgICB9XG5cbiAgICAvLyBPbmUgZG93bnNpZGUgb2YgdGhpcyBhcHByb2FjaCBpcyB0aGF0IHdlIG5lZWQgdG8gZmluZCBwaHhDaGlsZHJlblxuICAgIC8vIGluIHRoZSBodG1sIGZyYWdtZW50LCBpbnN0ZWFkIG9mIGRpcmVjdGx5IG9uIHRoZSBET00uIFRoZSBmcmFnbWVudFxuICAgIC8vIGFsc28gZG9lcyBub3QgaW5jbHVkZSBQSFhfU1RBVElDLCBzbyB3ZSBuZWVkIHRvIGNvcHkgaXQgb3ZlciBmcm9tXG4gICAgLy8gdGhlIERPTS5cbiAgICBsZXQgbmV3Q2hpbGRyZW4gPSBET00uZmluZFBoeENoaWxkcmVuSW5GcmFnbWVudChodG1sLCB0aGlzLmlkKS5maWx0ZXIodG9FbCA9PiB7XG4gICAgICBsZXQgZnJvbUVsID0gdG9FbC5pZCAmJiB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoYFtpZD1cIiR7dG9FbC5pZH1cIl1gKVxuICAgICAgbGV0IHBoeFN0YXRpYyA9IGZyb21FbCAmJiBmcm9tRWwuZ2V0QXR0cmlidXRlKFBIWF9TVEFUSUMpXG4gICAgICBpZihwaHhTdGF0aWMpeyB0b0VsLnNldEF0dHJpYnV0ZShQSFhfU1RBVElDLCBwaHhTdGF0aWMpIH1cbiAgICAgIC8vIHNldCBQSFhfUk9PVF9JRCB0byBwcmV2ZW50IGV2ZW50cyBmcm9tIGJlaW5nIGRpc3BhdGNoZWQgdG8gdGhlIHJvb3Qgdmlld1xuICAgICAgLy8gd2hpbGUgdGhlIGNoaWxkIGpvaW4gaXMgc3RpbGwgcGVuZGluZ1xuICAgICAgaWYoZnJvbUVsKXsgZnJvbUVsLnNldEF0dHJpYnV0ZShQSFhfUk9PVF9JRCwgdGhpcy5yb290LmlkKSB9XG4gICAgICByZXR1cm4gdGhpcy5qb2luQ2hpbGQodG9FbClcbiAgICB9KVxuXG4gICAgaWYobmV3Q2hpbGRyZW4ubGVuZ3RoID09PSAwKXtcbiAgICAgIGlmKHRoaXMucGFyZW50KXtcbiAgICAgICAgdGhpcy5yb290LnBlbmRpbmdKb2luT3BzLnB1c2goW3RoaXMsICgpID0+IHRoaXMuYXBwbHlKb2luUGF0Y2gobGl2ZV9wYXRjaCwgaHRtbCwgc3RyZWFtcywgZXZlbnRzKV0pXG4gICAgICAgIHRoaXMucGFyZW50LmFja0pvaW4odGhpcylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMub25BbGxDaGlsZEpvaW5zQ29tcGxldGUoKVxuICAgICAgICB0aGlzLmFwcGx5Sm9pblBhdGNoKGxpdmVfcGF0Y2gsIGh0bWwsIHN0cmVhbXMsIGV2ZW50cylcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yb290LnBlbmRpbmdKb2luT3BzLnB1c2goW3RoaXMsICgpID0+IHRoaXMuYXBwbHlKb2luUGF0Y2gobGl2ZV9wYXRjaCwgaHRtbCwgc3RyZWFtcywgZXZlbnRzKV0pXG4gICAgfVxuICB9XG5cbiAgYXR0YWNoVHJ1ZURvY0VsKCl7XG4gICAgdGhpcy5lbCA9IERPTS5ieUlkKHRoaXMuaWQpXG4gICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGUoUEhYX1JPT1RfSUQsIHRoaXMucm9vdC5pZClcbiAgfVxuXG4gIC8vIHRoaXMgaXMgaW52b2tlZCBmb3IgZGVhZCBhbmQgbGl2ZSB2aWV3cywgc28gd2UgbXVzdCBmaWx0ZXIgYnlcbiAgLy8gYnkgb3duZXIgdG8gZW5zdXJlIHdlIGFyZW4ndCBkdXBsaWNhdGluZyBob29rcyBhY3Jvc3MgZGlzY29ubmVjdFxuICAvLyBhbmQgY29ubmVjdGVkIHN0YXRlcy4gVGhpcyBhbHNvIGhhbmRsZXMgY2FzZXMgd2hlcmUgaG9va3MgZXhpc3RcbiAgLy8gaW4gYSByb290IGxheW91dCB3aXRoIGEgTFYgaW4gdGhlIGJvZHlcbiAgZXhlY05ld01vdW50ZWQocGFyZW50ID0gdGhpcy5lbCl7XG4gICAgbGV0IHBoeFZpZXdwb3J0VG9wID0gdGhpcy5iaW5kaW5nKFBIWF9WSUVXUE9SVF9UT1ApXG4gICAgbGV0IHBoeFZpZXdwb3J0Qm90dG9tID0gdGhpcy5iaW5kaW5nKFBIWF9WSUVXUE9SVF9CT1RUT00pXG4gICAgRE9NLmFsbChwYXJlbnQsIGBbJHtwaHhWaWV3cG9ydFRvcH1dLCBbJHtwaHhWaWV3cG9ydEJvdHRvbX1dYCwgaG9va0VsID0+IHtcbiAgICAgIGlmKHRoaXMub3duc0VsZW1lbnQoaG9va0VsKSl7XG4gICAgICAgIERPTS5tYWludGFpblByaXZhdGVIb29rcyhob29rRWwsIGhvb2tFbCwgcGh4Vmlld3BvcnRUb3AsIHBoeFZpZXdwb3J0Qm90dG9tKVxuICAgICAgICB0aGlzLm1heWJlQWRkTmV3SG9vayhob29rRWwpXG4gICAgICB9XG4gICAgfSlcbiAgICBET00uYWxsKHBhcmVudCwgYFske3RoaXMuYmluZGluZyhQSFhfSE9PSyl9XSwgW2RhdGEtcGh4LSR7UEhYX0hPT0t9XWAsIGhvb2tFbCA9PiB7XG4gICAgICBpZih0aGlzLm93bnNFbGVtZW50KGhvb2tFbCkpe1xuICAgICAgICB0aGlzLm1heWJlQWRkTmV3SG9vayhob29rRWwpXG4gICAgICB9XG4gICAgfSlcbiAgICBET00uYWxsKHBhcmVudCwgYFske3RoaXMuYmluZGluZyhQSFhfTU9VTlRFRCl9XWAsIGVsID0+IHtcbiAgICAgIGlmKHRoaXMub3duc0VsZW1lbnQoZWwpKXtcbiAgICAgICAgdGhpcy5tYXliZU1vdW50ZWQoZWwpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGFwcGx5Sm9pblBhdGNoKGxpdmVfcGF0Y2gsIGh0bWwsIHN0cmVhbXMsIGV2ZW50cyl7XG4gICAgdGhpcy5hdHRhY2hUcnVlRG9jRWwoKVxuICAgIGxldCBwYXRjaCA9IG5ldyBET01QYXRjaCh0aGlzLCB0aGlzLmVsLCB0aGlzLmlkLCBodG1sLCBzdHJlYW1zLCBudWxsKVxuICAgIHBhdGNoLm1hcmtQcnVuYWJsZUNvbnRlbnRGb3JSZW1vdmFsKClcbiAgICB0aGlzLnBlcmZvcm1QYXRjaChwYXRjaCwgZmFsc2UsIHRydWUpXG4gICAgdGhpcy5qb2luTmV3Q2hpbGRyZW4oKVxuICAgIHRoaXMuZXhlY05ld01vdW50ZWQoKVxuXG4gICAgdGhpcy5qb2luUGVuZGluZyA9IGZhbHNlXG4gICAgdGhpcy5saXZlU29ja2V0LmRpc3BhdGNoRXZlbnRzKGV2ZW50cylcbiAgICB0aGlzLmFwcGx5UGVuZGluZ1VwZGF0ZXMoKVxuXG4gICAgaWYobGl2ZV9wYXRjaCl7XG4gICAgICBsZXQge2tpbmQsIHRvfSA9IGxpdmVfcGF0Y2hcbiAgICAgIHRoaXMubGl2ZVNvY2tldC5oaXN0b3J5UGF0Y2godG8sIGtpbmQpXG4gICAgfVxuICAgIHRoaXMuaGlkZUxvYWRlcigpXG4gICAgaWYodGhpcy5qb2luQ291bnQgPiAxKXsgdGhpcy50cmlnZ2VyUmVjb25uZWN0ZWQoKSB9XG4gICAgdGhpcy5zdG9wQ2FsbGJhY2soKVxuICB9XG5cbiAgdHJpZ2dlckJlZm9yZVVwZGF0ZUhvb2soZnJvbUVsLCB0b0VsKXtcbiAgICB0aGlzLmxpdmVTb2NrZXQudHJpZ2dlckRPTShcIm9uQmVmb3JlRWxVcGRhdGVkXCIsIFtmcm9tRWwsIHRvRWxdKVxuICAgIGxldCBob29rID0gdGhpcy5nZXRIb29rKGZyb21FbClcbiAgICBsZXQgaXNJZ25vcmVkID0gaG9vayAmJiBET00uaXNJZ25vcmVkKGZyb21FbCwgdGhpcy5iaW5kaW5nKFBIWF9VUERBVEUpKVxuICAgIGlmKGhvb2sgJiYgIWZyb21FbC5pc0VxdWFsTm9kZSh0b0VsKSAmJiAhKGlzSWdub3JlZCAmJiBpc0VxdWFsT2JqKGZyb21FbC5kYXRhc2V0LCB0b0VsLmRhdGFzZXQpKSl7XG4gICAgICBob29rLl9fYmVmb3JlVXBkYXRlKClcbiAgICAgIHJldHVybiBob29rXG4gICAgfVxuICB9XG5cbiAgbWF5YmVNb3VudGVkKGVsKXtcbiAgICBsZXQgcGh4TW91bnRlZCA9IGVsLmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoUEhYX01PVU5URUQpKVxuICAgIGxldCBoYXNCZWVuSW52b2tlZCA9IHBoeE1vdW50ZWQgJiYgRE9NLnByaXZhdGUoZWwsIFwibW91bnRlZFwiKVxuICAgIGlmKHBoeE1vdW50ZWQgJiYgIWhhc0JlZW5JbnZva2VkKXtcbiAgICAgIHRoaXMubGl2ZVNvY2tldC5leGVjSlMoZWwsIHBoeE1vdW50ZWQpXG4gICAgICBET00ucHV0UHJpdmF0ZShlbCwgXCJtb3VudGVkXCIsIHRydWUpXG4gICAgfVxuICB9XG5cbiAgbWF5YmVBZGROZXdIb29rKGVsKXtcbiAgICBsZXQgbmV3SG9vayA9IHRoaXMuYWRkSG9vayhlbClcbiAgICBpZihuZXdIb29rKXsgbmV3SG9vay5fX21vdW50ZWQoKSB9XG4gIH1cblxuICBwZXJmb3JtUGF0Y2gocGF0Y2gsIHBydW5lQ2lkcywgaXNKb2luUGF0Y2ggPSBmYWxzZSl7XG4gICAgbGV0IHJlbW92ZWRFbHMgPSBbXVxuICAgIGxldCBwaHhDaGlsZHJlbkFkZGVkID0gZmFsc2VcbiAgICBsZXQgdXBkYXRlZEhvb2tJZHMgPSBuZXcgU2V0KClcblxuICAgIHRoaXMubGl2ZVNvY2tldC50cmlnZ2VyRE9NKFwib25QYXRjaFN0YXJ0XCIsIFtwYXRjaC50YXJnZXRDb250YWluZXJdKVxuXG4gICAgcGF0Y2guYWZ0ZXIoXCJhZGRlZFwiLCBlbCA9PiB7XG4gICAgICB0aGlzLmxpdmVTb2NrZXQudHJpZ2dlckRPTShcIm9uTm9kZUFkZGVkXCIsIFtlbF0pXG4gICAgICBsZXQgcGh4Vmlld3BvcnRUb3AgPSB0aGlzLmJpbmRpbmcoUEhYX1ZJRVdQT1JUX1RPUClcbiAgICAgIGxldCBwaHhWaWV3cG9ydEJvdHRvbSA9IHRoaXMuYmluZGluZyhQSFhfVklFV1BPUlRfQk9UVE9NKVxuICAgICAgRE9NLm1haW50YWluUHJpdmF0ZUhvb2tzKGVsLCBlbCwgcGh4Vmlld3BvcnRUb3AsIHBoeFZpZXdwb3J0Qm90dG9tKVxuICAgICAgdGhpcy5tYXliZUFkZE5ld0hvb2soZWwpXG4gICAgICBpZihlbC5nZXRBdHRyaWJ1dGUpeyB0aGlzLm1heWJlTW91bnRlZChlbCkgfVxuICAgIH0pXG5cbiAgICBwYXRjaC5hZnRlcihcInBoeENoaWxkQWRkZWRcIiwgZWwgPT4ge1xuICAgICAgaWYoRE9NLmlzUGh4U3RpY2t5KGVsKSl7XG4gICAgICAgIHRoaXMubGl2ZVNvY2tldC5qb2luUm9vdFZpZXdzKClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBoeENoaWxkcmVuQWRkZWQgPSB0cnVlXG4gICAgICB9XG4gICAgfSlcblxuICAgIHBhdGNoLmJlZm9yZShcInVwZGF0ZWRcIiwgKGZyb21FbCwgdG9FbCkgPT4ge1xuICAgICAgbGV0IGhvb2sgPSB0aGlzLnRyaWdnZXJCZWZvcmVVcGRhdGVIb29rKGZyb21FbCwgdG9FbClcbiAgICAgIGlmKGhvb2speyB1cGRhdGVkSG9va0lkcy5hZGQoZnJvbUVsLmlkKSB9XG4gICAgfSlcblxuICAgIHBhdGNoLmFmdGVyKFwidXBkYXRlZFwiLCBlbCA9PiB7XG4gICAgICBpZih1cGRhdGVkSG9va0lkcy5oYXMoZWwuaWQpKXsgdGhpcy5nZXRIb29rKGVsKS5fX3VwZGF0ZWQoKSB9XG4gICAgfSlcblxuICAgIHBhdGNoLmFmdGVyKFwiZGlzY2FyZGVkXCIsIChlbCkgPT4ge1xuICAgICAgaWYoZWwubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFKXsgcmVtb3ZlZEVscy5wdXNoKGVsKSB9XG4gICAgfSlcblxuICAgIHBhdGNoLmFmdGVyKFwidHJhbnNpdGlvbnNEaXNjYXJkZWRcIiwgZWxzID0+IHRoaXMuYWZ0ZXJFbGVtZW50c1JlbW92ZWQoZWxzLCBwcnVuZUNpZHMpKVxuICAgIHBhdGNoLnBlcmZvcm0oaXNKb2luUGF0Y2gpXG4gICAgdGhpcy5hZnRlckVsZW1lbnRzUmVtb3ZlZChyZW1vdmVkRWxzLCBwcnVuZUNpZHMpXG5cbiAgICB0aGlzLmxpdmVTb2NrZXQudHJpZ2dlckRPTShcIm9uUGF0Y2hFbmRcIiwgW3BhdGNoLnRhcmdldENvbnRhaW5lcl0pXG4gICAgcmV0dXJuIHBoeENoaWxkcmVuQWRkZWRcbiAgfVxuXG4gIGFmdGVyRWxlbWVudHNSZW1vdmVkKGVsZW1lbnRzLCBwcnVuZUNpZHMpe1xuICAgIGxldCBkZXN0cm95ZWRDSURzID0gW11cbiAgICBlbGVtZW50cy5mb3JFYWNoKHBhcmVudCA9PiB7XG4gICAgICBsZXQgY29tcG9uZW50cyA9IERPTS5hbGwocGFyZW50LCBgWyR7UEhYX0NPTVBPTkVOVH1dYClcbiAgICAgIGxldCBob29rcyA9IERPTS5hbGwocGFyZW50LCBgWyR7dGhpcy5iaW5kaW5nKFBIWF9IT09LKX1dLCBbZGF0YS1waHgtaG9va11gKVxuICAgICAgY29tcG9uZW50cy5jb25jYXQocGFyZW50KS5mb3JFYWNoKGVsID0+IHtcbiAgICAgICAgbGV0IGNpZCA9IHRoaXMuY29tcG9uZW50SUQoZWwpXG4gICAgICAgIGlmKGlzQ2lkKGNpZCkgJiYgZGVzdHJveWVkQ0lEcy5pbmRleE9mKGNpZCkgPT09IC0xKXsgZGVzdHJveWVkQ0lEcy5wdXNoKGNpZCkgfVxuICAgICAgfSlcbiAgICAgIGhvb2tzLmNvbmNhdChwYXJlbnQpLmZvckVhY2goaG9va0VsID0+IHtcbiAgICAgICAgbGV0IGhvb2sgPSB0aGlzLmdldEhvb2soaG9va0VsKVxuICAgICAgICBob29rICYmIHRoaXMuZGVzdHJveUhvb2soaG9vaylcbiAgICAgIH0pXG4gICAgfSlcbiAgICAvLyBXZSBzaG91bGQgbm90IHBydW5lQ2lkcyBvbiBqb2lucy4gT3RoZXJ3aXNlLCBpbiBjYXNlIG9mXG4gICAgLy8gcmVqb2lucywgd2UgbWF5IG5vdGlmeSBjaWRzIHRoYXQgbm8gbG9uZ2VyIGJlbG9uZyB0byB0aGVcbiAgICAvLyBjdXJyZW50IExpdmVWaWV3IHRvIGJlIHJlbW92ZWQuXG4gICAgaWYocHJ1bmVDaWRzKXtcbiAgICAgIHRoaXMubWF5YmVQdXNoQ29tcG9uZW50c0Rlc3Ryb3llZChkZXN0cm95ZWRDSURzKVxuICAgIH1cbiAgfVxuXG4gIGpvaW5OZXdDaGlsZHJlbigpe1xuICAgIERPTS5maW5kUGh4Q2hpbGRyZW4odGhpcy5lbCwgdGhpcy5pZCkuZm9yRWFjaChlbCA9PiB0aGlzLmpvaW5DaGlsZChlbCkpXG4gIH1cblxuICBtYXliZVJlY292ZXJGb3JtcyhodG1sLCBjYWxsYmFjayl7XG4gICAgY29uc3QgcGh4Q2hhbmdlID0gdGhpcy5iaW5kaW5nKFwiY2hhbmdlXCIpXG4gICAgY29uc3Qgb2xkRm9ybXMgPSB0aGlzLnJvb3QuZm9ybXNGb3JSZWNvdmVyeVxuICAgIC8vIFNvIHdoeSBkbyB3ZSBjcmVhdGUgYSB0ZW1wbGF0ZSBlbGVtZW50IGhlcmU/XG4gICAgLy8gT25lIHdheSB0byByZWNvdmVyIGZvcm1zIHdvdWxkIGJlIHRvIGltbWVkaWF0ZWx5IGFwcGx5IHRoZSBtb3VudFxuICAgIC8vIHBhdGNoIGFuZCB0aGVuIGFmdGVyd2FyZHMgcmVjb3ZlciB0aGUgZm9ybXMuIEhvd2V2ZXIsIHRoaXMgd291bGRcbiAgICAvLyBjYXVzZSBhIGZsaWNrZXIsIGJlY2F1c2UgdGhlIG1vdW50IHBhdGNoIHdvdWxkIHJlbW92ZSB0aGUgZm9ybSBjb250ZW50XG4gICAgLy8gdW50aWwgaXQgaXMgcmVzdG9yZWQuIFRoZXJlZm9yZSBMViBkZWNpZGVkIHRvIGRvIGZvcm0gcmVjb3Zlcnkgd2l0aCB0aGVcbiAgICAvLyByYXcgSFRNTCBiZWZvcmUgaXQgaXMgYXBwbGllZCBhbmQgZGVsYXkgdGhlIG1vdW50IHBhdGNoIHVudGlsIHRoZSBmb3JtXG4gICAgLy8gcmVjb3ZlcnkgZXZlbnRzIGFyZSBkb25lLlxuICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZW1wbGF0ZVwiKVxuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IGh0bWxcbiAgICAvLyBiZWNhdXNlIHdlIHdvcmsgd2l0aCBhIHRlbXBsYXRlIGVsZW1lbnQsIHdlIG11c3QgbWFudWFsbHkgY29weSB0aGUgYXR0cmlidXRlc1xuICAgIC8vIG90aGVyd2lzZSB0aGUgb3duZXIgLyB0YXJnZXQgaGVscGVycyBkb24ndCB3b3JrIHByb3Blcmx5XG4gICAgY29uc3Qgcm9vdEVsID0gdGVtcGxhdGUuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZFxuICAgIHJvb3RFbC5pZCA9IHRoaXMuaWRcbiAgICByb290RWwuc2V0QXR0cmlidXRlKFBIWF9ST09UX0lELCB0aGlzLnJvb3QuaWQpXG4gICAgcm9vdEVsLnNldEF0dHJpYnV0ZShQSFhfU0VTU0lPTiwgdGhpcy5nZXRTZXNzaW9uKCkpXG4gICAgcm9vdEVsLnNldEF0dHJpYnV0ZShQSFhfU1RBVElDLCB0aGlzLmdldFN0YXRpYygpKVxuICAgIHJvb3RFbC5zZXRBdHRyaWJ1dGUoUEhYX1BBUkVOVF9JRCwgdGhpcy5wYXJlbnQgPyB0aGlzLnBhcmVudC5pZCA6IG51bGwpXG5cbiAgICAvLyB3ZSBnbyBvdmVyIGFsbCBmb3JtIGVsZW1lbnRzIGluIHRoZSBuZXcgSFRNTCBmb3IgdGhlIExWXG4gICAgLy8gYW5kIGxvb2sgZm9yIG9sZCBmb3JtcyBpbiB0aGUgYGZvcm1zRm9yUmVjb3ZlcnlgIG9iamVjdDtcbiAgICAvLyB0aGUgZm9ybXNGb3JSZWNvdmVyeSBjYW4gYWxzbyBjb250YWluIGZvcm1zIGZyb20gY2hpbGQgdmlld3NcbiAgICBjb25zdCBmb3Jtc1RvUmVjb3ZlciA9XG4gICAgICAvLyB3ZSBnbyBvdmVyIGFsbCBmb3JtcyBpbiB0aGUgbmV3IERPTTsgYmVjYXVzZSB0aGlzIGlzIG9ubHkgdGhlIEhUTUwgZm9yIHRoZSBjdXJyZW50XG4gICAgICAvLyB2aWV3LCB3ZSBjYW4gYmUgc3VyZSB0aGF0IGFsbCBmb3JtcyBhcmUgb3duZWQgYnkgdGhpcyB2aWV3OlxuICAgICAgRE9NLmFsbCh0ZW1wbGF0ZS5jb250ZW50LCBcImZvcm1cIilcbiAgICAgICAgLy8gb25seSByZWNvdmVyIGZvcm1zIHRoYXQgaGF2ZSBhbiBpZCBhbmQgYXJlIGluIHRoZSBvbGQgRE9NXG4gICAgICAgIC5maWx0ZXIobmV3Rm9ybSA9PiBuZXdGb3JtLmlkICYmIG9sZEZvcm1zW25ld0Zvcm0uaWRdKVxuICAgICAgICAvLyBhYmFuZG9uIGZvcm1zIHdlIGFscmVhZHkgdHJpZWQgdG8gcmVjb3ZlciB0byBwcmV2ZW50IGxvb3BpbmcgYSBmYWlsZWQgc3RhdGVcbiAgICAgICAgLmZpbHRlcihuZXdGb3JtID0+ICF0aGlzLnBlbmRpbmdGb3Jtcy5oYXMobmV3Rm9ybS5pZCkpXG4gICAgICAgIC8vIG9ubHkgcmVjb3ZlciBpZiB0aGUgZm9ybSBoYXMgdGhlIHNhbWUgcGh4LWNoYW5nZSB2YWx1ZVxuICAgICAgICAuZmlsdGVyKG5ld0Zvcm0gPT4gb2xkRm9ybXNbbmV3Rm9ybS5pZF0uZ2V0QXR0cmlidXRlKHBoeENoYW5nZSkgPT09IG5ld0Zvcm0uZ2V0QXR0cmlidXRlKHBoeENoYW5nZSkpXG4gICAgICAgIC5tYXAobmV3Rm9ybSA9PiB7XG4gICAgICAgICAgcmV0dXJuIFtvbGRGb3Jtc1tuZXdGb3JtLmlkXSwgbmV3Rm9ybV1cbiAgICAgICAgfSlcblxuICAgIGlmKGZvcm1zVG9SZWNvdmVyLmxlbmd0aCA9PT0gMCl7XG4gICAgICByZXR1cm4gY2FsbGJhY2soKVxuICAgIH1cblxuICAgIGZvcm1zVG9SZWNvdmVyLmZvckVhY2goKFtvbGRGb3JtLCBuZXdGb3JtXSwgaSkgPT4ge1xuICAgICAgdGhpcy5wZW5kaW5nRm9ybXMuYWRkKG5ld0Zvcm0uaWQpXG4gICAgICAvLyBpdCBpcyBpbXBvcnRhbnQgdG8gdXNlIHRoZSBmaXJzdEVsZW1lbnRDaGlsZCBvZiB0aGUgdGVtcGxhdGUgY29udGVudFxuICAgICAgLy8gYmVjYXVzZSB3aGVuIHRyYXZlcnNpbmcgYSBkb2N1bWVudEZyYWdtZW50IHVzaW5nIHBhcmVudE5vZGUsIHdlIHdvbid0IGV2ZXIgYXJyaXZlIGF0XG4gICAgICAvLyB0aGUgZnJhZ21lbnQ7IGFzIHRoZSB0ZW1wbGF0ZSBpcyBhbHdheXMgYSBMaXZlVmlldywgd2UgY2FuIGJlIHN1cmUgdGhhdCB0aGVyZSBpcyBvbmx5XG4gICAgICAvLyBvbmUgY2hpbGQgb24gdGhlIHJvb3QgbGV2ZWxcbiAgICAgIHRoaXMucHVzaEZvcm1SZWNvdmVyeShvbGRGb3JtLCBuZXdGb3JtLCB0ZW1wbGF0ZS5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkLCAoKSA9PiB7XG4gICAgICAgIHRoaXMucGVuZGluZ0Zvcm1zLmRlbGV0ZShuZXdGb3JtLmlkKVxuICAgICAgICAvLyB3ZSBvbmx5IGNhbGwgdGhlIGNhbGxiYWNrIG9uY2UgYWxsIGZvcm1zIGhhdmUgYmVlbiByZWNvdmVyZWRcbiAgICAgICAgaWYoaSA9PT0gZm9ybXNUb1JlY292ZXIubGVuZ3RoIC0gMSl7XG4gICAgICAgICAgY2FsbGJhY2soKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBnZXRDaGlsZEJ5SWQoaWQpeyByZXR1cm4gdGhpcy5yb290LmNoaWxkcmVuW3RoaXMuaWRdW2lkXSB9XG5cbiAgZ2V0RGVzY2VuZGVudEJ5RWwoZWwpe1xuICAgIGlmKGVsLmlkID09PSB0aGlzLmlkKXtcbiAgICAgIHJldHVybiB0aGlzXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuW2VsLmdldEF0dHJpYnV0ZShQSFhfUEFSRU5UX0lEKV0/LltlbC5pZF1cbiAgICB9XG4gIH1cblxuICBkZXN0cm95RGVzY2VuZGVudChpZCl7XG4gICAgZm9yKGxldCBwYXJlbnRJZCBpbiB0aGlzLnJvb3QuY2hpbGRyZW4pe1xuICAgICAgZm9yKGxldCBjaGlsZElkIGluIHRoaXMucm9vdC5jaGlsZHJlbltwYXJlbnRJZF0pe1xuICAgICAgICBpZihjaGlsZElkID09PSBpZCl7IHJldHVybiB0aGlzLnJvb3QuY2hpbGRyZW5bcGFyZW50SWRdW2NoaWxkSWRdLmRlc3Ryb3koKSB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgam9pbkNoaWxkKGVsKXtcbiAgICBsZXQgY2hpbGQgPSB0aGlzLmdldENoaWxkQnlJZChlbC5pZClcbiAgICBpZighY2hpbGQpe1xuICAgICAgbGV0IHZpZXcgPSBuZXcgVmlldyhlbCwgdGhpcy5saXZlU29ja2V0LCB0aGlzKVxuICAgICAgdGhpcy5yb290LmNoaWxkcmVuW3RoaXMuaWRdW3ZpZXcuaWRdID0gdmlld1xuICAgICAgdmlldy5qb2luKClcbiAgICAgIHRoaXMuY2hpbGRKb2lucysrXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIGlzSm9pblBlbmRpbmcoKXsgcmV0dXJuIHRoaXMuam9pblBlbmRpbmcgfVxuXG4gIGFja0pvaW4oX2NoaWxkKXtcbiAgICB0aGlzLmNoaWxkSm9pbnMtLVxuXG4gICAgaWYodGhpcy5jaGlsZEpvaW5zID09PSAwKXtcbiAgICAgIGlmKHRoaXMucGFyZW50KXtcbiAgICAgICAgdGhpcy5wYXJlbnQuYWNrSm9pbih0aGlzKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5vbkFsbENoaWxkSm9pbnNDb21wbGV0ZSgpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgb25BbGxDaGlsZEpvaW5zQ29tcGxldGUoKXtcbiAgICAvLyB3ZSBjYW4gY2xlYXIgcGVuZGluZyBmb3JtIHJlY292ZXJpZXMgbm93IHRoYXQgd2UndmUgam9pbmVkLlxuICAgIC8vIFRoZXkgZWl0aGVyIGFsbCByZXNvbHZlZCBvciB3ZXJlIGFiYW5kb25lZFxuICAgIHRoaXMucGVuZGluZ0Zvcm1zLmNsZWFyKClcbiAgICAvLyB3ZSBjYW4gYWxzbyBjbGVhciB0aGUgZm9ybXNGb3JSZWNvdmVyeSBvYmplY3QgdG8gbm90IGtlZXAgb2xkIGZvcm0gZWxlbWVudHMgYXJvdW5kXG4gICAgdGhpcy5mb3Jtc0ZvclJlY292ZXJ5ID0ge31cbiAgICB0aGlzLmpvaW5DYWxsYmFjaygoKSA9PiB7XG4gICAgICB0aGlzLnBlbmRpbmdKb2luT3BzLmZvckVhY2goKFt2aWV3LCBvcF0pID0+IHtcbiAgICAgICAgaWYoIXZpZXcuaXNEZXN0cm95ZWQoKSl7IG9wKCkgfVxuICAgICAgfSlcbiAgICAgIHRoaXMucGVuZGluZ0pvaW5PcHMgPSBbXVxuICAgIH0pXG4gIH1cblxuICB1cGRhdGUoZGlmZiwgZXZlbnRzKXtcbiAgICBpZih0aGlzLmlzSm9pblBlbmRpbmcoKSB8fCAodGhpcy5saXZlU29ja2V0Lmhhc1BlbmRpbmdMaW5rKCkgJiYgdGhpcy5yb290LmlzTWFpbigpKSl7XG4gICAgICByZXR1cm4gdGhpcy5wZW5kaW5nRGlmZnMucHVzaCh7ZGlmZiwgZXZlbnRzfSlcbiAgICB9XG5cbiAgICB0aGlzLnJlbmRlcmVkLm1lcmdlRGlmZihkaWZmKVxuICAgIGxldCBwaHhDaGlsZHJlbkFkZGVkID0gZmFsc2VcblxuICAgIC8vIFdoZW4gdGhlIGRpZmYgb25seSBjb250YWlucyBjb21wb25lbnQgZGlmZnMsIHRoZW4gd2FsayBjb21wb25lbnRzXG4gICAgLy8gYW5kIHBhdGNoIG9ubHkgdGhlIHBhcmVudCBjb21wb25lbnQgY29udGFpbmVycyBmb3VuZCBpbiB0aGUgZGlmZi5cbiAgICAvLyBPdGhlcndpc2UsIHBhdGNoIGVudGlyZSBMViBjb250YWluZXIuXG4gICAgaWYodGhpcy5yZW5kZXJlZC5pc0NvbXBvbmVudE9ubHlEaWZmKGRpZmYpKXtcbiAgICAgIHRoaXMubGl2ZVNvY2tldC50aW1lKFwiY29tcG9uZW50IHBhdGNoIGNvbXBsZXRlXCIsICgpID0+IHtcbiAgICAgICAgbGV0IHBhcmVudENpZHMgPSBET00uZmluZEV4aXN0aW5nUGFyZW50Q0lEcyh0aGlzLmVsLCB0aGlzLnJlbmRlcmVkLmNvbXBvbmVudENJRHMoZGlmZikpXG4gICAgICAgIHBhcmVudENpZHMuZm9yRWFjaChwYXJlbnRDSUQgPT4ge1xuICAgICAgICAgIGlmKHRoaXMuY29tcG9uZW50UGF0Y2godGhpcy5yZW5kZXJlZC5nZXRDb21wb25lbnQoZGlmZiwgcGFyZW50Q0lEKSwgcGFyZW50Q0lEKSl7IHBoeENoaWxkcmVuQWRkZWQgPSB0cnVlIH1cbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSBlbHNlIGlmKCFpc0VtcHR5KGRpZmYpKXtcbiAgICAgIHRoaXMubGl2ZVNvY2tldC50aW1lKFwiZnVsbCBwYXRjaCBjb21wbGV0ZVwiLCAoKSA9PiB7XG4gICAgICAgIGxldCBbaHRtbCwgc3RyZWFtc10gPSB0aGlzLnJlbmRlckNvbnRhaW5lcihkaWZmLCBcInVwZGF0ZVwiKVxuICAgICAgICBsZXQgcGF0Y2ggPSBuZXcgRE9NUGF0Y2godGhpcywgdGhpcy5lbCwgdGhpcy5pZCwgaHRtbCwgc3RyZWFtcywgbnVsbClcbiAgICAgICAgcGh4Q2hpbGRyZW5BZGRlZCA9IHRoaXMucGVyZm9ybVBhdGNoKHBhdGNoLCB0cnVlKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICB0aGlzLmxpdmVTb2NrZXQuZGlzcGF0Y2hFdmVudHMoZXZlbnRzKVxuICAgIGlmKHBoeENoaWxkcmVuQWRkZWQpeyB0aGlzLmpvaW5OZXdDaGlsZHJlbigpIH1cbiAgfVxuXG4gIHJlbmRlckNvbnRhaW5lcihkaWZmLCBraW5kKXtcbiAgICByZXR1cm4gdGhpcy5saXZlU29ja2V0LnRpbWUoYHRvU3RyaW5nIGRpZmYgKCR7a2luZH0pYCwgKCkgPT4ge1xuICAgICAgbGV0IHRhZyA9IHRoaXMuZWwudGFnTmFtZVxuICAgICAgLy8gRG9uJ3Qgc2tpcCBhbnkgY29tcG9uZW50IGluIHRoZSBkaWZmIG5vciBhbnkgbWFya2VkIGFzIHBydW5lZFxuICAgICAgLy8gKGFzIHRoZXkgbWF5IGhhdmUgYmVlbiBhZGRlZCBiYWNrKVxuICAgICAgbGV0IGNpZHMgPSBkaWZmID8gdGhpcy5yZW5kZXJlZC5jb21wb25lbnRDSURzKGRpZmYpIDogbnVsbFxuICAgICAgbGV0IFtodG1sLCBzdHJlYW1zXSA9IHRoaXMucmVuZGVyZWQudG9TdHJpbmcoY2lkcylcbiAgICAgIHJldHVybiBbYDwke3RhZ30+JHtodG1sfTwvJHt0YWd9PmAsIHN0cmVhbXNdXG4gICAgfSlcbiAgfVxuXG4gIGNvbXBvbmVudFBhdGNoKGRpZmYsIGNpZCl7XG4gICAgaWYoaXNFbXB0eShkaWZmKSkgcmV0dXJuIGZhbHNlXG4gICAgbGV0IFtodG1sLCBzdHJlYW1zXSA9IHRoaXMucmVuZGVyZWQuY29tcG9uZW50VG9TdHJpbmcoY2lkKVxuICAgIGxldCBwYXRjaCA9IG5ldyBET01QYXRjaCh0aGlzLCB0aGlzLmVsLCB0aGlzLmlkLCBodG1sLCBzdHJlYW1zLCBjaWQpXG4gICAgbGV0IGNoaWxkcmVuQWRkZWQgPSB0aGlzLnBlcmZvcm1QYXRjaChwYXRjaCwgdHJ1ZSlcbiAgICByZXR1cm4gY2hpbGRyZW5BZGRlZFxuICB9XG5cbiAgZ2V0SG9vayhlbCl7IHJldHVybiB0aGlzLnZpZXdIb29rc1tWaWV3SG9vay5lbGVtZW50SUQoZWwpXSB9XG5cbiAgYWRkSG9vayhlbCl7XG4gICAgbGV0IGhvb2tFbElkID0gVmlld0hvb2suZWxlbWVudElEKGVsKVxuXG4gICAgLy8gb25seSBldmVyIHRyeSB0byBhZGQgaG9va3MgdG8gZWxlbWVudHMgb3duZWQgYnkgdGhpcyB2aWV3XG4gICAgaWYoZWwuZ2V0QXR0cmlidXRlICYmICF0aGlzLm93bnNFbGVtZW50KGVsKSl7IHJldHVybiB9XG5cbiAgICBpZihob29rRWxJZCAmJiAhdGhpcy52aWV3SG9va3NbaG9va0VsSWRdKXtcbiAgICAgIC8vIGhvb2sgY3JlYXRlZCwgYnV0IG5vdCBhdHRhY2hlZCAoY3JlYXRlSG9vayBmb3Igd2ViIGNvbXBvbmVudClcbiAgICAgIGxldCBob29rID0gRE9NLmdldEN1c3RvbUVsSG9vayhlbCkgfHwgbG9nRXJyb3IoYG5vIGhvb2sgZm91bmQgZm9yIGN1c3RvbSBlbGVtZW50OiAke2VsLmlkfWApXG4gICAgICB0aGlzLnZpZXdIb29rc1tob29rRWxJZF0gPSBob29rXG4gICAgICBob29rLl9fYXR0YWNoVmlldyh0aGlzKVxuICAgICAgcmV0dXJuIGhvb2tcbiAgICB9XG4gICAgZWxzZSBpZihob29rRWxJZCB8fCAhZWwuZ2V0QXR0cmlidXRlKXtcbiAgICAgIC8vIG5vIGhvb2sgZm91bmRcbiAgICAgIHJldHVyblxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBuZXcgaG9vayBmb3VuZCB3aXRoIHBoeC1ob29rIGF0dHJpYnV0ZVxuICAgICAgbGV0IGhvb2tOYW1lID0gZWwuZ2V0QXR0cmlidXRlKGBkYXRhLXBoeC0ke1BIWF9IT09LfWApIHx8IGVsLmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoUEhYX0hPT0spKVxuICAgICAgbGV0IGNhbGxiYWNrcyA9IHRoaXMubGl2ZVNvY2tldC5nZXRIb29rQ2FsbGJhY2tzKGhvb2tOYW1lKVxuXG4gICAgICBpZihjYWxsYmFja3Mpe1xuICAgICAgICBpZighZWwuaWQpeyBsb2dFcnJvcihgbm8gRE9NIElEIGZvciBob29rIFwiJHtob29rTmFtZX1cIi4gSG9va3MgcmVxdWlyZSBhIHVuaXF1ZSBJRCBvbiBlYWNoIGVsZW1lbnQuYCwgZWwpIH1cbiAgICAgICAgbGV0IGhvb2sgPSBuZXcgVmlld0hvb2sodGhpcywgZWwsIGNhbGxiYWNrcylcbiAgICAgICAgdGhpcy52aWV3SG9va3NbVmlld0hvb2suZWxlbWVudElEKGhvb2suZWwpXSA9IGhvb2tcbiAgICAgICAgcmV0dXJuIGhvb2tcbiAgICAgIH0gZWxzZSBpZihob29rTmFtZSAhPT0gbnVsbCl7XG4gICAgICAgIGxvZ0Vycm9yKGB1bmtub3duIGhvb2sgZm91bmQgZm9yIFwiJHtob29rTmFtZX1cImAsIGVsKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGRlc3Ryb3lIb29rKGhvb2spe1xuICAgIC8vIF9fZGVzdHJveWVkIGNsZWFycyB0aGUgZWxlbWVudElEIGZyb20gdGhlIGhvb2ssIHRoZXJlZm9yZVxuICAgIC8vIHdlIG5lZWQgdG8gZ2V0IGl0IGJlZm9yZSBjYWxsaW5nIF9fZGVzdHJveWVkXG4gICAgY29uc3QgaG9va0lkID0gVmlld0hvb2suZWxlbWVudElEKGhvb2suZWwpXG4gICAgaG9vay5fX2Rlc3Ryb3llZCgpXG4gICAgaG9vay5fX2NsZWFudXBfXygpXG4gICAgZGVsZXRlIHRoaXMudmlld0hvb2tzW2hvb2tJZF1cbiAgfVxuXG4gIGFwcGx5UGVuZGluZ1VwZGF0ZXMoKXtcbiAgICAvLyBwcmV2ZW50IHJhY2UgY29uZGl0aW9ucyB3aGVyZSB3ZSBtaWdodCBzdGlsbCBiZSBwZW5kaW5nIGEgbmV3XG4gICAgLy8gbmF2aWdhdGlvbiBhZnRlciBhcHBseWluZyB0aGUgY3VycmVudCBvbmU7XG4gICAgLy8gaWYgd2UgY2FsbCB1cGRhdGUgYW5kIGEgcGVuZGluZ0RpZmYgaXMgbm90IGFwcGxpZWQsIGl0IHdvdWxkXG4gICAgLy8gYmUgc2lsZW50bHkgZHJvcHBlZCBvdGhlcndpc2UsIGFzIHVwZGF0ZSB3b3VsZCBwdXNoIGl0IGJhY2sgdG9cbiAgICAvLyBwZW5kaW5nRGlmZnMsIGJ1dCB3ZSBjbGVhciBpdCBpbW1lZGlhdGVseSBhZnRlclxuICAgIGlmKHRoaXMubGl2ZVNvY2tldC5oYXNQZW5kaW5nTGluaygpICYmIHRoaXMucm9vdC5pc01haW4oKSl7IHJldHVybiB9XG4gICAgdGhpcy5wZW5kaW5nRGlmZnMuZm9yRWFjaCgoe2RpZmYsIGV2ZW50c30pID0+IHRoaXMudXBkYXRlKGRpZmYsIGV2ZW50cykpXG4gICAgdGhpcy5wZW5kaW5nRGlmZnMgPSBbXVxuICAgIHRoaXMuZWFjaENoaWxkKGNoaWxkID0+IGNoaWxkLmFwcGx5UGVuZGluZ1VwZGF0ZXMoKSlcbiAgfVxuXG4gIGVhY2hDaGlsZChjYWxsYmFjayl7XG4gICAgbGV0IGNoaWxkcmVuID0gdGhpcy5yb290LmNoaWxkcmVuW3RoaXMuaWRdIHx8IHt9XG4gICAgZm9yKGxldCBpZCBpbiBjaGlsZHJlbil7IGNhbGxiYWNrKHRoaXMuZ2V0Q2hpbGRCeUlkKGlkKSkgfVxuICB9XG5cbiAgb25DaGFubmVsKGV2ZW50LCBjYil7XG4gICAgdGhpcy5saXZlU29ja2V0Lm9uQ2hhbm5lbCh0aGlzLmNoYW5uZWwsIGV2ZW50LCByZXNwID0+IHtcbiAgICAgIGlmKHRoaXMuaXNKb2luUGVuZGluZygpKXtcbiAgICAgICAgdGhpcy5yb290LnBlbmRpbmdKb2luT3BzLnB1c2goW3RoaXMsICgpID0+IGNiKHJlc3ApXSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubGl2ZVNvY2tldC5yZXF1ZXN0RE9NVXBkYXRlKCgpID0+IGNiKHJlc3ApKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBiaW5kQ2hhbm5lbCgpe1xuICAgIC8vIFRoZSBkaWZmIGV2ZW50IHNob3VsZCBiZSBoYW5kbGVkIGJ5IHRoZSByZWd1bGFyIHVwZGF0ZSBvcGVyYXRpb25zLlxuICAgIC8vIEFsbCBvdGhlciBvcGVyYXRpb25zIGFyZSBxdWV1ZWQgdG8gYmUgYXBwbGllZCBvbmx5IGFmdGVyIGpvaW4uXG4gICAgdGhpcy5saXZlU29ja2V0Lm9uQ2hhbm5lbCh0aGlzLmNoYW5uZWwsIFwiZGlmZlwiLCAocmF3RGlmZikgPT4ge1xuICAgICAgdGhpcy5saXZlU29ja2V0LnJlcXVlc3RET01VcGRhdGUoKCkgPT4ge1xuICAgICAgICB0aGlzLmFwcGx5RGlmZihcInVwZGF0ZVwiLCByYXdEaWZmLCAoe2RpZmYsIGV2ZW50c30pID0+IHRoaXMudXBkYXRlKGRpZmYsIGV2ZW50cykpXG4gICAgICB9KVxuICAgIH0pXG4gICAgdGhpcy5vbkNoYW5uZWwoXCJyZWRpcmVjdFwiLCAoe3RvLCBmbGFzaH0pID0+IHRoaXMub25SZWRpcmVjdCh7dG8sIGZsYXNofSkpXG4gICAgdGhpcy5vbkNoYW5uZWwoXCJsaXZlX3BhdGNoXCIsIChyZWRpcikgPT4gdGhpcy5vbkxpdmVQYXRjaChyZWRpcikpXG4gICAgdGhpcy5vbkNoYW5uZWwoXCJsaXZlX3JlZGlyZWN0XCIsIChyZWRpcikgPT4gdGhpcy5vbkxpdmVSZWRpcmVjdChyZWRpcikpXG4gICAgdGhpcy5jaGFubmVsLm9uRXJyb3IocmVhc29uID0+IHRoaXMub25FcnJvcihyZWFzb24pKVxuICAgIHRoaXMuY2hhbm5lbC5vbkNsb3NlKHJlYXNvbiA9PiB0aGlzLm9uQ2xvc2UocmVhc29uKSlcbiAgfVxuXG4gIGRlc3Ryb3lBbGxDaGlsZHJlbigpeyB0aGlzLmVhY2hDaGlsZChjaGlsZCA9PiBjaGlsZC5kZXN0cm95KCkpIH1cblxuICBvbkxpdmVSZWRpcmVjdChyZWRpcil7XG4gICAgbGV0IHt0bywga2luZCwgZmxhc2h9ID0gcmVkaXJcbiAgICBsZXQgdXJsID0gdGhpcy5leHBhbmRVUkwodG8pXG4gICAgbGV0IGUgPSBuZXcgQ3VzdG9tRXZlbnQoXCJwaHg6c2VydmVyLW5hdmlnYXRlXCIsIHtkZXRhaWw6IHt0bywga2luZCwgZmxhc2h9fSlcbiAgICB0aGlzLmxpdmVTb2NrZXQuaGlzdG9yeVJlZGlyZWN0KGUsIHVybCwga2luZCwgZmxhc2gpXG4gIH1cblxuICBvbkxpdmVQYXRjaChyZWRpcil7XG4gICAgbGV0IHt0bywga2luZH0gPSByZWRpclxuICAgIHRoaXMuaHJlZiA9IHRoaXMuZXhwYW5kVVJMKHRvKVxuICAgIHRoaXMubGl2ZVNvY2tldC5oaXN0b3J5UGF0Y2godG8sIGtpbmQpXG4gIH1cblxuICBleHBhbmRVUkwodG8pe1xuICAgIHJldHVybiB0by5zdGFydHNXaXRoKFwiL1wiKSA/IGAke3dpbmRvdy5sb2NhdGlvbi5wcm90b2NvbH0vLyR7d2luZG93LmxvY2F0aW9uLmhvc3R9JHt0b31gIDogdG9cbiAgfVxuXG4gIG9uUmVkaXJlY3Qoe3RvLCBmbGFzaCwgcmVsb2FkVG9rZW59KXsgdGhpcy5saXZlU29ja2V0LnJlZGlyZWN0KHRvLCBmbGFzaCwgcmVsb2FkVG9rZW4pIH1cblxuICBpc0Rlc3Ryb3llZCgpeyByZXR1cm4gdGhpcy5kZXN0cm95ZWQgfVxuXG4gIGpvaW5EZWFkKCl7IHRoaXMuaXNEZWFkID0gdHJ1ZSB9XG5cbiAgam9pblB1c2goKXtcbiAgICB0aGlzLmpvaW5QdXNoID0gdGhpcy5qb2luUHVzaCB8fCB0aGlzLmNoYW5uZWwuam9pbigpXG4gICAgcmV0dXJuIHRoaXMuam9pblB1c2hcbiAgfVxuXG4gIGpvaW4oY2FsbGJhY2spe1xuICAgIHRoaXMuc2hvd0xvYWRlcih0aGlzLmxpdmVTb2NrZXQubG9hZGVyVGltZW91dClcbiAgICB0aGlzLmJpbmRDaGFubmVsKClcbiAgICBpZih0aGlzLmlzTWFpbigpKXtcbiAgICAgIHRoaXMuc3RvcENhbGxiYWNrID0gdGhpcy5saXZlU29ja2V0LndpdGhQYWdlTG9hZGluZyh7dG86IHRoaXMuaHJlZiwga2luZDogXCJpbml0aWFsXCJ9KVxuICAgIH1cbiAgICB0aGlzLmpvaW5DYWxsYmFjayA9IChvbkRvbmUpID0+IHtcbiAgICAgIG9uRG9uZSA9IG9uRG9uZSB8fCBmdW5jdGlvbigpe31cbiAgICAgIGNhbGxiYWNrID8gY2FsbGJhY2sodGhpcy5qb2luQ291bnQsIG9uRG9uZSkgOiBvbkRvbmUoKVxuICAgIH1cblxuICAgIHRoaXMud3JhcFB1c2goKCkgPT4gdGhpcy5jaGFubmVsLmpvaW4oKSwge1xuICAgICAgb2s6IChyZXNwKSA9PiB0aGlzLmxpdmVTb2NrZXQucmVxdWVzdERPTVVwZGF0ZSgoKSA9PiB0aGlzLm9uSm9pbihyZXNwKSksXG4gICAgICBlcnJvcjogKGVycm9yKSA9PiB0aGlzLm9uSm9pbkVycm9yKGVycm9yKSxcbiAgICAgIHRpbWVvdXQ6ICgpID0+IHRoaXMub25Kb2luRXJyb3Ioe3JlYXNvbjogXCJ0aW1lb3V0XCJ9KVxuICAgIH0pXG4gIH1cblxuICBvbkpvaW5FcnJvcihyZXNwKXtcbiAgICBpZihyZXNwLnJlYXNvbiA9PT0gXCJyZWxvYWRcIil7XG4gICAgICB0aGlzLmxvZyhcImVycm9yXCIsICgpID0+IFtgZmFpbGVkIG1vdW50IHdpdGggJHtyZXNwLnN0YXR1c30uIEZhbGxpbmcgYmFjayB0byBwYWdlIHJlbG9hZGAsIHJlc3BdKVxuICAgICAgdGhpcy5vblJlZGlyZWN0KHt0bzogdGhpcy5yb290LmhyZWYsIHJlbG9hZFRva2VuOiByZXNwLnRva2VufSlcbiAgICAgIHJldHVyblxuICAgIH0gZWxzZSBpZihyZXNwLnJlYXNvbiA9PT0gXCJ1bmF1dGhvcml6ZWRcIiB8fCByZXNwLnJlYXNvbiA9PT0gXCJzdGFsZVwiKXtcbiAgICAgIHRoaXMubG9nKFwiZXJyb3JcIiwgKCkgPT4gW1widW5hdXRob3JpemVkIGxpdmVfcmVkaXJlY3QuIEZhbGxpbmcgYmFjayB0byBwYWdlIHJlcXVlc3RcIiwgcmVzcF0pXG4gICAgICB0aGlzLm9uUmVkaXJlY3Qoe3RvOiB0aGlzLnJvb3QuaHJlZn0pXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaWYocmVzcC5yZWRpcmVjdCB8fCByZXNwLmxpdmVfcmVkaXJlY3Qpe1xuICAgICAgdGhpcy5qb2luUGVuZGluZyA9IGZhbHNlXG4gICAgICB0aGlzLmNoYW5uZWwubGVhdmUoKVxuICAgIH1cbiAgICBpZihyZXNwLnJlZGlyZWN0KXsgcmV0dXJuIHRoaXMub25SZWRpcmVjdChyZXNwLnJlZGlyZWN0KSB9XG4gICAgaWYocmVzcC5saXZlX3JlZGlyZWN0KXsgcmV0dXJuIHRoaXMub25MaXZlUmVkaXJlY3QocmVzcC5saXZlX3JlZGlyZWN0KSB9XG4gICAgdGhpcy5sb2coXCJlcnJvclwiLCAoKSA9PiBbXCJ1bmFibGUgdG8gam9pblwiLCByZXNwXSlcbiAgICBpZih0aGlzLmlzTWFpbigpKXtcbiAgICAgIHRoaXMuZGlzcGxheUVycm9yKFtQSFhfTE9BRElOR19DTEFTUywgUEhYX0VSUk9SX0NMQVNTLCBQSFhfU0VSVkVSX0VSUk9SX0NMQVNTXSlcbiAgICAgIGlmKHRoaXMubGl2ZVNvY2tldC5pc0Nvbm5lY3RlZCgpKXsgdGhpcy5saXZlU29ja2V0LnJlbG9hZFdpdGhKaXR0ZXIodGhpcykgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZih0aGlzLmpvaW5BdHRlbXB0cyA+PSBNQVhfQ0hJTERfSk9JTl9BVFRFTVBUUyl7XG4gICAgICAgIC8vIHB1dCB0aGUgcm9vdCByZXZpZXcgaW50byBwZXJtYW5lbnQgZXJyb3Igc3RhdGUsIGJ1dCBkb24ndCBkZXN0cm95IGl0IGFzIGl0IGNhbiByZW1haW4gYWN0aXZlXG4gICAgICAgIHRoaXMucm9vdC5kaXNwbGF5RXJyb3IoW1BIWF9MT0FESU5HX0NMQVNTLCBQSFhfRVJST1JfQ0xBU1MsIFBIWF9TRVJWRVJfRVJST1JfQ0xBU1NdKVxuICAgICAgICB0aGlzLmxvZyhcImVycm9yXCIsICgpID0+IFtgZ2l2aW5nIHVwIHRyeWluZyB0byBtb3VudCBhZnRlciAke01BWF9DSElMRF9KT0lOX0FUVEVNUFRTfSB0cmllc2AsIHJlc3BdKVxuICAgICAgICB0aGlzLmRlc3Ryb3koKVxuICAgICAgfVxuICAgICAgbGV0IHRydWVDaGlsZEVsID0gRE9NLmJ5SWQodGhpcy5lbC5pZClcbiAgICAgIGlmKHRydWVDaGlsZEVsKXtcbiAgICAgICAgRE9NLm1lcmdlQXR0cnModHJ1ZUNoaWxkRWwsIHRoaXMuZWwpXG4gICAgICAgIHRoaXMuZGlzcGxheUVycm9yKFtQSFhfTE9BRElOR19DTEFTUywgUEhYX0VSUk9SX0NMQVNTLCBQSFhfU0VSVkVSX0VSUk9SX0NMQVNTXSlcbiAgICAgICAgdGhpcy5lbCA9IHRydWVDaGlsZEVsXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRlc3Ryb3koKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9uQ2xvc2UocmVhc29uKXtcbiAgICBpZih0aGlzLmlzRGVzdHJveWVkKCkpeyByZXR1cm4gfVxuICAgIGlmKHRoaXMuaXNNYWluKCkgJiYgdGhpcy5saXZlU29ja2V0Lmhhc1BlbmRpbmdMaW5rKCkgJiYgcmVhc29uICE9PSBcImxlYXZlXCIpe1xuICAgICAgcmV0dXJuIHRoaXMubGl2ZVNvY2tldC5yZWxvYWRXaXRoSml0dGVyKHRoaXMpXG4gICAgfVxuICAgIHRoaXMuZGVzdHJveUFsbENoaWxkcmVuKClcbiAgICB0aGlzLmxpdmVTb2NrZXQuZHJvcEFjdGl2ZUVsZW1lbnQodGhpcylcbiAgICAvLyBkb2N1bWVudC5hY3RpdmVFbGVtZW50IGNhbiBiZSBudWxsIGluIEludGVybmV0IEV4cGxvcmVyIDExXG4gICAgaWYoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCl7IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuYmx1cigpIH1cbiAgICBpZih0aGlzLmxpdmVTb2NrZXQuaXNVbmxvYWRlZCgpKXtcbiAgICAgIHRoaXMuc2hvd0xvYWRlcihCRUZPUkVfVU5MT0FEX0xPQURFUl9USU1FT1VUKVxuICAgIH1cbiAgfVxuXG4gIG9uRXJyb3IocmVhc29uKXtcbiAgICB0aGlzLm9uQ2xvc2UocmVhc29uKVxuICAgIGlmKHRoaXMubGl2ZVNvY2tldC5pc0Nvbm5lY3RlZCgpKXsgdGhpcy5sb2coXCJlcnJvclwiLCAoKSA9PiBbXCJ2aWV3IGNyYXNoZWRcIiwgcmVhc29uXSkgfVxuICAgIGlmKCF0aGlzLmxpdmVTb2NrZXQuaXNVbmxvYWRlZCgpKXtcbiAgICAgIGlmKHRoaXMubGl2ZVNvY2tldC5pc0Nvbm5lY3RlZCgpKXtcbiAgICAgICAgdGhpcy5kaXNwbGF5RXJyb3IoW1BIWF9MT0FESU5HX0NMQVNTLCBQSFhfRVJST1JfQ0xBU1MsIFBIWF9TRVJWRVJfRVJST1JfQ0xBU1NdKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kaXNwbGF5RXJyb3IoW1BIWF9MT0FESU5HX0NMQVNTLCBQSFhfRVJST1JfQ0xBU1MsIFBIWF9DTElFTlRfRVJST1JfQ0xBU1NdKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGRpc3BsYXlFcnJvcihjbGFzc2VzKXtcbiAgICBpZih0aGlzLmlzTWFpbigpKXsgRE9NLmRpc3BhdGNoRXZlbnQod2luZG93LCBcInBoeDpwYWdlLWxvYWRpbmctc3RhcnRcIiwge2RldGFpbDoge3RvOiB0aGlzLmhyZWYsIGtpbmQ6IFwiZXJyb3JcIn19KSB9XG4gICAgdGhpcy5zaG93TG9hZGVyKClcbiAgICB0aGlzLnNldENvbnRhaW5lckNsYXNzZXMoLi4uY2xhc3NlcylcbiAgICB0aGlzLmRlbGF5ZWREaXNjb25uZWN0ZWQoKVxuICB9XG5cbiAgZGVsYXllZERpc2Nvbm5lY3RlZCgpe1xuICAgIHRoaXMuZGlzY29ubmVjdGVkVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuZXhlY0FsbCh0aGlzLmJpbmRpbmcoXCJkaXNjb25uZWN0ZWRcIikpXG4gICAgfSwgdGhpcy5saXZlU29ja2V0LmRpc2Nvbm5lY3RlZFRpbWVvdXQpXG4gIH1cblxuICB3cmFwUHVzaChjYWxsZXJQdXNoLCByZWNlaXZlcyl7XG4gICAgbGV0IGxhdGVuY3kgPSB0aGlzLmxpdmVTb2NrZXQuZ2V0TGF0ZW5jeVNpbSgpXG4gICAgbGV0IHdpdGhMYXRlbmN5ID0gbGF0ZW5jeSA/XG4gICAgICAoY2IpID0+IHNldFRpbWVvdXQoKCkgPT4gIXRoaXMuaXNEZXN0cm95ZWQoKSAmJiBjYigpLCBsYXRlbmN5KSA6XG4gICAgICAoY2IpID0+ICF0aGlzLmlzRGVzdHJveWVkKCkgJiYgY2IoKVxuXG4gICAgd2l0aExhdGVuY3koKCkgPT4ge1xuICAgICAgY2FsbGVyUHVzaCgpXG4gICAgICAgIC5yZWNlaXZlKFwib2tcIiwgcmVzcCA9PiB3aXRoTGF0ZW5jeSgoKSA9PiByZWNlaXZlcy5vayAmJiByZWNlaXZlcy5vayhyZXNwKSkpXG4gICAgICAgIC5yZWNlaXZlKFwiZXJyb3JcIiwgcmVhc29uID0+IHdpdGhMYXRlbmN5KCgpID0+IHJlY2VpdmVzLmVycm9yICYmIHJlY2VpdmVzLmVycm9yKHJlYXNvbikpKVxuICAgICAgICAucmVjZWl2ZShcInRpbWVvdXRcIiwgKCkgPT4gd2l0aExhdGVuY3koKCkgPT4gcmVjZWl2ZXMudGltZW91dCAmJiByZWNlaXZlcy50aW1lb3V0KCkpKVxuICAgIH0pXG4gIH1cblxuICBwdXNoV2l0aFJlcGx5KHJlZkdlbmVyYXRvciwgZXZlbnQsIHBheWxvYWQpe1xuICAgIGlmKCF0aGlzLmlzQ29ubmVjdGVkKCkpeyByZXR1cm4gUHJvbWlzZS5yZWplY3Qoe2Vycm9yOiBcIm5vY29ubmVjdGlvblwifSkgfVxuXG4gICAgbGV0IFtyZWYsIFtlbF0sIG9wdHNdID0gcmVmR2VuZXJhdG9yID8gcmVmR2VuZXJhdG9yKCkgOiBbbnVsbCwgW10sIHt9XVxuICAgIGxldCBvbGRKb2luQ291bnQgPSB0aGlzLmpvaW5Db3VudFxuICAgIGxldCBvbkxvYWRpbmdEb25lID0gZnVuY3Rpb24oKXt9XG4gICAgaWYob3B0cy5wYWdlX2xvYWRpbmcpe1xuICAgICAgb25Mb2FkaW5nRG9uZSA9IHRoaXMubGl2ZVNvY2tldC53aXRoUGFnZUxvYWRpbmcoe2tpbmQ6IFwiZWxlbWVudFwiLCB0YXJnZXQ6IGVsfSlcbiAgICB9XG5cbiAgICBpZih0eXBlb2YgKHBheWxvYWQuY2lkKSAhPT0gXCJudW1iZXJcIil7IGRlbGV0ZSBwYXlsb2FkLmNpZCB9XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy53cmFwUHVzaCgoKSA9PiB0aGlzLmNoYW5uZWwucHVzaChldmVudCwgcGF5bG9hZCwgUFVTSF9USU1FT1VUKSwge1xuICAgICAgICBvazogKHJlc3ApID0+IHtcbiAgICAgICAgICBpZihyZWYgIT09IG51bGwpeyB0aGlzLmxhc3RBY2tSZWYgPSByZWYgfVxuICAgICAgICAgIGxldCBmaW5pc2ggPSAoaG9va1JlcGx5KSA9PiB7XG4gICAgICAgICAgICBpZihyZXNwLnJlZGlyZWN0KXsgdGhpcy5vblJlZGlyZWN0KHJlc3AucmVkaXJlY3QpIH1cbiAgICAgICAgICAgIGlmKHJlc3AubGl2ZV9wYXRjaCl7IHRoaXMub25MaXZlUGF0Y2gocmVzcC5saXZlX3BhdGNoKSB9XG4gICAgICAgICAgICBpZihyZXNwLmxpdmVfcmVkaXJlY3QpeyB0aGlzLm9uTGl2ZVJlZGlyZWN0KHJlc3AubGl2ZV9yZWRpcmVjdCkgfVxuICAgICAgICAgICAgb25Mb2FkaW5nRG9uZSgpXG4gICAgICAgICAgICByZXNvbHZlKHtyZXNwOiByZXNwLCByZXBseTogaG9va1JlcGx5fSlcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYocmVzcC5kaWZmKXtcbiAgICAgICAgICAgIHRoaXMubGl2ZVNvY2tldC5yZXF1ZXN0RE9NVXBkYXRlKCgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5hcHBseURpZmYoXCJ1cGRhdGVcIiwgcmVzcC5kaWZmLCAoe2RpZmYsIHJlcGx5LCBldmVudHN9KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYocmVmICE9PSBudWxsKXtcbiAgICAgICAgICAgICAgICAgIHRoaXMudW5kb1JlZnMocmVmLCBwYXlsb2FkLmV2ZW50KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZShkaWZmLCBldmVudHMpXG4gICAgICAgICAgICAgICAgZmluaXNoKHJlcGx5KVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYocmVmICE9PSBudWxsKXsgdGhpcy51bmRvUmVmcyhyZWYsIHBheWxvYWQuZXZlbnQpIH1cbiAgICAgICAgICAgIGZpbmlzaChudWxsKVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6IChyZWFzb24pID0+IHJlamVjdCh7ZXJyb3I6IHJlYXNvbn0pLFxuICAgICAgICB0aW1lb3V0OiAoKSA9PiB7XG4gICAgICAgICAgcmVqZWN0KHt0aW1lb3V0OiB0cnVlfSlcbiAgICAgICAgICBpZih0aGlzLmpvaW5Db3VudCA9PT0gb2xkSm9pbkNvdW50KXtcbiAgICAgICAgICAgIHRoaXMubGl2ZVNvY2tldC5yZWxvYWRXaXRoSml0dGVyKHRoaXMsICgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5sb2coXCJ0aW1lb3V0XCIsICgpID0+IFtcInJlY2VpdmVkIHRpbWVvdXQgd2hpbGUgY29tbXVuaWNhdGluZyB3aXRoIHNlcnZlci4gRmFsbGluZyBiYWNrIHRvIGhhcmQgcmVmcmVzaCBmb3IgcmVjb3ZlcnlcIl0pXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgdW5kb1JlZnMocmVmLCBwaHhFdmVudCwgb25seUVscyl7XG4gICAgaWYoIXRoaXMuaXNDb25uZWN0ZWQoKSl7IHJldHVybiB9IC8vIGV4aXQgaWYgZXh0ZXJuYWwgZm9ybSB0cmlnZ2VyZWRcbiAgICBsZXQgc2VsZWN0b3IgPSBgWyR7UEhYX1JFRl9TUkN9PVwiJHt0aGlzLnJlZlNyYygpfVwiXWBcblxuICAgIGlmKG9ubHlFbHMpe1xuICAgICAgb25seUVscyA9IG5ldyBTZXQob25seUVscylcbiAgICAgIERPTS5hbGwoZG9jdW1lbnQsIHNlbGVjdG9yLCBwYXJlbnQgPT4ge1xuICAgICAgICBpZihvbmx5RWxzICYmICFvbmx5RWxzLmhhcyhwYXJlbnQpKXsgcmV0dXJuIH1cbiAgICAgICAgLy8gdW5kbyBhbnkgY2hpbGQgcmVmcyB3aXRoaW4gcGFyZW50IGZpcnN0XG4gICAgICAgIERPTS5hbGwocGFyZW50LCBzZWxlY3RvciwgY2hpbGQgPT4gdGhpcy51bmRvRWxSZWYoY2hpbGQsIHJlZiwgcGh4RXZlbnQpKVxuICAgICAgICB0aGlzLnVuZG9FbFJlZihwYXJlbnQsIHJlZiwgcGh4RXZlbnQpXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICBET00uYWxsKGRvY3VtZW50LCBzZWxlY3RvciwgZWwgPT4gdGhpcy51bmRvRWxSZWYoZWwsIHJlZiwgcGh4RXZlbnQpKVxuICAgIH1cbiAgfVxuXG4gIHVuZG9FbFJlZihlbCwgcmVmLCBwaHhFdmVudCl7XG4gICAgbGV0IGVsUmVmID0gbmV3IEVsZW1lbnRSZWYoZWwpXG5cbiAgICBlbFJlZi5tYXliZVVuZG8ocmVmLCBwaHhFdmVudCwgY2xvbmVkVHJlZSA9PiB7XG4gICAgICAvLyB3ZSBuZWVkIHRvIHBlcmZvcm0gYSBmdWxsIHBhdGNoIG9uIHVubG9ja2VkIGVsZW1lbnRzXG4gICAgICAvLyB0byBwZXJmb3JtIGFsbCB0aGUgbmVjZXNzYXJ5IGxvZ2ljIChsaWtlIGNhbGxpbmcgdXBkYXRlZCBmb3IgaG9va3MsIGV0Yy4pXG4gICAgICBsZXQgcGF0Y2ggPSBuZXcgRE9NUGF0Y2godGhpcywgZWwsIHRoaXMuaWQsIGNsb25lZFRyZWUsIFtdLCBudWxsLCB7dW5kb1JlZjogcmVmfSlcbiAgICAgIGNvbnN0IHBoeENoaWxkcmVuQWRkZWQgPSB0aGlzLnBlcmZvcm1QYXRjaChwYXRjaCwgdHJ1ZSlcbiAgICAgIERPTS5hbGwoZWwsIGBbJHtQSFhfUkVGX1NSQ309XCIke3RoaXMucmVmU3JjKCl9XCJdYCwgY2hpbGQgPT4gdGhpcy51bmRvRWxSZWYoY2hpbGQsIHJlZiwgcGh4RXZlbnQpKVxuICAgICAgaWYocGh4Q2hpbGRyZW5BZGRlZCl7IHRoaXMuam9pbk5ld0NoaWxkcmVuKCkgfVxuICAgIH0pXG4gIH1cblxuICByZWZTcmMoKXsgcmV0dXJuIHRoaXMuZWwuaWQgfVxuXG4gIHB1dFJlZihlbGVtZW50cywgcGh4RXZlbnQsIGV2ZW50VHlwZSwgb3B0cyA9IHt9KXtcbiAgICBsZXQgbmV3UmVmID0gdGhpcy5yZWYrK1xuICAgIGxldCBkaXNhYmxlV2l0aCA9IHRoaXMuYmluZGluZyhQSFhfRElTQUJMRV9XSVRIKVxuICAgIGlmKG9wdHMubG9hZGluZyl7XG4gICAgICBsZXQgbG9hZGluZ0VscyA9IERPTS5hbGwoZG9jdW1lbnQsIG9wdHMubG9hZGluZykubWFwKGVsID0+IHtcbiAgICAgICAgcmV0dXJuIHtlbCwgbG9jazogdHJ1ZSwgbG9hZGluZzogdHJ1ZX1cbiAgICAgIH0pXG4gICAgICBlbGVtZW50cyA9IGVsZW1lbnRzLmNvbmNhdChsb2FkaW5nRWxzKVxuICAgIH1cblxuICAgIGZvcihsZXQge2VsLCBsb2NrLCBsb2FkaW5nfSBvZiBlbGVtZW50cyl7XG4gICAgICBpZighbG9jayAmJiAhbG9hZGluZyl7IHRocm93IG5ldyBFcnJvcihcInB1dFJlZiByZXF1aXJlcyBsb2NrIG9yIGxvYWRpbmdcIikgfVxuICAgICAgZWwuc2V0QXR0cmlidXRlKFBIWF9SRUZfU1JDLCB0aGlzLnJlZlNyYygpKVxuICAgICAgaWYobG9hZGluZyl7IGVsLnNldEF0dHJpYnV0ZShQSFhfUkVGX0xPQURJTkcsIG5ld1JlZikgfVxuICAgICAgaWYobG9jayl7IGVsLnNldEF0dHJpYnV0ZShQSFhfUkVGX0xPQ0ssIG5ld1JlZikgfVxuXG4gICAgICBpZighbG9hZGluZyB8fCAob3B0cy5zdWJtaXR0ZXIgJiYgIShlbCA9PT0gb3B0cy5zdWJtaXR0ZXIgfHwgZWwgPT09IG9wdHMuZm9ybSkpKXsgY29udGludWUgfVxuXG4gICAgICBsZXQgbG9ja0NvbXBsZXRlUHJvbWlzZSA9IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKGBwaHg6dW5kby1sb2NrOiR7bmV3UmVmfWAsICgpID0+IHJlc29sdmUoZGV0YWlsKSwge29uY2U6IHRydWV9KVxuICAgICAgfSlcblxuICAgICAgbGV0IGxvYWRpbmdDb21wbGV0ZVByb21pc2UgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihgcGh4OnVuZG8tbG9hZGluZzoke25ld1JlZn1gLCAoKSA9PiByZXNvbHZlKGRldGFpbCksIHtvbmNlOiB0cnVlfSlcbiAgICAgIH0pXG5cbiAgICAgIGVsLmNsYXNzTGlzdC5hZGQoYHBoeC0ke2V2ZW50VHlwZX0tbG9hZGluZ2ApXG4gICAgICBsZXQgZGlzYWJsZVRleHQgPSBlbC5nZXRBdHRyaWJ1dGUoZGlzYWJsZVdpdGgpXG4gICAgICBpZihkaXNhYmxlVGV4dCAhPT0gbnVsbCl7XG4gICAgICAgIGlmKCFlbC5nZXRBdHRyaWJ1dGUoUEhYX0RJU0FCTEVfV0lUSF9SRVNUT1JFKSl7XG4gICAgICAgICAgZWwuc2V0QXR0cmlidXRlKFBIWF9ESVNBQkxFX1dJVEhfUkVTVE9SRSwgZWwuaW5uZXJUZXh0KVxuICAgICAgICB9XG4gICAgICAgIGlmKGRpc2FibGVUZXh0ICE9PSBcIlwiKXsgZWwuaW5uZXJUZXh0ID0gZGlzYWJsZVRleHQgfVxuICAgICAgICAvLyBQSFhfRElTQUJMRUQgY291bGQgaGF2ZSBhbHJlYWR5IGJlZW4gc2V0IGluIGRpc2FibGVGb3JtXG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZShQSFhfRElTQUJMRUQsIGVsLmdldEF0dHJpYnV0ZShQSFhfRElTQUJMRUQpIHx8IGVsLmRpc2FibGVkKVxuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiLCBcIlwiKVxuICAgICAgfVxuXG4gICAgICBsZXQgZGV0YWlsID0ge1xuICAgICAgICBldmVudDogcGh4RXZlbnQsXG4gICAgICAgIGV2ZW50VHlwZTogZXZlbnRUeXBlLFxuICAgICAgICByZWY6IG5ld1JlZixcbiAgICAgICAgaXNMb2FkaW5nOiBsb2FkaW5nLFxuICAgICAgICBpc0xvY2tlZDogbG9jayxcbiAgICAgICAgbG9ja0VsZW1lbnRzOiBlbGVtZW50cy5maWx0ZXIoKHtsb2NrfSkgPT4gbG9jaykubWFwKCh7ZWx9KSA9PiBlbCksXG4gICAgICAgIGxvYWRpbmdFbGVtZW50czogZWxlbWVudHMuZmlsdGVyKCh7bG9hZGluZ30pID0+IGxvYWRpbmcpLm1hcCgoe2VsfSkgPT4gZWwpLFxuICAgICAgICB1bmxvY2s6IChlbHMpID0+IHtcbiAgICAgICAgICBlbHMgPSBBcnJheS5pc0FycmF5KGVscykgPyBlbHMgOiBbZWxzXVxuICAgICAgICAgIHRoaXMudW5kb1JlZnMobmV3UmVmLCBwaHhFdmVudCwgZWxzKVxuICAgICAgICB9LFxuICAgICAgICBsb2NrQ29tcGxldGU6IGxvY2tDb21wbGV0ZVByb21pc2UsXG4gICAgICAgIGxvYWRpbmdDb21wbGV0ZTogbG9hZGluZ0NvbXBsZXRlUHJvbWlzZSxcbiAgICAgICAgbG9jazogKGxvY2tFbCkgPT4ge1xuICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgICAgIGlmKHRoaXMuaXNBY2tlZChuZXdSZWYpKXsgcmV0dXJuIHJlc29sdmUoZGV0YWlsKSB9XG4gICAgICAgICAgICBsb2NrRWwuc2V0QXR0cmlidXRlKFBIWF9SRUZfTE9DSywgbmV3UmVmKVxuICAgICAgICAgICAgbG9ja0VsLnNldEF0dHJpYnV0ZShQSFhfUkVGX1NSQywgdGhpcy5yZWZTcmMoKSlcbiAgICAgICAgICAgIGxvY2tFbC5hZGRFdmVudExpc3RlbmVyKGBwaHg6bG9jay1zdG9wOiR7bmV3UmVmfWAsICgpID0+IHJlc29sdmUoZGV0YWlsKSwge29uY2U6IHRydWV9KVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KFwicGh4OnB1c2hcIiwge1xuICAgICAgICBkZXRhaWw6IGRldGFpbCxcbiAgICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgICAgY2FuY2VsYWJsZTogZmFsc2VcbiAgICAgIH0pKVxuICAgICAgaWYocGh4RXZlbnQpe1xuICAgICAgICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChgcGh4OnB1c2g6JHtwaHhFdmVudH1gLCB7XG4gICAgICAgICAgZGV0YWlsOiBkZXRhaWwsXG4gICAgICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgICAgICBjYW5jZWxhYmxlOiBmYWxzZVxuICAgICAgICB9KSlcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFtuZXdSZWYsIGVsZW1lbnRzLm1hcCgoe2VsfSkgPT4gZWwpLCBvcHRzXVxuICB9XG5cbiAgaXNBY2tlZChyZWYpeyByZXR1cm4gdGhpcy5sYXN0QWNrUmVmICE9PSBudWxsICYmIHRoaXMubGFzdEFja1JlZiA+PSByZWYgfVxuXG4gIGNvbXBvbmVudElEKGVsKXtcbiAgICBsZXQgY2lkID0gZWwuZ2V0QXR0cmlidXRlICYmIGVsLmdldEF0dHJpYnV0ZShQSFhfQ09NUE9ORU5UKVxuICAgIHJldHVybiBjaWQgPyBwYXJzZUludChjaWQpIDogbnVsbFxuICB9XG5cbiAgdGFyZ2V0Q29tcG9uZW50SUQodGFyZ2V0LCB0YXJnZXRDdHgsIG9wdHMgPSB7fSl7XG4gICAgaWYoaXNDaWQodGFyZ2V0Q3R4KSl7IHJldHVybiB0YXJnZXRDdHggfVxuXG4gICAgbGV0IGNpZE9yU2VsZWN0b3IgPSBvcHRzLnRhcmdldCB8fCB0YXJnZXQuZ2V0QXR0cmlidXRlKHRoaXMuYmluZGluZyhcInRhcmdldFwiKSlcbiAgICBpZihpc0NpZChjaWRPclNlbGVjdG9yKSl7XG4gICAgICByZXR1cm4gcGFyc2VJbnQoY2lkT3JTZWxlY3RvcilcbiAgICB9IGVsc2UgaWYodGFyZ2V0Q3R4ICYmIChjaWRPclNlbGVjdG9yICE9PSBudWxsIHx8IG9wdHMudGFyZ2V0KSl7XG4gICAgICByZXR1cm4gdGhpcy5jbG9zZXN0Q29tcG9uZW50SUQodGFyZ2V0Q3R4KVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgfVxuXG4gIGNsb3Nlc3RDb21wb25lbnRJRCh0YXJnZXRDdHgpe1xuICAgIGlmKGlzQ2lkKHRhcmdldEN0eCkpe1xuICAgICAgcmV0dXJuIHRhcmdldEN0eFxuICAgIH0gZWxzZSBpZih0YXJnZXRDdHgpe1xuICAgICAgcmV0dXJuIG1heWJlKHRhcmdldEN0eC5jbG9zZXN0KGBbJHtQSFhfQ09NUE9ORU5UfV1gKSwgZWwgPT4gdGhpcy5vd25zRWxlbWVudChlbCkgJiYgdGhpcy5jb21wb25lbnRJRChlbCkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICB9XG5cbiAgcHVzaEhvb2tFdmVudChlbCwgdGFyZ2V0Q3R4LCBldmVudCwgcGF5bG9hZCwgb25SZXBseSl7XG4gICAgaWYoIXRoaXMuaXNDb25uZWN0ZWQoKSl7XG4gICAgICB0aGlzLmxvZyhcImhvb2tcIiwgKCkgPT4gW1widW5hYmxlIHRvIHB1c2ggaG9vayBldmVudC4gTGl2ZVZpZXcgbm90IGNvbm5lY3RlZFwiLCBldmVudCwgcGF5bG9hZF0pXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgbGV0IFtyZWYsIGVscywgb3B0c10gPSB0aGlzLnB1dFJlZihbe2VsLCBsb2FkaW5nOiB0cnVlLCBsb2NrOiB0cnVlfV0sIGV2ZW50LCBcImhvb2tcIilcbiAgICB0aGlzLnB1c2hXaXRoUmVwbHkoKCkgPT4gW3JlZiwgZWxzLCBvcHRzXSwgXCJldmVudFwiLCB7XG4gICAgICB0eXBlOiBcImhvb2tcIixcbiAgICAgIGV2ZW50OiBldmVudCxcbiAgICAgIHZhbHVlOiBwYXlsb2FkLFxuICAgICAgY2lkOiB0aGlzLmNsb3Nlc3RDb21wb25lbnRJRCh0YXJnZXRDdHgpXG4gICAgfSkudGhlbigoe3Jlc3A6IF9yZXNwLCByZXBseTogaG9va1JlcGx5fSkgPT4gb25SZXBseShob29rUmVwbHksIHJlZikpXG5cbiAgICByZXR1cm4gcmVmXG4gIH1cblxuICBleHRyYWN0TWV0YShlbCwgbWV0YSwgdmFsdWUpe1xuICAgIGxldCBwcmVmaXggPSB0aGlzLmJpbmRpbmcoXCJ2YWx1ZS1cIilcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgZWwuYXR0cmlidXRlcy5sZW5ndGg7IGkrKyl7XG4gICAgICBpZighbWV0YSl7IG1ldGEgPSB7fSB9XG4gICAgICBsZXQgbmFtZSA9IGVsLmF0dHJpYnV0ZXNbaV0ubmFtZVxuICAgICAgaWYobmFtZS5zdGFydHNXaXRoKHByZWZpeCkpeyBtZXRhW25hbWUucmVwbGFjZShwcmVmaXgsIFwiXCIpXSA9IGVsLmdldEF0dHJpYnV0ZShuYW1lKSB9XG4gICAgfVxuICAgIGlmKGVsLnZhbHVlICE9PSB1bmRlZmluZWQgJiYgIShlbCBpbnN0YW5jZW9mIEhUTUxGb3JtRWxlbWVudCkpe1xuICAgICAgaWYoIW1ldGEpeyBtZXRhID0ge30gfVxuICAgICAgbWV0YS52YWx1ZSA9IGVsLnZhbHVlXG5cbiAgICAgIGlmKGVsLnRhZ05hbWUgPT09IFwiSU5QVVRcIiAmJiBDSEVDS0FCTEVfSU5QVVRTLmluZGV4T2YoZWwudHlwZSkgPj0gMCAmJiAhZWwuY2hlY2tlZCl7XG4gICAgICAgIGRlbGV0ZSBtZXRhLnZhbHVlXG4gICAgICB9XG4gICAgfVxuICAgIGlmKHZhbHVlKXtcbiAgICAgIGlmKCFtZXRhKXsgbWV0YSA9IHt9IH1cbiAgICAgIGZvcihsZXQga2V5IGluIHZhbHVlKXsgbWV0YVtrZXldID0gdmFsdWVba2V5XSB9XG4gICAgfVxuICAgIHJldHVybiBtZXRhXG4gIH1cblxuICBwdXNoRXZlbnQodHlwZSwgZWwsIHRhcmdldEN0eCwgcGh4RXZlbnQsIG1ldGEsIG9wdHMgPSB7fSwgb25SZXBseSl7XG4gICAgdGhpcy5wdXNoV2l0aFJlcGx5KCgpID0+IHRoaXMucHV0UmVmKFt7ZWwsIGxvYWRpbmc6IHRydWUsIGxvY2s6IHRydWV9XSwgcGh4RXZlbnQsIHR5cGUsIG9wdHMpLCBcImV2ZW50XCIsIHtcbiAgICAgIHR5cGU6IHR5cGUsXG4gICAgICBldmVudDogcGh4RXZlbnQsXG4gICAgICB2YWx1ZTogdGhpcy5leHRyYWN0TWV0YShlbCwgbWV0YSwgb3B0cy52YWx1ZSksXG4gICAgICBjaWQ6IHRoaXMudGFyZ2V0Q29tcG9uZW50SUQoZWwsIHRhcmdldEN0eCwgb3B0cylcbiAgICB9KS50aGVuKCh7cmVwbHl9KSA9PiBvblJlcGx5ICYmIG9uUmVwbHkocmVwbHkpKVxuICB9XG5cbiAgcHVzaEZpbGVQcm9ncmVzcyhmaWxlRWwsIGVudHJ5UmVmLCBwcm9ncmVzcywgb25SZXBseSA9IGZ1bmN0aW9uICgpeyB9KXtcbiAgICB0aGlzLmxpdmVTb2NrZXQud2l0aGluT3duZXJzKGZpbGVFbC5mb3JtLCAodmlldywgdGFyZ2V0Q3R4KSA9PiB7XG4gICAgICB2aWV3LnB1c2hXaXRoUmVwbHkobnVsbCwgXCJwcm9ncmVzc1wiLCB7XG4gICAgICAgIGV2ZW50OiBmaWxlRWwuZ2V0QXR0cmlidXRlKHZpZXcuYmluZGluZyhQSFhfUFJPR1JFU1MpKSxcbiAgICAgICAgcmVmOiBmaWxlRWwuZ2V0QXR0cmlidXRlKFBIWF9VUExPQURfUkVGKSxcbiAgICAgICAgZW50cnlfcmVmOiBlbnRyeVJlZixcbiAgICAgICAgcHJvZ3Jlc3M6IHByb2dyZXNzLFxuICAgICAgICBjaWQ6IHZpZXcudGFyZ2V0Q29tcG9uZW50SUQoZmlsZUVsLmZvcm0sIHRhcmdldEN0eClcbiAgICAgIH0pLnRoZW4oKHtyZXNwfSkgPT4gb25SZXBseShyZXNwKSlcbiAgICB9KVxuICB9XG5cbiAgcHVzaElucHV0KGlucHV0RWwsIHRhcmdldEN0eCwgZm9yY2VDaWQsIHBoeEV2ZW50LCBvcHRzLCBjYWxsYmFjayl7XG4gICAgaWYoIWlucHV0RWwuZm9ybSl7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJmb3JtIGV2ZW50cyByZXF1aXJlIHRoZSBpbnB1dCB0byBiZSBpbnNpZGUgYSBmb3JtXCIpXG4gICAgfVxuXG4gICAgbGV0IHVwbG9hZHNcbiAgICBsZXQgY2lkID0gaXNDaWQoZm9yY2VDaWQpID8gZm9yY2VDaWQgOiB0aGlzLnRhcmdldENvbXBvbmVudElEKGlucHV0RWwuZm9ybSwgdGFyZ2V0Q3R4LCBvcHRzKVxuICAgIGxldCByZWZHZW5lcmF0b3IgPSAoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5wdXRSZWYoW1xuICAgICAgICB7ZWw6IGlucHV0RWwsIGxvYWRpbmc6IHRydWUsIGxvY2s6IHRydWV9LFxuICAgICAgICB7ZWw6IGlucHV0RWwuZm9ybSwgbG9hZGluZzogdHJ1ZSwgbG9jazogdHJ1ZX1cbiAgICAgIF0sIHBoeEV2ZW50LCBcImNoYW5nZVwiLCBvcHRzKVxuICAgIH1cbiAgICBsZXQgZm9ybURhdGFcbiAgICBsZXQgbWV0YSA9IHRoaXMuZXh0cmFjdE1ldGEoaW5wdXRFbC5mb3JtLCB7fSwgb3B0cy52YWx1ZSlcbiAgICBsZXQgc2VyaWFsaXplT3B0cyA9IHt9XG4gICAgaWYoaW5wdXRFbCBpbnN0YW5jZW9mIEhUTUxCdXR0b25FbGVtZW50KXsgc2VyaWFsaXplT3B0cy5zdWJtaXR0ZXIgPSBpbnB1dEVsIH1cbiAgICBpZihpbnB1dEVsLmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoXCJjaGFuZ2VcIikpKXtcbiAgICAgIGZvcm1EYXRhID0gc2VyaWFsaXplRm9ybShpbnB1dEVsLmZvcm0sIHNlcmlhbGl6ZU9wdHMsIFtpbnB1dEVsLm5hbWVdKVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3JtRGF0YSA9IHNlcmlhbGl6ZUZvcm0oaW5wdXRFbC5mb3JtLCBzZXJpYWxpemVPcHRzKVxuICAgIH1cbiAgICBpZihET00uaXNVcGxvYWRJbnB1dChpbnB1dEVsKSAmJiBpbnB1dEVsLmZpbGVzICYmIGlucHV0RWwuZmlsZXMubGVuZ3RoID4gMCl7XG4gICAgICBMaXZlVXBsb2FkZXIudHJhY2tGaWxlcyhpbnB1dEVsLCBBcnJheS5mcm9tKGlucHV0RWwuZmlsZXMpKVxuICAgIH1cbiAgICB1cGxvYWRzID0gTGl2ZVVwbG9hZGVyLnNlcmlhbGl6ZVVwbG9hZHMoaW5wdXRFbClcblxuICAgIGxldCBldmVudCA9IHtcbiAgICAgIHR5cGU6IFwiZm9ybVwiLFxuICAgICAgZXZlbnQ6IHBoeEV2ZW50LFxuICAgICAgdmFsdWU6IGZvcm1EYXRhLFxuICAgICAgbWV0YToge1xuICAgICAgICAvLyBubyB0YXJnZXQgd2FzIGltcGxpY2l0bHkgc2VudCBhcyBcInVuZGVmaW5lZFwiIGluIExWIDw9IDEuMC41LCB0aGVyZWZvcmVcbiAgICAgICAgLy8gd2UgaGF2ZSB0byBrZWVwIGl0LiBJbiAxLjAuNiB3ZSBzd2l0Y2hlZCBmcm9tIHBhc3NpbmcgbWV0YSBhcyBVUkwgZW5jb2RlZCBkYXRhXG4gICAgICAgIC8vIHRvIHBhc3NpbmcgaXQgZGlyZWN0bHkgaW4gdGhlIGV2ZW50LCBidXQgdGhlIEpTT04gZW5jb2RlIHdvdWxkIGRyb3Aga2V5cyB3aXRoXG4gICAgICAgIC8vIHVuZGVmaW5lZCB2YWx1ZXMuXG4gICAgICAgIF90YXJnZXQ6IG9wdHMuX3RhcmdldCB8fCBcInVuZGVmaW5lZFwiLFxuICAgICAgICAuLi5tZXRhXG4gICAgICB9LFxuICAgICAgdXBsb2FkczogdXBsb2FkcyxcbiAgICAgIGNpZDogY2lkXG4gICAgfVxuICAgIHRoaXMucHVzaFdpdGhSZXBseShyZWZHZW5lcmF0b3IsIFwiZXZlbnRcIiwgZXZlbnQpLnRoZW4oKHtyZXNwfSkgPT4ge1xuICAgICAgaWYoRE9NLmlzVXBsb2FkSW5wdXQoaW5wdXRFbCkgJiYgRE9NLmlzQXV0b1VwbG9hZChpbnB1dEVsKSl7XG4gICAgICAgIC8vIHRoZSBlbGVtZW50IGNvdWxkIGJlIGluc2lkZSBhIGxvY2tlZCBwYXJlbnQgZm9yIG90aGVyIHVucmVsYXRlZCBjaGFuZ2VzO1xuICAgICAgICAvLyB3ZSBjYW4gb25seSBzdGFydCB1cGxvYWRzIHdoZW4gdGhlIHRyZWUgaXMgdW5sb2NrZWQgYW5kIHRoZVxuICAgICAgICAvLyBuZWNlc3NhcnkgZGF0YSBhdHRyaWJ1dGVzIGFyZSBzZXQgaW4gdGhlIHJlYWwgRE9NXG4gICAgICAgIEVsZW1lbnRSZWYub25VbmxvY2soaW5wdXRFbCwgKCkgPT4ge1xuICAgICAgICAgIGlmKExpdmVVcGxvYWRlci5maWxlc0F3YWl0aW5nUHJlZmxpZ2h0KGlucHV0RWwpLmxlbmd0aCA+IDApe1xuICAgICAgICAgICAgbGV0IFtyZWYsIF9lbHNdID0gcmVmR2VuZXJhdG9yKClcbiAgICAgICAgICAgIHRoaXMudW5kb1JlZnMocmVmLCBwaHhFdmVudCwgW2lucHV0RWwuZm9ybV0pXG4gICAgICAgICAgICB0aGlzLnVwbG9hZEZpbGVzKGlucHV0RWwuZm9ybSwgcGh4RXZlbnQsIHRhcmdldEN0eCwgcmVmLCBjaWQsIChfdXBsb2FkcykgPT4ge1xuICAgICAgICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjayhyZXNwKVxuICAgICAgICAgICAgICB0aGlzLnRyaWdnZXJBd2FpdGluZ1N1Ym1pdChpbnB1dEVsLmZvcm0sIHBoeEV2ZW50KVxuICAgICAgICAgICAgICB0aGlzLnVuZG9SZWZzKHJlZiwgcGh4RXZlbnQpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKHJlc3ApXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHRyaWdnZXJBd2FpdGluZ1N1Ym1pdChmb3JtRWwsIHBoeEV2ZW50KXtcbiAgICBsZXQgYXdhaXRpbmdTdWJtaXQgPSB0aGlzLmdldFNjaGVkdWxlZFN1Ym1pdChmb3JtRWwpXG4gICAgaWYoYXdhaXRpbmdTdWJtaXQpe1xuICAgICAgbGV0IFtfZWwsIF9yZWYsIF9vcHRzLCBjYWxsYmFja10gPSBhd2FpdGluZ1N1Ym1pdFxuICAgICAgdGhpcy5jYW5jZWxTdWJtaXQoZm9ybUVsLCBwaHhFdmVudClcbiAgICAgIGNhbGxiYWNrKClcbiAgICB9XG4gIH1cblxuICBnZXRTY2hlZHVsZWRTdWJtaXQoZm9ybUVsKXtcbiAgICByZXR1cm4gdGhpcy5mb3JtU3VibWl0cy5maW5kKChbZWwsIF9yZWYsIF9vcHRzLCBfY2FsbGJhY2tdKSA9PiBlbC5pc1NhbWVOb2RlKGZvcm1FbCkpXG4gIH1cblxuICBzY2hlZHVsZVN1Ym1pdChmb3JtRWwsIHJlZiwgb3B0cywgY2FsbGJhY2spe1xuICAgIGlmKHRoaXMuZ2V0U2NoZWR1bGVkU3VibWl0KGZvcm1FbCkpeyByZXR1cm4gdHJ1ZSB9XG4gICAgdGhpcy5mb3JtU3VibWl0cy5wdXNoKFtmb3JtRWwsIHJlZiwgb3B0cywgY2FsbGJhY2tdKVxuICB9XG5cbiAgY2FuY2VsU3VibWl0KGZvcm1FbCwgcGh4RXZlbnQpe1xuICAgIHRoaXMuZm9ybVN1Ym1pdHMgPSB0aGlzLmZvcm1TdWJtaXRzLmZpbHRlcigoW2VsLCByZWYsIF9vcHRzLCBfY2FsbGJhY2tdKSA9PiB7XG4gICAgICBpZihlbC5pc1NhbWVOb2RlKGZvcm1FbCkpe1xuICAgICAgICB0aGlzLnVuZG9SZWZzKHJlZiwgcGh4RXZlbnQpXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgZGlzYWJsZUZvcm0oZm9ybUVsLCBwaHhFdmVudCwgb3B0cyA9IHt9KXtcbiAgICBsZXQgZmlsdGVySWdub3JlZCA9IGVsID0+IHtcbiAgICAgIGxldCB1c2VySWdub3JlZCA9IGNsb3Nlc3RQaHhCaW5kaW5nKGVsLCBgJHt0aGlzLmJpbmRpbmcoUEhYX1VQREFURSl9PWlnbm9yZWAsIGVsLmZvcm0pXG4gICAgICByZXR1cm4gISh1c2VySWdub3JlZCB8fCBjbG9zZXN0UGh4QmluZGluZyhlbCwgXCJkYXRhLXBoeC11cGRhdGU9aWdub3JlXCIsIGVsLmZvcm0pKVxuICAgIH1cbiAgICBsZXQgZmlsdGVyRGlzYWJsZXMgPSBlbCA9PiB7XG4gICAgICByZXR1cm4gZWwuaGFzQXR0cmlidXRlKHRoaXMuYmluZGluZyhQSFhfRElTQUJMRV9XSVRIKSlcbiAgICB9XG4gICAgbGV0IGZpbHRlckJ1dHRvbiA9IGVsID0+IGVsLnRhZ05hbWUgPT0gXCJCVVRUT05cIlxuXG4gICAgbGV0IGZpbHRlcklucHV0ID0gZWwgPT4gW1wiSU5QVVRcIiwgXCJURVhUQVJFQVwiLCBcIlNFTEVDVFwiXS5pbmNsdWRlcyhlbC50YWdOYW1lKVxuXG4gICAgbGV0IGZvcm1FbGVtZW50cyA9IEFycmF5LmZyb20oZm9ybUVsLmVsZW1lbnRzKVxuICAgIGxldCBkaXNhYmxlcyA9IGZvcm1FbGVtZW50cy5maWx0ZXIoZmlsdGVyRGlzYWJsZXMpXG4gICAgbGV0IGJ1dHRvbnMgPSBmb3JtRWxlbWVudHMuZmlsdGVyKGZpbHRlckJ1dHRvbikuZmlsdGVyKGZpbHRlcklnbm9yZWQpXG4gICAgbGV0IGlucHV0cyA9IGZvcm1FbGVtZW50cy5maWx0ZXIoZmlsdGVySW5wdXQpLmZpbHRlcihmaWx0ZXJJZ25vcmVkKVxuXG4gICAgYnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiB7XG4gICAgICBidXR0b24uc2V0QXR0cmlidXRlKFBIWF9ESVNBQkxFRCwgYnV0dG9uLmRpc2FibGVkKVxuICAgICAgYnV0dG9uLmRpc2FibGVkID0gdHJ1ZVxuICAgIH0pXG4gICAgaW5wdXRzLmZvckVhY2goaW5wdXQgPT4ge1xuICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKFBIWF9SRUFET05MWSwgaW5wdXQucmVhZE9ubHkpXG4gICAgICBpbnB1dC5yZWFkT25seSA9IHRydWVcbiAgICAgIGlmKGlucHV0LmZpbGVzKXtcbiAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKFBIWF9ESVNBQkxFRCwgaW5wdXQuZGlzYWJsZWQpXG4gICAgICAgIGlucHV0LmRpc2FibGVkID0gdHJ1ZVxuICAgICAgfVxuICAgIH0pXG4gICAgbGV0IGZvcm1FbHMgPSBkaXNhYmxlcy5jb25jYXQoYnV0dG9ucykuY29uY2F0KGlucHV0cykubWFwKGVsID0+IHtcbiAgICAgIHJldHVybiB7ZWwsIGxvYWRpbmc6IHRydWUsIGxvY2s6IHRydWV9XG4gICAgfSlcblxuICAgIC8vIHdlIHJldmVyc2UgdGhlIG9yZGVyIHNvIGZvcm0gY2hpbGRyZW4gYXJlIGFscmVhZHkgbG9ja2VkIGJ5IHRoZSB0aW1lXG4gICAgLy8gdGhlIGZvcm0gaXMgbG9ja2VkXG4gICAgbGV0IGVscyA9IFt7ZWw6IGZvcm1FbCwgbG9hZGluZzogdHJ1ZSwgbG9jazogZmFsc2V9XS5jb25jYXQoZm9ybUVscykucmV2ZXJzZSgpXG4gICAgcmV0dXJuIHRoaXMucHV0UmVmKGVscywgcGh4RXZlbnQsIFwic3VibWl0XCIsIG9wdHMpXG4gIH1cblxuICBwdXNoRm9ybVN1Ym1pdChmb3JtRWwsIHRhcmdldEN0eCwgcGh4RXZlbnQsIHN1Ym1pdHRlciwgb3B0cywgb25SZXBseSl7XG4gICAgbGV0IHJlZkdlbmVyYXRvciA9ICgpID0+IHRoaXMuZGlzYWJsZUZvcm0oZm9ybUVsLCBwaHhFdmVudCwge1xuICAgICAgLi4ub3B0cyxcbiAgICAgIGZvcm06IGZvcm1FbCxcbiAgICAgIHN1Ym1pdHRlcjogc3VibWl0dGVyXG4gICAgfSlcbiAgICBsZXQgY2lkID0gdGhpcy50YXJnZXRDb21wb25lbnRJRChmb3JtRWwsIHRhcmdldEN0eClcbiAgICBpZihMaXZlVXBsb2FkZXIuaGFzVXBsb2Fkc0luUHJvZ3Jlc3MoZm9ybUVsKSl7XG4gICAgICBsZXQgW3JlZiwgX2Vsc10gPSByZWZHZW5lcmF0b3IoKVxuICAgICAgbGV0IHB1c2ggPSAoKSA9PiB0aGlzLnB1c2hGb3JtU3VibWl0KGZvcm1FbCwgdGFyZ2V0Q3R4LCBwaHhFdmVudCwgc3VibWl0dGVyLCBvcHRzLCBvblJlcGx5KVxuICAgICAgcmV0dXJuIHRoaXMuc2NoZWR1bGVTdWJtaXQoZm9ybUVsLCByZWYsIG9wdHMsIHB1c2gpXG4gICAgfSBlbHNlIGlmKExpdmVVcGxvYWRlci5pbnB1dHNBd2FpdGluZ1ByZWZsaWdodChmb3JtRWwpLmxlbmd0aCA+IDApe1xuICAgICAgbGV0IFtyZWYsIGVsc10gPSByZWZHZW5lcmF0b3IoKVxuICAgICAgbGV0IHByb3h5UmVmR2VuID0gKCkgPT4gW3JlZiwgZWxzLCBvcHRzXVxuICAgICAgdGhpcy51cGxvYWRGaWxlcyhmb3JtRWwsIHBoeEV2ZW50LCB0YXJnZXRDdHgsIHJlZiwgY2lkLCAoX3VwbG9hZHMpID0+IHtcbiAgICAgICAgLy8gaWYgd2Ugc3RpbGwgaGF2aW5nIHBlbmRpbmcgcHJlZmxpZ2h0cyBpdCBtZWFucyB3ZSBoYXZlIGludmFsaWQgZW50cmllc1xuICAgICAgICAvLyBhbmQgdGhlIHBoeC1zdWJtaXQgY2Fubm90IGJlIGNvbXBsZXRlZFxuICAgICAgICBpZihMaXZlVXBsb2FkZXIuaW5wdXRzQXdhaXRpbmdQcmVmbGlnaHQoZm9ybUVsKS5sZW5ndGggPiAwKXtcbiAgICAgICAgICByZXR1cm4gdGhpcy51bmRvUmVmcyhyZWYsIHBoeEV2ZW50KVxuICAgICAgICB9XG4gICAgICAgIGxldCBtZXRhID0gdGhpcy5leHRyYWN0TWV0YShmb3JtRWwsIHt9LCBvcHRzLnZhbHVlKVxuICAgICAgICBsZXQgZm9ybURhdGEgPSBzZXJpYWxpemVGb3JtKGZvcm1FbCwge3N1Ym1pdHRlcn0pXG4gICAgICAgIHRoaXMucHVzaFdpdGhSZXBseShwcm94eVJlZkdlbiwgXCJldmVudFwiLCB7XG4gICAgICAgICAgdHlwZTogXCJmb3JtXCIsXG4gICAgICAgICAgZXZlbnQ6IHBoeEV2ZW50LFxuICAgICAgICAgIHZhbHVlOiBmb3JtRGF0YSxcbiAgICAgICAgICBtZXRhOiBtZXRhLFxuICAgICAgICAgIGNpZDogY2lkXG4gICAgICAgIH0pLnRoZW4oKHtyZXNwfSkgPT4gb25SZXBseShyZXNwKSlcbiAgICAgIH0pXG4gICAgfSBlbHNlIGlmKCEoZm9ybUVsLmhhc0F0dHJpYnV0ZShQSFhfUkVGX1NSQykgJiYgZm9ybUVsLmNsYXNzTGlzdC5jb250YWlucyhcInBoeC1zdWJtaXQtbG9hZGluZ1wiKSkpe1xuICAgICAgbGV0IG1ldGEgPSB0aGlzLmV4dHJhY3RNZXRhKGZvcm1FbCwge30sIG9wdHMudmFsdWUpXG4gICAgICBsZXQgZm9ybURhdGEgPSBzZXJpYWxpemVGb3JtKGZvcm1FbCwge3N1Ym1pdHRlcn0pXG4gICAgICB0aGlzLnB1c2hXaXRoUmVwbHkocmVmR2VuZXJhdG9yLCBcImV2ZW50XCIsIHtcbiAgICAgICAgdHlwZTogXCJmb3JtXCIsXG4gICAgICAgIGV2ZW50OiBwaHhFdmVudCxcbiAgICAgICAgdmFsdWU6IGZvcm1EYXRhLFxuICAgICAgICBtZXRhOiBtZXRhLFxuICAgICAgICBjaWQ6IGNpZFxuICAgICAgfSkudGhlbigoe3Jlc3B9KSA9PiBvblJlcGx5KHJlc3ApKVxuICAgIH1cbiAgfVxuXG4gIHVwbG9hZEZpbGVzKGZvcm1FbCwgcGh4RXZlbnQsIHRhcmdldEN0eCwgcmVmLCBjaWQsIG9uQ29tcGxldGUpe1xuICAgIGxldCBqb2luQ291bnRBdFVwbG9hZCA9IHRoaXMuam9pbkNvdW50XG4gICAgbGV0IGlucHV0RWxzID0gTGl2ZVVwbG9hZGVyLmFjdGl2ZUZpbGVJbnB1dHMoZm9ybUVsKVxuICAgIGxldCBudW1GaWxlSW5wdXRzSW5Qcm9ncmVzcyA9IGlucHV0RWxzLmxlbmd0aFxuXG4gICAgLy8gZ2V0IGVhY2ggZmlsZSBpbnB1dFxuICAgIGlucHV0RWxzLmZvckVhY2goaW5wdXRFbCA9PiB7XG4gICAgICBsZXQgdXBsb2FkZXIgPSBuZXcgTGl2ZVVwbG9hZGVyKGlucHV0RWwsIHRoaXMsICgpID0+IHtcbiAgICAgICAgbnVtRmlsZUlucHV0c0luUHJvZ3Jlc3MtLVxuICAgICAgICBpZihudW1GaWxlSW5wdXRzSW5Qcm9ncmVzcyA9PT0gMCl7IG9uQ29tcGxldGUoKSB9XG4gICAgICB9KVxuXG4gICAgICBsZXQgZW50cmllcyA9IHVwbG9hZGVyLmVudHJpZXMoKS5tYXAoZW50cnkgPT4gZW50cnkudG9QcmVmbGlnaHRQYXlsb2FkKCkpXG5cbiAgICAgIGlmKGVudHJpZXMubGVuZ3RoID09PSAwKXtcbiAgICAgICAgbnVtRmlsZUlucHV0c0luUHJvZ3Jlc3MtLVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgbGV0IHBheWxvYWQgPSB7XG4gICAgICAgIHJlZjogaW5wdXRFbC5nZXRBdHRyaWJ1dGUoUEhYX1VQTE9BRF9SRUYpLFxuICAgICAgICBlbnRyaWVzOiBlbnRyaWVzLFxuICAgICAgICBjaWQ6IHRoaXMudGFyZ2V0Q29tcG9uZW50SUQoaW5wdXRFbC5mb3JtLCB0YXJnZXRDdHgpXG4gICAgICB9XG5cbiAgICAgIHRoaXMubG9nKFwidXBsb2FkXCIsICgpID0+IFtcInNlbmRpbmcgcHJlZmxpZ2h0IHJlcXVlc3RcIiwgcGF5bG9hZF0pXG5cbiAgICAgIHRoaXMucHVzaFdpdGhSZXBseShudWxsLCBcImFsbG93X3VwbG9hZFwiLCBwYXlsb2FkKS50aGVuKCh7cmVzcH0pID0+IHtcbiAgICAgICAgdGhpcy5sb2coXCJ1cGxvYWRcIiwgKCkgPT4gW1wiZ290IHByZWZsaWdodCByZXNwb25zZVwiLCByZXNwXSlcbiAgICAgICAgLy8gdGhlIHByZWZsaWdodCB3aWxsIHJlamVjdCBlbnRyaWVzIGJleW9uZCB0aGUgbWF4IGVudHJpZXNcbiAgICAgICAgLy8gc28gd2UgZXJyb3IgYW5kIGNhbmNlbCBlbnRyaWVzIG9uIHRoZSBjbGllbnQgdGhhdCBhcmUgbWlzc2luZyBmcm9tIHRoZSByZXNwb25zZVxuICAgICAgICB1cGxvYWRlci5lbnRyaWVzKCkuZm9yRWFjaChlbnRyeSA9PiB7XG4gICAgICAgICAgaWYocmVzcC5lbnRyaWVzICYmICFyZXNwLmVudHJpZXNbZW50cnkucmVmXSl7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZUZhaWxlZEVudHJ5UHJlZmxpZ2h0KGVudHJ5LnJlZiwgXCJmYWlsZWQgcHJlZmxpZ2h0XCIsIHVwbG9hZGVyKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLy8gZm9yIGF1dG8gdXBsb2Fkcywgd2UgbWF5IGhhdmUgYW4gZW1wdHkgZW50cmllcyByZXNwb25zZSBmcm9tIHRoZSBzZXJ2ZXJcbiAgICAgICAgLy8gZm9yIGZvcm0gc3VibWl0cyB0aGF0IGNvbnRhaW4gaW52YWxpZCBlbnRyaWVzXG4gICAgICAgIGlmKHJlc3AuZXJyb3IgfHwgT2JqZWN0LmtleXMocmVzcC5lbnRyaWVzKS5sZW5ndGggPT09IDApe1xuICAgICAgICAgIHRoaXMudW5kb1JlZnMocmVmLCBwaHhFdmVudClcbiAgICAgICAgICBsZXQgZXJyb3JzID0gcmVzcC5lcnJvciB8fCBbXVxuICAgICAgICAgIGVycm9ycy5tYXAoKFtlbnRyeV9yZWYsIHJlYXNvbl0pID0+IHtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlRmFpbGVkRW50cnlQcmVmbGlnaHQoZW50cnlfcmVmLCByZWFzb24sIHVwbG9hZGVyKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGV0IG9uRXJyb3IgPSAoY2FsbGJhY2spID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2hhbm5lbC5vbkVycm9yKCgpID0+IHtcbiAgICAgICAgICAgICAgaWYodGhpcy5qb2luQ291bnQgPT09IGpvaW5Db3VudEF0VXBsb2FkKXsgY2FsbGJhY2soKSB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgICB1cGxvYWRlci5pbml0QWRhcHRlclVwbG9hZChyZXNwLCBvbkVycm9yLCB0aGlzLmxpdmVTb2NrZXQpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIGhhbmRsZUZhaWxlZEVudHJ5UHJlZmxpZ2h0KHVwbG9hZFJlZiwgcmVhc29uLCB1cGxvYWRlcil7XG4gICAgaWYodXBsb2FkZXIuaXNBdXRvVXBsb2FkKCkpe1xuICAgICAgLy8gdXBsb2FkUmVmIG1heSBiZSB0b3AgbGV2ZWwgdXBsb2FkIGNvbmZpZyByZWYgb3IgZW50cnkgcmVmXG4gICAgICBsZXQgZW50cnkgPSB1cGxvYWRlci5lbnRyaWVzKCkuZmluZChlbnRyeSA9PiBlbnRyeS5yZWYgPT09IHVwbG9hZFJlZi50b1N0cmluZygpKVxuICAgICAgaWYoZW50cnkpeyBlbnRyeS5jYW5jZWwoKSB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHVwbG9hZGVyLmVudHJpZXMoKS5tYXAoZW50cnkgPT4gZW50cnkuY2FuY2VsKCkpXG4gICAgfVxuICAgIHRoaXMubG9nKFwidXBsb2FkXCIsICgpID0+IFtgZXJyb3IgZm9yIGVudHJ5ICR7dXBsb2FkUmVmfWAsIHJlYXNvbl0pXG4gIH1cblxuICBkaXNwYXRjaFVwbG9hZHModGFyZ2V0Q3R4LCBuYW1lLCBmaWxlc09yQmxvYnMpe1xuICAgIGxldCB0YXJnZXRFbGVtZW50ID0gdGhpcy50YXJnZXRDdHhFbGVtZW50KHRhcmdldEN0eCkgfHwgdGhpcy5lbFxuICAgIGxldCBpbnB1dHMgPSBET00uZmluZFVwbG9hZElucHV0cyh0YXJnZXRFbGVtZW50KS5maWx0ZXIoZWwgPT4gZWwubmFtZSA9PT0gbmFtZSlcbiAgICBpZihpbnB1dHMubGVuZ3RoID09PSAwKXsgbG9nRXJyb3IoYG5vIGxpdmUgZmlsZSBpbnB1dHMgZm91bmQgbWF0Y2hpbmcgdGhlIG5hbWUgXCIke25hbWV9XCJgKSB9XG4gICAgZWxzZSBpZihpbnB1dHMubGVuZ3RoID4gMSl7IGxvZ0Vycm9yKGBkdXBsaWNhdGUgbGl2ZSBmaWxlIGlucHV0cyBmb3VuZCBtYXRjaGluZyB0aGUgbmFtZSBcIiR7bmFtZX1cImApIH1cbiAgICBlbHNlIHsgRE9NLmRpc3BhdGNoRXZlbnQoaW5wdXRzWzBdLCBQSFhfVFJBQ0tfVVBMT0FEUywge2RldGFpbDoge2ZpbGVzOiBmaWxlc09yQmxvYnN9fSkgfVxuICB9XG5cbiAgdGFyZ2V0Q3R4RWxlbWVudCh0YXJnZXRDdHgpe1xuICAgIGlmKGlzQ2lkKHRhcmdldEN0eCkpe1xuICAgICAgbGV0IFt0YXJnZXRdID0gRE9NLmZpbmRDb21wb25lbnROb2RlTGlzdCh0aGlzLmVsLCB0YXJnZXRDdHgpXG4gICAgICByZXR1cm4gdGFyZ2V0XG4gICAgfSBlbHNlIGlmKHRhcmdldEN0eCl7XG4gICAgICByZXR1cm4gdGFyZ2V0Q3R4XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICB9XG5cbiAgcHVzaEZvcm1SZWNvdmVyeShvbGRGb3JtLCBuZXdGb3JtLCB0ZW1wbGF0ZURvbSwgY2FsbGJhY2spe1xuICAgIC8vIHdlIGFyZSBvbmx5IHJlY292ZXJpbmcgZm9ybXMgaW5zaWRlIHRoZSBjdXJyZW50IHZpZXcsIHRoZXJlZm9yZSBpdCBpcyBzYWZlIHRvXG4gICAgLy8gc2tpcCB3aXRoaW5Pd25lcnMgaGVyZSBhbmQgYWx3YXlzIHVzZSB0aGlzIHdoZW4gcmVmZXJyaW5nIHRvIHRoZSB2aWV3XG4gICAgY29uc3QgcGh4Q2hhbmdlID0gdGhpcy5iaW5kaW5nKFwiY2hhbmdlXCIpXG4gICAgY29uc3QgcGh4VGFyZ2V0ID0gbmV3Rm9ybS5nZXRBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFwidGFyZ2V0XCIpKSB8fCBuZXdGb3JtXG4gICAgY29uc3QgcGh4RXZlbnQgPSBuZXdGb3JtLmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoUEhYX0FVVE9fUkVDT1ZFUikpIHx8IG5ld0Zvcm0uZ2V0QXR0cmlidXRlKHRoaXMuYmluZGluZyhcImNoYW5nZVwiKSlcbiAgICBjb25zdCBpbnB1dHMgPSBBcnJheS5mcm9tKG9sZEZvcm0uZWxlbWVudHMpLmZpbHRlcihlbCA9PiBET00uaXNGb3JtSW5wdXQoZWwpICYmIGVsLm5hbWUgJiYgIWVsLmhhc0F0dHJpYnV0ZShwaHhDaGFuZ2UpKVxuICAgIGlmKGlucHV0cy5sZW5ndGggPT09IDApeyByZXR1cm4gfVxuXG4gICAgLy8gd2UgbXVzdCBjbGVhciB0cmFja2VkIHVwbG9hZHMgYmVmb3JlIHJlY292ZXJ5IGFzIHRoZXkgbm8gbG9uZ2VyIGhhdmUgdmFsaWQgcmVmc1xuICAgIGlucHV0cy5mb3JFYWNoKGlucHV0ID0+IGlucHV0Lmhhc0F0dHJpYnV0ZShQSFhfVVBMT0FEX1JFRikgJiYgTGl2ZVVwbG9hZGVyLmNsZWFyRmlsZXMoaW5wdXQpKVxuICAgIC8vIHB1c2hJbnB1dCBhc3N1bWVzIHRoYXQgdGhlcmUgaXMgYSBzb3VyY2UgZWxlbWVudCB0aGF0IGluaXRpYXRlZCB0aGUgY2hhbmdlO1xuICAgIC8vIGJlY2F1c2UgdGhpcyBpcyBub3QgdGhlIGNhc2Ugd2hlbiB3ZSByZWNvdmVyIGZvcm1zLCB3ZSBwcm92aWRlIHRoZSBmaXJzdCBpbnB1dCB3ZSBmaW5kXG4gICAgbGV0IGlucHV0ID0gaW5wdXRzLmZpbmQoZWwgPT4gZWwudHlwZSAhPT0gXCJoaWRkZW5cIikgfHwgaW5wdXRzWzBdXG5cbiAgICAvLyBpbiB0aGUgY2FzZSB0aGF0IHRoZXJlIGFyZSBtdWx0aXBsZSB0YXJnZXRzLCB3ZSBjb3VudCB0aGUgbnVtYmVyIG9mIHBlbmRpbmcgcmVjb3ZlcnkgZXZlbnRzXG4gICAgLy8gYW5kIG9ubHkgY2FsbCB0aGUgY2FsbGJhY2sgb25jZSBhbGwgZXZlbnRzIGhhdmUgYmVlbiBwcm9jZXNzZWRcbiAgICBsZXQgcGVuZGluZyA9IDBcbiAgICAvLyB3aXRoaW5UYXJnZXRzKHBoeFRhcmdldCwgY2FsbGJhY2ssIGRvbSwgdmlld0VsKVxuICAgIHRoaXMud2l0aGluVGFyZ2V0cyhwaHhUYXJnZXQsICh0YXJnZXRWaWV3LCB0YXJnZXRDdHgpID0+IHtcbiAgICAgIGNvbnN0IGNpZCA9IHRoaXMudGFyZ2V0Q29tcG9uZW50SUQobmV3Rm9ybSwgdGFyZ2V0Q3R4KVxuICAgICAgcGVuZGluZysrXG4gICAgICBsZXQgZSA9IG5ldyBDdXN0b21FdmVudChcInBoeDpmb3JtLXJlY292ZXJ5XCIsIHtkZXRhaWw6IHtzb3VyY2VFbGVtZW50OiBvbGRGb3JtfX0pXG4gICAgICBKUy5leGVjKGUsIFwiY2hhbmdlXCIsIHBoeEV2ZW50LCB0aGlzLCBpbnB1dCwgW1wicHVzaFwiLCB7XG4gICAgICAgIF90YXJnZXQ6IGlucHV0Lm5hbWUsXG4gICAgICAgIHRhcmdldFZpZXcsXG4gICAgICAgIHRhcmdldEN0eCxcbiAgICAgICAgbmV3Q2lkOiBjaWQsXG4gICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgcGVuZGluZy0tXG4gICAgICAgICAgaWYocGVuZGluZyA9PT0gMCl7IGNhbGxiYWNrKCkgfVxuICAgICAgICB9XG4gICAgICB9XSlcbiAgICB9LCB0ZW1wbGF0ZURvbSwgdGVtcGxhdGVEb20pXG4gIH1cblxuICBwdXNoTGlua1BhdGNoKGUsIGhyZWYsIHRhcmdldEVsLCBjYWxsYmFjayl7XG4gICAgbGV0IGxpbmtSZWYgPSB0aGlzLmxpdmVTb2NrZXQuc2V0UGVuZGluZ0xpbmsoaHJlZilcbiAgICAvLyBvbmx5IGFkZCBsb2FkaW5nIHN0YXRlcyBpZiBldmVudCBpcyB0cnVzdGVkIChpdCB3YXMgdHJpZ2dlcmVkIGJ5IHVzZXIsIHN1Y2ggYXMgY2xpY2spIGFuZFxuICAgIC8vIGl0J3Mgbm90IGEgZm9yd2FyZC9iYWNrIG5hdmlnYXRpb24gZnJvbSBwb3BzdGF0ZVxuICAgIGxldCBsb2FkaW5nID0gZS5pc1RydXN0ZWQgJiYgZS50eXBlICE9PSBcInBvcHN0YXRlXCJcbiAgICBsZXQgcmVmR2VuID0gdGFyZ2V0RWwgPyAoKSA9PiB0aGlzLnB1dFJlZihbe2VsOiB0YXJnZXRFbCwgbG9hZGluZzogbG9hZGluZywgbG9jazogdHJ1ZX1dLCBudWxsLCBcImNsaWNrXCIpIDogbnVsbFxuICAgIGxldCBmYWxsYmFjayA9ICgpID0+IHRoaXMubGl2ZVNvY2tldC5yZWRpcmVjdCh3aW5kb3cubG9jYXRpb24uaHJlZilcbiAgICBsZXQgdXJsID0gaHJlZi5zdGFydHNXaXRoKFwiL1wiKSA/IGAke2xvY2F0aW9uLnByb3RvY29sfS8vJHtsb2NhdGlvbi5ob3N0fSR7aHJlZn1gIDogaHJlZlxuXG4gICAgdGhpcy5wdXNoV2l0aFJlcGx5KHJlZkdlbiwgXCJsaXZlX3BhdGNoXCIsIHt1cmx9KS50aGVuKFxuICAgICAgKHtyZXNwfSkgPT4ge1xuICAgICAgICB0aGlzLmxpdmVTb2NrZXQucmVxdWVzdERPTVVwZGF0ZSgoKSA9PiB7XG4gICAgICAgICAgaWYocmVzcC5saW5rX3JlZGlyZWN0KXtcbiAgICAgICAgICAgIHRoaXMubGl2ZVNvY2tldC5yZXBsYWNlTWFpbihocmVmLCBudWxsLCBjYWxsYmFjaywgbGlua1JlZilcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYodGhpcy5saXZlU29ja2V0LmNvbW1pdFBlbmRpbmdMaW5rKGxpbmtSZWYpKXtcbiAgICAgICAgICAgICAgdGhpcy5ocmVmID0gaHJlZlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5hcHBseVBlbmRpbmdVcGRhdGVzKClcbiAgICAgICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKGxpbmtSZWYpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSxcbiAgICAgICh7ZXJyb3I6IF9lcnJvciwgdGltZW91dDogX3RpbWVvdXR9KSA9PiBmYWxsYmFjaygpXG4gICAgKVxuICB9XG5cbiAgZ2V0Rm9ybXNGb3JSZWNvdmVyeSgpe1xuICAgIGlmKHRoaXMuam9pbkNvdW50ID09PSAwKXsgcmV0dXJuIHt9IH1cblxuICAgIGxldCBwaHhDaGFuZ2UgPSB0aGlzLmJpbmRpbmcoXCJjaGFuZ2VcIilcblxuICAgIHJldHVybiBET00uYWxsKHRoaXMuZWwsIGBmb3JtWyR7cGh4Q2hhbmdlfV1gKVxuICAgICAgLmZpbHRlcihmb3JtID0+IGZvcm0uaWQpXG4gICAgICAuZmlsdGVyKGZvcm0gPT4gZm9ybS5lbGVtZW50cy5sZW5ndGggPiAwKVxuICAgICAgLmZpbHRlcihmb3JtID0+IGZvcm0uZ2V0QXR0cmlidXRlKHRoaXMuYmluZGluZyhQSFhfQVVUT19SRUNPVkVSKSkgIT09IFwiaWdub3JlXCIpXG4gICAgICAubWFwKGZvcm0gPT4gZm9ybS5jbG9uZU5vZGUodHJ1ZSkpXG4gICAgICAucmVkdWNlKChhY2MsIGZvcm0pID0+IHtcbiAgICAgICAgYWNjW2Zvcm0uaWRdID0gZm9ybVxuICAgICAgICByZXR1cm4gYWNjXG4gICAgICB9LCB7fSlcbiAgfVxuXG4gIG1heWJlUHVzaENvbXBvbmVudHNEZXN0cm95ZWQoZGVzdHJveWVkQ0lEcyl7XG4gICAgbGV0IHdpbGxEZXN0cm95Q0lEcyA9IGRlc3Ryb3llZENJRHMuZmlsdGVyKGNpZCA9PiB7XG4gICAgICByZXR1cm4gRE9NLmZpbmRDb21wb25lbnROb2RlTGlzdCh0aGlzLmVsLCBjaWQpLmxlbmd0aCA9PT0gMFxuICAgIH0pXG5cbiAgICBpZih3aWxsRGVzdHJveUNJRHMubGVuZ3RoID4gMCl7XG4gICAgICAvLyB3ZSBtdXN0IHJlc2V0IHRoZSByZW5kZXIgY2hhbmdlIHRyYWNraW5nIGZvciBjaWRzIHRoYXRcbiAgICAgIC8vIGNvdWxkIGJlIGFkZGVkIGJhY2sgZnJvbSB0aGUgc2VydmVyIHNvIHdlIGRvbid0IHNraXAgdGhlbVxuICAgICAgd2lsbERlc3Ryb3lDSURzLmZvckVhY2goY2lkID0+IHRoaXMucmVuZGVyZWQucmVzZXRSZW5kZXIoY2lkKSlcblxuICAgICAgdGhpcy5wdXNoV2l0aFJlcGx5KG51bGwsIFwiY2lkc193aWxsX2Rlc3Ryb3lcIiwge2NpZHM6IHdpbGxEZXN0cm95Q0lEc30pLnRoZW4oKCkgPT4ge1xuICAgICAgICAvLyB3ZSBtdXN0IHdhaXQgZm9yIHBlbmRpbmcgdHJhbnNpdGlvbnMgdG8gY29tcGxldGUgYmVmb3JlIGRldGVybWluaW5nXG4gICAgICAgIC8vIGlmIHRoZSBjaWRzIHdlcmUgYWRkZWQgYmFjayB0byB0aGUgRE9NIGluIHRoZSBtZWFudGltZSAoIzMxMzkpXG4gICAgICAgIHRoaXMubGl2ZVNvY2tldC5yZXF1ZXN0RE9NVXBkYXRlKCgpID0+IHtcbiAgICAgICAgICAvLyBTZWUgaWYgYW55IG9mIHRoZSBjaWRzIHdlIHdhbnRlZCB0byBkZXN0cm95IHdlcmUgYWRkZWQgYmFjayxcbiAgICAgICAgICAvLyBpZiB0aGV5IHdlcmUgYWRkZWQgYmFjaywgd2UgZG9uJ3QgYWN0dWFsbHkgZGVzdHJveSB0aGVtLlxuICAgICAgICAgIGxldCBjb21wbGV0ZWx5RGVzdHJveUNJRHMgPSB3aWxsRGVzdHJveUNJRHMuZmlsdGVyKGNpZCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gRE9NLmZpbmRDb21wb25lbnROb2RlTGlzdCh0aGlzLmVsLCBjaWQpLmxlbmd0aCA9PT0gMFxuICAgICAgICAgIH0pXG5cbiAgICAgICAgICBpZihjb21wbGV0ZWx5RGVzdHJveUNJRHMubGVuZ3RoID4gMCl7XG4gICAgICAgICAgICB0aGlzLnB1c2hXaXRoUmVwbHkobnVsbCwgXCJjaWRzX2Rlc3Ryb3llZFwiLCB7Y2lkczogY29tcGxldGVseURlc3Ryb3lDSURzfSkudGhlbigoe3Jlc3B9KSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMucmVuZGVyZWQucHJ1bmVDSURzKHJlc3AuY2lkcylcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBvd25zRWxlbWVudChlbCl7XG4gICAgbGV0IHBhcmVudFZpZXdFbCA9IGVsLmNsb3Nlc3QoUEhYX1ZJRVdfU0VMRUNUT1IpXG4gICAgcmV0dXJuIGVsLmdldEF0dHJpYnV0ZShQSFhfUEFSRU5UX0lEKSA9PT0gdGhpcy5pZCB8fFxuICAgICAgKHBhcmVudFZpZXdFbCAmJiBwYXJlbnRWaWV3RWwuaWQgPT09IHRoaXMuaWQpIHx8XG4gICAgICAoIXBhcmVudFZpZXdFbCAmJiB0aGlzLmlzRGVhZClcbiAgfVxuXG4gIHN1Ym1pdEZvcm0oZm9ybSwgdGFyZ2V0Q3R4LCBwaHhFdmVudCwgc3VibWl0dGVyLCBvcHRzID0ge30pe1xuICAgIERPTS5wdXRQcml2YXRlKGZvcm0sIFBIWF9IQVNfU1VCTUlUVEVELCB0cnVlKVxuICAgIGNvbnN0IGlucHV0cyA9IEFycmF5LmZyb20oZm9ybS5lbGVtZW50cylcbiAgICBpbnB1dHMuZm9yRWFjaChpbnB1dCA9PiBET00ucHV0UHJpdmF0ZShpbnB1dCwgUEhYX0hBU19TVUJNSVRURUQsIHRydWUpKVxuICAgIHRoaXMubGl2ZVNvY2tldC5ibHVyQWN0aXZlRWxlbWVudCh0aGlzKVxuICAgIHRoaXMucHVzaEZvcm1TdWJtaXQoZm9ybSwgdGFyZ2V0Q3R4LCBwaHhFdmVudCwgc3VibWl0dGVyLCBvcHRzLCAoKSA9PiB7XG4gICAgICB0aGlzLmxpdmVTb2NrZXQucmVzdG9yZVByZXZpb3VzbHlBY3RpdmVGb2N1cygpXG4gICAgfSlcbiAgfVxuXG4gIGJpbmRpbmcoa2luZCl7IHJldHVybiB0aGlzLmxpdmVTb2NrZXQuYmluZGluZyhraW5kKSB9XG59XG4iLCAiLyoqIEluaXRpYWxpemVzIHRoZSBMaXZlU29ja2V0XG4gKlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBlbmRQb2ludCAtIFRoZSBzdHJpbmcgV2ViU29ja2V0IGVuZHBvaW50LCBpZSwgYFwid3NzOi8vZXhhbXBsZS5jb20vbGl2ZVwiYCxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgXCIvbGl2ZVwiYCAoaW5oZXJpdGVkIGhvc3QgJiBwcm90b2NvbClcbiAqIEBwYXJhbSB7UGhvZW5peC5Tb2NrZXR9IHNvY2tldCAtIHRoZSByZXF1aXJlZCBQaG9lbml4IFNvY2tldCBjbGFzcyBpbXBvcnRlZCBmcm9tIFwicGhvZW5peFwiLiBGb3IgZXhhbXBsZTpcbiAqXG4gKiAgICAgaW1wb3J0IHtTb2NrZXR9IGZyb20gXCJwaG9lbml4XCJcbiAqICAgICBpbXBvcnQge0xpdmVTb2NrZXR9IGZyb20gXCJwaG9lbml4X2xpdmVfdmlld1wiXG4gKiAgICAgbGV0IGxpdmVTb2NrZXQgPSBuZXcgTGl2ZVNvY2tldChcIi9saXZlXCIsIFNvY2tldCwgey4uLn0pXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRzXSAtIE9wdGlvbmFsIGNvbmZpZ3VyYXRpb24uIE91dHNpZGUgb2Yga2V5cyBsaXN0ZWQgYmVsb3csIGFsbFxuICogY29uZmlndXJhdGlvbiBpcyBwYXNzZWQgZGlyZWN0bHkgdG8gdGhlIFBob2VuaXggU29ja2V0IGNvbnN0cnVjdG9yLlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRzLmRlZmF1bHRzXSAtIFRoZSBvcHRpb25hbCBkZWZhdWx0cyB0byB1c2UgZm9yIHZhcmlvdXMgYmluZGluZ3MsXG4gKiBzdWNoIGFzIGBwaHgtZGVib3VuY2VgLiBTdXBwb3J0cyB0aGUgZm9sbG93aW5nIGtleXM6XG4gKlxuICogICAtIGRlYm91bmNlIC0gdGhlIG1pbGxpc2Vjb25kIHBoeC1kZWJvdW5jZSB0aW1lLiBEZWZhdWx0cyAzMDBcbiAqICAgLSB0aHJvdHRsZSAtIHRoZSBtaWxsaXNlY29uZCBwaHgtdGhyb3R0bGUgdGltZS4gRGVmYXVsdHMgMzAwXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdHMucGFyYW1zXSAtIFRoZSBvcHRpb25hbCBmdW5jdGlvbiBmb3IgcGFzc2luZyBjb25uZWN0IHBhcmFtcy5cbiAqIFRoZSBmdW5jdGlvbiByZWNlaXZlcyB0aGUgZWxlbWVudCBhc3NvY2lhdGVkIHdpdGggYSBnaXZlbiBMaXZlVmlldy4gRm9yIGV4YW1wbGU6XG4gKlxuICogICAgIChlbCkgPT4ge3ZpZXc6IGVsLmdldEF0dHJpYnV0ZShcImRhdGEtbXktdmlldy1uYW1lXCIsIHRva2VuOiB3aW5kb3cubXlUb2tlbn1cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdHMuYmluZGluZ1ByZWZpeF0gLSBUaGUgb3B0aW9uYWwgcHJlZml4IHRvIHVzZSBmb3IgYWxsIHBoeCBET00gYW5ub3RhdGlvbnMuXG4gKiBEZWZhdWx0cyB0byBcInBoeC1cIi5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0cy5ob29rc10gLSBUaGUgb3B0aW9uYWwgb2JqZWN0IGZvciByZWZlcmVuY2luZyBMaXZlVmlldyBob29rIGNhbGxiYWNrcy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0cy51cGxvYWRlcnNdIC0gVGhlIG9wdGlvbmFsIG9iamVjdCBmb3IgcmVmZXJlbmNpbmcgTGl2ZVZpZXcgdXBsb2FkZXIgY2FsbGJhY2tzLlxuICogQHBhcmFtIHtpbnRlZ2VyfSBbb3B0cy5sb2FkZXJUaW1lb3V0XSAtIFRoZSBvcHRpb25hbCBkZWxheSBpbiBtaWxsaXNlY29uZHMgdG8gd2FpdCBiZWZvcmUgYXBwbHlcbiAqIGxvYWRpbmcgc3RhdGVzLlxuICogQHBhcmFtIHtpbnRlZ2VyfSBbb3B0cy5kaXNjb25uZWN0ZWRUaW1lb3V0XSAtIFRoZSBkZWxheSBpbiBtaWxsaXNlY29uZHMgdG8gd2FpdCBiZWZvcmVcbiAqIGV4ZWN1dGluZyBwaHgtZGlzY29ubmVjdGVkIGNvbW1hbmRzLiBEZWZhdWx0cyB0byA1MDAuXG4gKiBAcGFyYW0ge2ludGVnZXJ9IFtvcHRzLm1heFJlbG9hZHNdIC0gVGhlIG1heGltdW0gcmVsb2FkcyBiZWZvcmUgZW50ZXJpbmcgZmFpbHNhZmUgbW9kZS5cbiAqIEBwYXJhbSB7aW50ZWdlcn0gW29wdHMucmVsb2FkSml0dGVyTWluXSAtIFRoZSBtaW5pbXVtIHRpbWUgYmV0d2VlbiBub3JtYWwgcmVsb2FkIGF0dGVtcHRzLlxuICogQHBhcmFtIHtpbnRlZ2VyfSBbb3B0cy5yZWxvYWRKaXR0ZXJNYXhdIC0gVGhlIG1heGltdW0gdGltZSBiZXR3ZWVuIG5vcm1hbCByZWxvYWQgYXR0ZW1wdHMuXG4gKiBAcGFyYW0ge2ludGVnZXJ9IFtvcHRzLmZhaWxzYWZlSml0dGVyXSAtIFRoZSB0aW1lIGJldHdlZW4gcmVsb2FkIGF0dGVtcHRzIGluIGZhaWxzYWZlIG1vZGUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0cy52aWV3TG9nZ2VyXSAtIFRoZSBvcHRpb25hbCBmdW5jdGlvbiB0byBsb2cgZGVidWcgaW5mb3JtYXRpb24uIEZvciBleGFtcGxlOlxuICpcbiAqICAgICAodmlldywga2luZCwgbXNnLCBvYmopID0+IGNvbnNvbGUubG9nKGAke3ZpZXcuaWR9ICR7a2luZH06ICR7bXNnfSAtIGAsIG9iailcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdHMubWV0YWRhdGFdIC0gVGhlIG9wdGlvbmFsIG9iamVjdCBtYXBwaW5nIGV2ZW50IG5hbWVzIHRvIGZ1bmN0aW9ucyBmb3JcbiAqIHBvcHVsYXRpbmcgZXZlbnQgbWV0YWRhdGEuIEZvciBleGFtcGxlOlxuICpcbiAqICAgICBtZXRhZGF0YToge1xuICogICAgICAgY2xpY2s6IChlLCBlbCkgPT4ge1xuICogICAgICAgICByZXR1cm4ge1xuICogICAgICAgICAgIGN0cmxLZXk6IGUuY3RybEtleSxcbiAqICAgICAgICAgICBtZXRhS2V5OiBlLm1ldGFLZXksXG4gKiAgICAgICAgICAgZGV0YWlsOiBlLmRldGFpbCB8fCAxLFxuICogICAgICAgICB9XG4gKiAgICAgICB9LFxuICogICAgICAga2V5ZG93bjogKGUsIGVsKSA9PiB7XG4gKiAgICAgICAgIHJldHVybiB7XG4gKiAgICAgICAgICAga2V5OiBlLmtleSxcbiAqICAgICAgICAgICBjdHJsS2V5OiBlLmN0cmxLZXksXG4gKiAgICAgICAgICAgbWV0YUtleTogZS5tZXRhS2V5LFxuICogICAgICAgICAgIHNoaWZ0S2V5OiBlLnNoaWZ0S2V5XG4gKiAgICAgICAgIH1cbiAqICAgICAgIH1cbiAqICAgICB9XG4gKiBAcGFyYW0ge09iamVjdH0gW29wdHMuc2Vzc2lvblN0b3JhZ2VdIC0gQW4gb3B0aW9uYWwgU3RvcmFnZSBjb21wYXRpYmxlIG9iamVjdFxuICogVXNlZnVsIHdoZW4gTGl2ZVZpZXcgd29uJ3QgaGF2ZSBhY2Nlc3MgdG8gYHNlc3Npb25TdG9yYWdlYC4gIEZvciBleGFtcGxlLCBUaGlzIGNvdWxkXG4gKiBoYXBwZW4gaWYgYSBzaXRlIGxvYWRzIGEgY3Jvc3MtZG9tYWluIExpdmVWaWV3IGluIGFuIGlmcmFtZS4gIEV4YW1wbGUgdXNhZ2U6XG4gKlxuICogICAgIGNsYXNzIEluTWVtb3J5U3RvcmFnZSB7XG4gKiAgICAgICBjb25zdHJ1Y3RvcigpIHsgdGhpcy5zdG9yYWdlID0ge30gfVxuICogICAgICAgZ2V0SXRlbShrZXlOYW1lKSB7IHJldHVybiB0aGlzLnN0b3JhZ2Vba2V5TmFtZV0gfHwgbnVsbCB9XG4gKiAgICAgICByZW1vdmVJdGVtKGtleU5hbWUpIHsgZGVsZXRlIHRoaXMuc3RvcmFnZVtrZXlOYW1lXSB9XG4gKiAgICAgICBzZXRJdGVtKGtleU5hbWUsIGtleVZhbHVlKSB7IHRoaXMuc3RvcmFnZVtrZXlOYW1lXSA9IGtleVZhbHVlIH1cbiAqICAgICB9XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRzLmxvY2FsU3RvcmFnZV0gLSBBbiBvcHRpb25hbCBTdG9yYWdlIGNvbXBhdGlibGUgb2JqZWN0XG4gKiBVc2VmdWwgZm9yIHdoZW4gTGl2ZVZpZXcgd29uJ3QgaGF2ZSBhY2Nlc3MgdG8gYGxvY2FsU3RvcmFnZWAuXG4gKiBTZWUgYG9wdHMuc2Vzc2lvblN0b3JhZ2VgIGZvciBleGFtcGxlcy5cbiovXG5cbmltcG9ydCB7XG4gIEJJTkRJTkdfUFJFRklYLFxuICBDT05TRUNVVElWRV9SRUxPQURTLFxuICBERUZBVUxUUyxcbiAgRkFJTFNBRkVfSklUVEVSLFxuICBMT0FERVJfVElNRU9VVCxcbiAgRElTQ09OTkVDVEVEX1RJTUVPVVQsXG4gIE1BWF9SRUxPQURTLFxuICBQSFhfREVCT1VOQ0UsXG4gIFBIWF9EUk9QX1RBUkdFVCxcbiAgUEhYX0hBU19GT0NVU0VELFxuICBQSFhfS0VZLFxuICBQSFhfTElOS19TVEFURSxcbiAgUEhYX0xJVkVfTElOSyxcbiAgUEhYX0xWX0RFQlVHLFxuICBQSFhfTFZfTEFURU5DWV9TSU0sXG4gIFBIWF9MVl9QUk9GSUxFLFxuICBQSFhfTFZfSElTVE9SWV9QT1NJVElPTixcbiAgUEhYX01BSU4sXG4gIFBIWF9QQVJFTlRfSUQsXG4gIFBIWF9WSUVXX1NFTEVDVE9SLFxuICBQSFhfUk9PVF9JRCxcbiAgUEhYX1RIUk9UVExFLFxuICBQSFhfVFJBQ0tfVVBMT0FEUyxcbiAgUEhYX1NFU1NJT04sXG4gIFJFTE9BRF9KSVRURVJfTUlOLFxuICBSRUxPQURfSklUVEVSX01BWCxcbiAgUEhYX1JFRl9TUkMsXG4gIFBIWF9SRUxPQURfU1RBVFVTXG59IGZyb20gXCIuL2NvbnN0YW50c1wiXG5cbmltcG9ydCB7XG4gIGNsb25lLFxuICBjbG9zZXN0UGh4QmluZGluZyxcbiAgY2xvc3VyZSxcbiAgZGVidWcsXG4gIG1heWJlXG59IGZyb20gXCIuL3V0aWxzXCJcblxuaW1wb3J0IEJyb3dzZXIgZnJvbSBcIi4vYnJvd3NlclwiXG5pbXBvcnQgRE9NIGZyb20gXCIuL2RvbVwiXG5pbXBvcnQgSG9va3MgZnJvbSBcIi4vaG9va3NcIlxuaW1wb3J0IExpdmVVcGxvYWRlciBmcm9tIFwiLi9saXZlX3VwbG9hZGVyXCJcbmltcG9ydCBWaWV3IGZyb20gXCIuL3ZpZXdcIlxuaW1wb3J0IEpTIGZyb20gXCIuL2pzXCJcblxuZXhwb3J0IGxldCBpc1VzZWRJbnB1dCA9IChlbCkgPT4gRE9NLmlzVXNlZElucHV0KGVsKVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaXZlU29ja2V0IHtcbiAgY29uc3RydWN0b3IodXJsLCBwaHhTb2NrZXQsIG9wdHMgPSB7fSl7XG4gICAgdGhpcy51bmxvYWRlZCA9IGZhbHNlXG4gICAgaWYoIXBoeFNvY2tldCB8fCBwaHhTb2NrZXQuY29uc3RydWN0b3IubmFtZSA9PT0gXCJPYmplY3RcIil7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFxuICAgICAgYSBwaG9lbml4IFNvY2tldCBtdXN0IGJlIHByb3ZpZGVkIGFzIHRoZSBzZWNvbmQgYXJndW1lbnQgdG8gdGhlIExpdmVTb2NrZXQgY29uc3RydWN0b3IuIEZvciBleGFtcGxlOlxuXG4gICAgICAgICAgaW1wb3J0IHtTb2NrZXR9IGZyb20gXCJwaG9lbml4XCJcbiAgICAgICAgICBpbXBvcnQge0xpdmVTb2NrZXR9IGZyb20gXCJwaG9lbml4X2xpdmVfdmlld1wiXG4gICAgICAgICAgbGV0IGxpdmVTb2NrZXQgPSBuZXcgTGl2ZVNvY2tldChcIi9saXZlXCIsIFNvY2tldCwgey4uLn0pXG4gICAgICBgKVxuICAgIH1cbiAgICB0aGlzLnNvY2tldCA9IG5ldyBwaHhTb2NrZXQodXJsLCBvcHRzKVxuICAgIHRoaXMuYmluZGluZ1ByZWZpeCA9IG9wdHMuYmluZGluZ1ByZWZpeCB8fCBCSU5ESU5HX1BSRUZJWFxuICAgIHRoaXMub3B0cyA9IG9wdHNcbiAgICB0aGlzLnBhcmFtcyA9IGNsb3N1cmUob3B0cy5wYXJhbXMgfHwge30pXG4gICAgdGhpcy52aWV3TG9nZ2VyID0gb3B0cy52aWV3TG9nZ2VyXG4gICAgdGhpcy5tZXRhZGF0YUNhbGxiYWNrcyA9IG9wdHMubWV0YWRhdGEgfHwge31cbiAgICB0aGlzLmRlZmF1bHRzID0gT2JqZWN0LmFzc2lnbihjbG9uZShERUZBVUxUUyksIG9wdHMuZGVmYXVsdHMgfHwge30pXG4gICAgdGhpcy5hY3RpdmVFbGVtZW50ID0gbnVsbFxuICAgIHRoaXMucHJldkFjdGl2ZSA9IG51bGxcbiAgICB0aGlzLnNpbGVuY2VkID0gZmFsc2VcbiAgICB0aGlzLm1haW4gPSBudWxsXG4gICAgdGhpcy5vdXRnb2luZ01haW5FbCA9IG51bGxcbiAgICB0aGlzLmNsaWNrU3RhcnRlZEF0VGFyZ2V0ID0gbnVsbFxuICAgIHRoaXMubGlua1JlZiA9IDFcbiAgICB0aGlzLnJvb3RzID0ge31cbiAgICB0aGlzLmhyZWYgPSB3aW5kb3cubG9jYXRpb24uaHJlZlxuICAgIHRoaXMucGVuZGluZ0xpbmsgPSBudWxsXG4gICAgdGhpcy5jdXJyZW50TG9jYXRpb24gPSBjbG9uZSh3aW5kb3cubG9jYXRpb24pXG4gICAgdGhpcy5ob29rcyA9IG9wdHMuaG9va3MgfHwge31cbiAgICB0aGlzLnVwbG9hZGVycyA9IG9wdHMudXBsb2FkZXJzIHx8IHt9XG4gICAgdGhpcy5sb2FkZXJUaW1lb3V0ID0gb3B0cy5sb2FkZXJUaW1lb3V0IHx8IExPQURFUl9USU1FT1VUXG4gICAgdGhpcy5kaXNjb25uZWN0ZWRUaW1lb3V0ID0gb3B0cy5kaXNjb25uZWN0ZWRUaW1lb3V0IHx8IERJU0NPTk5FQ1RFRF9USU1FT1VUXG4gICAgdGhpcy5yZWxvYWRXaXRoSml0dGVyVGltZXIgPSBudWxsXG4gICAgdGhpcy5tYXhSZWxvYWRzID0gb3B0cy5tYXhSZWxvYWRzIHx8IE1BWF9SRUxPQURTXG4gICAgdGhpcy5yZWxvYWRKaXR0ZXJNaW4gPSBvcHRzLnJlbG9hZEppdHRlck1pbiB8fCBSRUxPQURfSklUVEVSX01JTlxuICAgIHRoaXMucmVsb2FkSml0dGVyTWF4ID0gb3B0cy5yZWxvYWRKaXR0ZXJNYXggfHwgUkVMT0FEX0pJVFRFUl9NQVhcbiAgICB0aGlzLmZhaWxzYWZlSml0dGVyID0gb3B0cy5mYWlsc2FmZUppdHRlciB8fCBGQUlMU0FGRV9KSVRURVJcbiAgICB0aGlzLmxvY2FsU3RvcmFnZSA9IG9wdHMubG9jYWxTdG9yYWdlIHx8IHdpbmRvdy5sb2NhbFN0b3JhZ2VcbiAgICB0aGlzLnNlc3Npb25TdG9yYWdlID0gb3B0cy5zZXNzaW9uU3RvcmFnZSB8fCB3aW5kb3cuc2Vzc2lvblN0b3JhZ2VcbiAgICB0aGlzLmJvdW5kVG9wTGV2ZWxFdmVudHMgPSBmYWxzZVxuICAgIHRoaXMuYm91bmRFdmVudE5hbWVzID0gbmV3IFNldCgpXG4gICAgdGhpcy5zZXJ2ZXJDbG9zZVJlZiA9IG51bGxcbiAgICB0aGlzLmRvbUNhbGxiYWNrcyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAganNRdWVyeVNlbGVjdG9yQWxsOiBudWxsLFxuICAgICAgb25QYXRjaFN0YXJ0OiBjbG9zdXJlKCksXG4gICAgICBvblBhdGNoRW5kOiBjbG9zdXJlKCksXG4gICAgICBvbk5vZGVBZGRlZDogY2xvc3VyZSgpLFxuICAgICAgb25CZWZvcmVFbFVwZGF0ZWQ6IGNsb3N1cmUoKX0sXG4gICAgb3B0cy5kb20gfHwge30pXG4gICAgdGhpcy50cmFuc2l0aW9ucyA9IG5ldyBUcmFuc2l0aW9uU2V0KClcbiAgICB0aGlzLmN1cnJlbnRIaXN0b3J5UG9zaXRpb24gPSBwYXJzZUludCh0aGlzLnNlc3Npb25TdG9yYWdlLmdldEl0ZW0oUEhYX0xWX0hJU1RPUllfUE9TSVRJT04pKSB8fCAwXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJwYWdlaGlkZVwiLCBfZSA9PiB7XG4gICAgICB0aGlzLnVubG9hZGVkID0gdHJ1ZVxuICAgIH0pXG4gICAgdGhpcy5zb2NrZXQub25PcGVuKCgpID0+IHtcbiAgICAgIGlmKHRoaXMuaXNVbmxvYWRlZCgpKXtcbiAgICAgICAgLy8gcmVsb2FkIHBhZ2UgaWYgYmVpbmcgcmVzdG9yZWQgZnJvbSBiYWNrL2ZvcndhcmQgY2FjaGUgYW5kIGJyb3dzZXIgZG9lcyBub3QgZW1pdCBcInBhZ2VzaG93XCJcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8vIHB1YmxpY1xuXG4gIHZlcnNpb24oKXsgcmV0dXJuIExWX1ZTTiB9XG5cbiAgaXNQcm9maWxlRW5hYmxlZCgpeyByZXR1cm4gdGhpcy5zZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFBIWF9MVl9QUk9GSUxFKSA9PT0gXCJ0cnVlXCIgfVxuXG4gIGlzRGVidWdFbmFibGVkKCl7IHJldHVybiB0aGlzLnNlc3Npb25TdG9yYWdlLmdldEl0ZW0oUEhYX0xWX0RFQlVHKSA9PT0gXCJ0cnVlXCIgfVxuXG4gIGlzRGVidWdEaXNhYmxlZCgpeyByZXR1cm4gdGhpcy5zZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFBIWF9MVl9ERUJVRykgPT09IFwiZmFsc2VcIiB9XG5cbiAgZW5hYmxlRGVidWcoKXsgdGhpcy5zZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFBIWF9MVl9ERUJVRywgXCJ0cnVlXCIpIH1cblxuICBlbmFibGVQcm9maWxpbmcoKXsgdGhpcy5zZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFBIWF9MVl9QUk9GSUxFLCBcInRydWVcIikgfVxuXG4gIGRpc2FibGVEZWJ1ZygpeyB0aGlzLnNlc3Npb25TdG9yYWdlLnNldEl0ZW0oUEhYX0xWX0RFQlVHLCBcImZhbHNlXCIpIH1cblxuICBkaXNhYmxlUHJvZmlsaW5nKCl7IHRoaXMuc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbShQSFhfTFZfUFJPRklMRSkgfVxuXG4gIGVuYWJsZUxhdGVuY3lTaW0odXBwZXJCb3VuZE1zKXtcbiAgICB0aGlzLmVuYWJsZURlYnVnKClcbiAgICBjb25zb2xlLmxvZyhcImxhdGVuY3kgc2ltdWxhdG9yIGVuYWJsZWQgZm9yIHRoZSBkdXJhdGlvbiBvZiB0aGlzIGJyb3dzZXIgc2Vzc2lvbi4gQ2FsbCBkaXNhYmxlTGF0ZW5jeVNpbSgpIHRvIGRpc2FibGVcIilcbiAgICB0aGlzLnNlc3Npb25TdG9yYWdlLnNldEl0ZW0oUEhYX0xWX0xBVEVOQ1lfU0lNLCB1cHBlckJvdW5kTXMpXG4gIH1cblxuICBkaXNhYmxlTGF0ZW5jeVNpbSgpeyB0aGlzLnNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oUEhYX0xWX0xBVEVOQ1lfU0lNKSB9XG5cbiAgZ2V0TGF0ZW5jeVNpbSgpe1xuICAgIGxldCBzdHIgPSB0aGlzLnNlc3Npb25TdG9yYWdlLmdldEl0ZW0oUEhYX0xWX0xBVEVOQ1lfU0lNKVxuICAgIHJldHVybiBzdHIgPyBwYXJzZUludChzdHIpIDogbnVsbFxuICB9XG5cbiAgZ2V0U29ja2V0KCl7IHJldHVybiB0aGlzLnNvY2tldCB9XG5cbiAgY29ubmVjdCgpe1xuICAgIC8vIGVuYWJsZSBkZWJ1ZyBieSBkZWZhdWx0IGlmIG9uIGxvY2FsaG9zdCBhbmQgbm90IGV4cGxpY2l0bHkgZGlzYWJsZWRcbiAgICBpZih3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUgPT09IFwibG9jYWxob3N0XCIgJiYgIXRoaXMuaXNEZWJ1Z0Rpc2FibGVkKCkpeyB0aGlzLmVuYWJsZURlYnVnKCkgfVxuICAgIGxldCBkb0Nvbm5lY3QgPSAoKSA9PiB7XG4gICAgICB0aGlzLnJlc2V0UmVsb2FkU3RhdHVzKClcbiAgICAgIGlmKHRoaXMuam9pblJvb3RWaWV3cygpKXtcbiAgICAgICAgdGhpcy5iaW5kVG9wTGV2ZWxFdmVudHMoKVxuICAgICAgICB0aGlzLnNvY2tldC5jb25uZWN0KClcbiAgICAgIH0gZWxzZSBpZih0aGlzLm1haW4pe1xuICAgICAgICB0aGlzLnNvY2tldC5jb25uZWN0KClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuYmluZFRvcExldmVsRXZlbnRzKHtkZWFkOiB0cnVlfSlcbiAgICAgIH1cbiAgICAgIHRoaXMuam9pbkRlYWRWaWV3KClcbiAgICB9XG4gICAgaWYoW1wiY29tcGxldGVcIiwgXCJsb2FkZWRcIiwgXCJpbnRlcmFjdGl2ZVwiXS5pbmRleE9mKGRvY3VtZW50LnJlYWR5U3RhdGUpID49IDApe1xuICAgICAgZG9Db25uZWN0KClcbiAgICB9IGVsc2Uge1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKCkgPT4gZG9Db25uZWN0KCkpXG4gICAgfVxuICB9XG5cbiAgZGlzY29ubmVjdChjYWxsYmFjayl7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMucmVsb2FkV2l0aEppdHRlclRpbWVyKVxuICAgIC8vIHJlbW92ZSB0aGUgc29ja2V0IGNsb3NlIGxpc3RlbmVyIHRvIGF2b2lkIHRyeWluZyB0byBoYW5kbGVcbiAgICAvLyBhIHNlcnZlciBjbG9zZSBldmVudCB3aGVuIGl0IGlzIGFjdHVhbGx5IGNhdXNlZCBieSB1cyBkaXNjb25uZWN0aW5nXG4gICAgaWYodGhpcy5zZXJ2ZXJDbG9zZVJlZil7XG4gICAgICB0aGlzLnNvY2tldC5vZmYodGhpcy5zZXJ2ZXJDbG9zZVJlZilcbiAgICAgIHRoaXMuc2VydmVyQ2xvc2VSZWYgPSBudWxsXG4gICAgfVxuICAgIHRoaXMuc29ja2V0LmRpc2Nvbm5lY3QoY2FsbGJhY2spXG4gIH1cblxuICByZXBsYWNlVHJhbnNwb3J0KHRyYW5zcG9ydCl7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMucmVsb2FkV2l0aEppdHRlclRpbWVyKVxuICAgIHRoaXMuc29ja2V0LnJlcGxhY2VUcmFuc3BvcnQodHJhbnNwb3J0KVxuICAgIHRoaXMuY29ubmVjdCgpXG4gIH1cblxuICBleGVjSlMoZWwsIGVuY29kZWRKUywgZXZlbnRUeXBlID0gbnVsbCl7XG4gICAgbGV0IGUgPSBuZXcgQ3VzdG9tRXZlbnQoXCJwaHg6ZXhlY1wiLCB7ZGV0YWlsOiB7c291cmNlRWxlbWVudDogZWx9fSlcbiAgICB0aGlzLm93bmVyKGVsLCB2aWV3ID0+IEpTLmV4ZWMoZSwgZXZlbnRUeXBlLCBlbmNvZGVkSlMsIHZpZXcsIGVsKSlcbiAgfVxuXG4gIC8vIHByaXZhdGVcblxuICBleGVjSlNIb29rUHVzaChlbCwgcGh4RXZlbnQsIGRhdGEsIGNhbGxiYWNrKXtcbiAgICB0aGlzLndpdGhpbk93bmVycyhlbCwgdmlldyA9PiB7XG4gICAgICBsZXQgZSA9IG5ldyBDdXN0b21FdmVudChcInBoeDpleGVjXCIsIHtkZXRhaWw6IHtzb3VyY2VFbGVtZW50OiBlbH19KVxuICAgICAgSlMuZXhlYyhlLCBcImhvb2tcIiwgcGh4RXZlbnQsIHZpZXcsIGVsLCBbXCJwdXNoXCIsIHtkYXRhLCBjYWxsYmFja31dKVxuICAgIH0pXG4gIH1cblxuICB1bmxvYWQoKXtcbiAgICBpZih0aGlzLnVubG9hZGVkKXsgcmV0dXJuIH1cbiAgICBpZih0aGlzLm1haW4gJiYgdGhpcy5pc0Nvbm5lY3RlZCgpKXsgdGhpcy5sb2codGhpcy5tYWluLCBcInNvY2tldFwiLCAoKSA9PiBbXCJkaXNjb25uZWN0IGZvciBwYWdlIG5hdlwiXSkgfVxuICAgIHRoaXMudW5sb2FkZWQgPSB0cnVlXG4gICAgdGhpcy5kZXN0cm95QWxsVmlld3MoKVxuICAgIHRoaXMuZGlzY29ubmVjdCgpXG4gIH1cblxuICB0cmlnZ2VyRE9NKGtpbmQsIGFyZ3MpeyB0aGlzLmRvbUNhbGxiYWNrc1traW5kXSguLi5hcmdzKSB9XG5cbiAgdGltZShuYW1lLCBmdW5jKXtcbiAgICBpZighdGhpcy5pc1Byb2ZpbGVFbmFibGVkKCkgfHwgIWNvbnNvbGUudGltZSl7IHJldHVybiBmdW5jKCkgfVxuICAgIGNvbnNvbGUudGltZShuYW1lKVxuICAgIGxldCByZXN1bHQgPSBmdW5jKClcbiAgICBjb25zb2xlLnRpbWVFbmQobmFtZSlcbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cblxuICBsb2codmlldywga2luZCwgbXNnQ2FsbGJhY2spe1xuICAgIGlmKHRoaXMudmlld0xvZ2dlcil7XG4gICAgICBsZXQgW21zZywgb2JqXSA9IG1zZ0NhbGxiYWNrKClcbiAgICAgIHRoaXMudmlld0xvZ2dlcih2aWV3LCBraW5kLCBtc2csIG9iailcbiAgICB9IGVsc2UgaWYodGhpcy5pc0RlYnVnRW5hYmxlZCgpKXtcbiAgICAgIGxldCBbbXNnLCBvYmpdID0gbXNnQ2FsbGJhY2soKVxuICAgICAgZGVidWcodmlldywga2luZCwgbXNnLCBvYmopXG4gICAgfVxuICB9XG5cbiAgcmVxdWVzdERPTVVwZGF0ZShjYWxsYmFjayl7XG4gICAgdGhpcy50cmFuc2l0aW9ucy5hZnRlcihjYWxsYmFjaylcbiAgfVxuXG4gIHRyYW5zaXRpb24odGltZSwgb25TdGFydCwgb25Eb25lID0gZnVuY3Rpb24oKXt9KXtcbiAgICB0aGlzLnRyYW5zaXRpb25zLmFkZFRyYW5zaXRpb24odGltZSwgb25TdGFydCwgb25Eb25lKVxuICB9XG5cbiAgb25DaGFubmVsKGNoYW5uZWwsIGV2ZW50LCBjYil7XG4gICAgY2hhbm5lbC5vbihldmVudCwgZGF0YSA9PiB7XG4gICAgICBsZXQgbGF0ZW5jeSA9IHRoaXMuZ2V0TGF0ZW5jeVNpbSgpXG4gICAgICBpZighbGF0ZW5jeSl7XG4gICAgICAgIGNiKGRhdGEpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGNiKGRhdGEpLCBsYXRlbmN5KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICByZWxvYWRXaXRoSml0dGVyKHZpZXcsIGxvZyl7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMucmVsb2FkV2l0aEppdHRlclRpbWVyKVxuICAgIHRoaXMuZGlzY29ubmVjdCgpXG4gICAgbGV0IG1pbk1zID0gdGhpcy5yZWxvYWRKaXR0ZXJNaW5cbiAgICBsZXQgbWF4TXMgPSB0aGlzLnJlbG9hZEppdHRlck1heFxuICAgIGxldCBhZnRlck1zID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heE1zIC0gbWluTXMgKyAxKSkgKyBtaW5Nc1xuICAgIGxldCB0cmllcyA9IEJyb3dzZXIudXBkYXRlTG9jYWwodGhpcy5sb2NhbFN0b3JhZ2UsIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSwgQ09OU0VDVVRJVkVfUkVMT0FEUywgMCwgY291bnQgPT4gY291bnQgKyAxKVxuICAgIGlmKHRyaWVzID49IHRoaXMubWF4UmVsb2Fkcyl7XG4gICAgICBhZnRlck1zID0gdGhpcy5mYWlsc2FmZUppdHRlclxuICAgIH1cbiAgICB0aGlzLnJlbG9hZFdpdGhKaXR0ZXJUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgLy8gaWYgdmlldyBoYXMgcmVjb3ZlcmVkLCBzdWNoIGFzIHRyYW5zcG9ydCByZXBsYWNlZCwgdGhlbiBjYW5jZWxcbiAgICAgIGlmKHZpZXcuaXNEZXN0cm95ZWQoKSB8fCB2aWV3LmlzQ29ubmVjdGVkKCkpeyByZXR1cm4gfVxuICAgICAgdmlldy5kZXN0cm95KClcbiAgICAgIGxvZyA/IGxvZygpIDogdGhpcy5sb2codmlldywgXCJqb2luXCIsICgpID0+IFtgZW5jb3VudGVyZWQgJHt0cmllc30gY29uc2VjdXRpdmUgcmVsb2Fkc2BdKVxuICAgICAgaWYodHJpZXMgPj0gdGhpcy5tYXhSZWxvYWRzKXtcbiAgICAgICAgdGhpcy5sb2codmlldywgXCJqb2luXCIsICgpID0+IFtgZXhjZWVkZWQgJHt0aGlzLm1heFJlbG9hZHN9IGNvbnNlY3V0aXZlIHJlbG9hZHMuIEVudGVyaW5nIGZhaWxzYWZlIG1vZGVgXSlcbiAgICAgIH1cbiAgICAgIGlmKHRoaXMuaGFzUGVuZGluZ0xpbmsoKSl7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IHRoaXMucGVuZGluZ0xpbmtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKVxuICAgICAgfVxuICAgIH0sIGFmdGVyTXMpXG4gIH1cblxuICBnZXRIb29rQ2FsbGJhY2tzKG5hbWUpe1xuICAgIHJldHVybiBuYW1lICYmIG5hbWUuc3RhcnRzV2l0aChcIlBob2VuaXguXCIpID8gSG9va3NbbmFtZS5zcGxpdChcIi5cIilbMV1dIDogdGhpcy5ob29rc1tuYW1lXVxuICB9XG5cbiAgaXNVbmxvYWRlZCgpeyByZXR1cm4gdGhpcy51bmxvYWRlZCB9XG5cbiAgaXNDb25uZWN0ZWQoKXsgcmV0dXJuIHRoaXMuc29ja2V0LmlzQ29ubmVjdGVkKCkgfVxuXG4gIGdldEJpbmRpbmdQcmVmaXgoKXsgcmV0dXJuIHRoaXMuYmluZGluZ1ByZWZpeCB9XG5cbiAgYmluZGluZyhraW5kKXsgcmV0dXJuIGAke3RoaXMuZ2V0QmluZGluZ1ByZWZpeCgpfSR7a2luZH1gIH1cblxuICBjaGFubmVsKHRvcGljLCBwYXJhbXMpeyByZXR1cm4gdGhpcy5zb2NrZXQuY2hhbm5lbCh0b3BpYywgcGFyYW1zKSB9XG5cbiAgam9pbkRlYWRWaWV3KCl7XG4gICAgbGV0IGJvZHkgPSBkb2N1bWVudC5ib2R5XG4gICAgaWYoYm9keSAmJiAhdGhpcy5pc1BoeFZpZXcoYm9keSkgJiYgIXRoaXMuaXNQaHhWaWV3KGRvY3VtZW50LmZpcnN0RWxlbWVudENoaWxkKSl7XG4gICAgICBsZXQgdmlldyA9IHRoaXMubmV3Um9vdFZpZXcoYm9keSlcbiAgICAgIHZpZXcuc2V0SHJlZih0aGlzLmdldEhyZWYoKSlcbiAgICAgIHZpZXcuam9pbkRlYWQoKVxuICAgICAgaWYoIXRoaXMubWFpbil7IHRoaXMubWFpbiA9IHZpZXcgfVxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgIHZpZXcuZXhlY05ld01vdW50ZWQoKVxuICAgICAgICAvLyByZXN0b3JlIHNjcm9sbCBwb3NpdGlvbiB3aGVuIG5hdmlnYXRpbmcgZnJvbSBhbiBleHRlcm5hbCAvIG5vbi1saXZlIHBhZ2VcbiAgICAgICAgdGhpcy5tYXliZVNjcm9sbChoaXN0b3J5LnN0YXRlPy5zY3JvbGwpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGpvaW5Sb290Vmlld3MoKXtcbiAgICBsZXQgcm9vdHNGb3VuZCA9IGZhbHNlXG4gICAgRE9NLmFsbChkb2N1bWVudCwgYCR7UEhYX1ZJRVdfU0VMRUNUT1J9Om5vdChbJHtQSFhfUEFSRU5UX0lEfV0pYCwgcm9vdEVsID0+IHtcbiAgICAgIGlmKCF0aGlzLmdldFJvb3RCeUlkKHJvb3RFbC5pZCkpe1xuICAgICAgICBsZXQgdmlldyA9IHRoaXMubmV3Um9vdFZpZXcocm9vdEVsKVxuICAgICAgICAvLyBzdGlja2llcyBjYW5ub3QgYmUgbW91bnRlZCBhdCB0aGUgcm91dGVyIGFuZCB0aGVyZWZvcmUgc2hvdWxkIG5vdFxuICAgICAgICAvLyBnZXQgYSBocmVmIHNldCBvbiB0aGVtXG4gICAgICAgIGlmKCFET00uaXNQaHhTdGlja3kocm9vdEVsKSl7IHZpZXcuc2V0SHJlZih0aGlzLmdldEhyZWYoKSkgfVxuICAgICAgICB2aWV3LmpvaW4oKVxuICAgICAgICBpZihyb290RWwuaGFzQXR0cmlidXRlKFBIWF9NQUlOKSl7IHRoaXMubWFpbiA9IHZpZXcgfVxuICAgICAgfVxuICAgICAgcm9vdHNGb3VuZCA9IHRydWVcbiAgICB9KVxuICAgIHJldHVybiByb290c0ZvdW5kXG4gIH1cblxuICByZWRpcmVjdCh0bywgZmxhc2gsIHJlbG9hZFRva2VuKXtcbiAgICBpZihyZWxvYWRUb2tlbil7IEJyb3dzZXIuc2V0Q29va2llKFBIWF9SRUxPQURfU1RBVFVTLCByZWxvYWRUb2tlbiwgNjApIH1cbiAgICB0aGlzLnVubG9hZCgpXG4gICAgQnJvd3Nlci5yZWRpcmVjdCh0bywgZmxhc2gpXG4gIH1cblxuICByZXBsYWNlTWFpbihocmVmLCBmbGFzaCwgY2FsbGJhY2sgPSBudWxsLCBsaW5rUmVmID0gdGhpcy5zZXRQZW5kaW5nTGluayhocmVmKSl7XG4gICAgY29uc3QgbGl2ZVJlZmVyZXIgPSB0aGlzLmN1cnJlbnRMb2NhdGlvbi5ocmVmXG4gICAgdGhpcy5vdXRnb2luZ01haW5FbCA9IHRoaXMub3V0Z29pbmdNYWluRWwgfHwgdGhpcy5tYWluLmVsXG5cbiAgICBjb25zdCBzdGlja2llcyA9IERPTS5maW5kUGh4U3RpY2t5KGRvY3VtZW50KSB8fCBbXVxuICAgIGNvbnN0IHJlbW92ZUVscyA9IERPTS5hbGwodGhpcy5vdXRnb2luZ01haW5FbCwgYFske3RoaXMuYmluZGluZyhcInJlbW92ZVwiKX1dYClcbiAgICAgIC5maWx0ZXIoZWwgPT4gIURPTS5pc0NoaWxkT2ZBbnkoZWwsIHN0aWNraWVzKSlcblxuICAgIGNvbnN0IG5ld01haW5FbCA9IERPTS5jbG9uZU5vZGUodGhpcy5vdXRnb2luZ01haW5FbCwgXCJcIilcbiAgICB0aGlzLm1haW4uc2hvd0xvYWRlcih0aGlzLmxvYWRlclRpbWVvdXQpXG4gICAgdGhpcy5tYWluLmRlc3Ryb3koKVxuXG4gICAgdGhpcy5tYWluID0gdGhpcy5uZXdSb290VmlldyhuZXdNYWluRWwsIGZsYXNoLCBsaXZlUmVmZXJlcilcbiAgICB0aGlzLm1haW4uc2V0UmVkaXJlY3QoaHJlZilcbiAgICB0aGlzLnRyYW5zaXRpb25SZW1vdmVzKHJlbW92ZUVscylcbiAgICB0aGlzLm1haW4uam9pbigoam9pbkNvdW50LCBvbkRvbmUpID0+IHtcbiAgICAgIGlmKGpvaW5Db3VudCA9PT0gMSAmJiB0aGlzLmNvbW1pdFBlbmRpbmdMaW5rKGxpbmtSZWYpKXtcbiAgICAgICAgdGhpcy5yZXF1ZXN0RE9NVXBkYXRlKCgpID0+IHtcbiAgICAgICAgICAvLyByZW1vdmUgcGh4LXJlbW92ZSBlbHMgcmlnaHQgYmVmb3JlIHdlIHJlcGxhY2UgdGhlIG1haW4gZWxlbWVudFxuICAgICAgICAgIHJlbW92ZUVscy5mb3JFYWNoKGVsID0+IGVsLnJlbW92ZSgpKVxuICAgICAgICAgIHN0aWNraWVzLmZvckVhY2goZWwgPT4gbmV3TWFpbkVsLmFwcGVuZENoaWxkKGVsKSlcbiAgICAgICAgICB0aGlzLm91dGdvaW5nTWFpbkVsLnJlcGxhY2VXaXRoKG5ld01haW5FbClcbiAgICAgICAgICB0aGlzLm91dGdvaW5nTWFpbkVsID0gbnVsbFxuICAgICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKGxpbmtSZWYpXG4gICAgICAgICAgb25Eb25lKClcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgdHJhbnNpdGlvblJlbW92ZXMoZWxlbWVudHMsIGNhbGxiYWNrKXtcbiAgICBsZXQgcmVtb3ZlQXR0ciA9IHRoaXMuYmluZGluZyhcInJlbW92ZVwiKVxuICAgIGxldCBzaWxlbmNlRXZlbnRzID0gKGUpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKVxuICAgIH1cbiAgICBlbGVtZW50cy5mb3JFYWNoKGVsID0+IHtcbiAgICAgIC8vIHByZXZlbnQgYWxsIGxpc3RlbmVycyB3ZSBjYXJlIGFib3V0IGZyb20gYnViYmxpbmcgdG8gd2luZG93XG4gICAgICAvLyBzaW5jZSB3ZSBhcmUgcmVtb3ZpbmcgdGhlIGVsZW1lbnRcbiAgICAgIGZvcihsZXQgZXZlbnQgb2YgdGhpcy5ib3VuZEV2ZW50TmFtZXMpe1xuICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBzaWxlbmNlRXZlbnRzLCB0cnVlKVxuICAgICAgfVxuICAgICAgdGhpcy5leGVjSlMoZWwsIGVsLmdldEF0dHJpYnV0ZShyZW1vdmVBdHRyKSwgXCJyZW1vdmVcIilcbiAgICB9KVxuICAgIC8vIHJlbW92ZSB0aGUgc2lsZW5jZWQgbGlzdGVuZXJzIHdoZW4gdHJhbnNpdGlvbnMgYXJlIGRvbmUgaW5jYXNlIHRoZSBlbGVtZW50IGlzIHJlLXVzZWRcbiAgICAvLyBhbmQgY2FsbCBjYWxsZXIncyBjYWxsYmFjayBhcyBzb29uIGFzIHdlIGFyZSBkb25lIHdpdGggdHJhbnNpdGlvbnNcbiAgICB0aGlzLnJlcXVlc3RET01VcGRhdGUoKCkgPT4ge1xuICAgICAgZWxlbWVudHMuZm9yRWFjaChlbCA9PiB7XG4gICAgICAgIGZvcihsZXQgZXZlbnQgb2YgdGhpcy5ib3VuZEV2ZW50TmFtZXMpe1xuICAgICAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIHNpbGVuY2VFdmVudHMsIHRydWUpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICBjYWxsYmFjayAmJiBjYWxsYmFjaygpXG4gICAgfSlcbiAgfVxuXG4gIGlzUGh4VmlldyhlbCl7IHJldHVybiBlbC5nZXRBdHRyaWJ1dGUgJiYgZWwuZ2V0QXR0cmlidXRlKFBIWF9TRVNTSU9OKSAhPT0gbnVsbCB9XG5cbiAgbmV3Um9vdFZpZXcoZWwsIGZsYXNoLCBsaXZlUmVmZXJlcil7XG4gICAgbGV0IHZpZXcgPSBuZXcgVmlldyhlbCwgdGhpcywgbnVsbCwgZmxhc2gsIGxpdmVSZWZlcmVyKVxuICAgIHRoaXMucm9vdHNbdmlldy5pZF0gPSB2aWV3XG4gICAgcmV0dXJuIHZpZXdcbiAgfVxuXG4gIG93bmVyKGNoaWxkRWwsIGNhbGxiYWNrKXtcbiAgICBsZXQgdmlldyA9IG1heWJlKGNoaWxkRWwuY2xvc2VzdChQSFhfVklFV19TRUxFQ1RPUiksIGVsID0+IHRoaXMuZ2V0Vmlld0J5RWwoZWwpKSB8fCB0aGlzLm1haW5cbiAgICByZXR1cm4gdmlldyAmJiBjYWxsYmFjayA/IGNhbGxiYWNrKHZpZXcpIDogdmlld1xuICB9XG5cbiAgd2l0aGluT3duZXJzKGNoaWxkRWwsIGNhbGxiYWNrKXtcbiAgICB0aGlzLm93bmVyKGNoaWxkRWwsIHZpZXcgPT4gY2FsbGJhY2sodmlldywgY2hpbGRFbCkpXG4gIH1cblxuICBnZXRWaWV3QnlFbChlbCl7XG4gICAgbGV0IHJvb3RJZCA9IGVsLmdldEF0dHJpYnV0ZShQSFhfUk9PVF9JRClcbiAgICByZXR1cm4gbWF5YmUodGhpcy5nZXRSb290QnlJZChyb290SWQpLCByb290ID0+IHJvb3QuZ2V0RGVzY2VuZGVudEJ5RWwoZWwpKVxuICB9XG5cbiAgZ2V0Um9vdEJ5SWQoaWQpeyByZXR1cm4gdGhpcy5yb290c1tpZF0gfVxuXG4gIGRlc3Ryb3lBbGxWaWV3cygpe1xuICAgIGZvcihsZXQgaWQgaW4gdGhpcy5yb290cyl7XG4gICAgICB0aGlzLnJvb3RzW2lkXS5kZXN0cm95KClcbiAgICAgIGRlbGV0ZSB0aGlzLnJvb3RzW2lkXVxuICAgIH1cbiAgICB0aGlzLm1haW4gPSBudWxsXG4gIH1cblxuICBkZXN0cm95Vmlld0J5RWwoZWwpe1xuICAgIGxldCByb290ID0gdGhpcy5nZXRSb290QnlJZChlbC5nZXRBdHRyaWJ1dGUoUEhYX1JPT1RfSUQpKVxuICAgIGlmKHJvb3QgJiYgcm9vdC5pZCA9PT0gZWwuaWQpe1xuICAgICAgcm9vdC5kZXN0cm95KClcbiAgICAgIGRlbGV0ZSB0aGlzLnJvb3RzW3Jvb3QuaWRdXG4gICAgfSBlbHNlIGlmKHJvb3Qpe1xuICAgICAgcm9vdC5kZXN0cm95RGVzY2VuZGVudChlbC5pZClcbiAgICB9XG4gIH1cblxuICBnZXRBY3RpdmVFbGVtZW50KCl7XG4gICAgcmV0dXJuIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnRcbiAgfVxuXG4gIGRyb3BBY3RpdmVFbGVtZW50KHZpZXcpe1xuICAgIGlmKHRoaXMucHJldkFjdGl2ZSAmJiB2aWV3Lm93bnNFbGVtZW50KHRoaXMucHJldkFjdGl2ZSkpe1xuICAgICAgdGhpcy5wcmV2QWN0aXZlID0gbnVsbFxuICAgIH1cbiAgfVxuXG4gIHJlc3RvcmVQcmV2aW91c2x5QWN0aXZlRm9jdXMoKXtcbiAgICBpZih0aGlzLnByZXZBY3RpdmUgJiYgdGhpcy5wcmV2QWN0aXZlICE9PSBkb2N1bWVudC5ib2R5KXtcbiAgICAgIHRoaXMucHJldkFjdGl2ZS5mb2N1cygpXG4gICAgfVxuICB9XG5cbiAgYmx1ckFjdGl2ZUVsZW1lbnQoKXtcbiAgICB0aGlzLnByZXZBY3RpdmUgPSB0aGlzLmdldEFjdGl2ZUVsZW1lbnQoKVxuICAgIGlmKHRoaXMucHJldkFjdGl2ZSAhPT0gZG9jdW1lbnQuYm9keSl7IHRoaXMucHJldkFjdGl2ZS5ibHVyKCkgfVxuICB9XG5cbiAgYmluZFRvcExldmVsRXZlbnRzKHtkZWFkfSA9IHt9KXtcbiAgICBpZih0aGlzLmJvdW5kVG9wTGV2ZWxFdmVudHMpeyByZXR1cm4gfVxuXG4gICAgdGhpcy5ib3VuZFRvcExldmVsRXZlbnRzID0gdHJ1ZVxuICAgIC8vIGVudGVyIGZhaWxzYWZlIHJlbG9hZCBpZiBzZXJ2ZXIgaGFzIGdvbmUgYXdheSBpbnRlbnRpb25hbGx5LCBzdWNoIGFzIFwiZGlzY29ubmVjdFwiIGJyb2FkY2FzdFxuICAgIHRoaXMuc2VydmVyQ2xvc2VSZWYgPSB0aGlzLnNvY2tldC5vbkNsb3NlKGV2ZW50ID0+IHtcbiAgICAgIC8vIGZhaWxzYWZlIHJlbG9hZCBpZiBub3JtYWwgY2xvc3VyZSBhbmQgd2Ugc3RpbGwgaGF2ZSBhIG1haW4gTFZcbiAgICAgIGlmKGV2ZW50ICYmIGV2ZW50LmNvZGUgPT09IDEwMDAgJiYgdGhpcy5tYWluKXsgcmV0dXJuIHRoaXMucmVsb2FkV2l0aEppdHRlcih0aGlzLm1haW4pIH1cbiAgICB9KVxuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uICgpeyB9KSAvLyBlbnN1cmUgYWxsIGNsaWNrIGV2ZW50cyBidWJibGUgZm9yIG1vYmlsZSBTYWZhcmlcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInBhZ2VzaG93XCIsIGUgPT4ge1xuICAgICAgaWYoZS5wZXJzaXN0ZWQpeyAvLyByZWxvYWQgcGFnZSBpZiBiZWluZyByZXN0b3JlZCBmcm9tIGJhY2svZm9yd2FyZCBjYWNoZVxuICAgICAgICB0aGlzLmdldFNvY2tldCgpLmRpc2Nvbm5lY3QoKVxuICAgICAgICB0aGlzLndpdGhQYWdlTG9hZGluZyh7dG86IHdpbmRvdy5sb2NhdGlvbi5ocmVmLCBraW5kOiBcInJlZGlyZWN0XCJ9KVxuICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKClcbiAgICAgIH1cbiAgICB9LCB0cnVlKVxuICAgIGlmKCFkZWFkKXsgdGhpcy5iaW5kTmF2KCkgfVxuICAgIHRoaXMuYmluZENsaWNrcygpXG4gICAgaWYoIWRlYWQpeyB0aGlzLmJpbmRGb3JtcygpIH1cbiAgICB0aGlzLmJpbmQoe2tleXVwOiBcImtleXVwXCIsIGtleWRvd246IFwia2V5ZG93blwifSwgKGUsIHR5cGUsIHZpZXcsIHRhcmdldEVsLCBwaHhFdmVudCwgX3BoeFRhcmdldCkgPT4ge1xuICAgICAgbGV0IG1hdGNoS2V5ID0gdGFyZ2V0RWwuZ2V0QXR0cmlidXRlKHRoaXMuYmluZGluZyhQSFhfS0VZKSlcbiAgICAgIGxldCBwcmVzc2VkS2V5ID0gZS5rZXkgJiYgZS5rZXkudG9Mb3dlckNhc2UoKSAvLyBjaHJvbWUgY2xpY2tlZCBhdXRvY29tcGxldGVzIHNlbmQgYSBrZXlkb3duIHdpdGhvdXQga2V5XG4gICAgICBpZihtYXRjaEtleSAmJiBtYXRjaEtleS50b0xvd2VyQ2FzZSgpICE9PSBwcmVzc2VkS2V5KXsgcmV0dXJuIH1cblxuICAgICAgbGV0IGRhdGEgPSB7a2V5OiBlLmtleSwgLi4udGhpcy5ldmVudE1ldGEodHlwZSwgZSwgdGFyZ2V0RWwpfVxuICAgICAgSlMuZXhlYyhlLCB0eXBlLCBwaHhFdmVudCwgdmlldywgdGFyZ2V0RWwsIFtcInB1c2hcIiwge2RhdGF9XSlcbiAgICB9KVxuICAgIHRoaXMuYmluZCh7Ymx1cjogXCJmb2N1c291dFwiLCBmb2N1czogXCJmb2N1c2luXCJ9LCAoZSwgdHlwZSwgdmlldywgdGFyZ2V0RWwsIHBoeEV2ZW50LCBwaHhUYXJnZXQpID0+IHtcbiAgICAgIGlmKCFwaHhUYXJnZXQpe1xuICAgICAgICBsZXQgZGF0YSA9IHtrZXk6IGUua2V5LCAuLi50aGlzLmV2ZW50TWV0YSh0eXBlLCBlLCB0YXJnZXRFbCl9XG4gICAgICAgIEpTLmV4ZWMoZSwgdHlwZSwgcGh4RXZlbnQsIHZpZXcsIHRhcmdldEVsLCBbXCJwdXNoXCIsIHtkYXRhfV0pXG4gICAgICB9XG4gICAgfSlcbiAgICB0aGlzLmJpbmQoe2JsdXI6IFwiYmx1clwiLCBmb2N1czogXCJmb2N1c1wifSwgKGUsIHR5cGUsIHZpZXcsIHRhcmdldEVsLCBwaHhFdmVudCwgcGh4VGFyZ2V0KSA9PiB7XG4gICAgICAvLyBibHVyIGFuZCBmb2N1cyBhcmUgdHJpZ2dlcmVkIG9uIGRvY3VtZW50IGFuZCB3aW5kb3cuIERpc2NhcmQgb25lIHRvIGF2b2lkIGR1cHNcbiAgICAgIGlmKHBoeFRhcmdldCA9PT0gXCJ3aW5kb3dcIil7XG4gICAgICAgIGxldCBkYXRhID0gdGhpcy5ldmVudE1ldGEodHlwZSwgZSwgdGFyZ2V0RWwpXG4gICAgICAgIEpTLmV4ZWMoZSwgdHlwZSwgcGh4RXZlbnQsIHZpZXcsIHRhcmdldEVsLCBbXCJwdXNoXCIsIHtkYXRhfV0pXG4gICAgICB9XG4gICAgfSlcbiAgICB0aGlzLm9uKFwiZHJhZ292ZXJcIiwgZSA9PiBlLnByZXZlbnREZWZhdWx0KCkpXG4gICAgdGhpcy5vbihcImRyb3BcIiwgZSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgIGxldCBkcm9wVGFyZ2V0SWQgPSBtYXliZShjbG9zZXN0UGh4QmluZGluZyhlLnRhcmdldCwgdGhpcy5iaW5kaW5nKFBIWF9EUk9QX1RBUkdFVCkpLCB0cnVlVGFyZ2V0ID0+IHtcbiAgICAgICAgcmV0dXJuIHRydWVUYXJnZXQuZ2V0QXR0cmlidXRlKHRoaXMuYmluZGluZyhQSFhfRFJPUF9UQVJHRVQpKVxuICAgICAgfSlcbiAgICAgIGxldCBkcm9wVGFyZ2V0ID0gZHJvcFRhcmdldElkICYmIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRyb3BUYXJnZXRJZClcbiAgICAgIGxldCBmaWxlcyA9IEFycmF5LmZyb20oZS5kYXRhVHJhbnNmZXIuZmlsZXMgfHwgW10pXG4gICAgICBpZighZHJvcFRhcmdldCB8fCBkcm9wVGFyZ2V0LmRpc2FibGVkIHx8IGZpbGVzLmxlbmd0aCA9PT0gMCB8fCAhKGRyb3BUYXJnZXQuZmlsZXMgaW5zdGFuY2VvZiBGaWxlTGlzdCkpeyByZXR1cm4gfVxuXG4gICAgICBMaXZlVXBsb2FkZXIudHJhY2tGaWxlcyhkcm9wVGFyZ2V0LCBmaWxlcywgZS5kYXRhVHJhbnNmZXIpXG4gICAgICBkcm9wVGFyZ2V0LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwiaW5wdXRcIiwge2J1YmJsZXM6IHRydWV9KSlcbiAgICB9KVxuICAgIHRoaXMub24oUEhYX1RSQUNLX1VQTE9BRFMsIGUgPT4ge1xuICAgICAgbGV0IHVwbG9hZFRhcmdldCA9IGUudGFyZ2V0XG4gICAgICBpZighRE9NLmlzVXBsb2FkSW5wdXQodXBsb2FkVGFyZ2V0KSl7IHJldHVybiB9XG4gICAgICBsZXQgZmlsZXMgPSBBcnJheS5mcm9tKGUuZGV0YWlsLmZpbGVzIHx8IFtdKS5maWx0ZXIoZiA9PiBmIGluc3RhbmNlb2YgRmlsZSB8fCBmIGluc3RhbmNlb2YgQmxvYilcbiAgICAgIExpdmVVcGxvYWRlci50cmFja0ZpbGVzKHVwbG9hZFRhcmdldCwgZmlsZXMpXG4gICAgICB1cGxvYWRUYXJnZXQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJpbnB1dFwiLCB7YnViYmxlczogdHJ1ZX0pKVxuICAgIH0pXG4gIH1cblxuICBldmVudE1ldGEoZXZlbnROYW1lLCBlLCB0YXJnZXRFbCl7XG4gICAgbGV0IGNhbGxiYWNrID0gdGhpcy5tZXRhZGF0YUNhbGxiYWNrc1tldmVudE5hbWVdXG4gICAgcmV0dXJuIGNhbGxiYWNrID8gY2FsbGJhY2soZSwgdGFyZ2V0RWwpIDoge31cbiAgfVxuXG4gIHNldFBlbmRpbmdMaW5rKGhyZWYpe1xuICAgIHRoaXMubGlua1JlZisrXG4gICAgdGhpcy5wZW5kaW5nTGluayA9IGhyZWZcbiAgICB0aGlzLnJlc2V0UmVsb2FkU3RhdHVzKClcbiAgICByZXR1cm4gdGhpcy5saW5rUmVmXG4gIH1cblxuICAvLyBhbnl0aW1lIHdlIGFyZSBuYXZpZ2F0aW5nIG9yIGNvbm5lY3RpbmcsIGRyb3AgcmVsb2FkIGNvb2tpZSBpbiBjYXNlXG4gIC8vIHdlIGlzc3VlIHRoZSBjb29raWUgYnV0IHRoZSBuZXh0IHJlcXVlc3Qgd2FzIGludGVycnVwdGVkIGFuZCB0aGUgc2VydmVyIG5ldmVyIGRyb3BwZWQgaXRcbiAgcmVzZXRSZWxvYWRTdGF0dXMoKXsgQnJvd3Nlci5kZWxldGVDb29raWUoUEhYX1JFTE9BRF9TVEFUVVMpIH1cblxuICBjb21taXRQZW5kaW5nTGluayhsaW5rUmVmKXtcbiAgICBpZih0aGlzLmxpbmtSZWYgIT09IGxpbmtSZWYpe1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaHJlZiA9IHRoaXMucGVuZGluZ0xpbmtcbiAgICAgIHRoaXMucGVuZGluZ0xpbmsgPSBudWxsXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIGdldEhyZWYoKXsgcmV0dXJuIHRoaXMuaHJlZiB9XG5cbiAgaGFzUGVuZGluZ0xpbmsoKXsgcmV0dXJuICEhdGhpcy5wZW5kaW5nTGluayB9XG5cbiAgYmluZChldmVudHMsIGNhbGxiYWNrKXtcbiAgICBmb3IobGV0IGV2ZW50IGluIGV2ZW50cyl7XG4gICAgICBsZXQgYnJvd3NlckV2ZW50TmFtZSA9IGV2ZW50c1tldmVudF1cblxuICAgICAgdGhpcy5vbihicm93c2VyRXZlbnROYW1lLCBlID0+IHtcbiAgICAgICAgbGV0IGJpbmRpbmcgPSB0aGlzLmJpbmRpbmcoZXZlbnQpXG4gICAgICAgIGxldCB3aW5kb3dCaW5kaW5nID0gdGhpcy5iaW5kaW5nKGB3aW5kb3ctJHtldmVudH1gKVxuICAgICAgICBsZXQgdGFyZ2V0UGh4RXZlbnQgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUgJiYgZS50YXJnZXQuZ2V0QXR0cmlidXRlKGJpbmRpbmcpXG4gICAgICAgIGlmKHRhcmdldFBoeEV2ZW50KXtcbiAgICAgICAgICB0aGlzLmRlYm91bmNlKGUudGFyZ2V0LCBlLCBicm93c2VyRXZlbnROYW1lLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLndpdGhpbk93bmVycyhlLnRhcmdldCwgdmlldyA9PiB7XG4gICAgICAgICAgICAgIGNhbGxiYWNrKGUsIGV2ZW50LCB2aWV3LCBlLnRhcmdldCwgdGFyZ2V0UGh4RXZlbnQsIG51bGwpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgRE9NLmFsbChkb2N1bWVudCwgYFske3dpbmRvd0JpbmRpbmd9XWAsIGVsID0+IHtcbiAgICAgICAgICAgIGxldCBwaHhFdmVudCA9IGVsLmdldEF0dHJpYnV0ZSh3aW5kb3dCaW5kaW5nKVxuICAgICAgICAgICAgdGhpcy5kZWJvdW5jZShlbCwgZSwgYnJvd3NlckV2ZW50TmFtZSwgKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLndpdGhpbk93bmVycyhlbCwgdmlldyA9PiB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZSwgZXZlbnQsIHZpZXcsIGVsLCBwaHhFdmVudCwgXCJ3aW5kb3dcIilcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBiaW5kQ2xpY2tzKCl7XG4gICAgdGhpcy5vbihcIm1vdXNlZG93blwiLCBlID0+IHRoaXMuY2xpY2tTdGFydGVkQXRUYXJnZXQgPSBlLnRhcmdldClcbiAgICB0aGlzLmJpbmRDbGljayhcImNsaWNrXCIsIFwiY2xpY2tcIilcbiAgfVxuXG4gIGJpbmRDbGljayhldmVudE5hbWUsIGJpbmRpbmdOYW1lKXtcbiAgICBsZXQgY2xpY2sgPSB0aGlzLmJpbmRpbmcoYmluZGluZ05hbWUpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBlID0+IHtcbiAgICAgIGxldCB0YXJnZXQgPSBudWxsXG4gICAgICAvLyBhIHN5bnRoZXRpYyBjbGljayBldmVudCAoZGV0YWlsIDApIHdpbGwgbm90IGhhdmUgY2F1c2VkIGEgbW91c2Vkb3duIGV2ZW50LFxuICAgICAgLy8gdGhlcmVmb3JlIHRoZSBjbGlja1N0YXJ0ZWRBdFRhcmdldCBpcyBzdGFsZVxuICAgICAgaWYoZS5kZXRhaWwgPT09IDApIHRoaXMuY2xpY2tTdGFydGVkQXRUYXJnZXQgPSBlLnRhcmdldFxuICAgICAgbGV0IGNsaWNrU3RhcnRlZEF0VGFyZ2V0ID0gdGhpcy5jbGlja1N0YXJ0ZWRBdFRhcmdldCB8fCBlLnRhcmdldFxuICAgICAgLy8gd2hlbiBzZWFyY2hpbmcgdGhlIHRhcmdldCBmb3IgdGhlIGNsaWNrIGV2ZW50LCB3ZSBhbHdheXMgd2FudCB0b1xuICAgICAgLy8gdXNlIHRoZSBhY3R1YWwgZXZlbnQgdGFyZ2V0LCBzZWUgIzMzNzJcbiAgICAgIHRhcmdldCA9IGNsb3Nlc3RQaHhCaW5kaW5nKGUudGFyZ2V0LCBjbGljaylcbiAgICAgIHRoaXMuZGlzcGF0Y2hDbGlja0F3YXkoZSwgY2xpY2tTdGFydGVkQXRUYXJnZXQpXG4gICAgICB0aGlzLmNsaWNrU3RhcnRlZEF0VGFyZ2V0ID0gbnVsbFxuICAgICAgbGV0IHBoeEV2ZW50ID0gdGFyZ2V0ICYmIHRhcmdldC5nZXRBdHRyaWJ1dGUoY2xpY2spXG4gICAgICBpZighcGh4RXZlbnQpe1xuICAgICAgICBpZihET00uaXNOZXdQYWdlQ2xpY2soZSwgd2luZG93LmxvY2F0aW9uKSl7IHRoaXMudW5sb2FkKCkgfVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgaWYodGFyZ2V0LmdldEF0dHJpYnV0ZShcImhyZWZcIikgPT09IFwiI1wiKXsgZS5wcmV2ZW50RGVmYXVsdCgpIH1cblxuICAgICAgLy8gbm9vcCBpZiB3ZSBhcmUgaW4gdGhlIG1pZGRsZSBvZiBhd2FpdGluZyBhbiBhY2sgZm9yIHRoaXMgZWwgYWxyZWFkeVxuICAgICAgaWYodGFyZ2V0Lmhhc0F0dHJpYnV0ZShQSFhfUkVGX1NSQykpeyByZXR1cm4gfVxuXG4gICAgICB0aGlzLmRlYm91bmNlKHRhcmdldCwgZSwgXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIHRoaXMud2l0aGluT3duZXJzKHRhcmdldCwgdmlldyA9PiB7XG4gICAgICAgICAgSlMuZXhlYyhlLCBcImNsaWNrXCIsIHBoeEV2ZW50LCB2aWV3LCB0YXJnZXQsIFtcInB1c2hcIiwge2RhdGE6IHRoaXMuZXZlbnRNZXRhKFwiY2xpY2tcIiwgZSwgdGFyZ2V0KX1dKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9LCBmYWxzZSlcbiAgfVxuXG4gIGRpc3BhdGNoQ2xpY2tBd2F5KGUsIGNsaWNrU3RhcnRlZEF0KXtcbiAgICBsZXQgcGh4Q2xpY2tBd2F5ID0gdGhpcy5iaW5kaW5nKFwiY2xpY2stYXdheVwiKVxuICAgIERPTS5hbGwoZG9jdW1lbnQsIGBbJHtwaHhDbGlja0F3YXl9XWAsIGVsID0+IHtcbiAgICAgIGlmKCEoZWwuaXNTYW1lTm9kZShjbGlja1N0YXJ0ZWRBdCkgfHwgZWwuY29udGFpbnMoY2xpY2tTdGFydGVkQXQpKSl7XG4gICAgICAgIHRoaXMud2l0aGluT3duZXJzKGVsLCB2aWV3ID0+IHtcbiAgICAgICAgICBsZXQgcGh4RXZlbnQgPSBlbC5nZXRBdHRyaWJ1dGUocGh4Q2xpY2tBd2F5KVxuICAgICAgICAgIGlmKEpTLmlzVmlzaWJsZShlbCkgJiYgSlMuaXNJblZpZXdwb3J0KGVsKSl7XG4gICAgICAgICAgICBKUy5leGVjKGUsIFwiY2xpY2tcIiwgcGh4RXZlbnQsIHZpZXcsIGVsLCBbXCJwdXNoXCIsIHtkYXRhOiB0aGlzLmV2ZW50TWV0YShcImNsaWNrXCIsIGUsIGUudGFyZ2V0KX1dKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgYmluZE5hdigpe1xuICAgIGlmKCFCcm93c2VyLmNhblB1c2hTdGF0ZSgpKXsgcmV0dXJuIH1cbiAgICBpZihoaXN0b3J5LnNjcm9sbFJlc3RvcmF0aW9uKXsgaGlzdG9yeS5zY3JvbGxSZXN0b3JhdGlvbiA9IFwibWFudWFsXCIgfVxuICAgIGxldCBzY3JvbGxUaW1lciA9IG51bGxcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCBfZSA9PiB7XG4gICAgICBjbGVhclRpbWVvdXQoc2Nyb2xsVGltZXIpXG4gICAgICBzY3JvbGxUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBCcm93c2VyLnVwZGF0ZUN1cnJlbnRTdGF0ZShzdGF0ZSA9PiBPYmplY3QuYXNzaWduKHN0YXRlLCB7c2Nyb2xsOiB3aW5kb3cuc2Nyb2xsWX0pKVxuICAgICAgfSwgMTAwKVxuICAgIH0pXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJwb3BzdGF0ZVwiLCBldmVudCA9PiB7XG4gICAgICBpZighdGhpcy5yZWdpc3Rlck5ld0xvY2F0aW9uKHdpbmRvdy5sb2NhdGlvbikpeyByZXR1cm4gfVxuICAgICAgbGV0IHt0eXBlLCBiYWNrVHlwZSwgaWQsIHNjcm9sbCwgcG9zaXRpb259ID0gZXZlbnQuc3RhdGUgfHwge31cbiAgICAgIGxldCBocmVmID0gd2luZG93LmxvY2F0aW9uLmhyZWZcblxuICAgICAgLy8gQ29tcGFyZSBwb3NpdGlvbnMgdG8gZGV0ZXJtaW5lIGRpcmVjdGlvblxuICAgICAgbGV0IGlzRm9yd2FyZCA9IHBvc2l0aW9uID4gdGhpcy5jdXJyZW50SGlzdG9yeVBvc2l0aW9uXG5cbiAgICAgIHR5cGUgPSBpc0ZvcndhcmQgPyB0eXBlIDogKGJhY2tUeXBlIHx8IHR5cGUpXG5cbiAgICAgIC8vIFVwZGF0ZSBjdXJyZW50IHBvc2l0aW9uXG4gICAgICB0aGlzLmN1cnJlbnRIaXN0b3J5UG9zaXRpb24gPSBwb3NpdGlvbiB8fCAwXG4gICAgICB0aGlzLnNlc3Npb25TdG9yYWdlLnNldEl0ZW0oUEhYX0xWX0hJU1RPUllfUE9TSVRJT04sIHRoaXMuY3VycmVudEhpc3RvcnlQb3NpdGlvbi50b1N0cmluZygpKVxuXG4gICAgICBET00uZGlzcGF0Y2hFdmVudCh3aW5kb3csIFwicGh4Om5hdmlnYXRlXCIsIHtkZXRhaWw6IHtocmVmLCBwYXRjaDogdHlwZSA9PT0gXCJwYXRjaFwiLCBwb3A6IHRydWUsIGRpcmVjdGlvbjogaXNGb3J3YXJkID8gXCJmb3J3YXJkXCIgOiBcImJhY2t3YXJkXCJ9fSlcbiAgICAgIHRoaXMucmVxdWVzdERPTVVwZGF0ZSgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrID0gKCkgPT4geyB0aGlzLm1heWJlU2Nyb2xsKHNjcm9sbCkgfVxuICAgICAgICBpZih0aGlzLm1haW4uaXNDb25uZWN0ZWQoKSAmJiAodHlwZSA9PT0gXCJwYXRjaFwiICYmIGlkID09PSB0aGlzLm1haW4uaWQpKXtcbiAgICAgICAgICB0aGlzLm1haW4ucHVzaExpbmtQYXRjaChldmVudCwgaHJlZiwgbnVsbCwgY2FsbGJhY2spXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5yZXBsYWNlTWFpbihocmVmLCBudWxsLCBjYWxsYmFjaylcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9LCBmYWxzZSlcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGUgPT4ge1xuICAgICAgbGV0IHRhcmdldCA9IGNsb3Nlc3RQaHhCaW5kaW5nKGUudGFyZ2V0LCBQSFhfTElWRV9MSU5LKVxuICAgICAgbGV0IHR5cGUgPSB0YXJnZXQgJiYgdGFyZ2V0LmdldEF0dHJpYnV0ZShQSFhfTElWRV9MSU5LKVxuICAgICAgaWYoIXR5cGUgfHwgIXRoaXMuaXNDb25uZWN0ZWQoKSB8fCAhdGhpcy5tYWluIHx8IERPTS53YW50c05ld1RhYihlKSl7IHJldHVybiB9XG5cbiAgICAgIC8vIFdoZW4gd3JhcHBpbmcgYW4gU1ZHIGVsZW1lbnQgaW4gYW4gYW5jaG9yIHRhZywgdGhlIGhyZWYgY2FuIGJlIGFuIFNWR0FuaW1hdGVkU3RyaW5nXG4gICAgICBsZXQgaHJlZiA9IHRhcmdldC5ocmVmIGluc3RhbmNlb2YgU1ZHQW5pbWF0ZWRTdHJpbmcgPyB0YXJnZXQuaHJlZi5iYXNlVmFsIDogdGFyZ2V0LmhyZWZcblxuICAgICAgbGV0IGxpbmtTdGF0ZSA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoUEhYX0xJTktfU1RBVEUpXG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCkgLy8gZG8gbm90IGJ1YmJsZSBjbGljayB0byByZWd1bGFyIHBoeC1jbGljayBiaW5kaW5nc1xuICAgICAgaWYodGhpcy5wZW5kaW5nTGluayA9PT0gaHJlZil7IHJldHVybiB9XG5cbiAgICAgIHRoaXMucmVxdWVzdERPTVVwZGF0ZSgoKSA9PiB7XG4gICAgICAgIGlmKHR5cGUgPT09IFwicGF0Y2hcIil7XG4gICAgICAgICAgdGhpcy5wdXNoSGlzdG9yeVBhdGNoKGUsIGhyZWYsIGxpbmtTdGF0ZSwgdGFyZ2V0KVxuICAgICAgICB9IGVsc2UgaWYodHlwZSA9PT0gXCJyZWRpcmVjdFwiKXtcbiAgICAgICAgICB0aGlzLmhpc3RvcnlSZWRpcmVjdChlLCBocmVmLCBsaW5rU3RhdGUsIG51bGwsIHRhcmdldClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGV4cGVjdGVkICR7UEhYX0xJVkVfTElOS30gdG8gYmUgXCJwYXRjaFwiIG9yIFwicmVkaXJlY3RcIiwgZ290OiAke3R5cGV9YClcbiAgICAgICAgfVxuICAgICAgICBsZXQgcGh4Q2xpY2sgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKHRoaXMuYmluZGluZyhcImNsaWNrXCIpKVxuICAgICAgICBpZihwaHhDbGljayl7XG4gICAgICAgICAgdGhpcy5yZXF1ZXN0RE9NVXBkYXRlKCgpID0+IHRoaXMuZXhlY0pTKHRhcmdldCwgcGh4Q2xpY2ssIFwiY2xpY2tcIikpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSwgZmFsc2UpXG4gIH1cblxuICBtYXliZVNjcm9sbChzY3JvbGwpe1xuICAgIGlmKHR5cGVvZihzY3JvbGwpID09PSBcIm51bWJlclwiKXtcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCBzY3JvbGwpXG4gICAgICB9KSAvLyB0aGUgYm9keSBuZWVkcyB0byByZW5kZXIgYmVmb3JlIHdlIHNjcm9sbC5cbiAgICB9XG4gIH1cblxuICBkaXNwYXRjaEV2ZW50KGV2ZW50LCBwYXlsb2FkID0ge30pe1xuICAgIERPTS5kaXNwYXRjaEV2ZW50KHdpbmRvdywgYHBoeDoke2V2ZW50fWAsIHtkZXRhaWw6IHBheWxvYWR9KVxuICB9XG5cbiAgZGlzcGF0Y2hFdmVudHMoZXZlbnRzKXtcbiAgICBldmVudHMuZm9yRWFjaCgoW2V2ZW50LCBwYXlsb2FkXSkgPT4gdGhpcy5kaXNwYXRjaEV2ZW50KGV2ZW50LCBwYXlsb2FkKSlcbiAgfVxuXG4gIHdpdGhQYWdlTG9hZGluZyhpbmZvLCBjYWxsYmFjayl7XG4gICAgRE9NLmRpc3BhdGNoRXZlbnQod2luZG93LCBcInBoeDpwYWdlLWxvYWRpbmctc3RhcnRcIiwge2RldGFpbDogaW5mb30pXG4gICAgbGV0IGRvbmUgPSAoKSA9PiBET00uZGlzcGF0Y2hFdmVudCh3aW5kb3csIFwicGh4OnBhZ2UtbG9hZGluZy1zdG9wXCIsIHtkZXRhaWw6IGluZm99KVxuICAgIHJldHVybiBjYWxsYmFjayA/IGNhbGxiYWNrKGRvbmUpIDogZG9uZVxuICB9XG5cbiAgcHVzaEhpc3RvcnlQYXRjaChlLCBocmVmLCBsaW5rU3RhdGUsIHRhcmdldEVsKXtcbiAgICBpZighdGhpcy5pc0Nvbm5lY3RlZCgpIHx8ICF0aGlzLm1haW4uaXNNYWluKCkpeyByZXR1cm4gQnJvd3Nlci5yZWRpcmVjdChocmVmKSB9XG5cbiAgICB0aGlzLndpdGhQYWdlTG9hZGluZyh7dG86IGhyZWYsIGtpbmQ6IFwicGF0Y2hcIn0sIGRvbmUgPT4ge1xuICAgICAgdGhpcy5tYWluLnB1c2hMaW5rUGF0Y2goZSwgaHJlZiwgdGFyZ2V0RWwsIGxpbmtSZWYgPT4ge1xuICAgICAgICB0aGlzLmhpc3RvcnlQYXRjaChocmVmLCBsaW5rU3RhdGUsIGxpbmtSZWYpXG4gICAgICAgIGRvbmUoKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgaGlzdG9yeVBhdGNoKGhyZWYsIGxpbmtTdGF0ZSwgbGlua1JlZiA9IHRoaXMuc2V0UGVuZGluZ0xpbmsoaHJlZikpe1xuICAgIGlmKCF0aGlzLmNvbW1pdFBlbmRpbmdMaW5rKGxpbmtSZWYpKXsgcmV0dXJuIH1cblxuICAgIC8vIEluY3JlbWVudCBwb3NpdGlvbiBmb3IgbmV3IHN0YXRlXG4gICAgdGhpcy5jdXJyZW50SGlzdG9yeVBvc2l0aW9uKytcbiAgICB0aGlzLnNlc3Npb25TdG9yYWdlLnNldEl0ZW0oUEhYX0xWX0hJU1RPUllfUE9TSVRJT04sIHRoaXMuY3VycmVudEhpc3RvcnlQb3NpdGlvbi50b1N0cmluZygpKVxuXG4gICAgLy8gc3RvcmUgdGhlIHR5cGUgZm9yIGJhY2sgbmF2aWdhdGlvblxuICAgIEJyb3dzZXIudXBkYXRlQ3VycmVudFN0YXRlKChzdGF0ZSkgPT4gKHsuLi5zdGF0ZSwgYmFja1R5cGU6IFwicGF0Y2hcIn0pKVxuXG4gICAgQnJvd3Nlci5wdXNoU3RhdGUobGlua1N0YXRlLCB7XG4gICAgICB0eXBlOiBcInBhdGNoXCIsXG4gICAgICBpZDogdGhpcy5tYWluLmlkLFxuICAgICAgcG9zaXRpb246IHRoaXMuY3VycmVudEhpc3RvcnlQb3NpdGlvblxuICAgIH0sIGhyZWYpXG5cbiAgICBET00uZGlzcGF0Y2hFdmVudCh3aW5kb3csIFwicGh4Om5hdmlnYXRlXCIsIHtkZXRhaWw6IHtwYXRjaDogdHJ1ZSwgaHJlZiwgcG9wOiBmYWxzZSwgZGlyZWN0aW9uOiBcImZvcndhcmRcIn19KVxuICAgIHRoaXMucmVnaXN0ZXJOZXdMb2NhdGlvbih3aW5kb3cubG9jYXRpb24pXG4gIH1cblxuICBoaXN0b3J5UmVkaXJlY3QoZSwgaHJlZiwgbGlua1N0YXRlLCBmbGFzaCwgdGFyZ2V0RWwpe1xuICAgIGNvbnN0IGNsaWNrTG9hZGluZyA9IHRhcmdldEVsICYmIGUuaXNUcnVzdGVkICYmIGUudHlwZSAhPT0gXCJwb3BzdGF0ZVwiXG4gICAgaWYoY2xpY2tMb2FkaW5nKXsgdGFyZ2V0RWwuY2xhc3NMaXN0LmFkZChcInBoeC1jbGljay1sb2FkaW5nXCIpIH1cbiAgICBpZighdGhpcy5pc0Nvbm5lY3RlZCgpIHx8ICF0aGlzLm1haW4uaXNNYWluKCkpeyByZXR1cm4gQnJvd3Nlci5yZWRpcmVjdChocmVmLCBmbGFzaCkgfVxuXG4gICAgLy8gY29udmVydCB0byBmdWxsIGhyZWYgaWYgb25seSBwYXRoIHByZWZpeFxuICAgIGlmKC9eXFwvJHxeXFwvW15cXC9dKy4qJC8udGVzdChocmVmKSl7XG4gICAgICBsZXQge3Byb3RvY29sLCBob3N0fSA9IHdpbmRvdy5sb2NhdGlvblxuICAgICAgaHJlZiA9IGAke3Byb3RvY29sfS8vJHtob3N0fSR7aHJlZn1gXG4gICAgfVxuICAgIGxldCBzY3JvbGwgPSB3aW5kb3cuc2Nyb2xsWVxuICAgIHRoaXMud2l0aFBhZ2VMb2FkaW5nKHt0bzogaHJlZiwga2luZDogXCJyZWRpcmVjdFwifSwgZG9uZSA9PiB7XG4gICAgICB0aGlzLnJlcGxhY2VNYWluKGhyZWYsIGZsYXNoLCAobGlua1JlZikgPT4ge1xuICAgICAgICBpZihsaW5rUmVmID09PSB0aGlzLmxpbmtSZWYpe1xuICAgICAgICAgIC8vIEluY3JlbWVudCBwb3NpdGlvbiBmb3IgbmV3IHN0YXRlXG4gICAgICAgICAgdGhpcy5jdXJyZW50SGlzdG9yeVBvc2l0aW9uKytcbiAgICAgICAgICB0aGlzLnNlc3Npb25TdG9yYWdlLnNldEl0ZW0oUEhYX0xWX0hJU1RPUllfUE9TSVRJT04sIHRoaXMuY3VycmVudEhpc3RvcnlQb3NpdGlvbi50b1N0cmluZygpKVxuXG4gICAgICAgICAgLy8gc3RvcmUgdGhlIHR5cGUgZm9yIGJhY2sgbmF2aWdhdGlvblxuICAgICAgICAgIEJyb3dzZXIudXBkYXRlQ3VycmVudFN0YXRlKChzdGF0ZSkgPT4gKHsuLi5zdGF0ZSwgYmFja1R5cGU6IFwicmVkaXJlY3RcIn0pKVxuXG4gICAgICAgICAgQnJvd3Nlci5wdXNoU3RhdGUobGlua1N0YXRlLCB7XG4gICAgICAgICAgICB0eXBlOiBcInJlZGlyZWN0XCIsXG4gICAgICAgICAgICBpZDogdGhpcy5tYWluLmlkLFxuICAgICAgICAgICAgc2Nyb2xsOiBzY3JvbGwsXG4gICAgICAgICAgICBwb3NpdGlvbjogdGhpcy5jdXJyZW50SGlzdG9yeVBvc2l0aW9uXG4gICAgICAgICAgfSwgaHJlZilcblxuICAgICAgICAgIERPTS5kaXNwYXRjaEV2ZW50KHdpbmRvdywgXCJwaHg6bmF2aWdhdGVcIiwge2RldGFpbDoge2hyZWYsIHBhdGNoOiBmYWxzZSwgcG9wOiBmYWxzZSwgZGlyZWN0aW9uOiBcImZvcndhcmRcIn19KVxuICAgICAgICAgIHRoaXMucmVnaXN0ZXJOZXdMb2NhdGlvbih3aW5kb3cubG9jYXRpb24pXG4gICAgICAgIH1cbiAgICAgICAgLy8gZXhwbGljaXRseSB1bmRvIGNsaWNrLWxvYWRpbmcgY2xhc3NcbiAgICAgICAgLy8gKGluIGNhc2UgaXQgb3JpZ2luYXRlZCBpbiBhIHN0aWNreSBsaXZlIHZpZXcsIG90aGVyd2lzZSBpdCB3b3VsZCBiZSByZW1vdmVkIGFueXdheSlcbiAgICAgICAgaWYoY2xpY2tMb2FkaW5nKXsgdGFyZ2V0RWwuY2xhc3NMaXN0LnJlbW92ZShcInBoeC1jbGljay1sb2FkaW5nXCIpIH1cbiAgICAgICAgZG9uZSgpXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICByZWdpc3Rlck5ld0xvY2F0aW9uKG5ld0xvY2F0aW9uKXtcbiAgICBsZXQge3BhdGhuYW1lLCBzZWFyY2h9ID0gdGhpcy5jdXJyZW50TG9jYXRpb25cbiAgICBpZihwYXRobmFtZSArIHNlYXJjaCA9PT0gbmV3TG9jYXRpb24ucGF0aG5hbWUgKyBuZXdMb2NhdGlvbi5zZWFyY2gpe1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY3VycmVudExvY2F0aW9uID0gY2xvbmUobmV3TG9jYXRpb24pXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIGJpbmRGb3Jtcygpe1xuICAgIGxldCBpdGVyYXRpb25zID0gMFxuICAgIGxldCBleHRlcm5hbEZvcm1TdWJtaXR0ZWQgPSBmYWxzZVxuXG4gICAgLy8gZGlzYWJsZSBmb3JtcyBvbiBzdWJtaXQgdGhhdCB0cmFjayBwaHgtY2hhbmdlIGJ1dCBwZXJmb3JtIGV4dGVybmFsIHN1Ym1pdFxuICAgIHRoaXMub24oXCJzdWJtaXRcIiwgZSA9PiB7XG4gICAgICBsZXQgcGh4U3VibWl0ID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKHRoaXMuYmluZGluZyhcInN1Ym1pdFwiKSlcbiAgICAgIGxldCBwaHhDaGFuZ2UgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFwiY2hhbmdlXCIpKVxuICAgICAgaWYoIWV4dGVybmFsRm9ybVN1Ym1pdHRlZCAmJiBwaHhDaGFuZ2UgJiYgIXBoeFN1Ym1pdCl7XG4gICAgICAgIGV4dGVybmFsRm9ybVN1Ym1pdHRlZCA9IHRydWVcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIHRoaXMud2l0aGluT3duZXJzKGUudGFyZ2V0LCB2aWV3ID0+IHtcbiAgICAgICAgICB2aWV3LmRpc2FibGVGb3JtKGUudGFyZ2V0KVxuICAgICAgICAgIC8vIHNhZmFyaSBuZWVkcyBuZXh0IHRpY2tcbiAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICAgIGlmKERPTS5pc1VubG9hZGFibGVGb3JtU3VibWl0KGUpKXsgdGhpcy51bmxvYWQoKSB9XG4gICAgICAgICAgICBlLnRhcmdldC5zdWJtaXQoKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMub24oXCJzdWJtaXRcIiwgZSA9PiB7XG4gICAgICBsZXQgcGh4RXZlbnQgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFwic3VibWl0XCIpKVxuICAgICAgaWYoIXBoeEV2ZW50KXtcbiAgICAgICAgaWYoRE9NLmlzVW5sb2FkYWJsZUZvcm1TdWJtaXQoZSkpeyB0aGlzLnVubG9hZCgpIH1cbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgIGUudGFyZ2V0LmRpc2FibGVkID0gdHJ1ZVxuICAgICAgdGhpcy53aXRoaW5Pd25lcnMoZS50YXJnZXQsIHZpZXcgPT4ge1xuICAgICAgICBKUy5leGVjKGUsIFwic3VibWl0XCIsIHBoeEV2ZW50LCB2aWV3LCBlLnRhcmdldCwgW1wicHVzaFwiLCB7c3VibWl0dGVyOiBlLnN1Ym1pdHRlcn1dKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZm9yKGxldCB0eXBlIG9mIFtcImNoYW5nZVwiLCBcImlucHV0XCJdKXtcbiAgICAgIHRoaXMub24odHlwZSwgZSA9PiB7XG4gICAgICAgIGlmKGUgaW5zdGFuY2VvZiBDdXN0b21FdmVudCAmJiBlLnRhcmdldC5mb3JtID09PSB1bmRlZmluZWQpe1xuICAgICAgICAgIC8vIHRocm93IG9uIGludmFsaWQgSlMuZGlzcGF0Y2ggdGFyZ2V0IGFuZCBub29wIGlmIEN1c3RvbUV2ZW50IHRyaWdnZXJlZCBvdXRzaWRlIEpTLmRpc3BhdGNoXG4gICAgICAgICAgaWYoZS5kZXRhaWwgJiYgZS5kZXRhaWwuZGlzcGF0Y2hlcil7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGRpc3BhdGNoaW5nIGEgY3VzdG9tICR7dHlwZX0gZXZlbnQgaXMgb25seSBzdXBwb3J0ZWQgb24gaW5wdXQgZWxlbWVudHMgaW5zaWRlIGEgZm9ybWApXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGxldCBwaHhDaGFuZ2UgPSB0aGlzLmJpbmRpbmcoXCJjaGFuZ2VcIilcbiAgICAgICAgbGV0IGlucHV0ID0gZS50YXJnZXRcbiAgICAgICAgLy8gZG8gbm90IGZpcmUgcGh4LWNoYW5nZSBpZiB3ZSBhcmUgaW4gdGhlIG1pZGRsZSBvZiBhIGNvbXBvc2l0aW9uIHNlc3Npb25cbiAgICAgICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0tleWJvYXJkRXZlbnQvaXNDb21wb3NpbmdcbiAgICAgICAgLy8gU2FmYXJpIGhhcyBpc3N1ZXMgaWYgdGhlIGlucHV0IGlzIHVwZGF0ZWQgd2hpbGUgY29tcG9zaW5nXG4gICAgICAgIC8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vcGhvZW5peGZyYW1ld29yay9waG9lbml4X2xpdmVfdmlldy9pc3N1ZXMvMzMyMlxuICAgICAgICBpZihlLmlzQ29tcG9zaW5nKXtcbiAgICAgICAgICBjb25zdCBrZXkgPSBgY29tcG9zaXRpb24tbGlzdGVuZXItJHt0eXBlfWBcbiAgICAgICAgICBpZighRE9NLnByaXZhdGUoaW5wdXQsIGtleSkpe1xuICAgICAgICAgICAgRE9NLnB1dFByaXZhdGUoaW5wdXQsIGtleSwgdHJ1ZSlcbiAgICAgICAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJjb21wb3NpdGlvbmVuZFwiLCAoKSA9PiB7XG4gICAgICAgICAgICAgIC8vIHRyaWdnZXIgYSBuZXcgaW5wdXQvY2hhbmdlIGV2ZW50XG4gICAgICAgICAgICAgIGlucHV0LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KHR5cGUsIHtidWJibGVzOiB0cnVlfSkpXG4gICAgICAgICAgICAgIERPTS5kZWxldGVQcml2YXRlKGlucHV0LCBrZXkpXG4gICAgICAgICAgICB9LCB7b25jZTogdHJ1ZX0pXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGxldCBpbnB1dEV2ZW50ID0gaW5wdXQuZ2V0QXR0cmlidXRlKHBoeENoYW5nZSlcbiAgICAgICAgbGV0IGZvcm1FdmVudCA9IGlucHV0LmZvcm0gJiYgaW5wdXQuZm9ybS5nZXRBdHRyaWJ1dGUocGh4Q2hhbmdlKVxuICAgICAgICBsZXQgcGh4RXZlbnQgPSBpbnB1dEV2ZW50IHx8IGZvcm1FdmVudFxuICAgICAgICBpZighcGh4RXZlbnQpeyByZXR1cm4gfVxuICAgICAgICBpZihpbnB1dC50eXBlID09PSBcIm51bWJlclwiICYmIGlucHV0LnZhbGlkaXR5ICYmIGlucHV0LnZhbGlkaXR5LmJhZElucHV0KXsgcmV0dXJuIH1cblxuICAgICAgICBsZXQgZGlzcGF0Y2hlciA9IGlucHV0RXZlbnQgPyBpbnB1dCA6IGlucHV0LmZvcm1cbiAgICAgICAgbGV0IGN1cnJlbnRJdGVyYXRpb25zID0gaXRlcmF0aW9uc1xuICAgICAgICBpdGVyYXRpb25zKytcbiAgICAgICAgbGV0IHthdDogYXQsIHR5cGU6IGxhc3RUeXBlfSA9IERPTS5wcml2YXRlKGlucHV0LCBcInByZXYtaXRlcmF0aW9uXCIpIHx8IHt9XG4gICAgICAgIC8vIEJyb3dzZXJzIHNob3VsZCBhbHdheXMgZmlyZSBhdCBsZWFzdCBvbmUgXCJpbnB1dFwiIGV2ZW50IGJlZm9yZSBldmVyeSBcImNoYW5nZVwiXG4gICAgICAgIC8vIElnbm9yZSBcImNoYW5nZVwiIGV2ZW50cywgdW5sZXNzIHRoZXJlIHdhcyBubyBwcmlvciBcImlucHV0XCIgZXZlbnQuXG4gICAgICAgIC8vIFRoaXMgY291bGQgaGFwcGVuIGlmIHVzZXIgY29kZSB0cmlnZ2VycyBhIFwiY2hhbmdlXCIgZXZlbnQsIG9yIGlmIHRoZSBicm93c2VyIGlzIG5vbi1jb25mb3JtaW5nLlxuICAgICAgICBpZihhdCA9PT0gY3VycmVudEl0ZXJhdGlvbnMgLSAxICYmIHR5cGUgPT09IFwiY2hhbmdlXCIgJiYgbGFzdFR5cGUgPT09IFwiaW5wdXRcIil7IHJldHVybiB9XG5cbiAgICAgICAgRE9NLnB1dFByaXZhdGUoaW5wdXQsIFwicHJldi1pdGVyYXRpb25cIiwge2F0OiBjdXJyZW50SXRlcmF0aW9ucywgdHlwZTogdHlwZX0pXG5cbiAgICAgICAgdGhpcy5kZWJvdW5jZShpbnB1dCwgZSwgdHlwZSwgKCkgPT4ge1xuICAgICAgICAgIHRoaXMud2l0aGluT3duZXJzKGRpc3BhdGNoZXIsIHZpZXcgPT4ge1xuICAgICAgICAgICAgRE9NLnB1dFByaXZhdGUoaW5wdXQsIFBIWF9IQVNfRk9DVVNFRCwgdHJ1ZSlcbiAgICAgICAgICAgIEpTLmV4ZWMoZSwgXCJjaGFuZ2VcIiwgcGh4RXZlbnQsIHZpZXcsIGlucHV0LCBbXCJwdXNoXCIsIHtfdGFyZ2V0OiBlLnRhcmdldC5uYW1lLCBkaXNwYXRjaGVyOiBkaXNwYXRjaGVyfV0pXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfVxuICAgIHRoaXMub24oXCJyZXNldFwiLCAoZSkgPT4ge1xuICAgICAgbGV0IGZvcm0gPSBlLnRhcmdldFxuICAgICAgRE9NLnJlc2V0Rm9ybShmb3JtKVxuICAgICAgbGV0IGlucHV0ID0gQXJyYXkuZnJvbShmb3JtLmVsZW1lbnRzKS5maW5kKGVsID0+IGVsLnR5cGUgPT09IFwicmVzZXRcIilcbiAgICAgIGlmKGlucHV0KXtcbiAgICAgICAgLy8gd2FpdCB1bnRpbCBuZXh0IHRpY2sgdG8gZ2V0IHVwZGF0ZWQgaW5wdXQgdmFsdWVcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgaW5wdXQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJpbnB1dFwiLCB7YnViYmxlczogdHJ1ZSwgY2FuY2VsYWJsZTogZmFsc2V9KSlcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgZGVib3VuY2UoZWwsIGV2ZW50LCBldmVudFR5cGUsIGNhbGxiYWNrKXtcbiAgICBpZihldmVudFR5cGUgPT09IFwiYmx1clwiIHx8IGV2ZW50VHlwZSA9PT0gXCJmb2N1c291dFwiKXsgcmV0dXJuIGNhbGxiYWNrKCkgfVxuXG4gICAgbGV0IHBoeERlYm91bmNlID0gdGhpcy5iaW5kaW5nKFBIWF9ERUJPVU5DRSlcbiAgICBsZXQgcGh4VGhyb3R0bGUgPSB0aGlzLmJpbmRpbmcoUEhYX1RIUk9UVExFKVxuICAgIGxldCBkZWZhdWx0RGVib3VuY2UgPSB0aGlzLmRlZmF1bHRzLmRlYm91bmNlLnRvU3RyaW5nKClcbiAgICBsZXQgZGVmYXVsdFRocm90dGxlID0gdGhpcy5kZWZhdWx0cy50aHJvdHRsZS50b1N0cmluZygpXG5cbiAgICB0aGlzLndpdGhpbk93bmVycyhlbCwgdmlldyA9PiB7XG4gICAgICBsZXQgYXN5bmNGaWx0ZXIgPSAoKSA9PiAhdmlldy5pc0Rlc3Ryb3llZCgpICYmIGRvY3VtZW50LmJvZHkuY29udGFpbnMoZWwpXG4gICAgICBET00uZGVib3VuY2UoZWwsIGV2ZW50LCBwaHhEZWJvdW5jZSwgZGVmYXVsdERlYm91bmNlLCBwaHhUaHJvdHRsZSwgZGVmYXVsdFRocm90dGxlLCBhc3luY0ZpbHRlciwgKCkgPT4ge1xuICAgICAgICBjYWxsYmFjaygpXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBzaWxlbmNlRXZlbnRzKGNhbGxiYWNrKXtcbiAgICB0aGlzLnNpbGVuY2VkID0gdHJ1ZVxuICAgIGNhbGxiYWNrKClcbiAgICB0aGlzLnNpbGVuY2VkID0gZmFsc2VcbiAgfVxuXG4gIG9uKGV2ZW50LCBjYWxsYmFjayl7XG4gICAgdGhpcy5ib3VuZEV2ZW50TmFtZXMuYWRkKGV2ZW50KVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBlID0+IHtcbiAgICAgIGlmKCF0aGlzLnNpbGVuY2VkKXsgY2FsbGJhY2soZSkgfVxuICAgIH0pXG4gIH1cblxuICBqc1F1ZXJ5U2VsZWN0b3JBbGwoc291cmNlRWwsIHF1ZXJ5LCBkZWZhdWx0UXVlcnkpe1xuICAgIGxldCBhbGwgPSB0aGlzLmRvbUNhbGxiYWNrcy5qc1F1ZXJ5U2VsZWN0b3JBbGxcbiAgICByZXR1cm4gYWxsID8gYWxsKHNvdXJjZUVsLCBxdWVyeSwgZGVmYXVsdFF1ZXJ5KSA6IGRlZmF1bHRRdWVyeSgpXG4gIH1cbn1cblxuY2xhc3MgVHJhbnNpdGlvblNldCB7XG4gIGNvbnN0cnVjdG9yKCl7XG4gICAgdGhpcy50cmFuc2l0aW9ucyA9IG5ldyBTZXQoKVxuICAgIHRoaXMucGVuZGluZ09wcyA9IFtdXG4gIH1cblxuICByZXNldCgpe1xuICAgIHRoaXMudHJhbnNpdGlvbnMuZm9yRWFjaCh0aW1lciA9PiB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZXIpXG4gICAgICB0aGlzLnRyYW5zaXRpb25zLmRlbGV0ZSh0aW1lcilcbiAgICB9KVxuICAgIHRoaXMuZmx1c2hQZW5kaW5nT3BzKClcbiAgfVxuXG4gIGFmdGVyKGNhbGxiYWNrKXtcbiAgICBpZih0aGlzLnNpemUoKSA9PT0gMCl7XG4gICAgICBjYWxsYmFjaygpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucHVzaFBlbmRpbmdPcChjYWxsYmFjaylcbiAgICB9XG4gIH1cblxuICBhZGRUcmFuc2l0aW9uKHRpbWUsIG9uU3RhcnQsIG9uRG9uZSl7XG4gICAgb25TdGFydCgpXG4gICAgbGV0IHRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnRyYW5zaXRpb25zLmRlbGV0ZSh0aW1lcilcbiAgICAgIG9uRG9uZSgpXG4gICAgICB0aGlzLmZsdXNoUGVuZGluZ09wcygpXG4gICAgfSwgdGltZSlcbiAgICB0aGlzLnRyYW5zaXRpb25zLmFkZCh0aW1lcilcbiAgfVxuXG4gIHB1c2hQZW5kaW5nT3Aob3ApeyB0aGlzLnBlbmRpbmdPcHMucHVzaChvcCkgfVxuXG4gIHNpemUoKXsgcmV0dXJuIHRoaXMudHJhbnNpdGlvbnMuc2l6ZSB9XG5cbiAgZmx1c2hQZW5kaW5nT3BzKCl7XG4gICAgaWYodGhpcy5zaXplKCkgPiAwKXsgcmV0dXJuIH1cbiAgICBsZXQgb3AgPSB0aGlzLnBlbmRpbmdPcHMuc2hpZnQoKVxuICAgIGlmKG9wKXtcbiAgICAgIG9wKClcbiAgICAgIHRoaXMuZmx1c2hQZW5kaW5nT3BzKClcbiAgICB9XG4gIH1cbn1cbiIsICIvKlxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblBob2VuaXggTGl2ZVZpZXcgSmF2YVNjcmlwdCBDbGllbnRcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblNlZSB0aGUgaGV4ZG9jcyBhdCBgaHR0cHM6Ly9oZXhkb2NzLnBtL3Bob2VuaXhfbGl2ZV92aWV3YCBmb3IgZG9jdW1lbnRhdGlvbi5cblxuKi9cblxuaW1wb3J0IExpdmVTb2NrZXQsIHtpc1VzZWRJbnB1dH0gZnJvbSBcIi4vbGl2ZV9zb2NrZXRcIlxuaW1wb3J0IERPTSBmcm9tIFwiLi9kb21cIlxuaW1wb3J0IFZpZXdIb29rIGZyb20gXCIuL3ZpZXdfaG9va1wiXG5pbXBvcnQgVmlldyBmcm9tIFwiLi92aWV3XCJcblxuLyoqIENyZWF0ZXMgYSBWaWV3SG9vayBpbnN0YW5jZSBmb3IgdGhlIGdpdmVuIGVsZW1lbnQgYW5kIGNhbGxiYWNrcy5cbiAqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCAtIFRoZSBlbGVtZW50IHRvIGFzc29jaWF0ZSB3aXRoIHRoZSBob29rLlxuICogQHBhcmFtIHtPYmplY3R9IFtjYWxsYmFja3NdIC0gVGhlIGxpc3Qgb2YgaG9vayBjYWxsYmFja3MsIHN1Y2ggYXMgbW91bnRlZCxcbiAqICAgdXBkYXRlZCwgZGVzdHJveWVkLCBldGMuXG4gKlxuICogQGV4YW1wbGVcbiAqXG4gKiBjbGFzcyBNeUNvbXBvbmVudCBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAqICAgY29ubmVjdGVkQ2FsbGJhY2soKXtcbiAqICAgICBsZXQgb25MaXZlVmlld01vdW50ZWQgPSAoKSA9PiB0aGlzLmhvb2sucHVzaEV2ZW50KC4uLikpXG4gKiAgICAgdGhpcy5ob29rID0gY3JlYXRlSG9vayh0aGlzLCB7bW91bnRlZDogb25MaXZlVmlld01vdW50ZWR9KVxuICogICB9XG4gKiB9XG4gKlxuICogKk5vdGUqOiBgY3JlYXRlSG9va2AgbXVzdCBiZSBjYWxsZWQgZnJvbSB0aGUgYGNvbm5lY3RlZENhbGxiYWNrYCBsaWZlY3ljbGVcbiAqIHdoaWNoIGlzIHRyaWdnZXJlZCBhZnRlciB0aGUgZWxlbWVudCBoYXMgYmVlbiBhZGRlZCB0byB0aGUgRE9NLiBJZiB5b3UgdHJ5XG4gKiB0byBjYWxsIGBjcmVhdGVIb29rYCBmcm9tIHRoZSBjb25zdHJ1Y3RvciwgYW4gZXJyb3Igd2lsbCBiZSBsb2dnZWQuXG4gKlxuICogQHJldHVybnMge1ZpZXdIb29rfSBSZXR1cm5zIHRoZSBWaWV3SG9vayBpbnN0YW5jZSBmb3IgdGhlIGN1c3RvbSBlbGVtZW50LlxuICovXG5sZXQgY3JlYXRlSG9vayA9IChlbCwgY2FsbGJhY2tzID0ge30pID0+IHtcbiAgbGV0IGV4aXN0aW5nSG9vayA9IERPTS5nZXRDdXN0b21FbEhvb2soZWwpXG4gIGlmKGV4aXN0aW5nSG9vayl7IHJldHVybiBleGlzdGluZ0hvb2sgfVxuXG4gIGxldCBob29rID0gbmV3IFZpZXdIb29rKFZpZXcuY2xvc2VzdFZpZXcoZWwpLCBlbCwgY2FsbGJhY2tzKVxuICBET00ucHV0Q3VzdG9tRWxIb29rKGVsLCBob29rKVxuICByZXR1cm4gaG9va1xufVxuXG5leHBvcnQge1xuICBMaXZlU29ja2V0LFxuICBpc1VzZWRJbnB1dCxcbiAgY3JlYXRlSG9va1xufVxuIiwgIi8vIElmIHlvdSB3YW50IHRvIHVzZSBQaG9lbml4IGNoYW5uZWxzLCBydW4gYG1peCBoZWxwIHBoeC5nZW4uY2hhbm5lbGBcbi8vIHRvIGdldCBzdGFydGVkIGFuZCB0aGVuIHVuY29tbWVudCB0aGUgbGluZSBiZWxvdy5cbi8vIGltcG9ydCBcIi4vdXNlcl9zb2NrZXQuanNcIlxuXG4vLyBZb3UgY2FuIGluY2x1ZGUgZGVwZW5kZW5jaWVzIGluIHR3byB3YXlzLlxuLy9cbi8vIFRoZSBzaW1wbGVzdCBvcHRpb24gaXMgdG8gcHV0IHRoZW0gaW4gYXNzZXRzL3ZlbmRvciBhbmRcbi8vIGltcG9ydCB0aGVtIHVzaW5nIHJlbGF0aXZlIHBhdGhzOlxuLy9cbi8vICAgICBpbXBvcnQgXCIuLi92ZW5kb3Ivc29tZS1wYWNrYWdlLmpzXCJcbi8vXG4vLyBBbHRlcm5hdGl2ZWx5LCB5b3UgY2FuIGBucG0gaW5zdGFsbCBzb21lLXBhY2thZ2UgLS1wcmVmaXggYXNzZXRzYCBhbmQgaW1wb3J0XG4vLyB0aGVtIHVzaW5nIGEgcGF0aCBzdGFydGluZyB3aXRoIHRoZSBwYWNrYWdlIG5hbWU6XG4vL1xuLy8gICAgIGltcG9ydCBcInNvbWUtcGFja2FnZVwiXG4vL1xuXG4vLyBJbmNsdWRlIHBob2VuaXhfaHRtbCB0byBoYW5kbGUgbWV0aG9kPVBVVC9ERUxFVEUgaW4gZm9ybXMgYW5kIGJ1dHRvbnMuXG5pbXBvcnQgXCJwaG9lbml4X2h0bWxcIlxuLy8gRXN0YWJsaXNoIFBob2VuaXggU29ja2V0IGFuZCBMaXZlVmlldyBjb25maWd1cmF0aW9uLlxuaW1wb3J0IHtTb2NrZXR9IGZyb20gXCJwaG9lbml4XCJcbmltcG9ydCB7TGl2ZVNvY2tldH0gZnJvbSBcInBob2VuaXhfbGl2ZV92aWV3XCJcbmltcG9ydCB0b3BiYXIgZnJvbSBcIi4uL3ZlbmRvci90b3BiYXJcIlxuXG5sZXQgY3NyZlRva2VuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIm1ldGFbbmFtZT0nY3NyZi10b2tlbiddXCIpLmdldEF0dHJpYnV0ZShcImNvbnRlbnRcIilcbmxldCBsaXZlU29ja2V0ID0gbmV3IExpdmVTb2NrZXQoXCIvbGl2ZVwiLCBTb2NrZXQsIHtcbiAgbG9uZ1BvbGxGYWxsYmFja01zOiAyNTAwLFxuICBwYXJhbXM6IHtfY3NyZl90b2tlbjogY3NyZlRva2VufVxufSlcblxuLy8gU2hvdyBwcm9ncmVzcyBiYXIgb24gbGl2ZSBuYXZpZ2F0aW9uIGFuZCBmb3JtIHN1Ym1pdHNcbnRvcGJhci5jb25maWcoe2JhckNvbG9yczogezA6IFwiIzI5ZFwifSwgc2hhZG93Q29sb3I6IFwicmdiYSgwLCAwLCAwLCAuMylcIn0pXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInBoeDpwYWdlLWxvYWRpbmctc3RhcnRcIiwgX2luZm8gPT4gdG9wYmFyLnNob3coMzAwKSlcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicGh4OnBhZ2UtbG9hZGluZy1zdG9wXCIsIF9pbmZvID0+IHRvcGJhci5oaWRlKCkpXG5cbi8vIGNvbm5lY3QgaWYgdGhlcmUgYXJlIGFueSBMaXZlVmlld3Mgb24gdGhlIHBhZ2VcbmxpdmVTb2NrZXQuY29ubmVjdCgpXG5cbi8vIGV4cG9zZSBsaXZlU29ja2V0IG9uIHdpbmRvdyBmb3Igd2ViIGNvbnNvbGUgZGVidWcgbG9ncyBhbmQgbGF0ZW5jeSBzaW11bGF0aW9uOlxuLy8gPj4gbGl2ZVNvY2tldC5lbmFibGVEZWJ1ZygpXG4vLyA+PiBsaXZlU29ja2V0LmVuYWJsZUxhdGVuY3lTaW0oMTAwMCkgIC8vIGVuYWJsZWQgZm9yIGR1cmF0aW9uIG9mIGJyb3dzZXIgc2Vzc2lvblxuLy8gPj4gbGl2ZVNvY2tldC5kaXNhYmxlTGF0ZW5jeVNpbSgpXG53aW5kb3cubGl2ZVNvY2tldCA9IGxpdmVTb2NrZXRcblxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQU1BLE9BQUMsU0FBVUEsU0FBUUMsV0FBVTtBQUMzQjtBQUdBLFNBQUMsV0FBWTtBQUNYLGNBQUksV0FBVztBQUNmLGNBQUksVUFBVSxDQUFDLE1BQU0sT0FBTyxVQUFVLEdBQUc7QUFDekMsbUJBQVMsSUFBSSxHQUFHLElBQUksUUFBUSxVQUFVLENBQUNELFFBQU8sdUJBQXVCLEVBQUUsR0FBRztBQUN4RSxZQUFBQSxRQUFPLHdCQUNMQSxRQUFPLFFBQVEsQ0FBQyxJQUFJLHVCQUF1QjtBQUM3QyxZQUFBQSxRQUFPLHVCQUNMQSxRQUFPLFFBQVEsQ0FBQyxJQUFJLHNCQUFzQixLQUMxQ0EsUUFBTyxRQUFRLENB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QjtBQUFBLElBQ3BCLFFBQVEsRUFBQyxhQUFhLFVBQVM7QUFBQSxFQUNqQyxDQUFDO0FBR0QsZ0JBQUFDLFFBQU8sT0FBTyxFQUFDLFdBQVcsRUFBQyxHQUFHLE9BQU0sR0FBRyxhQUFhLG9CQUFtQixDQUFDO0FBQ3hFLFNBQU8saUJBQWlCLDBCQUEwQixXQUFTLGNBQUFBLFFBQU8sS0FBSyxHQUFHLENBQUM7QUFDM0UsU0FBTyxpQkFBaUIseUJBQXlCLFdBQVMsY0FBQUEsUUFBTyxLQUFLLENBQUM7QUFHdkUsYUFBVyxRQUFRO0FBTW5CLFNBQU8sYUFBYTsiLAogICJuYW1lcyI6IFsid2luZG93IiwgImRvY3VtZW50IiwgInRvcGJhciIsICJDdXN0b21FdmVudCIsICJjbG9zdXJlIiwgImxpdmVTb2NrZXQiLCAiY2xvc3VyZSIsICJlIiwgImlzRW1wdHkiLCAiZmlsZSIsICJtb3JwaEF0dHJzIiwgIm1vcnBoZG9tIiwgImNoaWxkcmVuT25seSIsICJ0YXJnZXRDb250YWluZXIiLCAiY2xvbmUiLCAiZWwiLCAiaW5wdXRzVW51c2VkIiwgIm9ubHlIaWRkZW5JbnB1dHMiLCAibG9jayIsICJsb2FkaW5nIiwgImVudHJ5IiwgImlucHV0IiwgImNsb3N1cmUiLCAidG9wYmFyIl0KfQo=
