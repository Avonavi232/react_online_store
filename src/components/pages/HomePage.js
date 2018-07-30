import React from 'react';
import Banner from '../banner/BannerContainer';
import Featured from '../featured/FeaturedContainer';
import SalesNews from '../SalesNews';
import AboutUs from '../AboutUs';

export default class HomePage extends React.Component{
	render(){
		const {categories} = this.props;
		return(
				<React.Fragment>
					<Banner/>
					<Featured categories={categories}/>
					<SalesNews/>
					<AboutUs/>
				</React.Fragment>
		)
	}
}