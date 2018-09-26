import React from 'react';
import PropTypes from "prop-types";

const CartItem = props => {
	const {item, handleChangeProductAmount} = props;

	return (
			<div className="basket-item">
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

const OrderForm = props => {
	return (
			<form onSubmit={props.handleSubmitOrder} action="#">
				<div className="order-process__delivery">
					<h3 className="h3">кому и куда доставить?</h3>
					<div className="order-process__delivery-form">
						<label className="order-process__delivery-label">
							<div className="order-process__delivery-text">Имя</div>
							<input
									className="order-process__delivery-input"
									type="text"
									name="buyer"
									placeholder="Представьтесь, пожалуйста"
							/>
						</label>
						<label className="order-process__delivery-label">
							<div className="order-process__delivery-text">Телефон</div>
							<input
									className="order-process__delivery-input"
									type="tel"
									name="phone"
									placeholder="Номер в любом формате"
							/>
						</label>
						<label className="order-process__delivery-label">
							<div className="order-process__delivery-text">Адрес</div>
							<input
									className="order-process__delivery-input order-process__delivery-input_adress"
									type="text"
									name="address"
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
									name="payment"
									value="onlineCard"
							/>
							<span className="order-process__paid-text">Картой онлайн</span>
						</label>
						<label className="order-process__paid-label">
							<input
									className="order-process__paid-radio"
									type="radio"
									name="payment"
									value="offlineCard"
							/>
							<span className="order-process__paid-text">Картой курьеру</span>
						</label>
						<label className="order-process__paid-label">
							<input
									className="order-process__paid-radio"
									type="radio"
									name="payment"
									value="offlineCash"
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
	)
};

const OrderDone = props => {
	const {orderInfo: info} = props;
	return (
			<section className="order-done">
				<h2 className="order-done__title order-process__title">Заказ принят, спасибо!</h2>
				<div className="order-done__information order-info">
					<div className="order-info__item order-info__item_summ">
						<h3>Сумма заказа:</h3>
						<p>{info.totalPrice}<i className="fa fa-rub" aria-hidden="true"></i></p>
					</div>
					<div className="order-info__item order-info__item_pay-form">
						<h3>Способ оплаты:</h3>
						<p>{info.paymentType}</p>
					</div>
					<div className="order-info__item order-info__item_customer-name">
						<h3>Имя клиента:</h3>
						<p>{info.name}</p>
					</div>
					<div className="order-info__item order-info__item_adress">
						<h3>Адрес доставки:</h3>
						<p>{info.address}</p>
					</div>
					<div className="order-info__item order-info__item_phone">
						<h3>Телефон:</h3>
						<p>{info.phone}</p>
					</div>
				</div>
				<p className="order-done__notice">Данные о заказе отправлены на адрес <span>notbosaanymore@gmail.com.  </span>
				</p>
				<button className="order-done__continue">продолжить покупки</button>
			</section>
	)
};

class OrderPage extends React.Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			cartUpdated: true,
			cartMirrorInit: false,
			cartMirror: undefined,
			orderDone: false,
			orderInfo: undefined
		};
	}

	componentDidMount() {
		this._initCart();
	}

	componentDidUpdate(prevProps, prevState) {
		this._initCart();

		if (!this.state.cartUpdated) {
			//поиск различий между корзиной в стейте app и зеркальной корзиной здесь
			const differences = this.state.cartMirror.filter(item => {
				const cartItem = this.props.cart.find(el => el.id === item.id);
				if (cartItem) {
					return cartItem.amount !== item.amount;
				}
			});

			//Создание промисов на соответствующие обновления корзины на сервере
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

	_initCart = () => {
		if (!this.state.cartMirrorInit && this.props.cart.length) {
			this.setState({
				cartMirror: this.props.cart,
				cartMirrorInit: true
			});
		}
	};

	_convertPaymentType(str){
		const converts = {
			onlineCard: "Картой онлайн",
			offlineCard: "Картой курьеру",
			offlineCash: "Наличными курьеру"
		};
		return converts[str];
	}

	_updateOrderDoneInfo = (orderInfo) => {
		this.setState({
			orderDone: true,
			orderInfo
		})
	};

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

	handleSubmitOrder = (e) => {
		e.preventDefault();

		const
				form = e.currentTarget,
				{order} = this.context.newApi;

		const body = {
			"name": form.buyer.value,
			"phone": form.phone.value,
			"address": form.address.value,
			"paymentType": form.payment.value,
			"cart": this.props.cartId
		};

		if (!body.name || !body.phone || !body.address || !body.paymentType || !body.cart) {
			return;
		}

		fetch(order(), {
					method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(body)
				}
		)
				.then(responce => {
					if (responce.status === 200) {
						return responce.json();
					} else {
						throw new Error('Order submit error');
					}
				})
				.then(data => {
					if (data.status === 'ok') {
						const totalPrice = this.state.cartMirror.reduce((prevVal, curVal) => {
							return prevVal + (curVal.amount * curVal.price);
						}, 0);

						const paymentType = this._convertPaymentType(data.data.info.paymentType);

						this._updateOrderDoneInfo(Object.assign({}, data.data.info, {totalPrice, paymentType}));
					} else {
						throw new Error('Submit order error');
					}
				});

	};


	render() {
		const
				{cartUpdated, cartMirror, orderDone, orderInfo} = this.state,
				{cartId} = this.props;

		let totalPrice;

		if (cartMirror && cartMirror.length) {
			totalPrice = cartMirror.reduce((prevVal, curVal) => {
				return prevVal + (curVal.amount * curVal.price);
			}, 0);
		}

		return (
				<div className="wrapper order-wrapper">
					{
						!orderDone ?
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
										{
											cartId ?
													orderDone ?
															<div>adf</div> :
															<OrderForm handleSubmitOrder={this.handleSubmitOrder}/> :
													<div>loading</div>
										}

									</div>
								</section> :
								<OrderDone orderInfo={orderInfo}/>
					}
				</div>
		)
	}
}

OrderDone.propTypes = {
	orderInfo: PropTypes.shape({
		address: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		paymentType: PropTypes.string.isRequired,
		phone: PropTypes.string.isRequired,
		totalPrice: PropTypes.number.isRequired,
	}).isRequired
};

OrderForm.propTypes = {
	handleSubmitOrder: PropTypes.func.isRequired
};

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
	cartId: PropTypes.string,
	handleUpdateCart: PropTypes.func.isRequired,
};

OrderPage.contextTypes = {
	newApi: PropTypes.object.isRequired
};

export default OrderPage;