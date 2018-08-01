import React from 'react';

import Slider from './Slider';

const verticalSliderSettings = {
    direction: 'vertical',
    equalHeight: true,
    gutter: 20
};


class ProductPics extends React.Component{
    constructor(props){
        super(props);
        this.api = 'https://neto-api.herokuapp.com/bosa-noga';

        this.state = {
            selected: this.props.images[0]
        }
    }

    selectImageHandler = event =>{
        this.setState({selected: event.currentTarget.dataset.img});
    };

    componentDidUpdate = (prevProps) => {
        if (prevProps.images[0] !== this.props.images[0]) {
            this.setState({
                selected: this.props.images[0]
            });
        }
    };


    render(){
        return(
            <React.Fragment>
                <section className="main-screen__favourite-product-slider">
                    <Slider settings={verticalSliderSettings} className="favourite-product-slider">
                        {
                            this.props.images.map((image, index) =>
                                <div
                                    onClick={this.selectImageHandler}
                                    key={index}
                                    style={{backgroundImage: `url('${image}')`}}
                                    data-img={image}
                                    className="favourite-product-slider__item"
                                >
                                    <a href="#"></a>
                                </div>
                            )
                        }
                    </Slider>
                </section>

                <div className="main-screen__favourite-product-pic">
                    <img src={this.state.selected} alt=""/>
                    <a href="#" className="main-screen__favourite-product-pic__zoom"></a>
                </div>
            </React.Fragment>
        )
    }
}

export default ProductPics;