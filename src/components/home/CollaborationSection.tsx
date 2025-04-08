// import React from 'react';

// const CollaborationSection: React.FC = () => {
//   return (
//     <section className="w-full py-16 text-black">
//       <div className="flex flex-col items-center justify-center gap-10">
//         <p className="text-sm font-bold">
//           We Collaborate with the top 200+ companies worldwide
//         </p>

//         <div className="relative flex items-center justify-between w-[90%]">
//           {/* Gradient Overlay */}
//           <div className="absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-white to-transparent"></div>
//           <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-white to-transparent"></div>

//           {/* Company Logos */}
//           <img src="/collaborate-1.png" alt="logo" width={200} height={200} />
//           <img src="/collaborate-1.png" alt="logo" width={200} height={200} />
//           <img src="/collaborate-1.png" alt="logo" width={200} height={200} />
//           <img src="/collaborate-1.png" alt="logo" width={200} height={200} />
//         </div>
//       </div>
//     </section>
//   );
// };

// export default CollaborationSection;



import React from 'react';

const CollaborationSection: React.FC = () => {
  return (
    <section className="max-w-[1200px] mx-auto py-6 font-onest text-black">
      <div className="flex flex-col items-center justify-center gap-10">
        <p className="text-xs md:text-base lg:text-lg text-gray-500 text-center">
          We Collaborate with the top <span className='text-black font-bold'>200+</span> companies worldwide
        </p>

        <div className="relative flex flex-wrap justify-between items-center gap-6 w-[90%] max-w-6xl">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 h-full w-16 sm:w-24 bg-gradient-to-r from-bg to-transparent"></div>
          <div className="absolute right-0 top-0 h-full w-16 sm:w-24 bg-gradient-to-l from-bg to-transparent"></div>

          {/* Company Logos */}
          <img src="/collaborate-1.png" alt="logo" className="w-24 sm:w-32 md:w-40 lg:w-48" />
          <img src="/collaborate-1.png" alt="logo" className="w-24 sm:w-32 md:w-40 lg:w-48" />
          <img src="/collaborate-1.png" alt="logo" className="w-24 sm:w-32 md:w-40 lg:w-48" />
          <img src="/collaborate-1.png" alt="logo" className="w-24 sm:w-32 md:w-40 lg:w-48" />
          
        </div>
      </div>
    </section>
  );
};

export default CollaborationSection;
