import { useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";

import SEO from "../seo/SEO";
import ProductBlocks from "../productBlocks/ProductBlocks";
import Spinner from "../spinner/Spinner";

import './mainPage.scss';

import arrowUpIcon from '../../sources/category-page/arrow-up.svg';

function MainPage() {

    const { banners, handleClickUpBtn, windowWidth, isLoading } = useContext(AppContext);
    const [isLoaded, setIsLoaded] = useState(false);

    const handleImageLoaded = () => {
        setIsLoaded(true);
    };

    const location = useLocation();
    const fullUrl = `${window.location.origin}${location.pathname}${location.search}${location.hash}`;

    return (
        <>
            <SEO title="Capsula House - магазин товарів для дому" description="Тут колись буде класний опис" url={fullUrl} imageUrl={''} />
            <main>
                <div className="container">
                    <div className="main__banner">
                        {!isLoaded && 
                            <div className="main__banner skeleton-wrapper">
                                <div className="skeleton"></div>
                            </div>
                        }
                        <img className={`${isLoaded ? '' : 'hide'}`} src={windowWidth <= 1024 ? banners && banners[0].smallPicture : banners && banners[0].bigPicture} onLoad={handleImageLoaded} alt="Банер" />
                    </div>

                    <div className="main__block">
                        <h2>Акційні пропозиції</h2>
                        {isLoading && <Spinner />}
                        <ProductBlocks flag="discount" />
                    </div>

                    <div className="main__block">
                        <h2>Новий товар</h2>
                        {isLoading && <Spinner />}
                        <ProductBlocks flag="new"/>
                    </div>

                    <div className="main__block">
                        <h2>Топ товарів</h2>
                        {isLoading && <Spinner />}
                        <ProductBlocks flag="top"/>
                    </div>

                    <div className={`main__block ${localStorage.getItem('recentlyViewed') ? '' : 'hide'}`}>
                        <h2>Нещодавно переглянуті</h2>
                        {isLoading && <Spinner />}
                        <ProductBlocks flag="recently"/>
                    </div>
                </div>
                <button className={`up-btn ${windowWidth <= 1024 ? '' : 'hide'}`} onClick={handleClickUpBtn}><img src={arrowUpIcon} alt="Стрілка догори" width="24" height="24" /></button>
            </main>
        </>
    )
}

export default MainPage;