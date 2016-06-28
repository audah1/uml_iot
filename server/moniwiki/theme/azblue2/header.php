<?php
# MoniWiki Theme by wkpark at kldp.org
# $Id: header.php,v 1.13 2010/09/04 18:04:31 wkpark Exp $
#
if (!empty($this->_sidebar)) {
  include_once("plugin/login.php");
  include_once("plugin/RandomBanner.php");
  if (!empty($this->_calendar)) {
    include_once("plugin/Calendar.php");
  }
}
if (!empty($DBInfo->use_tagging)) {
  include_once("plugin/Keywords.php");
}
if (!empty($DBInfo->use_scrap)) {
  include_once("plugin/scrap.php");
}
# theme options
#$_theme['sidebar']=1;

echo "<style type='text/css'>\n";
if (!empty($this->_width))
  echo <<<EOF
#mainBody { width:$this->_width;};
EOF;

if (!$this->_uppergoform)
  echo <<<EOF
#wikiHeadPage:hover #wikiIcon {
  visibility:visible;
}
EOF;
echo "</style>\n";
?>
<div id='topHeader'>
<!--
&middot; <a href='http://kldp.org'>KLDP.org</a> &middot;
<a href='http://kldp.net'>KLDP.net</a> &middot;
<a href='http://wiki.kldp.org'>KLDP Wiki</a> &middot;
<a href='http://bbs.kldp.org'>KLDP BBS</a> &middot;
-->
</div>
<div id='mainBody'>
<!--
<div id='topBanner'>
<img src="<?php echo $this->themeurl?>/imgs/kldpwikilogo.png"/>
</div>
-->
<?php if (!empty($this->_topicon)): ?>
<div id='topIcon'>
<a href='?action=edit'><img src='<?php echo $this->themeurl?>/imgs/record.png' alt='*' style='border:0' /></a>
<a href='?action=new'><img src='<?php echo $this->themeurl?>/imgs/add.png' alt='+' style='border:0' /></a>
<a href='?action=subscribe'><img src='<?php echo $this->themeurl?>/imgs/favorite.png' alt='#' style='border:0' /></a>
<a href='?action=rss_rc'><img src='<?php echo $this->themeurl?>/imgs/rss.png' alt='.)' style='border:0' /></a>
</div>
<?php endif;?>
<div class='pBodyTopRight'><div class='pBodyTopLeft'>
<div id='pTopRight'><div id='pTopLeft'>
<div id='pBanSpace'></div>
<div id='wikiHeadPage'>
<?php
if ($this->popup!=1) :
?>
<?php if ($this->_topbanner): ?>
<div id='pBanRight'><div id='pBanLeft'>
 <div id='pBanner'>
<img src='<?php echo $DBInfo->logo_img?>' /><?php
  echo $DBInfo->sitename;
  if ($DBInfo->site_description) echo '<p class="siteDescription">'.$DBInfo->site_description.'</p>';
?>
 </div>
<?php endif; /* topbanner */?>
<!-- goform on top of header -->
<?php if ($this->_uppergoform): ?>
<div id='goFormUpper'>
<form id='go' action='' method='get' onsubmit="return moin_submit();">
<div>
<input type='text' name='value' size='20' accesskey='s' class='goto' style='width:120px' />
<input type='hidden' name='action' value='goto' />
<input type='submit' name='status' class='submitBtn' value='Go' style='width:35px;' />
</div>
</form>
</div>
<?php endif;?>
<div id='pTitle'>
<?php if (!$this->_uppergoform): ?>
   <div id='wikiIcon'><?php echo $upper_icon.$icons.$rss_icon?></div>
<?php endif;?>
<?php if (!$this->_topbanner and $this->_logo): ?>
<img src='<?php echo $DBInfo->logo_img?>' style='text-align:left;' alt='moniwiki' />
<?php endif; /* topbanner */?>
<?php if ($this->_toptitle) echo $title;?></div>
<?php if ($this->_topbanner): ?>
 </div>
