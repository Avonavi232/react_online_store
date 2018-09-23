import React from 'react';
import PropTypes from "prop-types";

const CartItem = props => {
	const {item, handleChangeProductAmount} = props;

	return (
			<div className="basket-item" data-id={item.id}>
				<div className="basket-item__pic">
					<img
							src={item.images[0]}
							alt="product_1"
					/>
				</div>
				<div className="basket-item__product">
					<div className="basket-item__product-name"><a href="#">{item.title}</a></div>
					<div className="basket-item__product-features">
						<div className="basket-item__size">Размер: <span>{item.size}</span></div>
						<div className="basket-item__producer">Производитель: <span>{item.brand}</span></div>
						<div className="basket-item__color">Цвет: <span>{item.color}</span></div>
					</div>
				</div>
				<div className="basket-item__quantity">
					<div
							onClick={() => handleChangeProductAmount(item.id, item.amount - 1)}
							className="basket-item__quantity-change basket-item-list__quantity-change_minus"
					>
						-
					</div>
					<span>{item.amount}</span>
					<div
							onClick={() => handleChangeProductAmount(item.id, item.amount + 1)}
							className="basket-item__quantity-change basket-item-list__quantity-change_plus"
					>
						+
					</div>
				</div>
				<div className="basket-item__price">
					{item.amount < 2 ? item.price : `${item.amount} * ${item.price} = ${item.amount * item.price}`}
					<i className="fa fa-rub" aria-hidden="true"></i>
				</div>
			</div>
	)
};

class OrderPage extends React.Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			cartUpdated: true,
			cartMirrorInit: false,
			cartMirror: undefined,
		};
	}

	componentDidMount() {

	}

	componentDidUpdate(prevProps, prevState) {
		if (!this.state.cartMirrorInit && this.props.cart.length) {
			this.setState({
				cartMirror: this.props.cart,
				cartMirrorInit: true
			});
		}

		if (!this.state.cartUpdated) {
			const differences = this.state.cartMirror.filter(item => {
				const cartItem = this.props.cart.find(el => el.id === item.id);
				if (cartItem) {
					return cartItem.amount !== item.amount;
				}
			});

			const promises = differences.map(item => {
				return new Promise(resolve => {
					this.props.handleUpdateCart(item)
							.then(() => resolve());
				})
			});

			Promise.all(promises)
					.then(() => {
						this.setState({
							cartUpdated: true
						})
					});

		}
	}

	handleChangeProductAmount = (id, amount) => {
		const cart = this.state.cartMirror;

		this.setState({
			cartUpdated: false,
			cartMirror: cart.map(item => {
				if (item.id === id) {
					return Object.assign({}, item, {amount});
				} else {
					return item;
				}
			})
		});
	};


	render() {
		const {cartUpdated, cartMirror} = this.state;

		let totalPrice;

		if (cartMirror && cartMirror.length) {
			totalPrice = cartMirror.reduce((prevVal, curVal) => {
				return prevVal + (curVal.amount * curVal.price);
			}, 0);
		}

		return (
				<section className="order-process">
					<h2 className="order-process__title">Оформление заказа</h2>
					<div className="order-process__basket order-basket">
						<div className="order-basket__title">в вашей корзине:</div>

						<div className="order-basket__item-list">
							{
								cartMirror && cartMirror.length ?
										cartMirror.map(item => {
											if (item.amount > 0) {
												return (
														<CartItem
																key={item.id}
																item={item}
																handleChangeProductAmount={this.handleChangeProductAmount}
														/>
												)
											}
										}) :
										<div>Загрузка</div>
							}
						</div>

						<div className="order-basket__summ">
							<span>
								{
									cartUpdated ?
											totalPrice >= 0 ?
													<React.Fragment>
														<span>Итого: </span>
														<span>{totalPrice}<i className="fa fa-rub" aria-hidden="true"></i></span>
													</React.Fragment> :
													undefined :
											<p>считаем...</p>
								}
							</span>

						</div>
					</div>

					<div className="order-process__confirmed">
						<form action="#">
							<div className="order-process__delivery">
								<h3 className="h3">кому и куда доставить?</h3>
								<div className="order-process__delivery-form">
									<label className="order-process__delivery-label">
										<div className="order-process__delivery-text">Имя</div>
										<input
												className="order-process__delivery-input"
												type="text"
												name="delivery"
												placeholder="Представьтесь, пожалуйста"
										/>
									</label>
									<label className="order-process__delivery-label">
										<div className="order-process__delivery-text">Телефон</div>
										<input
												className="order-process__delivery-input"
												type="tel"
												name="delivery"
												placeholder="Номер в любом формате"
										/>
									</label>
									<label className="order-process__delivery-label">
										<div className="order-process__delivery-text">Адрес</div>
										<input
												className="order-process__delivery-input order-process__delivery-input_adress"
												type="text"
												name="delivery"
												placeholder="Ваша покупка будет доставлена по этому адресу"
										/>
									</label>
								</div>
								<p>Все поля обязательны для заполнения. Наш оператор свяжется с вами для уточнения деталей
									заказа.</p>
							</div>
							<div className="order-process__paid">
								<h3 className="h3">хотите оплатить онлайн или курьеру при получении?</h3>
								<div className="order-process__paid-form">
									<label className="order-process__paid-label">
										<input
												className="order-process__paid-radio"
												type="radio"
												name="paid"
												value="card-online"
										/>
										<span className="order-process__paid-text">Картой онлайн</span>
									</label>
									<label className="order-process__paid-label">
										<input
												className="order-process__paid-radio"
												type="radio"
												name="paid"
												value="card-courier"
												checked=""
										/>
										<span className="order-process__paid-text">Картой курьеру</span>
									</label>
									<label className="order-process__paid-label">
										<input
												className="order-process__paid-radio"
												type="radio"
												name="paid"
												value="cash"
										/>
										<span className="order-process__paid-text">Наличными курьеру</span>
									</label>
								</div>
							</div>
							<button
									type="submit"
									className="order-process__form-submit order-process__form-submit_click"
							>
								Подтвердить заказ
							</button>
						</form>
					</div>
				</section>
		)
	}
}

CartItem.propTypes = {
	item: PropTypes.shape({
		images: PropTypes.array.isRequired,
		title: PropTypes.string.isRequired,
		brand: PropTypes.string.isRequired,
		color: PropTypes.string.isRequired,
		size: PropTypes.number.isRequired,
		amount: PropTypes.number.isRequired,
		price: PropTypes.number.isRequired,
		id: PropTypes.number.isRequired,
	}).isRequired,
	handleChangeProductAmount: PropTypes.func.isRequired
};

OrderPage.propTypes = {
	cart: PropTypes.array.isRequired,
	handleUpdateCart: PropTypes.func.isRequired,
};

OrderPage.contextTypes = {
	newApi: PropTypes.object.isRequired
};

export default OrderPage;