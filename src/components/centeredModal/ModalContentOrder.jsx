import useDB from '../../services/useDB';
import { useContext } from 'react';

import { AppContext } from '../context/AppContext';

import ModalContentForm from './ModalContentForm';

import './centeredModal.scss';

function ModalContentOrder({handleCloseWindow, productsToOrder, profileData}) {
    const { clearShoppingCart, isLoading } = useContext(AppContext);
    const { create, generateID } = useDB();

    const handleSubmit = async(e) => {
        e.preventDefault();
        const id = generateID();
        const formData = new FormData(e.target);
        let data = Object.fromEntries(formData.entries());
        data.order = productsToOrder;
        data.id = id;
        data.orderDate = new Date();
        data.status = 'Створено';
        await create('orders/'+id, data).then(() => {handleCloseWindow(); clearShoppingCart()});
    }

    return (
        <>
            <h2>Оформлення замовлення</h2>
            <ul className='product-info'>
                <li><span>Фото</span><span>Товар</span><span>К-сть</span><span>Вартість</span></li>
                    {productsToOrder.map(({id, photoUrl, title, amount, price, isDiscount, discPrice}) => { 
                        return (
                            <li key={id}>
                                <span className='grid-center'><img src={photoUrl} alt={title} /></span>
                                <p>{title}</p>
                                <p>x{amount}</p>
                                <p>{isDiscount ? amount * discPrice : amount * price} ₴</p>
                            </li>
                        )
                    })}
                    <li className='modal-content__sum'>
                        <span>Сума</span><b>
                        {productsToOrder && productsToOrder.reduce((acc, prod) => 
                            acc += prod.isDiscount ? 
                                prod.discPrice*prod.amount :
                                prod.price*prod.amount, 0)} ₴
                    </b></li>
                </ul>
                <form onSubmit={handleSubmit}>
                    <ModalContentForm profileData={profileData} />
                    <div className="form-group">
                        <button disabled={isLoading}>Оформити замовлення</button>
                    </div>
                </form>
                <button className='modal-content__cancel-btn' onClick={() => handleCloseWindow()}>Продовжити покупки</button>
        </>
    )
}

export default ModalContentOrder;