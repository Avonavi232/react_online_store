import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import PropTypes from 'prop-types';

import './css/normalize.css';
import './css/font-awesome.min.css';
import './css/style.css';

import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/pages/HomePage';
import CataloguePage from './components/pages/CataloguePage';
import ProductPage from './components/pages/ProductPage';


class App extends Component {
    constructor(props) {
        super(props);

        this.api = 'https://neto-api.herokuapp.com/bosa-noga';
        this.overlookedStorageKey = 'bosanogaOverlooked';

        this.state = {
            fetching: false,
            categories: []
        };
    }

    componentDidMount() {
        //Fetch categories
        this.setState({fetching: true}, () => {
            fetch(`${this.api}/categories`)
                .then(res => {
                    this.setState({fetching: false});

                    if (res.status >= 200 && res.status < 300) {
                        const body = res.json();
                        if (body.status = 'ok') {
                            return body;
                        } else {
                            throw new Error(`Category fetch error. Status: ${res.status}. Body status: ${body.status}`);
                        }
                    } else {
                        throw new Error(`Category fetch error. Status: ${res.status}`);
                    }
                })
                .then(({data}) => {
                    this.setState({
                        categories: data
                    })
                })
        });
    }

    getChildContext() {
        return {
            api: this.api,
            overlookedStorageKey: this.overlookedStorageKey
        }
    }

    render() {
        const {fetching, categories} = this.state;
        return (
            <div className="app container">
                <Header fetching={fetching} categories={categories}/>

                <Switch>
                    <Route exact path="/" render={props =>
                        <HomePage
                            fetching={fetching}
                            categories={categories}
                            {...props}
                        />
                    }
                    />
                    <Route path="/products" component={CataloguePage}/>
                    <Route path="/product" component={ProductPage}/>
                </Switch>

                <Footer/>
            </div>
        );
    }
}

App.childContextTypes = {
    api: PropTypes.string.isRequired,
    overlookedStorageKey: PropTypes.string.isRequired
};

export default App;
