import ModalContentOrder from './ModalContentOrder';
import ModalContentProfile from './ModalContentProfile';

function CenteredModal({handleCloseWindow, productsToOrder, type}) {
    const profileData = {
        'first-name': "Danilo",
        'last-name': "Timurov",
        'middle-name': "Vasilyevich",
        'phone-number': '0928883322',
        'post-address': 'м.Київ, вул.Центральна 38',
        'post-number': '123',
        'post_company': 'np',
        'payment-method': 'cash'
    }

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