define([], function() {
var makeBanner = function(bannerTargetID, prevButtonID, nextButtonID,
	imageWidth, imageHeight, milliseconds, allImages){

	//GET DOM OBJECTS TO ATTACH TO
	var $bannerWindow = $(bannerTargetID);
	var $prevImageButton = $(prevButtonID);
	var $nextImageButton = $(nextButtonID);

	//create the area where images will go, only a portion of this area is viewable
	var $behindBannerWindow = $(document.createElement('DIV'));
	$bannerWindow.append($behindBannerWindow.element[0]);
	$behindBannerWindow.attr('id', 'behind_banner_window_area');

	var activeImage = 0;

	//create the css for the banner window and behind window area
	//the behind window area is a very wide area to store all the images
	//side by side. The window css is set to overlow:hidden so only
	//one image is shown at a time, (except portions of two images during sliding)
	$bannerWindow.css('width', imageWidth+'px').css('overflow', 'hidden')
		.css('padding', '0px');
	$behindBannerWindow.css('width', (imageWidth * (allImages.length + 1)) + 'px')
		.css('position', 'relative').css('padding', '0px');
	$('imageItem').css('float', 'left');

	//this is gross and hacky
	document.styleSheets[0].insertRule('#banner_window #behind_banner_window_area' +
			' .imageItem {float: left;}', 0);
	document.styleSheets[0].insertRule('#banner_window #behind_banner_window_area' +
		' .imageItem img { display:block; width: '+imageWidth+'px; height:'
			+imageHeight+'px}', 1);

	//add the last image to the beginning for looping trickery
	$behindBannerWindow.append(makeDomImage(allImages[allImages.length - 1]).element[0]);

	//create the images and add them to the area "behind" the banner window
	for (var i = 0; i < allImages.length; i++){
		var imageInfo = allImages[i];
		var imageItem = makeDomImage(imageInfo);
		$behindBannerWindow.append(imageItem.element[0]);
	};

	//hook up the buttons
	$prevImageButton.click(function(){
		goLeft();
		return false;
	});
	$nextImageButton.click(function(){
		goRight();
		return false;
	});

	function makeDomImage(imageInfo){
		var imageItem = $(document.createElement("DIV"));
		imageItem.attr('className', 'imageItem')
			.css('padding', '0px').append('a')
			.attr('href', imageInfo.link).append('img')
			.attr('src', imageInfo.src);
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

}

return makeBanner;

});
