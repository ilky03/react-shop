import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

import npLogo from '../../sources/order-modal/np_logo.png';
import ukrpLogo from '../../sources/order-modal/ukrp_logo.png';

function ModalContentForm() {

    const { profileData } = useContext(AppContext);

    const {lastName, firstName, middleName, phoneNumber, postCompany, postAddress, postNumber, paymentMethod, email} = {...profileData};

    return (
        <>
            <div className="form-group">
                <h3>Отримувач</h3>
                <label htmlFor="lastName">Прізвище</label>
                <input type="text" name="lastName" id="lastName" defaultValue={lastName} required />

                <label htmlFor="first-name">Ім'я</label>
                <input type="text" name="firstName" id="firstName" defaultValue={firstName} required />

                <label htmlFor="middleName">По батькові</label>
                <input type="text" name="middleName" id="middleName" defaultValue={middleName} />

                <label htmlFor="phoneNumber">Номер телефону</label>
                <input type="text" name="phoneNumber" id="phoneNumber" defaultValue={phoneNumber} minLength={10} maxLength={14} required />

                <label htmlFor="email">Поштова адреса</label>
                <input type="text" name="email" id="email" defaultValue={email} disabled={email} required />
            </div>

            <div className="form-group">
                <h3>Доставка</h3>
                <div className="radio-btn-group">
                    <input type="radio" id="postCompany1" name='postCompany' value='np' defaultChecked={postCompany === 'np'} />
                    <label htmlFor='postCompany1' className='radio-btn'><img src={npLogo} alt="Нова пошта" /></label>

                    <input type="radio" id="postCompany2" name='postCompany' value='urkp' defaultChecked={postCompany === 'urkp'}  />
                    <label htmlFor='postCompany2' className='radio-btn'><img src={ukrpLogo} alt="Укрпошта" /></label>

                </div>

                <label htmlFor="postAddress">Населений пункт</label>
                <input type="text" name="postAddress" id="postAddress" defaultValue={postAddress} required />

                <label htmlFor="postNumber">Відділення</label>
                <input type="text" name="postNumber" id="postNumber" defaultValue={postNumber} required />
            </div>

            <div className="form-group">
                <h3>Оплата</h3>
                <div className="radio-btn-group">
                    <input type="radio" id="paymentMethod1" name='paymentMethod' value='cash' defaultChecked={paymentMethod === 'cash'}  />
                    <label htmlFor="paymentMethod1" className='payments'>Готівкою при отриманні</label>
                    <input type="radio" id="paymentMethod2" name='paymentMethod' value='card' defaultChecked={paymentMethod === 'card'} />
                    <label htmlFor="paymentMethod2" className='payments'>Банківська картка</label>
                </div>
            </div>
        </>
    )
}

export default ModalContentForm;