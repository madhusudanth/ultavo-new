<?php
/**
 * @var $map Hugeit_Maps_Map
 */

$styles = sprintf(
    '
    position:relative !important;
    height:%s;
    width:%s;
    border-radius:%s;
    ',
    $map->get_height() . 'px',
    $map->get_width() . '%',
    $map->get_border_radius() . 'px'
);

if ($map->get_align() === 'left') {
    $styles .= 'float:left;margin:0px !important;';
} elseif ($map->get_align() === 'right') {
    $styles .= 'float:right;margin:0px !important;';
} else {
    $styles .= 'margin:0px auto;';
}

$i = random_int(0, 10000);

?>

<div class="huge_it_google_map_container">
    <div id="huge_it_google_map_<?php echo $i; ?>" data-map_id="<?php echo $map->get_id(); ?>"
         class="huge_it_google_map" style="<?php echo $styles; ?>"
         data-name="<?php echo $map->get_name(); ?>"
         data-type="<?php echo $map->get_type(); ?>"
         data-zoom="<?php echo $map->get_zoom(); ?>"
         data-min-zoom="<?php echo $map->get_min_zoom(); ?>"
         data-max-zoom="<?php echo $map->get_max_zoom(); ?>"
         data-border-radius="<?php echo $map->get_border_radius(); ?>"
         data-center-lat="<?php echo $map->get_center_lat(); ?>"
         data-center-lng="<?php echo $map->get_center_lng(); ?>"
         data-pan-controller="<?php echo $map->get_pan_controller(); ?>"
         data-zoom-controller="<?php echo $map->get_zoom_controller(); ?>"
         data-type-controller="<?php echo $map->get_type_controller() ?>"
         data-scale-controller="<?php echo $map->get_scale_controller(); ?>"
         data-street-view-controller="<?php echo $map->get_street_view_controller(); ?>"
         data-overview-map-controller="<?php echo $map->get_overview_map_controller(); ?>"
         data-width="<?php echo $map->get_width(); ?>"
         data-height="<?php echo $map->get_height(); ?>"
         data-align="<?php echo $map->get_align(); ?>"
         data-info-type="<?php echo $map->get_info_type(); ?>"
         data-open-infowindows-onload="<?php echo $map->get_open_infowindows_onload(); ?>"
         data-animation="<?php echo $map->get_animation(); ?>"
         data-language="<?php echo $map->get_language(); ?>"
         data-draggable="<?php echo $map->get_draggable(); ?>"
         data-wheel-scroll="<?php echo $map->get_wheel_scroll(); ?>"
         data-traffic-layer="<?php echo $map->get_traffic_layer(); ?>"
         data-bike-layer="<?php echo $map->get_bike_layer(); ?>"
         data-transit-layer="<?php echo $map->get_transit_layer(); ?>"
         data-styling-hue="<?php echo $map->get_styling_hue(); ?>"
         data-styling-lightness="<?php echo $map->get_styling_lightness(); ?>"
         data-styling-gamma="<?php echo $map->get_styling_gamma(); ?>"
         data-styling-saturation="<?php echo $map->get_styling_saturation(); ?>"></div>
</div>
