import React, { useState, useRef } from 'react';
import { Button } from '../components/Button';
import { Camera, Upload, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { analyzeClaimImage } from '../services/geminiService';

export const Claims: React.FC = () => {
  const [step, setStep] = useState<'FORM' | 'ANALYZING' | 'RESULT'>('FORM');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!image) return;
    setStep('ANALYZING');
    
    // Remove data prefix for API
    const base64Data = image.split(',')[1];
    const analysis = await analyzeClaimImage(base64Data, description);
    
    setAiResult(analysis);
    setStep('RESULT');
  };

  if (step === 'RESULT') {
      return (
        <div className="p-6 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-green-600 w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Claim Submitted</h2>
            <p className="text-gray-500 mb-6">Our AI Adjuster has reviewed your submission.</p>
            
            <div className="bg-blue-50 text-left p-4 rounded-xl border border-blue-100 mb-8">
                <h4 className="text-blue-900 font-bold text-sm mb-2 flex items-center gap-2">
                    <SparklesIcon className="w-4 h-4"/> AI Preliminary Analysis
                </h4>
                <p className="text-blue-800 text-sm leading-relaxed">
                    {aiResult}
                </p>
            </div>

            <Button fullWidth onClick={() => {
                setStep('FORM');
                setImage(null);
                setDescription('');
            }}>Return to Dashboard</Button>
        </div>
      )
  }

  if (step === 'ANALYZING') {
      return (
          <div className="h-full flex flex-col items-center justify-center p-6">
              <Loader2 className="animate-spin text-green-600 w-12 h-12 mb-4" />
              <h3 className="text-xl font-bold text-gray-900">Analyzing Damage...</h3>
              <p className="text-gray-500 text-center mt-2">Gemini AI is assessing the uploaded photos for initial classification.</p>
          </div>
      )
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">File a Claim</h2>
      
      <div className="space-y-6">
        <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl flex gap-3 items-start">
            <AlertCircle className="text-yellow-600 shrink-0" size={20} />
            <p className="text-sm text-yellow-800">
                Ensure you are in a safe location before taking photos. Only submit claims for accidents within the active policy window.
            </p>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Accident Description</label>
            <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none min-h-[100px]"
                placeholder="Describe what happened..."
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Evidence Photo</label>
            <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-gray-500 hover:border-green-500 hover:text-green-600 transition-colors cursor-pointer bg-gray-50"
            >
                {image ? (
                    <div className="relative w-full h-48">
                        <img src={image} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
                            <span className="text-white font-medium">Tap to change</span>
                        </div>
                    </div>
                ) : (
                    <>
                        <Camera size={32} className="mb-2" />
                        <span className="text-sm font-medium">Tap to upload photo</span>
                    </>
                )}
            </div>
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
            />
        </div>

        <Button 
            fullWidth 
            onClick={handleSubmit}
            disabled={!image || !description}
        >
            Submit Claim
        </Button>
      </div>
    </div>
  );
};

const SparklesIcon = ({className}: {className?: string}) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
    </svg>
);