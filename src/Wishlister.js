const $ = require('jquery');
const Bisquits = require('bisquits');

class Wishlister {
  constructor(opts) {
    if (!opts.hasOwnProperty('list')) throw new Error('List is needed.');
    if (!opts.hasOwnProperty('item')) throw new Error('Item is needed.');
    if (!opts.hasOwnProperty('action')) throw new Error('Action is needed.');
    this.$list = $(opts.list);
    this.$item = $(opts.item);
    this.$action = $(opts.action);
    this.$flusher = $(opts.flusher) || null;
    this.$counter = $(opts.counter) || null;
    this.cookieHandler = new Bisquits('wishlist', 'item');
  }

  initiate() {
    this.count = parseInt(this.$counter.text());

    this.$action.on('click', (e) => {
      this.addOrRemove($(e.target));
      return false;
    });

    if (this.$flusher) {
      this.$flusher.on('click', () => {
        this.flush();
        return false;
      });
    }
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

    this.$counter.html(this.count);
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
    this.$list.find(this.$item).remove();
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
    this.$action.off();
    if (this.$flusher) this.$flusher.off();
    return true;
  }
}

module.exports = Wishlister;
