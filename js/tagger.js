(function($){
    /**
     * Tagger
     * @param  Object params Config params
     * @return jQuery
     */
    $.fn.tagger = function(params) {
        // add
        // remove
        // destroy

        var re = /tagger/;

        var defaults = {
            tags:       [],
            minDigits:  3,
            maxTags:    false
        };

        var settings = $.extend(defaults, params);

        return $(this).each(function(){
            var $this, $ul, $li, $input, $parent, tagTpl, count = 0;

            tagTpl      = '<li class="tagger-item-label"><span class="tagger-item-label-text">{{ title }}</span><button class="tagger-item-label-close">X</button></li>';

            $this       = $(this);
            $ul         = $('<ul class="tagger"><li class="tagger-item-input"></li></ul>');
            $li         = $ul.find('.tagger-item-input');

            $parent     = $this.parent();
            $input      = $this.detach();

            $li.append($input);

            $input.on('keypress', function(e) {
                if(e.which === 13) {
                    $li.before($(tagTpl.replace('{{ title }}', 'Test '+(count++))));
                }
            });

            $parent.append($ul);
        });
    };
})(jQuery);
