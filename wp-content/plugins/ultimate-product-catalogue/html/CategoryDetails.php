<?php $Category = $wpdb->get_row($wpdb->prepare("SELECT * FROM $categories_table_name WHERE Category_ID ='%d'", $_GET['Category_ID'])); ?>

		<div class="OptionTab ActiveTab" id="EditCategory">
				
				<div id="col-right">
				<div class="col-wrap">
				<div id="add-page" class="postbox metabox-holder" >
				<div class="handlediv" title="Click to toggle"><br /></div><h3 class='hndle'><span><?php _e("Products in Category", 'UPCP') ?></span></h3>
				<div class="inside">
				<div id="posttype-page" class="posttypediv">

				<div id="tabs-panel-posttype-page-most-recent" class="tabs-panel tabs-panel-active">
				</ul>
				<table class="wp-list-table widefat tags sorttable category-products-list">
				    <thead>
				    	<tr>
				            <th><?php _e("Product Name", 'UPCP') ?></th>
				    	</tr>
				    </thead>
				    <tbody>
				    <?php $Products = $wpdb->get_results($wpdb->prepare("SELECT Item_ID, Item_Name FROM $items_table_name WHERE Category_ID='%d' ORDER BY Item_Category_Product_Order", $_GET['Category_ID']));
					if (empty($Products)) { echo "<div class='product-category-row list-item'><p>No products currently in category<p/></div>"; }
					else {
				    	foreach ($Products as $Product) {
				    		echo "<tr id='category-product-item-" . $Product->Item_ID . "' class='category-product-item'>";
				    	    echo "<td class='product-name'>";
				    	    echo "<a href='admin.php?page=UPCP-options&Action=UPCP_Item_Details&Selected=Product&Item_ID=" . $Product->Item_ID . "'>" . $Product->Item_Name . "</a>";
				    	    echo "</td>";
				    		echo "</tr>";
				    	}
					}?>
				    </tbody>
				    <tfoot>
				        <tr>
				            <th><?php _e("Product Name", 'UPCP') ?></th>
				        </tr>
				    </tfoot>
				</table>
				</div><!-- /.tabs-panel -->
				</div><!-- /.posttypediv -->
				</div>
				</div>
				</div>
				</div><!-- col-right -->
				
				<div id="col-left">
				<div class="col-wrap">
				<div class="form-wrap CategoryDetail">
					<a href="admin.php?page=UPCP-options&DisplayPage=Categories" class="NoUnderline">&#171; <?php _e("Back", 'UPCP') ?></a>
					<h3>Edit <?php echo $Category->Category_Name;echo" (ID:";echo $Category->Category_ID;echo " )";?></h3>
					<form id="addtag" method="post" action="admin.php?page=UPCP-options&Action=UPCP_EditCategory&DisplayPage=Categories" class="validate" enctype="multipart/form-data">
					<input type="hidden" name="action" value="Edit_Category" />
					<input type="hidden" name="Category_ID" value="<?php echo $Category->Category_ID; ?>" />
					<input type="hidden" name="WC_term_id" value="<?php echo $Category->Category_WC_ID; ?>" />
					<?php wp_nonce_field(); ?>
					<?php wp_referer_field(); ?>
					<div class="form-field">
						<label for="Category_Name"><?php _e("Name", 'UPCP') ?></label>
						<input name="Category_Name" id="Category_Name" type="text" value="<?php echo $Category->Category_Name;?>" size="60" />
						<p><?php _e("The name of the category your users will see and search for.", 'UPCP') ?></p>
					</div>
					<div class="form-field">
						<label for="Category_Description"><?php _e("Description", 'UPCP') ?></label>
						<textarea name="Category_Description" id="Category_Description" rows="5" cols="40"><?php echo $Category->Category_Description;?></textarea>
						<p><?php _e("The description of the category. What products are included in this?", 'UPCP') ?></p>
					</div>
					<div class="form-field">
						<label for="Category_Short_Description"><?php _e("Short Description", 'UPCP') ?></label>
						<textarea name="Category_Short_Description" id="Category_Short_Description" rows="5" cols="40"><?php echo $Category->Category_Short_Description;?></textarea>
						<p><?php _e("The short description of the category. What products are included in this?", 'UPCP') ?></p>
					</div>
					<div class="form-field">
						<label for="Category_Type"><?php _e("Type", 'UPCP') ?></label>
						<select name="Category_Type" id="Category_Type">
							<option value="Other" <?php if($Category->Category_Type != 'Audio' && $Category->Category_Type != 'Video'): echo 'selected'; endif; ?>>Other</option>
							<option value="Audio" <?php if($Category->Category_Type == 'Audio'): echo 'selected'; endif; ?>>Audio</option>
							<option value="Video" <?php if($Category->Category_Type == 'Video'): echo 'selected'; endif; ?>>Video</option>
							<option value="Recliners" <?php if($Category->Category_Type == 'Recliners'): echo 'selected'; endif; ?>>Recliners</option>
							<option value="Automation" <?php if($Category->Category_Type == 'Automation'): echo 'selected'; endif; ?>>Automation</option>
						</select>
						<p><?php _e("The type of the category.", 'UPCP') ?></p>
					</div>
					<div class="form-field">
						<label for="Category_Brand_Link"><?php _e("Brand Link", 'UPCP') ?></label>
						<input name="Category_Brand_Link" id="Category_Brand_Link" type="text" value="<?php echo $Category->Category_Brand_Link;?>" size="60" />
						<p><?php _e("This is where your link to brand website will go.", 'UPCP') ?></p>
					</div>
					<div class="form-field">
						<label for="Category_Image"><?php _e("Image", 'UPCP') ?></label>
						<input id="Category_Image" type="text" size="36" name="Category_Image" value="<?php echo $Category->Category_Image;?>" /> 
						<input id="Category_Image_Button" class="button" type="button" value="Upload Image" />
						<p><?php _e("An image that will be displayed in association with this category, if that option is selected in the 'Options' tab. Current Image:", 'UPCP') ?><br/><img class="PreviewImage" height="100" width="100" src="<?php echo $Category->Category_Image;?>" /></p>
						<div class='clear'></div>
					</div>
					<div class="form-field">
						<label for="Category_Logo"><?php _e("Logo", 'UPCP') ?></label>
						<input id="Category_Logo" type="text" size="36" name="Category_Logo" value="<?php echo $Category->Category_Logo;?>" /> 
						<input id="Category_Logo_Button" class="button" type="button" value="Upload Image" />
						<p><?php _e("White Logo of this category. Current Image:", 'UPCP') ?><br/><img class="PreviewImage" height="100" width="100" src="<?php echo $Category->Category_Logo;?>" /></p>
						<div class='clear'></div>
					</div>
					<div class="form-field">
						<label for="Category_White_Logo"><?php _e("White Logo", 'UPCP') ?></label>
						<input id="Category_White_Logo" type="text" size="36" name="Category_White_Logo" value="<?php echo $Category->Category_White_Logo;?>" /> 
						<input id="Category_White_Logo_Button" class="button" type="button" value="Upload Image" />
						<p><?php _e("Logo of this category. Current Image:", 'UPCP') ?><br/><img class="PreviewImage" height="100" width="100" src="<?php echo $Category->Category_White_Logo;?>" /></p>
						<div class='clear'></div>
					</div>

					<p class="submit"><input type="submit" name="submit" id="submit" class="button-primary" value="<?php _e('Save Changes', 'UPCP') ?>" /></p>
					</form>
				</div>
				</div>
				</div>
			
		</div>