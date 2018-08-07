import React from 'react';

import {get} from "../utils/functions";
import PropTypes from "prop-types";

class Toggler extends React.Component{
	constructor(props){
		super(props);

        this.state = {
        	open: true,
			initHeight: 0,
			heightChecked: false,
            speed: 8,
            heightStep: undefined,
			init: false,

        	blockStyles: {}
		};

	}

	componentDidMount(){
        this.init(this.collapsibleElement);
	}

	toggleHandler = () => {
		const
			{open, initHeight, heightStep} = this.state,
			{block} = this.refs;


		this.tick(heightStep, initHeight, open);

	};

	setCollapsibleElement = (el) => {
		this.collapsibleElement = el;
	};

	init = (container) => {
		return new Promise(resolve => {
			const initHeight = container.offsetHeight;
            const heightStep = initHeight * this.state.speed / 100;

            this.setState({
				initHeight,
				heightStep,
				init: true
			}, () => resolve());
		});
	};

	tick = (heightStep, initHeight, open) => {

		const currentHeight =
			this.state.blockStyles.height ? parseInt(this.state.blockStyles.height) :
				open ? initHeight : 0;

		let newHeight = open ? currentHeight - heightStep : currentHeight + heightStep;


		if ( open && newHeight < 0) {
			newHeight = 0;

		} else if (!open && newHeight > initHeight) {
            newHeight = initHeight;
		}

		this.setState({
            blockStyles: {
                ...this.state.blockStyles,
                height: `${newHeight}px`,
				overflow: 'hidden',
				display: 'block'
            }
		}, () => {

            if ((open && newHeight > 0) || (!open && newHeight < initHeight)) {
                requestAnimationFrame(() => this.tick(heightStep, initHeight, open));
            } else {
            	let newBlockStyles = Object.assign({}, this.state.blockStyles);
            	delete newBlockStyles.height;
            	delete newBlockStyles.overflow;

            	if (!open) {
                    newBlockStyles.display = 'block';
                    this.setState({
						blockStyles: newBlockStyles,
						open: true
                    });
				} else {
                    newBlockStyles.display = 'none';
                    this.setState({
                        blockStyles: newBlockStyles,
                        open: false
                    });
				}
			}
		});


	};


	render(){
		return(
			<React.Fragment>
				{
					this.props.children(this.toggleHandler, this.setCollapsibleElement, this.state.blockStyles)
				}
			</React.Fragment>
		)
	}
}



