function SwipeList(){var f=0;var g=5;var h=true;var j;var k=true;var l=2;var m=1+l;var n,containerWidth,elementNum,elementContainer,currentOffset,j;var o,lastElement;var p=0;var q=0,lastIndex=0,indexOffset=0,tempOffset=0,leftOffset=0;var r,styleCallback;var s;var t={styleCallback:false,selectCallback:false,index:0,fullscreen:false,elementHTML:false}var u=true;var v=-1;function calcSelectedIndex(){var b=containerWidth/2;var c;var d=elementNum-1;$.each($(".sliderElement",j),function(i,a){c=$(this).offset().left-j.offset().left;if(i==1)console.log("offset: "+c+" middle: "+b+"  elementWidth: "+n);if(b-c<n){d=i;return false}});if(d!=v){u=true;console.log("calcSelectedIndex() - index: "+d+" tempIndex: "+v+" ----  offset: "+c+"  middle: "+b);v=d}return d}function handleIndexSelection(){m=calcSelectedIndex();selectIndex(m,h)}function selectIndex(a,b){if(u){$(".selected",j).removeClass("selected");getElementByIndex(a).addClass("selected");if(r&&b){r.call(this,s[getElementByIndex(a).data("index")])}u=false}}function move(e){e.preventDefault();handleIndexSelection();if(e.originalEvent&&e.originalEvent.touches){tempOffset=e.originalEvent.touches[0].pageX-p}else{tempOffset=e.clientX-p}q=o.data("index")-1;lastIndex=lastElement.data("index")+1;if(tempOffset>0&&q>=0){updateElement(lastElement,q);setOffset(tempOffset-n);elementContainer.prepend(lastElement);p+=n;u=true;o=getFirstElement();lastElement=getLastElement()}else if(tempOffset<-2*n&&lastIndex<elementNum){updateElement(o,lastIndex);setOffset(tempOffset+n);elementContainer.append(o);p-=n;u=true;o=getFirstElement();lastElement=getLastElement()}else{setOffset(tempOffset)}}function start(e){var a=n/2;if(g==1)a=0;if(e.originalEvent&&e.originalEvent.touches)p=e.originalEvent.touches[0].pageX-parseInt(elementContainer.css("left"));else p=e.clientX-parseInt(elementContainer.css("left"))-a;$(document).bind("mousemove touchmove",move);$(document).bind("mouseup touchend",stop)}function setOffset(a){elementContainer.css("left",a-leftOffset+"px");currentOffset=a-leftOffset}function stop(){$(document).unbind("mousemove touchmove",move);$(document).unbind("mouseup touchend",stop);var a=getCSSOffset();var b=(containerWidth/2)-(m)*n-n/2;console.log("stop() -  newOffset: "+b+" selectedIndex: "+m+" indexOffset: "+indexOffset+" elementWidth: "+n+"  containerWidth: "+containerWidth);elementContainer.animate({left:b},400,function(){u=true;selectIndex(calcSelectedIndex(),true)})}function getFirstElement(){return $(".sliderElement",j).first()}function getLastElement(){return $(".sliderElement",j).last()}function getElementByIndex(a){return $(".sliderElement",j).eq(a)}function getCSSOffset(){return parseInt(elementContainer.css("left"))}function calcElementWidth(){if(!t.fullscreen){var a=$("<div class='sliderElement'></div>");elementContainer.append(a);var b=a.width();a.remove();return b+2}else{return j.width()}}function calcVisibleElements(){return Math.ceil(containerWidth/n)}function createElement(a){var b=$('<div class="sliderElement"></div>');if(t.elementHTML)b.append(t.elementHTML);if(t.fullscreen)b.width(j.width());updateElement(b,a);return b}function updateElement(a,b){a.data("index",b);if(styleCallback)styleCallback.call(this,s[b],a)}return{init:function(a,b,c){$.extend(t,c);j=b;s=a;elementNum=a.length;elementContainer=$(".sliderInner",b);containerWidth=j.width();n=calcElementWidth();currentOffset=getCSSOffset();leftOffset=(n%containerWidth)/2;console.log("leftOffset:  "+leftOffset+"   -- containerWidth: "+containerWidth+"   elementWidth: "+n);f=t.index;r=t.selectCallback;styleCallback=t.styleCallback;g=calcVisibleElements();elementContainer.width(n*(g+3));l=parseInt(g/2)-1;this.setIndex(f);var d=this;$(window).resize(function(){postInit()});window.onorientationchange=function(){postInit()};function postInit(){containerWidth=j.width();leftOffset=(containerWidth%n)/2;g=calcVisibleElements();d.setIndex(m)}j.bind("mousedown touchstart",start)},setIndex:function(a,b){$(".sliderElement",elementContainer).remove();if(a>elementNum)a=elementNum-1;if(elementNum<g+2){var i=0;var c=i+elementNum;indexOffset=0}else if(a<=g/2){var i=0;var c=i+g+2;indexOffset=0}else if(a+g/2>elementNum){var i=elementNum-g-2;var c=i+g+2;indexOffset=i}else{var i=a-parseInt(g/2)-1;var c=i+g+2;indexOffset=i}for(i;i<c;i++){elementContainer.append(createElement(i))}o=getFirstElement();lastElement=getLastElement();setOffset((containerWidth/2)-(a-indexOffset)*n-n/2+leftOffset);console.log("index: "+a+" indexOffset:"+indexOffset+" element num: "+elementNum);u=true;selectIndex(a-indexOffset,b)},setData:function(a){index=0;s=a;elementNum=a.length;f=t.index;this.setIndex(0,false)},setSelectOnDrag:function(a){h=a},getSelectedElement:function(){return getElementByIndex(m)},next:function(){},prev:function(){}}}