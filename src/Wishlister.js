const $ = require('jquery');
const Bisquits = require('bisquits');

class Wishlister {
  constructor(opts) {
    this.opts = opts;
    this.cookieHandler = new Bisquits('posts', 'post');
  }

  initiate() {
    this.count = parseInt(this.opts.$counter.text());

    this.opts.$action.on('click', (e) => {
      this.addOrRemove($(e.target));
      return false;
    });

    this.opts.$flusher.on('click', () => {
      this.flush();
      return false;
    });
  }

  addOrRemove($elem) {
    const postId = $elem.attr('data-post-id');
    let add = false;

    if (this.cookieHandler.hasValue(postId) === false) {
      this.add($elem, postId);
      add = true;
    } else {
      this.remove($elem, postId);
    }

    this.opts.$counter.html(this.count);
    return add;
  }

  add($elem, postId) {
    this.cookieHandler.add(postId);
    $elem.html($elem.attr('data-remove-label'));
    return this.count++;
  }

  remove($elem, postId) {
    this.cookieHandler.remove(postId);
    $elem.html($elem.attr('data-add-label'));

    if (window.location.pathname.indexOf(this.opts.wishlistPath) > -1) {
      $elem.parent('li').remove();
    }

    return this.count--;
  }

  flush() {
    if(this.cookieHandler.removeAll()) {
      let _this = this;

      this.opts.$action.each(function() {
        let $elem = $(this);
        let postId = $elem.attr('data-post-id');
        _this.remove($elem, postId);
      });

      return true;
    }

    return false;
  }

  off() {
    this.opts.$action.off();
    this.opts.$flusher.off();
    return true;
  }
}

module.exports = Wishlister;
