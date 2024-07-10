import { useState, useEffect } from 'react';

function Modal({ action, handleClose, categories, handleChanged, products }) {
    const [showModal, setShowModal] = useState(false);
    const [parameters, setParameters] = useState();
    const [searchRes, setSearchRes] = useState();
    const [characteristics, setCharacteristics] = useState([{ key: '', value: '' }]);
    const [gallery, setGallery] = useState(['']);

    const { create, generateID, isLoading, update, deleteRecord } = useDB();

    const handleFormSubmit = async (e, url, operation) => {
        e.preventDefault();
        let formData = new FormData(e.target);
        if (operation === 'create') {
            const id = generateID();
            formData.set('id', id);
            let data = Object.fromEntries(formData.entries());

            data.props = characteristics.reduce((acc, { key, value }) => {
                if (key) acc[key] = value;
                return acc;
            }, {});

            data.photoGallery = gallery.reduce((acc, link, index) => {
                acc[`link${index + 1}`] = link;
                return acc;
            }, {});

            data.rating = 0;
            data.isAvailable = data.isAvailable === 'on' ? false : true;
            data.isDiscount = data.isDiscount === 'on' ? true : false;
            data.isNew = data.isNew === 'on' ? true : false;

            await create(url + id, data);
            handleChanged(url);
        } else if (operation === 'update') {
            let data = Object.fromEntries(formData.entries());

            data.props = characteristics.reduce((acc, { key, value }) => {
                if (key) acc[key] = value;
                return acc;
            }, {});

            data.photoGallery = gallery.reduce((acc, link, index) => {
                acc[`link${index + 1}`] = link;
                return acc;
            }, {});

            data.rating = 0;
            data.isAvailable = data.isAvailable === 'on' ? false : true;
            data.isDiscount = data.isDiscount === 'on' ? true : false;
            data.isNew = data.isNew === 'on' ? true : false;

            await update(url, data);
            handleChanged(url);
        }
        e.target.reset();
    }

    const handleAddCharacteristic = () => {
        setCharacteristics([...characteristics, { key: '', value: '' }]);
    };

    const handleCharacteristicChange = (index, field, value) => {
        const newCharacteristics = characteristics.map((char, charIndex) => (
            charIndex === index ? { ...char, [field]: value } : char
        ));
        setCharacteristics(newCharacteristics);
    };

    const handleAddPhoto = () => {
        setGallery([...gallery, '']);
    };

    const handlePhotoChange = (index, value) => {
        const newGallery = gallery.map((photo, photoIndex) => (
            photoIndex === index ? value : photo
        ));
        setGallery(newGallery);
    };

    useEffect(() => {
        if (!isLoading && showModal) {
            setShowModal(false);
        }
    }, [isLoading]);

    const renderModal = () => {
        switch (action) {
            case 'addProduct':
                return (
                    <>
                        <h2>Добавити новий продукт</h2>
                        <form onSubmit={(e) => handleFormSubmit(e, 'products/', 'create')}>
                            <label htmlFor="title">Назва</label>
                            <input id="title" name="title" type="text" required />

                            <label htmlFor="article">Артикул</label>
                            <input id="article" name="article" type="text" required />

                            <label htmlFor="description">Опис</label>
                            <input id="description" name="description" type="text" required />

                            <label htmlFor="photoUrl">Зображення</label>
                            <input id="photoUrl" name="photoUrl" type="text" required />

                            <label htmlFor="price">Вартість</label>
                            <input id="price" name="price" type="number" required />

                            <label htmlFor="discPrice">Акційна вартість</label>
                            <input id="discPrice" name="discPrice" type="number" />

                            <label htmlFor="category">Категорія</label>
                            <select name="category" id="category">
                                {categories.map(category => (
                                    <option key={category.id} value={category.title}>{category.title}</option>
                                ))}
                            </select>

                            <div className="check-btns">
                                <input id="isDiscount" name="isDiscount" type="checkbox" />
                                <label htmlFor="isDiscount" className='btn-checkbox'>Акційний</label>

                                <input id="isNew" name="isNew" type="checkbox" />
                                <label htmlFor="isNew" className='btn-checkbox'>Новинка</label>

                                <input id="isTop" name="isTop" type="checkbox" />
                                <label htmlFor="isTop" className='btn-checkbox'>Топ-товар</label>

                                <input id="isAvailable" name="isAvailable" type="checkbox" />
                                <label htmlFor="isAvailable" className='btn-checkbox'>Немає у наявності</label>
                            </div>

                            <h3>Характеристики</h3>
                            {characteristics.map((char, index) => (
                                <div key={index}>
                                    <label htmlFor={`char-key-${index}`}>Ключ</label>
                                    <input
                                        id={`char-key-${index}`}
                                        name={`char-key-${index}`}
                                        type="text"
                                        value={char.key}
                                        onChange={(e) => handleCharacteristicChange(index, 'key', e.target.value)}
                                    />
                                    <label htmlFor={`char-value-${index}`}>Значення</label>
                                    <input
                                        id={`char-value-${index}`}
                                        name={`char-value-${index}`}
                                        type="text"
                                        value={char.value}
                                        onChange={(e) => handleCharacteristicChange(index, 'value', e.target.value)}
                                    />
                                </div>
                            ))}
                            <button type="button" onClick={handleAddCharacteristic}>Добавити ще характеристику</button>

                            <h3>Галерея</h3>
                            {gallery.map((photo, index) => (
                                <div key={index}>
                                    <label htmlFor={`photo-${index}`}>Зображення {index + 1}</label>
                                    <input
                                        id={`photo-${index}`}
                                        name={`photo-${index}`}
                                        type="text"
                                        value={photo}
                                        onChange={(e) => handlePhotoChange(index, e.target.value)}
                                    />
                                </div>
                            ))}
                            <button type="button" onClick={handleAddPhoto}>Добавити ще фото</button>

                            <button className='add-btn'>Добавити новий товар</button>
                        </form>
                    </>
                );
            // Інші випадки...
            default:
                return null;
        }
    };

    // Інша логіка компоненту...

    return (
        <>
            <div className="modal" onClick={handleClose}>
                <div className="modal__window" onClick={(e) => e.stopPropagation()}>
                    {renderModal()}
                    <button className="close-btn" onClick={handleClose}>Скасувати</button>
                </div>
            </div>
            {showModal &&
                <div className="modal" onClick={() => setShowModal(false)}>
                    <div className="modal__window" onClick={(e) => e.stopPropagation()}>
                        {renderInsideModal()}
                        <button className="close-btn" onClick={() => setShowModal(false)}>Скасувати</button>
                    </div>
                </div>
            }
        </>
    );
}

export default Modal;
