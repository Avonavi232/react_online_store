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
        if (clear !== 0 && progress > Vo) {
        } else {
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
    if (this.className.split(' ')[this.className.split(' ').length - 1] === ('main-menu__item_active')) {
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

export function serialize(obj) {
    const str = [];
    for (let p in obj) {
        if (obj.hasOwnProperty(p)) {
            if (obj[p] === undefined || (Array.isArray(obj[p]) && obj[p].length < 1)) {
                continue;
            } else if (Array.isArray(obj[p]) && obj[p].length >= 1) {
                obj[p].forEach(el => str.push(`${encodeURIComponent(p)}[]=${encodeURIComponent(el)}`));
            } else {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        }
    }
    return str.join("&");
}

export function debounce(fn, delay) {
    var timer = null;
    return function () {
        var context = this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            fn.apply(context, args);
        }, delay);
    };
}

const a = {
    "Ё": "YO",
    "Й": "I",
    "Ц": "TS",
    "У": "U",
    "К": "K",
    "Е": "E",
    "Н": "N",
    "Г": "G",
    "Ш": "SH",
    "Щ": "SCH",
    "З": "Z",
    "Х": "H",
    "Ъ": "'",
    "ё": "yo",
    "й": "i",
    "ц": "ts",
    "у": "u",
    "к": "k",
    "е": "e",
    "н": "n",
    "г": "g",
    "ш": "sh",
    "щ": "sch",
    "з": "z",
    "х": "h",
    "ъ": "'",
    "Ф": "F",
    "Ы": "I",
    "В": "V",
    "А": "a",
    "П": "P",
    "Р": "R",
    "О": "O",
    "Л": "L",
    "Д": "D",
    "Ж": "ZH",
    "Э": "E",
    "ф": "f",
    "ы": "i",
    "в": "v",
    "а": "a",
    "п": "p",
    "р": "r",
    "о": "o",
    "л": "l",
    "д": "d",
    "ж": "zh",
    "э": "e",
    "Я": "Ya",
    "Ч": "CH",
    "С": "S",
    "М": "M",
    "И": "I",
    "Т": "T",
    "Ь": "'",
    "Б": "B",
    "Ю": "YU",
    "я": "ya",
    "ч": "ch",
    "с": "s",
    "м": "m",
    "и": "i",
    "т": "t",
    "ь": "'",
    "б": "b",
    "ю": "yu"
};

export function transliterate(word) {
    return word.split('').map(function (char) {
        return a[char] || char;
    }).join("");
}

export function localStorageGetParsedPlugin() {
    Object.getPrototypeOf(localStorage).getParsed = function (key, defaultStructure) {
        const str = this.getItem(key);
        defaultStructure = defaultStructure || "";
        try {
            return str ? JSON.parse(str) : defaultStructure
        } catch (e) {
            console.error(e);
        }
    };
}

export function localStorageSetParsedPlugin() {
    Object.getPrototypeOf(localStorage).setParsed = function (key, value) {
        try {
            this.setItem(key, JSON.stringify(value));
            return true
        } catch (e) {
            console.error(e);
            return false;
        }
    };
}

export function handleSelectFilter(filterObject) {
    this.setState({
        filters: {
            ...this.state.filters,
            ...filterObject
        }
    });
}

export function isFunction(functionToCheck) {
	return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

export function parseQuery(input) {
	if (!input || typeof input !== 'string') {
		throw new Error('input string is not passed or not a string');
	}

	if (!isFunction(decodeURIComponent)) {
		throw new Error('There is not browser support of decodeURIComponent');
  }

	const ret = Object.create(null);

	input = input.trim().replace(/^[?#&]/, '');

	for (const param of input.split('&')) {
		let [key, value] = param.replace(/\+/g, ' ').split('=');
		value = value === undefined ? null : decodeURIComponent(value);
		key = decodeURIComponent(key);
		ret[key] = value;
	}
	return ret;
}

