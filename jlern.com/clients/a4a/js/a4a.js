/* -------------------------------------------------------------------------------------------------- 
	
	BUTTONS

-------------------------------------------------------------------------------------------------- */



//! GLOBAL NAV

var activeNav = -1;

$('#subnav').find('li').find('a').mouseover(function(){
	TweenMax.to($(this).siblings('.color-bar'), .3, {height:'100%', ease:Expo.easeOut});
})

$('#subnav').find('li').find('a').mouseout(function(){
	if($(this).parents('li').attr('data-num') != activeNav){
		TweenMax.to($(this).siblings('.color-bar'), .5, {height:8, ease:Elastic.easeInOut, easeParams:[2,2.5]});
	}
})

$('#subnav').find('li').find('a').click(function(){
	autoMove = true;
	activeNav = $(this).parents('li').attr('data-num');
	topPos = $('section[data-num="'+activeNav+'"]').offset().top-navH;
	if(!mobile){changeNav(activeNav);}
		
	TweenMax.to($('html,body'), .75, {scrollTop:topPos+1, ease:Expo.easeInOut, onComplete:function(){delayReset()}})
		
	if(mobile){
		// switch active bar
		$('#mobile-selected').children('span').text($(this).parents('li').attr('data-name'));
		$('#mobile-selected').css('background-color',$(this).parents('li').attr('data-color'));
		
		// close mobile nav
		mobileNavClose();
		mobileOpen = false;
	}
	
	return false;
})



//! CTA BUTTONS

$('.cta-btn').mouseenter(function(){
	TweenMax.to($(this), .7, {scaleX:1.1, scaleY:1.1, ease:Elastic.easeOut, easeParams:[.8,.6]});
	TweenMax.to($(this).find('.icon-WhitePlus'), .7, {scaleX:1.3, scaleY:1.3, ease:Elastic.easeOut, easeParams:[.8,.6]});
})
$('.cta-btn').mouseleave(function(){
	TweenMax.to($(this), .5, {scaleX:1, scaleY:1, ease:Elastic.easeOut, easeParams:[1,.7]});
	TweenMax.to($(this).find('.icon-WhitePlus'), .5, {scaleX:1, scaleY:1, ease:Elastic.easeOut, easeParams:[1,.7]});
})



//! SEE HOW BUTTONS

$('.how-btn').mouseenter(function(){
if(!mobile){
	// get size of button
	tmpSW = $(this).width(); tmpSH = $(this).height();
	TweenMax.set($(this).find('[class^="how-blurb"]'), {'display':'block', 'visibility':'hidden', 'opacity':1, 'width':'', 'left':'', 'bottom':''});
	
	// get size of pop up and set starting position
	tmpEW = $(this).find('[class^="how-blurb"]').outerWidth(); tmpEH = $(this).find('[class^="how-blurb"]').outerHeight();
	TweenMax.set($(this).find('[class^="how-blurb"]'), {width:tmpSW, height:tmpSH, 'visibility':'visible'});
	TweenMax.set($(this).find('[class^="how-blurb"]>div'), {opacity:0})
	
	// animate open
	TweenMax.to($(this).find('[class^="how-blurb"]'), .3, {width:tmpEW, height:tmpEH, ease:Expo.easeOut})
	TweenMax.to($(this).find('[class^="how-blurb"]>div'), .3, {delay:.25, opacity:1})
	
	// if applicable, bring to front
	if($(this).parents('div').hasClass('economy-window')){
		$('.economy-window').each(function(){$(this).find('.how-btn').css('z-index',4)})
		$(this).css('z-index',5);
	}	
}
})
$('.how-btn').mouseleave(function(){
	if(mobile){
		$(this).find('[class^="how-blurb"]').hide();
	} else {
		// get size of button
		tmpSW = $(this).width(); tmpSH = $(this).height();
		
		// animate close
		TweenMax.to($(this).find('[class^="how-blurb"]'), .3, {width:tmpSW, height:tmpSH, ease:Power3.easeIn, onCompleteParams:[$(this).find('[class^="how-blurb"]')], onComplete:function(obj){
			TweenMax.set($(obj), {'display':'none', width:'', height:''});
		}})
		TweenMax.to($(this).find('[class^="how-blurb"]>div'), .3, {opacity:0});
	}
})
$('.how-btn').click(function(){
if(mobile){
	// get size of button
	tmpSW = $(this).width(); tmpSH = $(this).height();
	
	if($(this).find('[class^="how-blurb"]').css('display') == 'none'){
	TweenMax.set($(this).find('[class^="how-blurb"]'), {'display':'block', 'visibility':'hidden', 'opacity':1});

	$(this).find('[class^="how-blurb"]').css({'width':winW-20});
	$(this).find('[class^="how-blurb"]').css({'left':(tmpSW/2)-((winW-20)/2), 'bottom':-($(this).find('[class^="how-blurb"]').height()/2)-10+'px'});
	TweenMax.set($(this).find('[class^="how-blurb"]>div'), {opacity:1})
	TweenMax.to($(this).find('[class^="how-blurb"]'), .3, {startAt:{scaleX:0, scaleY:0, 'visibility':'visible'}, scaleX:1, scaleY:1, ease:Expo.easeOut})
	
	return false;
	} else {
		return true;
	}
}
})
$('.how-btn').find('.close-x').click(function(e){
	$(this).parents('[class^="how-blurb"]').hide();
	e.stopPropagation();
	return false;
})



