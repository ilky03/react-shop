import { Link } from "react-router-dom";
import { useState, useContext, useEffect } from "react";

import { AppContext } from "../context/AppContext";

import deleteIcon from '../../sources/header/delete.svg';
import emptyPic from '../../sources/header/empty.png';
import wishIcon from '../../sources/product-card/wish.svg';


function HeaderModal ({onCloseAllModals, setState, state, elements, type, icon, onOrderClick}) {
    const { productsData, handleItemToggle } = useContext(AppContext);
    const [selectedProducts, setSelectedProducts] = useState();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setSelectedProducts(elements && productsData.filter(({id}) => elements.includes(id)));
    }, [productsData, elements]);

    useEffect(() => {
        if (elements && productsData) {
          const filteredProducts = productsData
            .filter(({ id }) => elements.includes(id))
            .map(product => ({
              ...product,
              amount: 1,
            }));
          setSelectedProducts(filteredProducts);
        }
      }, [productsData, elements]);

    
    const handleDecrease = (id) => {
        setSelectedProducts(prevProducts => 
            prevProducts.map(product => product.id === id ? {...product, amount: Math.max(product.amount - 1, 1) } : product)
        )
    };

    const handleIncrease = (id) => {
        setSelectedProducts(prevProducts => 
            prevProducts.map(product => product.id === id ? {...product, amount: product.amount + 1 } : product)
        )
    }

    return (
        <>
            <div style={{position: 'relative'}}>
                <button onClick={() => {onCloseAllModals(); setState(!state)}}>
                    <div className={`header__${type} ${state ? "accent" : ""}`}>
                        <img src={icon} alt={type}  width="25" height="25" />
                        <span className={`header__${type}_counter`}>{(selectedProducts && selectedProducts.length) || 0}</span>
                    </div>
                </button>
                {state && 
                    <div className="modal-window modal-window_right">
                        <h2>{type === 'shopping-cart' ? 'Кошик' : 'Список бажань'}</h2>
                        <ul>
                            {!(selectedProducts && selectedProducts.length) ? 
                            <div className="modal-window__empty-block">
                                {!isLoaded && <div className="skeleton-wrapper"><div className="skeleton"></div></div>}
                                <img src={emptyPic} onLoad={() => setIsLoaded(true)} alt="Порожньо" width={'100px'}/>
                                {type === 'shopping-cart' ?
                                    <>
                                        <h3>Кошик порожній 😴</h3>
                                        <p>Скористайтесь каталогом чи пошуком на сайті, щоб знайти необхідний товар</p>
                                    </> :
                                    <>
                                        <h3>Список бажань порожній 😺</h3>
                                        <p>Тицяйте по <img src={wishIcon} alt="Добавити у список бажань" />, щоб добавити сюди товар.</p>
                                    </>
                                }
                            </div> : null}
                            {selectedProducts && selectedProducts.filter(({id}) => elements.includes(id)).map(({id, title, photoUrl, price, isDiscount, discPrice, amount}) => (
                                <li className={`modal-window__${type}`}>
                                    <Link 
                                    to={`product/${id}`}  
                                    key={id} 
                                    >
                                        <div onMouseDown={(e) => e.preventDefault()} className='modal-window__products-list'>
                                            <span>
                                                <img src={photoUrl} alt={title} /> 
                                                {title}
                                            </span> 
                                            {type === 'shopping-cart' ?
                                                <>
                                                    <div className="modal-window__counter" onClick={e => {e.preventDefault(); e.stopPropagation()}}>
                                                        <button onClick={(e) => handleDecrease(id)}>-</button>
                                                        <p>{amount}</p>
                                                        <button onClick={(e) => handleIncrease(id)}>+</button>
                                                    </div>
                                                    <span className="modal-window__price">
                                                        {isDiscount ? discPrice*amount : price*amount} ₴
                                                    </span>
                                                </> :
                                                <span className="modal-window__price">
                                                    {isDiscount ? discPrice : price} ₴
                                                </span>
                                            }
                                            <button className="modal-window__delete-btn" onClick={(e) => {e.stopPropagation(); handleItemToggle(e, id, type)}}><img src={deleteIcon} alt="Видалити зі списку" /></button>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        {type === 'shopping-cart' && 
                            <div className="modal-window__order-info">
                                <button onClick={() => setState(!state)}>Продовжити покупки</button>
                                <div>
                                    <p>До сплати: </p>
                                    <p>
                                        <b>
                                            {selectedProducts && selectedProducts.reduce((acc, prod) => 
                                                acc += prod.isDiscount ? 
                                                    prod.discPrice*prod.amount :
                                                    prod.price*prod.amount, 0)} ₴
                                        </b>
                                    </p>
                                </div>
                                <div>
                                    <button onClick={() => onOrderClick('order', selectedProducts)} disabled={selectedProducts.length === 0}>Оформити замовлення</button>
                                </div>
                            </div>
                        }
                    </div>
                }
            </div>

        </>
    )
}

export default HeaderModal;