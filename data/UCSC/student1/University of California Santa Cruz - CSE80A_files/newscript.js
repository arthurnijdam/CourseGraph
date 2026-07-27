(function ($) {
$(window).bind("load", function() {

	// setup small screen smart catalog menu click toggling
	$( "#searchtoggle" ).click(function() {
        var menu = $('#leftcolumn_0_Panel1 > div.sidebox');
	    var $doo = menu.attr('class');
		if ( $doo == "sidebox" ) {
			menu.addClass('toggled-oni');
		} else {
			menu.removeClass('toggled-oni');
		}
   });

   // setup small screen smart catalog search click toggling
	$( "div#leftpanel>div.sidebox>div.hdr" ).click(function() {
        var menu = $('div#leftpanel>div.toc');
	    var $doo = menu.attr('class');
		if ( $doo == "toc" ) {
			menu.addClass('toggled-on');
		} else {
			menu.removeClass('toggled-on');
		}
   });
   
   // change > symbol between breadcrumb path with | symbol
	   var pbc = $("p#breadcrumbs").html();
	   var pbc1 = pbc.replace(/&gt;/g,"/");
	   $("p#breadcrumbs").html(pbc1);

	// remove active class of navigation
	   $("li.active").parents("li.hasChildren.active").removeClass("active");
	
		$("li.title").nextUntil("li.title").css("display", "none");
		$('li.title').click(function() {
			$(this).nextUntil("li").toggle();
			return false;
		}).next();
	
	//add style to program tables
		$('tr').each(function(){
		if($('td:contains(" ")', this).length){       
			$(this).addClass('blackBar');
			}
		});

		$('tr').each(function(){
		if($('td:contains("OR ")', this).length){       
			$(this).addClass('bottomBar');
			}
		});

		$('tr').each(function(){
		if($('td:contains("AND ")', this).length){       
			$(this).addClass('bottomBar');
			}
		});
		
	// add class and attributes to text that reads "NOTE: Lecture and Lab"
		$('p.sc-RequirementNarrative:contains("NOTE: Lecture and Lab")').addClass('lectureLab');
		$('p.lectureLab').attr('title','Additional information about lecture and lab courses');
		$('h3:contains("Credits")').addClass('credits');
		
	// scrolling header
	window.onscroll = changePos;

	function changePos() {
    var header1 = document.getElementById("goTop");
		if (window.pageYOffset > 150) {
			$('#goTop').addClass("show");
		} 
		else {
			 $('#goTop').removeClass("show");
		}
	}	   
	// Scroll to top
	$('#goTop').click(function(){
    $("html, body").animate({ scrollTop: 0 }, 600);
    return false;
	 });
	 
	 // hide table that has not contents
	$('table').each(function() {
	  if($(this).find('tbody').length == 0) {
	   $(this).addClass("hideTable");
	  }
	});
	
	//expand and collapse program of study page
	$('#sc-program-links h2').nextUntil("#sc-program-links h2").css('display', 'none');
	
	$('#sc-program-links h2').click(function() {
		$(this).nextUntil("#sc-program-links h2").toggle();
		$(this).toggleClass('active');
		return false;
	}).next();	
	
	// setup accordions for program tables
	// start accordion open
	$("h3.sc-RequiredCoursesHeading1").each(function (index) {
		$(this).nextUntil("h3.sc-RequiredCoursesHeading1").wrapAll("<div class='expand'></div>");  
	});
	
	// add accordion style to first level
	$('h3.sc-RequiredCoursesHeading1').click(function() {
		$(this).nextUntil("h3.sc-RequiredCoursesHeading1").toggleClass("hide");
		$(this).toggleClass("active");
		$(this).find("button.programList i").toggleClass("fa-caret-up");
		return false;
	}).next();
	
	// start accordion open
	$("h4.sc-RequiredCoursesHeading2").each(function (index) {
		$(this).nextUntil("h4.sc-RequiredCoursesHeading2").wrapAll("<div class='expand'></div>");  
	});
	
	// add accordion style to second level
	$('h4.sc-RequiredCoursesHeading2').click(function() {
		$(this).nextUntil("h4.sc-RequiredCoursesHeading2").toggleClass("hide");
		$(this).toggleClass("active");
		$(this).find("button.programList i").toggleClass("fa-caret-up");
		return false;
	}).next();
	
	//add tab index to programs
	//$("h3.sc-RequiredCoursesHeading1").each(function (i) { $(this).attr('tabindex', 0); });
	
	$("#degree-req h3.sc-RequiredCoursesHeading1").append('<button class="programList closed" alt="expand and collapse"><i class="fa fa-caret-down"></i><span>Expand and Collapse</span></button>');
	$("#degree-req h4.sc-RequiredCoursesHeading2").append('<button class="programList closed" alt="expand and collapse"><i class="fa fa-caret-down"></i><span>Expand and Collapse</span></button>');
	
	// add expand/collapse all button to program tables
		$("#degree-req-1 h2").not("#degree-req-1 h2.sc-RequirementNarrative").append('<input type="button" id="collapsebutton" class="expandcollapse" value="Close All"><input type="button" id="expandbutton" class="expandcollapse" value="Open All">');
		
		 $( "#expandbutton" ).hide();

		  $( "#expandbutton" ).click(function() {
		  $('div.expand').removeClass('hide');
		  $('h3.sc-RequiredCoursesHeading1').addClass('active');
		  $( "button.programList i" ).addClass('fa-caret-up');
		  $( "#expandbutton" ).hide();
		  $( "#collapsebutton" ).show();
		  });

		  $( "#collapsebutton" ).click(function() {
		  $('div.expand').addClass('hide');
		  $('h3.sc-RequiredCoursesHeading1').removeClass('active');
		  $( "button.programList i" ).removeClass('fa-caret-up');
		  $( "#expandbutton" ).show();
		  $( "#collapsebutton" ).hide();
		  });
		  
	// add expand/collapse all button to program tables
		$("#degree-req-2 h2").append('<div id="collapsebutton" class="expandcollapse">Close All</div><div id="expandbutton" class="expandcollapse">Open All</div>');
		
		 $( "#degree-req-2 #expandbutton" ).hide();

		  $("#degree-req-2 #expandbutton" ).click(function() {
		  $('#degree-req-2 div.expand').removeClass('hide');
		  $('#degree-req-2 h3.sc-RequiredCoursesHeading1').addClass('active');
		  $( "button.programList i" ).addClass('fa-caret-up');
		  $( "#degree-req-2 #expandbutton" ).hide();
		  $( "#degree-req-2 #collapsebutton" ).show();
		  });

		  $("#degree-req-2 #collapsebutton" ).click(function() {
		  $('#degree-req-2 div.expand').addClass('hide');
		  $('#degree-req-2 h3.sc-RequiredCoursesHeading1').removeClass('active');
		  $( "button.programList i" ).removeClass('fa-caret-up');
		  $("#degree-req-2 #expandbutton" ).show();
		  $("#degree-req-2 #collapsebutton" ).hide();
		  });
		  
	// add expand/collapse all button to program tables
		$("#degree-req-3 h2").append('<div id="collapsebutton" class="expandcollapse">Close All</div><div id="expandbutton" class="expandcollapse">Open All</div>');
		
		 $( "#degree-req-3 #expandbutton" ).hide();

		  $("#degree-req-3 #expandbutton" ).click(function() {
		  $('#degree-req-3 div.expand').removeClass('hide');
		  $('#degree-req-3 h3.sc-RequiredCoursesHeading1').addClass('active');
		  $( "button.programList i" ).addClass('fa-caret-up');
		  $( "#degree-req-3 #expandbutton" ).hide();
		  $( "#degree-req-3 #collapsebutton" ).show();
		  });

		  $("#degree-req-3 #collapsebutton" ).click(function() {
		  $('#degree-req-3 div.expand').addClass('hide');
		  $('#degree-req-3 h3.sc-RequiredCoursesHeading1').removeClass('active');
		  $( "button.programList i" ).removeClass('fa-caret-up');
		  $("#degree-req-3 #expandbutton" ).show();
		  $("#degree-req-3 #collapsebutton" ).hide();
		  });
		  
	// add expand/collapse all button to program tables
		$("#degree-req-4 h2").append('<div id="collapsebutton" class="expandcollapse">Close All</div><div id="expandbutton" class="expandcollapse">Open All</div>');
		
		 $( "#degree-req-4 #expandbutton" ).hide();

		  $("#degree-req-4 #expandbutton" ).click(function() {
		  $('#degree-req-4 div.expand').removeClass('hide');
		  $('#degree-req-4 h3.sc-RequiredCoursesHeading1').addClass('active');
		  $( "button.programList i" ).addClass('fa-caret-up');
		  $( "#degree-req-4 #expandbutton" ).hide();
		  $( "#degree-req-4 #collapsebutton" ).show();
		  });

		  $("#degree-req-4 #collapsebutton" ).click(function() {
		  $('#degree-req-4 div.expand').addClass('hide');
		  $('#degree-req-4 h3.sc-RequiredCoursesHeading1').removeClass('active');
		  $( "button.programList i" ).removeClass('fa-caret-up');
		  $("#degree-req-4 #expandbutton" ).show();
		  $("#degree-req-4 #collapsebutton" ).hide();
		  });
		  
	// add expand/collapse all button to program tables
		$("#degree-req-5 h2").append('<div id="collapsebutton" class="expandcollapse">Close All</div><div id="expandbutton" class="expandcollapse">Open All</div>');
		
		 $( "#degree-req-5 #expandbutton" ).hide();

		  $("#degree-req-5 #expandbutton" ).click(function() {
		  $('#degree-req-5 div.expand').removeClass('hide');
		  $('#degree-req-5 h3.sc-RequiredCoursesHeading1').addClass('active');
		  $( "button.programList i" ).addClass('fa-caret-up');
		  $( "#degree-req-5 #expandbutton" ).hide();
		  $( "#degree-req-5 #collapsebutton" ).show();
		  });

		  $("#degree-req-5 #collapsebutton" ).click(function() {
		  $('#degree-req-5 div.expand').addClass('hide');
		  $('#degree-req-5 h3.sc-RequiredCoursesHeading1').removeClass('active');
		  $( "button.programList i" ).removeClass('fa-caret-up');
		  $("#degree-req-5 #expandbutton" ).show();
		  $("#degree-req-5 #collapsebutton" ).hide();
		  });

	// add expand/collapse all button to program tables
		$("#degree-req-6 h2").append('<div id="collapsebutton" class="expandcollapse">Close All</div><div id="expandbutton" class="expandcollapse">Open All</div>');
		
		 $( "#degree-req-6 #expandbutton" ).hide();

		  $("#degree-req-6 #expandbutton" ).click(function() {
		  $('#degree-req-6 div.expand').removeClass('hide');
		  $('#degree-req-6 h3.sc-RequiredCoursesHeading1').addClass('active');
		  $( "button.programList i" ).addClass('fa-caret-up');
		  $( "#degree-req-6 #expandbutton" ).hide();
		  $( "#degree-req-6 #collapsebutton" ).show();
		  });

		  $("#degree-req-6 #collapsebutton" ).click(function() {
		  $('#degree-req-6 div.expand').addClass('hide');
		  $('#degree-req-6 h3.sc-RequiredCoursesHeading1').removeClass('active');
		  $( "button.programList i" ).removeClass('fa-caret-up');
		  $("#degree-req-6 #expandbutton" ).show();
		  $("#degree-req-6 #collapsebutton" ).hide();
		  });		  
		  
		  
		 //		
		$("p span.firstName").slice(0,1);
		$("div.xlistLine").insertBefore(".courselist");
		
	// add text to drop down label
	$('label[id*="leftcolumn_0_filterLabel"]').text('Search Option Dropdown');
	
});
})(jQuery);