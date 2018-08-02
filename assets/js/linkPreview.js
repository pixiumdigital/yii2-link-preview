/**
 * Link preview widget
 */
(function ($) {
    $.fn.linkPreview = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.linkPreview');
            return false;
        }
    };

    var defaults = {
        //Url for preview action
        previewActionUrl: 'preview',
        //Url regex
        urlRegex: /(https?\:\/\/|\s)[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})(\/+[a-z0-9_.\:\;-]*)*(\?[\&\%\|\+a-z0-9_=,\.\:\;-]*)?([\&\%\|\+&a-z0-9_=,\:\;\.-]*)([\!\#\/\&\%\|\+a-z0-9_=,\:\;\.-]*)}*/i,
        //Close button id
        closeBtnClass: '.close-preview-btn',
        //Pjax default settings
        pjaxDefaults: {
            push: false,
            timeout: 20000,
            replace: false,
            history: false
        },
        //Pjax container
        pjaxContainer: '#link-preview-pjax-container',
        //For preventing duplicate requests
        countSendRequest: 0,
        //If `true`, Render only one preview
        renderOnlyOnce: false,
        //Flag for preview open popup
        isPreviewOpen: false,
        //deadman switch in seconds
        lasthit: 0,
    };

    var methods = {
        init: function (options) {
            return this.each(function () {
                var $linkPreview = $(this);
                var settings = $.extend({}, defaults, options || {});
                $linkPreview.data('linkPreview', {
                    options: settings
                });
                // Register events
                registerEvents($linkPreview);
            });
        },
        data: function () {
            return this.data('linkPreview');
        },
        crawl: function() {
             crawlText($(this), false);
        }

    };

    /**
     * Register plugin events
     * @param $linkPreview the link preview container jQuery object
     */
    var registerEvents = function ($linkPreview) {
        var data = $linkPreview.data('linkPreview');
        var options = data.options;
        // Create events for $linkPreview
        $linkPreview.on('keyup', function (e) {
            var d = new Date(); 
            var ms = d.getTime();
            // set current hit time
            data.options.lasthit = (new Date()).getTime();
            setTimeout(function() {
                var t = (new Date()).getTime();
                if (t - data.options.lasthit > 900) {
                    crawlText($linkPreview);
                } 
            }, 1000);
        });
        //Event on close button click
        $(options.pjaxContainer).on('click', options.closeBtnClass, function () {
            //Clear pjax container and set isPreviewOpen to false
            $(options.pjaxContainer).html("");
            options.isPreviewOpen = false;
        });
    };

    /**
     * Crawl text for textArea or input
     * @param $linkPreview the link preview container jQuery object
     * @param refreshCounter refresh counter
     */
    var crawlText = function ($linkPreview) {
        var data = $linkPreview.data('linkPreview');
        var options = data.options;
        var content = $linkPreview.val();
        var hasLink = options.urlRegex.test(content);
        console.log("joy");
        if (!hasLink) { 
            if (options.isPreviewOpen) {
                $(options.pjaxContainer).html("");
                options.isPreviewOpen = false;  
            }  
            return; 
        }

        var params = {content: content};
        $.pjax.reload($.extend(options.pjaxDefaults, {
            type: 'POST',
            container: options.pjaxContainer,
            url: options.previewActionUrl,
            data: params
        }));
        options.countSendRequest++;
        options.isPreviewOpen = true;
        return false;
    };

})(jQuery);
