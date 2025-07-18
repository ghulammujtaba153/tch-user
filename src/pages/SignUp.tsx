import { useState } from "react";
import PersonalInfoStep from "../components/signup steps/PersonalInfoStep";
import OrganizationStep from "../components/signup steps/OrganizationStep";
import VerificationStep from "../components/signup steps/VerificationStep";
import Success from "../components/signup steps/Success";

const steps = [
  { label: "Personal Info" },
  { label: "Verification" },
  { label: "Organization" },
  { label: "Success" },
];

const SignUp = () => {
  const [currentStep, setCurrentStep] = useState(0);

  // Central state to store all signup info
  const [signupData, setSignupData] = useState<any>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    wantsOrganization: false,
  });

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 0));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen my-[80px] px-4 sm:px-6 lg:px-8">
      {/* Progress Bar */}
      <div className="w-full max-w-md mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((step, idx) => (
            <span
              key={step.label}
              className={`text-xs font-semibold ${
                idx <= currentStep ? "text-blue-600" : "text-gray-400"
              }`}
            >
              {step.label}
            </span>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step Content */}
      <div className="w-full max-w-md">
        {currentStep === 0 && (
          <PersonalInfoStep
            data={signupData}
            setData={setSignupData}
            onNext={goNext}
          />
        )}
        {currentStep === 1 && (
          <VerificationStep
            data={signupData}
            setData={setSignupData} // ✅ This ensures we store backend response if needed
            onNext={goNext}
            onBack={goBack}
          />
        )}
        {currentStep === 2 && (
          <OrganizationStep
            data={signupData}
            setData={setSignupData}
            onNext={goNext}
            onBack={goBack}
          />
        )}
        {currentStep === 3 && <Success data={signupData} />}
      </div>
    </div>
  );
};

export default SignUp;
