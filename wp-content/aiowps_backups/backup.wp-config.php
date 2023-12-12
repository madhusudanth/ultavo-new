<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'ultavoso_live4');

/** MySQL database username */
define('DB_USER', 'ultavoso_live');

/** MySQL database password */
define('DB_PASSWORD', 'Ultavo@277577*');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'G}]=F+Jx4tO:i+$`$_-RU5GR&~}C}hU}yc:S8u*R:2!RiTl+{S4b674+oE%v^PR^');
define('SECURE_AUTH_KEY',  '-ua}[9:QuGc3q3f2c2*8Dre6`pl[1C*@>6,_2e$$ [#W9Rez(iDJ%06=Y/SJJ2Jm');
define('LOGGED_IN_KEY',    't<qk+)lI+f<b9wnkp>4pC=W8is^lel>l-6VW(ta_s![zYU<CkpAu2!zzF.V Ph7>');
define('NONCE_KEY',        'ygCgmn5&+0FR3!GoDbKKF6+1,`T5cKxpw^3<`f?@6wq(Eq.ig<Gwb=un?<9xy1(L');
define('AUTH_SALT',        '}Y|Dnuy8&Wd0eG*5d%PRa%hX732$4v*Eni&3UaLff<>=Q?Rj-Bk)Fn;x+B9i<czP');
define('SECURE_AUTH_SALT', 'Vm+47z*kj+Hm5%Ql~y$>`=3v2?RZ=ZT>o-eY;V22LDYfX#W)`wJ)PGD8yWR83Yfi');
define('LOGGED_IN_SALT',   '>i,-#I`dc-|-REx^:`G,F>!!y9P<-0(gkv8MQUk<DD|1Drefa:OB^k5(JgC8a/uD');
define('NONCE_SALT',       'OZ0>qXTl_Z@Yk,oG;eSI|/x5SHTV@1Ju5r]Y?ll<idAgiL{68=}0&@zBlDPF,X~+');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
