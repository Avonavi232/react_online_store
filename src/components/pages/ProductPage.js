import React from 'react';
import {get, parseQuery} from "../../utils/functions";
import PropTypes from "prop-types";
import {Link} from 'react-router-dom';

import '../../css/style-product-card.css'

import Breadcrumbs from '../Breadcrumbs';
import ProductPics from '../ProductPics';
import Slider from '../Slider';

const overlookedSliderSettings = {
	direction: 'horizontal',
	equalWidth: true,
	gutter: 15,
	slidesToShow: 4,
	slidesToScroll: 2,
};

const similarSliderSettings = {
	direction: 'horizontal',
	equalWidth: true,
	gutter: 15,
	slidesToShow: 2,
	slidesToScroll: 1,
};


const SizePicker = props => {
	return (
			<ul className="sizes">
				{
					props.sizes.map(size => {
								let className = '';

								if (!size.available) {
									className += ' not-available';
								}

								if (props.activeSize !== undefined && props.activeSize.size === size.size) {
									className += ' active';
								}

								return (
										<li
												key={size.size}
												data-size={size.size}
												onClick={size.available ? props.onSizeSelect : (e) => e.preventDefault()}
												className={className}
										>
											{
												size.available ?
														<a href="/">{size.size}</a> :
														<span>{size.size}</span>
											}

										</li>
								);
							}
					)
				}
			</ul>
	);
};

const AmountPicker = props => {
	return (
			<div className="basket-item__quantity">
				<div
						onClick={() => props.setAmount('decr')}
						className="basket-item__quantity-change basket-item-list__quantity-change_minus"
				>-
				</div>
				{props.activeAmount}
				<div
						onClick={() => props.setAmount('incr')}
						className="basket-item__quantity-change basket-item-list__quantity-change_plus"
				>+
				</div>
			</div>
	)
};


export default class ProductPage extends React.Component {
	state = {
		product: undefined,
		similarItems: [],
		activeSize: undefined,
		activeAmount: 1
	};

	componentDidMount() {
		this.init();
	}

	init = () => {
		const productId = parseQuery(this.props.location.search).id;
		const {api} = this.context;
		get(`${api}/products/${productId}`)
				.then(({data}) => this.setState({
					product: data,
					activeSize: data.sizes.find(size => size.available)
				}, () => {
					this.saveAsOverlooked();
					this.initSimilarSlider();
				}));

	};

	setActiveSize = (event) => {
		event.preventDefault();


		const {currentTarget: target} = event;
		const
				sizeSelected = parseInt(target.dataset.size, 10),
				{sizes} = this.state.product;

		if (!sizes || !sizeSelected || (this.state.activeSize && this.state.activeSize.size === sizeSelected)) {
			return;
		}

		const activeSizeObj = sizes.find(size => size.size === sizeSelected);

		this.setState({
			activeSize: activeSizeObj
		})
	};

	setAmount = type => {
		const {activeAmount} = this.state;

		if (activeAmount === 1 && type === 'decr') {
			return;
		}

		const newAmount = type === 'incr' ? (activeAmount + 1) : (activeAmount - 1);

		this.setState({
			activeAmount: newAmount
		});
	};

	saveAsOverlooked = () => {
		const
				{product} = this.state,
				storageKey = this.context.overlookedStorageKey,
				overlookedArchive = this.getOverlookedItems();

		if (overlookedArchive.find(item => item.id === product.id)) {
			return;
		}

		const archiveItem = {
			id: product.id,
			images: product.images
		};

		const newOverlookedArchive = [archiveItem, ...overlookedArchive];

		if (newOverlookedArchive.length > 15) {
			const randomIndex = Math.floor(Math.random() * 16);
			newOverlookedArchive.splice(randomIndex, 1);
		}

		window.localStorage.setParsed(storageKey, newOverlookedArchive);
	};

	getOverlookedItems = () => {
		const storageKey = this.context.overlookedStorageKey;
		return localStorage.getParsed(storageKey, []);
	};

	getSimilarItems = () => {
		const
				{api} = this.context,
				{product} = this.state;

		const criterias = [
			'color',
			'material',
			'reason',
			'season'
		];

		const requests = [];

		criterias.forEach(criteria => {
			const p = new Promise(resolve => {
				get(`${api}/products/?categoryId=${product.categoryId}&${criteria}=${product[criteria]}`)
						.then(({data}) => {
							resolve(data);
						});
			});
			requests.push(p);
		});

		return Promise.all(requests)
				.then(data => data.reduce((prevVal, curVal) => prevVal.concat(curVal), []))
				.then(items => items.reduce((prevVal, curVal) => {
					if (prevVal.find && prevVal.find(item => item.id === curVal.id)) {
						return prevVal;
					} else {
						return [curVal, ...prevVal]
					}
				}, []));
	};

	initSimilarSlider = () => {
		this.getSimilarItems()
				.then(similarItems => this.setState({similarItems}));
	};

