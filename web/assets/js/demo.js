/**
 * demo.js
 * https://coidea.website
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2018, COIDEA
 * https://coidea.website
 */

// init variables
var $slider = $(".slider"),
    $slides = $slider.find(".slider-item"),
    $sliderNav = $('.slider-nav'),
    $navPrev = $(".go-prev"),
    $navNext = $(".go-next"),
    $navSlideIndexHolder = $(".slider-nav-index"),
    $navSlideLengthHolder = $(".slider-nav-length"),
    slidesNum = $slides.length,
    prevSlideID = null,
    currentSlideID = 0,
    isAnimating = false,
    isAutoPlay = true,
    time = 0.65,
    // progress
    $progress = $('.progress'),
    progressTimeline = new TimelineMax({ paused: true }),
    // load content
    body = $("body"),
		header = $('header'),
    areaBlack = $('.black-arrea'),
    areaWhite = $('.white-arrea'),
    sliderContent = $('.slider-content'),
    sliderContentSubheadline = $('.subheadline'),
    loadContentTimeline = new TimelineMax({ paused: true }),
    // modal
    circles = header.find('.circle'),
    navTrigger = header.find('nav.navigation'),
    mainNav = header.find('nav.main'),
    languageNav = header.find('nav.language'),
    coideaModal = $('.coidea-modal'),
    modalAreaBlack = coideaModal.find('.black-arrea'),
    modalVideoHolder = coideaModal.find('.video-holder'),
    modalVideo = modalVideoHolder.find('video'),
    modalInner = $('.coidea-modal-inner'),
    modalTimeline = new TimelineMax({ paused: true });

// timeline: progress
progressTimeline.set($progress, { height: '0' })
	.to( $progress, 3.35, {  height: '100%', ease: Linear.easeNone });
  
// timeline: load content
loadContentTimeline
	// set modal start position
  .set(coideaModal, { autoAlpha: 0, xPercent: -100 })
  .set(modalAreaBlack, { xPercent: -100 })
  .set(modalVideoHolder, { width: 0 })
  .set(modalVideo, { css:{ opacity: 0, visibility: "hidden", marginLeft: "-150%" } })
  .set(modalInner, { autoAlpha: 0, y: -40 })
  // set content
  .set(body, { autoAlpha: 0 })
	.set(header, { autoAlpha: 0 })
  .set($sliderNav, { autoAlpha: 0 })
  .set($slider, { width: "0px" })
  .set(sliderContent, { autoAlpha: 0, x: -20 })
  // animate content
  .to(body, time/8, { autoAlpha: 1, ease: Sine.easeInOut })
  .to(areaBlack, time, { width: "100%", ease: Sine.easeInOut })
  .to($slider, time, { width: "100%", ease: Sine.easeInOut }, '-=' + time/2 + '')
  .to($sliderNav, time, { autoAlpha: 1, ease: Sine.easeInOut }, '-=' + time + '')
  .to(areaWhite, time, { width: "100%", ease: Sine.easeInOut }, '-=' + time + '')
  .to(sliderContent, time, { autoAlpha: 1, x: 20, ease: Sine.easeInOut }, '-=' + time + '')
  .to(header, time, { autoAlpha: 1, ease: Sine.easeInOut }, '-=' + time + '');

// timeline: modal
modalTimeline
	// set modal start position
  .set(coideaModal, { autoAlpha: 0, xPercent: -100 })
  .set(modalAreaBlack, { xPercent: -100 })
  .set(modalVideoHolder, { width: 0 })
  .set(modalVideo, { css:{ opacity: 0, visibility: "hidden", marginLeft: "-150%" } })
  .set(modalInner, { autoAlpha: 0 })
  // animate modal
  .to(coideaModal, time, { autoAlpha: 1, xPercent: 100, ease: Sine.easeInOut })
  .to(modalAreaBlack, time, { xPercent: 0, ease: Sine.easeInOut }, '-=' + time + '')
  .to(modalVideoHolder, time, { width: "100%", ease: Sine.easeInOut }, '+=' + time + '')
  .to(modalVideo, time/16, { css:{ opacity: 1, visibility: "visible", marginLeft: "0" }, ease: Sine.easeInOut }, '-=' + time + '')
 	.to(modalAreaBlack, time, { xPercent: 100, ease: Sine.easeInOut }, '-=' + time + '')
  .to(modalInner, time, { autoAlpha: 1, ease: Sine.easeInOut }, '-=' + time + '')
  .to(mainNav, time, { autoAlpha: 0, ease: Sine.easeInOut }, '-=' + time + '')
  .to(languageNav, time, { autoAlpha: 0, ease: Sine.easeInOut }, '-=' + time + '')
  .staggerTo(circles, time/16, { autoAlpha: 0, ease: Sine.easeInOut }, '-=' + time + '')
  .set(navTrigger, { className: "+=close-coidea-modal" }, '-=' + time*8 + '');


