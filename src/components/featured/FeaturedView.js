import React from 'react';

const ListItem = props =>
		<li
				className={`new-deals__menu-item ${props.active ? 'new-deals__menu-item_active' : undefined}`}>
			<a
					onClick={props.onClick}
					data-id={props.catId}
					href="/"
			>
				{props.title}
			</a>
		</li>;

export default class FeaturedView extends React.Component{
	render(){
		const {categories, sliderItems, activeItem, activeCategory, setActiveCategory, setActivePos} = this.props;
		return (
				<section className="new-deals wave-bottom">
					<h2 className="h2">Новинки</h2>
					<div className="new-deals__menu">
						<ul className="new-deals__menu-items">
							{
								categories.length &&
								categories.map(category => {
											if (category.id === activeCategory.id) {
												return <ListItem
														catId={category.id}
														onClick={setActiveCategory}
														active
														key={category.id}
														title={category.title}/>
											} else {
												return <ListItem
														catId={category.id}
														onClick={setActiveCategory}
														key={category.id}
														title={category.title}/>
											}
										}
								)
							}
						</ul>
					</div>
					<div className="new-deals__slider">
						<div onClick={() => setActivePos('decr')}
								 className="new-deals__arrow new-deals__arrow_left arrow"></div>

						{
							sliderItems.length &&
							sliderItems
						}

						<div onClick={() => setActivePos('incr')}
								 className="new-deals__arrow new-deals__arrow_right arrow"></div>
					</div>
					{
						activeItem &&
						<div className="new-deals__product-info">
							<a
									href={`/product?id=${activeItem.id}`}
									className="h3">
								{activeItem.title}
							</a>
							<p>Производитель:
								<span>{activeItem.brand}</span>
							</p>
							<h3 className="h3">{activeItem.price} ₽</h3>
						</div>
					}
				</section>
		);
	}
}