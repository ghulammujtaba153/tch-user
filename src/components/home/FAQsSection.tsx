import React, { useEffect, useState } from 'react';
import Question from './faqs/Question';
import axios from 'axios';
import { BASE_URL } from '../../config/url';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowLeft } from 'react-icons/fa';

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
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/faqs`);
        const faqsData = res.data;

        const filteredQuestions = id
          ? faqsData.questions.filter((q: FAQ) => q.category?._id === id)
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
    };
    fetchFAQs();
  }, [id]);

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
      <div className='flex items-center px-2 gap-2 cursor-pointer' onClick={() => window.history.back()}>
        <FaArrowLeft className="w-6 h-6 cursor-pointer" />
        <p className='text-sm'>Back to Categories</p>
      </div>

      <div className="flex items-center justify-center gap-2">
        <img
          src="/home-header.png"
          alt="home-header"
          loading="lazy"
          className="w-[15px] h-[10px]"
        />
        <p className="text-xs font-bold tracking-[3.5px] font-onest">
        FAQ's
        {/* {data?.subHeading} */}
        </p>
      </div>

      <h1 className="text-4xl font-bold text-center mb-5 mt-2 font-onest text-[#0033AA] ">
        {data?.questions[0]?.category?.title || 'FAQs'}
      </h1>

      <div className="w-full flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-4 px-2">
          {data.questions.map((q, index) => (
            <div key={q._id} className="h-full">
              <Question
                question={q.question}
                answer={q.answer}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQsSection;