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

		var map = new Map({
          basemap: "satellite",
          ground: "world-elevation"
        });
		
		// Trailheads point feature layer
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
              x: -78.29,
              y: 38.58,
              z: 1200 // meters
            },
            tilt: 65,
			heading: 220,
			fov: 100
          }
        });

		_view.ui.empty("top-left");
		_view.navigation.mouseWheelZoomEnabled = false;
		_view.navigation.browserTouchPanEnabled = false;
		_view.on("key-down", function(event){event.stopPropagation();});

		window.view = _view;

		// init controller
		var controller = new ScrollMagic.Controller();

		const TICK_LIMIT = 180;
		$("section#action").css("height", "600vh");
		
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
			.addIndicators()
			.on("enter", onEnter)
			.on("leave", onLeave);
		}
		
		new ScrollMagic.Scene({triggerElement: "#tick60", duration: "100%"})
		.setPin("#caption1")
		.addTo(controller);		

		new ScrollMagic.Scene({triggerElement: "#tick150"})
		.setPin("#caption2")
		.addTo(controller);		
		/*
		new ScrollMagic.Scene({triggerElement: "#tick150", duration: "100%"})
		.setPin("#caption3")
		.addTo(controller);		
		*/
		function onEnter(event)
		{
			var index = $("section#action div.tick")
						.index($(event.target.triggerElement()))+1;
			//console.log(index);
			if (index <= 13) {
				// nothing
			} else if (index > 13 && index <= 57) {
				_view
	              .goTo({
	                /*tilt: 75 - (index-13),*/
					heading: 220 - (index-13)*0.25,
					position: {
		              x: -78.29- (index-13)*0.0001,
		              y: 38.58 - (index-13)*0.0001,
		              z: 1200 // meters
		            },
	              })
	              .catch(function (error) {
	                if (error.name !== "AbortError") {
	                  console.error(error);
	                }
	              });
			} else if (index > 57 && index <= 70) {
				if (index === 58) {
					console.log("end scene 1:");
					reportCamera();
				} else {
					// nothing
				}
			} else if (index > 100 && index <= 170) {
				const DELTA_TILT = -0.45;
				const DELTA_HEADING = -2;
				const DELTA_X = -0.0007;
				const DELTA_Y = -0.00087;
				const DELTA_Z = 2.4;
				const forward = !$("html body").hasClass("reverse");
				_view
	              .goTo({
	                tilt: _view.camera.tilt + (forward ? DELTA_TILT : -DELTA_TILT),
					heading: _view.camera.heading + (forward ? DELTA_HEADING: -DELTA_HEADING),
					position: {
		              x: _view.camera.position.longitude + (forward ? DELTA_X : -DELTA_X),
		              y: _view.camera.position.latitude + (forward ? DELTA_Y : -DELTA_Y),
		              z: _view.camera.position.z + (forward ? DELTA_Z : -DELTA_Z) 
		            },
	              })
	              .catch(function (error) {
	                if (error.name !== "AbortError") {
	                  console.error(error);
	                }
	              });
			} else if (index === 171) {
				// nothing
				console.log("end scene 2:");
				reportCamera();
			} else {
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
	
	function reportCamera()
	{
		console.log("fov", _view.camera.fov);
		console.log("heading", _view.camera.heading);
		console.log("tilt", _view.camera.tilt);
		console.log("x", _view.camera.position.longitude);
		console.log("y", _view.camera.position.latitude);
		console.log("z", _view.camera.position.z);
	}

});