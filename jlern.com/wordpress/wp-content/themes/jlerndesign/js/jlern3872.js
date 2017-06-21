// initial vars

var isHome = true;
var mobile = false;
var winW = $(window).width();
var winH;
var maxW;
var newW;
var shrinkRatio = 2.71;
var startingW = 0;
var startingH = 600;
var spacingGap = 15;
var initSC = .52;
var scFactor = 2500;
var startW = 1400;
var winBreak = 1200;
var centerPosX;
var centerPosY;
var vscrolls;
var moving = false;
var detailsH = 540;

var activePage = '';
var lastPage = -1;
var tierTop = 110;
var tierOpen = false;
var titleReplaced = false;
var subReplaced = false;
var origW = 0;
var isMobile = false;

if(winW<=652){
	mobile = true;
}

var vscrolls = [];
var startWidths = [500,700,400,670,690,500];
var modPercents = [.28,.16,.27,.28];
var mobileHeaders = [0, -88, -19, -21, -24, 0, 0];
var viewportStarts = [380,550,500];
var viewportOpens = [550,605,700];





/* ____________________________________________________________________________________________________________ */

// populate details dummy text


function setupDetails(){
	var tmpLines = '';
	for(i=0;i<18;i++){
		tmpRand = 70+Math.floor((Math.random() * 30) + 1); if(i%5==0){tmpRand = 90;} if(i%4==0){tmpRand = 100;} if(i==0){tmpRand = 98;}
		tmpLines += '<div class="line-fill" style="width:'+tmpRand+'%;'; if(i==9){tmpLines += ' visibility:hidden;';} tmpLines += '"></div>';
	}
	$('#module-details').find('.dummylines').html(tmpLines);
}


// populate thoughts dummy text

function setupThoughts(){
	var tmpLines = '';
	for(i=0;i<14;i++){
		tmpRand = 70+Math.floor((Math.random() * 30) + 1); if(i%5==0){tmpRand = 90;} if(i%4==0){tmpRand = 100;} if(i==0){tmpRand = 98;}
		tmpLines += '<div class="line-fill" style="width:'+tmpRand+'%;'; if(i==7){tmpLines += ' visibility:hidden;';} tmpLines += '"></div>';
	}
	$('#module-thoughts').find('.dummylines[data-num="0"]').html(tmpLines);
	
	var tmpLines = '';
	for(i=0;i<13;i++){
		tmpRand = 70+Math.floor((Math.random() * 30) + 1); if(i%5==0){tmpRand = 90;} if(i%4==0){tmpRand = 100;} if(i==12){tmpRand = 50;}
		tmpLines += '<div class="line-fill" style="width:'+tmpRand+'%;'; tmpLines += '"></div>';
	}
	$('#module-thoughts').find('.dummylines[data-num="1"]').html(tmpLines);
	
	// size up individual blog posts
	blogStartH = $('.dummymid').find('p').height()+20;
}

// grab more blogs

var blogOffset = 3;
var blogloader = '<div class="blog-loader"><div class="icon-loader"><div class="load-boxes"><div class="load-box"></div><div class="load-box"></div><div class="load-box"></div><div class="load-box"></div></div></div></div>';

function get_blogs(){
$.ajax({
	url: url+'wp-admin/admin-ajax.php',
	type: 'POST',
	data: {
        'action':'get_more_blogs',
        'offset' : blogOffset,
        'curYear' : curYear,
        'winW' : winW
    },
	
	success: function(result){	
		blogOffset += 3;
		$('.blog-others').append(result);
		if(!mobile){
			scrollLast = thoughtScroll.contentPosition;
		} else {
			scrollLast = $('#contentContainer').scrollTop();
		}
		
		// resize new blog containers
		$('.thought-row').each(function(i){
			tmpH = $(this).find('p').height()+20;
			if(i>0){
				$(this).css('height',tmpH);
			}
		})
		
		// move older button to bottom
		$('.blog-btn').remove();
		if(blogOffset<totalBlogs){
			$('.blog-others').append('<div class="blog-btn"><a href="#"></span><span>Older</span></a><div class="loader-wrap"></div></div>');
			setBlogBtn();	
		}
		
		// reset scroll, move back to position
		$(window).resize();
		if(!mobile){
			thoughtScroll.update(scrollLast);
		} else {
			$('#contentContainer').scrollTop(scrollLast);
		}
	}
});
}

function setBlogBtn(){
$('.blog-btn').children('a').click(function(){
	$('.loader-wrap').html(blogloader);
	TweenMax.to('.blog-btn', .5, {width:90, ease:Expo.easeOut})
	TweenMax.to('.loader-wrap', .5, {startAt:{left:34,opacity:0}, left:54, opacity:1, ease:Expo.easeOut})
	get_blogs();	
	return false;
})
}
setBlogBtn();


// end populate dummy text

/* ____________________________________________________________________________________________________________ */










/* ____________________________________________________________________________________________________________ */

// Initial setup of modules 


function setupModules(){
	
	setupDetails();
	setupThoughts();
	
	
	// resize module container to fit
	
	startingW = 0;
	$('.module').each(function(i){
		startingW += startWidths[i];
		startingW += spacingGap;
	})
	$('#modules').css('width',startingW);
	
	
	// hide contents before page load
	
	$('.module').each(function(){
		TweenMax.set($(this).find('.main-header').children('h1'), {opacity:0});
		if(!mobile){TweenMax.set(this, {scaleX:.7, scaleY:.7, opacity:0, marginRight:-50})}
		$(this).find('.row, .dummylines, .dummytop').append('<div class="mod-cover"></div>');
	})
	
	
	// shrink down module container for homepage and center
			
	winW = $(window).width();
	winH = $(window).height();
	
	centerPosX = winW/2-startingW/2;
	centerPosY = winH/2-startingH/2;
	
	if(!mobile){
		TweenMax.set('#modules', {scaleX:initSC, scaleY:initSC, left:centerPosX, top:centerPosY});
	}

	initResizer();
	setupRolls();	
	
	if(!mobile){
		goIntro();
		$('#mobile-loader').css({'opacity':0, 'display':'none'});
	} else {
		$('.mobile-mod').each(function(i){
			TweenMax.set($(this), {scaleX:.7, scaleY:.7, 'opacity':0});
			TweenMax.to($(this), .75, {delay:1.5+(i*.1), scaleX:1, scaleY:1, opacity:1, ease:Elastic.easeOut, easeParams:[2,2]})
		})
		$('.mobnav .menuLines').css('opacity',0);
		TweenMax.to($('#mobile-loader'), .2, {delay:1, opacity:0, 'display':'none'});
		TweenMax.to($('.mobnav .menuLines'), .3, {delay:1.3, opacity:1});
	}
	
	if(winW<1110 && !mobile){	
		$('.module:not(.module-dummy)').each(function(i){
	      tmpW = ((winW-24)*modPercents[i])/.44;
	      $(this).width(tmpW);
		})
	}
}

$(window).load(function(){
	setupModules();
})


// End initial module setup

/* ____________________________________________________________________________________________________________ */










/* ____________________________________________________________________________________________________________ */

// Intro animate modules into place


function goIntro(){
	
	// wait 1 second, then remove loader
	TweenMax.to('#top-loader', .5, {delay:.2, right:-10, ease:Expo.easeInOut});
	TweenMax.to('#globalNav', .5, {delay:.2, right:-48, ease:Expo.easeInOut, onComplete:function(){
	
		$('#modules').css('visibility','visible');
		$('.module').each(function(i){
		
			// zoom in boxes
			TweenMax.to(this, .75, {delay:.08*i, scaleX:1, scaleY:1, opacity:1, marginRight:0, ease:Expo.easeOut});
			
			// fade in contents
			TweenMax.to($(this).find('.mod-cover'), .75, {delay:.5+(.08*i), opacity:0});
			TweenMax.to($(this).find('.main-header').children('h1'), .75, {delay:.5+(.08*i), opacity:1});
			
			$('.nav-block').hide();			
		})
	
	}})

}

// End intro functions

/* ____________________________________________________________________________________________________________ */









/* ____________________________________________________________________________________________________________ */

// Adjust modules with browser size

//! ----------- Resize Function
function initResizer(){

$(window).resize(function(){
    
   	//console.log(winW)
    winW = $(window).width();
    winH = $(window).height();    
 	centerPosX = winW/2-startingW/2;
 	
 	// set mobile variable
 	if(winW<=652){
		mobile = true;
	} else {
		mobile = false;
	}	
	
	// going from desktop to mobile
	if(mobile && !isMobile){
		$('#modules').css({'top':'','left':''});
		$('#headerBar').css('width','');
		$('#mobile-home').css('overflow','');
		origW = winW;
		mobileOpen();
	}
	
	// going from mobile to desktop
	if(!mobile && isMobile){
		if(activePage!=''){
			$('#headerBar').css('width','100%');
		} else {
			centerPosY = winH/2-startingH/2;
			if(winH/2-startingH/2>-100){centerPosY = winH/2-startingH/2;}
			$('#modules').css({'top':centerPosY});
		}
		mobileClose();
	}

    
    // Homepage for desktop
    
    if(isHome && !mobile){
    	    
    	// reset container first    	
    	$('.contentSizer').css({'width':'100%','padding':'0'});
   	
    	// center module container    
	    if(winH/2-startingH/2>-100){centerPosY = winH/2-startingH/2;} // make sure top coordinate is a positive number
	    TweenMax.set('#modules', {left:centerPosX, top:centerPosY, width:startingW});
  
    	// if larger than 1200, scale modules    	
    	if(winW>winBreak){
    		if(winW<startW){
    			maxW = initSC-(startW-winW)/scFactor;
    			TweenMax.set('#modules', {scaleX:maxW, scaleY:maxW});			
    		} else{
    			maxW = initSC-(startW-winW)/(scFactor*2);
    			TweenMax.set('#modules', {scaleX:maxW, scaleY:maxW});
    		}
    	}
	
    	// if smaller than 1200, remove parts and keep scale same	    			
    	if(winW<=winBreak){
    		maxW = initSC-(startW-winBreak)/scFactor;
    		TweenMax.set('#modules', {scaleX:maxW, scaleY:maxW});			
    	}
	
    	// resize content sizer to shrink modules   	
    	if(winW<=1110 && winW>640){	    	
	    	// shrink widths of each module to fit screen	    		
	    	$('.module:not(.module-dummy)').each(function(i){
				tmpW = ((winW-24)*modPercents[i])/.44;
				$(this).width(tmpW);
		  	})    
		} else {
			$('.module:not(.module-dummy)').each(function(i){
				$(this).css('width','');
			});
		}
	}
	
	
	
	
	//! Resize tier pages
	 		
	else {
   
	    // center modules			
		if(!mobile){
			TweenMax.set('#modules', {left:centerPosX, top:tierTop});
		}
    
	    // resize module body to allow for scroll		
		if(tierOpen){			
			
			// responsive sizing down	
			if(winW<zoomWidths[activePage]+20){
				newW = winW-20;
				$('.module[data-num="'+activePage+'"]').css('width',newW);
			} else {
				$('.module[data-num="'+activePage+'"]').css('width',zoomWidths[activePage]);
			}						
			
			// additional tweaks
			if(activePage == 0){
				if(winW<940){
					$('#module-work').find('.thumbs-top').find('.contentBox>div').find('h2').css('line-height','35px');	
					if($('#module-work').find('.thumbs-top').find('.contentBox>div').find('h2').height()>=70){
						$('#module-work').find('.thumbs-top').find('.contentBox>div').find('h2').css('line-height','16px')
					}		
				} else {
					$('#module-work').find('.thumbs-top').find('.contentBox>div').find('h2').css('line-height','40px');
				}
				
				$('.thumb-info-contents').each(function(){
					$(this).css('margin-top',-$(this).height()/2);
				})
				
				// for tablet
				if(winW<zoomWidths[activePage]+20){
					expandW = winW-20;
				} else {
					expandW = zoomWidths[activePage];
				}
				
				// keep loader centered
				lH = $('.first-screen').height();
				if(lH>0){
				$('.project-loader').css({'height':lH});
				}
				
				// full number resizing to eliminate pixel shift
				intL = Math.round($('#module-work .module-body').width()*.67);
				intR = Math.round($('#module-work .module-body').width()*.32);
				$('#module-work .col-left').css('width',intL);
				$('#module-work .col-right').css({'width':intR});
				
				$('.thumb-box').each(function(){
					if(!$(this).hasClass('wide')){
						intW = Math.round($('#module-work .col-left').width()*.495);
						$(this).css('width',intW);
					}
				})
				if(!projectOpen){
					$('.thumbs-whitebg').css({'width':intW});
				}
				
				if(projectOpen && $('#project-screens').height()>0){
					$('.thumbs-whitebg').height($('#project-screens').height());
				}
				
				// correction for old Safari
				if(isSafari5){
					$('.thumb-info').each(function(){
						$(this).css('height',$(this).parent().height());
					});
				}
				
				// set height for vert blocks
				tM = Number($('.thumb-box[data-num="1"]').css('margin-bottom').split('px')[0]);
				tH = $('.thumb-box[data-num="1"]').height()*2+Math.floor(tM);
				$('.thumb-box.tall').css({'height':tH})
			}
			
			// vertical sizing
			if(activePage == 1){ // Details
			    tmpH = winH-183;
			    if(tmpH>detailsH){tmpH = detailsH;}
			    $('#module-details').find('.col-left').find('.dummylines').css({height:tmpH});
			    if($('#scrollbar-about').find('.scrollbar').css('display') == 'block'){$('#scrollbar-about').find('.scrollbar').css('visibility','visible')}
			}
			
			if(activePage == 3){ // Thoughts
				$('.thought-row').each(function(i){
					tmpH = $(this).find('p').height()+20;
					$(this).css('height',tmpH);
				})
			}
			
			
			//! Tablet tier resize
			// if tablet, adjust active tier section
			if(winW<1110){			
				
				if(activePage == 0){ // Work
					if(winW<760){
						$('.thumb-box[data-id="94"]').find('p').html('M&Ms Transformers');
					} else {
						$('.thumb-box[data-id="94"]').find('p').html('M&Ms Transformers Microsite');
					}
				}				
				
				if(activePage == 1){ // Details
					shortPct = ($('.skills').width()-185)/$('.skills').width()
					$('#module-details .meter-wrap').css('width',Math.ceil(shortPct*100)+'%');
					
					if(winW<905){
						tmpH = 20;
						$('#module-details').find('.col-left').find('p').each(function(i){
							tmpH += $(this).height();
							if(i>0){tmpH+=25;}
						})
						
						if(tmpH>(winH-183)){tmpH = winH-183;}
						
						$('#module-details').find('.col-left').find('.dummylines').css({height:tmpH});
					}
				}				
				
				if(activePage == 3){ // Thoughts					
					// shorten subheaders
					if(winW<1000){
						if(!subReplaced){
							$('.blog-header').each(function(i){
								tmpS = $(this).find('h3').attr('data-short');
								tmpS2 = $(this).find('h3').html();
								$(this).find('h3').html(tmpS).attr('data-short', tmpS2);
							})
							subReplaced = true;
						}
					} else {
						if(subReplaced){
							$('.blog-header').each(function(i){
								tmpS = $(this).find('h3').attr('data-short');
								tmpS2 = $(this).find('h3').html();
								$(this).find('h3').html(tmpS).attr('data-short', tmpS2);
							})
							subReplaced = false;
						}
					}
					
					// shorten long title
					if(winW<=840){
						if(!titleReplaced){
							$('.blog-header').each(function(i){
								tmpT = $(this).find('h2').attr('data-short');
								if(tmpT != ''){
									tmpT2 = $(this).find('h2').html();
									$(this).find('h2').html(tmpT).attr('data-short', tmpT2);
								}
							})
							titleReplaced = true;
						}
						
						TweenMax.set($('#module-thoughts').find('.dummylines[data-num="0"]'), {width:'100%'})
						TweenMax.set($('#module-thoughts').find('.dummylines[data-num="1"]'), {width:'0%'})
					} else {
						if(titleReplaced){
							$('.blog-header').each(function(i){
								tmpT = $(this).find('h2').attr('data-short');
								if(tmpT != ''){
									tmpT2 = $(this).find('h2').html();
									$(this).find('h2').html(tmpT).attr('data-short', tmpT2);
								}
							})
							titleReplaced = false;
						}
						
						if(!isIE9){
							TweenMax.set($('#module-thoughts').find('.dummylines'), {width:'49.5%'})
						}
					}
				}
				
			}

			if(mobile){
				newW = winW-20;
				newX = zoomX-((winW-origW)*(Number(activePage)+1));
				if(activePage == ''){newX = 10;}
				$('.module').each(function(){
					$(this).width(newW);
					$('.contentSizer').css({'margin-left':newX});
				})
				
				adjustMobilePages();				
			}
			
			if(!moving){
				setPage();
			}
		}
	
	}
	
	tablet = false;
	if(winW<=1110){
		tablet = true;
	}
		
// close window resizer
})

$(window).resize();

}

