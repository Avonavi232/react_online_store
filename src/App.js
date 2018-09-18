import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import PropTypes from 'prop-types';

import './css/normalize.css';
import './css/font-awesome.min.css';
import './css/style.css';
import './css/style-catalogue.css';
import './css/style-favorite.css';

import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/pages/HomePage';
import CataloguePage from './components/pages/CataloguePage';
import FavoritesPage from './components/pages/FavoritesPage';
import ProductPage from './components/pages/ProductPage';

import {get, localStorageGetParsedPlugin, localStorageSetParsedPlugin} from "./utils/functions";


class App extends Component {
    constructor(props) {
        super(props);

        localStorageGetParsedPlugin();
        localStorageSetParsedPlugin();

        this.api = 'https://api-neto.herokuapp.com/bosa-noga';
        this.baseurl = 'https://api-neto.herokuapp.com/bosa-noga';

        this.newApi = {
            filters: () => `${this.baseurl}/filters`,
            products: queryStr => `${this.baseurl}/products${queryStr ? `/?${queryStr}` : ''}`
        };

        this.overlookedStorageKey = 'bosanogaOverlooked';
        this.favoriteStorageKey = 'bosanogaFavorite';

        this.state = {
            fetching: false,
            categories: [],
            favorites: []
        };
    }

    componentDidMount() {
        //Fetch categories
        this.setState({fetching: true}, () => {
            get(`${this.api}/categories`)
                .then(({data}) => {
                    this.setState({
                        fetching: false,
                        categories: data,
                        favorites: localStorage.getParsed(this.favoriteStorageKey, [])
                    })
                })
        });
    }

    getChildContext() {
        return {
            api: this.api,
            newApi: this.newApi,
            overlookedStorageKey: this.overlookedStorageKey,
            favoriteStorageKey: this.favoriteStorageKey
        }
    }

    handleFavoriteToggle = favoriteID => {
        const favoritesLS = localStorage.getParsed(this.favoriteStorageKey, []);

        let favorites;

        if (favoritesLS.includes(favoriteID)) {
            favorites = favoritesLS.filter(id => id !== favoriteID);
        } else {
            favorites = favoritesLS.concat([favoriteID]);
        }

        localStorage.setParsed(this.favoriteStorageKey, favorites);
        this.setState({favorites});
    };

    render() {
        const {fetching, categories, favorites} = this.state;
        return (
            <div className="app container">
                <Header fetching={fetching} categories={categories}/>

                <Switch>
                    <Route exact path="/" render={props =>
                        <HomePage
                            fetching={fetching}
                            categories={categories}
                            favorites={favorites}
                            handleFavoriteToggle={this.handleFavoriteToggle}
                            {...props}
                        />
                    }
                    />
                    <Route
                        path="/products"
                        render={
                            props =>
                                categories.length ?
                                    <CataloguePage
                                        {...props}
                                        categories={categories}
                                        handleFavoriteToggle={this.handleFavoriteToggle}
                                    /> :
                                    <p>Loading</p>
                        }
                    />
                    <Route path="/product" component={ProductPage}/>
                    <Route path="/favorites" render={props =>
                        <FavoritesPage
                            {...props}
                            handleFavoriteToggle={this.handleFavoriteToggle}
                            favorites={favorites}
                        />}
                    />
                </Switch>

                <Footer/>
            </div>
        );
    }
}

App.childContextTypes = {
    api: PropTypes.string.isRequired,
    newApi: PropTypes.object.isRequired,
    overlookedStorageKey: PropTypes.string.isRequired,
    favoriteStorageKey: PropTypes.string.isRequired,
};

export default App;

/*
* TODO:
* Страница каталог:
*   * подсветка выбранного фильтра
*   * прелоадеры на загрузку любых частей контента
*   * стартовая сортировка - по цене, а не по популярности
*   * сброс фильтров проверить
*   * поправить верстку дропдаунов в сайдбаре, где мало контента - серая область не по размеру
*   * добавление в избранное
*   * слайдер-блок "вы смотрели"
* */
