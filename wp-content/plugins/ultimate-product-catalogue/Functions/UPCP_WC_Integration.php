<?php
$WooCommerce_Sync = get_option("UPCP_WooCommerce_Sync");
if ($WooCommerce_Sync == "Yes") {
	add_action("woocommerce_cart_emptied", "UPCP_AJAX_Clear_Cart");
}


function UPCP_Initial_WC_Sync() {
	UPCP_Import_WC_Categories_And_Tags();
	UPCP_Add_Categories_And_Tags_To_WC();
	UPCP_Import_WC_Products();
	UPCP_Add_Products_To_WC();
}

function UPCP_Import_WC_Categories_And_Tags() {
	global $wpdb;
	global $categories_table_name;
	global $subcategories_table_name;
	global $tags_table_name;

	$WC_Categories = get_terms('product_cat', array('hide_empty' => false));
    if ($WC_Categories) {
        foreach ($WC_Categories as $Category) {
            if ($Category->parent == 0) {
            	UPCP_Import_WC_Category($Category);
            }
        }
    }

    if ($WC_Categories) {
        foreach ($WC_Categories as $Category) {
            if ($Category->parent != 0) {
            	UPCP_Import_WC_SubCategory($Category);
            }
        }
    }

    $WC_Tags = get_terms('product_tag', array('hide_empty' => false));
    if ($WC_Tags) {
        foreach ($WC_Tags as $Tag) {
            UPCP_Import_WC_Tag($Tag);
        }
    }
}

function UPCP_Add_Categories_And_Tags_To_WC() {
	global $wpdb;
	global $categories_table_name;
	global $subcategories_table_name;
	global $tags_table_name;

	$UPCP_Categories = $wpdb->get_results("SELECT * FROM $categories_table_name");
    if ($UPCP_Categories) {
        foreach ($UPCP_Categories as $Category) {
           	UPCP_Add_Category_To_WC($Category);
        }
    }

    $UPCP_SubCategories = $wpdb->get_results("SELECT * FROM $subcategories_table_name");
    if ($UPCP_SubCategories) {
        foreach ($UPCP_SubCategories as $SubCategory) {
            	UPCP_Add_SubCategory_To_WC($SubCategory);
        }
    }

    $UPCP_Tags = $wpdb->get_results("SELECT * FROM $tags_table_name");
    if ($UPCP_Tags) {
        foreach ($UPCP_Tags as $Tag) {
            UPCP_Add_Tag_To_WC($Tag);
        }
    }
}

function UPCP_Import_WC_Products() {
	global $wpdb;
	global $items_table_name;

	$WC_Products = $wpdb->get_results("SELECT * FROM $wpdb->posts WHERE post_type='product' AND (post_status='publish' OR post_status='draft')");

	if (sizeOf($WC_Products) > 0) {
		foreach ($WC_Products as $Product) {
			UPCP_Create_Product_From_WC($Product);
		}
	}
}

function UPCP_Add_Products_To_WC() {
	global $wpdb;
	global $items_table_name;

	$Products = $wpdb->get_results("SELECT * FROM $items_table_name WHERE Item_WC_ID=0");
	if (sizeOf($Products) > 0) {
		foreach ($Products as $Product) {
			UPCP_Create_Linked_WC_Product($Product);
		}
	}
}

add_action('transition_post_status', 'UPCP_Add_Product_From_WC', 10, 3);
function UPCP_Add_Product_From_WC($new_status, $old_status, $post) {
	global $wpdb;
	global $items_table_name;

	if ($new_status == 'publish' and !empty($post->ID) and $post->post_type == "product" and get_option("UPCP_Product_Import") == "None") {
		update_option("UPCP_Product_Import", "WC");
		UPCP_Create_Product_From_WC($post);
	}
}

