<?php
class A3_PVC
{
	public static function upgrade_version_1_2(){
		global $wpdb;
		$sql = "ALTER TABLE ". $wpdb->prefix . "pvc_total CHANGE `postnum` `postnum` VARCHAR( 255 ) NOT NULL";
		$wpdb->query($sql);

		$sql = "ALTER TABLE ". $wpdb->prefix . "pvc_daily CHANGE `postnum` `postnum` VARCHAR( 255 ) NOT NULL";
		$wpdb->query($sql);
	}
	public static function install_database(){
		global $wpdb;
		$collate = '';
		if ( $wpdb->has_cap( 'collation' ) ) {
			if ( !empty($wpdb->charset) ) $collate = "DEFAULT CHARACTER SET $wpdb->charset";
			if ( !empty($wpdb->collate) ) $collate .= " COLLATE $wpdb->collate";
		}

		$sql = "CREATE TABLE IF NOT EXISTS ". $wpdb->prefix . "pvc_daily" ." (
         `id` mediumint(9) NOT NULL AUTO_INCREMENT,
		 `time` date DEFAULT '0000-00-00' NOT NULL,
		 `postnum` varchar(255) NOT NULL,
		 `postcount` int DEFAULT '0' NOT NULL,
		 UNIQUE KEY id (id)) $collate;";

		$wpdb->query($sql);