//! OTHER BUTTONS

$('#backtotop').mouseenter(function(){
	TweenMax.to($(this).find('.blackFade'), .5, {opacity:.2})
})
$('#backtotop').mouseleave(function(){
	TweenMax.to($(this).find('.blackFade'), .5, {opacity:.1})
})
$('#backtotop').click(function(){
	autoMove = true;
	curSection = 0;
	lastSection = 0;
	activeNav = 0;
	TweenMax.to($('html,body'), .75, {scrollTop:0, ease:Expo.easeInOut, onComplete:function(){delayReset()}})
	return false;
})

$('#hero-cta>div').mouseenter(function(){
	TweenMax.to($(this), .5, {scaleX:1.1, scaleY:1.1, ease:Elastic.easeOut, easeParams:[2,2]})
})
$('#hero-cta>div').mouseleave(function(){
	TweenMax.to($(this), .5, {scaleX:1, scaleY:1, ease:Elastic.easeOut, easeParams:[2,2]})
})
$('#hero-cta>div').click(function(){
	autoMove = true;
	topPos = $('#flight').offset().top-navH;
	TweenMax.to($('html,body'), .75, {scrollTop:topPos+1, ease:Expo.easeInOut, onComplete:function(){autoMove = false;}})
	activeNav = 0;
	curSection = 0;
	changeNav(activeNav);
})


$('#hero-marshall').mouseenter(function(){
	TweenMax.to($('#hero-marshall').find('img'), .5, {'marginBottom':-3, ease:Elastic.easeOut, easeParams:[2,2]})
})
$('#hero-marshall').mouseleave(function(){
	TweenMax.to($('#hero-marshall').find('img'), .5, {'marginBottom':-20, ease:Elastic.easeOut, easeParams:[2,2]})
})
$('#hero-marshall').click(function(){
	autoMove = true;
	topPos = $('#marshall').offset().top-navH;
	TweenMax.to($('html,body'), .75, {scrollTop:topPos+1, ease:Expo.easeInOut, onComplete:function(){delayReset()}})
})

var resetter;
function delayReset(){
	clearTimeout(resetter);
	resetter = setTimeout(function(){autoMove = false;},1000);
}


var flightHidden = false;

