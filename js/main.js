(function () {

	"use strict";

	$(document).ready(function() {
		
		window.onbeforeunload = function (){window.scrollTo(0, 0);};
		
		var lastScrollTop = 0;
		$(window).scroll(function(event){
			var st = $(this).scrollTop();
			if (st > lastScrollTop){
				$("html body").removeClass("reverse");
			} else {
				$("html body").addClass("reverse");
			}
			lastScrollTop = st;
		});		
				
		var viewer = pannellum.viewer('panorama', {
		    "type": "equirectangular",
		    "panorama": "https://pannellum.org/images/alma.jpg",
			"autoLoad": true,
			"mouseZoom": false,
			"showZoomCtrl": false,
			"keyboardZoom": false,
			"disableKeyboardCtrl": true,
			"showFullscreenCtrl": false,
			"draggable": false
		});

		// init controller
		var controller = new ScrollMagic.Controller();

		/*
		// build scene
		new ScrollMagic.Scene({triggerElement: "#section1", duration: "100%"})
						.addTo(controller)
						.addIndicators()
						.on("enter", function (e) {
							console.log("enter 1");
							viewer.setPitch(0);
							viewer.setYaw(0);
						})
						.on("leave", function (e) {
							console.log("leave 1");
						});
		*/				
		
		const TICK_LIMIT = 150;
		$("section#action").css("height", "500vh");
		
		for (var i = 1; i < TICK_LIMIT+1; i++) {
			$("section#action").append($("<div>").addClass("tick").attr("id", "tick"+i));
			new ScrollMagic.Scene(
				{
					triggerElement: "#tick"+i, 
					triggerHook: 0.5, 
					offset: 0,
					duration: "3%"
				}
			)
			.addTo(controller)
			/*.addIndicators()*/
			.on("enter", onEnter)
			.on("leave", onLeave);

		}
		
		new ScrollMagic.Scene({triggerElement: "#tick8", duration: "130%"})
		.setPin("#caption1")
		.addTo(controller);		

		new ScrollMagic.Scene({triggerElement: "#tick60", duration: "120%"})
		.setPin("#caption2")
		.addTo(controller);		

		new ScrollMagic.Scene({triggerElement: "#tick106", duration: "100%"})
		.setPin("#caption3")
		.addTo(controller);		

		function onEnter(event)
		{
			var index = $("section#action div.tick")
						.index($(event.target.triggerElement()))+1;
			if (index <= 13) {
				// nothing
			} else if (index > 13 && index <= 57) {
				viewer.setYaw(2*(index-13), false);
				viewer.setPitch(0, false);
			} else if (index > 57 && index <= 70) {
				// nothing
			} else if (index > 70 && index <= 100) {
				viewer.setHfov(100- (index - 70), false);
			} else if (index > 100 && index <= 115) {
				// nothing
			} else {
				viewer.setPitch((index - 115)*5);
			}
		}
		
		function onLeave(event)
		{
		}
		
	});

	/***************************************************************************
	********************** EVENTS that affect selection ************************
	***************************************************************************/

	/***************************************************************************
	**************************** EVENTS (other) ********************************
	***************************************************************************/

	/***************************************************************************
	******************************** FUNCTIONS *********************************
	***************************************************************************/
	

})();