// End resize functions

/* ____________________________________________________________________________________________________________ */










/* ____________________________________________________________________________________________________________ */

// Module button actions


function setupRolls(){
	$('.module:not(.module-dummy)').each(function(){
		$(this).mouseover(function(){
			if(!mobile && $(this).attr('data-num') != activePage){
				TweenMax.to(this, .5, {scaleX:.97, scaleY:.97, ease:Expo.easeOut});
			}
		}).mouseleave(function(){
			TweenMax.to(this, .5, {scaleX:1, scaleY:1, ease:Expo.easeOut});			
		})
	
		$(this).click(function(){
			if(!mobile){
				if(!tierOpen){	
					zoomIn($(this).attr('data-num'));
				} else {
					removeContents($(this).attr('data-num'));
				}
			}
		})
		
	})
}

$('#globalNav').find('a:not(.home-btn)').each(function(i){
	$(this).click(function(){
		if($(this).attr('data-num') != activePage){
			if(!tierOpen){	
				zoomIn($(this).attr('data-num'));
			} else {
				removeContents($(this).attr('data-num'));
			}
		}
		return false;
	})
})


// End buttons actions

/* ____________________________________________________________________________________________________________ */










/* ____________________________________________________________________________________________________________ */

// Zoom into tier


var zoomX;
var zoomCoords = [902,337,-213,-908];
var zoomCoordsShort = [0,0,-274,0]
var zoomWidths = [1024,880,850,1000];

//! ----------- Zoom In
function zoomIn(a){
	isHome = false;
	activePage = a;
	disableActive();
		
	// determine x and width coordinates for active module
	zoomX = zoomCoords[a];
	//if(winW<=1110){zoomX = zoomCoordsShort[a];}
	expandW = zoomWidths[activePage];
	modW = $('.module[data-num="'+activePage+'"]').width();
	expandDif = expandW-modW;
	newW = startingW+expandDif;
	newMarg = zoomX-(expandDif)/2;
	
	if(winW<=1110){
		$('.module:not(.module-dummy)').each(function(i){
	    	TweenMax.to(this, .2, {width:startWidths[i+1], ease:Expo.easeOut});
	    })
	}
	
	TweenMax.to('.contentSizer', .5, {'marginLeft':zoomX, ease:Expo.easeOut, onComplete:function(){
		openPage();
	}});
	
	TweenMax.to('#modules', 1, {delay:.2, scaleX:1, scaleY:1, top:tierTop, ease:Expo.easeInOut});
	
	// extra padded dummy modules on ends
	if(a==0){TweenMax.to('.extra-filler-lt', .5, {left:395, ease:Expo.easeOut});}
	if(a==3){TweenMax.to('.extra-filler-rt', .5, {right:402, ease:Expo.easeOut});}
	
	// add header bar and change button bg
	TweenMax.set('#headerContainer', {height:60});
	TweenMax.to('#headerBar', .75, {width:'100%', ease:Expo.easeInOut, onComplete:function(){
		$('#globalNav').find('div[class^="icon-"]:not(.icon-jlerndesign)').each(function(){$(this).addClass('tier');}) 	
	}});

}



function zoomOut(){
	
	winW = $(window).width();
    winH = $(window).height();    
 	centerPosX = winW/2-startingW/2;
 	centerPosY = winH/2-startingH/2;
 	    
	if(winH/2-startingH/2>-100){centerPosY = winH/2-startingH/2;}	
 	
 	if(winW>winBreak){
		if(winW<startW){
			maxW = initSC-(startW-winW)/scFactor;
		} else{
			maxW = initSC-(startW-winW)/(scFactor*2);
		}
	} else {
		maxW = .44;
	}		
	
	// remove header bar and change button bg
	TweenMax.to('#headerBar', .75, {width:'0', ease:Expo.easeInOut, onComplete:function(){
		TweenMax.set('#headerContainer', {height:70});
		$('#globalNav').find('div[class^="icon-"]:not(.icon-jlerndesign)').each(function(){$(this).removeClass('tier');}) 	
	}});	
	
	// zoom out contents and center based on browser size	
	if(winH/2-startingH/2>-100){centerPosY = winH/2-startingH/2;} // make sure top coordinate is a positive number	
	
	// remove white covers
	TweenMax.to($('.module[data-num="'+lastPage+'"]').find('.mod-cover'), .5, {delay:.5, opacity:0});
	
	TweenMax.to('.contentSizer', .5, {delay:.2, 'marginLeft':0, ease:Expo.easeInOut, onComplete:function(){
		$('.contentSizer').css('margin','');
	}});
	
	TweenMax.to('#modules', 1, {delay:.2, scaleX:maxW, scaleY:maxW, top:centerPosY, left:centerPosX, width:startingW, ease:Expo.easeInOut, onComplete:function(){
		enableMod();
		isHome = true;
		tierOpen = false;
		activePage = '';
		
		// put start viewports back
		setViewports();
		
		if(lastPage == 0){
			$('#module-work').find('.project-items').find('.contentBox').hide();
		}
	}});	
	
	// extra padded dummy modules on ends
	TweenMax.to('.extra-filler-lt', .5, {left:-500, ease:Expo.easeOut});
	TweenMax.to('.extra-filler-rt', .5, {right:-500, ease:Expo.easeOut});	
	
	// shrink mod widths for tablet
	if(winW<1110){
		$('.module:not(.module-dummy)').each(function(i){
	    	tmpW = ((winW-24)*modPercents[i])/.44;
			TweenMax.to(this, .5, {delay:.2, width:tmpW, ease:Expo.easeInOut});
		})
	}
	
	// reset original col widths for sections
	if(lastPage == 2){ // contact
		TweenMax.to($('#module-contact').find('.col-left'), .75, {delay:.2, width:'57%', ease:Expo.easeOut});
		TweenMax.to($('#module-contact').find('.col-right'), .75, {delay:.2, width:'41.8%', 'marginLeft': '1.2%', ease:Expo.easeOut});
	}
	
	_gaq.push(['_trackEvent', 'Internal Page', 'home']);
}




function changePage(){
	
	disableActive();
	
	// determine x and width coordinates for active module
	zoomX = zoomCoords[activePage];
	expandW = zoomWidths[activePage];
	modW = $('.module[data-num="'+activePage+'"]').width();
	expandDif = expandW-modW;
	newW = startingW+expandDif;
	newMarg = zoomX-(expandDif)/2;
	
	// remove white covers
	TweenMax.to($('.module[data-num="'+lastPage+'"]').find('.mod-cover'), .75, {opacity:0});
	
	TweenMax.to($('#modules'), .75, {width:newW, ease:Expo.easeInOut});
	TweenMax.to('.contentSizer', .75, {'marginLeft':newMarg, ease:Expo.easeInOut, onComplete:function(){
		openPage();
		
		if(lastPage == 0){
			$('#module-work').find('.project-items').find('.contentBox').hide();
		}
	}});
	
	
	if(winW<=1110){
		$('.module:not(.module-dummy)').each(function(i){
	    	TweenMax.to(this, .2, {width:startWidths[i+1], ease:Expo.easeOut});
	    })
	}
	
	
	// reset original col widths for sections
	
	if(lastPage == 2){ // contact
		TweenMax.to($('#module-contact').find('.col-left'), .75, {width:'57%', ease:Expo.easeOut});
		TweenMax.to($('#module-contact').find('.col-right'), .75, {width:'41.8%', 'marginLeft': '1.2%', ease:Expo.easeOut});
	}
}



function disableActive(){
	$('.module[data-num="'+activePage+'"]').css({'cursor':'default'});
	TweenMax.to($('.module[data-num="'+activePage+'"]'), .5, {scaleX:1, scaleY:1, ease:Expo.easeOut});	
	$('.module[data-num="'+activePage+'"]').unbind('click');
}

function enableMod(){
	if(!mobile){
		$('.module[data-num="'+lastPage+'"]').removeClass('disabled').addClass('abled');
		$('.module[data-num="'+lastPage+'"]').css({'cursor':'pointer'});
	}
	$('.module[data-num="'+lastPage+'"]').click(function(){	
		if(!mobile){		
			if(!tierOpen){	
		    	zoomIn($(this).attr('data-num'));
		    } else{
		    	removeContents($(this).attr('data-num'));
		    }
	    }
	})
	$('.module[data-num="'+lastPage+'"]').mouseover(function(){
		if(!mobile && $(this).attr('data-num') != activePage){
			TweenMax.to(this, .5, {scaleX:.97, scaleY:.97, ease:Expo.easeOut});
		}
	}).mouseleave(function(){
		TweenMax.to(this, .5, {scaleX:1, scaleY:1, ease:Expo.easeOut});			
	})
}



