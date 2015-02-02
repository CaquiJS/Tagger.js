;(function($){

    $.fn.tagger = function() {

        var re = /tagger/;
        
        return $(this).each(function(){

            var $this = $(this),
                $ul, 
                $input,
                $parent,
                settings,
                options;

            for(key in $this.data()) {
                if(re.test(key)) {
                    options = $this.data();
                }
            }

            settings = $.extend(settings, options);
            
            $ul     = $('<ul class="tagger"></ul>');
            $li     = $('<li class="tagger-item"></li>');
            $tag    = $('<label class="tagger-label-container"><span class="tagger-label-text"></span><span class="tagger-label-close"></span></label>');
            
            $parent = $this.parent();            
            $input  = $this.detach();

            $input.on('keypress', function(e) {
                if(e.which === 13) {
                    $tag.find('.tagger-label-text').val($(this).val());
                }
            });

            $input.appendTo($li.addClass('tagger-text-field'));
            $ul.append($li);
            $ul.insertAfter($parent);

        });

    };

}(jQuery));