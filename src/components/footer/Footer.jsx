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
                        <a href="google.com"><img src={tgIcon} alt="" /></a>
                        <a href="google.com"><img src={instIcon} alt="" /></a>
                        <a href="google.com"><img src={fbIcon} alt="" /></a>
                        <a href="google.com"><img src={viberIcon} alt="" /></a>
                    </div>
                </div>

                <div className="footer__contacts">
                    <h5>Служба підтримки</h5>
                    <p>+380 95 444 33 33</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer;