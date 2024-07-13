import { format } from 'date-fns';

function ModalContentOrdersList({order}) {

    const formatDate = (date) => {
        return format(date, 'dd.MM.yy HH:mm');
    };

    const {lastName, firstName, middleName, phoneNumber, postCompany, postAddress, postNumber, paymentMethod} = {...order};
    return (
        <li 
            key = {order.id} 
            className="order"
        >
            <div className="order__block">
                <div className="order__details">
                    <h3>Основна інформація</h3>
                    <p className="order__id"><span>Номер замовлення</span><br />#{order.id}</p>
                    <p><span className='order__status'>Статус</span><br />{order.status}</p>
                    <p className='order__date'><span>Дата створення</span><br />{formatDate(order.orderDate.toDate())}</p>
                    {order.ttn && <p><span>ТТН</span><br /><b>{order.ttn}</b></p>}
                </div>
            </div>
            {order.isFastBuy ? 
                <div className="order__block">
                    <h3>Дані отримувача</h3>
                    <div className="order__details">
                        <p><span>Номер телефону</span><br />{phoneNumber}</p>
                    </div>
                </div> : 
                <>
                    <div className="order__block">
                        <h3>Дані отримувача</h3>
                        <div className="order__details">
                            <p><span>ПІБ</span><br />{lastName + ' ' + firstName + ' ' + middleName }</p>
                            <p><span>Номер телефону</span><br />{phoneNumber}</p>
                        </div>
                    </div>
                    <div className="order__block">
                        <h3>Деталі доставки</h3>
                        <div className="order__details">
                            <p><span>Спосіб оплати</span><br /> {paymentMethod === 'card' ? 'Карта' : 'Готівка'}</p>
                            <p><span>Поштове відділення</span><br /> {postCompany === 'np' ? 'Нова пошта' : "Укрпошта"}</p>
                            <p><span>Населений пункт</span><br /> {postAddress}</p>
                            <p><span>Відділення</span><br /> {postNumber}</p>
                        </div>
                    </div>
                </>}
            <div className="order__block  order__products">
                <h3>Деталі замовлення</h3>
                <ul className="product-info">
                    <li><span>Фото</span><span>Товар</span><span>К-сть</span><span>Вартість</span></li>
                    {order['order'] && order['order'].map(({id, photoUrl, title, amount, price, isDiscount, discPrice, article}) => { 
                        return (
                            <li key={id} style={{position: "relative"}}>
                                <span className='grid-center'><img src={photoUrl} alt={title} /></span>
                                <p>{title}</p>
                                <p>x{amount}</p>
                                <p>{isDiscount ? amount * discPrice : amount * price} ₴</p>
                                <p className="order__article">Артикул: {article}</p>
                            </li>
                        )
                    })}
                    <li>
                        <span>Сума</span><b>
                        {order['order'] && order['order'].reduce((acc, prod) => 
                            acc += prod.isDiscount ? 
                                prod.discPrice*prod.amount :
                                prod.price*prod.amount, 0)} ₴
                    </b></li>
                </ul>
            </div>
        </li>
    )
}

export default ModalContentOrdersList;