import React, { useEffect, useState } from 'react';
import Question from './faqs/Question';
import axios from 'axios';
import { BASE_URL } from '../../config/url';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

interface FAQ {
  _id: string;
  category: {
    _id: string;
    title: string;
  };
  question: string;
  answer: string;
}

interface FAQsData {
  heading: string;
  subHeading: string;
  questions: FAQ[];
}

const FAQsSection: React.FC = () => {
    const [data, setData] = useState<FAQsData>({
      heading: '',
      subHeading: '',
      questions: []
    });
    const [loading, setLoading] = useState(true);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        const fetchFAQs = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/faqs`);
                const faqsData = res.data;
                
                // Filter questions by category ID if ID exists in route
                const filteredQuestions = id 
                  ? faqsData.questions.filter(
                      (q: FAQ) => q.category?._id === id
                    )
                  : faqsData.questions;

                setData({
                  ...faqsData,
                  questions: filteredQuestions
                });
                
            } catch (error) {
                console.error(error);
                toast.error("Failed to fetch FAQs");
            } finally {
                setLoading(false);
            }
        }
        fetchFAQs();
    }, [id]); // Add id to dependency array to refetch when id changes

    if (loading) {
        return (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        );
    }

    if (id && data.questions.length === 0) {
        return (
          <div className="max-w-[1200px] mx-auto py-16 text-center">
            <p className="text-lg">No questions found for this category.</p>
          </div>
        );
    }
    
    return (
        <div className="max-w-[1200px] mx-auto py-16 flex flex-col gap-2">
            <div className="flex items-center justify-center gap-2">
                <img 
                    src="/home-header.png" 
                    alt="home-header" 
                    loading="lazy"
                    className="w-[15px] h-[10px]" 
                />
                <p className="text-xs font-bold tracking-[3.5px] font-onest">
                    {data?.heading}
                </p>   
            </div>
            <h1 className='text-4xl font-bold text-center mb-4 font-onest'>
                {data?.subHeading}
            </h1>

            <div className='flex justify-center flex-col md:flex-row gap-4'>
                {/* image section */}
                <div className="flex flex-col gap-4 w-full lg:w-1/2">
                    <div className="flex items-center justify-center lg:justify-end">
                        <img 
                        src="/chooseUs-1.png" 
                        alt="chooseus-1" 
                        className="w-full max-w-[350px] md:max-w-[480px] h-auto rounded-[20px]" 
                        />
                    </div>
                    
                    <img 
                        src="/chooseUs-2.png" 
                        alt="chooseus-2" 
                        className="w-full max-w-[300px] md:max-w-[412px] h-auto mt-[-50px] md:mt-[-100px] rounded-[20px] border-[8px] md:border-[15px] border-white self-start md:self-auto" 
                    />
                </div>

                {/* Question section */}
                <div className='flex flex-col gap-4 w-full lg:w-1/2 px-2'>
                    {data?.questions?.map((question) => (
                        <Question 
                            key={question._id} 
                            question={question.question} 
                            answer={question.answer} 
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FAQsSection;