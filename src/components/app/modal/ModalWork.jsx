import { useState, useEffect, Fragment } from 'react';

import useDB from '../../../services/useDB';

import './modal.scss';

import deleteIcon from '../../../sources/img/delete.svg';
import editIcon from '../../../sources/img/edit_thin.svg';

function Modal({action, handleClose, categories, handleChanged, products}) {

    const [showModal, setShowModal] = useState(false);
    const [parameters, setParameters] = useState();
    const [searchRes, setSearchRes] = useState();
    const [search, setSearch] = useState('');

    const [characteristics, setCharacteristics] = useState([{ key: '', value: '' }]);
    const [gallery, setGallery] = useState(['']);

    const { create, generateID, isLoading, update, deleteRecord } = useDB();

    useEffect(() => {
        const filteredProducts = products.filter(product => 
            product.title && product.title.toLowerCase().includes(search.toLowerCase())
        );
        setSearchRes(filteredProducts);
    }, [products, search]);

    const handleFormSubmit = async (e, url, operation) => {
        e.preventDefault();
        let formData = new FormData(e.target);
        if (operation === 'create') {
            const id = generateID();
            formData.set('id', id);
            let data = Object.fromEntries(formData.entries());

            if (url === 'products/') {
                data.props = characteristics.reduce((acc, { key, value }) => {
                    if (key) acc[`Хка_${key}`] = value;
                    // if (key) acc[key] = value;
                    return acc;
                }, {});
    
                data.photoGallery = gallery.reduce((acc, link, index) => {
                    acc[`Зображення${index + 1}`] = link;
                    return acc;
                }, {});

                Object.keys(data).forEach(key => {
                    if (key.startsWith('char-') || key.startsWith('photo-')) {
                        delete data[key];
                    }
                });
                
                data.rating = 0;

                data.isAvailable = data.isAvailable === 'on' ? false : true;
                data.isDiscount = data.isDiscount === 'on' ? true : false;
                data.isNew = data.isNew === 'on' ? true : false;

                setCharacteristics([{ key: '', value: '' }]);
                setGallery(['']);
            }

            await create(url+id, data);
            handleChanged(url);
        } else if (operation === 'update') {
            let data = Object.fromEntries(formData.entries());

            if (url.includes('products')) {
                data.props = {};
                data.photoGallery = {};

                for (let [key, value] of Object.entries(data)) {
                    if (key.startsWith('Хка_')) {
                        data.props[key] = value;
                    } else if (key.includes('Зображення')) {
                        let imageIndex = Object.keys(data.photoGallery).length + 1;
                        data.photoGallery[`Зображення${imageIndex}`] = value;
                    }
                }

                Object.keys(data).forEach(key => {
                    if (key.startsWith('Хка_') || key.startsWith('Зображення')) {
                        delete data[key];
                    }
                });

                data.rating = 0;

                data.isAvailable = data.isAvailable === 'on' ? false : true;
                data.isDiscount = data.isDiscount === 'on' ? true : false;
                data.isNew = data.isNew === 'on' ? true : false;
            }

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
        switch(action) {
            case 'addCategory':
                return (
                    <>
                        <h2>Добавити нову категорію</h2>
                        <form onSubmit={(e) => handleFormSubmit(e, 'categories/', 'create')}>
                            <label htmlFor="title">Назва</label>
                            <input id="title" name="title" type="text" />
                            <label htmlFor="photoUrl">Зображення</label>
                            <input id="photoUrl" name="photoUrl" type="text" />
                            <button disabled={isLoading}>Добавити нову категорію</button>
                        </form>
                    </>
                )

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
                                    <label htmlFor={`char-key-${index}`}>Назва</label>
                                    <input
                                        id={`char-key-${index}`}
                                        name={`char-key-${index}`}
                                        type="text"
                                        value={char.key}
                                        onChange={(e) => handleCharacteristicChange(index, 'key', e.target.value)}
                                    />
                                    <label htmlFor={`char-value-${index}`}>Властивість</label>
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
                )

            case 'editCategory':
                return (
                    <div className='category-cards'>
                        {categories.map(category => (
                            <div className='category-card' key={category.id}>
                                <button 
                                    onClick={() => handleEvent('edit', `categories/`, category)}
                                >
                                    <img src={editIcon} alt="" />
                                </button>
                                <button
                                    onClick={() => handleEvent('delete', `categories/`, category)}
                                >
                                    <img src={deleteIcon} alt="" />
                                </button>
                                <img src={category.photoUrl} alt="" />
                                <p>{category.title}</p>
                            </div>
                        ))}
                    </div>
                )

            case 'editProduct':
                return (
                    <>
                        <form>
                            <input name="search" type="text" onChange={(e) => setSearch(e.target.value)} placeholder='Уведіть назву'/>
                        </form>
                        {searchRes && 
                            <div className="cards-wrapper">
                                {searchRes.map(product => (
                                <div className='category-card' key={product.id}>
                                <button 
                                    onClick={() => handleEvent('edit', `products/`, product)}
                                >
                                    <img src={editIcon} alt="" />
                                </button>
                                <button
                                    onClick={() => handleEvent('delete', `products/`, product)}
                                >
                                    <img src={deleteIcon} alt="" />
                                </button>
                                <img src={product.photoUrl} alt="" />
                                <p>{product.title}</p>
                                </div>
                                ))}
                            </div>
                        }
                    </>
                )

            case 'order':
                return (
                    <>
                        тута список усіх замовлень
                    </>
                )

            default: 
                return null;
        }
    }

    const handleEvent = (action, url, object) => {
        setShowModal(true);
        setParameters({action, url, object});
    }

    const renderCharAndGallery = (type) => {
        const object = parameters.object;
        let keys = type === 'gallery' ? Object.keys(object.photoGallery).sort() : Object.keys(object.props);
        return (
            <>
                {keys.map((key) => (
                    <Fragment key={key}>
                        <label htmlFor={key}>{type === 'gallery' ? key : key.split('_')[1]}</label>
                        {type === 'gallery' ?
                            <input id={key} name={key} type="text" defaultValue={object.photoGallery[key]}/> :
                            <input id={key} name={key} type="text" defaultValue={object.props[key]}/>
                        }
                    </Fragment>
                ))}
            </>
        )
    }

    const renderInsideModal = () => {
        const object = parameters.object;

        if (parameters.action === 'edit') {

            return (
                <>
                    <h2>Редагувати</h2>
                    <form onSubmit={(e) => handleFormSubmit(e, `${parameters.url+object.id}`, 'update')}>
                        <label htmlFor="title">Назва</label>
                        <input id="title" name="title" type="text" defaultValue={object.title} />
                        <label htmlFor="photoUrl">Зображення</label>
                        <input id="photoUrl" name="photoUrl" type="text" defaultValue={object.photoUrl} />
                        {parameters.url.includes('products') ? 
                            <>
                            <label htmlFor="article">Артикул</label>
                            <input id="article" name="article" type="text"  defaultValue={object.article} required />

                            <label htmlFor="description">Опис</label>
                            <input id="description" name="description" type="text" defaultValue={object.description} required />

                            <label htmlFor="price">Вартість</label>
                            <input id="price" name="price" type="number" defaultValue={object.price} required />

                            <label htmlFor="discPrice">Акційна вартість</label>
                            <input id="discPrice" name="discPrice" type="number" defaultValue={object.discPrice} />

                            <label htmlFor="category">Категорія</label>
                            <select name="category" id="category" defaultValue={object.category}>
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
                            {renderCharAndGallery('char')}
                            <h3>Галерея</h3>
                            {renderCharAndGallery('gallery')}
                            </>  : null  
                        }
                        <button disabled={isLoading}>Застосувати зміни</button>
                    </form>
                </>
            )
        }
        if (parameters.action === 'delete') {
            return (
                <>
                    <h2>Видалити</h2>
                    <div className='category-card'>
                        <img src={object.photoUrl} alt="" />
                        <p>{object.title}</p>
                    </div>
                    <button 
                        className='confirm-btn'
                        onClick={() => {deleteRecord(`${parameters.url + object.id}`); handleChanged(parameters.url)}}
                        disabled={isLoading}>Так</button>
                </>
            )
        }
    }
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

    )
}

export default Modal;