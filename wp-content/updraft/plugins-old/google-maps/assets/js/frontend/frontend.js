var hugeitMaps = [];

function hugeitMapsBindInfoWindow(marker, map, infowindow, description, infoType, openOnload) {
    if(openOnload){
        google.maps.event.addListenerOnce(map, 'tilesloaded', function() {
            infowindow.setContent(description);
            infowindow.open(map, marker);
        });
    }

    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent(description);
        infowindow.open(map, marker);
    });
}

function hugeitMapsAttachInstructionText(stepDisplay, marker, text, map) {
    google.maps.event.addListener(marker, 'click', function() {
        /*Open an info window when the marker is clicked on, containing the text of the step.*/
        stepDisplay.setContent(text);
        stepDisplay.open(map, marker);
    });
}




jQuery(document).ready(function () {
    function hugeitMapsInitializeMap( elementId ) {
        var element = jQuery( "#"+elementId ),
            marker = [],
            polygone = [],
            polyline = [],
            polylinepoints,
            newpolylinecoords = [],
            polygonpoints,
            polygoncoords = [],
            directions = [],
            directionMarkers = [],
            newcircle = [],
            infowindow = new google.maps.InfoWindow,
            infowindows = [],
            newcirclemarker = [],
            circlepoint,
            width = element.width(),
            height = element.height(),
            div = parseInt(width) / parseInt(height),
            dataMapId = element.data('map_id'),
            dataZoom = element.data('zoom'),
            dataMinZoom = element.data('min-zoom'),
            dataMaxZoom = element.data('max-zoom'),
            dataCenterLat = element.data('center-lat'),
            dataCenterLng = element.data('center-lng'),
            dataPanController = parseInt(element.data('pan-controller')),
            dataZoomController = parseInt(element.data('zoom-controller')),
            dataTypeController = parseInt(element.data('type-controller')),
            dataScaleController = parseInt(element.data('scale-controller')),
            dataStreetViewController = parseInt(element.data('street-view-controller')),
            dataOverviewMapController = parseInt(element.data('overview-map-controller')),
            dataInfoType = element.data('info-type'),
            dataOpenInfowindowsOnload = element.data('open-infowindows-onload');

        jQuery(window).on("resize", function () {
            var newwidth = element.width();
            var newheight = parseInt(newwidth) / parseInt(div) + "px";
            element.height(newheight);
        });
        var center_coords = new google.maps.LatLng(dataCenterLat, dataCenterLng);

        var frontEndMapOptions = {
            zoom: parseInt(dataZoom),
            center: center_coords,
            disableDefaultUI: true,
            panControl: dataPanController,
            zoomControl: dataZoomController,
            mapTypeControl: dataTypeController,
            scaleControl: dataScaleController,
            streetViewControl: dataStreetViewController,
            overviewMapControl: dataOverviewMapController,
            mapTypeId: google['maps']['MapTypeId']['ROADMAP'],
            minZoom: dataMinZoom,
            maxZoom: dataMaxZoom
        };
        var front_end_map = new google.maps.Map(document.getElementById(elementId), frontEndMapOptions);
        var front_end_data = {
            action: 'hugeit_maps_get_info',
            map_id: dataMapId
        };
        jQuery.ajax({
            url: ajaxurl,
            dataType: 'json',
            method: 'post',
            data: front_end_data,
            beforeSend: function () {
            }
        }).done(function (response) {
            hugeitMapsInitializeMap(response);
        }).fail(function () {
            console.log('Failed to load response from database');
        });
        function hugeitMapsInitializeMap(response) {
            if (response.success) {
                var mapInfo = response.success;
                var markers = mapInfo.markers;
                for (var i = 0; i < markers.length; i++) {
                    var name = markers[i].name;
                    var address = markers[i].address;
                    var anim = markers[i].animation;
                    var description = markers[i].description;
                    var point = new google.maps.LatLng(
                        parseFloat(markers[i].lat),
                        parseFloat(markers[i].lng));
                    marker[i] = new google.maps.Marker({
                        map: front_end_map,
                        position: point,
                        title: name,
                        content: description,
                        animation: google['maps']['Animation'][anim]
                    });
                    var currentInfoWindow;

                    if(dataOpenInfowindowsOnload){
                        currentInfoWindow = infowindows[i] = new google.maps.InfoWindow;
                    }else{
                        currentInfoWindow = infowindow;
                    }
                    hugeitMapsBindInfoWindow(marker[i], front_end_map, currentInfoWindow, description, dataInfoType, dataOpenInfowindowsOnload);
                }
                var polygones = mapInfo.polygons;
                for (var i = 0; i < polygones.length; i++) {
                    var name = polygones[i].name;
                    var line_opacity = polygones[i].line_opacity;
                    var line_color = "#" + polygones[i].line_color;
                    var fill_opacity = polygones[i].fill_opacity;
                    var line_width = polygones[i].line_width;
                    var fill_color = "#" + polygones[i].fill_color;
                    var latlngs = polygones[i].latlng;
                    polygoncoords = [];
                    for (var j = 0; j < latlngs.length; j++) {
                        polygonpoints = new google.maps.LatLng(parseFloat(latlngs[j].lat),
                            parseFloat(latlngs[j].lng))
                        polygoncoords.push(polygonpoints)
                    }
                    polygone[i] = new google.maps.Polygon({
                        paths: polygoncoords,
                        map: front_end_map,
                        strokeOpacity: line_opacity,
                        strokeColor: line_color,
                        strokeWeight: line_width,
                        fillOpacity: fill_opacity,
                        fillColor: fill_color,
                        draggable: false
                    });
                }
                var polylines = mapInfo.polylines;
                for (var i = 0; i < polylines.length; i++) {
                    var name = polylines[i].name;
                    var line_opacity = polylines[i].line_opacity;
                    var line_color = polylines[i].line_color;
                    var line_width = polylines[i].line_width;
                    var latlngs = polylines[i].latlng;
                    newpolylinecoords = [];
                    for (var j = 0; j < latlngs.length; j++) {
                        polylinepoints = new google.maps.LatLng(parseFloat(latlngs[j].lat),
                            parseFloat(latlngs[j].lng));
                        newpolylinecoords.push(polylinepoints)
                    }
                    polyline[i] = new google.maps.Polyline({
                        path: newpolylinecoords,
                        map: front_end_map,
                        strokeColor: "#" + line_color,
                        strokeOpacity: line_opacity,
                        strokeWeight: line_width
                    });
                }
                var circles = mapInfo.circles;
                for (var i = 0; i < circles.length; i++) {
                    var circle_name = circles[i].name;
                    var circle_center_lat = circles[i].center_lat;
                    var circle_center_lng = circles[i].center_lng;
                    var circle_radius = circles[i].radius;
                    var circle_line_width = circles[i].line_width;
                    var circle_line_color = circles[i].line_color;
                    var circle_line_opacity = circles[i].line_opacity;
                    var circle_fill_color = circles[i].fill_color;
                    var circle_fill_opacity = circles[i].fill_opacity;
                    var circle_show_marker = parseInt(circles[i].show_marker);
                    circlepoint = new google.maps.LatLng(parseFloat(circles[i].center_lat),
                        parseFloat(circles[i].center_lng));
                    newcircle[i] = new google.maps.Circle({
                        map: front_end_map,
                        center: circlepoint,
                        title: name,
                        radius: parseInt(circle_radius),
                        strokeColor: "#" + circle_line_color,
                        strokeOpacity: circle_line_opacity,
                        strokeWeight: circle_line_width,
                        fillColor: "#" + circle_fill_color,
                        fillOpacity: circle_fill_opacity
                    });
                    if (circle_show_marker) {
                        newcirclemarker[i] = new google.maps.Marker({
                            position: circlepoint,
                            map: front_end_map,
                            title: circle_name
                        });
                    }
                }
            }
        }
    }

    var allMaps = jQuery('.huge_it_google_map');

    if( allMaps.length ){

        allMaps.each(function(i){

            var id = jQuery(this).attr('id');

            hugeitMaps[i] = hugeitMapsInitializeMap( id );



        });

    }



});