export default class CatalogueSidebar extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			filters: undefined
		}
	}

	componentDidMount(){
		const {api} = this.context;

        get(`${api}/filters`)
            .then(({data: filters}) => {
            	this.setState({filters})
			});
	}


	render() {
		const {filters} = this.state;
		console.log(filters);



		return (
				<section className="sidebar">
					{
						filters && filters.type ?
                            <Toggler>
                                {
                                    (onToggle, collapsibleElement, collapsibleElementStyle) => (
                                        <section className="sidebar__division">
                                            <div className="sidebar__catalogue-list">
                                                <div onClick={onToggle} className="sidebar__division-title">
                                                    <h3>Тип</h3>
                                                    <div className="opener-down"></div>
                                                </div>
                                                <ul style={collapsibleElementStyle} ref={collapsibleElement}>
                                                    {
                                                        filters.type.map(item =>
                                                           <li><a href="#">{item}</a></li>
                                                        )
                                                    }
                                                </ul>
                                            </div>
                                        </section>
                                    )
                                }
                            </Toggler> :
							undefined
					}

                    <Toggler>
                        {
                            (onToggle, collapsibleElement, collapsibleElementStyle) => (
                                <section className="sidebar__division">
                                    <div className="sidebar__price">
                                        <div onClick={onToggle} className="sidebar__division-title">
                                            <h3>Цена</h3>
                                            <div className="opener-down"/>
                                        </div>
                                        <div style={collapsibleElementStyle} ref={collapsibleElement} className="price-slider">
                                            <div className="circle-container">
                                                <div className="circle-1"/>
                                                <div className="line-white"/>
                                                <div className="line-colored"/>
                                                <div className="circle-2"/>
                                            </div>
                                            <div className="counter">
                                                <input type="text" className="input-1" value="1000"/>
                                                <div className="input-separator"/>
                                                <input type="text" className="input-2" value="30 000"/>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            )
                        }
                    </Toggler>

					{
						filters && filters.color ?
                            <Toggler>
                                {
                                    (onToggle, collapsibleElement, collapsibleElementStyle) => (
                                        <section className="sidebar__division">
                                            <div className="sidebar__color">
                                                <div onClick={onToggle} className="sidebar__division-title">
                                                    <h3>Цвет</h3>
                                                    <div className="opener-down"/>
                                                </div>
                                                <ul style={collapsibleElementStyle} ref={collapsibleElement}>
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
                                            </div>
                                        </section>
                                    )
                                }
                            </Toggler> :
							undefined
					}

					{
						filters && filters.sizes ?
                            <Toggler>
                                {
                                    (onToggle, collapsibleElement, collapsibleElementStyle) => (
                                        <section className="sidebar__division">
                                            <div className="sidebar__size">
                                                <div onClick={onToggle} className="sidebar__division-title">
                                                    <h3>Размер</h3>
                                                    <div className="opener-down"/>
                                                </div>
                                                <ul style={collapsibleElementStyle} ref={collapsibleElement}>
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
                                            </div>
                                        </section>
                                    )
                                }
                            </Toggler> :
							undefined
					}


                    <Toggler>
                        {
                            (onToggle, collapsibleElement, collapsibleElementStyle) => (
                                <section className="sidebar__division">
                                    <div className="sidebar__heel-height">
                                        <div onClick={onToggle} className="sidebar__division-title">
                                            <h3>Размер каблука</h3>
                                            <div className="opener-up"/>
                                        </div>
										<div style={collapsibleElementStyle} ref={collapsibleElement}>
											1 <br/>
											2 <br/>
											3
										</div>
                                    </div>
                                </section>
                            )
                        }
                    </Toggler>

                    <Toggler>
                        {
                            (onToggle, collapsibleElement, collapsibleElementStyle) => (
                                <section className="sidebar__division">
                                    <div className="sidebar__occasion">
                                        <div onClick={onToggle} className="sidebar__division-title">
                                            <h3>Повод</h3>
                                            <div className="opener-down"/>
                                        </div>
                                        <ul style={collapsibleElementStyle} ref={collapsibleElement}>
                                            <li><a href="/">Офис</a></li>
                                            <li><a href="/">Вечеринка</a></li>
                                            <li><a href="/">Свадьба</a></li>
                                            <li><a href="/">Спорт</a></li>
                                            <li><a href="/">Путешествие</a></li>
                                            <li><a href="/">Свидание</a></li>
                                            <li><a href="/">Дома</a></li>
                                            <li><a href="/">Произвести впечатление</a></li>
                                        </ul>
                                    </div>
                                </section>
                            )
                        }
                    </Toggler>


                    <Toggler>
                        {
                            (onToggle, collapsibleElement, collapsibleElementStyle) => (
                                <section className="sidebar__division">
                                    <div className="sidebar__season">
                                        <div onClick={onToggle} className="sidebar__division-title">
                                            <h3>Сезон</h3>
                                            <div className="opener-up"/>
                                        </div>
										<div style={collapsibleElementStyle} ref={collapsibleElement}>
											1 <br/>
											2 <br/>
											3 <br/>
										</div>
                                    </div>
                                </section>
                            )
                        }
                    </Toggler>


					<section className="sidebar__division">
						<div className="sidebar__brand">
							<h3>Бренд</h3>
							<form action="" className="brand-search">
								<input type="search" className="brand-search" id="brand-search" placeholder="Поиск"/>
								<input type="submit" name="" value="" className="submit"/>
							</form>
						</div>

						<label>
							<input type="checkbox" className="checkbox" name="checkbox-disc"/>
							<span className="checkbox-discount"/>
							<span className="text-discount">Со скидкой</span>
						</label>

						<div className="separator-240"/>
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

CatalogueSidebar.contextTypes = {
    api: PropTypes.string.isRequired,
    overlookedStorageKey: PropTypes.string.isRequired,
};