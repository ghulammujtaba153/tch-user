import React from 'react'
import { Link } from 'react-router-dom';
import ReactGA from 'react-ga4';

interface CategoryCardProps {
  category: {
    _id: string;
    title: string;
    icon: string;
    active: boolean;
    questionCount?: number;
  };
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {

  ReactGA.event({
    category: 'FAQs',
    action: 'Category Clicked',
    label: category.title,
  })
  return (
    <Link 
      to={`/faqs/category/${category._id}`}
      className="block bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg"

    >
      <div className="p-6">
        <div className="flex flex-col gap-4 items-center mb-4">
          
          <h3 className="text-xl font-semibold text-gray-800">
            {category.title}
          </h3>
          {category.icon && (
            <img 
              src={category.icon} 
              alt={category.title} 
              className="w-12 h-12 object-cover rounded-full mr-4"
            />
          )}
        </div>
        
        <div className="flex justify-between items-center">
          
          <span className="text-gray-600">
            {category.questionCount || 0} questions
          </span>
        </div>
      </div>
    </Link>
  )
}

export default CategoryCard;