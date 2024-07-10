import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import { AppContext } from '../context/AppContext';

import shopCartIcon from '../../sources/product-card/shopCart.svg';
import shopCartFilledIcon from '../../sources/product-card/shopCart_filled.svg';
import checkIcon from '../../sources/product-card/check.svg';
import wishIcon from '../../sources/product-card/wish.svg';
import wishFilledIcon from '../../sources/product-card/wishFilled.svg';

function ProductBlock({handleReloadGallery, id, discPrice, isAvailable, isDiscount, isNew, isTop, photoUrl, price, title}) {

    const { wishlist, shoppingCart, handleItemToggle } = useContext(AppContext);
    const [isWishClicked, setIsWishClicked] = useState(wishlist && wishlist.includes(id));

    const [isLoaded, setIsLoaded] = useState(false);

    const handleImageLoaded = () => {
        setIsLoaded(true);
    };

    const clazz = isAvailable
                ? `product-block__price${!isDiscount ? '_black' : ''}`
                : 'product-block__price_pale';
    
    // const truncTitle = title.length > 40 ? title.slice(0, 39)+'...' : title;
    const truncTitle = title;
    const discPerc = isDiscount ? Math.trunc(100 - (discPrice * 100) / price) : null;

    const handleWishClick = (e) => {
        e.stopPropagation();
        handleItemToggle(e, id, 'wishlist');
        setIsWishClicked(!isWishClicked);
    }
    return (
        <Link to={`/product/${id}`} onClick={() => { handleReloadGallery && handleReloadGallery(); window.scrollTo({top: 0, behavior: 'smooth'})}}>
            <div className="product-block">
                <div className="product-block__header">
                    {!isLoaded && <div className='product-block__img skeleton-wrapper'><div className="skeleton"></div></div>}
                    <img className={`product-block__img ${isLoaded ? '' : 'hide'}`} onLoad={handleImageLoaded}  src={photoUrl} alt={title} />

                    {isDiscount && <div className="product-block__discount-plate">-{discPerc}%</div>}
                    {isNew && <div className="product-block__new-plate" style={isDiscount ? {top: '35px'} : {}}>Новинка</div>}
                    {isTop && <div className="product-block__top-plate" >Топ</div>}

                    <button 
                        className={`product-block__wish-plate ${isWishClicked ? 'product-block__wish-plate_animate' : ''}`}
                        onClick={(e) => handleWishClick(e)}>
                        {wishlist && wishlist.includes(id) ? 
                            <img src={wishFilledIcon} alt='Прибрати зі списку бажань' /> : 
                            <img src={wishIcon} alt='Добавити у список бажань' />
                        }
                    </button>
                </div>
                <p style={{height: '38px', overflow: 'hidden'}}>{truncTitle}</p>
                <div className="product-block__bottom">
                    <p className={clazz}>
                        {isDiscount && isAvailable && <span className="product-block__price_discount">{price} ₴</span>}
                        {!isAvailable && <span className="product-block__price_missing">Продано</span>}
                        {isDiscount ? discPrice : price} ₴</p>
                    <button 
                        className="product-block__buy-btn" 
                        disabled={!isAvailable}
                        onClick={(e) => isAvailable && handleItemToggle(e, id, 'shopping-cart')}
                    >
                        {shoppingCart && shoppingCart.includes(id) ? 
                            <>
                                <img src={shopCartFilledIcon} alt="Прибрати з кошика" />
                                <img src={checkIcon} alt="Мітка" className="product-block__bottom_check" /> 
                            </> :
                            <img src={shopCartIcon} alt="Добавити у кошик" />}
                    </button>
                </div>
            </div>
        </Link>
    )
}

export default ProductBlock;