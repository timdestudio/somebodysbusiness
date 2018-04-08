$(document).ready(function(){

	//init splash
	Manager.initSplash();
  
});//document ready

var Manager = {
	muted:false,
	fullscreen:true,
	navFixed:false,
	navHidden:false,
	scrollTop:0,
	fadeInSpeed:300,
	everythingFaded:0,
	fadeInKey:0,
	scrollTargets:[],
	reversedScrollTargets:[],
	imageArray:[],
	preloaderIncrement:0,
	preloaderCount:0,
	infoRibbon:null,
	initSplash:function(){

		//set timeout to hide splash screen
		setTimeout(function(){

			$('div#splash').css({opacity:0});

		},1300);

		//set timeout to show content
		setTimeout(function(){

			//scroll to top
			$(window).scrollTop(0);

			//init showcase mechanics
			Manager.initSlides();
			$('div#l-body-wrapper').css({opacity:1});

		},2200);

	},
	initSlides:function(){

		$('#l-body-wrapper .slide-spacer').each(function(i){

			entry = new Object();
			entry.background = $(this).attr('data-background-color');
			entry.offset = $(this).offset().top;
			entry.textColor = $(this).attr('data-text-color');
			entry.caption = $(this).attr('data-caption');

			Manager.scrollTargets.push(entry);

		});//for each item

		Manager.firstWork = Manager.scrollTargets[0];
		Manager.scrollTargets.reverse();

		Manager.ogBackground  = $('div#l-body-wrapper').css('background-color');
		Manager.ogTextColor = $('div#l-body-wrapper').css('color');

		$(window).scroll(function(){

			console.log($(window).scrollTop());

			$(Manager.scrollTargets).each(function(i){

				if($(window).scrollTop() < Manager.firstWork.offset){

					$('div#l-body-wrapper').removeClass('flipped');
					$('div#l-body-wrapper').css({background:Manager.ogBackground});
					$('div#l-body-wrapper').css({color:Manager.ogTextColor});

					return false;

				}

				if($(window).scrollTop() > Manager.scrollTargets[i].offset){

					$('div#l-body-wrapper').css({
						background:Manager.scrollTargets[i].background,
						color:Manager.scrollTargets[i].textColor,
					});

					if(Manager.scrollTargets[i].textColor=="black"){

						$('div#l-body-wrapper').addClass('flipped');
						console.log('flipped');

					}else{

						$('div#l-body-wrapper').removeClass('flipped');

					}

					return false;

				}

			});

		});

	},
	preload:function(){

		console.log('Starting preload.');

		//set image array
		Manager.imageArray = $('#l-body-wrapper section img');
		//set preloader bar increments
		Manager.preloaderIncrement = 100 / parseInt(Manager.imageArray.length);
		//start preloading
		Manager.preloadNextImage();


	},
	preloadNextImage:function(){

		//get the next image from the image array
		var image = Manager.imageArray.get(Manager.preloaderCount);

		//set the attributes for creating the image
		var imageAttributes = {src:$(image).attr('data-src')};

		//create preload node and attacht on load function
		$('<img/>').on('load', function(){ 
		
			//set the src attribute for the img element
			$(Manager.imageArray[Manager.preloaderCount]).attr({src:this.src});

			//up the preloader counter by 1
			Manager.preloaderCount++;

			//log the preloader progress
			console.log(Manager.preloaderCount+" : "+imageAttributes.src)

			$('div#preloader').css({width:(Manager.preloaderCount*Manager.preloaderIncrement)+"vw"});

			if(Manager.preloaderCount==Manager.imageArray.length){

				setTimeout(function(){

					Manager.transitionAndDo('div#preloader',{opacity:0},function(){Manager.init()});

				},1000);
				return;

			}else{

				Manager.preloadNextImage();

			}

			

		}).attr(imageAttributes);


	},
	transitionAndDo:function(selector,cssObject,callback){

		$(selector).css(cssObject).on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",

			function(e){
				//make sure it fires once
			 	$(this).off(e);
				//unbind event listener
				$(this).unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd");
				//execute callback function
				callback();
		});		

	},

	fadeInNext:function(){

		if(Manager.everythingFaded>0){

			$(Manager.fadeInArray[Manager.fadeInKey]).toggleClass('fade-in');
		 	
		 	Manager.everythingFaded--;
		 	Manager.fadeInKey++;

		 	console.log('Fade countdown: '+Manager.everythingFaded);
			setTimeout(Manager.fadeInNext,Manager.fadeInSpeed);

		}else{

			console.log('Everything has faded.');
			return;

		}
		

	},
	setLayoutWidth:function(){
		//$('div#l-body-wrapper').css({width:$('body').innerWidth()});
	}
	
};//Manager