	getAvailablity = ({sizes}) => {
		return sizes.find(size => size.available);
	};

	componentDidUpdate(prevProps) {
		if (prevProps.location.search !== this.props.location.search) {
			this.init();
		}
	}


	render() {
		const
				{product, activeSize, activeAmount, similarItems} = this.state,
				overlookedItems = this.getOverlookedItems(),
				{handleUpdateCart} = this.props;

		return (
				<React.Fragment>
					<Breadcrumbs/>
					{
						product ?
								<React.Fragment>
									<main className="product-card">
										<section className="product-card-content">
											<h2 className="section-name">{product.title}</h2>
											<section className="product-card-content__main-screen">

												{
													this.state.product &&
													<ProductPics images={this.state.product.images}/>
												}

												<div className="main-screen__product-info">
													<div className="product-info-title"><h2>{product.title}</h2>
														<div
																className={this.getAvailablity(product) ? 'in-stock' : 'not-in-stock'}
														>{this.getAvailablity(product) ? 'В наличии' : 'Отсутствует'}</div>
													</div>
													<div className="product-features">
														<table className="features-table">
															<tbody>
															<tr>
																<td className="left-col">Артикул:</td>
																<td className="right-col">{product.sku}</td>
															</tr>
															<tr>
																<td className="left-col">Производитель:</td>
																<td className="right-col"><a href="/"><span
																		className="producer">{product.brand}</span></a></td>
															</tr>
															<tr>
																<td className="left-col">Цвет:</td>
																<td className="right-col">{product.color}</td>
															</tr>
															<tr>
																<td className="left-col">Материалы:</td>
																<td className="right-col">{product.material}</td>
															</tr>
															<tr>
																<td className="left-col">Сезон:</td>
																<td className="right-col">{product.season}</td>
															</tr>
															<tr>
																<td className="left-col">Повод:</td>
																<td className="right-col">{product.reason}</td>
															</tr>
															</tbody>
														</table>
													</div>
													<p className="size">Размер</p>
													<SizePicker
															activeSize={activeSize}
															sizes={product.sizes}
															onSizeSelect={this.setActiveSize}
													/>
													<div className="size-wrapper">
														<a href="/"><span className="size-rule"></span><p
																className="size-table">Таблица размеров</p>
														</a>
													</div>
													<a href="/" className="in-favourites-wrapper">
														<div className="favourite" href="/"></div>
														<p className="in-favourites">В избранное</p>
													</a>
													<AmountPicker
															activeAmount={activeAmount}
															setAmount={this.setAmount}
													/>
													<div className="price">{product.price * activeAmount} ₽</div>
													<button
															onClick={() => handleUpdateCart({
																id: product.id,
																title: product.title,
																images: product.images,
																size: activeSize.size,
																amount: activeAmount,
																price: product.price,
																color: product.color,
																brand: product.brand,
															})}
															className="in-basket in-basket-click"
													>В корзину
													</button>
												</div>

											</section>
										</section>
									</main>

									{
										overlookedItems.length > 0 ?
												<section className="product-card__overlooked-slider">
													<h3>Вы смотрели:</h3>
													<Slider settings={overlookedSliderSettings} className="overlooked-slider">
														{
															overlookedItems.map(item =>
																	<div
																			key={item.id}
																			className="overlooked-slider__item"
																			style={{backgroundImage: `url('${item.images[0]}')`}}
																	>
																		<Link to={`/product/?id=${item.id}`}/>
																	</div>
															)
														}
													</Slider>
												</section> :
												undefined
									}

									{
										similarItems.length ?
												<section className="product-card__similar-products-slider">
													<h3>Похожие товары:</h3>
													<Slider settings={similarSliderSettings} className="similar-products-slider">

														{
															similarItems.map(item =>
																	<div
																			key={item.id}
																			className="similar-products-slider__item-list__item-card item"
																	>
																		<div className="similar-products-slider__item">
																			<Link className="similar-products-slider__img-container"
																						to={`/product/?id=${item.id}`}>
																				<img
																						className="similar-products-slider__img"
																						src={item.images[0]}
																						alt={item.title}/>
																			</Link>
																		</div>
																		<div className="similar-products-slider__item-desc">
																			<h4 className="similar-products-slider__item-name">{item.title}</h4>
																			<p className="similar-products-slider__item-producer">Производитель: <span
																					className="producer">{item.brand}</span></p>
																			<p className="similar-products-slider__item-price">{item.price}</p>
																		</div>
																	</div>
															)
														}
													</Slider>
												</section> :
												undefined
									}

								</React.Fragment> :
								<div>Loading</div>
					}

				</React.Fragment>
		)
	}
}

ProductPage.propTypes = {
	handleUpdateCart: PropTypes.func.isRequired
};

ProductPage.contextTypes = {
	api: PropTypes.string.isRequired,
	overlookedStorageKey: PropTypes.string.isRequired,
};