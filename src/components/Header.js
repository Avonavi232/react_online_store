import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

import logo from '../img/header-logo.png';
import {
	headerHiddenPanelBasketVisibility,
	headerHiddenPanelProfileVisibility,
	headerMainSearchVisibility
} from "../utils/functions";
import Cart from'./Cart';


const LinkItem = props => {
	return(
			<li
					onClick={props.onClick || (() => null)}
					className={props.liClassName}
			>
				<Link to={props.to}>{props.title}</Link>
			</li>
	)
};


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
	render() {
		const {fetching, categories, handleUpdateCart, cart} = this.props;
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
								<Link to="/favorites">
									<i className="fa fa-heart-o" aria-hidden="true"/>
									Избранное
								</Link>
								<a href="/">Выйти</a>
							</div>
							<Cart cart={cart} handleUpdateCart={handleUpdateCart}/>
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

Header.propTypes = {
	fetching: PropTypes.bool,
	categories: PropTypes.array.isRequired,
	cart: PropTypes.array.isRequired,
	handleUpdateCart: PropTypes.func.isRequired
};

Header.contextTypes = {
	api: PropTypes.string.isRequired
};