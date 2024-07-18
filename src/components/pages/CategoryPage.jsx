import { useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { AppContext } from '../context/AppContext';

import Spinner from '../spinner/Spinner';
import SEO from '../seo/SEO';
import ProductBlocks from '../productBlocks/ProductBlocks';

import './categoryPage.scss';

import arrowLeftIcon from '../../sources/category-page/arrow-left.svg';
import hotSaleIcon from '../../sources/category-page/hot-sale.png';
import newIcon from '../../sources/category-page/new.png';
import arrowUpIcon from '../../sources/category-page/arrow-up.svg';

function CategoryPage() {
    const { categoryId } = useParams();
    const [filters, setFilters] = useState([]);
    const [sortBy, setSortBy] = useState();
    const [categoryTitle, setCategoryTitle] = useState('');
    const { productsData, windowWidth, categories, isLoading } = useContext(AppContext);

    useEffect(() => {
        setCategoryTitle(categories && categories.find(category => category.id === categoryId).title);
    }, [categories, categoryId]);

    const location = useLocation();
    const fullUrl = `${window.location.origin}${location.pathname}${location.search}${location.hash}`;

    let filterProps = {};

    productsData.map((product) => {
        if (product.category === categoryTitle) {
            for (let key in product.props) {
                if (!filterProps[key]) {
                    filterProps[key] = new Set();
                }
                filterProps[key].add(product.props[key]);
            }
        }
        return 0;
    });

    for (let key in filterProps) {
        filterProps[key] = Array.from(filterProps[key]);
    }

    const filterElements = Object.keys(filterProps).map(key => (
        <div key={key}>
            <h5>{key.split('_')[1]}</h5>
            <ul>
                {filterProps[key].map((val, index) => (
                    <li key={index}>
                        <input
                            type="checkbox"
                            id={`${key}-${val}`}
                            onChange={(e) => handleFilter(`${key}-${val}`, e.target.checked)}
                        />
                        <label htmlFor={`${key}-${val}`}>{val}</label>
                    </li>
                ))}
            </ul>
        </div>
    ));

    function handleFilter(filter, isChecked) {
        setFilters(prevFilters => {
            if (isChecked) {
                return [...prevFilters, filter];
            } else {
                return prevFilters.filter(f => f !== filter);
            }
        });
    }

    function handleSorting(sortValue) {
        setSortBy(sortValue);
    }

    const handleClickUpBtn = () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    }

    return (
        <>
            <SEO title={categoryTitle} description={categoryTitle} url={fullUrl} imageUrl={''} />
            <main>
                <div className="container">
                    <div className="category-page__nav">
                        <Link to='/'>
                            <img src={arrowLeftIcon} alt="" />
                        </Link>
                        <h1>{categoryTitle}</h1>
                    </div>
                    <div className="category-page">
                        <div className="category-page__filter">
                            <form>
                                <div className="category-page__plates">
                                    <input 
                                        id="category1" 
                                        type="checkbox" 
                                        onChange={(e) => handleFilter('isDiscount-true', e.target.checked)}/>
                                    <label htmlFor="category1" className="radio-btn"><img src={hotSaleIcon} alt="" />Акційні</label>

                                    <input id="category2" type="checkbox" onChange={(e) => handleFilter('isNew-true', e.target.checked)}/>
                                    <label htmlFor="category2" className="radio-btn"><img src={newIcon} alt="" /> Новинки</label>
                                </div>
                                {isLoading && <Spinner />}
                                {filterElements}
                            </form>
                        </div>
                        <div className="category-page__sorting">
                            <select name="sort" id="" onChange={(e) => handleSorting(e.target.value)}>
                                <option selected disabled>Сортувати...</option>
                                <option value="rating">За рейтингом</option>
                                <option value="priceLowHigh">Від дешевих до дорогих</option>
                                <option value="priceHighLow">Від дорогих до дешевих</option>
                            </select>
                        </div>
                        <div className="category-page__blocks">
                            {isLoading && <Spinner />}
                            <ProductBlocks category={categoryTitle} filters={filters} sortBy={sortBy} flag="category"/>        
                        </div>
                    </div>
                </div>
                <button className={`up-btn ${windowWidth <= 1024 ? '' : 'hide'}`} onClick={handleClickUpBtn}><img src={arrowUpIcon} alt="Стрілка догори" /></button>
            </main>
        </>
    )
}

export default CategoryPage;
