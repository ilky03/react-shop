import { Link } from "react-router-dom";
import { useState } from "react";

function CategoryCard({title, id, photoUrl}) {
    const [isLoaded, setIsLoaded] = useState(false);

    const handleImageLoaded = () => {
        setIsLoaded(true);
    };

    return (
        <Link to={`/category/${id}`}>
            <div className="categories__card">
                {!isLoaded && <div className="skeleton-wrapper"><div className="skeleton"></div></div>}
                <img className={`${isLoaded ? '' : 'hide'}`} onLoad={handleImageLoaded}  src={photoUrl} alt={title} />
                <p>{title}</p>
            </div>
        </Link>
    )
}

export default CategoryCard;