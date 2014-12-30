<?php
// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );


$document = &JFactory::getDocument();

//1.-CSS
$document->addStyleSheet('http://iann.pro/viewer/css/itico.css');
$document->addStyleSheet('http://iann.pro/viewer/css/fullcalendar.css');
$document->addStyleSheet('http://iann.pro/viewer/css/pagination.css');
$document->addStyleSheet('http://iann.pro/viewer/ext/jquery.autocomplete.css');
$document->addStyleSheet('http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.9/themes/base/jquery-ui.css');

//2.-CONFIGURATION	 
//2.1.-style
function setIannStyles($width){
	$style = '<style type="text/css"> ';
	$style .= 'h1.iann_title {display:none;} ';	
	$style .= 'div#iann_wrap {width: '. $width .'px; margin: 0px} ';
	$style .= 'div#iann_map {width: '. $width .'px;} ';
	$style .= 'div#iann_calendar {width: '. $width .'px;} ';
	$style .= '</style> ';
	return $style;
}
// Set size using URL parameters // index.php?option=com_iann&size=1000
$iannSize = JRequest::getVar('size');
if($iannSize == '') {$iannSize = '600';}
$document->addCustomTag(setIannStyles($iannSize));  
 
//2.2.-filters
function setIannFilters($key, $value){
    $javascript = 'var iann_prefilter = \''. $key .':"'. $value .'"\'';
    return $javascript;
}
$iannFilterKey = JRequest::getVar('filter_key');
$iannFilterValue = JRequest::getVar('filter_value');
// Set filter key and value // index.php?option=com_iann&filter_key=country&filter_value=United Kingdom
if($iannFilterKey == '' || $iannFilterValue == '') {
	//do not set filters
} else {
	$document->addScriptDeclaration(setIannFilters($iannFilterKey,$iannFilterValue));	
}

//2.3.-calendar colors
function setIannCalendarFilterColor($key, $value, $color){
    $javascript = 'var calendar_color_option = {"' . $key . '":{ "' . $value . '":"#' . $color . '"}};';
    return $javascript;
}
$iannCalendarFilterKey = JRequest::getVar('cal_filter_key');
$iannCalendarFilterValue = JRequest::getVar('cal_filter_value');
$iannCalendarColor = JRequest::getVar('cal_color');
// Set filter key and value // index.php?option=com_iann&filter_key=country&filter_value=United Kingdom&cal_filter_key=field&cal_filter_value=Bioinformatics&cal_color=660000
if($iannCalendarFilterKey == '' || $iannCalendarFilterValue == '' || $iannCalendarColor == '') {
	//do not set filters
} else {
	$document->addScriptDeclaration(setIannCalendarFilterColor($iannCalendarFilterKey,$iannCalendarFilterValue,$iannCalendarColor));	
}

    


//3.-JS
$document->addScript( 'http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js' ); 
$document->addScript( 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.9/jquery-ui.min.js' ); 
$document->addScript( 'http://maps.google.com/maps/api/js?sensor=false' ); 
$document->addScriptDeclaration('loading=\'events\';');
$document->addScript( 'http://iann.pro/viewer/js/iticoJSLoader.js' ); 

//4.-HTML
$html = '<div id="iann_wrap">';
$html .= '    <div class="iann_top">';
$html .= '        <div id="result_tabs"></div>';
$html .= '        <br/>';
$html .= '        <h1 class="iann_title"><span class="iann_orange">i</span><span class="iann_brown">ann</span></h1>';
$html .= '        <div id="iann_search" class="iann_cell"></div>';				
$html .= '        <div id="iann_advance_fields" style="display:none;"></div>';
$html .= '        <div class="clear"></div>';
$html .= '    </div>';
$html .= '    <div id="iann_results" class="iann_bottom"></div>';
$html .= '</div>';
echo $html;
?>