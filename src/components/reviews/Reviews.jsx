import { useState, useContext } from 'react';

import { AppContext } from '../context/AppContext';

import { toast } from 'react-toastify';

import starIcon from '../../sources/product-page/star.svg';
import filledStarIcon from '../../sources/product-page/starFilled.svg';
import halfStarIcon from '../../sources/product-page/starHalf.svg';

import useDB from '../../services/useDB';

function Reviews ({productData}) {
  const ratingArr = productData.rating;
  const numberReviews = ratingArr.length;
  const totalRating = ratingArr.reduce((sum, item) => sum + item.rating, 0);
  const averageRating = totalRating / numberReviews;
  
  const [hoverRating, setHoverRating] = useState(0);
  const [currentRating, setCurrentRating] = useState(!isNaN(averageRating) ? averageRating : 0);
  
  const { profileData } = useContext(AppContext);

  const { updateProductRating } = useDB();

  let caption = 'відгуків';
  if (numberReviews === 1) {
      caption = 'відгук';
  } else if (numberReviews === 2 || numberReviews === 3 || numberReviews === 4) {
      caption = 'відгуки';
  }

  const handleMouseEnter = (index) => {
    setHoverRating(index + 1);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const handleClick = async (index) => {
    const newRating = index + 1;
    if (profileData && profileData.id) {
      setCurrentRating(newRating);
      await updateProductRating(productData.id, profileData.id, newRating);
    } else {
      toast.info('Тільки для зареєстрованих користувачів!');
    }
  };

  const getStars = (ratingValue) => {
    const fullStars = Math.floor(ratingValue);
    const hasHalfStar = ratingValue % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
    const stars = [];
    console.log(ratingValue)
    if (ratingValue === 0) {
      for (let i = 0; i < 5; i++) {
        stars.push(<img key={stars.length} src={starIcon} alt="" />);
      }
      return stars;
    }
    for (let i = 0; i < fullStars; i++) {
        stars.push(<img key={i} src={filledStarIcon} alt="" />);
    }

    if (hasHalfStar) {
        stars.push(<img key={stars.length} src={halfStarIcon} alt="" />);
    }

    for (let i = 0; i < emptyStars; i++) {
        stars.push(<img key={stars.length} src={starIcon} alt="" />);
    }
    return stars;
  };

  const starsToDisplay = hoverRating > 0 ? hoverRating : currentRating;

  return (
    <>
      <div>
        {getStars(starsToDisplay).map((star, index) => (
          <span 
            key={index}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(index)}
            style={{ cursor: 'pointer' }}
          >
            {star}
          </span>
        ))}
      </div>
      <p>{`${numberReviews} ${caption}`}</p>
    </>
  );
};

export default Reviews;
