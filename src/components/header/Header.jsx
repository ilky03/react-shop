import { Link } from 'react-router-dom';
import { useEffect, useState, useRef, useContext } from 'react';

import { AppContext } from '../context/AppContext';
import CategoryCard from '../categoryCard/CategoryCard';
import Modal from '../modal/Modal';
import CenteredModal from "../centeredModal/CenteredModal";
import Spinner from '../spinner/Spinner';

import './header.scss';

import searchIcon from '../../sources/header/search.svg';
import profileIcon from '../../sources/header/profile.svg';
import wishIcon from '../../sources/header/wish.svg';
import shopBasketIcon from '../../sources/header/shopBasket.svg';
import swipeIcon from '../../sources/header/swipe.svg';

function Header() {

    const { productsData, wishlist, categories, shoppingCart, windowWidth, isLoading } = useContext(AppContext);
    const [isOpenCategories, setIsOpenCategories] = useState(false);
    const [isActiveSearch, setIsActiveSearch] = useState(false);
    const [search, setSearch] = useState('');
    const [searchRes, setSearchRes] = useState();
    const [isOpenBasket, setIsOpenBasket] = useState(false);
    const [isOpenProfile, setIsOpenProfile] = useState(false);
    const [isOpenWishlist, setIsOpenWishlist] = useState(false);
    const [productsToOrder, setProductsToOrder] = useState();
    const [showSearchInput, setShowSearchInput] = useState(false);

    const [isShowCenteredModal, setIsShowCenteredModal] = useState(false);
    const [modalContentType, setModalContentType] = useState();
    const [scrollBarWidth, setScrollBarWidth] = useState();

    const inputRef = useRef(null);
    const navRef = useRef(null);

    useEffect(() => {
        if (!isShowCenteredModal) {
            setScrollBarWidth(window.innerWidth - document.documentElement.clientWidth);
        }
        
    }, [windowWidth, isShowCenteredModal]);

    useEffect(() => {
        if (showSearchInput || isOpenCategories || isShowCenteredModal || isActiveSearch || isOpenBasket || isOpenProfile || isOpenWishlist) {
            document.body.style.overflow = 'hidden';

            if (windowWidth > 1024) {
                document.body.style.paddingRight = `${scrollBarWidth}px`;
                navRef.current.style.paddingRight = `calc(10vw + ${scrollBarWidth}px)`;
            }
        } else {
            document.body.style.overflow = '';
            if (windowWidth > 1024) {
                document.body.style.paddingRight = '';
                navRef.current.style.paddingRight = ''; 
            }
        }
    }, [scrollBarWidth, showSearchInput, isOpenBasket, isOpenProfile, isOpenWishlist, isOpenCategories, isActiveSearch, isShowCenteredModal, windowWidth]);

    useEffect(() => {
        setSearchRes(productsData && productsData.filter(product => product.title && product.title.toLowerCase().includes(search.toLowerCase())));
        // eslint-disable-next-line
    }, [search]);

    useEffect(() => {
        if (isActiveSearch && inputRef.current) {
            inputRef.current.focus();
        } else {
            inputRef.current.blur();
        }
    }, [isActiveSearch]);

    const onShowCenteredModal = (type = '', selectedProducts = 0) => {
        !isShowCenteredModal ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'auto';
        setIsShowCenteredModal(!isShowCenteredModal);
        setModalContentType(type);
        if (selectedProducts) {
            setProductsToOrder(selectedProducts);
        }
    }
    const handleBgClick = () => {
        setIsOpenCategories(false);
        setIsOpenBasket(false);
        setIsOpenProfile(false);
        setIsOpenWishlist(false);
    }

    return (
        <>
            {isShowCenteredModal && <CenteredModal handleCloseWindow={onShowCenteredModal} productsToOrder={productsToOrder} type={modalContentType}/>}
            {(showSearchInput || isActiveSearch || isOpenCategories || isOpenBasket || isOpenProfile || isOpenWishlist) && <div className="modal-backdrop modal-backdrop_header" onClick={handleBgClick}></div>}
            <header>
                <div className="container" ref={navRef}>
                    <div className="header__logo">
                        <Link to="/"><p>HOUSE</p></Link>
                    </div>
            
                    <button className="header__category-btn" onClick={() => setIsOpenCategories(!isOpenCategories)}>
                        <div className="header__burger">
                            <span></span><span></span><span></span>
                        </div>
                        <p className='header__burger_text'>Каталог</p>
                        {isOpenCategories && 
                            <div className="modal-window">
                                <ul>
                                    <h2>Категорії</h2>
                                    {categories && categories.map(({title, id, photoUrl}) => (
                                        <Link to={`/category/${id}`} key={id}><li><img src={photoUrl} alt={title} />{title}</li></Link>
                                    ))}
                                </ul>
                            </div>
                        }
                    </button>
            
                    <form className='header__search-form'>
                        <input 
                            type="text" 
                            placeholder="Я шукаю..." 
                            onFocus={() => setIsActiveSearch(true)} 
                            onBlur={() => {setIsActiveSearch(false); setShowSearchInput(false)}}
                            onChange={(e) => setSearch(e.target.value)}
                            value={search}
                            ref={inputRef}
                            className={showSearchInput && windowWidth < 1024 ? '' : windowWidth > 1024 ? '' : 'hide'}
                        />
                        <button 
                            onClick={(e) => {e.preventDefault(); setShowSearchInput(!showSearchInput)}}
                            className={`header__search ${showSearchInput ? 'accent' : ''}`}
                            disabled={windowWidth > 1024}
                        ><img src={searchIcon} alt="" /></button>
                        {isActiveSearch && searchRes.length !== 0 &&
                            <div className="modal-window">
                                <h5>Результати пошуку</h5>
                                <ul>
                                    {searchRes && searchRes.map(({id, title, photoUrl, price, isDiscount, discPrice}) => (
                                        <Link 
                                            to={`product/${id}`}  
                                            key={id} 
                                            onClick={() => {setSearch(''); setIsActiveSearch(false)}}
                                        >
                                            <li onMouseDown={(e) => e.preventDefault()} className='modal-window__searchRes'>
                                                <span>
                                                    <img src={photoUrl} alt={title} /> 
                                                    {title}
                                                </span> 
                                                <span className="modal-window__price">
                                                    {isDiscount ? discPrice : price}₴
                                                </span>
                                            </li>
                                        </Link>
                                    ))}
                                </ul>
                            </div>
                        }
                    </form>
            
                    <div className="header__lang-toggle">
                        <p>UA</p>
                        <p>RU</p>
                    </div>
                    
                    <button onClick={() => setIsOpenProfile(!isOpenProfile)} style={{position: 'relative'}}>
                        <div className={`header__profile ${isOpenProfile ? 'accent' : ''}`} >
                            <img src={profileIcon} alt="" />
                        </div>
                        {isOpenProfile && 
                            <div className="modal-window">
                                <h2>Профіль</h2>
                                <ul>
                                    <li onClick={() => onShowCenteredModal('profile-cabinet')}>
                                        Особистий кабінет
                                    </li>
                                    <li onClick={() => onShowCenteredModal('profile-settings')}>
                                        Налаштування
                                    </li>
                                    <li onClick={() => onShowCenteredModal('profile-orders')}>
                                        Мої замовлення
                                    </li>
                                    <li onClick={() => onShowCenteredModal('profile-login')}>
                                        Вхід/реєстрація
                                    </li>
                                </ul>
                            </div>
                        }
                    </button>
            
                    <Modal setState={setIsOpenWishlist} state={isOpenWishlist} elements={wishlist} type={'wishlist'} icon={wishIcon} />
                    <Modal setState={setIsOpenBasket} state={isOpenBasket} elements={shoppingCart} type={'shopping-cart'} icon={shopBasketIcon} handleOrderClick={onShowCenteredModal} />

                </div>

                <div className="container relative">
                    <div className="categories-wrapper">
                        {isLoading && <Spinner />}
                        <div className="categories">
                            {categories && categories.slice(0, 9).map((categoryData) => 
                                <CategoryCard {...categoryData} key={categoryData.id}/>
                            )}
                        </div>
                    </div>
                    {windowWidth <= 1024 && 
                        <div className="swipe-tip">
                            <img src={swipeIcon} alt="Свайп" />
                        </div> 
                    }
                </div>
            </header>
        </>
    )
}

export default Header;