$('#flight-hider a').click(function(){
	if(!flightHidden){
		TweenMax.to($('#flight-content'), .5, {opacity:0})
		$('#flight-hider a').text('Show Overlays');
		flightHidden = true;
	} else {
		TweenMax.to($('#flight-content'), .5, {opacity:1})
		$('#flight-hider a').text('Hide Overlays');
		flightHidden = false;
	}
	return false;
})











/* -------------------------------------------------------------------------------------------------- 
	
	SECTION SPECIFIC FUNCTIONS

-------------------------------------------------------------------------------------------------- */



//! PASSENGERS SLIDES

var activeSlide = 0;
var lastSlide = 0;
var totalSlides = 3;

$('[id^="pass-arrow-"]').mouseover(function(){
	TweenMax.to($(this).children('div'), .3, {opacity:1})
})
$('[id^="pass-arrow-"]').mouseout(function(){
	TweenMax.to($(this).children('div'), .3, {opacity:.3})
})

$('[id^="pass-arrow-"]').click(function(){
	if($(this).attr('id') == 'pass-arrow-lt'){
		dir = -1
	} else {
		dir = 1;
	}

	TweenMax.to($('.slide[data-num="'+activeSlide+'"]'), .75, {left:-winW*dir, ease:Expo.easeInOut, onComplete:function(){
		$('.slide[data-num="'+lastSlide+'"]').css('visibility','hidden');
		lastSlide = activeSlide;
	}})
	
	activeSlide += dir;
	if(activeSlide==totalSlides){activeSlide = 0;}
	if(activeSlide<0){activeSlide = totalSlides-1;}
	
	TweenMax.set($('.slide[data-num="'+activeSlide+'"]'), {left:winW*dir, 'display':'block', 'visibility':'visible'})
	$(window).resize();
	TweenMax.to($('.slide[data-num="'+activeSlide+'"]'), .75, {left:0, ease:Expo.easeInOut})
})



//! MARSHALL GIFS

path = 'images/marshall/';

$('#marshall-btns').find('a').click(function(i){
	tmpFile = $(this).attr('href');
	$('#marshall-gif').children('img').attr('src',path+tmpFile);
	
	// account for differences in height
	$('#marshall-gif').children('img').css('margin-top','');
	if(tmpFile == 'Marshaller-Animations_Move-Back.gif'){
		$('#marshall-gif').children('img').css('margin-top','-12%');
	}
	if(tmpFile == 'Marshaller-Animations_TurnTailToYourRight.gif'){
		$('#marshall-gif').children('img').css('margin-top','-9%');
	}
	
	resetMarshallButtons();
	$(this).addClass('pressed');
	
	return false;
})

function resetMarshallButtons(){
	$('#marshall-btns').find('a').each(function(){
		if($(this).hasClass('pressed')){
			$(this).removeClass('pressed')
		}
	})
}



//! OVERLAYS

var overlayOpen = false;

$('.cta-btn').click(function(){
	// set specific overlay
	tmpName = $(this).attr('id').split('-cta')[0];
	$('.overlayWrap').hide();
	$('#overlay-'+tmpName).show();
	
	overlayOpen = true;
	
	// freeze contents
	$('body').css({'width':'100%','height':'100%','overflow':'hidden'});
	
	TweenMax.to('#overlay', .75, {opacity:1, 'display':'block'});
})
$('#overlay .close-x').mouseover(function(){
	TweenMax.to($(this), .5, {scaleX:1.1, scaleY:1.1, ease:Expo.easeOut})
})
$('#overlay .close-x').mouseout(function(){
	TweenMax.to($(this), .5, {scaleX:1, scaleY:1, ease:Expo.easeOut})
})
$('#overlay .close-x').click(function(){
	TweenMax.to('#overlay', .75, {opacity:0, 'display':'none'});
	TweenMax.to($('#overlay .close-x'), .5, {scaleX:1, scaleY:1, ease:Expo.easeOut})
	$('body').css({'width':'','height':'','overflow':''});
	overlayOpen = false;
})