//! ----------- Open Page
function openPage(){
	
	// google event tracking
	pageLabel = $('.module[data-num="'+activePage+'"]').attr('id').split('module-')[1];
	_gaq.push(['_trackEvent', 'Internal Page', pageLabel]);

	// for tablet
	if(winW<expandW+20){
		expandW = winW-20;
	}
	
	// set open viewports
	setOpenViewports();
		
	TweenMax.to($('.module[data-num="'+activePage+'"]').find('.mod-cover'), .3, {delay:0, opacity:1, onComplete:function(){
		$('.module[data-num="'+activePage+'"]').removeClass('abled').addClass('disabled');
		
		// stretch module to full width
		if(!tierOpen){
			TweenMax.to($('#modules'), .75, {width:newW, ease:Expo.easeOut});
			TweenMax.to($('.contentSizer'), .75, {'marginLeft':newMarg, width:'100%', ease:Expo.easeOut});
		}
		
		TweenMax.to($('.module[data-num="'+activePage+'"]'), .75, {width:expandW, ease:Expo.easeOut});
		
		
		// additional tweaks to module size / shape
		
		if(activePage == 0){ // work
			// set widths
			tW = (expandW*.322)-10;
			$('#module-work').find('.project-items').find('.contentBox>div').css('width',tW);
			
			// fix side links
			$('#module-work').find('.project-items').css({'padding':'0px'});
			$('#module-work').find('.project-items').find('.block-fill-lt, .work-lines').hide();	
			$('#module-work').find('.project-items').find('.contentBox').show();
			
			if(winW<1040){
				$('#module-work').find('.project-items').each(function(){
					if($(this).find('.work-item-txt').height()>70){
						newH = $(this).find('.work-item-txt').height()+13;
						TweenMax.to($(this), .5, {startAt:{'height':'70px'}, height:newH, ease:Expo.easeOut, onComplete:function(){
							$('#module-work').find('.project-items').css({'height':'auto'});
						}});
					}
				})	
			}				
			
			// side spacer
			TweenMax.to('.extra-filler-lt', .5, {left:233, ease:Expo.easeOut});
			
			// reformat layout
			intL = Math.round(expandW*.67);
			intR = Math.round(expandW*.32);
			TweenMax.to($('#module-work').find('.col-left'), .75, {width:intL, ease:Expo.easeOut});
			TweenMax.to($('#module-work').find('.col-right'), .75, {'display':'inline-block', width:intR, ease:Expo.easeOut});
			TweenMax.to($('#module-work').find('.thumbs-top'), .75, {'marginTop':-40, ease:Expo.easeInOut});
			
			// figure out responsive thumb height
			tH = 265;
			if(winW<1040){							
				if(!mobile){tRat = (((winW-20)*.67)*.495)/340;} else {tRat = ((winW-20)*.495)/340;}
				tH = Math.round(265*tRat);
			}
			$('#module-work').find('.icon-cross').hide();
			TweenMax.to($('#module-work').find('.thumbs-whitebg'), .5, {'marginTop':0, height:tH, ease:Expo.easeInOut});
			
			// adjust project list from dummy lines
			$('#module-work').find('.project-list').css({'height':'auto','overflow':'auto'});
			TweenMax.to($('#scrollbar-projects').find('.viewport'), .3, {height:349, ease:Expo.easeOut});
			$('#module-work').find('.scrollbar-wrap:not(#scrollbar-projects)').find('.scrollbar').css({top:0});
			$('.first-screen').css({'visibility':'hidden'});
			
			// slide thumb boxes into place
			tmpW = expandW*.67;
			intW = Math.round(tmpW*.495);
			TweenMax.set($('#module-work').find('.thumbs-whitebg'), {'display':'inline-block'});
			TweenMax.to($('#module-work').find('.thumbs-whitebg'), .5, {delay:.5, width:intW, ease:Expo.easeInOut});
			
			setTimeout(function(){
				$('#module-work').find('.thumb-box').each(function(i){				
					TweenMax.set(this, {'top':0, 'display':'inline-block', 'visibility':'hidden'});
				})
				$(window).resize();
				setPage();
			}, 800)
			
			setTimeout(function(){		
				$('#module-work').find('.thumb-box').each(function(i){
					TweenMax.to(this, .4, {delay:(i*.2), startAt:{'display':'inline-block','top':50,'visibility':'visible'}, 'top':0, opacity:1, ease:Expo.easeOut});
					if(i == 9){
						setTimeout(function(){setPage()},600)
					}
				})
			}, 900)	
		}
		
		if(activePage == 1){ // details
			TweenMax.to($('#module-details').find('.col-left'), .75, {width:'43%', ease:Expo.easeOut});
			TweenMax.to($('#module-details').find('.col-right'), .75, {'display':'inline-block', 'marginLeft':'1.2%', width:'55.8%', ease:Expo.easeOut});
			
			// set widths
			pW = (expandW*.43)-30;
			$('#module-details').find('.col-left').find('p').css('width',pW);
			
			aW = (expandW*.558);
			$('#module-details').find('.awards').find('.contentBox>div').css('width',aW);
			
			$('#module-details').find('.col-left').find('.contentBox').css({'display':'block'})
			
			// set size for bio
			tmpH = 20;
			$('#module-details').find('.col-left').find('p').each(function(i){
				tmpH += $(this).height();
				if(i>0){tmpH+=25;}
			})		
			if(tmpH>(winH-183)){tmpH = winH-183;}
			TweenMax.to($('#module-details').find('.col-left').find('.dummylines'), .75, {height:tmpH, ease:Expo.easeOut});
						
			$('.bio').find('.line-fill').hide();
			
			// add award links last
			$('#module-details').find('.icon-popup').each(function(i){
				//TweenMax.set($(this), {opacity:0, scaleX:.5, scaleY:.5});
				//TweenMax.to($(this), .5, {delay:2.9+(i*.3), opacity:1, scaleX:1, scaleY:1, ease:Elastic.easeOut, easeParams:[4,2]});
			})
		}
		
		if(activePage == 2){ // contact	
				
			// set widths
			tW = expandW
			$('#module-contact').find('button[type="submit"]').css('width',tW*.62);
			
			// for header text
			$('#module-contact').find('.dummytop').find('h2, h3').css('width',tW);
			startSize = Math.max(Math.min((tW-30) / (3.5*10)));
			if(startSize>22){startSize = 22;} if(startSize<18){startSize = 18;}
			$('#module-contact').find('.dummytop').find('h2').css({'font-size':startSize});
			
			iW = Math.round(expandW*.367);
			if(iW>312){iW = 312;}
			$('#module-contact').find('.contact-icons').find('.contentBox>div').css('width',iW);
			
			TweenMax.to($('#module-contact').find('.col-left'), .75, {width:'62%', ease:Expo.easeOut});
			TweenMax.to($('#module-contact').find('.col-right'), .75, {width:'36.8%', ease:Expo.easeOut});
			TweenMax.to($('#contactForm').find('.formTA'), .75, {height:280, ease:Expo.easeOut});
			TweenMax.to($('#module-contact').find('.map-box'), .75, {height:230, ease:Expo.easeOut});
			TweenMax.to($('#module-contact').find('.coffee-header'), .75, {height:40, display:'block', ease:Expo.easeOut});	
		}
		
		if(activePage == 3){ // thoughts
		
			// set widths
			hW = expandW*.7;
			$('.blog-header').find('.contentBox>div').css('width',hW);			
			$('#module-thoughts').find('.col-left').find('p').css('width',hW-30);
			
			tW = Math.round(expandW*.292)-10;
			$('#module-thoughts').find('.tweet-items').find('.contentBox>div').css('width',tW);
			
			TweenMax.to('.extra-filler-rt', .5, {right:557, ease:Expo.easeOut});
			
			TweenMax.to($('#module-thoughts').find('.col-left'), .75, {width:'70%', ease:Expo.easeOut});
			TweenMax.to($('#module-thoughts').find('.col-right'), .75, {'display':'inline-block', 'marginLeft':'0.8%', width:'29.2%', ease:Expo.easeOut});
			
			$('#module-thoughts').find('.first-blog').find('.contentBox').show();
			blogStartH = $('.dummymid').find('p').height()+20;
			TweenMax.to($('#module-thoughts').find('.first-blog'), .75, {height:blogStartH, ease:Expo.easeOut});
			
			// bring on image			
			$('#module-thoughts').find('.first-img').css({'display':'block','width':'100%'});
			$('#module-thoughts').find('.contentBoxi').css({'opacity':1,'display':'block'})
			$('#module-thoughts').find('.contentBoxi>div').css({'display':'block'})
			blogImgStartH = 164;
			blogImgRatio = hW/700;
			//console.log(blogImgRatio)
			blogImgH = Math.round(164*blogImgRatio);
			
			TweenMax.to($('#module-thoughts').find('.first-img'), .75, {startAt:{height:0}, height:blogImgH, marginBottom:8, ease:Expo.easeOut});
			
			if(winW<1000){
				if(!subReplaced){
					$('.blog-header').each(function(i){
						tmpS = $(this).find('h3').attr('data-short');
						tmpS2 = $(this).find('h3').html();
						$(this).find('h3').html(tmpS).attr('data-short', tmpS2);
					})
					subReplaced = true;
				}
			}
			
			if(winW<840 || isIE9){
				$(window).resize();
				TweenMax.to($('#module-thoughts').find('.dummylines[data-num="0"]'), .3, {width:'100%', ease:Expo.easeOut})
				TweenMax.to($('#module-thoughts').find('.dummylines[data-num="1"]'), .3, {width:'0%', ease:Expo.easeOut})
			}
		}
		
		setTimeout(function(){
			setPage();
			addContents();
			tierOpen = true;
									
		}, 750)
	}});

}


function setPage(){
	
	// take hold class off
	if($('.module[data-num="'+activePage+'"]').find('.overview').hasClass('hold-scroll')){
		$('.module[data-num="'+activePage+'"]').find('.overview').removeClass('hold-scroll');	
	}
	
	// resize module body to allow for scroll
	
	if(!mobile){ // mobile pages do not get scrollbars
	
	scrollH = winH-175;
	contentsH = $('.module[data-num="'+activePage+'"]').find('.overview').outerHeight();
	
	// for project scroller
	if(activePage == 0){
		//projectScroll.update();
		contentsH = ($('.module[data-num="'+activePage+'"]').find('.col-left').find('.overview').outerHeight());
		if(projectOpen){scrollH += -46;}
	}	
	
	// for details w/ 2 scroll areas
	if(activePage == 1){
	
		// for about scroll
		scrollH = winH-205
		contentsH = $('#scrollbar-about').find('.overview').outerHeight();
		if(contentsH>scrollH){
			$('#scrollbar-about').find('.scrollbar').css({'display':'block','opacity':1});
			$('#scrollbar-about').find('.viewport, .scrollbar-wrap').css('height',scrollH);
		} else {
			$('#scrollbar-about').find('.scrollbar').css('display','none');
			$('#scrollbar-about').find('.viewport, .scrollbar-wrap, .scrollbar').css('height',contentsH);
		}
		aboutScroll.update();
	
		// for awards scroll
		scrollH2 = winH-(175+246);
		if(scrollH2>352){scrollH2 = 352;}
		contentsH2 = $('#scrollbar1').find('.overview').outerHeight();	
		
		if(contentsH2>scrollH2){
			$('#scrollbar1').find('.scrollbar').css('display','block');
			$('#scrollbar1').find('.viewport, .scrollbar-wrap').css('height',scrollH2);
		} else {
			$('#scrollbar1').find('.scrollbar').css('display','none');
			$('#scrollbar1').find('.viewport, .scrollbar-wrap, .scrollbar').css('height',contentsH2);
		}
		
	} else {
	
	
	// all other areas
		
		if(contentsH>scrollH){
			$('.module[data-num="'+activePage+'"]').find('.scrollbar-wrap:not(#scrollbar-projects)').find('.scrollbar').css('display','block');
			$('.module[data-num="'+activePage+'"]').find('.scrollbar-wrap:not(#scrollbar-projects)').find('.viewport, .scrollbar-wrap').css('height',scrollH);
		} else {
			$('.module[data-num="'+activePage+'"]').find('.scrollbar-wrap:not(#scrollbar-projects)').find('.scrollbar').css('display','none');
			$('.module[data-num="'+activePage+'"]').find('.scrollbar-wrap:not(#scrollbar-projects)').find('.viewport, .scrollbar-wrap, .scrollbar').css('height',contentsH);
		}
	}
	vscrolls[activePage].update();
	
	} else { // is mobile, remove scrollbars
		$('.module[data-num="'+activePage+'"]').find('.scrollbar-wrap:not(#scrollbar-projects)').find('.scrollbar').css('display','none');
		$('#scrollbar-about').find('.scrollbar').css('display','none');
	}
}


$('.scrollbar').find('.thumb-inner').bind('mouseover', function() {
	TweenMax.to(this, .75, {opacity:.7, 'backgroundColor':'#111'});
}).bind('mouseout', function(){
	TweenMax.to(this, .5, {opacity:.4, 'backgroundColor':'#555'});
})
$('.scrollbar').find('.thumb-inner').bind('mousedown', function() {
	TweenMax.to(this, .75, {opacity:.7, 'backgroundColor':'#111'});
	$(this).unbind('mouseout');
	$('body').mouseup(function(){
		TweenMax.to($('.scrollbar').find('.thumb-inner'), .5, {opacity:.4, 'backgroundColor':'#555'})
		$('.scrollbar').find('.thumb-inner').bind('mouseout', function(){
			TweenMax.to(this, .5, {opacity:.4, 'backgroundColor':'#555'});
		})
	})
})

function setViewports(){
	$('#scrollbar0').find('.viewport').css('height',viewportStarts[0]);
	$('#scrollbar2').find('.viewport').css('height',viewportStarts[1]);
	$('#scrollbar3').find('.viewport').css('height',viewportStarts[2]);
}
function setOpenViewports(){
	$('#scrollbar0').find('.viewport').css('height',viewportOpens[0]);
	$('#scrollbar2').find('.viewport').css('height',viewportOpens[1]);
	$('#scrollbar3').find('.viewport').css('height',viewportOpens[2]);
}
setViewports();

function addContents(){

	// reset boxes for animate on
	$('.module[data-num="'+activePage+'"]').find('.contentBox').each(function(){
		TweenMax.set(this, {width:0});
	})
	
	// unfreeze scrollbar
	$('.module[data-num="'+activePage+'"]').find('.overview').attr('style','');

	if(activePage == 0){ // work
		loadingProject = true;
		cancelLoad = false;
		titleNum = 1;
		
		$('#scrollbar-projects').find('.scrollbar').css('display','block');
		projectScroll.update();
		
		$('.module[data-num="'+activePage+'"]').find('.contentBox').each(function(i){
			TweenMax.to(this, .5, {delay:.5+(i*.1), width:'100%', opacity:1, display:'block'})
		})
		
		setTimeout(function(){
			$('#module-work').find('.thumbs-whitebg').css('height','auto');
			loadingProject = false;
		}, 1000);
		
		setTimeout(function(){
			$('#module-work').find('.project-items').find('.contentBox>div').css('width','100%');
		}, 2000);
		
		// animate thumbs on		
		$('.thumbs-whitebg').css({'padding':0,'margin-top':0});
		$('.thumbs-whitebg').children('.thumb-img').css({'display':'block','opacity':1});
		$('.thumbs-whitebg').children('.block-fill-lt').hide();
		TweenMax.to($('.thumbs-whitebg').children('.mod-cover'), .3, {delay:.1, opacity:0, 'display':'none'});
	}
	
	if(activePage == 1){ // details	
		$('.module[data-num="'+activePage+'"]').find('.contentBox').each(function(i){
			if(i<2){
				TweenMax.to(this, .5, {delay:i*.1, width:'100%', opacity:1, 'display':'block', 'visibility':'visible'});
			} else {
				TweenMax.to(this, .3, {delay:.8+(i*.07), opacity:1, startAt:{width:'100%', 'display':'block'}, 'visibility':'visible'});				
			}
		})
		
		$('#scrollbar-about').find('.scrollbar').css({'visibility':'hidden','opacity':0});
		if($('#scrollbar-about').find('.scrollbar').css('display') == 'block'){TweenMax.to($('#scrollbar-about').find('.scrollbar'), .5, {delay:1, opacity:1, 'visibility':'visible'})}
		setTimeout(function(){
			$('#module-details').find('.col-left').find('p').css('width','100%');
			$('#module-details').find('.awards').find('.contentBox>div').css('width','100%');
		}, 1800);
		
		// if tablet, shrink bars
		if(winW<1110){
			shortPct = ($('.skills').width()-185)/$('.skills').width()
			$('#module-details .meter-wrap').css('width',Math.ceil(shortPct*100)+'%');
		}	
	
		$('.skill-line').each(function(i){
			tmpW = $(this).attr('data-percent');
			TweenMax.set($(this).find('.skill-meter'), {width:0});
			TweenMax.to($(this).find('.skill-meter'), .75, {delay:.1+(i*.05), width:tmpW+'%', ease:Expo.easeInOut});
		})
	}
	
	if(activePage == 2){ // contact
		$('#module-contact').find('.contact-icons').find('.contentBox, .contentBox>div').css({'overflow':'hidden'});			
		$('.module[data-num="'+activePage+'"]').find('.contentBox').each(function(i){
			TweenMax.to(this, .5, {delay:i*.1, width:'100%', opacity:1, display:'block'})
		})
		
		setTimeout(function(){
			$('#module-contact').find('button[type="submit"]').css('width','100%');
			$('#module-contact').find('.dummytop').find('h2, h3').css('width','100%');
			$('#module-contact').find('.contact-icons').find('.contentBox>div').css({'width':'100%'});
			$('#module-contact').find('.contact-icons').find('.contentBox, .contentBox>div').css({'overflow':'visible'});			
		}, 1500);
		
		$('#location').css({'margin-top':-41, 'opacity':0});
		TweenMax.to('#location', .5, {delay:1.4, 'marginTop':-11, opacity:1, display:'block', ease:Elastic.easeOut, easeParams:[4,3]})
	}
	
	if(activePage == 3){ // thoughts
		$('.module[data-num="'+activePage+'"]').find('.contentBox').each(function(i){
			if(i<3){
				TweenMax.to(this, .5, {delay:i*.1, width:'100%', opacity:1, display:'block'});
			} else {
				TweenMax.to(this, .5, {delay:.2+(i*.05), width:'100%', opacity:1, display:'block'});
			}
		})
		
		// fade on image
		TweenMax.to($('#module-thoughts').find('.contentBoxi').children('div'), .5, {delay:.2, opacity:1, display:'block'});
		
		setTimeout(function(){
			$('#module-thoughts').find('.tweet-items').find('.contentBox>div').css('width','100%');
			$('.blog-header').find('.contentBox>div').css('width','100%');
			$('#module-thoughts').find('.col-left').find('p').css('width','100%');
			$('#module-thoughts').find('.first-img').css('height','auto')
		}, 1500);
	
		TweenMax.set('.blog-others', {display:'block', opacity:0});
		
		$('.thought-row').each(function(i){
			tmpH = $(this).find('p').height()+20;
			if(i>0){
				$(this).css('height',tmpH);
			}
		})
		
		setPage();
		
		TweenMax.to('.blog-others', .5, {startAt:{'marginTop':80}, delay:1.1, 'marginTop':30, opacity:1, ease:Expo.easeOut, onComplete:function(){setPage();}})
	}
	
	lastPage = activePage;
}


function setupScrollbars(){
	$('.module').each(function(i){
		if(i==1){
			$('#scrollbar'+i).tinyscrollbar({ thumbSize: 70});
		} else {
			$('#scrollbar'+i).tinyscrollbar({ thumbSize: 120});
		}
		
		vscrolls[i] = $('#scrollbar'+i).data("plugin_tinyscrollbar");
	})	
	i = 4;
	$('#scrollbar-projects, #scrollbar-about').tinyscrollbar({ thumbSize: 120});
	projectScroll = $('#scrollbar-projects').data("plugin_tinyscrollbar"); 
	thoughtScroll = $('#scrollbar3').data("plugin_tinyscrollbar");
	aboutScroll = $('#scrollbar-about').data("plugin_tinyscrollbar");
	$('#scrollbar-projects').find('.scrollbar').css('display','none');
	$('#scrollbar-projects').find('scrollbar').addClass('disable')
}

// End zoom

/* ____________________________________________________________________________________________________________ */











/* ____________________________________________________________________________________________________________ */

// Close out of page
var cancelLoad = false;

