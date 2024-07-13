import { useEffect, useState } from 'react';
import useDB from '../../services/useDB';

import ModalContentOrder from './ModalContentOrder';
import ModalContentProfile from './ModalContentProfile';

function CenteredModal({handleCloseWindow, productsToOrder, type}) {

    const { auth, get } = useDB();

    // const profileData = {
    //     'firstName': "Danilo",
    //     'lastName': "Timurov",
    //     'middleName': "Vasilyevich",
    //     'phoneNumber': '0928883322',
    //     'postAddress': 'м.Київ, вул.Центральна 38',
    //     'postNumber': '123',
    //     'postCompany': 'np',
    //     'paymentMethod': 'cash'
    // }
    const [profileData, setProfileData] = useState();

    useEffect(() => {
     auth.onAuthStateChanged(async (user) => {
        console.log(user);
        get(`users/${user.uid}`).then(data => setProfileData(data));
     })
     // eslint-disable-next-line
    }, [])
    return (
        <div className="modal-backdrop" onClick={() => handleCloseWindow()}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {type === 'order' && <ModalContentOrder handleCloseWindow={handleCloseWindow} productsToOrder={productsToOrder} profileData={profileData} />}
                {type.includes('profile') && <ModalContentProfile handleCloseWindow={handleCloseWindow} type={type} profileData={profileData} />}
            </div>
        </div>
    )
}

export default CenteredModal;