/* -------------------------------------------------------------------------------------------------- 
	
	MOBILE / RESPONSIVE

-------------------------------------------------------------------------------------------------- */



//! MOBILE NAV FUNCTIONS

var mobileOpen = false;

$('#mobile-selected').click(function(){
	if(!mobileOpen){
		TweenMax.set($('#subnav nav'), {'display':'block'})
		tmpNavM = -$('#subnav nav').height();
		TweenMax.set($('#subnav nav'), {'marginTop':tmpNavM})
		TweenMax.to($('#subnav nav'), .5, {'marginTop':0, ease:Expo.easeOut})
		mobileOpen = true;
	} else {
		mobileNavClose();
	}
})

function mobileNavClose(){
	tmpNavM = -$('#subnav nav').height();
	TweenMax.to($('#subnav nav'), .5, {'marginTop':tmpNavM, ease:Expo.easeInOut, onComplete:function(){$('#subnav nav').hide();}})
	mobileOpen = false;
}

function updateMobileNav(){
	$('#subnav').find('li[data-num="'+curSection+'"]').find('a').css('color','');
	$('#mobile-selected').children('span').text($('#subnav').find('li[data-num="'+curSection+'"]').attr('data-name'));
	$('#mobile-selected').css('background-color',$('#subnav').find('li[data-num="'+curSection+'"]').attr('data-color'));
}

function updateDesktopNav(){
	$('#subnav').find('li').find('a').each(function(i){
		if($(this).parents('li').attr('data-num') == curSection){
			$(this).css('color','#fff');
			TweenMax.set($(this).siblings('.color-bar'), {height:'100%', ease:Expo.easeOut});
		} else {
			$(this).css('color','');
			TweenMax.set($(this).siblings('.color-bar'), {height:8, ease:Elastic.easeInOut, easeParams:[2,2.5]});
		}
	})
}



//! TEXT RESIZING

$(document).ready(function(){
	$('#hero-h1').fitText(1.7,{minFontSize:'22px',maxFontSize:'42px'});
	$('#hero-h2').fitText(3.3,{minFontSize:'16px',maxFontSize:'20px'});
	
	$('#flight-h1').fitText(1.33,{minFontSize:'32px',maxFontSize:'75px'});
	$('#flight-h2a').fitText(2.5,{minFontSize:'15px',maxFontSize:'28px'});
	$('#flight-h2b').fitText(2.5,{minFontSize:'15px',maxFontSize:'28px'});
	$('#flight-statement p').fitText(5,{minFontSize:'12px',maxFontSize:'21px'});
	
	$('#jobs-h1').fitText(.45,{maxFontSize:'115px'});
	$('#jobs-h2').fitText(.5,{maxFontSize:'105px'});
	$('#jobs-p1').fitText(1.87,{maxFontSize:'22px'});
	$('#jobs-p2').fitText(1.4,{maxFontSize:'24px'});
	$('.icon-Calendar').fitText(.09,{maxFontSize:'90px'});
	
	$('#safety-h1m').fitText(1.5,{minFontSize:'30px',maxFontSize:'36px'});
	$('#safety-h2a').fitText(2.5,{minFontSize:'20px',maxFontSize:'28px'});
	$('#safety-h2b').fitText(2.5,{minFontSize:'15px',maxFontSize:'28px'});
	
	$('.passengers-h1').fitText(1.75,{minFontSize:'22px',maxFontSize:'52px'});
	$('.icon-Wifi').fitText(.3,{maxFontSize:'75px'});
	$('.icon-NewPlane').fitText(.275,{maxFontSize:'80px'});
	
	$('#economy-h1').fitText(3,{minFontSize:'22px',maxFontSize:'28px'});
	
	$('#marshall-h1').fitText(.75,{maxFontSize:'90px'});
	$('#marshall-h2').fitText(2.75,{minFontSize:'13px',maxFontSize:'22px'});

	$('#cargo-h1').fitText(1.28,{maxFontSize:'80px'});
	$('#cargo-h2').fitText(1.6,{maxFontSize:'24px'});
	$('.icon-Package').fitText(.09,{minFontSize:'60px',maxFontSize:'125px'});
	
	$(window).resize();
})



//! RESPONSIVE TWEAKS

var safetyMax = 1200;
var safetyMin = 575;
var safetySC = 1;

function updateElements(){
	
	// SAFETY
	if(winW<safetyMax){
		safetySC = 1-((safetyMax-winW)/safetyMax);
		TweenMax.set($('#safety-infographic'), {scaleX:safetySC, scaleY:safetySC});
		
		if(winW>safetyMin){
			igH = 470*safetySC;
			TweenMax.set($('.infographic-wrap'), {height:igH})
		} else {
			TweenMax.set($('.infographic-wrap'), {height:'auto'})
		}
	} else {
		TweenMax.set($('#safety-infographic'), {scaleX:1, scaleY:1});
		TweenMax.set($('.infographic-wrap'), {height:470})
	}
	
	
	// CARGO
	relY = $('#cargo-infographic').offset().top - $('#cargo').offset().top;
	if(winW<=400){cargoBeltTop = 60;}else{cargoBeltTop = 30;}
	cargoTop = relY+$('.icon-Package').outerHeight()+cargoBeltTop;
	TweenMax.set($('#cargo-belt'), {top:cargoTop});
	
	if(winW<=785){
		$('#cargo').find('.how-btn>div').removeClass('how-blurb-left').addClass('how-blurb-right');
	} else {
		if($('#cargo').find('.how-btn>div').hasClass('how-blurb-right')){
			$('#cargo').find('.how-btn>div').removeClass('how-blurb-right').addClass('how-blurb-left');
		}
	}
}










/* -------------------------------------------------------------------------------------------------- 
	
	ANIMATIONS

-------------------------------------------------------------------------------------------------- */



//! BUILD CONTENTS 

var windowTops = ['-51%','-54%','-49%'];

function animContents(page){
	if($('section[data-num="'+curSection+'"]').hasClass('hasAnim')){
		curPage = $('section[data-num="'+curSection+'"]').attr('id');
		openContents();
	}
}

