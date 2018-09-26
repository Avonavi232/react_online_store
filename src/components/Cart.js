import React from 'react';
import PropTypes from 'prop-types';
import {NavLink} from 'react-router-dom';

const CartItem = props => {
	return (
			<div className="product-list__item">
				<a className="product-list__pic">
					<img src={props.img} alt="product"/> </a>
				<NavLink
						to={`/product/?id=${props.id}`}
						className="product-list__product"
				>
					{`${props.title} (размер: ${props.size})`}
				</NavLink>
				<div className="product-list__fill"/>
				<div className="product-list__price">
					<span>{`${props.amount} x ${Number(props.price)} = ${props.amount * Number(props.price)}`}</span>
					<i className="fa fa-rub" aria-hidden="true"/>
				</div>
				<div
						className="product-list__delete"
						onClick={() => props.handleUpdateCart({
							id: props.id,
							size: props.size,
							amount: 0
						})}
				>
					<i className="fa fa-times" aria-hidden="true"/>
				</div>
			</div>
	)
};

const Cart = props => {
	return (
			<div className="hidden-panel__basket basket-dropped">
				<div className="basket-dropped__title">
					{
						props.cart.length ?
								'В вашей корзине:' :
								'В корзине пока ничего нет. Не знаете, с чего начать? Посмотрите наши новинки!'
					}
				</div>

				<div className="basket-dropped__product-list product-list">
					{
						props.cart.length ?
								props.cart.map(item => {
									return (
											<CartItem
													key={item.id}
													title={item.title}
													img={item.images[0]}
													id={item.id}
													amount={item.amount}
													size={item.size}
													price={item.price}
													handleUpdateCart={props.handleUpdateCart}
											/>
									)
								}) :
								undefined
					}
				</div>

				{
					props.cart.length ?
							<NavLink to="./order"><span className="basket-dropped__order-button">Оформить заказ</span></NavLink> :
							undefined
				}
			</div>
	)
};

Cart.propTypes = {
	handleUpdateCart: PropTypes.func.isRequired,
	cart: PropTypes.array.isRequired
};

CartItem.propTypes = {
	title: PropTypes.string.isRequired,
	img: PropTypes.string.isRequired,
	id: PropTypes.number.isRequired,
	amount: PropTypes.number.isRequired,
	size: PropTypes.number.isRequired,
	price: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number
	]).isRequired,
	handleUpdateCart: PropTypes.func.isRequired
};

export default Cart;