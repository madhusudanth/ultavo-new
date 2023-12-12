<?php
$base = esc_url( home_url( '/' ));
/**
 * The template for displaying the header
 *
 * Displays all of the head element and everything up until the "site-content" div.
 *
 * @package WordPress
 * @subpackage Twenty_Sixteen
 * @since Twenty Sixteen 1.0
 */

?><!DOCTYPE html>
<html <?php language_attributes(); ?> class="no-js">
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="google-site-verification" content="Jqcc7DLDD_PnUplHg3hez78ckd0VKAainKauIvAm6aw" />
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<?php if ( is_singular() && pings_open( get_queried_object() ) ) : ?>
	<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">
	<?php endif; ?>
	<link rel="shortcut icon" href="<?php echo $base; ?>wp-content/themes/twentysixteen/images/favicon.ico" type="image/x-icon">
	<link rel="icon" href="<?php echo $base; ?>wp-content/themes/twentysixteen/images/favicon.ico" type="image/x-icon">
	<?php wp_head(); ?>
	<link href="<?php echo $base; ?>wp-content/themes/twentysixteen/css/custom.css" rel="stylesheet">	
	<script src="<?php echo $base; ?>wp-content/themes/twentysixteen/js/jquery-1.8.2.min.js"></script>
	<script src="<?php echo $base; ?>wp-content/themes/twentysixteen/js/depreloadjs/jquery.DEPreLoad.js"></script>
	<script src="<?php echo $base; ?>wp-content/themes/twentysixteen/js/custom.js"></script>
</head>

<body <?php body_class(); ?>>
<div id="preload">
	<!-- <div class="parent-pre-bg-wrap" style="background-image: url(<?php //echo site_url(); ?>/wp-content/uploads/2016/12/cover-slide-large.gif);"></div> -->
	<div class="parent-pre-bg-wrap" style="background-color: #000;"></div>
	<div class="parent-pre">
		<div class="inside-pre">
			<div class="main-image" style="background-image: url(<?php echo site_url(); ?>/wp-content/themes/twentysixteen/images/logo.png);"></div>
			<img class="back-image" src="<?php echo site_url(); ?>/wp-content/themes/twentysixteen/images/logo.png">
			<p class="loading-text">Loading..... <span class="perc">0%</span></span>
			<!-- <div class="preloading-image-movement" style="background-image: url(<?php echo site_url(); ?>/wp-content/uploads/2016/12/equi.gif);"></div> -->
			<div id="loader-wrapper">
			    <div id="loader"></div>
			</div>
		</div>
		<script>
			jQuery(function($){
	            $(document).ready(function() {
	            	var loaderHeight = 0;
	            	var loader = $("body").DEPreLoad({
	                    OnStep: function(percent) {
	                        // console.log(percent + '%');
	                        loaderHeight = (129 * percent)/100;
	                        $("#preload .main-image").height(loaderHeight);
	                        $("#preload .perc").text(percent + "%");
	                    }
	                });
	            });
			});
        </script>
	</div>
