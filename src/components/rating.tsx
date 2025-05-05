export default function Rating({ rating, count }: { rating: number; count?: number }) {
  // Redondear a 0.5 más cercano para estrellas
  const roundedRating = Math.round(rating * 2) / 2;
  const fullStars = Math.floor(roundedRating);
  const halfStar = roundedRating % 1 !== 0;
  
  return (
    <div className="flex items-center">
      <div className="flex text-yellow-400 mr-2">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-lg">
            {i < fullStars ? (
              "★"
            ) : i === fullStars && halfStar ? (
              "★½"
            ) : (
              "☆"
            )}
          </span>
        ))}
      </div>
      <span className="text-gray-700">{rating.toFixed(1)}/5</span>
      {count !== undefined && (
        <span className="text-xs text-gray-500 ml-1">({count} {count === 1 ? 'valoración' : 'valoraciones'})</span>
      )}
    </div>
  );
}