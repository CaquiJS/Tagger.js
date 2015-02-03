(function($, window, document, undefined){

    function Tagger(el, settings) {
        var _this = this,
            _tags = [],
            $el, $ul, $li, $input, $parent,
            tagTpl, placeholder, autocomplete, _id, _type;

        $el         = $(el);

        _id         = $el.attr('id');
        _type       = $(el).attr('type') || 'text';

        tagTpl      = '<li class="tagger-item-label">'+settings.tagTpl+'</li>';
        itemTpl     = '<li class="tagger-item-label">'+settings.itemTpl+'</li>';

        $el.attr('type', 'hidden');

        placeholder = {
            $ul: $('<ul id="tagger-'+_id+'" class="tagger"><li class="tagger-item-input"><input type="text" placeholder="'+$el.attr('placeholder')+'"></li></ul>')
        };

        placeholder.$liInput = placeholder.$ul.find('.tagger-item-input');
        placeholder.$input = placeholder.$ul.find('.tagger-item-input :text');


        autocomplete = {
            $ul: $('<ul id="tagger-list-'+_id+'" class="tagger-list"></ul>'),
            $li: $('<li class="tagger-list-item">{{ title }}</li>')
        };

        placeholder.$input.on('keypress', function(e) {
            var val = placeholder.$input.val().trim();

            if((e.which === 13 || e.which === 44) && val) {
                _this.add(val);
                placeholder.$input.val('');

                e.preventDefault();
            }
        });

        $el.after(placeholder.$ul);

        var _list = function() {
            //autocomplete
        };

        var _updateVal = function() {
            $el.val(_tags.join(', '));
        };

        this.add = function(val) {
            var $tag;

            if (val && _tags.indexOf(val) === -1) {
                _tags.push(val);

                $tag = $(tagTpl.replace('{{ title }}', val))
                    .attr('tagger-val', val)
                    .on('click', '.tagger-item-label-close', function(e){
                        _this.remove($(this).parents('[tagger-val]').attr('tagger-val'));
                    });

                placeholder.$liInput.before($tag);
                _updateVal();
            }
        };

        this.remove = function(val) {
            var index;

            if ((index = _tags.indexOf(val)) !== -1) {
                placeholder.$ul.find('[tagger-val="'+val+'"]').remove();
                _tags.splice(index, 1);
                _updateVal();
            }
        };

        this.destroy = function() {
            console.log(_type);
            $el.attr('type', _type);
            $('#tagger-'+_id).remove();
        };
    }

    /**
     * Tagger
     * @param  Object params Config params
     * @return jQuery
     */
    $.fn.tagger = function(params) {
        params = params || {};

        if (typeof params === 'object') {
            var defaults = {
                tags:       [], // or function
                minDigits:  3,
                maxTags:    false,
                onlyInList: false,
                tagTpl:     '<span class="tagger-item-label-text">{{ title }}</span><button class="tagger-item-label-close">X</button>',
                itemTpl:     '{{ title }}'
            };

            var settings = $.extend(defaults, params);

            return $(this).each(function(){
                if ($(this).data('tagger') === undefined) {
                    $(this).data('tagger', new Tagger(this, settings));
                }
            });
        } else {
            var instance;
            var param = arguments[1];

            return $(this).each(function(){
                if ($(this).data('tagger') !== undefined) {
                    instance = $(this).data('tagger');
                    instance[params](param);
                }
            });
        }
    };
})(jQuery, window, document);