add_action( 'save_post', 'UPCP_Update_WC_Imported_Product' );
function UPCP_Update_WC_Imported_Product($post_id) {
	global $wpdb;

	// If this is an autosave, our form has not been submitted, so we don't want to do anything.
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}

	// Check the user's permissions.
	if ( isset( $_POST['post_type'] ) && 'product' == $_POST['post_type'] ) {

		if ( ! current_user_can( 'edit_page', $post_id ) ) {
			return;
		}

	} else {

		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return;
		}
	}

	if (get_option("UPCP_Product_Import") == "None" or get_option("UPCP_Product_Import") == "WC") {
		$WC_Product = $wpdb->get_row($wpdb->prepare("SELECT * FROM $wpdb->posts WHERE ID=%d", $post_id));
		update_option("UPCP_Product_Import", "WC");
		UPCP_Create_Product_From_WC($WC_Product, "Yes");
	}
}

add_action("edited_product_cat", "UPCP_Edit_WC_Imported_Category", 10, 1);
function UPCP_Edit_WC_Imported_Category($term_id) {
	$Category = get_term_by("id", $term_id, "product_cat");
	if ($Category->parent == 0) {UPCP_Import_WC_Category($Category, "Yes");}
	else {UPCP_Import_WC_SubCategory($Category, "Yes");}
}

add_action("edited_product_tag", "UPCP_Edit_WC_Imported_Tag", 10, 1);
function UPCP_Edit_WC_Imported_Tag($term_id) {
	$Tag = get_term_by("id", $term_id, "product_tag");
	UPCP_Import_WC_Tag($Tag, "Yes");
}

function UPCP_Import_WC_Category($Category, $Update = "No") {
	global $wpdb;
	global $categories_table_name;

	$Category_Name = $Category->name;
    $Category_Description = $Category->description;
    $Category_Short_Description = $Category->short_description;
    $Category_Type = $Category->type;
    $Category_Brand_Link = $Category->brand_link;
    $Category_Image = get_term_meta($Category->term_id, "thumbnail_id", true);
    $Category_Logo = get_term_meta($Category->term_id."logo", "logo_thumbnail_id", true);
    $Category_White_Logo = get_term_meta($Category->term_id."logo", "logo_thumbnail_id", true);

    $Category_ID = $wpdb->get_var($wpdb->prepare("SELECT Category_ID FROM $categories_table_name WHERE Category_WC_ID=%s", $Category->term_id));
    $WC_Update = "Yes";
    if ($Category_ID == "") {Add_UPCP_Category($Category_Name, $Category_Description, $Category_Short_Description, $Category_Type, $Category_Brand_Link, $Category_Image, $Category_Logo, $Category_White_Logo, $WC_Update, $Category->term_id);}
    elseif ($Update == "Yes") {Edit_UPCP_Category($Category_ID, $Category_Name, $Category_Description, $Category_Short_Description, $Category_Type, $Category_Brand_Link, $Category_Image, $Category_Logo, $Category_White_Logo, $WC_Update, $Category->term_id);}
}

function UPCP_Import_WC_SubCategory($Category, $Update = "No") {
	global $wpdb;
	global $categories_table_name;
	global $subcategories_table_name;

	$WC_Parent_Category = get_term_by("id", $Category->parent, "product_cat");

    if ($WC_Parent_Category) {
    	$Category_ID = $wpdb->get_var($wpdb->prepare("SELECT Category_ID FROM $categories_table_name WHERE Category_WC_ID=%s", $WC_Parent_Category->term_id));

    	if ($Category_ID != "") {
    		$SubCategory_Name = $Category->name;
    		$SubCategory_Description = $Category->description;
    		$SubCategory_Image = get_term_meta($Category->term_id, "thumbnail_id", true);
		
	   		$SubCategory_ID = $wpdb->get_var($wpdb->prepare("SELECT SubCategory_ID FROM $subcategories_table_name WHERE SubCategory_WC_ID=%s", $Category->term_id));
    		$WC_Update = "Yes";
    		if ($SubCategory_ID == "") {Add_UPCP_SubCategory($SubCategory_Name, $Category_ID, $SubCategory_Description, $SubCategory_Image, $WC_Update, $Category->term_id);}
    		elseif ($Update == "Yes") {Edit_UPCP_SubCategory($SubCategory_ID, $SubCategory_Name, $Category_ID, $SubCategory_Description, $SubCategory_Image, $WC_Update, $Category->term_id);}
    	}
    }
}

