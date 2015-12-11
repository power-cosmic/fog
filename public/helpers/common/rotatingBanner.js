
$(function(){
	var allImages = [
		{
			"link": "#",
			"src": "/images/banners/s01.jpg"
		},
		{
			"link": "#",
			"src": "/images/banners/s02.jpg"
		},
		{
			"link": "#",
			"src": "/images/banners/s03.jpg"
		},
		{
			"link": "#",
			"src": "/images/banners/s04.jpg"
		},
		{
			"link": "#",
			"src": "/images/banners/s05.jpg"
		},
		{
			"link": "#",
			"src": "/images/banners/s06.jpg"
		}
	];



	//GET DOM OBJECTS TO ATTACH TO
	var prevButtonString = "#prev_image";
	var nextButtonString = "#next_image";
	var bannerAreaString = "#behind_banner_window_area";
	var bannerWindowString = "#banner_window";

	var $bannerWindow = $(bannerWindowString);

	var $behindBannerWindow = $(document.createElement('DIV'));
	$bannerWindow.append($behindBannerWindow.element[0]);
	$behindBannerWindow.attr('id', 'behind_banner_window_area');
	var $prevImageButton = $(prevButtonString);
	var $nextImageButton = $(nextButtonString);

	// declare dimension variables and bookeeping vars
	var imageWidth = 940;
	var imageHeight = 400;
	var activeImage = 0;
	var milliseconds = 400;

	//create the css for the banner window and behind window area
	$bannerWindow.css('width', imageWidth+'px').css('overflow', 'hidden')
		.css('padding', '0px');

	$behindBannerWindow.css('width', (imageWidth * (allImages.length + 1)) + 'px')
		.css('position', 'relative').css('padding', '0px');


	$('imageItem').css('float', 'left');

	//this is gross and hacky
	document.styleSheets[0].insertRule('#banner_window #behind_banner_window_area .imageItem {float: left;}', 0);
	document.styleSheets[0].insertRule('#banner_window #behind_banner_window_area .imageItem img { width: '+imageWidth+'px; height:'+imageHeight+'px}', 1);

	//add the last slide to the beginning for looping trickery
	$behindBannerWindow.append(makeDomImage(allImages[allImages.length - 1]).element[0]);

	//create the slides
	for (var i = 0; i < allImages.length; i++){
		var deal = allImages[i];
		var imageItem = makeDomImage(deal);
		$behindBannerWindow.append(imageItem.element[0]);
	};

	$prevImageButton.click(function(){
		goLeft();
	});
	$nextImageButton.click(function(){
		goRight();
	});

	function makeDomImage(image){
		var imageItem = $(document.createElement("DIV"));
		imageItem.attr('className', 'imageItem').css('padding', '0px').append('a')
		.attr('href', image.link).append('img').attr('src', image.src);
		return imageItem;
	}

	function goLeft(){
		if($behindBannerWindow.hasClass(":animating")){
			return false;
		}
		if(activeImage == 0){
			activeImage = allImages.length;
			var positionOfLastImage = imageWidth * allImages.length;
			$behindBannerWindow.css("left", "-"+positionOfLastImage+"px");
		}
		goToImage(activeImage - 1);
	}

	function goRight(){
		if($behindBannerWindow.hasClass(":animating")){
			return false;
		}
		if(activeImage == allImages.length){
			activeImage = 0;
			$behindBannerWindow.css("left", "-0px");
		}
		goToImage(activeImage + 1);
	}

	function goToImage(destinationImage){
		var offset = destinationImage * imageWidth;
		$behindBannerWindow.slide(-offset, milliseconds);
		activeImage = destinationImage;
	}

});
