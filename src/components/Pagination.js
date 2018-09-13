import React from 'react';
import PropsTypes from 'prop-types';

const Pagination = props => {
	const
			{page, pages} = props,
			elements = [];

	for (let i = 1; i <= pages; i++) {
		elements.push(
				<li
						key={i}
						className={i === page ? 'active' : ''}
						data-page={i}
						onClick={() => props.onSelectPage(i)}
				>{i}</li>
		);
	}

	return (
			<div className="product-catalogue__pagination">
				<div className="page-nav-wrapper">
					<ul>
						{
							elements
						}
					</ul>
				</div>
			</div>
	)
};

Pagination.propTypes = {
	onSelectPage: PropsTypes.func.isRequired,
	pages: PropsTypes.oneOfType([
		PropsTypes.number,
		PropsTypes.string
	]).isRequired,
	page: PropsTypes.oneOfType([
		PropsTypes.number,
		PropsTypes.string
	]).isRequired,
};

export default Pagination;