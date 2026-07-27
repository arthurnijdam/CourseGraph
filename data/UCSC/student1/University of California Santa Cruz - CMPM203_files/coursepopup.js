(function ($) { 
     $(document).ready(function(){
        var dialogOpts = {
                    addr: "",
                    position: 'center',
                    title: "...",
                    show: 'slide',
                    modal: false,
                    autoOpen: false,
                    height: 180,
                    width: 500,
                    open: function() {
						$(this).load(dialogOpts.addr.toLowerCase() + ' #main, #main-content', '', function(){
							var title = $(this).find('h1').text();
							$(this).dialog('option', 'title', title);
							$(this).find('h1').remove();
                            $(this).append('<p class="boxlink"><a href="' + dialogOpts.addr.toLowerCase() + '">Catalog page for this course</a></p>');
                        });
						// ADA compatability from http://www.geedew.com/2010/02/25/jquery-ui-dialog-accessibility/
						//$(":tabbable:first").focus(function() {
						//	$(".ui-dialog:visible:last :tabbable:first").focus();
						//});
                    }
                };
     
        $('.sc-courselink').each(function(){
			var hrefString = $(this).attr('href');
            if (hrefString.indexOf('Narrative')!=-1) {
				var insideHTML = $(this).text();
				$(this).after(insideHTML);
				$(this).remove('.sc-courselink');
			}
		});
     
        $('.sc-courselink').each(function() {
            $(this).click(function(e) {
                dialogOpts.addr = $(this).attr('href');
                var iebody=(document.compatMode && document.compatMode != "BackCompat")? document.documentElement : document.body;
                var dsocleft=document.all? iebody.scrollLeft : pageXOffset;
                var dsoctop=document.all? iebody.scrollTop : pageYOffset;
				var descspan;
                dialogOpts.position = [e.pageX - dsocleft, e.pageY - dsoctop]; 
                dialogOpts.title = $(this).attr('title'); 

                $(this).append('<span class="desc"></span>');
                descspan = $(this).find('.desc');
                descspan.dialog(dialogOpts); 
                descspan.dialog('open');
                $('a.boxlink').focus();
                $('.ui-icon-closethick').attr("tabindex","1");
//              $('a.boxlink').attr("tabindex",2);              
                return false;
            });
        });
     });
 })(jQuery)    
     