// init slideshow
function init() {

  TweenMax.set($slides, { left: "100%" });
  $navPrev.on("click", gotoPrevSlide);
  $navNext.on("click", gotoNextSlide);
  if (isAutoPlay) {
  
    startAutoPlay();
    progress();
    updateNavIndex();
  }
  gotoSlide(0, 0);
}


// previous
function gotoPrevSlide() {

  var slideToGo = currentSlideID - 1;
  if (slideToGo <= -1) {
  
    slideToGo = slidesNum - 1;
  }
  stopAutoPlay();
  gotoSlide(slideToGo, 0.7, "prev");
  startAutoPlay();
}


// next
function gotoNextSlide() {

  var slideToGo = currentSlideID + 1;
  if (slideToGo >= slidesNum) {
  
    slideToGo = 0;
  }
  stopAutoPlay();
  gotoSlide(slideToGo, 0.7, "next");
  startAutoPlay();
}


// direction
function gotoSlide(slideID, _time, _direction) {

  if (!isAnimating) {
  
    isAnimating = true;
    prevSlideID = currentSlideID;
    currentSlideID = slideID;
    var $prevSlide = $slides.eq(prevSlideID);
    var $currentSlide = $slides.eq(currentSlideID);
    if (_time !== null) {
    
      time = _time;
    }
    var direction = "next";
    if (_direction != null) {
    
      direction = _direction;
    }
    if (direction == "next") {
    
      TweenMax.to($prevSlide, time * 4, { left: "100%" });
      TweenMax.fromTo($currentSlide, time, { left: "-100%" }, { left: "0" });
    } else {
    
      TweenMax.to($prevSlide, time * 4, { left: "-100%" });
      TweenMax.fromTo($currentSlide, time, { left: "100%" }, { left: "0" });
    }
    TweenMax.delayedCall(time, function() {
    
      updateNavIndex();
      progress();
      isAnimating = false;
    });
    
  }
}


// play
function play() {

  gotoNextSlide();
  TweenMax.delayedCall(4, play);
}


// start autoplay
function startAutoPlay(immediate) {

  if (immediate != null) {
  
    immediate = false;
  }
  if (immediate) {
  
    gotoNextSlide();
  }
  TweenMax.delayedCall(4, play);
}


// stop autoplay
function stopAutoPlay() {

  isAutoPlay = false;
  TweenMax.killDelayedCallsTo(play);
}


// slideshow item progress
function progress() {

  progressTimeline.play().timeScale(1);
  progressTimeline.invalidate().restart()
}


// update slideshow navigation number 
function updateNavIndex() {

  $navSlideLengthHolder.html('0' + slidesNum);
  var increasedCurrentSlide = currentSlideID + 1;
  $navSlideIndexHolder.html('0' + increasedCurrentSlide);
}


// load content when document ready
function loadContent() {
  
  loadContentTimeline.play().timeScale(1);
}


// show modal
$('.coidea-slider').on('click', '.slider-item', function() {
  
  // get data from clicked item 
  var thisHeadline = $(this).data('headline'),
      thisDescription = $(this).data('description');
  // set data into modal
  $('.coidea-modal .coidea-modal-inner').find('h2').html(thisHeadline);
  $('.coidea-modal .coidea-modal-inner').find('.modal-content').html(thisDescription);
  // kill progress timeline and execute modal timeline
  progressTimeline.kill();
  // pause slideshow
  stopAutoPlay();
	// play modal timeline
	modalTimeline.play().timeScale(3); 
});


// close modal
$('header').on('click', '.close-coidea-modal', function() {
	
  // reverse modal timeline
	modalTimeline.reverse().timeScale(3);
	// restart slideshow
  startAutoPlay();
  progress();
});


// load content first then init slideshow
$.when( loadContent() ).done(function() {

  init();
});