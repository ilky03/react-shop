import ModalContentOrder from './ModalContentOrder';
import ModalContentProfile from './ModalContentProfile';

function CenteredModal({handleCloseWindow, productsToOrder, type}) {

    return (
        <div className="modal-backdrop" onMouseDown={(e) => handleCloseWindow(e)}>
            <div className="modal-content" onMouseDown={(e) => e.stopPropagation()}>
                {type === 'order' && <ModalContentOrder handleCloseWindow={handleCloseWindow} productsToOrder={productsToOrder} />}
                {type.includes('profile') && <ModalContentProfile handleCloseWindow={handleCloseWindow} type={type} />}
            </div>
        </div>
    )
}

export default CenteredModal;