function UPCP_Import_WC_Tag($Tag, $Update = "No") {
	global $wpdb;
	global $tags_table_name;

	$Tag_Name = $Tag->name;
    $Tag_Description = $Tag->description;

    $Tag_ID = $wpdb->get_var($wpdb->prepare("SELECT Tag_ID FROM $tags_table_name WHERE Tag_WC_ID=%s", $Tag->term_id));
    $WC_Update = "Yes";
    $Tag_Group = 0;
    if ($Tag_ID == "") {Add_UPCP_Tag($Tag_Name, $Tag_Description, $Tag_Group, $WC_Update, $Tag->term_id);}
    elseif ($Update == "Yes") {Edit_UPCP_Tag($Tag_ID, $Tag_Name, $Tag_Description, $Tag_Group, $WC_Update, $Tag->term_id);}
}

function UPCP_Add_Category_To_WC($Category) {
	global $wpdb;
	global $categories_table_name;

	$WC_Category = get_term_by("id", $Category->Category_WC_ID, "product_cat");
    if (!$WC_Category or $WC_Category->parent != 0) {
    	$args = array('description' => $Category->Category_Description, 'short_description' => $Category->Category_Short_Description, 'type' => $Category->Category_Type);
    	$Return_Array = wp_insert_term($Category->Category_Name, 'product_cat', $args);

    	if (is_array($Return_Array) and isset($Return_Array['term_id']) and is_numeric($Return_Array['term_id'])) {
    		update_term_meta($Return_Array['term_id'], "thumbnail_id", $Category->Category_Image);
    		update_term_meta($Return_Array['term_id']."logo", "logo_thumbnail_id", $Category->Category_Logo);
    		update_term_meta($Return_Array['term_id']."logo", "logo_thumbnail_id", $Category->Category_White_Logo);
    		update_term_meta($Return_Array['term_id'], "upcp_equivalent", "Category");
    		update_term_meta($Return_Array['term_id'], "upcp_ID", $Category->Category_ID);
    		$wpdb->query($wpdb->prepare("UPDATE $categories_table_name SET Category_WC_ID=%d WHERE Category_ID=%d", $Return_Array['term_id'], $Category->Category_ID));
    	}
    }
}

function UPCP_Edit_Category_To_WC($Category) {
	$WC_Category = get_term_by("id", $Category->Category_WC_ID, "product_cat");
    if ($WC_Category and $WC_Category->parent == 0) {
    	$args = array('name' => $Category->Category_Name, 'description' => $Category->Category_Description, 'short_description' => $Category->Category_Short_Description, 'type' => $Category->Category_Type);
    	$Return_Array = wp_update_term($WC_Category->term_id, 'product_cat', $args);

    	if (is_array($Return_Array) and isset($Return_Array['term_id']) and is_numeric($Return_Array['term_id'])) {
    		update_term_meta($Return_Array['term_id'], "thumbnail_id", $Category->Category_Image);
    		update_term_meta($Return_Array['term_id']."logo", "logo_thumbnail_id", $Category->Category_Logo);
    		update_term_meta($Return_Array['term_id']."logo", "logo_thumbnail_id", $Category->Category_White_Logo);
    	}
    }
}

