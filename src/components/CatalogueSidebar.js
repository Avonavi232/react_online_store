import React from 'react';

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

class RangeSlider extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			dragging: false,
			relPos: undefined,
			minRelPos: undefined,
			maxRelPos: undefined,
			currentTarget: undefined,
			lineWidth: undefined,
			lineLeft: undefined,

			circleMin: {
				relPos: undefined,
				width: undefined,
				left: undefined,
				value: 0
			},

			circleMax: {
				relPos: undefined,
				width: undefined,
				left: undefined,
				value: 20000
			},

			styles: {
				circleMin: {
					left: '0px'
				},
				circleMax: {
					left: '100px'
				},
				lineColoured: {
					left: '20px',
					width: '60px'
				}
			}
		};
	}

	componentDidMount() {
		const {circleMin, circleMax} = this.state;

		this.setState({
			lineWidth: this.line.offsetWidth,
			lineLeft: this.refs.container.getBoundingClientRect().left,
			circleMin: {
				...circleMin,
				width: this.circleMin.offsetWidth
			},
			circleMax: {
				...circleMax,
				width: this.circleMax.offsetWidth
			}
		});
	}

	valueToLeft = value => {
		const {minVal, maxVal} = this.props;

		if (!minVal || !maxVal) {
			return;
		}
		console.log()
	};

	handleStartDragging = event => {
		event.preventDefault();

		const
				targetName = event.currentTarget.dataset.target,
				relPos = event.pageX - event.currentTarget.getBoundingClientRect().left;

		if (!targetName) {
			return;
		}

		this.setState({
			dragging: true,
			currentTarget: event.currentTarget,
			[targetName]: {
				...this.state[targetName],
				relPos
			}
		});
	};

	handleStopDragging = () => {
		this.setState({
			dragging: false,
			currentTarget: undefined
		})
	};

	handleCircleDrag = event => {
		event.preventDefault();

		if (!this.state.dragging) {
			return;
		}

		const
				{currentTarget, lineLeft, lineWidth} = this.state,
				{relPos, width: circleWidth} = this.state[currentTarget.dataset.target];

		let newPos = event.pageX - relPos - lineLeft;

		if (newPos < 0) {
			newPos = 0;
		} else if (newPos > (lineWidth - circleWidth)) {
			newPos = (lineWidth - circleWidth);
		}



		this.setState({
			[currentTarget.dataset.target]: {
				...this.state[currentTarget.dataset.target],
				left: `${newPos}px`
			}
		});

	};

	componentDidUpdate(props, state) {
		if (this.state.dragging && !state.dragging) {
			document.addEventListener('mousemove', this.handleCircleDrag);
			document.addEventListener('mouseup', this.handleStopDragging);
		} else if (!this.state.dragging && state.dragging) {
			document.removeEventListener('mousemove', this.handleCircleDrag);
			document.removeEventListener('mouseup', this.handleStopDragging);
		}
	}

	render() {
		const {circleMin, circleMax, styles} = this.state;
		return (
				<div className="price-slider">
					<div ref="container" className="circle-container">
						<div
								onMouseDown={this.handleStartDragging}
								style={{left: circleMin.left}}
								ref={el => this.circleMin = el}
								data-target="circleMin"
								className="circle-1"
						/>
						<div ref={el => this.line = el} className="line-white"/>
						<div style={styles.lineColoured} className="line-colored"/>
						<div
								onMouseDown={this.handleStartDragging}
								style={{left: circleMax.left}}
								ref={el => this.circleMax = el}
								className="circle-2"
								data-target="circleMax"
						/>
					</div>
					<div className="counter">
						<input type="text" className="input-1" value="1000"/>
						<div className="input-separator"/>
						<input type="text" className="input-2" value="30 000"/>
					</div>
				</div>
		)
	}
}


export default class CatalogueSidebar extends React.Component {
	handleRangeSliderChange = (values) => {
		// console.log(values);
	};


	render() {
		return (
				<section className="sidebar">
					<Toggler header="Каталог" speed={100} hidden={true}>
						<ul className="vertical-list">
							<li><a href="/">Балетки</a></li>
							<li><a href="/">Босоножки и сандалии</a></li>
							<li><a href="/">Ботильоны</a></li>
							<li><a href="/">Ботинки</a></li>
							<li><a href="/">Ботфорты</a></li>
							<li><a href="/">Галоши</a></li>
							<li><a href="/">Тапочки</a></li>
							<li><a href="/">Туфли</a></li>
							<li><a href="/">Сапоги</a></li>
						</ul>
					</Toggler>

					<Toggler header="Цена" speed={100} hidden={false}>
						<RangeSlider
								minVal={0}
								maxVal={30000}
								onChange={this.handleRangeSliderChange}
						/>
					</Toggler>

					<Toggler header="Цвет" speed={100} hidden={true}>
						<ul className="vertical-list">
							<li><a href="/">
								<div className="color beige"/>
								<span className="color-name">Бежевый</span></a></li>
							<li><a href="/">
								<div className="color whitesnake"/>
								<span className="color-name">Белый</span></a></li>
							<li><a href="/">
								<div className="color shocking-blue"/>
								<span className="color-name">Голубой</span></a></li>
							<li><a href="/">
								<div className="color yellow"/>
								<span className="color-name">Жёлтый</span></a></li>
							<li><a href="/">
								<div className="color king-crimson"/>
								<span className="color-name">Алый</span></a></li>
							<li><a href="/">
								<div className="color deep-purple"/>
								<span className="color-name">Фиолетовый</span></a></li>
							<li><a href="/">
								<div className="color black-sabbath"/>
								<span className="color-name">Чёрный</span></a></li>
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