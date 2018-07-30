import React from 'react';

const Slide = props =>
		<a className="slider__image" href={props.link}>
			<img src={props.img} alt="Slider item"/>
		</a>;

export default function BannerView(props) {
	return (
			<section className="slider">
				<div className="wrapper">
					<div className="slider__pictures">
						{
							props.slides.map((slide, index) =>
							<Slide key={slide.id || index} {...slide}/>
							)
						}
						<div className="arrow slider__arrow slider__arrow_left"/>
						<div className="arrow slider__arrow slider__arrow_right"/>
						<div className="slider__circles">
							{
								props.slides.map((slide, index) =>
										<button key={index} className="slider__circle" value={index}/>
								)
							}
						</div>
						<h2 className="h2">К весне готовы!</h2>
					</div>
				</div>
			</section>
	)
}