</div>
<?php endif; /* topbanner */?>
<?php endif; /* popup */?>
</div>
</div></div>
</div></div>
<?php if ($this->_splash):?>
<div class='pBodyRight'><div class='pBodyLeft'>
 <div style='clear:both'></div>
 <div id='wikiSplash'>
 </div>
</div></div>
<?php endif; /* _splash */?>
<span class='clear' ><!-- for IE --></span>
<div class='pBodyRight'><div class='pBodyLeft'>
<div id='pBottomRight'><div id='pBottomLeft'>
<div id='wikiPage'>
<span class='clear'></span>
<?php if ($this->popup) :?>
&nbsp;<!-- oops!! firefox bug workaround :( -->
<?php else:?>
<div id='wikiHeader'>
  <div id='wikiMenuBar'>
   <?php if ($this->_uppergoform): ?>
   <div id='wikiIcon'><?php echo $upper_icon.$icons.$rss_icon?></div>
   <?php else:?>
   <!-- goform on the MenuBar -->
   <div id='goForm'>
<form id='go' action='' method='get' onsubmit="return moin_submit();">
   <div>
<input type='text' name='value' size='20' accesskey='s' class='goto' style='width:120px' />
<input type='hidden' name='action' value='goto' />
<input type='submit' name='status' class='submitBtn' value='Go' style='width:35px;' />
   </div>
</form>
   </div>
   <?php endif;?>

<?php echo $menu?>
  </div>
</div>
<span class='clear'></span>
<?php endif; /* popup */?>
<?php empty($msg) ? '' : print $msg; ?>
<div id='container'>
<?php
# enable/disable sidebar
if ($this->_sidebar==0) :
?>
<style type='text/css'>
#container { background-image:none; }
</style>
<?php
else:
	if ($this->_toggle):?>
<style type='text/css'>
/* Toggle */
/* Hiding/Showing the side menu from http://wiki.phpbb.com/ */
#toggle {
	padding: 5px;
	width: 20px;
	left: -10px;
	top: -5px;
	margin-left: -24px;
	position:relative; /* IE magic;; */
	_left: 0;
}

#toggle-handle {
	display: inline-block;
	width: 16px;
	height: 15px;
	float: left;
	background: url(<?php echo $this->themeurl?>/imgs/toggle.png) no-repeat;
}

#toggle .hide {
	background-position:left 0;
}
#toggle .hide:hover {
	background-position:bottom 0;
}
#toggle .show {
	background-position:right 0%;
}
#toggle .show:hover {
	background-position:bottom 100%;
}
</style>
<script type="text/javascript">
/**
 * Hiding/Showing the side menu from http://wiki.phpbb.com/
 *
 * adopt cookie and simplified for MoniWiki. 2008/12/28
 *
 */
function toggleMenu(sect)
{
	if (typeof Effect != 'undefined') { // prototype.js
		var dur = 0.5;
		if (toggle) {
			new Effect.SlideDown(sect, { duration: dur, afterFinish: function() {Element.show(sect);} });
		} else {
			new Effect.SlideUp(sect, { duration: dur, afterFinish: function() {Element.hide(sect);} });
		}
	} else if (typeof MooTools != 'undefined') { // mootools
		var mySlide = new Fx.Slide(sect, {mode: 'horizontal'} );
		if (sect.parentNode.clientWidth == '0' || sect.style.display == 'none') {
			mySlide.slideIn();
		} else {
			mySlide.slideOut();
		}
	} else {
		if (sect.style.display == 'none') {
			sect.style.display = 'block';
		} else {
			sect.style.display = 'none';
		}
	}
}

function switch_menu()
{
	var moni_cookie = '_moni_menu_';
	var menu = document.getElementById('wikiSideMenu');
	var toggle = document.getElementById('toggle');
	var handle = document.getElementById('toggle-handle');
	var container = document.getElementById('container');

	if (handle.style.display == 'none')
		return;

	var menu_state = handle.className;
	var img = "url('<?php echo $this->themeurl?>/imgs/bg_sidemenu.png')";

	var exp = new Date();
	exp.setTime(exp.getTime() + 24*60*60*90*1000);
	var expire = '; expires=' + exp.toGMTString();

	switch (menu_state) {
	// hide
	case 'show':
		//toggleMenu(menu);
		menu.style.display = 'none';
		handle.className = 'hide';
		container.style.backgroundImage = 'none';
		document.cookie = moni_cookie + '=0' + expire;
		break;

	// show
	case 'hide':
		//toggleMenu(menu);
		menu.style.display = 'block';
		handle.className = 'show';
		container.style.backgroundImage = img;
		document.cookie = moni_cookie + '=1' + expire;
		break;
	}
}

(function () {
function check_menu()
{
	var moni_cookie = '_moni_menu_';
	var menu = document.getElementById('wikiSideMenu');
	var handle = document.getElementById('toggle-handle');
	var container = document.getElementById('container');
	var img = "url('<?php echo $this->themeurl?>/imgs/bg_sidemenu.png')";

	var pos = document.cookie.indexOf(moni_cookie + '=');
	if (pos > -1) {
		var hide = false;
		if (menu.offsetWidth == 0) {
			handle.style.display = 'none';
			container.style.backgroundImage = 'none';
			hide = true;
		} else if (document.cookie.charAt(pos+moni_cookie.length+1)=='0') {
			hide = true;		
		}
		if (!hide) {
			handle.className = 'show';
			container.style.backgroundImage = img;
		} else {
			handle.className = 'hide';
			menu.style.display = 'none';
			container.style.backgroundImage = 'none';
		}
	}
}

var oldOnload = window.onload;
if (typeof window.onload != 'function') {
	window.onload = check_menu();
} else {
	window.onload = function() {
		oldOnload();
		check_menu();
	}
}
})();
</script>
<?php	else: /* toggle */?>
<script type='text/javascript'>
(function () {
function check_menu()
{
	var menu = document.getElementById('wikiSideMenu');
	//alert(menu.getAttribute('style'));
	if (menu.offsetWidth == 0) {
		var container = document.getElementById('container');
		container.style.backgroundImage = 'none';
	}
}

var oldOnload = window.onload;
if (typeof window.onload != 'function') {
	window.onload = check_menu();
} else {
	window.onload = function() {
		oldOnload();
		check_menu();
	}
}
})();
</script>

<?php	endif; /* toggle */?>
<div id='wikiSideMenuContainer'>
<?php	if ($this->_toggle):?>
<div id="toggle">
<a id="toggle-handle" class='show' accesskey="m" onclick="switch_menu(); return false;" href="#"></a>
</div>
<?php	endif; /* toggle */?>
<div id='wikiSideMenu'>
<?php
echo macro_login($this);
if ($this->_calendar == 1) :
echo '<div class="calendar">';
if ($options['id']=='Anonymous')
  $pg = 'Blog';
else
  $pg = $options['id'];
echo macro_calendar($this,"'$pg',blog,noweek,archive,center",$pg);
echo '</div>';
endif;

if (!empty($DBInfo->use_scrap)) {
  echo "<div class='scrap'>";
  echo macro_Scrap($this);
  echo "</div>";
}
if ($this->_submenu==1) :
  echo '<div id="subMain">';
  echo $submain;
  echo '</div>';
  echo '<div id="subMenu">';
  echo $submenu;
  echo '</div>';
endif;
if ($this->_randomquote==1) :
echo '<div class="randomQuote">';
echo macro_RandomQuote($this);
echo '</div>';
endif;
echo '<div class="randomPage">';
echo macro_RandomPage($this,"4,simple");
echo '</div>';
if (!empty($DBInfo->use_tagging)) {
  echo "<div>";
  echo macro_Keywords($this,"all,tour,limit=15");
  echo "</div>";
}
?>
</div>
</div>
<?php endif; /* sidebar */ ?>
<?php echo '<div id="wikiTrailer"><p><span>'.$trail.'</span></p></div>';?>
<div id='mycontent'>
<?php if (empty($this->_toptitle)) echo '<div class="wikiTitle" id="wikiTitle">'.$title.'</div>';?>
<?php echo $subindex;?>
