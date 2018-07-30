export function slider(f, img, button, V, Vo, arrows) {
	var iii = 0,
			start = null,
			clear = 0;

	function step(time) {
		if (start === null) start = time;
		var progress = time - start;
		if (progress > V) {
			start = null;
			for (var i = 0; i < img.length; i++) {
				img[i].style.zIndex = "0";
				button[i].style.opacity = "0.5";
			}
			img[iii].style.zIndex = "1";
			iii = ((iii !== (img.length - 1)) ? (iii + 1) : 0);
			img[iii].style.zIndex = "2";
			img[iii].style.opacity = "0";
			button[iii].style.opacity = "1";
		} else if (img[iii].style.opacity !== "") {
			img[iii].style.opacity = ((progress / Vo < 1) ? (progress / Vo) : 1);
		}
		if (clear !== 0 && progress > Vo) {} else {
			requestAnimationFrame(step);
		}
	}
	requestAnimationFrame(step);
	f.onmouseenter = function () {
		if (clear === 0) clear = 1;
	} // при наведении на слайдер
	f.onmouseleave = function () {
		if (clear === 1) {
			clear = 0;
			requestAnimationFrame(step);
		}
	} // курсор убран со слайдера
	for (var j = 0; j < button.length; j++) { // при нажатии кнопок
		// eslint-disable-next-line
		button[j].onclick = function () {
			for (var i = 0; i < img.length; i++) {
				img[i].style.zIndex = "0";
				button[i].style.opacity = "0.5";
			}
			iii = +this.value;
			img[this.value].style.zIndex = "2";
			button[this.value].style.opacity = "1";
		}
		// eslint-disable-next-line
		arrows[0].onclick = function () {
			img[iii].style.zIndex = "0";
			button[iii].style.opacity = "0.5";
			iii--;
			iii = ((iii < 0) ? img.length - 1 : iii);
			img[iii].style.zIndex = "2";
			button[iii].style.opacity = "1";
		}
		// eslint-disable-next-line
		arrows[1].onclick = function () {
			img[iii].style.zIndex = "0";
			button[iii].style.opacity = "0.5";
			iii++;
			iii = ((iii === img.length) ? 0 : iii);
			img[iii].style.zIndex = "2";
			button[iii].style.opacity = "1";
		}
	}
}

//Видимость блока корзина и профиля в шапке
export function headerHiddenPanelProfileVisibility() {
	document.querySelector('.hidden-panel__basket').classList.remove('hidden-panel__basket_visible');
	document.querySelector('.hidden-panel__profile').classList.add('hidden-panel__profile_visible');
	if (document.querySelector('.header-main__pic_basket_menu_is-active')) {
		document.querySelector('.header-main__pic_basket_menu_is-active').classList.toggle('header-main__pic_basket_menu_is-active');
		document.querySelector('.header-main__pic_profile_menu').classList.toggle('header-main__pic_profile_menu_is-active');
	} else {
		document.querySelector('.header-main__hidden-panel').classList.toggle('header-main__hidden-panel_visible');
		document.querySelector('.header-main__pic_profile_menu').classList.toggle('header-main__pic_profile_menu_is-active');
	}
}
export function headerHiddenPanelBasketVisibility() {
	document.querySelector('.hidden-panel__profile').classList.remove('hidden-panel__profile_visible');
	document.querySelector('.hidden-panel__basket').classList.add('hidden-panel__basket_visible');
	if (document.querySelector('.header-main__pic_profile_menu_is-active')) {
		document.querySelector('.header-main__pic_basket_menu').classList.toggle('header-main__pic_basket_menu_is-active');
		document.querySelector('.header-main__pic_profile_menu_is-active').classList.toggle('header-main__pic_profile_menu_is-active');
	} else {
		document.querySelector('.header-main__hidden-panel').classList.toggle('header-main__hidden-panel_visible');
		document.querySelector('.header-main__pic_basket_menu').classList.toggle('header-main__pic_basket_menu_is-active');
	}
}

//Функция видимости меню поиска в шапке
export function headerMainSearchVisibility() {
	document.querySelector('.header-main__search').classList.toggle('header-main__search_active');
	document.querySelector('.header-main__pic_search').classList.toggle('header-main__pic_search_is-hidden');
}

//Выпадающее меню главного меню (пока с общим списком для всех пунктов)
export function mainSubmenuVisibility() {
	console.log(this.className);
	if (this.className.split(' ')[this.className.split(' ').length-1] === ('main-menu__item_active')) {
		document.querySelector('.dropped-menu').classList.remove('dropped-menu_visible')
		this.classList.remove('main-menu__item_active');
	} else {
		if (document.querySelector('.main-menu__item_active')) {
			document.querySelector('.main-menu__item_active').classList.toggle('main-menu__item_active');
		}
		document.querySelector('.dropped-menu').classList.add('dropped-menu_visible');
		this.classList.toggle('main-menu__item_active');
	}
}

export function get(url) {
	return new Promise(resolve => {
		fetch(url)
				.then(res => {
					if (res.status >= 200 && res.status < 300) {
						return res.json();
					} else {
						throw new Error(`Get error. Status: ${res.status}`);
					}
				})
				.then(data => resolve(data))
	});
}

