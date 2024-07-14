import './footer.scss';

import tgIcon from '../../sources/footer/tg.png';
import instIcon from '../../sources/footer/inst.png';
import fbIcon from '../../sources/footer/fb.png';
import viberIcon from '../../sources/footer/viber.png';

function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__socials">
                    <h5>Ми у соцмережах</h5>
                    <div>
                        <a href="google.com"><img src={tgIcon} alt="" /></a>
                        <a href="google.com"><img src={instIcon} alt="" /></a>
                        <a href="google.com"><img src={fbIcon} alt="" /></a>
                        <a href="google.com"><img src={viberIcon} alt="" /></a>
                    </div>
                </div>

                <div className="footer__contacts">
                    <h5>Контакти</h5>
                    <p>ПП "Товари для дому"</p>
                    <p>Адреса: м.Одеса, вул.Центральна 39</p>
                    <p>Гаряча лінія: +380-95-444-33-33</p>
                </div>

                <div className="footer__nav">
                    <h5>Допомога</h5>
                    <ul>
                        <li>Доставка та оплата</li>
                        <li>Інструкція</li>
                        <li>Повернення товару</li>
                        <li>Зворотній зв'язок</li>
                    </ul>
                </div>

                <div className="footer__nav">
                    <h5>Профіль</h5>
                    <ul>
                        <li>Особистий кабінет</li>
                        <li>Список бажань</li>
                        <li>Мої замовлення</li>
                        <li>Вхід/реєстрація</li>
                    </ul>
                </div>
            </div>
        </footer>
    )
}

export default Footer;