function removeContents(id){
	TweenMax.killAll();
	activePage = id;
	del = .3;

	// slide scroll back up in necessary
	TweenMax.to($('.module[data-num="'+lastPage+'"]').find('.overview'), .3, {top:0, ease:Expo.easeOut, onComplete:function(){
		$('.module[data-num="'+lastPage+'"]').find('.overview').attr('style','top:0px !important');
		$('.module[data-num="'+lastPage+'"]').find('.overview').addClass('hold-scroll');
	}});
	$('.module[data-num="'+lastPage+'"]').find('.scrollbar-wrap:not(#scrollbar-projects)').find('.scrollbar').css('display','none');


	// animate off all boxes
	if(lastPage != 0 && lastPage != 3){
		$('.module[data-num="'+lastPage+'"]').find('.contentBox').each(function(){
			TweenMax.set(this, {width:'100%'})
			TweenMax.to(this, .3, {opacity:0, display:'none'})
		})
	}


	if(lastPage == 0){ // work	
		cancelLoad = true;
		//TweenMax.to($('#project-screens'), .5, {opacity: 0, 'display':'none', 'top':0, ease:Expo.easeOut});
		//TweenMax.to('.screens-others', .5, {'marginTop':80, opacity:0, 'display':'none', ease:Expo.easeOut});
		
		del = .6;
			
		// remove thumb boxes first, then change layout
		$('#module-work').find('.thumb-box').each(function(i){
			//$(this).css('width','');
			TweenMax.to(this, .3, {opacity:0, top:50, 'display':'none', ease:Expo.easeInOut});
		})
		TweenMax.to($('.thumbs-whitebg').children('.mod-cover'), .3, {opacity:1, 'display':'block', onComplete:function(){
			$('.thumbs-whitebg').children('.thumb-img').hide();
			$('.thumbs-whitebg').children('.block-fill-lt').show();
			$('.thumbs-whitebg').css({'padding':10});
		}});	
		
		tH = 265;
		if(winW<1040){							
			if(!mobile){tRat = (((winW-20)*.67)*.495)/340;} else {tRat = ((winW-20)*.495)/340;}
			tH = Math.round(265*tRat);
		}
			
		$('#module-work').find('.thumbs-whitebg').css('height',tH);
		TweenMax.to($('#module-work').find('.thumbs-whitebg'), .3, {delay:.3, width:'100%', ease:Expo.easeOut});
		
		// revert side links
		TweenMax.to($('#module-work').find('.project-items').find('.contentBox'), .3, {opacity:0, ease:Expo.easeOut});
		TweenMax.to($('#module-work').find('.project-items'), .3, {delay:.3, 'padding':'5px', 'height':'70px', ease:Expo.easeOut});	
		TweenMax.to($('#module-work').find('.project-items').find('.block-fill-lt, .work-lines'), .3, {delay:.3, 'display':'block','opacity':1, ease:Expo.easeOut});
		
		// revert side link header
		TweenMax.set($('#module-work').find('.projectlist-header').find('.contentBox'), {width:'100%'})
		TweenMax.to($('#module-work').find('.projectlist-header').find('.contentBox'), .3, {opacity:0, display:'none'})
		
		// delay before shifting layout parts
		TweenMax.set($('#module-work').find('.thumbs-top').find('.contentBox'), {'opacity':0});	
		TweenMax.to($('#module-work').find('.thumbs-top'), .3, {delay:.6, 'marginTop':0, 'marginBottom':0, ease:Expo.easeOut});
		TweenMax.to($('#module-work').find('.thumbs-whitebg'), .3, {delay:.6, height:360, 'marginTop':6, ease:Expo.easeOut});
		TweenMax.to($('#scrollbar0').find('.viewport'), .3, {delay:.6, height:550, ease:Expo.easeOut});
		
		// resize columns
		TweenMax.to($('#module-work').find('.col-left'), .3, {delay:del, width:'67%', ease:Expo.easeOut});
		TweenMax.to($('#module-work').find('.col-right'), .3, {delay:del, 'display':'inline-block', width:'32%', ease:Expo.easeOut});
							
		// adjust project list
		$('#scrollbar-projects').find('.scrollbar').css('display','none');
		$('#module-work').find('.project-list').css({'height':349,'overflow':'hidden'});
		TweenMax.to($('#scrollbar-projects').find('.viewport'), .75, {height:304, ease:Expo.easeOut});
		
		// if portfolio open, close
		if(projectOpen){
		if($('.first-screen').height() == 0){tmpWH = 400;} else {tmpWH = $('.first-screen').height();}
		$('.thumbs-whitebg').css({'width':'100%', 'height':tmpWH});
		TweenMax.to($('#project-screens'), .5, {opacity: 0, 'display':'none', 'top':0, ease:Expo.easeOut});
		TweenMax.to('.screens-others', .5, {'marginTop':80, opacity:0, 'display':'none', ease:Expo.easeOut});
		TweenMax.to('#workHeader', .5, {top:0, ease:Expo.easeOut});
		TweenMax.to($('#projectHeader'+titleNum), .5, {top:65, ease:Expo.easeOut});
		}
		
		// remove thumb screen parts
		setTimeout(function(){
			$('.module[data-num="'+lastPage+'"]').find('.contentBox').each(function(i){
			if(i<2){
				TweenMax.set(this, {width:'100%', opacity:0, display:'none'})
			}
			})
			TweenMax.to($('#module-work').find('.icon-cross'), .3, {startAt:{opacity:0}, opacity:1, 'display':'block'});
			
		}, 1500)
	}
	
	if(lastPage == 1){ // details
		TweenMax.to($('#module-details').find('.col-left'), .75, {delay:.3, width:'100%', ease:Expo.easeInOut});
		TweenMax.to($('#module-details').find('.col-right'), .4, {delay:.2, 'display':'inline-block', 'marginLeft':'0%', width:'0%', ease:Power2.easeInOut});
		
		TweenMax.to($('#module-details').find('.col-left').find('.dummylines'), .5, {height:490, ease:Expo.easeOut, onComplete:function(){
		    $('.bio').find('.line-fill').show();
		}});
	}
	
	if(lastPage == 2){ // contact	
		TweenMax.to($('#module-contact').find('.col-left'), .75, {delay:.3, width:'57%', ease:Expo.easeInOut});
		TweenMax.to($('#module-contact').find('.col-right'), .75, {delay:.3, width:'41.8%', 'marginLeft': '1.2%', ease:Expo.easeInOut});	
		
		TweenMax.to('#location', .3, {opacity:0, display:'none'})		
		TweenMax.to($('#contactForm').find('.formTA'), .75, {height:190, ease:Expo.easeOut});
		TweenMax.to($('#module-contact').find('.map-box'), .75, {height:200, ease:Expo.easeOut});
		TweenMax.to($('#module-contact').find('.coffee-header'), .5, {height:0, 'padding':0, 'display':'none', ease:Expo.easeOut});
	}
	
	if(lastPage == 3){ // thoughts	
		del = .5;
		$('#module-thoughts').find('.tweet-items').find('.contentBox>div').each(function(){
			$(this).css('width',$(this).width());
		})
			
		$('.module[data-num="'+lastPage+'"]').find('.col-left').find('.contentBox').each(function(i){
			if(i<3){
				TweenMax.set(this, {width:'100%'})
				TweenMax.to(this, .3, {opacity:0, display:'none'})
			}
		})
		
		$('.module[data-num="'+lastPage+'"]').find('.col-right').find('.contentBox').each(function(){
			TweenMax.to(this, .3, {opacity:0})
		})
		
		// remove image
		TweenMax.to($('.module[data-num="'+lastPage+'"]').find('.contentBoxi').children('div'), .3, {opacity:0, display:'none'});
		TweenMax.to($('#module-thoughts').find('.first-img'), .3, {delay:0, height:0, marginBottom:0, ease:Expo.easeOut});
		
		TweenMax.to('.blog-others', .5, {'marginTop':200, opacity:0, 'display':'none', ease:Expo.easeOut});
		TweenMax.to($('#module-thoughts').find('.dummymid'), .5, {height:380, ease:Expo.easeInOut});
		
		TweenMax.to($('#module-thoughts').find('.col-left'), .75, {delay:.5, width:'100%', ease:Expo.easeInOut});
		TweenMax.to($('#module-thoughts').find('.col-right'), .4, {delay:.4, 'display':'none', 'marginLeft':'0%', width:'0%', ease:Power2.easeInOut});
		
		if($('#module-thoughts').find('.dummylines[data-num="0"]').width() > 400){
			TweenMax.to($('#module-thoughts').find('.dummylines[data-num="0"]'), .3, {width:'49.5%', ease:Expo.easeOut})
			TweenMax.to($('#module-thoughts').find('.dummylines[data-num="1"]'), .3, {width:'49.5%', ease:Expo.easeOut})
		}		
	}
	
	
	lastModW = startWidths[Number(lastPage)+1];		
	TweenMax.to($('.module[data-num="'+lastPage+'"]'), .5, {delay:del, width:lastModW, ease:Power2.easeInOut, onComplete:function(){
		if(id == 'home'){
			zoomOut();
			activePage = '';
		} else {
			changePage(activePage);
		}
	}});			
	
	if(lastPage == 0 && projectOpen){
		setTimeout(function(){enableMod();}, 500);
		projectOpen = false;
		titleNum = 1;
	} else {
		enableMod();
	}
}


// Go Home

$('#logo').click(function(){
	if(!isHome){
		if(!mobile){
			removeContents('home');
		} else {
			setTimeout(function(){
				openPageMobile(-1);
			}, 500)
			
			// close menu
			TweenMax.to('#headerContainer', .5, {top:0, ease:Expo.easeInOut})
			TweenMax.to('#mobileClose', .3, {opacity:0, 'display':'none'});
			TweenMax.to('.mobnav', .3, {opacity:1, 'display':'block'});
		}
	}
	return false;
})


// End close out of page

/* ____________________________________________________________________________________________________________ */










/* ____________________________________________________________________________________________________________ */

// Contact Form

var sending = false;

$('#contactForm').find('button[type="submit"]').mouseover(function(){
	TweenMax.to($(this).children('.submit-roll'), .5, {right:0, ease:Expo.easeOut});
	TweenMax.to($(this).children('.icon-paperplane'), .5, {color:'#9ccb3b', ease:Expo.easeOut});
})
$('#contactForm').find('button[type="submit"]').mouseleave(function(){
	if(!sending){
	TweenMax.to($(this).children('.submit-roll'), .5, {right:-60, ease:Expo.easeOut});
	TweenMax.to($(this).children('.icon-paperplane'), .5, {color:'#fff', ease:Expo.easeOut});
	}
})
$('#contactForm').submit(function(){
	TweenMax.to($(this).find('.submit-roll'), .3, {right:-60, ease:Expo.easeOut});	
	validateForm();
	return false;
})

function validateForm(){
	var vNum = 0;
	m=0;
	$('[data-rel="req"]').each(function(){
		if($(this).val() == ""){
			vNum++;
			alert("Please fill in all fields.");
			return false; 
		}
		m++;
	});
	
	// check email
	if(vNum == 0){
		if($('input[name="email"]').val().indexOf("@") == -1 || $('input[name="email"]').val().indexOf(".") == -1){
			alert("Please use a valid email address.");
			return false; 
		}
	}
		
	if(vNum==0){
		sendForm();
	}
}

function sendForm(){
	sending = true;
	var name = $('input[name="name"]').val();
	var email = $('input[name="email"]').val();
	var comments = $('textarea[name="comments"]').val();
		
	TweenMax.to($('#contactForm').find('.submit-roll'), .3, {right:-60, ease:Expo.easeOut});
	TweenMax.to($('#contactForm').find('.submit-sending'), .5, {display:'block', delay:.2, right:0, ease:Expo.easeOut});
	
	$('[data-rel="req"]').each(function(){
		TweenMax.to(this, .3, {opacity:.3});
	})	
		
	$.ajax({
		url: path+'scripts/form.php',
		type: 'POST',
		data: 'name=' + name + '&email=' + email + '&comments=' + comments,
		
		success: function(result){			
			TweenMax.to($('#contactForm').find('.submit-sending'), .3, {display:'none', delay:1.5, right:-60, ease:Expo.easeOut});				
			TweenMax.to($('#contactForm').find('.submit-thanks'), .5, {delay:1.7, right:0, ease:Expo.easeOut});		
			$('[data-rel="req"]').each(function(){
				TweenMax.to(this, .3, {delay:1.7, opacity:1, onStart:function(){
					$('[data-rel="req"]').val('');
					
					// for IE9
					if(isIE9){
						$('input').each(function(){$(this).val($(this).attr('placeholder'));})
						$('textarea[name="comments"]').html('Comments');
					}	
				}});		
			})			
			sending = false;					
		}
	});
		
	return false;
}

$('#contactForm').find('input[type="text"],textarea').click(function(){
	if($('.submit-thanks').css('right') == '0px'){
		TweenMax.to($('#contactForm').find('.submit-thanks'), .3, {right:-140, ease:Expo.easeOut});
	}
})


// End Contact Form

/* ____________________________________________________________________________________________________________ */










/* ____________________________________________________________________________________________________________ */

// Portfolio Navigation / View Projects


var projectOpen = false;
var titleNum = 1;
var imageURLs = [];
var loadingProject = false;

$('#module-work').find('.overview').attr('style','top:0px !important;');

$('.thumb-img, .thumb-box').click(function(){
if(!loadingProject){
	activeID = $(this).attr('data-id');
	activeTitle = $('.project-items[data-id="' + activeID + '"]').find('h3').text(); 
	activeTasks = $('.project-items[data-id="' + activeID + '"]').find('em').text();
	activeLink = $(this).attr('data-link');
	
	openProject();
	loadingProject = true;
}
})

$('.project-items').find('.contentBox').click(function(){
if(!loadingProject){
	activeID = $(this).parents('.project-items').attr('data-id');
	activeTitle = $(this).find('h3').text();
	activeTasks = $(this).find('em').text();
	activeLink = $(this).parents('.project-items').attr('data-link');

	if(!projectOpen){
		openProject();
	} else {
		changeProject();
	}
	
	loadingProject = true;
}
})

function openProject(){
	TweenMax.killTweensOf($('#module-work').find('.thumb-box'));
	
	// for mobile, slide scroll back up first
	if(mobile){
	if($('#contentContainer').scrollTop()>0){
		TweenMax.to('#contentContainer', .5, {scrollTop:0, ease:Expo.easeInOut});
		mDel = .5;
	}
	}

	// remove thumbs if still showing
	
	if(!projectOpen){
		
		// slide scroll back up in necessary
		moving = true;
		TweenMax.to($('#module-work').find('.col-left').find('.overview'), .4, {top:0, ease:Power2.easeInOut, onComplete:function(){
			$('#module-work').find('.col-left').find('.overview').attr('style','top:0px !important;');
			$('#module-work').find('.col-left').find('.overview').addClass('hold-scroll');
			moving = false;
		}});
		
		$('#module-work').find('.col-left').find('.thumb').attr('style','top:0px !important; height: 120px; opacity:0; display:none;');
		$('#module-work').find('.scrollbar-wrap:not(#scrollbar-projects)').find('.scrollbar').css({'display':'none'});
	
	
		$('.thumb-box').each(function(i){
			TweenMax.to(this, .3, {delay:.2, opacity:0, 'display':'none'});
		})
		TweenMax.to($('.thumbs-whitebg').children('.mod-cover'), .3, {delay:.2, opacity:1, 'display':'block'});
		TweenMax.to($('.thumbs-whitebg').children('.thumb-img'), .3, {delay:.2, opacity:0, 'display':'none'});
		$('.thumbs-whitebg').css({'height':$('.thumbs-whitebg').height()});
		TweenMax.to($('.thumbs-whitebg'), .3, {delay:.5, width:'100%', ease:Expo.easeOut});
		
		TweenMax.to($('#module-work').find('.thumbs-top'), .75, {delay:.6, 'marginTop':0, 'marginBottom':6, ease:Expo.easeInOut});		
		
		TweenMax.set($('.project-loader'), {opacity:1, display:'table'});
		
		if(winW<1040){
			tmpH = 400;
			if(!mobile){sRat = (winW*.653)/686;} else {sRat = (winW-20)/686;}
			sH = Math.round(tmpH*sRat);
			TweenMax.to($('.thumbs-whitebg, .project-loader'), .5, {delay:.6, height:sH, ease:Expo.easeInOut});
		} else {
			TweenMax.to($('.thumbs-whitebg'), .5, {delay:.6, height:400, ease:Expo.easeInOut});
			TweenMax.set($('.project-loader'), {height:400});
		}
	}
	
	// bring on title
	
	// reduce title if necessary
	if(winW<500){
		if(activeTitle == 'iCarly Nintendo DS Game'){activeTitle = 'iCarly Game';}
		if(activeTitle == 'M&Ms Transformers Microsite'){activeTitle = 'M&Ms Transformers';}
		if(activeTitle == 'Longwood Gardens Game'){activeTitle = 'Longwood Gardens';}
		if(activeTitle == 'The Palmer Apartments'){activeTitle = 'The Palmer Apts';}
		if(activeTitle == 'The Square Apartments'){activeTitle = 'The Square Apts';}
	}
	
	if($('#workHeader').position().top >= -1){
		$('#projectHeader1').find('h1').html(activeTitle);
		TweenMax.to('#workHeader', .5, {delay:1.2, top:-60, ease:Expo.easeOut});
		TweenMax.to($('#projectHeader'+titleNum), .5, {delay:1.2, startAt:{top:65}, top:-5, ease:Expo.easeOut});
	} else {
		if(titleNum == 1){
			$('#projectHeader2').find('h1').html(activeTitle);
			TweenMax.to($('#projectHeader'+titleNum), .5, {delay:.25, top:-65, ease:Expo.easeOut});
			TweenMax.set($('#projectHeader'+2), {top:65});
			TweenMax.to($('#projectHeader'+2), .5, {delay:.25, top:-5, ease:Expo.easeOut});
			titleNum = 2;
		} else {
		$('#projectHeader1').find('h1').html(activeTitle);
			TweenMax.to($('#projectHeader'+titleNum), .5, {delay:.25, top:-65, ease:Expo.easeOut});
			TweenMax.set($('#projectHeader'+1), {top:65});
			TweenMax.to($('#projectHeader'+1), .5, {delay:.25, top:-5, ease:Expo.easeOut});
			titleNum = 1;
		}	
	}
	
	// bring on tasks
	
	hW = (expandW*.67);
	if(mobile){hW = winW-20;}
	$('#module-work').find('.thumbs-top').find('.contentBox>div').css('width',hW);
	$('.thumbs-top').find('h2').html(activeTasks);	
	$('#module-work').find('.thumbs-top').find('.contentBox').width(0);
	
	$('#module-work').find('.thumbs-top').find('.contentBox').css('display','block');
	$(window).resize();
	
	// hide or populate link
	if(activeLink != ''){
		$('.project-link').css({'width':70});
		$('.project-link').find('.icon-link').parent('a').show();
		$('.project-link').find('.icon-link').parent('a').attr('href',activeLink);
	} else {
		$('.project-link').css({'width':40});
		$('.project-link').find('.icon-link').parents('a').hide();
	}
	
	if(!projectOpen){tdelay = 1.3;} else {tdelay = .35;}
	TweenMax.to($('#module-work').find('.thumbs-top').find('.contentBox'), .3, {delay:tdelay, width:'100%', opacity:1, display:'block', onComplete:function(){
		$('#module-work').find('.thumbs-top').find('.contentBox>div').css('width','100%');
	}});
	
	TweenMax.to($('#project-screens'), .5, {delay:1.2, opacity:1, 'display':'block', onComplete:function(){
		query_project();
		$('#module-work').find('.scrollbar-wrap:not(#scrollbar-projects)').find('.scrollbar').css({'top':46});
	}});
	
	projectOpen = true;
}


// query project screens

function query_project(){
$.ajax({
	url: url+'wp-admin/admin-ajax.php',
	type: 'POST',
	data: {
        'action':'project_search',
        'id' : activeID
    },
	
	success: function(result){	
		imageURLs = [];
		tmpImages = result.split(',');
		
		$(tmpImages).each(function(i){
			if(tmpImages[i] != ''){
				if(hasRetina){
					tmpName = tmpImages[i].split('.jpg');
					imageURLs[i] = tmpName[0] + '@2x' + '.jpg';
				} else{
					imageURLs[i] = tmpImages[i];
				}	
			}
		})
		
		cur_img = 0;
		tmpWidths = [];
		insertImgFn();		
	}
});
}

var tmpWidths = [];
	
function insertImgFn(){
	img = new Image();	
	img.onerror = function(){
		console.log('error loading');
	}	
	img.onload = function(){
	if(!cancelLoad){
		if(hasRetina){
			tmpWidths[cur_img] = this.width/2;
			tmpH = this.height/2
		} else {
			tmpWidths[cur_img] = this.width;
			tmpH = this.height;
		}
				
		
		// adjust height of holder if necessary		
		if(cur_img == 0){
			
			pDel = 0;
			
			// figure out responsive first screen height if necessary
			if(winW<1040){
				if(!mobile){sRat = $('#module-work .col-left').width()/686;} else {sRat = (winW-20)/686;}
				sH = Math.round(tmpH*sRat);
				if($('.thumbs-whitebg, .project-loader').height() != sH){
					TweenMax.to($('.thumbs-whitebg, .project-loader'), .5, {height:sH, ease:Expo.easeInOut}); pDel = .5;
				}
				loadH = sH;
			} else {	
				if($('.thumbs-whitebg').height()>400 && tmpH<=400){TweenMax.to($('.thumbs-whitebg, .project-loader'), .5, {height:400, ease:Expo.easeInOut}); pDel = .5;}
				if(tmpH>400){TweenMax.to($('.thumbs-whitebg, .project-loader'), .5, {height:tmpH, ease:Expo.easeInOut}); pDel = .5;}
				loadH = tmpH;
			}
		} 
		
		
		cur_img++;
		if(cur_img<imageURLs.length){
			insertImgFn();
		} else {
			showImages();
		}
	} else {
		cancelLoad = false;}
	}
	img.src = imageURLs[cur_img];
}


function showImages(){
	
	$('.screens-others').empty();
	
	$(imageURLs).each(function(i){
		if(i>0){
			if(tmpWidths[i] == 340){
				$('.screens-others').append('<div class="short-img"><img src="' + imageURLs[i] + '" width="100%"></div>');
			} else {
				$('.screens-others').append('<img src="' + imageURLs[i] + '" width="100%">');
			}
		}
	})
	
	//  bring on first screen
	TweenMax.to($('.project-loader'), .5, {delay:pDel, opacity:0, 'display':'none', onStart:function(){
		// add loaded images
		$('.project-loader').height(loadH);
		$('.first-screen').attr('src',imageURLs[0]).css({'width':'100%', 'visibility':'visible'});				
	}})	
		
	// bring on other screens
	TweenMax.set('.screens-others', {display:'block', opacity:0, 'marginTop':0});
	TweenMax.to('.screens-others', .85, {delay:pDel+.2, 'marginTop':0, opacity:1, ease:Expo.easeOut, onStart:function(){
		$(window).resize();
	}})
	
	TweenMax.to($('#scrollbar0').find('.thumb'), .3, {delay:pDel+.3, opacity:1, display:'block', onComplete:function(){
		$('#module-work').find('.col-left').find('.overview').attr('style','');
		$('#module-work').find('.col-left').find('.thumb').attr('style','height: 120px;');
		$(window).resize();
		loadingProject = false;
	}});
}


function changeProject(){
	// slide scroll back up in necessary
	TweenMax.to($('#scrollbar0').find('.overview'), .5, {top:0, ease:Expo.easeOut, onComplete:function(){
		$('#module-work').find('.col-left').find('.overview').attr('style','top:0px !important;');
	}});
	//TweenMax.to($('#scrollbar0').find('.scrollbar'), .3, {opacity:0, display:'none'});
	TweenMax.to($('#module-work').find('.col-left').find('.thumb'), .3, {top:0, opacity:0, 'display':'none', ease:Expo.easeOut, onComplete:function(){
		$('#module-work').find('.col-left').find('.thumb').attr('style','top:0px !important; height: 120px; opacity:0; display:none;');
	}})

	// clear current project
	TweenMax.to($('#module-work').find('.thumbs-top').find('.contentBox'), .3, {opacity:0, display:'none'});
	$('.project-loader').height($('#project-screens').height());
	TweenMax.to($('.project-loader'), .3, {delay:.2, opacity:1, display:'table'});
	

	// remove other screens
	TweenMax.to('.screens-others', .5, {'marginTop':50, opacity:0, ease:Expo.easeIn, onComplete:function(){
		$('.first-screen').css('visibility','hidden');
		openProject();
	}});
}

$('.thumbs-return').click(function(){
if(!loadingProject){
	backToThumbs();
}
	return false;
})

function backToThumbs(){
	projectOpen = false;
	loadingProject = true;
	
	// slide scroll back up in necessary
	TweenMax.to($('#module-work').find('.col-left').find('.overview'), .3, {top:0, ease:Expo.easeOut, onComplete:function(){
		$('#module-work').find('.col-left').find('.overview').attr('style','top:0px !important;');
	}});
	TweenMax.to($('#module-work').find('.col-left').find('.thumb'), .3, {top:0, opacity:0, 'display':'none', ease:Expo.easeOut, onComplete:function(){
		$('#module-work').find('.col-left').find('.thumb').attr('style','top:0px !important; height: 120px; opacity:0; display:none;');
		$('#module-work').find('.scrollbar-wrap:not(#scrollbar-projects)').find('.scrollbar').css({'display':'none',top:0});
	}})

	// clear current project
	TweenMax.to($('#module-work').find('.thumbs-top').find('.contentBox'), .3, {opacity:0, display:'none'});	
	TweenMax.to($('#project-screens'), .5, {opacity: 0, 'display':'none', 'top':0, ease:Expo.easeOut});
	TweenMax.to('.screens-others', .5, {'marginTop':80, opacity:0, 'display':'none', ease:Expo.easeOut});
	TweenMax.to('#workHeader', .5, {top:0, ease:Expo.easeOut});
	TweenMax.to($('#projectHeader'+titleNum), .5, {top:65, ease:Expo.easeOut});
	
	// figure out responsive thumb height
	tH = 265;
	if(winW<1040){							
		if(!mobile){tRat = (((winW-20)*.67)*.495)/340;} else {tRat = ((winW-20)*.495)/340;}
		tH = Math.round(265*tRat);
	}		
	
	// resize white block
	$('.thumbs-whitebg').css('width','100%');
	TweenMax.set($('.thumbs-whitebg').children('.mod-cover'), {opacity:1, 'display':'block', 'width':'100%'});
	TweenMax.to($('#module-work').find('.thumbs-top'), .5, {delay:.5, 'marginTop':-40, 'marginBottom':0, ease:Expo.easeInOut});
	TweenMax.to($('#module-work').find('.thumbs-whitebg'), .5, {delay:.5, 'marginTop':0, height:tH, ease:Expo.easeInOut});
	TweenMax.to($('#module-work').find('.thumbs-whitebg'), .5, {delay:1, width:'49.5%', ease:Expo.easeInOut, onComplete:function(){
		
		TweenMax.set($('.thumbs-whitebg').children('.thumb-img'), {opacity:1, 'display':'block'});
		TweenMax.to($('.thumbs-whitebg').children('.mod-cover'), .3, {opacity:0, 'display':'none'});
		$('.first-screen').css('visibility','hidden');
	}});	
	
	setTimeout(function(){
		$('#module-work').find('.thumb-box').each(function(i){				
	    	TweenMax.set(this, {'top':0, 'display':'inline-block', 'visibility':'hidden'});
	    })
	}, 800)
	
	setTimeout(function(){		
		$('#module-work').find('.thumb-box').each(function(i){
	    	TweenMax.to(this, .4, {delay:(i*.2), startAt:{'display':'inline-block','top':50,'visibility':'visible'}, 'top':0, opacity:1, ease:Expo.easeOut});
	    	if(i == 9){
	    		setTimeout(function(){
					TweenMax.to($('#scrollbar0').find('.thumb'), .3, {opacity:1, display:'block', onComplete:function(){
					    $('#module-work').find('.col-left').find('.overview').attr('style','');
					    $('#module-work').find('.col-left').find('.thumb').attr('style','height: 120px;');
					    
					    // reset first thumb
					    $('#module-work').find('.thumbs-whitebg').css('height','auto');
					    $(window).resize();
					    
					    titleNum = 1;
					    loadingProject = false;
					}});
	    		},600)
	    	}
	    })
	   $(window).resize();
	}, 1500)	
}

// End Portfolio Navigation

/* ____________________________________________________________________________________________________________ */










/* ____________________________________________________________________________________________________________ */

// Mobile Website Functions


// skip intro, place content for mobile site

