/**
* @author Stephan Reich (2012)
*
*/

function SwipeList() {

	var elementWidth, containerWidth, elementNum, elementContainer, currentOffset, outerElement,firstElement, lastElement,selectCallback, styleCallback, data
	var startIndex = 0,
	 	visibleElements = 5,
	 	selectElement = true,
	 	selectIndexOffset = 2,
		selectedIndex = 1 + selectIndexOffset,
		startX = 0, //used for calculation of drag distance
		firstIndex = 0,
		lastIndex = 0,
		indexOffset = 0,
		tempOffset = 0,
		leftOffset = 0;
		touchMode = false,
		indexSwitched = true,
		tempIndex = -1;


	//can be overwritten/extended
	var defaults = {
		styleCallback: false,
		selectCallback:false,
		index:0,
		fullscreen:false,
		elementHTML:false,
		selectOnDrag:true,
		tolerance:10,
		preventDragExceptions:"",
		switchOnDrag:true

	}

	function calcSelectedIndex() {
		var middle = containerWidth / 2; //optimizeable
		var offset;
		var value = elementNum-1;

		$.each($(".sliderElement",outerElement),function(i,element){
			offset =  $(this).offset().left - outerElement.offset().left;
				if(middle - offset < elementWidth){ 
				 	value = i;
					return false;
				}
				value = i;
		});
		if(value!=tempIndex){
			indexSwitched = true;
			//console.log("calcSelectedIndex() - index: " + value  + " tempIndex: " + tempIndex + " ----  offset: " + offset +  "  middle: " + middle);
			tempIndex = value;
		} 

		return value;
	}


	function handleIndexSelection() {
		selectedIndex = calcSelectedIndex();
		if(defaults.switchOnDrag) selectIndex(selectedIndex, defaults.selectOnDrag);
	}

	function selectIndex(index, callCallback) {

			if(indexSwitched){
				$(".selected", outerElement).removeClass("selected");
				getElementByIndex(index).addClass("selected");
				if (selectCallback && callCallback){		
					//console.log("callcallback");
					var globalIndex = getElementByIndex(index).data("index");		 
						selectCallback.call(this, data[globalIndex],globalIndex);
					indexSwitched = false;
				} 
		 	}

	}




	var canMove =false;

	function move(e) {
		//e.preventDefault();

			function calcTempOffset(){
				if (touchMode) {
				tempOffset = e.originalEvent.touches[0].pageX - startX;
			} else {
				tempOffset = e.clientX - startX ; 
			}
}
		
		if(!$(e.target).hasClass(defaults.preventDragExceptions))  e.preventDefault();
		
		
		//check if tolerance is surpassed
		if(!canMove){
			if(!touchMode){
				if(Math.abs(toleranceStartX - e.clientX) > defaults.tolerance) canMove = true;
			}else{
				if(Math.abs(toleranceStartX - e.originalEvent.touches[0].pageX) > defaults.tolerance) canMove = true;
					
			}
		}
		if(canMove) {
		//	e.stopPropagation();

			handleIndexSelection();

			//console.log(e);
			calcTempOffset();

			firstIndex 	= firstElement.data("index") - 1;
			lastIndex 	= lastElement.data("index") +1 ;



				//if positive offset
				//	console.log("tempOffset: " + tempOffset +  " firstIndex: "  + firstIndex  +  " lastIndex: "  + lastIndex + " getCSSOffset(): " + getCSSOffset());
				if (tempOffset > 0 && (firstIndex >= 0 ||  (firstIndex==-1 && defaults.endless))) { 
					if((firstIndex==-1 && defaults.endless)) firstIndex = lastIndex-1;

					for(var i=0; i<tempOffset/elementWidth; i++){
						//console.log(i + "  " + tempOffset);
						updateElement(lastElement, firstIndex);
						setOffset(tempOffset - elementWidth);
						elementContainer.prepend(lastElement);
						startX += elementWidth;
						indexSwitched =true;

						firstElement = getFirstElement();
						lastElement  = getLastElement();	
						firstIndex 	= firstElement.data("index") - 1;
						if(firstIndex == -1) break;

						calcTempOffset();

					}


				} else if (tempOffset < -1*elementWidth && (lastIndex < elementNum || (lastIndex >= elementNum && defaults.endless))) {
					if((lastIndex >= elementNum  && defaults.endless)){ 
						lastIndex = 0;
					}
					//var element = getFirstElement();
				//console.log("right to left!");
					for(var i=0; i < Math.abs(tempOffset)/elementWidth; i++){
						updateElement(firstElement, lastIndex);
						setOffset(tempOffset + elementWidth);
						startX -= elementWidth;
						elementContainer.append(firstElement);
						//elementContainer.append(createElement(lastIndex));
						//firstElement.remove();
						indexSwitched =true;
						if(i>0) console.log("shaky?");
						firstElement = getFirstElement();
						lastElement  = getLastElement();
						lastIndex 	= lastElement.data("index") +1 ;
					 	if(lastIndex >= elementNum) break;

						calcTempOffset();

					}


				} else {
					setOffset(tempOffset);
				}
				

		}

	}

	var toleranceStartX = 0;
	function start(e) {
		//e.preventDefault();
		//e.stopPropagation();

		if(e.originalEvent && e.originalEvent.touches) touchMode = true

		var half = elementWidth/2;
		if(visibleElements==1) half = 0; //hmm not sure why, actually! ;)
		if (touchMode){
			 startX = e.originalEvent.touches[0].pageX - parseInt(elementContainer.css("left")) - half; 
			toleranceStartX = e.originalEvent.touches[0].pageX;

		}else {
			startX = e.clientX - parseInt(elementContainer.css("left")) - half; 
			toleranceStartX = e.clientX;

		}
		
		if(defaults.tolerance == 0) canMove = true;
		//console.log(e.clientX + " " + e.screenX + "  " + elementContainer.css("left") + " " );

		$(document).bind("mousemove touchmove",move);
		
		$(document).bind("mouseup touchend", stop);
	}

	function setOffset(offset) {
		elementContainer.css("left", offset - leftOffset + "px");
		currentOffset = offset - leftOffset;
	}

	function stop() {
		$(document).unbind("mousemove touchmove", move);
		$(document).unbind("mouseup touchend", stop);

		if(canMove){
		var offset = getCSSOffset();
		var newOffset = (containerWidth/2) - (selectedIndex)*elementWidth -elementWidth/2;


		//console.log("stop() -  newOffset: " +  newOffset  + " selectedIndex: " + selectedIndex +" indexOffset: " + indexOffset + " elementWidth: " + elementWidth  +"  containerWidth: " + containerWidth);

		elementContainer.animate({
			left: newOffset
		}, 400, function() {
			//indexSwitched = true; //because it is most likely to be false, better make sure
			selectIndex(calcSelectedIndex(), true);
		});
		canMove=false;
		}
	}



	function getFirstElement() {
		return $(".sliderElement", outerElement).first();
	}

	function getLastElement() {
		return $(".sliderElement", outerElement).last();
	}

	function getElementByIndex(index) { //local index
		return $(".sliderElement", outerElement).eq(index);
	}

	function getCSSOffset() {
		return parseInt(elementContainer.css("left"));
	}

	function calcElementWidth() {
		if(!defaults.fullscreen){
			var tempEl = $("<div class='sliderElement'></div>");
			elementContainer.append(tempEl);
			var elWidth = tempEl.width();
			tempEl.remove();
			return elWidth + 2;
		}else{
			return outerElement.width();
		}
	}

	function calcVisibleElements() {

		return Math.ceil(containerWidth / elementWidth);
	}

	function createElement(index) {
		var element = $('<div class="sliderElement"></div>');
		if(defaults.elementHTML) element.append(defaults.elementHTML);
		if(defaults.fullscreen) element.width(outerElement.width());

		updateElement(element, index);
		return element;
	}

	function updateElement(element, index) {
		element.data("index", index);
		if (styleCallback) styleCallback.call(this, data[index], element,data);
	}



	return {
		init: function(listData, target, options) {
		//	console.log(listData);
			$.extend(defaults,options);

			outerElement = target;

			data = listData;
			elementNum = listData.length;

			elementContainer 	= $(".sliderInner", target);
			containerWidth 		= outerElement.width();
			elementWidth 		= calcElementWidth(); //gnah: calculate margins and borders programatically in please
			currentOffset 		= getCSSOffset();
			leftOffset 			= (elementWidth %containerWidth   ) / 2;

			//////////console.log("leftOffset:  " + leftOffset + "   -- containerWidth: " +  containerWidth + "   elementWidth: " +   elementWidth);

			startIndex 			= defaults.index;
			selectedIndex 		= startIndex;
			selectCallback 		= defaults.selectCallback;
			styleCallback 		= defaults.styleCallback;

			visibleElements = calcVisibleElements();
			elementContainer.width(elementWidth*(visibleElements+3));
			selectIndexOffset = parseInt(visibleElements / 2) - 1;
		
			this.setIndex(startIndex);



			var that = this;
		$(window).resize(function(){
				postInit();

			}); 

		window.onorientationchange = function(){
			postInit();
		};

		//sets all dimension etc. called on init and on orientation change
		function postInit(){
				
					if(defaults.fullscreen) elementWidth = calcElementWidth();
					containerWidth = outerElement.width();
					leftOffset = (containerWidth % elementWidth) / 2;
					visibleElements = calcVisibleElements();
					//IndexOffset = parseInt(visibleElements / 2) - 1;

					that.setIndex(selectedIndex);

			}


			outerElement.bind("mousedown touchstart", start);
		},

		
		setIndex: function(index, callCallback) {
			$(".sliderElement", elementContainer).remove();

			if(index > elementNum) index = elementNum-1;


			if (elementNum < visibleElements + 2) {
				var i = 0;
				var iEnd = i + elementNum;
				indexOffset = 0;
				//	console.log("case x - index: " + index + " iStart:" + i  + " iEnd: " + iEnd+ " visibleElement: " + visibleElements + " totalElements: " + elementNum  );
			} else if (index <= visibleElements / 2) {
				var i = 0;
				var iEnd = i + visibleElements + 2;
				indexOffset = 0;
				//	console.log("case 1 - index: " + index + " iStart:" + i  + " iEnd: " + iEnd + " visibleElement: " + visibleElements  + " totalElements: " + elementNum  );
			//	setOffset(+((visibleElements - 2) / 2) * elementWidth - index * elementWidth)
			} else if (index + visibleElements / 2 > elementNum) {
				var i = elementNum - visibleElements - 2;
				var iEnd = i + visibleElements + 2;
				indexOffset = i;
				//setOffset(-((index - indexOffset) - visibleElements / 2) * elementWidth - elementWidth);
				//	console.log("case 2 - index: " + index + " iStart:" + i  + " iEnd: " + iEnd+ " visibleElement: " + visibleElements  + " totalElements: " + elementNum   );
			} else {
				var i = index - parseInt(visibleElements / 2) - 1;
				var iEnd = i + visibleElements + 2;
				//setOffset(-(((visibleElements + 2) * elementWidth) - containerWidth) / 2);
				indexOffset = i;
				//console.log("case 3 - index: " + index + " iStart:" + i  + " iEnd: " + iEnd+ " visibleElement: " + visibleElements  + " totalElements: " + elementNum  );
			}
				
		
			for (i; i < iEnd; i++) {
				elementContainer.append(createElement(i));
			}

			firstElement = getFirstElement();
			lastElement  = getLastElement();

			setOffset((containerWidth/2) - (index - indexOffset)*elementWidth -elementWidth/2 + leftOffset) ; 

			//console.log("index: "  + index + " indexOffset:"  + indexOffset + " element num: " + elementNum);
	
			indexSwitched = true;
			selectIndex(index - indexOffset, callCallback);

		},



		setData: function(listData) {
			index = 0;
			data = listData;
			elementNum = listData.length;

			startIndex = defaults.index;

			this.setIndex(0,false);
		},
		setSelectOnDrag: function(value) {
			defaults.selectOnDrag = value;
		},
		
		getSelectedElement: function(){
			return getElementByIndex(selectedIndex);
		},

		getSelectedIndex: function(){
			return selectedIndex;
		},
		getSelectedDataIndex: function(){
			return data[getElementByIndex(selectedIndex).data("index")];
		}

	}

}