require(
[
	"esri/Map", 
	"esri/views/SceneView",
	"esri/geometry/Extent",
	"esri/geometry/SpatialReference",
	"esri/geometry/Point",
	"esri/layers/FeatureLayer"
],	 
function(
	Map, 
	SceneView,
	Extent,
	SpatialReference,
	Point,
	FeatureLayer
	) {

	"use strict";
	
	var _view;
	var _lastScrollTop = 0; // used to track whether scroll is forward or reverse
	
	const ANIMATIONS = [
		{
			title: "opening",
			indexFrom: -1,
			indexTo: -1,
			result: {
				fov: 100,
				heading: 220,
				tilt: 65,
				x: -78.29,
                y: 38.58,
                z: 1200 // meters
			}
		},
		{
			title: "ascending trail",
			indexFrom: 14,
			indexTo: 57,
			result: {
				heading: 209.15734359100423,
				tilt: 65.00000697438114,
				x: -78.2943371074331,
				y: 38.57566293895012,
				z: 1199.9999999990687
			}
		},
		{
			title: "scramble across top",
			indexFrom: 101,
			indexTo: 170,
			result: {
				heading: 187.94556249091443,
				tilt: 60.09714325569671,
				x: -78.3072192632819,
				y: 38.558066453654284,
				z: 1240.890418649651					
			}
		},
		{
			title: "overhead top view",
			indexFrom: 210,
			indexTo: 240,
			result: {
				heading: 184.48378517653958,
				tilt: 0,
				x: -78.31142265920268,
				y: 38.552576248047245,
				z: 1600
			}
		}
	];

	$(document).ready(function() {
		
		window.onbeforeunload = function (){window.scrollTo(0, 0);};
		
		$(window).scroll(onWindowScroll);		

		var map = new Map({basemap: "satellite", ground: "world-elevation"});
		
		var featureLayer = new FeatureLayer({
		  url:
		    "https://services.arcgis.com/nzS0F0zdNLvs7nc8/arcgis/rest/services/old_rg_sectionz/FeatureServer/0"
		});
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

		const TICK_LIMIT = 270;
		$("section#action").css("height", "900vh");
		
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
		
		new ScrollMagic.Scene({triggerElement: "#tick62", duration: "100%"})
		.setPin("#caption-ascent")
		.addTo(controller);		
		
		new ScrollMagic.Scene({triggerElement: "#tick170", duration: "100%"})
		.setPin("#caption-scramble")
		.addTo(controller);		

	});

	/***************************************************************************
	********************************* EVENTS ***********************************
	***************************************************************************/

	function onEnter(event)
	{
		var index = $("section#action div.tick")
					.index($(event.target.triggerElement()))+1;
		var current = findAnimation(index);
		if (current) {

			var last = ANIMATIONS[ANIMATIONS.indexOf(current)-1];
			var span = (current.indexTo - current.indexFrom)+1;
			var step = (index - current.indexFrom)+1;

			_view
			  .goTo({
				tilt: 	last.result.tilt + 
						((current.result.tilt - last.result.tilt) / span)*step,
				heading: last.result.heading + 
						((current.result.heading - last.result.heading) / span)*step,
				position: {
					x: 	last.result.x + ((current.result.x - last.result.x) / span)*step, 
					y: 	last.result.y + ((current.result.y - last.result.y) / span)*step, 
					z: 	last.result.z + ((current.result.z - last.result.z) / span)*step
				},
			  })
			  .catch(function (error) {
				if (error.name !== "AbortError") {
				  console.error(error);
				}
			  });
			
		} else {
			// nothing
		}

	}
			
	function onLeave(event)
	{
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
	**************************** EVENTS (other) ********************************
	***************************************************************************/

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
	/*
	function reportCamera()
	{
		console.log("fov", _view.camera.fov);
		console.log("heading", _view.camera.heading);
		console.log("tilt", _view.camera.tilt);
		console.log("x", _view.camera.position.longitude);
		console.log("y", _view.camera.position.latitude);
		console.log("z", _view.camera.position.z);
	}
	*/
});