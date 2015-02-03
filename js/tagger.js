(function($){

    function Tagger(el, settings) {
        var $el, $ul, $li, $input, $parent, tagTpl;

        tagTpl      = '<li class="tagger-item-label">'+settings.tagTpl+'</li>';

        $el         = $(el);

        $ul         = $('<ul id="tagger-'+$el.attr('id')+'" class="tagger"><li class="tagger-item-input"></li></ul>');
        $li         = $ul.find('.tagger-item-input');

        $parent     = $el.parent();
        $input      = $el.detach();

        $li.append($input);

        $input.on('keypress', function(e) {
            if(e.which === 13) {
                $li.before($(tagTpl.replace('{{ title }}', 'Test')));
            }
        });

        $parent.append($ul);

        var _list = function() {

        };

        this.add = function() {

        };

        this.remove = function() {

        };

        this.destroy = function() {

        };
    }

    /**
     * Tagger
     * @param  Object params Config params
     * @return jQuery
     */
    $.fn.tagger = function(params) {
        params = params || {};

        // add
        // remove
        // destroy
        // _list

        if (typeof params === 'object') {
            var defaults = {
                tags:       [], // or function
                minDigits:  3,
                maxTags:    false,
                tagTpl      = '<span class="tagger-item-label-text">{{ title }}</span><button class="tagger-item-label-close">X</button>';
            };

            var settings = $.extend(defaults, params);

            return $(this).each(function(){

            });
        } else {
            return $(this).each(function(){

            });
        }
    };
})(jQuery);
