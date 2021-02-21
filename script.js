
function debounce(fn, delay) {
  var timer = null;
  return function () {
    var context = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
}

var story = function (storyElement){
  var story = {
    targetElement : $(storyElement),
    currentSlide : 0,
    slideCount : $(storyElement).find('.slide').length,
    sliderBar : $(storyElement).find('input.slider'),
    slideNavButtonPrevious : $(storyElement).find('.btn-prev'),
    slideNavButtonNext : $(storyElement).find('.btn-next'),
    nextButtonDisabled: function(){
      if(story.currentSlide >= story.slideCount -1 ){
        return true;
      }

      return false;
    },
    previousButtonDisabled: function(){
      if(story.currentSlide <= 0){
        return true;
      }
      return false;
    }
  };
  
  
  //Set controls attributes

  this.init = function(){
    var that = this;
   
    story.sliderBar.attr({
      "max" : story.slideCount -1, 
      "min" : 0,
      "steps": 1         
    });

    //Set initial slide
    that.setSlide(0);
    
    // Set Event listener on controls
    story.sliderBar.on('change', function() {
      that.setSlide(story.sliderBar.val());
    });

    // Set button click event listeners
    story.slideNavButtonNext.on('click', function() {
      that.nextSlide();
    });

    story.slideNavButtonPrevious.on('click', function() {
      that.previousSlide();
    });

    story.targetElement.find('.slide-titles a').on('click', function() {
      var slide= parseInt($(this).data('target-slide'));
      that.setSlide(slide);
    });

    story.targetElement.bind('mousewheel', debounce(function (event) {
      if (event.originalEvent.wheelDelta >= 0) {
        that.nextSlide();
          console.log('Scroll up');
      }
      else {
        that.previousSlide();
         console.log('Scroll down');
      }
    }, 300));
    

    if($(document).innerWidth() > 700){
      $.each(story.targetElement.find('.slide'), function( index, value ) {
        $(this).css({
          'top': +index+'00%',
        })

        $(this).attr('id','slide-'+index);
      });
    }else{
      $.each(story.targetElement.find('.slide'), function( index, value ) {
        $(this).css({
          'left': +index+'00%',
         // 'transform': 'translateY(-'+index+'00%)'
        })

        $(this).attr('id','slide-'+index);
      });
    }


    $.each(story.targetElement.find('.slide-titles a'), function( index, value ) {
      $(this).attr('for','slide-'+index);
    });
    
  };

  this.nextSlide  = function(){
    if(story.currentSlide < story.slideCount - 1 ){
      story.currentSlide = story.currentSlide+1;
    }

    this.setSlide(story.currentSlide);
  }

  this.previousSlide = function(){
    if(story.currentSlide > 0 ){
      story.currentSlide = story.currentSlide-1;
    }
   
    this.setSlide(story.currentSlide);
  }

  this.setSlide = function(slideNumber){
    
    if(slideNumber < 0 || slideNumber > story.slideCount -1){
      return 0;
    }

    story.currentSlide = parseInt(slideNumber);
    story.sliderBar.val(story.currentSlide);
    story.targetElement.find('.slide-titles a').removeClass('active');
    $(story.targetElement.find('.slide-titles a')[slideNumber]).addClass('active');
    
    //Set button states
    story.slideNavButtonNext.prop('disabled',story.nextButtonDisabled);
    story.slideNavButtonPrevious.prop('disabled',story.previousButtonDisabled);

    //Move slides
    story.targetElement.find('.slide').removeClass('active');
    $(story.targetElement.find('.slide')[slideNumber]).addClass('active');

    if($(document).innerWidth() > 700){
      $(story.targetElement.find('.slides')[0]).css({
        'transform': 'translateY(-'+slideNumber+'00%)'
      });
    }else{
      $(story.targetElement.find('.slides')[0]).css({
        'transform': 'translateX(-'+slideNumber+'00%)'
      });
    }

    
  }
  return init();
}


$(document).ready(function() {
   story('.story');

   $(window).resize(function() {
    story('.story');
   });
});
