import { useState, useEffect } from 'react';

import useDB from '../../services/useDB';
import Modal from './modal/Modal';

import editIcon from '../../../src/sources/img/edit.svg';
import addIcon from '../../../src/sources/img/add.svg';
import addBlackIcon from '../../../src/sources/img/add_black.svg';
import shippingIcon from '../../../src/sources/img/shipping.svg';
import uploadIcon from '../../../src/sources/img/upload.svg';
import imageIcon from '../../../src/sources/img/image.svg';
import starIcon from '../../../src/sources/img/star.svg';

function App() {

  const [showModal, setShowModal] = useState(false);
  const [action, setAction] = useState();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState();
  const [banners, setBanners] = useState();
  const [changedCategories, setChangedCategories] = useState(false);
  const [changedProducts, setChangedProducts] = useState(false);
  const [changedOrders, setChangedOrders] = useState(false);
  const [changedBanners, setChangedBanners] = useState(false);

  const { makeQuery } = useDB();

  useEffect(() => {
    makeQuery('categories/').then(data => setCategories(data));
    //eslint-disable-next-line
  }, [changedCategories]);

  useEffect(() => {
    makeQuery('products/').then(data => setProducts(data));
    //eslint-disable-next-line
  }, [changedProducts]);

  useEffect(() => {
    makeQuery('orders/').then(data => setOrders(data));
    //eslint-disable-next-line
  }, [changedOrders]);

  useEffect(() => {
    makeQuery('banners/').then(data => setBanners(data));
    //eslint-disable-next-line
  }, [changedBanners]);
 
  const handleCloseModal = () => {
    setShowModal(false);
  }

  const onChanged = (type) => {
    if (type.includes('categories/')) {
      setChangedCategories(!changedCategories);
    } else if (type.includes('products/')) {
      setChangedProducts(!changedProducts);
    } else if (type.includes('orders/')) {
      setChangedOrders(!changedOrders);
    } else if (type.includes('banners/')) {
      setChangedBanners(!changedBanners);
    }
  }
  
  return (
    <>
      <h1>Керування інтернет-магазином</h1>
      <div className="container">
        {btnsData.map((btn, index) => (
          <div 
            key={index} 
            className={`func-btn ${btn.accent ? 'func-btn_accent' : ''}`}
            onClick={() => { setAction(btn.action); setShowModal(true) }}>
            <img src={btn.icon} alt="" />
            <h2>{btn.title}</h2>
            <p>{btn.description}</p>
          </div>
        ))}
      </div>

      {showModal && 
       <Modal action={action} 
              onClose={handleCloseModal} 
              categories={categories} 
              handleChanged={onChanged} 
              products={products} 
              orders={orders}
              banners={banners} 
      />}
    </>
  );
}

export default App;


const btnsData = [
  {
    icon: addIcon,
    title: "Добавити категорію",
    description: "Щоб добавити нову категорію - необхідно завантажити фото та увести назву",
    accent: true,
    action: 'addCategory'
  },
  {
    icon: addBlackIcon,
    title: "Добавити продукт",
    description: "Щоб добавити продукт - необхідно мати як мінімум одне фото + увести усі необхідні дані та характеристики",
    accent: false,
    action: 'addProduct'
  },
  {
    icon: editIcon,
    title: "Редагувати категорію",
    description: "Щоб редагувати категорію - необхідно завантажити нове фото (якщо потрібно замінити) за допомогою кнопки 'Завантажити зображення' та скопіювати посилання",
    accent: false,
    action: 'editCategory'
  },
  {
    icon: editIcon,
    title: "Редагувати продукт",
    description: "Для редагування продукту, у разі зміни будь якого із зображень - виконати кроки аналогічні до категорії. Також звернути увагу, що категорії оновлюються",
    accent: false,
    action: 'editProduct'
  },
  {
    icon: shippingIcon,
    title: "Замовлення",
    description: "Керування замовленнями, зміна статусу замовлення, добавлення ТТН, що також буде відображатись у кабінеті замовника",
    accent: true,
    action: 'order'
  },
  {
    icon: imageIcon,
    title: "Керування банерами",
    description: "Добавити/змінити/видалити банер, що відображається на головній сторінці сайту",
    accent: false,
    action: 'banner',
  },
  {
    icon: starIcon,
    title: "Модерація відгуків",
    description: "Відгуки користувачів відображаються на сайті лише після модерації",
    accent: true,
    action: 'feedback'
  },
  {
    icon: uploadIcon,
    title: "Завантажити зображення",
    description: "При редагуванні продукту чи категорії, щоб замінити будь яке зображення - необхідно надати посилання на нове. Саме тут можна завантажити зображення та отримати посилання для нього",
    accent: false,
    action: 'upload'
  },
];