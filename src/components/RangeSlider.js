import React from 'react';

class RangeSlider extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			dragging: false, //состояние (двигаем шарик или нет)
			currentTarget: undefined, //шарик, который двигаем в данный момент
			lineWidth: undefined, //ширина линейки слайдера
			lineLeft: undefined, //Х координата левого края линейки на странице
			minVal: this.props.minVal,
			maxVal: this.props.maxVal,

			targets: {
				circleMin: {
					relPos: undefined,
					width: undefined,
					left: undefined,
					value: 0
				},

				circleMax: {
					relPos: undefined, //точка от левого края шарика, за которую мы начали ее тянуть (от 0 до диам.шарика)
					width: undefined, //диаметр шарика
					left: undefined, //положение шарика на линейке
					value: 20000 //значение, соответствующее положению шарика
				},

				lineColoured: {
					left: undefined,
					width: undefined
				}
			}
		};
	}

	componentDidMount() {
		const
				{circleMin, circleMax} = this.state.targets,
				{minVal, maxVal} = this.props,
				lineWidth = this.line.offsetWidth,
				circleMinLeft = this.valueToCoord(minVal, lineWidth),
				circleMaxLeft = this.valueToCoord(maxVal, lineWidth) - this.circleMax.offsetWidth,
				colouredLineLeft = circleMinLeft + this.circleMin.offsetWidth / 2,
				colouredLineWidth = circleMaxLeft + this.circleMax.offsetWidth / 2 - colouredLineLeft;

		//Вычисление геометрии элементов слайдера
		this.setState({
			lineWidth,
			lineLeft: this.refs.container.getBoundingClientRect().left,
			targets: {
				...this.state.targets,
				circleMin: {
					...circleMin,
					width: this.circleMin.offsetWidth,
					left: circleMinLeft
				},
				circleMax: {
					...circleMax,
					width: this.circleMax.offsetWidth,
					left: circleMaxLeft
				},
				lineColoured: {
					left: `${colouredLineLeft}px`,
					width: `${colouredLineWidth}px`,
				}
			}
		});
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.state.dragging && !prevState.dragging) {
			document.addEventListener('mousemove', this.handleCircleDrag);
			document.addEventListener('mouseup', this.handleStopDragging);
		} else if (!this.state.dragging && prevState.dragging) {
			document.removeEventListener('mousemove', this.handleCircleDrag);
			document.removeEventListener('mouseup', this.handleStopDragging);
		}

		if (this.props.onChange && (prevState.minVal !== this.state.minVal || prevState.maxVal !== this.state.maxVal)) {
			this.props.onChange(this.state.minVal, this.state.maxVal);
		}
	}

	isNumeric(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	}

	valueToCoord = (value, lineWidth = this.state.lineWidth) => {
		const
				{minVal, maxVal} = this.props;

		if (!this.isNumeric(minVal) || !this.isNumeric(maxVal) || !this.isNumeric(lineWidth)) {
			return;
		}

		if (value < minVal) {
			value = minVal;
		} else if (value > maxVal) {
			value = maxVal;
		}

		return (value / (maxVal - minVal)) * lineWidth;
	};

	coordToValue = (coord, lineWidth = this.state.lineWidth) => {
		const
				{minVal, maxVal} = this.props,
				range = maxVal - minVal;

		if (!this.isNumeric(minVal) || !this.isNumeric(maxVal) || !this.isNumeric(lineWidth)) {
			return;
		}

		if (coord < 0) {
			coord = 0;
		} else if (coord > lineWidth) {
			coord = lineWidth;
		}

		return minVal + (coord / lineWidth) * range;
	};

	handleStartDragging = event => {
		event.preventDefault();

		const
				targetName = event.currentTarget.dataset.target,
				relPos = event.pageX - event.currentTarget.getBoundingClientRect().left;

		if (!targetName) {
			throw new Error('handleStartDragging: TargetName is not provided');
		}

		this.setState({
			dragging: true,
			currentTarget: event.currentTarget,
			targets: {
				...this.state.targets,
				[targetName]: {
					...this.state.targets[targetName],
					relPos
				}
			}
		});
	};

	handleCircleDrag = event => {
		event.preventDefault();

		if (!this.state.dragging) {
			return;
		}

		const
				{currentTarget, lineLeft, lineWidth} = this.state,
				targetName = currentTarget.dataset.target,
				{relPos, width: circleWidth} = this.state.targets[targetName],
				circleMinLeft = parseInt(this.state.targets.circleMin.left, 10),
				circleMaxLeft = parseInt(this.state.targets.circleMax.left, 10),
				circleMinWidth = parseInt(this.state.targets.circleMin.width, 10),
				circleMaxWidth = parseInt(this.state.targets.circleMax.width, 10);


		if (!targetName) {
			throw new Error('handleStartDragging: TargetName is not provided');
		}

		//Рассчитываем координату шарика относительно левого края линейки.
		let newPos = event.pageX - relPos - lineLeft;

		//Ограничиваем координату от 0 до ширины линейки
		if (newPos < 0) {
			newPos = 0;
		} else if (newPos > (lineWidth - circleWidth)) {
			newPos = (lineWidth - circleWidth);
		}


		//Ограничиваем возможность поменять шарики местами (друг за друга)
		if (circleMinLeft >= 0 && circleMaxLeft >= 0) {
			if (targetName === 'circleMax') {
				if (newPos < circleMinLeft) {
					newPos = circleMinLeft;
				}
			} else if (targetName === 'circleMin') {
				if (newPos > circleMaxLeft) {
					newPos = circleMaxLeft;
				}
			}
		}


		//Рассчитываем новые значения CSS для линейки между шариками
		const
				newLineLeft = targetName === 'circleMin' ?
						newPos + circleWidth / 2 :
						circleMinLeft + circleMinWidth / 2,
				newLineWidth = targetName === 'circleMax' ?
						newPos + circleWidth / 2 - newLineLeft :
						circleMaxLeft + circleMaxWidth / 2 - newLineLeft;

		//Рассчитаем новые значения Value
		let minVal, maxVal;
		if (targetName === 'circleMax') {
			minVal = this.coordToValue(circleMinLeft).toFixed(0);
			maxVal = this.coordToValue(newPos + circleWidth).toFixed(0);
		} else if (targetName === 'circleMin') {
			minVal = this.coordToValue(newPos).toFixed(0);
			maxVal = this.coordToValue(circleMaxLeft + circleMaxWidth).toFixed(0);
		}

		// для поля targetName в state (это поле соответствует двигаемому шарику)
		// устанавливаем значение left (используется в CSS)
		this.setState({
			minVal,
			maxVal,
			targets: {
				...this.state.targets,
				[targetName]: {
					...this.state.targets[targetName],
					left: `${newPos}px`
				},
				lineColoured: {
					left: `${newLineLeft}px`,
					width: `${newLineWidth}px`
				}
			}
		});

	};

	handleStopDragging = () => {
		this.setState({
			dragging: false,
			currentTarget: undefined
		})
	};

	handleInputDirectChange = event => {
		const targetName = event.currentTarget.dataset.target;

		if (!targetName) {
			throw new Error('handleInputDirectChange: target is not provided');
		}

		if (!this.isNumeric(Number(event.currentTarget.value))) {
			return;
		}

		let value = Number(event.currentTarget.value);

		//Ограничим вводимые значения максимальным и минимальным числом
		if (value > this.props.maxVal) {
			value = this.props.maxVal
		} else if (value < this.props.minVal) {
			value = this.props.minVal;
		}

		const
				minVal = targetName === 'minVal' ?
						value : this.state.minVal ?
								this.state.minVal : this.props.minVal,
				maxVal = targetName === 'maxVal' ?
						value : this.state.maxVal ?
								this.state.maxVal : this.props.maxVal,
				circleMinLeft = this.valueToCoord(minVal),
				circleMaxLeft = this.valueToCoord(maxVal) - this.circleMax.offsetWidth,
				colouredLineLeft = circleMinLeft + this.circleMin.offsetWidth / 2,
				colouredLineWidth = circleMaxLeft + this.circleMax.offsetWidth / 2 - colouredLineLeft;

		this.setState({
			minVal,
			maxVal,
			targets: {
				...this.state.targets,
				circleMin: {
					...this.state.targets.circleMin,
					left: circleMinLeft
				},
				circleMax: {
					...this.state.targets.circleMax,
					left: circleMaxLeft
				},
				lineColoured: {
					left: `${colouredLineLeft}px`,
					width: `${colouredLineWidth}px`,
				}
			}
		})
	};

	render() {
		const
				{circleMin, circleMax, lineColoured} = this.state.targets,
				{minVal, maxVal} = this.state;
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
						<div style={lineColoured} className="line-colored"/>
						<div
								onMouseDown={this.handleStartDragging}
								style={{left: circleMax.left}}
								ref={el => this.circleMax = el}
								className="circle-2"
								data-target="circleMax"
						/>
					</div>
					<div className="counter">
						<input
								type="text"
								className="input-1"
								value={minVal}
								data-target="minVal"
								onChange={this.handleInputDirectChange}
						/>
						<div className="input-separator"/>
						<input
								type="text"
								className="input-2"
								value={maxVal}
								data-target="maxVal"
								onChange={this.handleInputDirectChange}
						/>
					</div>
				</div>
		)
	}
}

export default RangeSlider;