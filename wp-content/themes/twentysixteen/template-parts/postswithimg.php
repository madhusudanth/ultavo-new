

		<div class="sidebar">
		<strong>Recent Posts</strong>
		<?php // wp_get_archives('type=postbypost&limit=100'); ?>
		<?php /*
			$args = array( 'numberposts' => '6' );
			$posts = wp_get_recent_posts($args) 
		?>
		<?php foreach($posts as $post) : ?>
    		<li>
		        <a href="<?php echo get_permalink($post['ID']) ?>">
		            <?php //echo get_the_post_thumbnail($post['ID'], 'thumbnail'); ?>
		            <div><?php echo $post['post_title'] ?></div>
		        </a>
		    </li>
		<?php endforeach; */ ?>
		<?php 
			$args = array( 'numberposts' => '5' );

			$recent_posts = wp_get_recent_posts($args);
			    foreach( $recent_posts as $recent ){
			        echo '<li><a href="' . get_permalink($recent["ID"]) . '">' .        $recent["post_title"].'</a> </li> ';
			if ( has_post_thumbnail() ) { // check if the post has a Post Thumbnail assigned to it.
			    the_post_thumbnail('thumbnail');
			}
			    }
		?>
	</div>