function UPCP_Add_SubCategory_To_WC($SubCategory) {
	global $wpdb;
	global $categories_table_name;
	global $subcategories_table_name;

	$WC_SubCategory = get_term_by("id", $SubCategory->SubCategory_WC_ID, "product_cat");

    if (!$WC_SubCategory or $WC_SubCategory->parent == 0) {
	   	$UPCP_Parent_WC_ID = $wpdb->get_var($wpdb->prepare("SELECT Category_WC_ID FROM $categories_table_name WHERE Category_ID=%d", $SubCategory->Category_ID));
	   	$WC_Parent_Category = get_term_by("id", $UPCP_Parent_WC_ID, "product_cat");
	
	    if ($WC_Parent_Category) {
	    	$args = array('description' => $SubCategory->SubCategory_Description, 'parent' => $WC_Parent_Category->term_id);
	    	$Return_Array = wp_insert_term($SubCategory->SubCategory_Name, 'product_cat', $args);
	
	    	if (is_array($Return_Array) and isset($Return_Array['term_id']) and is_numeric($Return_Array['term_id'])) {
	    		update_term_meta($Return_Array['term_id'], "thumbnail_id", $SubCategory->SubCategory_Image);
	    		update_term_meta($Return_Array['term_id'], "upcp_equivalent", "SubCategory");
    			update_term_meta($Return_Array['term_id'], "upcp_ID", $SubCategory->SubCategory_ID);
    			$wpdb->query($wpdb->prepare("UPDATE $subcategories_table_name SET SubCategory_WC_ID=%d WHERE SubCategory_ID=%d", $Return_Array['term_id'], $SubCategory->SubCategory_ID));
	    	}
	    }
    }
}

function UPCP_Edit_SubCategory_To_WC($SubCategory) {
	global $wpdb;
	global $categories_table_name;

	$WC_SubCategory = get_term_by("id", $SubCategory->SubCategory_WC_ID, "product_cat");

    if ($WC_SubCategory and $WC_SubCategory->parent != 0) {
	   	$UPCP_Parent_WC_ID = $wpdb->get_var($wpdb->prepare("SELECT Category_WC_ID FROM $categories_table_name WHERE Category_ID=%d", $SubCategory->Category_ID));
	   	$WC_Parent_Category = get_term_by("id", $UPCP_Parent_WC_ID, "product_cat");
		
	    if ($WC_Parent_Category) {
	    	$args = array('name' => $SubCategory->SubCategory_Name, 'description' => $SubCategory->SubCategory_Description, 'parent' => $WC_Parent_Category->term_id);
	    	$Return_Array = wp_update_term($WC_SubCategory->term_id, 'product_cat', $args);
		
	    	if (is_array($Return_Array) and isset($Return_Array['term_id']) and is_numeric($Return_Array['term_id'])) {
	    		update_term_meta($Return_Array['term_id'], "thumbnail_id", $SubCategory->SubCategory_Image);
	    	}
	    }
    }
}



function UPCP_Add_Tag_To_WC($Tag) {
	global $wpdb;
	global $tags_table_name;

	$WC_Tag = get_term_by("id", $Tag->Tag_WC_ID, "product_tag");

    if (!$WC_Tag) {
    	$args = array('description' => $Tag->Tag_Description);
    	$Return_Array = wp_insert_term($Tag->Tag_Name, 'product_tag', $args);

    	if (is_array($Return_Array) and isset($Return_Array['term_id']) and is_numeric($Return_Array['term_id'])) {
    		update_term_meta($Return_Array['term_id'], "upcp_equivalent", "Tag");
    		update_term_meta($Return_Array['term_id'], "upcp_ID", $Tag->Tag_ID);
    		$wpdb->query($wpdb->prepare("UPDATE $tags_table_name SET Tag_WC_ID=%d WHERE Tag_ID=%d", $Return_Array['term_id'], $Tag->Tag_ID));
    	}
    }
}

function UPCP_Edit_Tag_To_WC($Tag) {
	$WC_Tag = get_term_by("id", $Tag->Tag_WC_ID, "product_tag");

    if ($WC_Tag) {
    	$args = array('name' => $Tag->Tag_Name, 'description' => $Tag->Tag_Description);
    	$Return_Array = wp_update_term($WC_Tag->term_id, 'product_tag', $args);
    }
}


