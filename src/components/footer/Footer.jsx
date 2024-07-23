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
                    <div>
                        <a href="https://www.google.com" aria-label="Telegram"><img src={tgIcon} alt="Telegram" width="35" height="35" /></a>
                        <a href="https://www.google.com" aria-label="Instagram"><img src={instIcon} alt="Instagram" width="35" height="35" /></a>
                        <a href="https://www.google.com" aria-label="Facebook"><img src={fbIcon} alt="Facebook" width="35" height="35" /></a>
                        <a href="https://www.google.com" aria-label="Viber"><img src={viberIcon} alt="Viber" width="35" height="35" /></a>
                    </div>
                </div>

                <div className="footer__contacts">
                    <h3>Служба підтримки</h3>
                    <p>+380 95 444 33 33</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer;