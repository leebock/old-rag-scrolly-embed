require(
[
	"esri/Map", 
	"esri/views/SceneView",
	"esri/layers/FeatureLayer"
],	 
function(
	Map, 
	SceneView,
	FeatureLayer
	) {

	"use strict";
	
	var _view;
	var _lastScrollTop = 0; // used to track whether scroll is forward or reverse

	const TICK_LIMIT = 440;
	const URL_GPS = "https://services.arcgis.com/nzS0F0zdNLvs7nc8/arcgis/rest/services/old_rg_sectionz/FeatureServer/0";
	const URL_JSON_WAYPOINTS = "resources/waypoints.json";
	
	var ANIMATIONS;
	
	$(document).ready(function() {
	
		$.getJSON(URL_JSON_WAYPOINTS, function(data) {ANIMATIONS = data; finish();});
		
		function finish()
		{

			window.onbeforeunload = function (){window.scrollTo(0, 0);};
			$(window).scroll(onWindowScroll);		
	
			var map = new Map({basemap: "satellite", ground: "world-elevation"});
			
			var featureLayer = new FeatureLayer({url: URL_GPS});
			map.add(featureLayer);		
	  
	        _view = new SceneView({
	          container: "view",
	          map: map,
	          camera: {
	            position: {
	              x: ANIMATIONS[0].result.x,
	              y: ANIMATIONS[0].result.y,
	              z: ANIMATIONS[0].result.z
	            },
	            tilt: ANIMATIONS[0].result.tilt,
				heading: ANIMATIONS[0].result.heading,
				fov: ANIMATIONS[0].result.fov
	          }
	        });
	
			_view.ui.empty("top-left");
			_view.navigation.mouseWheelZoomEnabled = false;
			_view.navigation.browserTouchPanEnabled = false;
			_view.on("key-down", function(event){event.stopPropagation();});
	
			window.view = _view;
	
			// init controller
			var controller = new ScrollMagic.Controller();

			new ScrollMagic.Scene({
				triggerElement: "#view", 
				triggerHook: 0, 
				duration: function(){return $("#action").outerHeight();}
			})
			.setPin("#view", {pushFollowers: false})
			.addTo(controller);		
	
			$("section#action").css("height", (TICK_LIMIT*3.3333333)+"vh");
			
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
				.on("enter", onEnter);
			}
			
			ANIMATIONS.forEach((animation, i) => {
				if (animation.caption) {
					var tick = i===0 ? 12 : animation.indexTo;
					$("<div>")
						.addClass("caption")
						.css("top", parseInt((tick/TICK_LIMIT)*100)+"%")
						.append($("<h3>").html(animation.title))
						.append($("<p>").html(animation.caption))
						.append(animation.photo ? $("<img>").attr("src", "resources/"+animation.photo) : null)
						.append(animation.photo ? $("<div>").html(animation["photo-credit"]).addClass("picture-caption") : null)
						.appendTo($("section#action"));
				}				
			});		
		}
	
	});

	/***************************************************************************
	********************************* EVENTS ***********************************
	***************************************************************************/

	function onEnter(event)
	{
		var index = $("section#action div.tick")
					.index($(event.target.triggerElement()))+1;
		var current = findAnimation(index);
		if (current && ANIMATIONS.indexOf(current) > 0) {

			var last = ANIMATIONS[ANIMATIONS.indexOf(current)-1];
			var span = (current.indexTo - current.indexFrom)+1;
			var step = (index - current.indexFrom)+1;

			_view.goTo(
				{
					tilt: 	last.result.tilt + 
							((current.result.tilt - last.result.tilt) / span)*step,
					heading: last.result.heading + 
							((current.result.heading - last.result.heading) / span)*step,
					position: {
						x: last.result.x + ((current.result.x - last.result.x) / span)*step, 
						y: last.result.y + ((current.result.y - last.result.y) / span)*step, 
						z: last.result.z + ((current.result.z - last.result.z) / span)*step
					},
				},
				{animate: true, duration: 250, speedFactor: 0.25, easing: "out-expo"}
			)
			.catch(function (error) {
				if (error.name !== "AbortError") {
					console.error(error);
				}
			});
			
		} else {
			// nothing
		}

	}

	function onWindowScroll(event){
		var st = $(event.target).scrollTop();
		if (st > _lastScrollTop){
			$("html body").removeClass("reverse");
		} else {
			$("html body").addClass("reverse");
		}
		_lastScrollTop = st;
	}

	/***************************************************************************
	******************************** FUNCTIONS *********************************
	***************************************************************************/

	function findAnimation(index)
	{
		return $.grep(
			ANIMATIONS, 
			function(animation) {
				return index >= animation.indexFrom && index <= animation.indexTo;
			}
		).shift();
	}

});