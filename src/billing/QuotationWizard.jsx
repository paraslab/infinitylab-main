import { useState } from "react";
import Step1Header from "./steps/Step1Header";
import Step2Items from "./steps/Step2Items";
import Step3Calculate from "./steps/Step3Calculate";
import Step4Footer from "./steps/Step4Footer";
import Step5Finalize from "./steps/Step5Finalize";

export default function QuotationWizard() {
  const [step, setStep] = useState(1);
  const [headerId, setHeaderId] = useState(null);

  const steps = ["Header", "Items", "Calculate", "Footer", "Finalize"];

  return (
    <div className="max-w-6xl mx-0 space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Create Quotation / Invoice
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Complete all steps to generate final PDF.
        </p>
      </div>

      {/* Steps (NOT CLICKABLE) */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {steps.map((label, i) => {
            const id = i + 1;
            const active = step === id;
            const done = step > id;

            return (
              <div
                key={id}
                className={`min-w-[140px] px-4 py-2.5 rounded-lg text-sm font-semibold border whitespace-nowrap text-center
                  ${
                    active
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : done
                      ? "bg-slate-100 text-slate-800 border-slate-200"
                      : "bg-white text-slate-400 border-slate-200"
                  }
                `}
              >
                {id}. {label}
              </div>
            );
          })}
        </div>

        {/* Progress */}
        <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-2 bg-indigo-600 transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div>
        {step === 1 && (
          <Step1Header setStep={setStep} setHeaderId={setHeaderId} />
        )}
        {step === 2 && <Step2Items headerId={headerId} setStep={setStep} />}
        {step === 3 && (
          <Step3Calculate headerId={headerId} setStep={setStep} />
        )}
        {step === 4 && <Step4Footer headerId={headerId} setStep={setStep} />}
        {step === 5 && <Step5Finalize headerId={headerId} />}
      </div>
    </div>
  );
}