function openContents(){
	
	// JOBS
	
	if(curPage == 'jobs'){
		// reset
		TweenMax.set('#jobs .col-left>*, .job-box', {opacity: 0})
		
		$('#jobs .col-left').children('p,h1').each(function(i){
			TweenMax.to(this, .5, {opacity:1})
		})
		TweenMax.to($('#jobs .col-left').children('.cta-btn'), .5, {delay:.3, startAt:{scaleX:0, scaleY:0}, scaleX:1, scaleY:1, opacity:1, ease:Elastic.easeOut, easeParams:[1,1.2]});
		
		$('.job-box').each(function(i){
			TweenMax.to(this, .75, {delay:.6+(i*.3), startAt:{rotationX:90, transformPerspective:600, opacity:1}, rotationX:0, transformOrigin:"center top", transformPerspective:600, ease:Elastic.easeOut, easeParams:[1,1]})
		})
	}
	
	
	// SAFETY
	
	if(curPage == 'safety'){
		// reset
		TweenMax.set($('#airplane-line'), {width: 0})
		TweenMax.set($('#safety-airplane'), {'display':'none', left: 140, top: 60})

		TweenMax.to($('#safety-airplane'), 2, {'display':'block', bezier:{type:"quadratic", values:[{x:0, y:-10},{x:200,y:-100},{x:400,y:-90}], autoRotate:["x","y","rotation",15,false]}});
		TweenMax.to($('#airplane-line'), 2, {width:380});
	}
	
	
	// ECONOMY
	
	if(curPage == 'economy'){
		// reset
		TweenMax.set($('#economy .window-cover'), {top: 0})
		TweenMax.set($('#economy .how-btn'), {opacity: 0})
		
		TweenMax.to($('.economy-window[data-num="1"]').find('.window-cover'), .75, {delay:0, top:windowTops[1], ease:Elastic.easeInOut, easeParams:[1,2]})
		TweenMax.to($('.economy-window[data-num="1"]').find('.how-btn'), .75, {delay:.3, startAt:{scaleX:0, scaleY:0}, scaleX:1, scaleY:1, opacity:1, ease:Elastic.easeInOut, easeParams:[1,1]})

		TweenMax.to($('.economy-window[data-num="0"]').find('.window-cover'), .75, {delay:.2, top:windowTops[0], ease:Elastic.easeInOut, easeParams:[1,2]})
		TweenMax.to($('.economy-window[data-num="0"]').find('.how-btn'), .75, {delay:.5, startAt:{scaleX:0, scaleY:0}, scaleX:1, scaleY:1, opacity:1, ease:Elastic.easeInOut, easeParams:[1,1]})

		TweenMax.to($('.economy-window[data-num="2"]').find('.window-cover'), .75, {delay:.4, top:windowTops[2], ease:Elastic.easeInOut, easeParams:[1,2]})
		TweenMax.to($('.economy-window[data-num="2"]').find('.how-btn'), .75, {delay:.7, startAt:{scaleX:0, scaleY:0}, scaleX:1, scaleY:1, opacity:1, ease:Elastic.easeInOut, easeParams:[1,1]})
	}
	
	
	if(curPage == 'cargo'){
		// reset
		TweenMax.set($('#cargo-belt, .icon-Package, #cargo-infographic h2, #cargo-infographic h1'), {'visibility': 'hidden'})
		TweenMax.set($('#cargo-legal'), {opacity: 0})
		
		winDif = (winW-1280)/2;
		if(winDif<0){winDif = 0;}
		cargoL1 = '18%';
		cargoL2 = '15%';
		
		TweenMax.set($('#cargo-belt'), {left:-$('#cargo-belt').width()-50, 'visibility':'visible'})
		$('#cargo-infographic').children().each(function(){
			TweenMax.set($(this), {left:-$(this).width()-(winDif)})
		})
		
		// account for mobile
		if(winW<400){cargoL1 = 75; cargoL2 = 75}
		
		TweenMax.to($('#cargo-belt'), 1, {startAt:{'visibility':'visible'}, left:0, ease:Elastic.easeInOut, easeParams:[1.5,4]})
		TweenMax.to($('#cargo-h1'), .75, {startAt:{'visibility':'visible'}, delay:.6, left:cargoL1, ease:Elastic.easeOut, easeParams:[1,4]})
		TweenMax.to($('#cargo-h2'), .5, {startAt:{'visibility':'visible'}, delay:.8, left:cargoL2, ease:Elastic.easeOut, easeParams:[1,4]})
		TweenMax.to($('.icon-Package'), .5, {startAt:{left:'-=100', 'visibility':'visible'}, delay:1.1, left:0, ease:Elastic.easeOut, easeParams:[1.5,4], onComplete:function(){
			$('#cargo-h1, #cargo-h2').css('left','');
		}})
	}
}








	

/* -------------------------------------------------------------------------------------------------- 
	
	SCROLL FUNCTIONS

-------------------------------------------------------------------------------------------------- */



//! STICKY NAV

var stickyOpen = false;
var stickySpacer = 70;
var topDif = $('#hero').height();

$(window).scroll(function(){
	if($(document).scrollTop() > topDif){					
		$('#subnav').css({'position':'fixed','top':0,'left':0})
		$('#stickySpacer').css({'height':stickySpacer+'px'})
		stickyOpen = true;
	} else {		
		$('#subnav').attr({'style':''})
		$('#stickySpacer').css({'height':'0px'})
		stickyOpen = false;
	}
	updateNav();
})



