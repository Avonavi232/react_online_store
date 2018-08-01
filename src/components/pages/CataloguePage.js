import React from 'react';
import Breadcrumbs from '../Breadcrumbs';
import CatalogueSidebar from '../CatalogueSidebar';
import CatalogueFeed from '../CatalogueFeed';
import CatalogueSlider from '../CatalogueSlider';

import '../../css/style-catalogue.css';

export default class CataloguePage extends React.Component{
	render(){
		return(
				<React.Fragment>
					<Breadcrumbs/>
					<main className="product-catalogue clearfix">
						<CatalogueSidebar/>
						<CatalogueFeed/>
					</main>
					<CatalogueSlider/>
				</React.Fragment>
		)
	}
}