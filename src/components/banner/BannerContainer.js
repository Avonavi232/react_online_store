import React from 'react';
import img1 from '../../img/slider.jpg';
import img2 from '../../img/slider2.jpg';
import img3 from '../../img/slider3.jpg';
import img4 from '../../img/slider4.jpg';

import {slider} from '../../utils/functions';
import BannerView from './BannerView';

export default class BannerContainer extends React.Component {
	constructor(props) {
		super(props);
		this.reqAnimFrameSupport();

		this.slides = [
			{
				img: img1,
				link: '/'
			},
			{
				img: img2,
				link: '/'
			},
			{
				img: img3,
				link: '/'
			},
			{
				img: img4,
				link: '/'
			}
		];
	}

	componentDidMount() {
		const f = document.querySelector('.slider__pictures'),
				a = f.getElementsByClassName('slider__image'),
				button = f.getElementsByClassName('slider__circles')[0].getElementsByClassName('slider__circle'),
				arrows = f.getElementsByClassName('slider__arrow');

		slider(f, a, button, '4000', '1000', arrows);
	}

	reqAnimFrameSupport() {
		window.requestAnimationFrame = (function () {
			return window.requestAnimationFrame ||
					function (callback) {
						return window.setTimeout(callback, 1000 / 60);
					};
		})();
	}

	render() {
		return (
				<BannerView slides={this.slides}/>
		)
	}
}