</div>
<div id="page" class="site">
	<div class="site-inner">
		<a class="skip-link screen-reader-text" href="#content"><?php _e( 'Skip to content', 'twentysixteen' ); ?></a>

		<header id="masthead" class="site-header" role="banner" >
			<div class="site-header-main">
				<div class="header-social">
					<a href="https://www.facebook.com/profile.php?id=100089371903379" target="_blank"><i class="top-facebook"></i></a>
					<!-- <a href="https://twitter.com/ultavo/" target="_blank"><i class="top-twitter"></i></a>
					<a href="https://plus.google.com/101384320613644663377/" target="_blank"><i class="top-google-plus"></i></a> -->
				</div>
				<div class="menu-trigger">
					<i class="menu-icon"></i>
				</div>
				<div class="side-menu-wrapper">
					<div class="side-menu-content">
						<div class="close-side-menu">
							<icon class="close">&#10005;</icon>
						</div>
						<div class="main-links">
							<?php if ( has_nav_menu( 'primary' ) ) : ?>
							<nav id="site-navigation" class="main-navigation" role="navigation" aria-label="<?php esc_attr_e( 'Primary Menu', 'twentysixteen' ); ?>">
								<?php
									wp_nav_menu( array(
										'theme_location' => 'primary',
										'menu_class'     => 'primary-menu',
									 ) );
								?>
							</nav><!-- .main-navigation -->
						<?php endif;?>
						</div>
					</div>
				</div>
				<script type="text/javascript">
					jQuery(function($){
						$('.menu-icon').click(function(){
							// $('.side-menu-content').show();
							var leftMenuPos = $(window).width() - 320;
							$('.side-menu-content').css({'left': leftMenuPos + 'px'});
						});
						$('.side-menu-wrapper .side-menu-content .close-side-menu .close').click(function(){
							// $('.side-menu-content').hide();
							$('.side-menu-content').css({'left': ''});
						});
						$('.side-menu-wrapper .side-menu-content .nested-category-structure .show-hide').click(function(){
							event.preventDefault();
							var showHide = $(this);
							if (showHide.text() == '+') {
								showHide.text('-');
							} else {
								showHide.text('+');
							}
							var aParent = showHide.parent();
							liParent = aParent.parent();
							liParent.find("> ul").toggleClass('show');
						});
					});
				</script>
				<?php if ( is_page(get_option('page_on_front')) ) { ?>
				<div class="site-branding"  style="/*background-image: url('<?php //header_image(); ?>');*/" >
					<?php echo do_shortcode('[smartslider3 slider=2]'); ?>
				<?php } else { ?>
				<div class="site-branding"  style="background-color: #000;" >
				<?php } ?>
					<?php twentysixteen_the_custom_logo(); ?>

					<?php if ( is_front_page() && is_home() ) : ?>
						<h1 class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></h1>
					<?php endif;

					$description = get_bloginfo( 'description', 'display' );
					if ( $description || is_customize_preview() ) : ?>
						<p class="site-description"><?php echo $description; ?></p>
					<?php endif; ?>
					<div class="home-text" style="display: none;">WELCOME TO WORLD OF High End Fidelity</div>
					<i class="down-arrow transit-to-block-arrow" alt="home-brands"></i>
				</div><!-- .site-branding -->
				<?php if ( has_nav_menu( 'primary' ) || has_nav_menu( 'social' ) ) : ?>
					<button id="menu-toggle" class="menu-toggle"><?php _e( 'Menu', 'twentysixteen' ); ?></button>

					<?php /* <div id="site-header-menu" class="site-header-menu">
						<?php if ( has_nav_menu( 'primary' ) ) : ?>
							<nav id="site-navigation" class="main-navigation" role="navigation" aria-label="<?php esc_attr_e( 'Primary Menu', 'twentysixteen' ); ?>">
								<?php
									wp_nav_menu( array(
										'theme_location' => 'primary',
										'menu_class'     => 'primary-menu',
									 ) );
								?>
							</nav><!-- .main-navigation -->
						<?php endif; ?>

						<?php if ( has_nav_menu( 'social' ) ) : ?>
							<nav id="social-navigation" class="social-navigation" role="navigation" aria-label="<?php esc_attr_e( 'Social Links Menu', 'twentysixteen' ); ?>">
								<?php
									wp_nav_menu( array(
										'theme_location' => 'social',
										'menu_class'     => 'social-links-menu',
										'depth'          => 1,
										'link_before'    => '<span class="screen-reader-text">',
										'link_after'     => '</span>',
									) );
								?>
							</nav><!-- .social-navigation -->
						<?php endif; ?>

					</div><!-- .site-header-menu --> */ ?>
				<?php endif; ?>
			</div><!-- .site-header-main -->
			<?php if ( get_header_image() ) : ?>
				<?php
					/**
					 * Filter the default twentysixteen custom header sizes attribute.
					 *
					 * @since Twenty Sixteen 1.0
					 *
					 * @param string $custom_header_sizes sizes attribute
					 * for Custom Header. Default '(max-width: 709px) 85vw,
					 * (max-width: 909px) 81vw, (max-width: 1362px) 88vw, 1200px'.
					 */
					// $custom_header_sizes = apply_filters( 'twentysixteen_custom_header_sizes', '(max-width: 709px) 85vw, (max-width: 909px) 81vw, (max-width: 1362px) 88vw, 1200px' );
				?>
				<!-- <div class="header-image">
					<a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home">
						<img src="<?php header_image(); ?>" srcset="<?php echo esc_attr( wp_get_attachment_image_srcset( get_custom_header()->attachment_id ) ); ?>" sizes="<?php echo esc_attr( $custom_header_sizes ); ?>" width="<?php echo esc_attr( get_custom_header()->width ); ?>" height="<?php echo esc_attr( get_custom_header()->height ); ?>" alt="<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>">
					</a>
				</div> --><!-- .header-image -->
			<?php endif; // End header image check. ?>
		</header><!-- .site-header -->

		<div id="content" class="site-content">
