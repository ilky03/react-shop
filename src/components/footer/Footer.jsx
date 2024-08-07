import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

import './footer.scss';

import tgIcon from '../../sources/footer/tg.png';
import instIcon from '../../sources/footer/inst.png';
import fbIcon from '../../sources/footer/fb.png';
// import viberIcon from '../../sources/footer/viber.png';

function Footer() {
    const { contacts } = useContext(AppContext);
    console.log(contacts);
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__socials">
                    <div>
                        <a href={contacts && contacts.tg} aria-label="Telegram" target='_blank' rel="noreferrer"><img src={tgIcon} alt="Telegram" width="35" height="35" /></a>
                        <a href={contacts && contacts.inst} aria-label="Instagram" target='_blank' rel="noreferrer"><img src={instIcon} alt="Instagram" width="35" height="35" /></a>
                        <a href={contacts && contacts.fb} aria-label="Facebook" target='_blank' rel="noreferrer"><img src={fbIcon} alt="Facebook" width="35" height="35" /></a>
                        {/* <a href="https://www.google.com" aria-label="Viber"><img src={viberIcon} alt="Viber" width="35" height="35" /></a> */}
                    </div>
                </div>

                <div className="footer__contacts">
                    <h3>Служба підтримки</h3>
                    <p>{contacts && contacts.phone}</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer;