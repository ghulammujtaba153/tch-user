import React from 'react';
import Question from './faqs/Question';

const FAQsSection: React.FC = () => {
    const questions = [
        {
            question: "What is the purpose of this website?",
            answer: "The purpose of this website is to provide a platform for people to donate to charities."
        },
        {
            question: "What is the purpose of this website?",
            answer: "The purpose of this website is to provide a platform for people to donate to charities."
        },
        {
            question: "What is the purpose of this website?",
            answer: "The purpose of this website is to provide a platform for people to donate to charities."
        },
        {
            question: "What is the purpose of this website?",
            answer: "The purpose of this website is to provide a platform for people to donate to charities."
        },
        {
            question: "What is the purpose of this website?",
            answer: "The purpose of this website is to provide a platform for people to donate to charities."
        }

    ]
  return (
    <div className="max-w-[1200px] mx-auto py-16 flex flex-col gap-2">
        <div className="flex items-center justify-center gap-2 ">
            <img 
                src="/home-header.png" 
                alt="home-header" 
                className="w-[15px] h-[10px]" 
            />
            <p className="text-xs font-bold tracking-[3.5px] font-onest">FAQ's</p>   
        </div>
        <h1 className='text-4xl font-bold text-center mb-4 font-onest'>Have Any Questions For Us?</h1>

        <div className='flex justify-center flex-col md:flex-row gap-4'>
            {/* image section  */}
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
            <div className='flex flex-col gap-4 w-full lg:w-1/2 px-2' >
                {questions.map((question, index) => (
                    <Question key={index} question={question.question} answer={question.answer} />
                ))}
                
            </div>
        </div>
    </div>
  );
};

export default FAQsSection;


