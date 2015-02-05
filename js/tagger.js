(function($, window, document, undefined) {
    // TODO: show/hide autocomplete, remote interface for get tags
    // Events, add, remove, maxTags, hasAutocomplete

    var normalize = function (str) {
        var w,
            map = {
                a: /[\xE0-\xE6]/g,
                e: /[\xE8-\xEB]/g,
                i: /[\xEC-\xEF]/g,
                o: /[\xF2-\xF6]/g,
                u: /[\xF9-\xFC]/g,
                c: /\xE7/g,
                n: /\xF1/g
            };

        for (w in map) {
            str = str.replace(map[w], w);
        }

        return str.toLowerCase();
    };

    function Tagger(el, settings) {
        var _this = this,
            _tags = [],
            $el, $autocomplete, $placeholder, $liInput, $input,
            placeholder, autocomplete, _id, _type, _tagTpl, _itemTpl;

        $el         = $(el);

        _id         = $el.attr('id');
        _type       = $(el).attr('type') || 'text';

        _tagTpl     = '<li class="tagger-tag">'+settings.tagTpl+'</li>';
        _itemTpl    = '<li class="tagger-list-item">'+settings.itemTpl+'</li>';

        $autocomplete   = $('<ul id="tagger-list-'+_id+'" class="tagger-list"></ul>');
        $placeholder    = $('<ul id="tagger-'+_id+'" class="tagger"><li class="tagger-tag-input"><input type="text" class="tagger-tag-input-suggestion" autocomplete="off" spellcheck="false" readonly /><input type="text" class="tagger-tag-input-value" placeholder="'+$el.attr('placeholder')+'" autocomplete="off" spellcheck="false" /></li></ul>');

        $liInput    = $placeholder.find('.tagger-tag-input');
        $suggestion = $liInput.find('.tagger-tag-input-suggestion');
        $input      = $liInput.find('.tagger-tag-input-value');

        $el.attr('type', 'hidden');

        // Deixar no body e posicionar na tela
        $('body').append($autocomplete);

        $input
            .on('keyup', function(e) {
                var val = $input.val().trim();
                if (val && val.length >= settings.minDigits) {
                    _list(val);
                } else {
                    _hideAutoComplete();
                }
            })
            .on('keydown', function(e) {
                var val = (settings.onlyInList ? $suggestion.val() : $input.val()).trim();

                if((e.which === 9 || e.which === 13 || e.which === 188) && val) {
                    if (_this.add(val)) {
                        $input.val('');
                        _hideAutoComplete();
                    }

                    e.preventDefault();
                }
            });

        $(document).on('click', function(e){
            if (!$(e.target).closest($autocomplete).length) {
                _hideAutoComplete();
            }
        });

        $el.after($placeholder);

        var _list = function(val) {
            var filter = function(list){
                var tags = list.filter(function(v){ return _tags.indexOf(v) === -1 && normalize(v).indexOf(normalize(val)) !== -1; }).sort();

                _showAutoComplete(tags);
            };

            $.isFunction(settings.tags) ? settings.tags(filter) : filter(settings.tags);
        };

        var _showAutoComplete = function(tags){
            var $item,
                tag, offset, i, l;

            $autocomplete.empty();

            if (tags.length) {
                for (i = 0, l = tags.length; i < l; i++) {
                    tag = tags[i];

                    $item = $(_itemTpl.replace('{{ title }}', tag))
                        .attr('tagger-val', tag)
                        .on('mouseenter', function(e) {
                            _updateSuggestion($(this).attr('tagger-val'));
                        })
                        .on('click', function(e) {
                            if (_this.add($(this).attr('tagger-val'))) {
                                $input.val('');
                                _hideAutoComplete();
                            }
                        });

                    $autocomplete.append($item);
                }

                offset = $input.offset();

                $autocomplete.css({left: offset.left, top: offset.top + $input.height()})
                _updateSuggestion(tags[0]);
                $autocomplete.show();
            } else {
                _hideAutoComplete();
            }
        };

        var _hideAutoComplete = function(){
            $suggestion.val('');
            $autocomplete.hide();
        };

        var _updateSuggestion = function(suggestion) {
            var val = $input.val();
            $suggestion.val(val+suggestion.substr(val.length));
        };

        var _updateVal = function() {
            $el.val(_tags.join(', '));
        };

        this.add = function(val) {
            var $tag;

            if (val && (settings.maxTags === false || settings.maxTags >= _tags.length) && _tags.indexOf(val) === -1) {
                _tags.push(val);

                $tag = $(_tagTpl.replace('{{ title }}', val))
                    .attr('tagger-val', val)
                    .on('click', '.tagger-tag-remove', function(e){
                        _this.remove($(this).parents('[tagger-val]').attr('tagger-val'));
                    });

                $liInput.before($tag);
                _updateVal();

                return true;
            } else {
                return false;
            }
        };

        this.remove = function(val) {
            var index;

            if ((index = _tags.indexOf(val)) !== -1) {
                $placeholder.find('[tagger-val="'+val+'"]').remove();
                _tags.splice(index, 1);
                _updateVal();
            }
        };

        this.destroy = function() {
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
                itemTpl:    '{{ title }}'
            };

            var settings = $.extend(defaults, params);

            return $(this).each(function(){
                if ($(this).data('tagger') === undefined) {
                    $(this).data('tagger', new Tagger(this, settings));
                } else {
                    $(this).data('tagger').destroy();
                    $(this).data('tagger', new Tagger(this, settings));
                }
            });
        } else {
            var param = arguments[1];

            return $(this).each(function(){
                if ($(this).data('tagger') !== undefined) {
                    $(this).data('tagger')[params](param);
                }
            });
        }
    };
})(jQuery, window, document);
