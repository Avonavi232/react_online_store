import React from 'react';

export default class Breadcrumbs extends React.Component{
	render(){
		return(
				<div className="site-path">
					<ul className="site-path__items">
						<li className="site-path__item"><a href="/">Главная</a></li>
						<li className="site-path__item"><a href="/">Женская обувь</a></li>
					</ul>
				</div>
		)
	}
}