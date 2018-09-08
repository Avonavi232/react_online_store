import React from 'react';
import PropTypes from 'prop-types';

import Banner from '../banner/BannerContainer';
import Featured from '../featured/FeaturedContainer';
import SalesNews from '../SalesNews';
import AboutUs from '../AboutUs';

export default class HomePage extends React.Component {
	render() {
		const {categories, handleFavoriteToggle} = this.props;
		return (
				<React.Fragment>
					<Banner/>
					{
						categories.length ?
								<Featured handleFavoriteToggle={handleFavoriteToggle} categories={categories}/> :
								undefined
					}
					<SalesNews/>
					<AboutUs/>
				</React.Fragment>
		)
	}
}

HomePage.propTypes = {
	categories: PropTypes.array.isRequired,
	handleFavoriteToggle: PropTypes.func.isRequired
};