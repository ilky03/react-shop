import { useState, useEffect, Fragment } from 'react';
import { format } from 'date-fns';

import useDB from '../../../services/useDB';

import './modal.scss';

import deleteIcon from '../../../sources/img/delete.svg';
import editIcon from '../../../sources/img/edit_thin.svg';
import npLogo from '../../../sources/img/np_logo.png';
import ukrpLogo from '../../../sources/img/ukrp_logo.png';


function Modal({action, onClose, categories, handleChanged, products, orders, banners, contacts}) {

    const [showModal, setShowModal] = useState(false);
    const [parameters, setParameters] = useState();
    const [searchRes, setSearchRes] = useState();
    const [search, setSearch] = useState('');
    const [file, setFile] = useState(null);
    const [files, setFiles] = useState([]);
    const [addedPhotoUrl, setAddedPhotoUrl] = useState(null);

    const [characteristics, setCharacteristics] = useState([{ key: '', value: '' }]);
    const [gallery, setGallery] = useState(['']);

    const { create, generateID, isLoading, update, deleteRecord, uploadFile } = useDB();

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
            if (file) {
                const downloadURL = await uploadFile(file);
                data.photoUrl = downloadURL;
                setFile(null);
            }
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

                let urls = {};

                if (files.length > 0) {
                    await Promise.all(
                        files.map(async (file, index) => {
                            const downloadURL = await uploadFile(file);
                            urls[`Зображення${index + 1}`] = downloadURL;
                        })
                    ).then(() => setFiles([]));
        
                    data.photoGallery = Object.keys(urls).reduce((acc, key) => {
                        acc[key] = urls[key];
                        return acc;
                    }, {});
        
                }

                Object.keys(data).forEach(key => {
                    if (key.startsWith('char-') || key.startsWith('photo-')) {
                        delete data[key];
                    }
                });
                
                data.rating = [];

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

                // data.rating = [];

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

    const formatDate = (date) => {
        return format(date, 'dd.MM.yy HH:mm');
      };

    // const handlePhotoChange = (index, value) => {
    //     const newGallery = gallery.map((photo, photoIndex) => (
    //         photoIndex === index ? value : photo
    //     ));
    //     setGallery(newGallery);
    // };


    useEffect(() => {
        if (!isLoading && showModal) {
          setShowModal(false);
        }
        //eslint-disable-next-line
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
                            <label htmlFor="file-upload">Зображення</label>
                            <input id="file-upload" type="file" onChange={handleFileChange} required />
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
                            <textarea id="description" name="description" required />
                            {/* <label htmlFor="photoUrl">Зображення</label>
                            <input id="photoUrl" name="photoUrl" type="text" required /> */}
                            <label htmlFor="file-upload">Зображення</label>
                            <input id='file-upload' type="file" onChange={handleFileChange} required />

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
                                        type="file"
                                        onChange={handleFilesChange}
                                    />
                                </div>
                            ))}
                            <button type="button" onClick={handleAddPhoto}>Добавити ще фото</button>


                            <button className='add-btn' disabled={isLoading}>Добавити новий товар</button>
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
                        <h2>Список замовлень</h2>
                        <ul>
                            {orders && orders.sort((a, b) => b.orderDate - a.orderDate).map((order) => {
                                return (
                                    <li 
                                        key = {order.id} 
                                        className={`order ${order.status === 'Отримано' ? ' bg-green' : ''} ${order.isFastBuy ? 'bg-bolt' : ''} ${order.status === 'Відмова від отримання' || order.status === 'Скасовано' ? 'bg-red' : ''}`}
                                    >
                                        <div className="order__btns">
                                            <button onClick={() => handleEvent('editTTN', `orders/${order.id}`, order)}>ТТН</button>
                                            <button onClick={() => handleEvent('editStatus', `orders/${order.id}`, order)}>Статус</button>
                                            <button onClick={() => handleEvent('editInfo', `orders/${order.id}`, order)}>Дані</button>
                                            <button onClick={() => handleEvent('deleteOrder', `orders/`, order)}>Видалити</button>
                                        </div>
                                        <div className="order-block">
                                            <div className="order-details">
                                                <p className="order-id"><span>Номер замовлення</span><br />#{order.id}</p>
                                                <p><span className='order__status'>Статус</span><br />{order.status}</p>
                                                <p className='order__date'><span>Дата створення</span><br />{formatDate(order.orderDate.toDate())}</p>
                                                {order.ttn && <p><span>ТТН</span><br /><b>{order.ttn}</b></p>}
                                            </div>
                                        </div>
                                        {order.isFastBuy ? 
                                            <div className="order-block">
                                                <h3>Дані отримувача</h3>
                                                <div className="order__details">
                                                    <p><span>Номер телефону</span><br />{order.phoneNumber}</p>
                                                </div>
                                            </div> : 
                                            <>
                                                <div className="order-block">
                                                    <h3>Дані отримувача</h3>
                                                    <div className="order__details">
                                                        <p><span>ПІБ</span><br />{order.lastName + ' ' + order.firstName+ ' ' + order.middleName }</p>
                                                        <p><span>Номер телефону</span><br />{order.phoneNumber}</p>
                                                        <p><span>Поштова адреса</span><br />{order.email}</p>
                                                    </div>
                                                </div>
                                                <div className="order-block">
                                                    <h3>Деталі доставки</h3>
                                                    <div className="order__details">
                                                        <p><span>Спосіб оплати</span><br /> {order.paymentMethod === 'card' ? 'Карта' : 'Готівка'}</p>
                                                        <p><span>Поштове відділення</span><br /> {order.postCompany === 'np' ? 'Нова пошта' : "Укрпошта"}</p>
                                                        <p><span>Населений пункт</span><br /> {order.postAddress}</p>
                                                        <p><span>Відділення</span><br /> {order.postNumber}</p>
                                                    </div>
                                                </div>
                                            </>}
                                        <div className="order-block">
                                            <h3>Деталі замовлення</h3>
                                            <ul>
                                                <li><span>Фото</span><span>Товар</span><span>К-сть</span><span>Вартість</span></li>
                                                {order['order'] && order['order'].map(({id, photoUrl, title, amount, price, isDiscount, discPrice, article}) => { 
                                                    return (
                                                        <li key={id} style={{position: "relative"}}>
                                                            <span className='grid-center'><img src={photoUrl} alt={title} /></span>
                                                            <p>{title}</p>
                                                            <p>x{amount}</p>
                                                            <p>{isDiscount ? amount * discPrice : amount * price} ₴</p>
                                                            <p className="order-block__article">Артикул: {article}</p>
                                                        </li>
                                                    )
                                                })}
                                                <li className='order-block__sum'>
                                                    <span>Сума</span><b>
                                                    {order['order'] && order['order'].reduce((acc, prod) => 
                                                        acc += prod.isDiscount ? 
                                                            prod.discPrice*prod.amount :
                                                            prod.price*prod.amount, 0)} ₴
                                                </b></li>
                                            </ul>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </>
                )
            
            case 'upload':
                return (
                    <>
                        <h2>Завантажити нове зображення</h2>
                        <form onSubmit={(e) => e.preventDefault}>
                            <label htmlFor="file-upload">Зображення</label>
                            <input id="file-upload" type="file" onChange={async (e) => {
                                const url = await uploadFile(e.target.files[0]);
                                setAddedPhotoUrl(url);
                            }} required />
                            {isLoading && <p>Зображення завантажується...</p>}
                        </form>
                        {addedPhotoUrl &&  <button onClick={handleCopyClick}>Скопіювати посилання</button>}
                    </>
                )

            case 'banner':
                return (
                    <>
                        <h2>Керування банерами</h2>
                        <ul className='banners'>
                            {banners && banners.map(banner => {
                                return (
                                    <li className='banners__block' key={banner.id}>
                                        <div className="banners__block_btns">
                                            <button 
                                                onClick={() => handleEvent('editBanner', `banners/${banner.id}`, banner)}
                                            >
                                                    <img src={editIcon} alt="Редагувати" />
                                            </button>
                                            <button
                                                onClick={() => handleEvent('deleteBanner', `banners/${banner.id}`, banner)}
                                            >
                                                <img src={deleteIcon} alt="Видалити" />
                                            </button>
                                        </div>
                                        <div className='banners__block_small'>
                                            <p>small 800x700</p>
                                            <img src={banner.smallPicture} alt="" /></div>
                                        <div className='banners__block_medium'>
                                            <p>medium 430x630</p>
                                            <img  src={banner.mediumPicture} alt="" /></div>
                                        <div className='banners__block_big'>
                                            <p>big 1536x400</p>
                                            <img src={banner.bigPicture} alt="" /></div>
                                    </li>
                                )
                            })}
                        </ul>
                    </>
                )
            case 'contacts':
                return (
                    <>
                        <h2>Зміна контактної інформації</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const data = Object.fromEntries(formData);
                            update('contacts/socials', data);
                            handleChanged('contacts/');
                        }}>
                            <label htmlFor="inst">Інстаграм</label>
                            <input type="text" name="inst" id="inst" defaultValue={contacts && contacts.inst} />

                            <label htmlFor="fb">Фейсбук</label>
                            <input type="text" name="fb" id="fb" defaultValue={contacts && contacts.fb} />

                            <label htmlFor="tg">Телеграм</label>
                            <input type="text" name="tg" id="tg" defaultValue={contacts && contacts.tg} />

                            <label htmlFor="phone">Номер служби підтримки</label>
                            <input type="text" name="phone" id="phone" defaultValue={contacts && contacts.phone} />

                            <button className='add-btn'>Зберегти зміни</button>
                        </form>
                    </>
                )
            default: 
                return null;
        }
    }

    const handleCopyClick = async () => {
        try {
            console.log(addedPhotoUrl)
            await navigator.clipboard.writeText(addedPhotoUrl);
            alert('Посилання скопійовано у буфер обміну!');
            // setAddedPhotoUrl(null);
        } catch (err) {
            console.error('Помилка копіювання тексту: ', err);
        }
    }

    const handleEvent = (action, url, object) => {
        setShowModal(true);
        setParameters({action, url, object});
    }

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleFilesChange = (e) => {
        setFiles([...files, e.target.files[0]]);
    }

    const renderCharAndGallery = (type) => {
        const object = parameters.object;
        let keys = type === 'gallery' ? 
        
        Object.keys(object.photoGallery).sort((a, b) => {
            const numA = parseInt(a.match(/\d+/)[0], 10);
            const numB = parseInt(b.match(/\d+/)[0], 10);
        
            return numA - numB;}) : 
        Object.keys(object.props);
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
                            <textarea id="description" name="description" defaultValue={object.description} required />

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
        if (parameters.action === 'editTTN') {
            return (
                <>
                    <h2>Добавити ТТН</h2>
                    <form onSubmit={async (e) => {
                            e.preventDefault()
                            const formData = new FormData(e.target);
                            const data = Object.fromEntries(formData);    
                            await update(parameters.url, data);
                            handleChanged(parameters.url);
                        }}>
                        <label htmlFor="ttn">ТТН</label>
                        <input type="text" name="ttn" id="ttn" required/>
                        <button disabled={isLoading}>Добавити</button>
                    </form>
                </>
            )
        }

        if (parameters.action === 'editStatus') {
            return (
                <>
                    <h2>Змінити статус посилки</h2>
                    <form onSubmit={async (e) => {
                            e.preventDefault()
                            const formData = new FormData(e.target);
                            const data = Object.fromEntries(formData);    
                            await update(parameters.url, data);
                            handleChanged(parameters.url);
                        }}>
                        <label htmlFor="status">Оберіть поточний статус посилки</label>
                        <select name="status" id="status" defaultValue={parameters.object.status}>
                            <option value="Створено">Створено</option>
                            <option value="Підтверджено">Підтверджено</option>
                            <option value="Скасовано">Скасовано</option>
                            <option value="Відправлено">Відправлено</option>
                            <option value="Отримано">Отримано</option>
                            <option value="Відмова від отримання">Відмова від отримання</option>
                        </select>
                        <button disabled={isLoading}>Змінити</button>
                    </form>
                </>
            )
        }

        if (parameters.action === 'editInfo') {
            const order = parameters.object;
            return (
                <>
                    <h2>Змінити деталі замовлення</h2>
                    <form onSubmit={async (e) => {
                            e.preventDefault()
                            const formData = new FormData(e.target);
                            const data = Object.fromEntries(formData);    
                            data.isFastBuy = false;
                            await update(parameters.url, data);
                            handleChanged(parameters.url);
                        }}>
                        <div className="form-group">
                            <h3>Отримувач</h3>
                            <label htmlFor="lastName">Прізвище</label>
                            <input type="text" name="lastName" id="lastName" defaultValue={order.lastName} required />

                            <label htmlFor="firstName">Ім'я</label>
                            <input type="text" name="firstName" id="firstName" defaultValue={order.firstName} required />

                            <label htmlFor="middleName">По батькові</label>
                            <input type="text" name="middleName" id="middleName" defaultValue={order.middleName} />

                            <label htmlFor="phoneNumber">Номер телефону</label>
                            <input type="text" name="phoneNumber" id="phoneNumber" defaultValue={order.phoneNumber} required />

                            <label htmlFor="email">Поштова адреса</label>
                            <input type="text" name="email" id="email" defaultValue={order.email} />
                        </div>

                        <div className="form-group">
                            <h3>Доставка</h3>
                            <div className="radio-btn-group">
                                <input type="radio" id="postCompany1" name='postCompany' value='np' defaultChecked={order.postCompany === 'np'} />
                                <label htmlFor='postCompany1' className='radio-btn'><img src={npLogo} alt="Нова пошта" /></label>

                                <input type="radio" id="postCompany2" name='postCompany' value='urkp' defaultChecked={order.postCompany === 'ukrp'} />
                                <label htmlFor='postCompany2' className='radio-btn'><img src={ukrpLogo} alt="Укрпошта" /></label>

                            </div>

                            <label htmlFor="postAddress">Населений пункт</label>
                            <input type="text" name="postAddress" id="postAddress" defaultValue={order.postAddress} required />

                            <label htmlFor="postNumber">Відділення</label>
                            <input type="text" name="postNumber" id="postNumber" defaultValue={order.postNumber} required />
                        </div>

                        <div className="form-group">
                            <h3>Оплата</h3>
                            <div className="radio-btn-group">
                                <input type="radio" id="paymentMethod1" name='paymentMethod' value='cash' defaultChecked={order.paymentMethod === 'cash'} />
                                <label htmlFor="paymentMethod1" className='payments'>Готівкою при отриманні</label>
                                <input type="radio" id="paymentMethod2" name='paymentMethod' value='card' defaultChecked={order.paymentMethod === 'card'} />
                                <label htmlFor="paymentMethod2" className='payments'>Банківська картка</label>
                            </div>
                        </div>

                        <div className="form-group">
                            <button>Оформити замовлення</button>
                        </div>
                    </form>
                </>
            )
        }

        if (parameters.action === 'deleteOrder') {
            const order = parameters.object;
            return (
                <>
                    <h2>Видалити це замовлення?</h2>
                    <div>
                        <p>#{order.id}</p>
                    </div>
                    <button 
                        className='confirm-btn'
                        onClick={() => {deleteRecord(`${parameters.url + object.id}`); handleChanged(parameters.url)}}
                        disabled={isLoading}>Так</button>
                </>
            )
        }

        if (parameters.action === 'deleteBanner') {
            return (
                <>
                    <h2>Видалити цю групу банерів?</h2>
                    <div className='banners__delete'>
                        <img src={object.mediumPicture} alt="" />
                        <img src={object.bigPicture} alt="" />
                        <img src={object.smallPicture} alt="" />
                    </div>
                    <button 
                        className='confirm-btn'
                        onClick={() => {deleteRecord(`${parameters.url + object.id}`); handleChanged(parameters.url)}}
                        disabled={isLoading}>Так</button>
                </>
            )
        }

        if (parameters.action === 'editBanner') {
            return (
                <>
                    <h2>Змінити зображення</h2>
                    <form onSubmit={async (e) => {
                            e.preventDefault()
                            const formData = new FormData(e.target);
                            const data = Object.fromEntries(formData);    
                            await update(parameters.url, data);
                            handleChanged(parameters.url);
                        }}>
                        <label htmlFor="smallPicture">small 800x700</label>
                        <input type="text" name="smallPicture" id="smallPicture" defaultValue={parameters.object.smallPicture}/>
                        <label htmlFor="mediumPicture">medium 430x630</label>
                        <input type="text" name="mediumPicture" id="mediumPicture" defaultValue={parameters.object.mediumPicture}/>
                        <label htmlFor="bigPicture">big 1536x400</label>
                        <input type="text" name="bigPicture" id="bigPicture" defaultValue={parameters.object.bigPicture}/>
                        <button disabled={isLoading}>Змінити</button>
                    </form>
                </>
            )
        }
    }
    return (
        <>
            <div className="modal" onMouseDown={onClose}>
                <div className="modal__window" onMouseDown={(e) => e.stopPropagation()}>
                    {renderModal()}
                    <button className="close-btn" onClick={onClose}>Скасувати</button>
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