//! UPDATE BASED ON SCROLL POSITION

var curSection = -1;
var lastSection = -1;
var totalSections = 6;
var winT = 0;
var lastT = 0;
var navH = 70;
var autoMove = false;
var animatedStatus = [];
for(i=0;i<totalSections;i++){animatedStatus[i] = false;}

function updateNav(){
	winT = $(document).scrollTop();
	
	// scrolling down
	if(winT>=lastT && curSection<totalSections){
		if(winT >= $('section[data-num="'+(curSection+1)+'"]').offset().top-navH){
			if(curSection < totalSections-1){
				curSection++;
			
				// auto scrolled on load
				for(i=0;i<totalSections;i++){
					if(winT >= $('section[data-num="'+(curSection+1)+'"]').offset().top-navH && curSection < totalSections-1){curSection++;}
				}
			} else {
				curSection = 6;
			}
		}
	
	// scrolling up	
	} else {
		if(winT < $('section[data-num="'+curSection+'"]').offset().top-navH && curSection > 0){
			curSection--;
		}
	}
	
	// if changed, update nav	
	if(lastSection != curSection){
		if(!autoMove){
			activeNav = curSection;
			if(!mobile){
				moving = true;
				changeNav(curSection);
		    } else {
			    updateMobileNav();
		    }
	    }
	    
	    // setup animations
	    for(i=0;i<totalSections;i++){animatedStatus[i] = false;}
	    if(!animatedStatus[curSection]){
			animContents();
			animatedStatus[curSection] = true;
		}
	}
	
	lastT = winT;
	lastSection = curSection;	
}

function changeNav(num){
	$('#subnav').find('li').find('a').each(function(i){
		if($(this).parents('li').attr('data-num') == num){
			$(this).css('color','#fff');
			TweenMax.to($(this).siblings('.color-bar'), .3, {height:'100%', ease:Expo.easeOut});
		} else {
			$(this).css('color','');
			TweenMax.to($(this).siblings('.color-bar'), .5, {height:8, ease:Elastic.easeInOut, easeParams:[2,2.5]});
		}
	})
}










/* -------------------------------------------------------------------------------------------------- 
	
	GLOBAL PAGE FUNCTIONS

-------------------------------------------------------------------------------------------------- */



//! WINDOW RESIZING

var mobile = false;

$(window).resize(function(){
	winW = $(window).width();
	winH = $(window).height();
	
	topDif = $('#hero').height();
	updateElements();

	// mobile
	if(winW<=640){
		if(!mobile){
		mobile = true;
		stickySpacer = 45;
		navH = 43;	
		updateMobileNav();
		$('#subnav nav').hide();
		}
	
	// desktop
	} else {
		if(mobile){
			mobile = false;
			stickySpacer = 70;
			navH = 70;
			updateDesktopNav();
			$('#subnav nav').attr({'style':''});
		}
	}
})

$(window).resize();



//! INITIAL PAGE LOAD

$(document).ready(function(){
	heroImg = new Image();
	heroImg.src = 'images/hero-bg.jpg';
	$(heroImg).load(function(){
		$('#hero .slide').css('background-image','url('+heroImg.src+')');
		TweenMax.to($('#loader>div'), .3, {opacity:0, onComplete:function(){
			//clearInterval(spinner);
			$('#loader>div').removeClass('spinner');
		
			TweenMax.to($('#hero'), 1, {opacity:1})
			
			TweenMax.to($('#hero-h2'), .5, {delay:.6, opacity:1})
			TweenMax.to($('#hero-h1'), .5, {delay:.6, opacity:1})
			
			TweenMax.to($('#hero-cta'), .75, {delay:1, opacity:1, bottom:35, ease:Elastic.easeOut, easeParams:[2,2]})
			
			TweenMax.to($('#hero-marshall'), .6, {delay:1.5, bottom:0, ease:Elastic.easeOut, easeParams:[1.5,4]})
		}})
	})
})