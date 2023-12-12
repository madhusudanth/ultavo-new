<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after
 *
 * @package WordPress
 * @subpackage Twenty_Sixteen
 * @since Twenty Sixteen 1.0
 */
$base = esc_url( home_url( '/' ));
A3_PVC::pvc_stats_update(get_the_ID());
?>

		</div><!-- .site-content -->

		<footer id="colophon" class="site-footer" role="contentinfo">
			<?php /*if ( has_nav_menu( 'primary' ) ) : ?>
				<nav class="main-navigation" role="navigation" aria-label="<?php esc_attr_e( 'Footer Primary Menu', 'twentysixteen' ); ?>">
					<?php
						wp_nav_menu( array(
							'theme_location' => 'primary',
							'menu_class'     => 'primary-menu',
						 ) );
					?>
				</nav><!-- .main-navigation -->
			<?php endif;*/ ?>

			<?php /*if ( has_nav_menu( 'social' ) ) : ?>
				<nav class="social-navigation" role="navigation" aria-label="<?php esc_attr_e( 'Footer Social Links Menu', 'twentysixteen' ); ?>">
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
			<?php endif; */?>
			<div class="footer-wrapper">
				<div class="logo" style="background-image: url(<?php echo site_url();?>/wp-content/uploads/2016/11/ultavo-logo-clean.png);"></div>
				<div class="copyrights-wrap"><h6>Copyrights &copy; 2016 - Design by <a href="https://www.invanos.com" target="_blank">INVANOS</a></h6></div>
				<div class="socials-wrap">
					<ul class="socials-ul">
						<li class="socials-li"><a href="https://www.facebook.com/profile.php?id=100089371903379" class="facebook" target="_blank"></a></li>
						<li class="socials-li"><a href="https://www.linkedin.com/in/luxury-ultavo-sounds-526505255" class="linkedin" target="_blank"><img src="https://www.ultavosounds.com/wp-content/themes/twentysixteen/images/linkedin.png"></a></li>
						<!-- <li class="socials-li"><a href="https://plus.google.com/101384320613644663377/" class="google-plus" target="_blank"></a></li> -->
						<li class="socials-li"><a href="https://www.instagram.com/ultavoofficial/" class="insta" target="_blank"></a></li>
					</ul>
				</div>
				<div class="navigation-wrap">
					<?php /* <ul class="navigation-ul">
						<li class="navigation-li"><a href="<?php echo site_url();?>"><span class="link">Home</span></a></li>
						<li class="navigation-li"><a href="<?php echo site_url();?>/index.php/about-us"><span class="link">About Us</span></a></li>
						<li class="navigation-li"><a href="<?php echo site_url();?>/index.php/catalogue-luxury-brands"><span class="link">Luxury Brands</span></a></li>
						<li class="navigation-li"><a href="<?php echo site_url();?>/index.php/services"><span class="link">Services</span></a></li>
						<li class="navigation-li"><a href="<?php echo site_url(); ?>/index.php/contact-us"><span class="link">Contact Us</span></a></li>
					</ul> */ ?>
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
				</div>
				<div class="cpt-visitors-counter-wrap" style="text-align:center;">
					<?php
						// A3_PVC::pvc_stats_update(get_the_ID());
						$totalPostCountObj = $wpdb->get_results("SELECT postcount as totalPostCount FROM wp_pvc_total where postnum like '';");
						$totalPostCount = $totalPostCountObj[0]->totalPostCount;
					?>
					<span class="counter-number">Site Visitors: <!--000000051--><?php echo sprintf("%09d", ($totalPostCount+1)); ?></span>
				</div>
				<!-- <div class="cpt-visitors-counter-wrap" style="text-align:center;">
					<script type="text/javascript" src="http://services.webestools.com/cpt_visitors/45346-1-9.js"></script>
				</div> -->
			</div>
			<script type="text/javascript">
				// jQuery(function($){
				// 	var counter = $('.cpt-visitors-counter-wrap a img');
				// 	var counterHtml = '<span class="counter-number">Number of visitors on site: ';
				// 	counter.each(function(){
				// 		counterHtml += $(this).attr('alt');
				// 	});
				// 	counterHtml += '</span>';
				// 	$('.cpt-visitors-counter-wrap').append(counterHtml);
				// });
			</script>

			<div class="site-info">
				<?php
					/**
					 * Fires before the twentysixteen footer text for footer customization.
					 *
					 * @since Twenty Sixteen 1.0
					 */
					do_action( 'twentysixteen_credits' );
				?>
				<!-- <span class="site-title"><a href="<?php //echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php// bloginfo( 'name' ); ?></a></span> -->
				<!-- <a href="<?php echo esc_url( __( 'https://wordpress.org/', 'twentysixteen' ) ); ?>"><?php printf( __( 'Proudly powered by %s', 'twentysixteen' ), 'WordPress' ); ?></a> -->
			</div><!-- .site-info -->
			<i class="gotop transit-to-block" alt="page"></i>
			<script type="text/javascript">
				//for slider on homepage
				jQuery(function($){
						$(document).ready(function(){
							if ($('body').hasClass('home')) {
								$('.n2-ss-align .n2-ss-slider').height($(window).height());
								$('.n2-ss-align .n2-ss-slider .n2-ss-slider-1').height($(window).height());
								$('.n2-ss-align .n2-ss-slider .n2-ss-slider-1 .n2-ss-slider-2 .n2-ss-slider-3 .n2-ss-slide').height($(window).height());
							}
						});
						$(window).resize(function(){
							if ($('body').hasClass('home')) {
								$('.n2-ss-align .n2-ss-slider').height($(window).height());
								$('.n2-ss-align .n2-ss-slider .n2-ss-slider-1').height($(window).height());
								$('.n2-ss-align .n2-ss-slider .n2-ss-slider-1 .n2-ss-slider-2 .n2-ss-slider-3 .n2-ss-slide').height($(window).height());
							}
					    });
				});
			</script>
		</footer><!-- .site-footer -->
	</div><!-- .site-inner -->
</div><!-- .site -->

<?php wp_footer(); ?>
</body>
</html>