function mobileOpen(){

	// set modules zoomed in and centered 		
	TweenMax.set($('#modules'), {scaleX:1, scaleY:1, width:3550, 'visibility':'visible'});
	$('#headerContainer').css('height','');
	TweenMax.set('.extra-filler-lt', {left:-500});
	
	if(activePage != ''){
		
		// on a tier page
		amt = Number(activePage)+1;
		zoomX = -((winW-15)*amt)-(10*activePage);
		$('.contentSizer').css('margin-left',zoomX)
		adjustMobilePages();
		lastPage = activePage;
	} else {
		
		// on homepage
		$('.contentSizer').css('margin-left',10);
	}
		
	
	// auto show module contents
	$('.module').each(function(i){
		$(this).css({'cursor':'default'});
		TweenMax.set(this, {scaleX:1, scaleY:1, width:winW-20, opacity:1});
		TweenMax.set($(this).find('.mod-cover'), {opacity:0});
		TweenMax.set($(this).find('.main-header').children('h1'), {opacity:1});
		$(this).removeClass('abled').addClass('disabled');	
		$(this).find('.mod-cover').css({'opacity':1})
		$(this).find('.contentBox').each(function(){
			TweenMax.set(this, {width:'100%', opacity:1, display:'block','visibility':'visible'})
		})
		
		if(i == 1){ // work			
			 
			
			// figure out responsive thumb height
			tH = 264;
			tRat = ((winW-20)*.495)/340;
			tH = Math.round(264*tRat);
			$(this).find('.icon-cross').hide();
			TweenMax.set($(this).find('.thumbs-whitebg'), {'marginTop':0, height:'auto'});
			
			$('.thumbs-whitebg').css({'padding':0,'margin-top':0});
			$('.thumbs-whitebg').children('.thumb-img').css({'display':'block','opacity':1});
			$('.thumbs-whitebg').children('.block-fill-lt').hide();
			TweenMax.set($('.thumbs-whitebg').children('.mod-cover'), {opacity:0, 'display':'none'});			
			TweenMax.set($('#module-work').find('.thumbs-whitebg'), {'display':'inline-block', width:'49.5%'});
			
			if(!projectOpen){
				TweenMax.set($(this).find('.thumbs-top'), {'marginTop':-40});
				$(this).find('.thumb-box').each(function(i){
					TweenMax.set(this, {'display':'inline-block', 'visibility':'visible', 'top':0, opacity:1});
				})
			} else {
				TweenMax.set($(this).find('.thumbs-top'), {'marginTop':0});
				TweenMax.set($('#module-work').find('.thumbs-whitebg'), {width:'100%'})
			}
		}
		
		if(i == 2){ // details						
			$('.bio').find('.line-fill').hide();				
			
			// if tablet, shrink bars
			shortPct = ($('.skills').width()-185)/$('.skills').width()
			$(this).find('.meter-wrap').css('width',Math.ceil(shortPct*100)+'%');
		
			$('.skill-line').each(function(i){
				tmpW = $(this).attr('data-percent');
				TweenMax.set($(this).find('.skill-meter'), {width:tmpW+'%'});
			})
			
			tmpH = 20;
			$(this).find('.col-left').find('p').each(function(n){
				tmpH += $(this).height();
				if(n>0){tmpH+=25;}
			})			
			if(tmpH>(winH-183)){tmpH = winH-183;}			
			$(this).find('.col-left').find('.dummylines').css({height:tmpH});
			
			// award name tweaks to fit
			$('.awards').find('.hasLink').each(function(){
				$(this).find('p').each(function(){
					tmpStr = $(this).text();
					if(tmpStr.indexOf('Communication Arts') != -1){
						tmpStr = tmpStr.replace('Communication Arts','Comm Arts');
						$(this).text(tmpStr)
					}
				})				
			})
			
			$('#scrollbar-about').css('visibility','visible');
			setTimeout(function(){		
				$('#scrollbar1').find('.viewport').height($('#scrollbar1').find('.overview').height());
				$('#scrollbar-about').find('.viewport').height($('#scrollbar-about').find('.overview').height());
				$('.bio').find('.dummylines').height($('#scrollbar-about').find('.overview').height()-10);
			}, 100)
		}
		
		if(i == 3){ // contact				
			TweenMax.set($('#contactForm').find('.formTA'), {height:280});
			$('#scrollbar2').find('.viewport').height($('#scrollbar2').find('.overview').height());
			$('#module-contact').find('button[type="submit"]').css('width','100%');
			$('#module-contact').find('.dummytop').find('h2, h3').css('width','100%');
			$('#module-contact').find('.contact-icons').find('.contentBox>div').css('width','100%');		
		}
		
		if(i == 4){ // thoughts			
			$(this).find('.first-blog').find('.contentBox').show();
			blogStartH = $('.dummymid').find('p').height()+20;
			TweenMax.set($(this).find('.first-blog'), {height:blogStartH});
			
			$('#module-thoughts').find('.contentBoxi').css({'opacity':1,'display':'block'})
			$('#module-thoughts').find('.contentBoxi>div').css({'display':'block','opacity':1})
			$('#module-thoughts').find('.first-img').css({'display':'block','width':'100%','height':'auto'});			
			
			TweenMax.set('.blog-others', {display:'block', 'marginTop':30, opacity:1});
			
			$(this).find('.blog-header').find('h2').css('line-height','normal');
			$(this).find('.blog-header').each(function(){
				if($(this).find('h2').height()>=48){
					$(this).find('h2').css('line-height','normal');
				} else {
					$(this).find('h2').css('line-height','50px');
				}
			})
			
			setTimeout(function(){	
				$('.thought-row').each(function(i){
					tmpH = $(this).find('p').height()+20;
					if(i>0){$(this).css('height',tmpH);}
				})
				
				$('#scrollbar3').find('.viewport').height($('#scrollbar3').find('.overview').height());
				TweenMax.set($('#module-thoughts').find('.dummylines[data-num="0"]'), {width:'100%'})
				TweenMax.set($('#module-thoughts').find('.dummylines[data-num="1"]'), {width:'0%'})
				$(window).resize();
			}, 100)
		}				
	})
	
	tierOpen = true;
	isMobile = true;
	$(window).resize();
	$('.nav-block').hide();
	
	// cover up heights
	$('.module:not(#mobile-home)').each(function(i){
		if(activePage == ''){
			$(this).css({'height':100,'overflow':'hidden'});
		} else {
			if(i != activePage){
				$(this).css({'height':100,'overflow':'hidden'});
			}
		}
		
	})
}

function openPageMobile(a){
	isHome = false;
	activePage = a;
	amt = Number(a)+1;
	zoomX = -((winW-15)*amt)-(10*a);
	origW = winW;
	mDel = 0;
	if(lastPage != activePage){
		enableMod();
	}
	
	// reset heights
	$('.module').each(function(i){$(this).css({'height':'','overflow':''});})
	
	// slide scroll back up first
	if($('#contentContainer').scrollTop()>0){
		TweenMax.to('#contentContainer', .5, {delay:mDel, scrollTop:0, ease:Expo.easeInOut});
		mDel += .5;
	}
	
	adjustMobilePages()
	
	// slide contents over
	TweenMax.to('.contentSizer', .75, {delay:mDel, 'marginLeft':zoomX, ease:Expo.easeInOut, onComplete:function(){
		$('.module').each(function(i){			
			if(i != amt){
				$(this).css({'height':100,'overflow':'hidden'});
			}
		})
		$(window).resize();
		
		// turn menu highlight off
		$('#mobileNav').find('a').find('[class^="icon-"]').css({'background-color':'#f5f5f6', 'color':'#000'})
		$('#mobileNav').find('a').mouseleave(function(){
			$('#mobileNav').find('a').find('[class^="icon-"]').each(function(){
				$(this).attr('style','');
			})
			
		})
	}});
	
	if(a == -1){activePage = '';}
}

$('#mobileMenu').find('ul').find('a').each(function(i){
	$(this).click(function(){
		goNum = $(this).attr('data-num');
		setTimeout(function(){
			openPageMobile(goNum);
		}, 500)	
		
		// close menu
		TweenMax.to('#headerContainer', .5, {top:0, ease:Expo.easeInOut})
		TweenMax.to('#mobileClose', .3, {opacity:0, 'display':'none'});
		TweenMax.to('.mobnav', .3, {opacity:1, 'display':'block'});
	
		return false;
	})
})

$('.mobile-mod').each(function(i){
	$(this).click(function(){
		tmpGo = $(this).attr('data-num');
		setTimeout(function(){
			openPageMobile(tmpGo);
		}, 250)
		
	})
})

$('.mobnav').click(function(){
	TweenMax.to('#headerContainer', .5, {top:200, ease:Expo.easeInOut})
	TweenMax.to('.mobnav', .3, {opacity:0, 'display':'none'});
	TweenMax.to('#mobileClose', .3, {delay:.4, opacity:1, 'display':'block'});
	return false;
})

$('#mobileClose').click(function(){
	TweenMax.to('#headerContainer', .5, {top:0, ease:Expo.easeInOut})
	TweenMax.to('#mobileClose', .3, {opacity:0, 'display':'none'});
	TweenMax.to('.mobnav', .3, {delay:.4, opacity:1, 'display':'block'});
})


function adjustMobilePages(){
	
	if(winW<500){
		$('.module').each(function(i){
			TweenMax.set($(this).children('header'), {scaleX:.75, scaleY:.75, 'marginBottom':0, 'marginLeft':mobileHeaders[i], 'marginTop':-10})
			$('#mobile-home').css('margin-top',0);			
		})
	} else {
		$('.module').each(function(){
			TweenMax.set($(this).children('header'), {scaleX:1, scaleY:1, 'marginBottom':10, 'marginLeft':0, 'marginTop':0})			
		})
		$('#mobile-home').css('margin-top',-20)
	}
	
	//work
	$('.thumb-box[data-id="94"]').find('p').html('M&Ms Transformers');
	
	if(projectOpen){
		$('.thumbs-whitebg').height($('#project-screens').height());
	}
					
	$('#scrollbar0').find('.viewport').height($('#scrollbar0').find('.overview').height());
	
	// reduce title if necessary
	if(winW<575){
		$('[id^="projectHeader"]').each(function(){
			if($(this).find('h1').text() == 'iCarly Nintendo DS Game'){$(this).find('h1').text('iCarly Game');}
			if($(this).find('h1').text() == 'M&Ms Transformers Microsite'){$(this).find('h1').text('M&Ms Transformers');}
			if($(this).find('h1').text() == 'Longwood Gardens Game'){$(this).find('h1').text('Longwood Gardens');}
			if($(this).find('h1').text() == 'The Palmer Apartments'){$(this).find('h1').text('The Palmer Apts');}
			if($(this).find('h1').text() == 'The Square Apartments'){$(this).find('h1').text('The Square Apts');}
		})	
	} else {
		$('[id^="projectHeader"]').each(function(){
			if($(this).find('h1').text() == 'iCarly Game'){$(this).find('h1').text('iCarly Nintendo DS Game');}
			if($(this).find('h1').text() == 'M&Ms Transformers'){$(this).find('h1').text('M&Ms Transformers Microsite');}
			if($(this).find('h1').text() == 'Longwood Gardens'){$(this).find('h1').text('Longwood Gardens Game');}
			if($(this).find('h1').text() == 'The Palmer Apts'){$(this).find('h1').text('The Palmer Apartments');}
			if($(this).find('h1').text() == 'The Square Apts'){$(this).find('h1').text('The Square Apartments');}
		})
	}
	
	// details
	shortPct = ($('.skills').width()-185)/$('.skills').width()
	$('#module-details .meter-wrap').css('width',Math.ceil(shortPct*100)+'%');

	tmpH = 20;
	$('#module-details').find('.col-left').find('p').each(function(i){
		tmpH += $(this).height();
		if(i>0){tmpH+=25;}
	})
	
	if(tmpH>(winH-183)){tmpH = winH-183;}
	
	$('#module-details').find('.col-left').find('.dummylines').css({height:tmpH});
						
	$('#scrollbar1').find('.viewport').height($('#scrollbar1').find('.overview').height());
	$('#scrollbar-about').find('.viewport').height($('#scrollbar-about').find('.overview').height());
	$('.bio').find('.dummylines').height($('#scrollbar-about').find('.overview').height()-10);
	
	// contact
	$('#scrollbar2').find('.viewport').height($('#scrollbar2').find('.overview').height());
	
	// thoughts
	$('.thought-row').each(function(i){
		tmpH = $(this).find('p').height()+20;
		$(this).css('height',tmpH);
	})
	if(!titleReplaced){
		$('.blog-header').each(function(i){
		tmpT = $(this).find('h2').attr('data-short');
		if(tmpT != ''){
			tmpT2 = $(this).find('h2').html();
			$(this).find('h2').html(tmpT).attr('data-short', tmpT2);
		}
		})
		titleReplaced = true;
	}
	if(!subReplaced){
		$('.blog-header').each(function(i){
			tmpS = $(this).find('h3').attr('data-short');
			tmpS2 = $(this).find('h3').html();
			$(this).find('h3').html(tmpS).attr('data-short', tmpS2);
		})
		subReplaced = true;
	}
	$('#scrollbar3').find('.viewport').height($('#scrollbar3').find('.overview').height());
	$('#module-thoughts').find('.blog-header').find('h2').css('line-height','normal');
	if(winW<440){
		$('#module-thoughts').find('.blog-header').each(function(){
			if($(this).find('h2').height()>=48){
				$(this).find('h2').css('line-height','normal');
			} else {
				$(this).find('h2').css('line-height','50px');
			}
		})
	}				
}


