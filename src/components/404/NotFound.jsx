import { Link } from 'react-router-dom';

import './notFound.scss';

const NotFound = () => {
    return (
        <div className='not-found-container'>
            <p className='not-found-container__emoji'>🤖</p>
            <h1>404 - Сторінка не знайдена</h1>
            <p>На жаль, сторінка, яку ви шукаєте, не існує.</p>
            <Link to='/'>Повернутися на головну</Link>
        </div>
    );
};

export default NotFound;
