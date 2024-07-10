import npLogo from '../../sources/order-modal/np_logo.png';
import ukrpLogo from '../../sources/order-modal/ukrp_logo.png';

function ModalContentForm({profileData}) {
    return (
        <>
            <div className="form-group">
                <h3>Отримувач</h3>
                <label htmlFor="last-name">Прізвище</label>
                <input type="text" name="last-name" id="last-name" defaultValue={profileData["last-name"]} required />

                <label htmlFor="first-name">Ім'я</label>
                <input type="text" name="first-name" id="first-name" defaultValue={profileData["first-name"]} required />

                <label htmlFor="middle-name">По батькові</label>
                <input type="text" name="middle-name" id="middle-name" defaultValue={profileData["middle-name"]} required />

                <label htmlFor="phone-number">Номер телефону</label>
                <input type="text" name="phone-number" id="phone-number" defaultValue={profileData["phone-number"]} required />
            </div>

            <div className="form-group">
                <h3>Доставка</h3>
                <div className="radio-btn-group">
                    <input type="radio" id="post-company-1" name='post_company' value='np' defaultChecked={profileData["post_company"] === 'np'} />
                    <label htmlFor='post-company-1' className='radio-btn'><img src={npLogo} alt="Нова пошта" /></label>

                    <input type="radio" id="post-company-2" name='post_company' value='urkp' defaultChecked={profileData["post_company"] === 'urkp'}  />
                    <label htmlFor='post-company-2' className='radio-btn'><img src={ukrpLogo} alt="Укрпошта" /></label>

                </div>

                <label htmlFor="post-address">Населений пункт</label>
                <input type="text" name="post-address" id="post-address" defaultValue={profileData["post-address"]} required />

                <label htmlFor="post-number">Відділення</label>
                <input type="text" name="post-number" id="post-number" defaultValue={profileData["post-number"]} required />
            </div>

            <div className="form-group">
                <h3>Оплата</h3>
                <div className="radio-btn-group">
                    <input type="radio" id="payment-method-1" name='payment-method' value='cash' defaultChecked={profileData["payment-method"] === 'cash'}  />
                    <label htmlFor="payment-method-1" className='payments'>Готівкою при отриманні</label>
                    <input type="radio" id="payment-method-2" name='payment-method' value='card' defaultChecked={profileData["payment-method"] === 'card'} />
                    <label htmlFor="payment-method-2" className='payments'>Банківська картка</label>
                </div>
            </div>
        </>
    )
}

export default ModalContentForm;