//jQuery.noConflict();
(function ($) {
    $(document).ready(function () {
        if (typeof newrelic == 'object') {
            var clientID = $('#csNewRelicScript').attr('clientid');
            window.newrelic.setCustomAttribute('client-id', clientID);
            var pageType = $('#csNewRelicPageTypeDiv').attr('pagetype');
            window.newrelic.setCustomAttribute('page-type', pageType);
            var programName = $('#csNewRelicPageTypeDiv').attr('programname')
            window.newrelic.setCustomAttribute('program-name', programName)
            var pageTitle = $('title').text()
            window.newrelic.setCustomAttribute('page-title', pageTitle)
        }
    });
})(jQuery);