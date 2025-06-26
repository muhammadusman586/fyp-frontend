import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const Ratings = ({ value = 0, text, color }) => {
  // Ensure value is a number and within range
  const rating = Math.min(5, Math.max(0, Number(value) || 0));

  const fullStars = Math.floor(rating);
  const halfStars = rating - fullStars >= 0.5 ? 1 : 0;
  const emptyStars = Math.max(0, 5 - (fullStars + halfStars));

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, index) => (
        <FaStar key={index} className={`text-${color} ml-1`} />
      ))}

      {halfStars === 1 && <FaStarHalfAlt className={`text-${color} ml-1`} />}

      {[...Array(emptyStars)].map((_, index) => (
        <FaRegStar key={index} className="text-gray-800 ml-1" />
      ))}

      <span className={`rating-text text-gray-800 ml-2 text-${color}`}>{text && text}</span>
    </div>
  );
};

Ratings.defaultProps = {
  color: "yellow-500",
};

export default Ratings;
