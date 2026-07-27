//jQuery.noConflict();
var tocData;
(function ($) {
    $(document).ready(function () {
        let startTime = Date.now();
        $('#navLocal').addClass('collapsible');
		$('#navLocal').attr("aria-label", "catalog navigation");
        $('.navLocal li').each(function () {
            Activate($(this));
        });

        var jsonUrl
        $.ajax({
            type: 'HEAD',
            url: window.location,
            complete: function (xhr) {
                if (xhr.getResponseHeader('Server') === "AmazonS3") {
                    jsonUrl = $("#navJsonPathCDN").text();
                } else {
                    jsonUrl = $("#navJsonPath").text();
                }
                $.getJSON(jsonUrl, function (json) {
                    tocData = json;
                });
            }
        });
        let endTime = Date.now();
        console.log("treeListCDN.js document ready to completion: " + (endTime - startTime).toString() + " ms.");
    });

    function Activate(li) {
        if (!$(li).children('span').hasClass('set')) {
            
            if ($(li).hasClass('hasChildren')) {
                
                const link = $(li).first('a');
                let linkText = link ? link.text() : '';

                $(li).prepend(`<button type="button" class="expandable blorp" aria-label="Show More of ${linkText}"></button>`);
                $(li).children('button').bind('mousedown', function (e) {
                    e.preventDefault();
                });
                $(li).children('button').bind('click', function () {
                    if ($(this).hasClass('collapsible')) {
                        $(this).attr('aria-label', `Show More of ${linkText}`);
                        $(this).parent().children().children().hide();
                        $(this).removeClass('collapsible');
                    }
                    else if ($(this).hasClass('expandable')) {
                        $(this).attr('aria-label', `Show Less of ${linkText}`);
                        if (!$(this).hasClass('set')) {
                            hrefVal = $(this).siblings('a').attr("href");
                            GetChildrenCDN(hrefVal, $(this).parent());
                            $(this).addClass('collapsible').addClass('set');
                        } else {
                            $(this).parent().children().children().show();
                            $(this).addClass('collapsible');
                        }
                    }
                    $(this).focus();
                });
            }
        }
        if ($(li).hasClass('active')) {
            $(li).children('button').addClass('collapsible').addClass('set');
        }
        RemoveExtraButtons();
    }

    function RemoveExtraButtons() {
        $('.navLocal li').each(function () {
            if (!$(this).hasClass('hasChildren')) {
                $(this).children('button').remove();
            }
        });
    }

    function GetChildrenCDN(hrefVal, li) {
        var node = findNodeByPath(tocData, hrefVal);
        if (!node) {
            console.log("node with path ending in " + hrefVal.toLowerCase() + " was not found (case insensitive).");
            return;
        }
        var newUl = makeUlFromNode(node);
        $(li).append(newUl);
        Activate($(li).children().children());
    }

    function findNodeByPath(node, value) {
        if (node == null) {
            return;
        }
        // For matching purposes, remove language portion of path if present.
        const re = /^\/[a-z][a-z]\//;
        value = value.replace(re, "/");
        if (node.hasOwnProperty('Path') && node.Path.toLowerCase().endsWith(value.toLowerCase()))
            return node;

        for (var i = 0; i < Object.keys(node).length; i++) {
            if (typeof node[Object.keys(node)[i]] == "object") {
                var o = findNodeByPath(node[Object.keys(node)[i]], value);
                if (o != null)
                    return o;
            }
        }
        return null;
    }

    function makeUlFromNode(node) {
        var html = "<ul>";

        for (let i = 0; i < node.Children.length; i++) {
            let child = node.Children[i];
            if (child.hasOwnProperty("Children") && child.Children && child.Children.length > 0) {
                html += "<li class='hasChildren'><a href='" + child.Path + "'>" + child.Name + "</a></li>";
            }
            else {
                html += "<li><a href='" + child.Path + "'>" + child.Name + "</a></li>";
            }
        }
        html += "</ul>";
        return html;
    }
})(jQuery);