function UPCP_Create_Product_From_WC($Product, $Update = "No") {
	global $wpdb;
	global $items_table_name;

	$Item_ID = $wpdb->get_var($wpdb->prepare("SELECT Item_ID FROM $items_table_name WHERE Item_WC_ID=%d", $Product->ID));
	if ($Item_ID != "" and $Update == "No") {return;}
	elseif ($Item_ID == "" and $Update == "Yes") {return;}
	
	$Item_Link = "";
	$Item_SEO_Description = "";

	$WC_ID = $Product->ID;
	$Item_Slug = $Product->post_name;
	$Item_Name = $Product->post_title;
	$Item_Description = $Product->post_content;
	$Item_Price = get_post_meta($Product->ID, "_regular_price", true);
	$Item_Sale_Price = get_post_meta($Product->ID, "_sale_price", true);
	$Item_Date_Created = min($Product->post_date, date("Y-m-d H:i:s"));

	$Item_Photo_URL = wp_get_attachment_url(get_post_thumbnail_id($Product->ID));

	if (get_post_meta($Product->ID, "_price", true) == $Item_Sale_Price) {$Item_Sale_Mode = "Yes";}
	else {$Item_Sale_Mode = "No";}

	if ($Product->post_status == "publish") {$Item_Display_Status = "Show";}
	else {$Item_Display_Status = "Hide";}

	$Category_Name = "";
	$Category_ID = 0;
	$SubCategory_Name = "";
	$SubCategory_ID = 0;

	$Categories = wp_get_post_terms($Product->ID, "product_cat");
update_option("UPCP_WC_Debugging", "Updating Product");
	foreach ($Categories as $Category) {update_option("UPCP_WC_Debugging", "Category");
		if ($Category->parent == 0) {update_option("UPCP_WC_Debugging", "No Parent Category");
			 $Category_Name = $Category->name; update_option("UPCP_WC_Debugging", "Name: " . $Category->name);
			 $Category_ID = get_term_meta( $Category->term_id, "upcp_ID", true); update_option("UPCP_WC_Debugging", "ID: " . get_term_meta( $Category->term_id, "upcp_ID", true));
			 $Category_Term_ID = $Category->term_id;
			 break;
		}
	}

	if ($Category_Name != "") {
		foreach ($Categories as $Category) {
			if ($Category->parent == $Category_Term_ID) {
				 $SubCategory_ID = get_term_meta( $Category->term_id, "upcp_ID", true);
				 $SubCategory_Name = $Category->name;
				 break;
			}
		}
	}

	$WC_Tags = wp_get_post_terms($Product->ID, "product_tag");
	$Tags = array();
	foreach ($WC_Tags as $WC_Tag) {
		$Tags[] = get_term_meta($WC_Tag->term_id, "upcp_ID", true);
	}

	$Skip_Nonce = "Yes";
	if ($Update == "Yes") {Edit_UPCP_Product($Item_ID, $Item_Name, $Item_Slug, $Item_Photo_URL, $Item_Description, $Item_Price, $Item_Sale_Price, $Item_Sale_Mode, $Item_SEO_Description, $Item_Link, $Item_Display_Status, $Category_ID, "", "", $SubCategory_ID, $Tags, "", "", $Skip_Nonce, $WC_ID);} 
	else {Add_UPCP_Product($Item_Name, $Item_Slug, $Item_Photo_URL, $Item_Description, $Item_Price, $Item_Sale_Price, $Item_Sale_Mode, $Item_SEO_Description, $Item_Link, $Item_Display_Status, $Category_ID, "", "", $SubCategory_ID, $Tags, "", "", $Skip_Nonce, $WC_ID);}
}

