import ModalContentOrder from './ModalContentOrder';
import ModalContentProfile from './ModalContentProfile';

function CenteredModal({handleCloseWindow, productsToOrder, type}) {

    return (
        <div className="modal-backdrop" onClick={() => handleCloseWindow()}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {type === 'order' && <ModalContentOrder handleCloseWindow={handleCloseWindow} productsToOrder={productsToOrder} />}
                {type.includes('profile') && <ModalContentProfile handleCloseWindow={handleCloseWindow} type={type} />}
            </div>
        </div>
    )
}

export default CenteredModal;