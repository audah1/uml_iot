</div>
</div>
</div>
<div id='wikiFooter'>
<?php

$banner= <<<FOOT
 <a href="$validator_xhtml"><img
  src="$this->themeurl/imgs/xhtml.png"
  style='border:0;vertical-align:middle' width="80" height="15"
  alt="Valid XHTML 1.0!" /></a>

 <a href="$validator_css"><img
  src="$this->themeurl/imgs/css.png"
  style='border:0;vertical-align:middle' width="80" height="15"
  alt="Valid CSS!" /></a>

 <a href="http://moniwiki.sourceforge.net/"><img
  src="$this->themeurl/imgs/moniwiki-powered-thin.png"
  style='border:0;vertical-align:middle' width="80" height="15"
  alt="powered by MoniWiki" /></a>
FOOT;

  print $menu;
  print "<div id='toTop'><a href='#top' id='bottom'><img style='border:0' alt='^' src='$this->themeurl/imgs/top.gif' /></a></div>";
?>
</div></div></div></div></div></div>
<?php
  print '<div style="align:center" id="wikiBanner">'.$banner.'<br />';
  if (!empty($lastedit))
    print "last modified $lastedit $lasttime<br />";
  if (!empty($timer))
    print 'Processing time '.$timer;
  #print "<pre>".$options['timer']->Write()."</pre>";
  print '</div>';
