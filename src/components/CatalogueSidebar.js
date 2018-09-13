import React from 'react';
import PropTypes from 'prop-types';
import RangeSlider from './RangeSlider';

import {debounce, transliterate} from "../utils/functions";

class Toggler extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			hidden: this.props.hidden ? this.props.hidden : false,
			marginTop: '0px',
			marginTopToHide: undefined
		}
	}

	componentDidMount() {
		this.setState({
			marginTopToHide: this.contentWrapper.offsetHeight + 1,
			marginTop: this.state.hidden ? `-${this.contentWrapper.offsetHeight + 1}px` : '0px'
		})
	}

	animate(from, to, duration, callback, afterCallback) {
		let start = performance.now();

		requestAnimationFrame(function animate(time) {
			let timePassed = time - start;

			if (timePassed < 0) {
				timePassed = 0;
			} else if (timePassed > duration) {
				timePassed = duration;
			}

			if (callback) {
				const value = from + (to - from) * (timePassed / duration);
				callback(value);
			}


			if (timePassed < duration) {
				requestAnimationFrame(animate);
			} else if (afterCallback) {
				afterCallback();
			}
		});
	}

	handleToggleHidden = () => {
		const {hidden, marginTopToHide} = this.state;
		let from, to;

		if (hidden) {
			from = marginTopToHide;
			to = 0
		} else {
			to = marginTopToHide;
			from = 0
		}

		this.animate(
				from,
				to,
				this.props.speed ? this.props.speed : 300,
				mt => this.setState({marginTop: `-${mt}px`}),
				() => this.setState({hidden: !hidden})
		);
	};

	render() {
		const {marginTop, hidden} = this.state;

		return (
				<section className="sidebar__division">
					<div className="sidebar__division-title" onClick={this.handleToggleHidden}>
						<h3>{this.props.header || 'Header'}</h3>
						<div className={hidden ? "opener-down" : "opener-up"}/>
					</div>
					<div ref={el => this.contentWrapper = el} style={{overflow: 'hidden'}}>
						<div className="sidebar__division-content" style={{marginTop}}>
							{
								this.props.children
							}
						</div>
					</div>
				</section>
		)
	}
}

class CatalogueSidebar extends React.Component {
	render() {
		const {availableFilters, onSelectFilter} = this.props;
		return (
				<section className="sidebar">
					<Toggler header="Тип" speed={100} hidden={true}>
						<ul className="vertical-list">
							{
								availableFilters.type.map(type =>
										<li
												key={type}
												onClick={() => onSelectFilter({type})}
										>{type}</li>)
							}
						</ul>
					</Toggler>

					<Toggler header="Цена" speed={100} hidden={false}>
						<RangeSlider
								minVal={0}
								maxVal={100000}
								onChange={debounce((minPrice, maxPrice) => onSelectFilter({minPrice, maxPrice}), 500)}
						/>
					</Toggler>

					<Toggler header="Цвет" speed={100} hidden={false}>
						<ul className="vertical-list">
							{
								availableFilters.color.map(color =>
										<li
												className="color"
												key={color}
												onClick={() => onSelectFilter({color})}
										>
											<div className={`color-circle ${transliterate(color).toLowerCase()}`}/>
											<div className="color-name">{color}</div>
										</li>
								)
							}
						</ul>
					</Toggler>

					<Toggler header="Размер" speed={100} hidden={true}>
						<ul className="vertical-list">
							<div className="list-1">
								<li>
									<label>
										<input type="checkbox" className="checkbox" name="checkbox-31"/>
										<span className="checkbox-custom"/>
										<span className="label">31</span>
									</label>
								</li>
								<li>
									<label>
										<input type="checkbox" className="checkbox" name="checkbox-33"/>
										<span className="checkbox-custom"/>
										<span className="label">33</span>
									</label>
								</li>
								<li>
									<label>
										<input type="checkbox" className="checkbox" name="checkbox-35"/>
										<span className="checkbox-custom"/>
										<span className="label">35</span>
									</label>
								</li>
								<li>
									<label>
										<input type="checkbox" className="checkbox" name="checkbox-37"/>
										<span className="checkbox-custom"/>
										<span className="label">37</span>
									</label>
								</li>
								<li>
									<label>
										<input type="checkbox" className="checkbox" name="checkbox-39"/>
										<span className="checkbox-custom"/>
										<span className="label">39</span>
									</label>
								</li>
							</div>
							<div className="list-2">
								<li>
									<label>
										<input type="checkbox" className="checkbox" name="checkbox-32"/>
										<span className="checkbox-custom"/>
										<span className="label">32</span>
									</label>
								</li>
								<li>
									<label>
										<input type="checkbox" className="checkbox" name="checkbox-34"/>
										<span className="checkbox-custom"/>
										<span className="label">34</span>
									</label>
								</li>
								<li>
									<label>
										<input type="checkbox" className="checkbox" name="checkbox-36" checked/>
										<span className="checkbox-custom"/>
										<span className="label">36</span>
									</label>
								</li>
								<li>
									<label>
										<input type="checkbox" className="checkbox" name="checkbox-38"/>
										<span className="checkbox-custom"/>
										<span className="label">38</span></label>
								</li>
								<li>
									<label>
										<input type="checkbox" className="checkbox" name="checkbox-40"/>
										<span className="checkbox-custom"/>
										<span className="label">40</span>
									</label>
								</li>
							</div>
						</ul>
					</Toggler>

					<Toggler header="Размер каблука" speed={100} hidden={true}>
					</Toggler>

					<Toggler header="Повод" speed={100} hidden={true}>
						<ul className="vertical-list">
							<li><a href="/">Офис</a></li>
							<li><a href="/">Вечеринка</a></li>
							<li><a href="/">Свадьба</a></li>
							<li><a href="/">Спорт</a></li>
							<li><a href="/">Путешествие</a></li>
							<li><a href="/">Свидание</a></li>
							<li><a href="/">Дома</a></li>
							<li><a href="/">Произвести впечатление</a></li>
						</ul>
					</Toggler>

					<Toggler header="Сезон" speed={100} hidden={true}>
					</Toggler>

					<section className="sidebar__division">
						<h3 className="sidebar__division-title">Бренд</h3>
						<form action="" className="brand-search">
							<input type="search" className="brand-search" id="brand-search" placeholder="Поиск"/>
							<input type="submit" className="submit"/>
						</form>

						<label>
							<input type="checkbox" className="checkbox" name="checkbox-disc"/>
							<span className="checkbox-discount"/>
							<span className="text-discount">Со скидкой</span>
						</label>
					</section>

					<section className="sidebar__division">
						<div className="drop-down">
							<a href="/"><span className="drop-down-icon"/>Сбросить</a>
						</div>
					</section>
				</section>
		)
	}
}

CatalogueSidebar.propTypes = {
	onSelectFilter: PropTypes.func.isRequired,
	onChangePriceFilter: PropTypes.func.isRequired,
	availableFilters: PropTypes.object.isRequired
};

export default CatalogueSidebar;