import React from 'react';
import PropTypes from 'prop-types';

const CartItem = props => {
	return(
			<div className="product-list__item">
				<a className="product-list__pic">
					<img src="img/product-list__pic_1.jpg" alt="product"/> </a>
				<a href="/" className="product-list__product">Ботинки женские, Baldinini</a>
				<div className="product-list__fill"/>
				<div className="product-list__price">
					<span>12 360</span>
					<i className="fa fa-rub" aria-hidden="true"/>
				</div>
				<div className="product-list__delete">
					<i className="fa fa-times" aria-hidden="true"/>
				</div>
			</div>
	)
};

const Cart = props => {
	return(
			<div className="hidden-panel__basket basket-dropped">
				<div className="basket-dropped__title">В вашей корзине:</div>
				<div className="basket-dropped__product-list product-list">
					<CartItem
							title="Ботинки женские, Baldinini"
							img="img/product-list__pic_1.jpg"
							id="123"
							price="12 360"
					/>
				</div>
				<span className="basket-dropped__order-button">Оформить заказ</span>
			</div>
	)
};

CartItem.propTypes = {
	title: PropTypes.string.isRequired,
	img: PropTypes.string.isRequired,
	id: PropTypes.number.isRequired,
	price: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number
	]).isRequired,
};

export default Cart;