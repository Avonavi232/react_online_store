import React from 'react';
import '../css/slider.css';


class Slider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentVisible: 0,
            trackStyle: {},
            listStyle: {},
            itemStyle: {}
        };
    }

    componentDidMount() {
        this.sliderInit(this.props.settings || {});
    }

    sliderInit(userSettings = {}) {
        const defaults = {
            slidesToShow: 3,
            slidesToScroll: 2,
            direction: 'horizontal',
            showArrows: true,
            equalHeight: false,
            equalWidth: false,
            gutter: 0
        };

        this.settings = Object.assign({}, defaults, userSettings);

        this.track = this.refs.track;
        this.list = this.refs.list;


        this.elements = Array.from(this.track.children);

        if (this.elements.length <= this.settings.slidesToShow) {
            this.settings.showArrows = false;
        }


        /*Set items styles*/
        this.setItemsStyles()
        /*After that set List styles*/
            .then(() => this.setListStyles());

    }

    setListStyles() {
        return new Promise(resolve => {
            const listSize = this.getContainerSize(this.settings, this.elements);
            const listStyle = {};

            if (this.settings.direction === 'horizontal') {
                listStyle.width = `${listSize}px`;
            } else {
                listStyle.height = `${listSize}px`;
            }

            this.setState({
                listStyle
            }, () => resolve());
        })
    }

    setItemsStyles() {
        return new Promise(resolve => {
            let itemStyle = {};

            if (this.settings.equalHeight) {
                itemStyle = Object.assign(itemStyle, this.getEqualSizeStyle('height', this.elements));
            }

            if (this.settings.equalWidth) {
                itemStyle = Object.assign(itemStyle, this.getEqualSizeStyle('width', this.elements));
            }

            if (this.settings.gutter !== 0) {
                itemStyle = Object.assign(itemStyle, this.getGutterStyle(this.settings));
            }


            this.setState({
                itemStyle
            }, () => resolve());
        });
    }

    generateArrowsJSX() {
        const {settings, list, track, elements} = this;
        return {
            prev: <div
                ref="slider-arrow-prev"
                onClick={event => this.updateScrollPos(event, settings, list, track, elements)}
                className="slider-arrow slider-arrow-prev"
            />,
            next: <div
                ref="slider-arrow-next"
                onClick={event => this.updateScrollPos(event, settings, list, track, elements)}
                className="slider-arrow slider-arrow-next"
            />
        }
    }

    getEqualSizeStyle = (dimension, elements) => {
        let size = 0;

        size = elements.reduce((prevVal, el) => {
            const metric = dimension === 'height' ? el.offsetHeight : el.offsetWidth;

            if (metric > prevVal) {
                return metric;
            } else {
                return prevVal;
            }

        }, size);
        // console.log('123', this.state);
        return {[dimension]: `${size}px`};
    };

    getContainerSize(settings, elements) {
        const dimension = settings.direction === 'horizontal' ? 'width' : 'height';

        let size = 0;

        for (let i = 0; i < settings.slidesToShow; i++) {
            if (!elements[i]) break;

            const metric = dimension === 'width' ? elements[i].offsetWidth : elements[i].offsetHeight;
            size += metric;
            if (i !== 0) {
                size += settings.gutter;
            }
        }

        return size;
    }

    getGutterStyle = (settings) => {
        if (settings.direction === 'horizontal') {
            return {marginLeft: `${settings.gutter}px`};

        } else {
            return {marginTop: `${settings.gutter}px`}
        }
    };

    updateScrollPos(event, settings, list, track, elements) {
        const
            listSize = settings.direction === 'horizontal' ? parseInt(this.state.listStyle.width) : parseInt(this.state.listStyle.height),
            trackSize = settings.direction === 'horizontal' ? track.offsetWidth : track.offsetHeight,
            maxScroll = -1 - trackSize + listSize,
            cssTransformPropName = settings.direction === 'horizontal' ? 'translateX' : 'translateY',
            {currentVisible} = this.state;


        let scrollPos = 0;

        const currentTransformCss = track.style.transform;

        if (currentTransformCss && currentTransformCss.indexOf(cssTransformPropName) !== -1) {
            scrollPos = Number(currentTransformCss.match(/\((-?\d+)\w+\)/)[1]);
        }

        let i;

        if (event.currentTarget === this.refs['slider-arrow-next']) {
            // console.log('currentVisible: ', currentVisible);
            for (i = currentVisible; i < (currentVisible + this.settings.slidesToScroll);) {

                if (i < (elements.length - this.settings.slidesToShow) && elements[i]) {
                    scrollPos -= settings.direction === 'horizontal' ? elements[i].offsetWidth : elements[i].offsetHeight;
                    scrollPos -= settings.gutter;
                    i++;

                    if (scrollPos < maxScroll) {
                        scrollPos = maxScroll;
                        break;
                    }
                } else {
                    break;
                }
            }

        } else if (event.currentTarget === this.refs['slider-arrow-prev']) {
            // console.log('currentVisible: ', currentVisible);

            if (currentVisible === 0) {
                return;
            }

            for (i = currentVisible; i > (currentVisible - this.settings.slidesToScroll);) {

                if (elements[i]) {
                    // console.log(elements[i]);
                    scrollPos += settings.direction === 'horizontal' ? elements[i].offsetWidth : elements[i].offsetHeight;
                    scrollPos += settings.gutter;

                    if (scrollPos > 0) {
                        scrollPos = 0;
                    }

                    if (i === 0) {
                        break;
                    } else {
                        i--;
                    }
                } else {
                    break;
                }

            }
        }

        // console.log('i:', i);

        this.setState({
            trackStyle: Object.assign({}, this.state.trackStyle, {transform: `${cssTransformPropName}(${scrollPos}px)`}),
            currentVisible: i
        }, () => {
            // console.log(this.state);
        });
    }


    render() {
        let arrows;
        if (this.settings && this.settings.showArrows) {
            arrows = this.generateArrowsJSX();
        }

        let containerClassName = 'slider';
        containerClassName += this.settings && this.settings.direction === 'horizontal' ? ' slider-horizontal' : ' slider-vertical';
        containerClassName += this.props.className ? ` ${this.props.className}` : '';


        return (
            <div
                className={containerClassName}
            >
                {
                    arrows &&
                    arrows.prev
                }

                <div style={this.state.listStyle || {}} ref="list" className="slider-list">
                    <div
                        style={this.state.trackStyle || {}}
                        ref="track"
                        className="slider-track"
                    >
                        {
                            this.props.children.map((child, index) => {
                                const className = child.props.className ? `${child.props.className} slider-item` : 'slider-item';
                                if (index > 0) {
                                    return React.cloneElement(
                                        child,
                                        Object.assign({}, child.props, {
                                            className,
                                            style: Object.assign({}, child.props.style, this.state.itemStyle),
                                            key: index
                                        })
                                    );
                                } else {
                                    return React.cloneElement(
                                        child,
                                        Object.assign({}, child.props, {
                                            className,
                                            key: index
                                        })
                                    );
                                }
                            })
                        }
                    </div>
                </div>

                {
                    arrows &&
                    arrows.next
                }
            </div>
        )
    }
}

export default Slider;