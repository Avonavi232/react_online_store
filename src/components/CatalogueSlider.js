import React from 'react';

export default class CatalogueSlider extends React.Component {
	render() {
		return (
				<section className="product-catalogue__overlooked-slider">
					<h3>Вы смотрели:</h3>
					<div className="overlooked-slider">
						<div className="overlooked-slider__arrow overlooked-slider__arrow_left arrow"/>

						{/*<div className="overlooked-slider__item overlooked-slider__item-1">*/}
							{/*<a href="/"/>*/}
						{/*</div>*/}
						{/*<div className="overlooked-slider__item overlooked-slider__item-2">*/}
							{/*<a href="/"/>*/}
						{/*</div>*/}
						{/*<div className="overlooked-slider__item overlooked-slider__item-3">*/}
							{/*<a href="/"/>*/}
						{/*</div>*/}
						{/*<div className="overlooked-slider__item overlooked-slider__item-4">*/}
							{/*<a href="/"/>*/}
						{/*</div>*/}
						{/*<div className="overlooked-slider__item overlooked-slider__item-5">*/}
							{/*<a href="/"/>*/}
						{/*</div>*/}

						<div className="overlooked-slider__arrow overlooked-slider__arrow_right arrow"/>
					</div>
				</section>
		)
	}
}