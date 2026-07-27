//jQuery.noConflict();
(function ($) {
    $(document).ready(function () {
        const headerLocation = $("#scHeaderPlaceholder").attr("data-path");
        $.ajax({
            url: headerLocation,
            method: "GET"
        })
            .done(function (headerData) {
                $("#scHeaderPlaceholder").replaceWith(headerData);
            });
        const footerLocation = $("#scFooterPlaceholder").attr("data-path");
        $.ajax({
            url: footerLocation,
            method: "GET"
        })
            .done(function (footerData) {
                $("#scFooterPlaceholder").replaceWith(footerData);
            });
    });
})(jQuery);