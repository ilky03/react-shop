import { useEffect, useState, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { toast } from 'react-toastify';

import useDB from '../../services/useDB';
import { AppContext } from '../context/AppContext';

import SEO from '../seo/SEO';
import ProductBlocks from '../productBlocks/ProductBlocks';
import Spinner from '../spinner/Spinner';
import Reviews from '../reviews/Reviews';

import './productPage.scss';

import arrowUpIcon from '../../sources/product-page/arrow-up.svg';
import whiteArrowUpIcon from '../../sources/category-page/arrow-up.svg';
import arrowDownIcon from '../../sources/product-page/arrow-down.svg';
import wishIcon from '../../sources/product-page/wish.svg';
import arrowLeftIcon from '../../sources/product-page/arrow-left.svg';
import shopCartIcon from '../../sources/product-page/shopCart.svg';
import checkIcon from '../../sources/product-page/check.svg';
import boltIcon from '../../sources/product-page/bolt.svg';
import wishFilledIcon from '../../sources/product-card/wishFilled.svg';

function ProductPage() {

    const { generateID, isLoading, create } = useDB();
    const [productData, setProductData] = useState();
    const [scrollIndex, setScrollIndex] = useState(0);
    const [mainPhoto, setMainPhoto] = useState();
    const [fastBuy, setFastBuy] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoadedBanner, setIsLoadedBanner] = useState(false);

    const { productsData, wishlist, shoppingCart, banners, handleItemToggle, windowWidth, handleClickUpBtn, isLoading: productIsLoading } = useContext(AppContext);

    const navigate = useNavigate();

    const location = useLocation();
    const fullUrl = `${window.location.origin}${location.pathname}${location.search}${location.hash}`;

    const { productID } = useParams();

    const handleImageLoaded = () => {
        setIsLoaded(true);
    };

    const onReloadGallery = () => {
        setIsLoaded(false);
    }

    const recentlyViewed = (localStorage.getItem('recentlyViewed') && localStorage.getItem('recentlyViewed').split(',')) || [];
    useEffect(() => {
        if (productsData && productID) {
            const product = productsData.find(product => product.id === productID);
            setProductData(product);
            if (product) {
                setMainPhoto(product.photoUrl);
            }
        }
        if (!recentlyViewed.includes(productID)) {
            recentlyViewed.push(productID);
            if (recentlyViewed.length > 10) {
                recentlyViewed.shift();
            }
            localStorage.setItem('recentlyViewed', recentlyViewed.join(','));
        }
        //eslint-disable-next-line
    }, [productsData, productID]);

    const handleScrollUp = () => {
        if (scrollIndex > 0) {
            setScrollIndex(scrollIndex - 2);
        }
    };

    const handleScrollDown = () => {
        if (scrollIndex < Object.keys(productData.photoGallery).length) {
            setScrollIndex(scrollIndex + 2);
        }
    };
    
    const renderGallery = () => {
        const photoGalleryKeys = productData && Object.keys(productData.photoGallery).sort((a, b) => {
            const numA = parseInt(a.match(/\d+/)[0], 10);
            const numB = parseInt(b.match(/\d+/)[0], 10);
        
            return numA - numB;
        });
        const discount = Math.trunc(100 - (productData.discPrice * 100) / productData.price)
        return (
            <>
                <div className="product-page__gallery">
                   <div className='control-btns__wrapper'>
                        <button className='control-btn control-btn_up' onClick={handleScrollUp}><img src={arrowUpIcon} alt="Стрілка вверх" /></button>
                        <div className="product-page__gallery_left-wrapper">
                            <div className="product-page__gallery_left" style={{ transform: `translateY(-${scrollIndex * 15}%)` }}> 
                                {photoGalleryKeys && photoGalleryKeys.map(key => {
                                    return (<div key={key} className="product-page__gallery_small" onClick={() => setMainPhoto(productData.photoGallery[key])}>
                                        {!isLoaded && <div className='skeleton-wrapper'><div className='skeleton'></div></div>}
                                        <img className={isLoaded ? '' : 'hide'} onLoad={handleImageLoaded} src={productData.photoGallery[key]} alt="Фото товару" />
                                    </div>)
                                })}
                            </div>
                        </div>
                        <button className='control-btn control-btn_down' onClick={handleScrollDown}><img src={arrowDownIcon} alt="Стрілка вниз" /></button>
                   </div>
                    <div className="product-page__gallery_big">
                        {!isLoaded && <div className='skeleton-wrapper'><div className='skeleton'></div></div>}
                        <img className={isLoaded ? '' : 'hide'} src={mainPhoto} alt="" />
                        {productData.isTop && <div className="top-big">Топ</div>}
                        {productData.isDiscount && <div className="discount-big">-{discount}%</div>}
                        {productData.isNew && <div className="new-big" style={!productData.isDiscount ? {top: '0'} : {}}>Новинка</div>}
                    </div>
                </div>
                
            </>
        )
    }
    
    const renderChar = () => {
        let keys = productData && Object.keys(productData.props).sort();
        return (
            <table>
                <tbody>
                    {keys.map(key => (
                        <tr key={key}>
                            <th>{key.split('_')[1]}</th>
                            <td>{productData.props[key]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )
    }

    const handleFastBuy = async (e, productData) => {
        const { id, title, photoUrl, price, isDiscount, discPrice, article} = productData;
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        const idForRecord = generateID();
        data.id = idForRecord;
        data.orderDate = new Date();
        data.status = 'Створено';
        data.order = [{
            id: id,
            title: title, 
            price: isDiscount ? discPrice : price,
            photoUrl: photoUrl,
            amount: 1,
            article: article
        }];
        data.isFastBuy = true;
        await create(`orders/${idForRecord}`, data);
        toast.success('Дякуємо за замовлення. Згодом ми вам зателефонуємо.')
    }

    return (
       <>
        {productData && <SEO title={productData.title} description={productData.description} url={fullUrl} imageUrl={productData.photoUrl} />}
        <main>
            <div className="container">
                <div className="product-page__nav">
                    <button onClick={() => navigate(-1)}><img src={arrowLeftIcon} alt="" />Назад</button>
                </div>
                {productIsLoading && <Spinner />}
                {productData && 
                    <div className="product-page">
                        {renderGallery()}
                        <div className="product-page__right-side">
                            <h1>
                                {productData.title}
                            </h1>
                            <div className="product-page__reviews">
                                {<Reviews productData={productData}/>}
                            </div>
                            <div className="product-page__article"><p>Артикул: {productData.article}</p></div>
                            <div className="product-page__price">
                                {productData.isDiscount ? 
                                    <>
                                        <p className="product-page__price_crossed">{productData.price} ₴</p>
                                        <p className="product-page__price_new">{productData.discPrice} ₴</p>
                                    </> :
                                    <p className="product-page__price_new" style={{color: '#020509'}}>{productData.price} ₴</p>
                                }
                            </div>
                            <div className="product-page__btns">
                                <button 
                                    className="product-page__buy-btn"
                                    disabled={!productData.isAvailable}
                                    onClick={(e) => productData.isAvailable && handleItemToggle(e, productID, 'shopping-cart')}
                                >
                                    {shoppingCart && shoppingCart.includes(productData.id) ? 
                                        <><img src={checkIcon} alt="" />У кошику</> :
                                        <><img src={shopCartIcon} alt="" />Купити</>
                                    }
                                    
                                </button>
                                <button 
                                    className="product-page__buy-btn_fast" 
                                    disabled={!productData.isAvailable}
                                    onClick={() => setFastBuy(!fastBuy)}
                                >
                                    <img src={boltIcon} alt="" />Швидка покупка
                                </button>
                                {fastBuy && 
                                    <div className='product-page__fast-buy'>
                                        <form onSubmit={(e) => handleFastBuy(e, productData)}>
                                            <input type="text" name="phoneNumber" placeholder='Номер телефону' />
                                            <button disabled={isLoading}>Купити</button>
                                        </form>
                                    </div>
                                }
                            </div>
                            <div className="product-page__delivery">
                                <div>
                                    <h4>Самовивіз з магазину</h4>
                                    <p>- Безкоштовно (м. Одеса)</p>
                                </div>
                                <div>
                                    <h4>Доставка по Україні</h4>
                                    <p>- Нова Пошта</p>
                                    <p>- Укрпошта</p>
                                </div>
                                <div>
                                    <h4>Оплата</h4>
                                    <p>- Готівкою при отриманні</p>
                                    <p>- Банківською картою</p>
                                </div>
                            </div>

                            <div className="product-page__wish" onClick={(e) => handleItemToggle(e, productID, 'wishlist')}>
                            {wishlist && wishlist.includes(productID) ? 
                                <img src={wishFilledIcon} alt='Прибрати зі списку бажань' /> : 
                                <img src={wishIcon} alt='Добавити у список бажань' />
                            }
                            </div>
                        </div>

                        <div className="product-page__description">
                            <div>
                                <h2>Опис</h2>
                                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(productData.description) }} />
                            </div>
                            
                            <div>
                                <h2>Характеристики</h2>
                                {renderChar()}
                            </div>
                        </div>

                        <div className="product-page__promo">
                            {!isLoadedBanner && <div className='skeleton-wrapper'><div className='skeleton'></div></div>}
                            <img src={banners && banners[0].mediumPicture} onLoad={() => setIsLoadedBanner(true)} alt="" />
                        </div>
                    </div>
                }

                <div className="recommendations">
                    <h2>Вас також можуть зацікавити</h2>
                    <ProductBlocks handleReloadGallery={onReloadGallery}/>
                </div>
            </div>
            <button className={`up-btn ${windowWidth <= 1024 ? '' : 'hide'}`} onClick={handleClickUpBtn}><img src={whiteArrowUpIcon} alt="Стрілка догори" /></button>
        </main>
       </>
    )
}

export default ProductPage;