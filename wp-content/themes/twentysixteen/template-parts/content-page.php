<?php
/**
 * The template used for displaying page content
 *
 * @package WordPress
 * @subpackage Twenty_Sixteen
 * @since Twenty Sixteen 1.0
 */
?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	<?php if ( is_page(2) ) { 
		$posttitle = 'luxury-brands-image';
		$postid = $wpdb->get_var( "SELECT ID FROM $wpdb->posts WHERE post_title = '" . $posttitle . "'" );
		$getpost= get_post($postid); ?>
	<header class="entry-header" style="background-image: url('<?php echo $getpost->guid; ?>');">
	<?php } elseif ( is_page(116) ) {  
		$posttitle = 'services-cat-image';
		$postid = $wpdb->get_var( "SELECT ID FROM $wpdb->posts WHERE post_title = '" . $posttitle . "'" );
		$getpost= get_post($postid); ?>
	<header class="entry-header" style="background-image: url('<?php echo $getpost->guid; ?>');">
	<?php } else { ?>
	<header class="entry-header">
	<?php } ?>
		<?php
		global $post;
		$current_post_id = $post->ID;
		$post_custom_gener_arr = get_post_custom_values('page_gener', $current_post_id);
		$post_custom_gener = $post_custom_gener_arr[0];
		if ( is_singular( 'page' ) ) {
			if($post_custom_gener != 'catalogue') {
				the_title( '<h1 class="entry-title">', '</h1>' );
			}
		}
		?>
		<?php //the_title( '<h1 class="entry-title">', '</h1>' ); ?>
	</header><!-- .entry-header -->

	<?php twentysixteen_post_thumbnail(); ?>

	<div class="entry-content">
		<?php
		the_content();

		wp_link_pages( array(
			'before'      => '<div class="page-links"><span class="page-links-title">' . __( 'Pages:', 'twentysixteen' ) . '</span>',
			'after'       => '</div>',
			'link_before' => '<span>',
			'link_after'  => '</span>',
			'pagelink'    => '<span class="screen-reader-text">' . __( 'Page', 'twentysixteen' ) . ' </span>%',
			'separator'   => '<span class="screen-reader-text">, </span>',
		) );
		?>
	</div><!-- .entry-content -->

	<?php
		edit_post_link(
			sprintf(
				/* translators: %s: Name of current post */
				__( 'Edit<span class="screen-reader-text"> "%s"</span>', 'twentysixteen' ),
				get_the_title()
			),
			'<footer class="entry-footer"><span class="edit-link">',
			'</span></footer><!-- .entry-footer -->'
		);
	?>

</article><!-- #post-## -->