function mobileClose(){
	TweenMax.set('#top-loader',  {right:-10});
	TweenMax.set('#globalNav', {right:-48});
	
	tmpR = (winW - 296)+39;
	TweenMax.set('#headerContainer', {top:0})
	TweenMax.set('.mobnav', {opacity:1, 'display':'block'});
	TweenMax.set('#mobileClose', {opacity:0, 'display':'none'});
	
	$('.module').removeClass('disabled').addClass('abled').css({'cursor':''});
	$('.contentBox, .thumbs-whitebg, .dummylines, .first-blog, .blog-others, .thumbs-top, .thumb-box').attr('style','');
	$('.module, .viewport').css('height','');
	$('.line-fill, .icon-cross').css({'display':''});
	$('.thumb-img').css({'display':'none','opacity':''});
	$('.mod-cover').css({'opacity':0,'display':''});
	$('.thumbs-whitebg').children('.block-fill-lt').css('display','');
	$('.contentSizer').css('margin-left','');
	$('.module-dummy').css({'width':'','margin-top':''});	
	$('#module-work .col-left, #module-work .col-right').css('width','');
	setupScrollbars();
	
	// on tier page
	if(activePage != ''){
		
		// setup tier page in place
		tierOpen = true; 
		isHome = false;		
		autoOpenPage();	
		TweenMax.set('#headerContainer', {height:60});
		$('#globalNav').find('div[class^="icon-"]:not(.icon-jlerndesign)').each(function(){$(this).addClass('tier');})
		if(activePage == 2){
			$('#location').css({'opacity': 1, 'margin-top': -11})
			$('#module-contact').find('.contact-icons').find('.contentBox, .contentBox>div').css({'overflow':'visible'});
		}
		if(activePage != 0){
			projectOpen = false;
			titleNum = 1;	
		}
		if(activePage != 3){
			$('#module-thoughts').find('.contentBoxi').attr({'style':''})
			$('#module-thoughts').find('.contentBoxi>div').attr({'style':''})
			$('#module-thoughts').find('.first-img').attr({'style':''})
		}
		
		// award name tweaks to fit
		$('.awards').find('.hasLink').each(function(){
			$(this).find('p').each(function(){
				tmpStr = $(this).text();
				if(tmpStr.indexOf('Comm Arts') != -1){
					tmpStr = tmpStr.replace('Comm Arts','Communication Arts');
					$(this).text(tmpStr)
				}
			})				
		})
		
		// reset other pages
		$('.module:not(.module-dummy)').each(function(i){
			if(i != activePage){
				$(this).find('.col-left, .col-right').attr('style','');
				if(i==0){
					$('#project-screens, .screens-others, [id^="projectHeader"], #workHeader, .project-list, .project-items, .block-fill-lt, .work-lines').attr('style','');
				}
				if(i==2){
					$('.formTA, .map-box').css({'height':''});
					$('.coffee-header').css({'height':'', 'display':'none'});
				}
				if(i==3){
					$('.blog-others').attr('style','');
				}
			}
			TweenMax.set($(this).children('header'), {scaleX:1, scaleY:1, 'marginBottom':10, 'marginLeft':0, 'marginTop':0})
		})
		
		$('#mobile-home').css('margin-top',-20)			
		$('#scrollbar0').find('.viewport').height($('#scrollbar0').find('.overview').height());
	
	// on homepage
	} else {
		
		// reset home modules for desktop
		$('.module').find('.roll').css('display','none');
		$('#globalNav').find('div[class^="icon-"]:not(.icon-jlerndesign)').each(function(){$(this).removeClass('tier');})
		setTimeout(function(){$('.module').find('.roll').css('display','')}, 100);
		
		$('.col-left, .col-right, .extra-filler-lt, .extra-filler-rt').attr('style','');
		$('#module-contact').find('.coffee-header, .map-box, .formTA').css({'height':'', 'display':''});		
		$('.blog-others, #location').attr('style','');
		$('.project-list, .project-items, .block-fill-lt, .work-lines').attr('style','');
		$('#project-screens, .screens-others, [id^="projectHeader"], #workHeader').attr('style','');
		
		$('#module-thoughts').find('.contentBoxi').attr({'style':''})
		$('#module-thoughts').find('.contentBoxi>div').attr({'style':''})
		$('#module-thoughts').find('.first-img').attr({'style':''})
				
		projectOpen = false;
		titleNum = 1;
		tierOpen = false; 
		isHome = true;
		enableMod();
	}	
	
	$('.module').each(function(i){$(this).css({'width':''});})
	isMobile = false;
}

var shrinkStarts = [590,12,-445,-1063];
var shrinkWidths = [4174,4200,4014,3860]

function autoOpenPage(){

	disableActive();	
	$('.module:not(.module-dummy)').each(function(i){TweenMax.set(this, {width:startWidths[i+1]});})	
	$('.contentSizer').css({'margin-left':shrinkStarts[activePage]});
	$('#modules').css({width:shrinkWidths[activePage]});
	
	$('.module[data-num="'+activePage+'"]').css({'cursor':'default'});
	TweenMax.set('.module[data-num="'+activePage+'"]', {scaleX:1, scaleY:1, width:winW-20, opacity:1});
	TweenMax.set($('.module[data-num="'+activePage+'"]').find('.mod-cover'), {opacity:0});
	TweenMax.set($('.module[data-num="'+activePage+'"]').find('.main-header').children('h1'), {opacity:1});
	$('.module[data-num="'+activePage+'"]').removeClass('abled').addClass('disabled');	
	$('.module[data-num="'+activePage+'"]').find('.mod-cover').css({'opacity':1})
	$('.module[data-num="'+activePage+'"]').find('.contentBox').each(function(){
		TweenMax.set(this, {width:'100%', opacity:1, display:'block','visibility':'visible'})
	})
	
	// for individual page adjustments
	
	if(activePage == 0){ // work		
		// fix side links
		$('#module-work').find('.project-items').css({'padding':'0px', 'height':'auto'});
		$('#module-work').find('.project-items').find('.block-fill-lt, .work-lines').hide();	
		$('#module-work').find('.project-items').find('.contentBox').show();		
		TweenMax.set('.extra-filler-lt', {left:233});
		
		TweenMax.set($('#module-work').find('.col-left'), {width:'67%'});
		TweenMax.set($('#module-work').find('.col-right'), {'display':'inline-block', 'marginLeft':'0.8%', width:'32.2%'});
		TweenMax.set($('#module-work').find('.thumbs-whitebg'), {'display':'inline-block', width:'49.5%', 'padding':0,'margin-top':0});			

		$('#module-work').find('.icon-cross').hide();
		
		$('#module-work').find('.project-list').css({'height':'auto','overflow':'auto'});
		$('#module-work').find('.overview').attr('style','top:0px');
		$('#scrollbar-projects').find('.viewport').css({'height':349});
		$('#scrollbar-projects').find('.scrollbar').css({'display':'block'});
		$('#module-work').find('.scrollbar-wrap:not(#scrollbar-projects)').find('.scrollbar').css({top:0});
		
		if(!projectOpen){
			TweenMax.set($('#module-work').find('.thumbs-top'), {'marginTop':-40});
			TweenMax.set($('#module-work').find('.thumbs-whitebg'), {'marginTop':0, height:'auto'});
			TweenMax.set($('.thumbs-whitebg').children('.mod-cover'), {opacity:0, 'display':'none'});
			
			$('#module-work').find('.thumb-box').each(function(i){
				TweenMax.set(this, {'display':'inline-block', 'visibility':'visible', 'top':0, opacity:1});
			})
		} else {
			TweenMax.set($('#module-work').find('.thumbs-top'), {'marginTop':0, 'marginBottom':6});
			TweenMax.set($('#module-work').find('.thumbs-whitebg'), {'marginTop':0, height:'auto'});
			$('#module-work').find('.scrollbar-wrap:not(#scrollbar-projects)').find('.scrollbar').css({top:46});
			$('#module-work').find('.thumb-box').each(function(i){
				//TweenMax.set(this, {'display':'inline-block', 'visibility':'visible', 'top':0, opacity:1});
			})
		}
		
		$('.thumbs-whitebg').children('.thumb-img').css({'display':'block','opacity':1});
		$('.thumbs-whitebg').children('.block-fill-lt').hide();		
	}		
	
	if(activePage == 1){ // details
		TweenMax.set($('#module-details').find('.col-left'), {width:'43%'});
		TweenMax.set($('#module-details').find('.col-right'), {'display':'inline-block', 'marginLeft':'1.2%', width:'55.8%'});
		
		$('.bio').find('.line-fill').hide();				
		
		// if tablet, shrink bars
		shortPct = ($('.skills').width()-185)/$('.skills').width()
		$('#module-details').find('.meter-wrap').css('width',Math.ceil(shortPct*100)+'%');
	
		$('.skill-line').each(function(i){
			tmpW = $(this).attr('data-percent');
			TweenMax.set($(this).find('.skill-meter'), {width:tmpW+'%'});
		})
		
		tmpH = 20;
		$('#module-details').find('.col-left').find('p').each(function(n){
			tmpH += $(this).height();
			if(n>0){tmpH+=25;}
		})			
		if(tmpH>(winH-183)){tmpH = winH-183;}			
		$('#module-details').find('.col-left').find('.dummylines').css({height:tmpH});
	}
	
	if(activePage == 2){ // contact							
		TweenMax.set($('#module-contact').find('.col-left'), {width:'62%'});
		TweenMax.set($('#module-contact').find('.col-right'), {width:'36.8%'});
		
		TweenMax.set($('#contactForm').find('.formTA'), {height:280});
		TweenMax.set($('#module-contact').find('.map-box'), {height:230});
		TweenMax.set($('#module-contact').find('.coffee-header'), {height:40, display:'block'});	
	}
	
	if(activePage == 3){ // thoughts		
		TweenMax.set('.extra-filler-rt', {right:557});		
		TweenMax.set($('#module-thoughts').find('.col-left'), {width:'70%'});
		TweenMax.set($('#module-thoughts').find('.col-right'), {'display':'inline-block', 'marginLeft':'0.8%', width:'29.2%'});
		TweenMax.set('.blog-others', {'marginTop':30, 'display':'block', opacity:1})
	}
	
	lastPage = activePage;
}

// End Mobile Functions

/* ____________________________________________________________________________________________________________ */










/* ____________________________________________________________________________________________________________ */


// Retina Graphics

if(hasRetina){
	$('.thumb-box, .thumb-img').each(function(){
		tmp = $(this).children('img').attr('src').split('.jpg');
		tmpR = tmp[0] + '@2x.jpg';
		$(this).children('img').attr('src',tmpR)
	})
}

// End Retina Graphics

/* ____________________________________________________________________________________________________________ */










/* ____________________________________________________________________________________________________________ */


// Text Resizing for Responsive

$('#module-contact').find('.dummytop').find('h2').fitText(3.5, { minFontSize: '18px', maxFontSize: '22px' });

// End Text Resizing

/* ____________________________________________________________________________________________________________ */








/* ____________________________________________________________________________________________________________ */

// fixes for browsers

var addedStyles;
var isSafari5 = false;
var isIE9 = false;
addedStyles = '<style type="text/css">';

// if running old mac os
if (navigator.userAgent.indexOf("Macintosh")!=-1 && navigator.userAgent.indexOf("Version/5")!=-1){
	isSafari5 = true;
	addedStyles += '#contactForm input[type="text"]{line-height:normal; padding-top:15px;}';
}

// if Internet Explorer 9
if (navigator.userAgent.indexOf("MSIE 9")!=-1){
	isIE9 = true;
	
	addedStyles += '#contactForm input[type="text"]{left:0px; text-indent:15px;}';
	
	$('input').each(function(){
		$(this).val($(this).attr('placeholder'));
		$(this).focus(function(){
			if($(this).val() == $(this).attr('placeholder')){
				$(this).val('');
			}
		})
		$(this).blur(function(){
			if($(this).val() == ''){
				$(this).val($(this).attr('placeholder'));
			}
		})
	})
	$('textarea[name="comments"]').html('Comments');
	$('textarea[name="comments"]').focus(function(){
		if($(this).val() == $(this).attr('placeholder')){
			$(this).html('');
		}
	}).blur(function(){
		if($(this).val() == ''){
			$(this).html($(this).attr('placeholder'));
		}
	})
}

// if Internet Explorer 8, redirect to old site
if (navigator.userAgent.indexOf("MSIE 8")!=-1){
	window.location.href = 'http://www.jlern.com/';
}

addedStyles += '</style>';
$('body').append(addedStyles);

// end fixes for browsers

/* ____________________________________________________________________________________________________________ */

