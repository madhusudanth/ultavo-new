<?php 
function Upgrade_To_Full() {
		global $message, $Full_Version;
		
		$Key = $_POST['Key'];

		if ($Key == "EWD Trial" and !get_option("UPCP_Trial_Happening")) {
			$ewd_urp_message = array("Message_Type" => "Update", "Message" => __("Trial successfully started!", 'UPCP'));
	
			update_option("UPCP_Trial_Expiry_Time", time() + (7*24*60*60));
			update_option("UPCP_Trial_Happening", "Yes");
			update_option("UPCP_Full_Version", "Yes");
			$Full_Version = get_option("UPCP_Full_Version");

			$message = array("Message_Type" => "Update", "Message" => __("Trial successfully started.", 'UPCP'));
		}
		elseif ($Key != "EWD Trial") {
			$opts = array('http'=>array('method'=>"GET"));
			$context = stream_context_create($opts);
			$Response = unserialize(file_get_contents("http://www.etoilewebdesign.com/UPCP-Key-Check/KeyCheck.php?Key=" . $Key . "&Site=" . get_bloginfo('wpurl'), false, $context));
			//$Response = file_get_contents("http://www.etoilewebdesign.com/UPCP-Key-Check/KeyCheck.php?Key=" . $Key);
			
			if ($Response['Message_Type'] == "Error") {
				  $message = array("Message_Type" => "Error", "Message" => $Response['Message']);
			}
			else {
					$message = array("Message_Type" => "Update", "Message" => $Response['Message']);
					update_option("UPCP_Trial_Happening", "No");
					delete_option("UPCP_Trial_Expiry_Time");
					update_option("UPCP_Full_Version", "Yes");
					update_option("UPCP_Product_Page_Serialized", $Response['ProductPage']);
					$Full_Version = get_option("UPCP_Full_Version");
			}
		}
}

 ?>
