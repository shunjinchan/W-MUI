/*
* @Author: shunjinchan
* @Date:   2015-10-15 13:34:31
* @Last Modified by:   shunjinchan
* @Last Modified time: 2016-01-06 19:34:46
*/

require('../../css/components/toast.css');

var defaults = {
    box: '<div class="toast"></div>'
};

var instance;

/**
 * Toast
 */
function Toast() {
    if (instance instanceof Toast) {
        return instance;
    }

    this.createTime = new Date();

    //缓存实例
    instance = this;

    return this;
}

Toast.prototype = {
    constructor: Toast,

    /**
     * open toast
     * @param  {String 或者 Object} params，为 string 时默认是 title，为 Object 是配置
     * @return {[type]}         [description]
     */
    open: function (params) {
        if (this.isOpen) return;

        this._render(params);
        this._setSize();
        this._bindEvents();

        this.$box.show().removeClass('transition-out').addClass('transition-in');

        this.isOpen = true;
    },

    _render: function (params) {
        this.$box = $(defaults.box).appendTo('body');

        var self = this;
        var title;
        var extraClass;
        var timer;

        if (params && typeof params === 'string') {
            title = params;
        }

        if (params && Array.prototype.toString.call(params) === '[object Object]') {
            title = params.title ? params.title : '';
            extraClass = params.extraClass ? params.extraClass : '';
            timer = params.timer ? params.timer : '';
        }

        this.$box.html(title);
        extraClass && this.$box.addClass(extraClass);

        if (timer && typeof timer === 'number') {
            this.timeID = window.setTimeout(function () {
                self.close();
            }, timer);
        }

        this.$backdrop = $('<div id="backdrop" class="backdrop"></div>');
        $('body').append(this.$backdrop);
        this.$backdrop && this.$backdrop.addClass('visible').css('opacity', '0');
    },

    _setSize: function (e) {
        this.$box.css('marginTop', -Math.round(this.$box.outerHeight() / 2 / 1.185) + 'px');
        this.$box.css('marginLeft', -Math.round(this.$box.outerWidth() / 2 / 1.185) + 'px');
    },

    _bindEvents: function () {
        this.$backdrop.on('touchmove', function (e) {
            e.preventDefault();
            e.stopPropagation();
        });
    },

    /**
     * close toast
     * @param  {function} 关闭之后的回调函数
     * @return {[type]}         [description]
     */
    close: function (callback) {
        var self = this;

        if (this.$box.length === 0) {
            return;
        }

        this.$backdrop && this.$backdrop.removeClass('visible');
        this.$box.removeClass('transition-in').addClass('transition-out')
            .transitionEnd(function (e) {
                self.$box.off();
                self.$box.remove();
                self.$box = null;

                self.$backdrop.off();
                self.$backdrop.remove();

                self.isOpen = false;

                window.clearTimeout(self.timeID);

                callback && typeof callback === 'function' && callback();
            });
    }
};

module.exports = Toast;
