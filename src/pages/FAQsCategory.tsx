import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { BASE_URL } from '../config/url';
import CategoryCard from '../components/faqs/CategoryCard';
import Loading from '../components/Loading';
import ScrollToTop from '../utils/ScrollToTop';
import { useAppConfig } from '../context/AppConfigContext';

interface Category {
  _id: string;
  title: string;
  icon: string;
  active: boolean;
  questionCount?: number;
}

const FAQsCategory = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const { config } = useAppConfig();


  useEffect(() => {
    if (config?.name) {
      document.title = `FAQsCategory | ${config.name}`;
    }
  }, [config]);

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/faqs/categories?active=true`);
            const faqsRes = await axios.get(`${BASE_URL}/faqs`);
            
            // Count questions per category
            const categoriesWithCount = res.data.map((category: Category) => {
              const questionCount = faqsRes.data.questions.filter(
                (q: any) => q.category._id === category._id
              ).length;
              return { ...category, questionCount };
            });
            
            setCategories(categoriesWithCount);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    if (loading) {
        return <Loading/>
    }

    return (
        <div className='mt-[100px] flex flex-col items-center justify-center p-4 max-w-6xl mx-auto max-w-[1200px] mx-auto'>
            <ScrollToTop />
            <div className="w-full flex items-center justify-center gap-2 mb-10">
                <img src="/home-header.png" alt="home-header" className="w-[20px] h-[15px]" />
                <p className="text-sm font-normal leading-[15px] text-[#000000] tracking-[3.5px]">
                FAQ's CATEGORIES
                </p>
            </div>
            <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6'>
                {categories.map((category) => (
                    <CategoryCard 
                        key={category._id} 
                        category={category}
                    />
                ))}
            </div>
        </div>
    )
}

export default FAQsCategory;