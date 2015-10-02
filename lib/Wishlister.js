'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var $ = require('jquery');
var Bisquits = require('bisquits');

var Wishlister = (function () {
  function Wishlister(opts) {
    _classCallCheck(this, Wishlister);

    this.opts = opts;
    this.cookieHandler = new Bisquits('posts', 'post');
  }

  _createClass(Wishlister, [{
    key: 'initiate',
    value: function initiate() {
      var _this2 = this;

      this.count = parseInt(this.opts.$counter.text());

      this.opts.$action.on('click', function (e) {
        _this2.addOrRemove($(e.target));
        return false;
      });

      this.opts.$flusher.on('click', function () {
        _this2.flush();
        return false;
      });
    }
  }, {
    key: 'addOrRemove',
    value: function addOrRemove($elem) {
      var postId = $elem.attr('data-post-id');
      var add = false;

      if (this.cookieHandler.hasValue(postId) === false) {
        this.add($elem, postId);
        add = true;
      } else {
        this.remove($elem, postId);
      }

      this.opts.$counter.html(this.count);
      return add;
    }
  }, {
    key: 'add',
    value: function add($elem, postId) {
      this.cookieHandler.add(postId);
      $elem.html($elem.attr('data-remove-label'));
      return this.count++;
    }
  }, {
    key: 'remove',
    value: function remove($elem, postId) {
      this.cookieHandler.remove(postId);
      $elem.html($elem.attr('data-add-label'));

      if (window.location.pathname.indexOf(this.opts.wishlistPath) > -1) {
        $elem.parent('li').remove();
      }

      return this.count--;
    }
  }, {
    key: 'flush',
    value: function flush() {
      var _this3 = this;

      if (this.cookieHandler.removeAll()) {
        var _ret = (function () {
          var _this = _this3;

          _this3.opts.$action.each(function () {
            var $elem = $(this);
            var postId = $elem.attr('data-post-id');
            _this.remove($elem, postId);
          });

          return {
            v: true
          };
        })();

        if (typeof _ret === 'object') return _ret.v;
      }

      return false;
    }
  }, {
    key: 'off',
    value: function off() {
      this.opts.$action.off();
      this.opts.$flusher.off();
      return true;
    }
  }]);

  return Wishlister;
})();

module.exports = Wishlister;