		$sql = "CREATE TABLE IF NOT EXISTS ". $wpdb->prefix . "pvc_total" ." (
			 `id` mediumint(9) NOT NULL AUTO_INCREMENT,
			 `postnum` varchar(255) NOT NULL,
			 `postcount` int DEFAULT '0' NOT NULL,
			 UNIQUE KEY id (id)) $collate;";

		$wpdb->query($sql);
	}

	public static function pvc_fetch_posts_stats( $post_ids ) {
		global $wpdb;
		$nowisnow = date('Y-m-d');

		if ( !is_array( $post_ids ) ) $post_ids = array( $post_ids );

		$sql = $wpdb->prepare( "SELECT t.postnum AS post_id, t.postcount AS total, d.postcount AS today FROM ". $wpdb->prefix . "pvc_total AS t
			LEFT JOIN ". $wpdb->prefix . "pvc_daily AS d ON t.postnum = d.postnum
			WHERE t.postnum IN ( ".implode( ',', $post_ids )." ) AND d.time = %s", $nowisnow );
		return $wpdb->get_results($sql);
	}

	public static function pvc_fetch_post_counts( $post_id ) {
		global $wpdb;
		$nowisnow = date('Y-m-d');

		$sql = $wpdb->prepare( "SELECT t.postcount AS total, d.postcount AS today FROM ". $wpdb->prefix . "pvc_total AS t
			LEFT JOIN ". $wpdb->prefix . "pvc_daily AS d ON t.postnum = d.postnum
			WHERE t.postnum = %s AND d.time = %s", $post_id, $nowisnow );
		return $wpdb->get_row($sql);
	}

	public static function pvc_fetch_post_total( $post_id ) {
		global $wpdb;

		$sql = $wpdb->prepare( "SELECT t.postcount AS total FROM ". $wpdb->prefix . "pvc_total AS t
			WHERE t.postnum = %s", $post_id );
		return $wpdb->get_var($sql);
	}

	public static function pvc_stats_update($post_id) {
		global $wpdb;

		// get the local time based off WordPress setting
		$nowisnow = date('Y-m-d');

		// first try and update the existing total post counter
		$results = $wpdb->query( $wpdb->prepare( "UPDATE ". $wpdb->prefix . "pvc_total SET postcount = postcount+1 WHERE postnum = '%s' LIMIT 1", $post_id ) );

		// if it doesn't exist, then insert two new records
		// one in the total views, another in today's views
		if ($results == 0) {
			$wpdb->query( $wpdb->prepare( "INSERT INTO ". $wpdb->prefix . "pvc_total (postnum, postcount) VALUES ('%s', 1)", $post_id ) );
			$wpdb->query( $wpdb->prepare ( "INSERT INTO ". $wpdb->prefix . "pvc_daily (time, postnum, postcount) VALUES ('%s', '%s', 1)", $nowisnow, $post_id ) );
		// post exists so let's just update the counter
		} else {
			// $results2 = $wpdb->query( $wpdb->prepare ( "UPDATE ". $wpdb->prefix . "pvc_daily SET postcount = postcount+1 WHERE time = '%s' AND postnum = '%s' LIMIT 1", $nowisnow, $post_id ) );
			// // insert a new record since one hasn't been created for current day
			// if ($results2 == 0)
			// 	$wpdb->query( $wpdb->prepare( "INSERT INTO ". $wpdb->prefix . "pvc_daily (time, postnum, postcount) VALUES ('%s', '%s', 1)", $nowisnow, $post_id ) );
		}

		// get all the post view info so we can update meta fields
		//$row = A3_PVC::pvc_fetch_post_counts( $post_id );
	}

	public static function pvc_stats_manual_update( $post_id, $new_total_views, $new_today_views ) {
		global $wpdb;

		// get the local time based off WordPress setting
		$nowisnow = date('Y-m-d');

		// if it doesn't exist, then insert new record
		// one in the total views
		if ( '1' != $wpdb->get_var( $wpdb->prepare( "SELECT EXISTS( SELECT 1 FROM ". $wpdb->prefix . "pvc_total WHERE postnum = %s LIMIT 0, 1 )", $post_id ) ) ) {
			$wpdb->query( $wpdb->prepare( "INSERT INTO ". $wpdb->prefix . "pvc_total ( postnum, postcount ) VALUES ( %s, %d )", $post_id, $new_total_views ) );
		// post exists so let's just update the counter
		} else {
			$wpdb->query( $wpdb->prepare( "UPDATE ". $wpdb->prefix . "pvc_total SET postcount = %d WHERE postnum = %s LIMIT 1", $new_total_views, $post_id ) );
		}

		// if it doesn't exist, then insert new record
		// one in today's views
		if ( '1' != $wpdb->get_var( $wpdb->prepare( "SELECT EXISTS( SELECT 1 FROM ". $wpdb->prefix . "pvc_daily WHERE time = %s AND postnum = %s LIMIT 0, 1 )", $nowisnow, $post_id ) ) ) {
			$wpdb->query( $wpdb->prepare ( "INSERT INTO ". $wpdb->prefix . "pvc_daily ( time, postnum, postcount ) VALUES ( %s, %s, %d )", $nowisnow, $post_id, $new_today_views ) );
		// post exists so let's just update the counter
		} else {
			$wpdb->query( $wpdb->prepare ( "UPDATE ". $wpdb->prefix . "pvc_daily SET postcount = %d WHERE time = %s AND postnum = %s LIMIT 1", $new_today_views, $nowisnow, $post_id ) );
		}
	}

	public static function pvc_get_stats($post_id) {
		global $wpdb;

		$output_html = '';
		// get all the post view info to display
		$results = A3_PVC::pvc_fetch_post_counts( $post_id );
		// get the stats and
		if ( $results ){
			$output_html .= number_format( $results->total ) . '&nbsp;' .__('total views', 'page-views-count') . ', ' . number_format( $results->today ) . '&nbsp;' .__('views today', 'page-views-count');
		} else {
			$total = A3_PVC::pvc_fetch_post_total( $post_id );
			if ( $total > 0 ) {
				$output_html .= number_format( $total ) . '&nbsp;' .__('total views', 'page-views-count') . ', ' .__('no views today', 'page-views-count');
			} else {
				$output_html .=  __('No views yet', 'page-views-count');
			}
		}
		$output_html = apply_filters( 'pvc_filter_get_stats', $output_html, $post_id );

		return $output_html;
	}

	// get the total page views and daily page views for the post
	public static function pvc_stats_counter( $post_id, $increase_views = false ) {
		global $wpdb;
		global $pvc_settings;

		$load_by_ajax_update_class = '';
		if ( $increase_views ) $load_by_ajax_update_class = 'pvc_load_by_ajax_update';

		// get the stats and
		$html = '<div class="pvc_clear"></div>';

		if ( $pvc_settings['enable_ajax_load'] == 'yes' ) {
			$stats_html = '<p id="pvc_stats_'.$post_id.'" class="pvc_stats '.$load_by_ajax_update_class.'" element-id="'.$post_id.'"><img src="'.A3_PVC_URL.'/ajax-loader.gif" border=0 /></p>';
		} else {
			$stats_html = '<p class="pvc_stats" element-id="'.$post_id.'">' . A3_PVC::pvc_get_stats( $post_id ) . '</p>';
		}

		$html .= apply_filters( 'pvc_filter_stats', $stats_html, $post_id );
		$html .= '<div class="pvc_clear"></div>';
		return $html;
	}

	public static function pvc_backbone_load_stats() {
		$post_ids	= $_REQUEST['post_ids'];

		$data = array();
		$ids = array();
		if ( is_array( $post_ids ) && count( $post_ids ) > 0 ) {
			foreach ( $post_ids as $post_id => $post_data ) {
				$ids[] = $post_id;
				if ( isset( $post_data['ask_update'] ) && $post_data['ask_update'] == 'true' ) {
					A3_PVC::pvc_stats_update( $post_id );
				}
			}
			$results = A3_PVC::pvc_fetch_posts_stats( $ids );
			if ( $results ) {
				foreach( $results as $result ) {
					$data[$result->post_id] = array (
						'post_id'		=> (int) $result->post_id,
						'total_view' 	=> (int) $result->total,
						'today_view' 	=> (int) $result->today
					);
					$ids = array_diff( $ids, array( $result->post_id ) );
				}
			}

			foreach ( $ids as $post_id ) {
				$total = A3_PVC::pvc_fetch_post_total( $post_id );
				$data[$post_id] = array (
					'post_id'		=> (int) $post_id,
					'total_view' 	=> (int) $total,
					'today_view' 	=> 0
				);
			}
		}
		header( 'Content-Type: application/json', true, 200 );
		die( json_encode( $data ) );
	}

	public static function register_plugin_scripts() {
		global $pvc_settings;

		$suffix = defined('SCRIPT_DEBUG') && SCRIPT_DEBUG ? '' : '.min';

		wp_enqueue_style( 'a3-pvc-style', A3_PVC_CSS_URL . '/style'.$suffix.'.css', false, A3_PVC_VERSION );

		if ( $pvc_settings['enable_ajax_load'] != 'yes' ) return;

	?>
    <!-- PVC Template -->
    <script type="text/template" id="pvc-stats-view-template">
	<% if ( total_view > 0 ) { %>
		<%= total_view %> <%= total_view > 1 ? "<?php _e('total views', 'page-views-count'); ?>" : "<?php _e('total view', 'page-views-count'); ?>" %>,
		<% if ( today_view > 0 ) { %>
			<%= today_view %> <%= today_view > 1 ? "<?php _e('views today', 'page-views-count'); ?>" : "<?php _e('view today', 'page-views-count'); ?>" %>
		<% } else { %>
		<?php _e('no views today', 'page-views-count'); ?>
		<% } %>
	<% } else { %>
	<?php _e('No views yet', 'page-views-count'); ?>
	<% } %>
	</script>
    <?php
		wp_enqueue_script( 'a3-pvc-backbone', A3_PVC_JS_URL . '/pvc.backbone'.$suffix.'.js', array( 'jquery', 'backbone', 'underscore' ), A3_PVC_VERSION );
		wp_localize_script( 'a3-pvc-backbone', 'vars', array( 'api_url' => admin_url( 'admin-ajax.php' ) ) );
	}

	public static function fixed_wordpress_seo_plugin( $ogdesc = '' ) {
		if ( function_exists( 'wpseo_set_value' ) ) {
			global $post;
			$postid = $post->ID;
			wpseo_set_value( 'opengraph-description', $ogdesc, $postid );
		}
		return $ogdesc;
	}

	public static function pvc_remove_stats($content) {
		remove_action('the_content', array('A3_PVC','pvc_stats_show'));
		return $content;
	}

	public static function pvc_stats_show($content){
		remove_action('loop_end', array('A3_PVC', 'pvc_stats_echo'));
		remove_action('genesis_after_post_content', array('A3_PVC', 'genesis_pvc_stats_echo'));
		global $post;
		if ( ! $post ) return;

		$args=array(
			  'public'   => true,
			  '_builtin' => false
			);
		$output = 'names'; // names or objects, note names is the default
		$operator = 'and'; // 'and' or 'or'
		$post_types = get_post_types($args, $output, $operator );

		global $pvc_settings;
		if ( empty( $pvc_settings ) ) {
			$pvc_settings = get_option('pvc_settings', array() );
		}

		if ( self::pvc_is_activated( $post->ID ) ) {
			if ( is_singular() || is_singular( $post_types ) ) {
				if ( ! isset( $pvc_settings['enable_ajax_load'] ) || $pvc_settings['enable_ajax_load'] != 'yes' ) {
					A3_PVC::pvc_stats_update($post->ID);
				}
				$content .= A3_PVC::pvc_stats_counter($post->ID, true );
			} else {
				$content .= A3_PVC::pvc_stats_counter($post->ID);
			}
		}
		return $content;
	}

	public static function excerpt_pvc_stats_show($excerpt){
		remove_action('loop_end', array('A3_PVC', 'pvc_stats_echo'));
		remove_action('genesis_after_post_content', array('A3_PVC', 'genesis_pvc_stats_echo'));
		global $post;
		if ( ! $post ) return;
		global $pvc_settings;
		if ( empty( $pvc_settings ) ) {
			$pvc_settings = get_option('pvc_settings', array() );
		}
		if ( self::pvc_is_activated( $post->ID ) && 'no' != $pvc_settings['show_on_excerpt_content'] ) {
			$excerpt .= A3_PVC::pvc_stats_counter($post->ID);
		}
		return $excerpt;
	}

	public static function pvc_stats_echo(){
		global $post;
		global $pvc_settings;
		if ( empty( $pvc_settings ) ) {
			$pvc_settings = get_option('pvc_settings', array() );
		}
		if ( self::pvc_is_activated( $post->ID ) && 'no' != $pvc_settings['show_on_excerpt_content'] ) {
			echo A3_PVC::pvc_stats_counter($post->ID);
		}
	}

	public static function genesis_pvc_stats_echo(){
		remove_action('loop_end', array('A3_PVC', 'pvc_stats_echo'));
		global $post;
		global $pvc_settings;
		if ( empty( $pvc_settings ) ) {
			$pvc_settings = get_option('pvc_settings', array() );
		}
		if ( self::pvc_is_activated( $post->ID ) && 'no' != $pvc_settings['show_on_excerpt_content'] ) {
			echo A3_PVC::pvc_stats_counter($post->ID);
		}
	}

	public static function custom_stats_echo($postid=0, $have_echo = 1){
		if($have_echo == 1)
			echo A3_PVC::pvc_stats_counter($postid);
		else
			return A3_PVC::pvc_stats_counter($postid);
	}

	public static function custom_stats_update_echo($postid=0, $have_echo=1){
		$output = '';
		global $pvc_settings;
		if ( empty( $pvc_settings ) ) {
			$pvc_settings = get_option('pvc_settings', array() );
		}
		if ( ! isset( $pvc_settings['enable_ajax_load'] ) || $pvc_settings['enable_ajax_load'] != 'yes' ) {
			A3_PVC::pvc_stats_update($postid);
		}

		$output .= A3_PVC::pvc_stats_counter($postid, true );

		if ( $have_echo == 1 )
			echo $output;
		else
			return $output;
	}

	public static function pvc_is_activated( $post_id = 0 ) {
		if ( 0 == $post_id || '' == trim( $post_id ) ) {
			global $post;
			if ( $post ) {
				$post_id = $post->ID;
			} else {
				return false;
			}
		}

		global $pvc_settings;
		if ( empty( $pvc_settings ) ) {
			$pvc_settings = get_option( 'pvc_settings', array() );
		}

		// Don't show counter on homepage, frontpage, archive page if admin deactivate for excerpt
		if( 'no' == $pvc_settings['show_on_excerpt_content'] && ( is_home() || is_front_page() || is_archive() || is_tax() ) ) {
			return false;
		}

		$is_acticvated = self::pvc_admin_is_activated( $post_id );

		return $is_acticvated;
	}

	public static function pvc_admin_is_activated( $post_id = 0 ) {
		if ( $post_id < 0 ) {
			return false;
		}

		$post_type = get_post_type( $post_id );
		if ( false == $post_type ) {
			return false;
		}

		$is_activated = get_post_meta( $post_id, '_a3_pvc_activated', true );
		if ( empty( $is_activated ) ) {
			global $pvc_settings;
			if ( empty( $pvc_settings ) ) {
				$pvc_settings = get_option( 'pvc_settings', array() );
			}
			if ( isset( $pvc_settings['post_types'] ) && in_array( $post_type, (array) $pvc_settings['post_types'] ) ) {
				return true;
			} else {
				return false;
			}
		} else {
			if ( 'true' == $is_activated ) {
				return true;
			} else {
				return false;
			}
		}

		return false;
	}

	public static function pvc_reset_individual_items() {
		global $wpdb;
		$wpdb->query( "DELETE FROM ".$wpdb->postmeta." WHERE meta_key='_a3_pvc_activated' " );
	}

	public static function a3_wp_admin() {
		wp_enqueue_style( 'a3rev-wp-admin-style', A3_PVC_CSS_URL . '/a3_wp_admin.css' );
	}

	public static function plugin_extension_box( $boxes = array() ) {
		$support_box = '<a href="https://wordpress.org/support/plugin/page-views-count" target="_blank" alt="'.__('Go to Support Forum', 'page-views-count').'"><img src="'.A3_PVC_IMAGES_URL.'/go-to-support-forum.png" /></a>';
		$boxes[] = array(
			'content' => $support_box,
			'css' => 'border: none; padding: 0; background: none;'
		);

		$first_box = '<a href="https://profiles.wordpress.org/a3rev/#content-plugins" target="_blank" alt="'.__('Free WordPress Plugins', 'page-views-count').'"><img src="'.A3_PVC_IMAGES_URL.'/free-wordpress-plugins.png" /></a>';

		$boxes[] = array(
			'content' => $first_box,
			'css' => 'border: none; padding: 0; background: none;'
		);

		$second_box = '<a href="https://profiles.wordpress.org/a3rev/#content-plugins" target="_blank" alt="'.__('Free WooCommerce Plugins', 'page-views-count').'"><img src="'.A3_PVC_IMAGES_URL.'/free-woocommerce-plugins.png" /></a>';

		$boxes[] = array(
			'content' => $second_box,
			'css' => 'border: none; padding: 0; background: none;'
		);

        $third_box = '<div style="margin-bottom: 5px; font-size: 12px;"><strong>' . __('Is this plugin is just what you needed? If so', 'page-views-count') . '</strong></div>';
        $third_box .= '<a href="https://wordpress.org/support/view/plugin-reviews/page-views-count#postform" target="_blank" alt="'.__('Submit Review for Plugin on WordPress', 'page-views-count').'"><img src="'.A3_PVC_IMAGES_URL.'/a-5-star-rating-would-be-appreciated.png" /></a>';

        $boxes[] = array(
            'content' => $third_box,
            'css' => 'border: none; padding: 0; background: none;'
        );

        $four_box = '<div style="margin-bottom: 5px;">' . __('Connect with us via','page-views-count') . '</div>';
		$four_box .= '<a href="https://www.facebook.com/a3rev" target="_blank" alt="'.__('a3rev Facebook', 'page-views-count').'" style="margin-right: 5px;"><img src="'.A3_PVC_IMAGES_URL.'/follow-facebook.png" /></a> ';
		$four_box .= '<a href="https://twitter.com/a3rev" target="_blank" alt="'.__('a3rev Twitter', 'page-views-count').'"><img src="'.A3_PVC_IMAGES_URL.'/follow-twitter.png" /></a>';

		$boxes[] = array(
			'content' => $four_box,
			'css' => 'border-color: #3a5795;'
		);

		return $boxes;
	}

	public static function settings_plugin_links($actions) {
		$actions = array_merge( array( 'settings' => '<a href="options-general.php?page=a3-pvc">' . __( 'Settings', 'page-views-count' ) . '</a>' ), $actions );

		return $actions;
	}

	public static function plugin_extra_links($links, $plugin_name) {
		if ( $plugin_name != A3_PVC_PLUGIN_NAME) {
			return $links;
		}
		$links[] = '<a href="http://docs.a3rev.com/user-guides/page-view-count/" target="_blank">'.__('Documentation', 'page-views-count').'</a>';
		$links[] = '<a href="http://wordpress.org/support/plugin/page-views-count/" target="_blank">'.__('Support', 'page-views-count').'</a>';
		return $links;
	}
}
?>