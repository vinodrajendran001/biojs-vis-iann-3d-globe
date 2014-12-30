<?php
require 'min/config.php';
set_include_path($min_libPath . PATH_SEPARATOR . get_include_path());
require_once 'min/lib/Minify.php';
require_once 'min/lib/Minify/CSS.php';
require_once 'min/lib/JSMin.php';

$cssFiles = array(	"/css/itico.css", 
					"/css/fullcalendar.css", 
					"/css/pagination.css", 
					"/css/jquery.dataTables.css",
					"/ext/jquery.autocomplete.css",
					"/lib/jquery/jquery-ui-1.8.2.css");

$jsFiles = array(	
					"/lib/jquery/jquery-1.7.2.min.js",
					"/lib/jquery/jquery-ui-1.8.2.custom.min.js",
					"/lib/raphael/raphael.js",
					"/lib/raphael/g.raphael.js",
					"/lib/raphael/g.pie.js", 
					"/lib/jquery.livequery.js", 
					"/lib/core/Core.js", 
					"/lib/core/AbstractManager.js",
					"/lib/core/Parameter.js", 
					"/lib/core/ParameterStore.js",
					"/lib/core/AbstractWidget.js", 
					"/lib/core/AbstractFacetWidget.js", 
					"/lib/managers/Manager.jquery.js",
					"/lib/helpers/jquery/ajaxsolr.theme.js", 
					"/ext/jquery.pagination.js", 
					"/widgets/ResultWidget.js",
					"/lib/widgets/jquery/PagerWidget.js", 
					"/widgets/TagcloudWidget.js",
					"/widgets/EventsTypeSelectorWidget.js", 
					"/widgets/CurrentSearchWidget.js", 
					"/widgets/TextWidget.js",
					"/ext/jquery.autocomplete.js", 
					"/widgets/AutocompleteWidget.js", 
					"/widgets/SimpleTabsWidget.js",
					"/widgets/CategorySelectorWidget.js", 
					"/lib/oms.js",
					"/widgets/GoogleMapsWidget.js", 
					"/lib/rfc3339date.js", 
					"/lib/jquery.addtocal.js",
					"/lib/fullcalendar.min.js", 
					"/widgets/CalendarWidget.js", 
					"/widgets/DateFilterWidget.js", 
					"/lib/jquery.dataTables.min.js",
					"/widgets/TableWidget.js",
					"/widgets/PieWidget.js",
					"/widgets/TreeMapWidget.js",
					"/widgets/metaGlobeMap.js"
					"/js/itico.theme.js");
print "CSS files";
$myFile = dirname(__FILE__) . "/itico.min.css";
$fh = fopen($myFile, 'w') or die("can't open file");
foreach ( $cssFiles as $css ){
	$options = array();
	$options = array('currentDir' => dirname(__FILE__));
	$tempDocRoot = $_SERVER['DOCUMENT_ROOT'];
	$_SERVER['DOCUMENT_ROOT'] = dirname(__FILE__);

	$src = file_get_contents(dirname(__FILE__) .  $css);
//    $minExpected = file_get_contents($cssPath . "/{$item}.min.css");
    $minOutput = Minify_CSS::minify($src, $options);
	fwrite($fh, $minOutput);
	print "\n<br/>CSS added: ".$css;    
}
fclose($fh);



print "<br/><br/>JS files";
$myFile = dirname(__FILE__) . "/itico.min.js";
$fh = fopen($myFile, 'w') or die("can't open file");
foreach ( $jsFiles as $js ){
	$options = array();
	$options = array('currentDir' => dirname(__FILE__));
	$tempDocRoot = $_SERVER['DOCUMENT_ROOT'];
	$_SERVER['DOCUMENT_ROOT'] = dirname(__FILE__);

	$src = file_get_contents(dirname(__FILE__) .  $js);
	$minOutput = JSMin::minify($src);
	fwrite($fh, "\n".$minOutput);
	print "\n<br/>JS added: ".$js;    
}
fclose($fh);

?>