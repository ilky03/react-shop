import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';

import ProductBlock from '../productBlock/ProductBlock';

import arrowDownIcon from '../../sources/product-blocks/arrow_down.svg';

import './productBlocks.scss';

function ProductBlocks({ flag, category, filters, sortBy, handleReloadGallery }) {
    const { productsData } = useContext(AppContext);

    const [blocksAmount, setBlocksAmount] = useState(0);
    const [currentBlocksPosition, setCurrentBlocksPosition] = useState([0, 0]);
    const [areMoreBlocks, setAreMoreBlocks] = useState(false);

    const isCategory = flag === 'category';

    useEffect(() => {
        function handleResize() {
            const width = window.innerWidth;
            if (width < 401) {
                setBlocksAmount(2);
            } else if (width >= 401 && width < 801) {
                setBlocksAmount(3);
            } else if (width >= 801 && width < 1401) {
                setBlocksAmount(4);
            } else if (width >= 1401 && width < 1981) {
                setBlocksAmount(6);
            } else if (width >= 1981) {
                setBlocksAmount(8);
            }
            if (isCategory && width >= 401) {
                setBlocksAmount(b => b - 1);
            }
        }

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, [isCategory]);

    useEffect(() => {
        setCurrentBlocksPosition([0, isCategory ? blocksAmount * 2 : blocksAmount]);
    }, [blocksAmount, isCategory]);

    const filterProducts = () => {
        return productsData.filter(prodData => {
            if (category && prodData.category !== category) {
                return false;
            }

            if (flag === 'discount' && !prodData.isDiscount) {
                return false;
            } else if (flag === 'new' && !prodData.isNew) {
                return false;
            } else if (flag === 'top' && !prodData.isTop) {
                return false;
            }

            if (filters) {
                for (const filter of filters) {
                    const [key, value] = filter.split('-');
                    if (key === 'isNew' || key === 'isDiscount') {
                        if (prodData[key] !== (value === 'true')) {
                            return false;
                        }
                    }  else if (prodData.props[key] !== value) {
                        return false;
                    }
                }
            }

            return true;
        });
    };

    const filterProductsFromLocalStorage = () => {
        const productsIDs = localStorage.getItem('recentlyViewed') && localStorage.getItem('recentlyViewed').split(',');
        return productsData.filter((product) => {
            if (productsIDs && productsIDs.includes(product.id)) {
                return true;
            }

            return false;
        });
    }

    const filteredProducts = flag === 'recently' ? filterProductsFromLocalStorage() : filterProducts();

    if (sortBy === 'priceLowHigh') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceHighLow') {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
        filteredProducts.sort((a, b) => b.rating - a.rating);
    }

    useEffect(() => {
        setAreMoreBlocks(currentBlocksPosition[1] < filteredProducts.length);
    }, [currentBlocksPosition, filteredProducts, blocksAmount]);

    const handleShowMore = () => {
        setCurrentBlocksPosition([currentBlocksPosition[0], currentBlocksPosition[1] + (blocksAmount < 3 ? blocksAmount * 2 : blocksAmount)]);
    }

    return (
        <div className="product-blocks" style={{gridTemplateColumns: `repeat(${blocksAmount}, 1fr)`}}>
            {filteredProducts.slice(currentBlocksPosition[0], currentBlocksPosition[1]).map(prodData => (
                <ProductBlock handleReloadGallery={handleReloadGallery} key={prodData.id} {...prodData} />
            ))}
            <button className={`product-blocks__show ${areMoreBlocks ? '' : 'hide'}`} onClick={handleShowMore}>Показати ще <img src={arrowDownIcon} alt="Стрілка униз" /></button>
        </div>
    );
}

export default ProductBlocks;
