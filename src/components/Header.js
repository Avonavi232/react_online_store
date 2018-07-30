import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

import logo from '../img/header-logo.png';
import {
	headerHiddenPanelBasketVisibility,
	headerHiddenPanelProfileVisibility,
	headerMainSearchVisibility
} from "../utils/functions";


const LinkItem = props =>
		<li
				onClick={props.onClick || (() => null)}
				className={props.liClassName}
		>
			<Link to={props.to}>{props.title}</Link>
		</li>;


const topMenuItems = [
	{
		title: 'Возврат',
		link: '/'
	},
	{
		title: 'Доставка и оплата',
		link: '/'
	},
	{
		title: 'О магазине',
		link: '/'
	},
	{
		title: 'Контакты',
		link: '/'
	},
	{
		title: 'Новости',
		link: '/'
	}
];


export default class Header extends React.Component {
	// constructor(props) {
	// 	super(props);
	// }

	render() {
		const {fetching, categories} = this.props;
		return (
				<header className="header">
					<div className="top-menu">
						<div className="wrapper">
							<ul className="top-menu__items">
								{
									topMenuItems.map((item, index) =>
											<LinkItem
													key={item.id || index}
													liClassName="top-menu__item"
													to="/"
													title={item.title}
											/>
									)
								}
							</ul>
						</div>
					</div>

					<div className="header-main">
						<div className="header-main__wrapper wrapper">
							<div className="header-main__phone">
								<a href="tel:+7-495-790-35-03">+7 495 79 03 5 03</a>
								<p>Ежедневно: с 09-00 до 21-00</p>
							</div>
							<div className="header-main__logo">
								<Link to="/">
									<h1>
										<img src={logo} alt="logotype"/>
									</h1>
								</Link>
								<p>Обувь и аксессуары для всей семьи</p>
							</div>
							<div className="header-main__profile">
								<div className="header-main__pics">
									<div
											onClick={headerMainSearchVisibility}
											className="header-main__pic header-main__pic_search"
									/>
									<div className="header-main__pic_border"/>
									<div
											onClick={headerHiddenPanelProfileVisibility}
											className="header-main__pic header-main__pic_profile"
									>
										<div className="header-main__pic_profile_menu"/>
									</div>
									<div className="header-main__pic_border"/>
									<div
											onClick={headerHiddenPanelBasketVisibility}
											className="header-main__pic header-main__pic_basket"
									>
										<div className="header-main__pic_basket_full">1</div>
										<div className="header-main__pic_basket_menu"/>
									</div>
								</div>
								<form className="header-main__search" action="/">
									<input placeholder="Поиск"/>
									<i className="fa fa-search" aria-hidden="true"/>
								</form>
							</div>

						</div>
						<div className="header-main__hidden-panel hidden-panel">
							<div className="hidden-panel__profile">
								<a href="/">Личный кабинет</a>
								<a href="favorite.html">
									<i className="fa fa-heart-o" aria-hidden="true"/>Избранное</a>
								<a href="/">Выйти</a>
							</div>
							<div className="hidden-panel__basket basket-dropped">
								<div className="basket-dropped__title">В вашей корзине:</div>
								<div className="basket-dropped__product-list product-list">
									<div className="product-list__item">
										<a className="product-list__pic">
											<img src="img/product-list__pic_1.jpg" alt="product"/> </a>
										<a href="/" className="product-list__product">Ботинки женские, Baldinini</a>
										<div className="product-list__fill"/>
										<div className="product-list__price">12 360
											<i className="fa fa-rub" aria-hidden="true"/>
										</div>
										<div className="product-list__delete">
											<i className="fa fa-times" aria-hidden="true"/>
										</div>
									</div>

									<div className="product-list__item">
										<a className="product-list__pic">
											<img src="img/product-list__pic_1.jpg" alt="product"/> </a>
										<a href="/" className="product-list__product">Ботинки женские, Baldinini</a>
										<div className="product-list__fill"/>
										<div className="product-list__price">12 360
											<i className="fa fa-rub" aria-hidden="true"/>
										</div>
										<div className="product-list__delete">
											<i className="fa fa-times" aria-hidden="true"/>
										</div>
									</div>
									<div className="product-list__item">
										<a className="product-list__pic">
											<img src="img/product-list__pic_1.jpg" alt="product"/> </a>
										<a href="/" className="product-list__product">Ботинки женские, Baldinini</a>
										<div className="product-list__fill"/>
										<div className="product-list__price">12 360
											<i className="fa fa-rub" aria-hidden="true"/>
										</div>
										<div className="product-list__delete">
											<i className="fa fa-times" aria-hidden="true"/>
										</div>
									</div>
									<div className="product-list__item">
										<a className="product-list__pic">
											<img src="img/product-list__pic_1.jpg" alt="product"/> </a>
										<a href="/" className="product-list__product">Ботинки женские, Baldinini</a>
										<div className="product-list__fill"/>
										<div className="product-list__price">12 360
											<i className="fa fa-rub" aria-hidden="true"/>
										</div>
										<div className="product-list__delete">
											<i className="fa fa-times" aria-hidden="true"/>
										</div>
									</div>

								</div>
								<a className="basket-dropped__order-button" href="order.html">Оформить заказ</a>
							</div>
						</div>
					</div>

					<nav className="main-menu">
						<div className="wrapper">
							{
								!fetching && categories.length ?
										<ul className="main-menu__items">
											{
												categories.map(category =>
														<LinkItem
																key={category.id}
																liClassName="main-menu__item"
																to={`/products/?category=${category.id}`}
																title={category.title}
														/>
												)
											}
										</ul> :
										undefined
							}
						</div>
					</nav>
				</header>
		);
	}
}

Header.contextTypes = {
	api: PropTypes.string.isRequired
};