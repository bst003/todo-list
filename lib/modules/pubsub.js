"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pubsub = void 0;
var pubsub = {
  events: {},
  subscribe: function subscribe(eventName, fn) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(fn);
  },
  unsubscribe: function unsubscribe(eventName, fn) {
    if (this.events[eventName]) {
      for (var i = 0; i < this.events[eventName].length; i++) {
        if (this.events[eventName][i] === fn) {
          this.events[eventName].splice(i, 1);
          break;
        }
      }

      ;
    }
  },
  publish: function publish(eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(function (fn) {
        fn(data);
      });
    }
  }
};
exports.pubsub = pubsub;