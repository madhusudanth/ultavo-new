<?php
/**
 * The template part for displaying single posts
 *
 * @package WordPress
 * @subpackage Twenty_Sixteen
 * @since Twenty Sixteen 1.0
 */
?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	<header class="entry-header">
	</header><!-- .entry-header -->

	<?php twentysixteen_excerpt(); ?>

	<div class="sidebar">
		<strong>Recent Posts</strong>
		<ul class="sidebar-wrap">
		<?php 
			$args = array( 'numberposts' => '5' );

			$recent_posts = wp_get_recent_posts($args);
			    foreach( $recent_posts as $recent ){
			        echo '<li><a href="' . get_permalink($recent["ID"]) . '">' .        $recent["post_title"].'</a>';
			        $image = wp_get_attachment_image_src( get_post_thumbnail_id($recent["ID"]), 'medium' );
			        if($image){
			        	echo '<img src="'.$image[0].'" >';
			        }
			        echo "</li>";			
			    }
		?>
		</ul>
	</div>
	<div class="entry-content <?php if(wp_get_attachment_image_src( get_post_thumbnail_id(the_ID()), 'medium' ) == '' ){ echo ' no-image';}?>">
		<div class="firsthalf">
			<?php twentysixteen_post_thumbnail(); ?>
			<div class="text-content">
				<?php twentysixteen_entry_meta();?>
				<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>
				<?php get_template_part( 'template-parts/biography' ); ?>
			</div>
		</div>
		<div class="secondhalf">
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

				// get_template_part( 'template-parts/biography' );
				// twentysixteen_entry_meta();
				edit_post_link(
					sprintf(
						/* translators: %s: Name of current post */
						__( 'Edit<span class="screen-reader-text"> "%s"</span>', 'twentysixteen' ),
						get_the_title()
					),
					'<span class="edit-link">',
					'</span>'
				);
			if ( '' !== get_the_author_meta( 'description' ) ) {
			}
		?>
		</div>
	</div><!-- .entry-content -->

	<footer class="entry-footer">
	</footer><!-- .entry-footer -->
</article><!-- #post-## -->
