var spin               = document.getElementById('spin'),
    dateSpin           = document.querySelectorAll('.date-item'),
    line               = document.querySelector('.line'),
    content            = document.querySelectorAll('.content'),
    contentScroll      = document.querySelector('.content-scroll'),
    angle              = 0, // початкове значення кута
    angleStep          = 10, // крок повороту
    transitionAnimSpin = 0.7; // плавність анімації 

// задаєм плавність анімації
spin.style.transition = transitionAnimSpin + 's';
contentScroll.style.transition = transitionAnimSpin + 's';

// додає data- атрибут до HTML елемента для подальшого зчитування з них даних
function setDataAttribute(target, name, value, step) {
	var name = 'data-' + name;
	
	for (var i = 0; i < target.length; i++) {
		target[i].setAttribute(name, value);
		value += step;
	}
}

setDataAttribute(dateSpin, 'angle', angle, angleStep ); // для значення кута повороту
setDataAttribute(dateSpin, 'scroll', 0, 300 ); // для задання значення проскроленого елемента на величину angleStep

// вішаємо event 'click' на parentNode і функція яка визивається
spin.addEventListener('click', rotateTimelLineClick);

// провірка на подію прокрутка колеса мишки на обекті з id="spin"
if (spin.addEventListener) {
  if ('onwheel' in document) {
    // IE9+, FF17+, Ch31+
    spin.addEventListener("wheel", onWheel);
  } else if ('onmousewheel' in document) {
    // устаревший вариант события
    spin.addEventListener("mousewheel", onWheel);
  } else {
    // Firefox < 17
    spin.addEventListener("MozMousePixelScroll", onWheel);
  }
} else { // IE8-
  spin.attachEvent("onmousewheel", onWheel);
}

// запускає анімацію при скролі
function onWheel(e) {
  e = e || window.event;
  // wheelDelta не дает возможность узнать количество пикселей
  var delta = e.deltaY || e.detail || e.wheelDelta;	
  rotateTimelLineScroll(delta, hasClassChild("active")); 
  e.preventDefault ? e.preventDefault() : (e.returnValue = false);
}

// поворот кола при кліку на дату 
function rotateTimelLineClick (event) {
	if(device.mobile()) return; // якщо девайс телефон клік не працює
	var target = event.target; // на який елемент було клікнуто
	if (target.tagName != "SPAN" || target.classList.contains('active')) return; // якщо клік на <span>(.date-item) 
	startAnimation(target, 'click', target);
}
// поворот при скролі коли курсор находиться на в колі або над датою
function rotateTimelLineScroll(delta, index) {
	if(device.tablet()) return; // якщо планшет скролл не працює
	var pos;
	(delta > 0 ) ? pos = index - 1: pos = index + 1;
	if(pos < 0  || pos > spin.children.length-1) return;
	startAnimation(dateSpin[pos], 'scroll', pos); 
}

// функція яка запускає анімацію(повороту, полоски, дати з текстом) 
function startAnimation (active, eventType, target) {
	var _angle, scrollDataAttr;

	if(eventType == 'click') {
		_angle = target.getAttribute('data-angle'); // отримуємо атрибут клікнутого елемента щоб знати кут повороту
		scrollDataAttr = target.getAttribute('data-scroll');
	} else if(eventType == 'scroll') {
		_angle = dateSpin[target].getAttribute('data-angle');
		scrollDataAttr = dateSpin[target].getAttribute('data-scroll'); 
	}

	spin.style.transform = 'rotate(' + (-_angle) + 'deg)'; // анімація повороту
	toggleActiveClass(active); // зміна кольору дати в кругу
	lineAnimanion(); // видаляє полоску
	setTimeout(lineAnimanion, 300 + (transitionAnimSpin * 100)); // добавляє полоску
 	scrollDate(scrollDataAttr);
}

// зміна активного класу для дати
function toggleActiveClass (target) {
	// цикл видаляє класи 'active' для неактивних елементів span
	for(var i = 0; i < spin.children.length; i++) {
		dateSpin[i].classList.remove('active');
	}
	// добавляє клас 'active' на клікнутий елемент
	target.classList.add('active');
}

// анімація полоски
function lineAnimanion() {	
	line.classList.toggle('line-anim-width');	
}

// анімація дати з контентом
function scrollDate (scroll) {
	setTimeout(function(){
		contentScroll.style.transform = 'translateY(' + (-scroll) + 'px)';
	}, 400);	
}

// Перевірка на клас active в тегу span 
function hasClassChild(className) {
	var index;
	for (var i = 0; i < spin.children.length; i++) {
		if ( dateSpin[i].classList.contains(className) ) {
			index = i;
			break;
		}	 
	}
	return index;
}