function UPCP_Create_Linked_WC_Product($Product) {
	global $wpdb;
	global $items_table_name;
	global $categories_table_name;
	global $subcategories_table_name;
	global $tags_table_name;
	global $tagged_items_table_name;

	$WC_Product = array(
		'post_type' => 'product',
		'post_name' => $Product->Item_Slug,
		'post_title' => $Product->Item_Name,
		'post_content' => $Product->Item_Description,
		'post_date' => min($Product->Item_Date_Created, date("Y-m-d H:i:s"))
	);

	if ($Product->Item_Display_Status == "Show") {$WC_Product['post_status'] = "publish";}
	else {$WC_Product['post_status'] = "draft";}

	if ($Product->Item_WC_ID != 0) {$WC_Product['ID'] = $Product->Item_WC_ID;}

	$WC_Post_ID = wp_insert_post($WC_Product);

	if ($WC_Post_ID != 0) {
		update_post_meta($WC_Post_ID, "_regular_price", $Product->Item_Price);
		update_post_meta($WC_Post_ID, "_sale_price", $Product->Item_Sale_Price);
		update_post_meta($WC_Post_ID, "_visibility", "visible");
		update_post_meta($WC_Post_ID, "_stock_status", "instock");
		update_post_meta($WC_Post_ID, "_downloadable", "no");
		update_post_meta($WC_Post_ID, "_virtual", "no");

		$Attachment_ID = UPCP_get_attachment_id_from_src($Product->Item_Photo_URL);
		if ($Attachment_ID != "") {
			set_post_thumbnail($WC_Post_ID, $Attachment_ID);
			update_post_meta($WC_Post_ID, "_thumbnail_id", $Attachment_ID);
		}
	
		if ($Product->Item_Sale_Mode == "Yes") {update_post_meta($WC_Post_ID, "_price", $Product->Item_Sale_Price);}
		else {update_post_meta($WC_Post_ID, "_price", $Product->Item_Price);}
	
		if ($Product->Item_WC_ID == 0) {$wpdb->query($wpdb->prepare("UPDATE $items_table_name SET Item_WC_ID=%d WHERE Item_ID=%d", $WC_Post_ID, $Product->Item_ID));}

		$Category_Objects = wp_get_post_terms($WC_Post_ID, 'product_cat');
		$Categories = array();
		foreach ($Category_Objects as $Category_Object) {$Categories[] = $Category_Object->term_id;}
		$Tag_Objects = wp_get_post_terms($WC_Post_ID, 'product_tag');
		$Tags = array();
		foreach ($Tag_Objects as $Tag_Object) {$Tags[] = $Tag_Object->term_id;}

		if (!empty($Categories)) {wp_remove_object_terms($WC_Post_ID, $Categories, 'product_cat');}
		if (!empty($Tags)) {wp_remove_object_terms($WC_Post_ID, $Tags, 'product_tag');}

		$WC_Category_ID = $wpdb->get_var($wpdb->prepare("SELECT Category_WC_ID from $categories_table_name WHERE Category_ID=%d", $Product->Category_ID));
		$WC_SubCategory_ID = $wpdb->get_var($wpdb->prepare("SELECT SubCategory_WC_ID from $subcategories_table_name WHERE SubCategory_ID=%d", $Product->SubCategory_ID));
		$WC_Category = get_term_by("id", $WC_Category_ID, "product_cat");
		$WC_SubCategory = get_term_by("id", $WC_SubCategory_ID, "product_cat");

		wp_set_post_terms($WC_Post_ID, array($WC_Category->term_id, $WC_SubCategory->term_id), "product_cat");

		$Tags = $wpdb->get_results($wpdb->prepare("SELECT Tag_ID FROM $tagged_items_table_name WHERE Item_ID=%d", $Product->Item_ID));

		$WC_Tags = array();

		if (is_array($Tags)) {
			foreach ($Tags as $Tag) {
				$WC_Tags[] = $wpdb->get_var($wpdb->prepare("SELECT Tag_WC_ID FROM $tags_table_name WHERE Tag_ID=%d", $Tag->Tag_ID));
			}
		}
		foreach ($WC_Tags as $Tag) {
			$Tag_Object = get_term_by("id", $Tag, "product_tag");
			$Insert_Tags[] = $Tag_Object->name;
		}

		wp_set_post_terms($WC_Post_ID, $Insert_Tags, "product_tag");
	}
}

function UPCP_Delete_WC_Product($WC_ID) {
	wp_delete_post($WC_ID, true);
}

function UPCP_get_attachment_id_from_src ($image_src) {
	global $wpdb;
	
	$query = "SELECT ID FROM {$wpdb->posts} WHERE guid='$image_src'";
	$id = $wpdb->get_var($query);
	return $id;
}

add_action("shutdown", "UPCP_Reset_WC_Product_Option");
function UPCP_Reset_WC_Product_Option() {
	update_option("UPCP_Product_Import", "None");
}
