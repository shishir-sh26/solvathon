import React, { useRef, useState, useEffect } from 'react';
import { Camera, Video, MessageCircle, RefreshCw } from 'lucide-react';

const VirtualInterview: React.FC = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsCameraActive(true);
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto bg-gray-50 min-h-screen">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Virtual Mock Interview</h1>
                <p className="text-gray-600 mt-2">AI-powered body language and sentiment analysis.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Webcam Panel */}
                <div className="lg:col-span-2 bg-black rounded-3xl overflow-hidden aspect-video relative group border-4 border-white shadow-2xl">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    {!isCameraActive && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-gray-900">
                            <Camera size={48} className="mb-4 opacity-50" />
                            <button onClick={startCamera} className="px-6 py-2 bg-primary-600 rounded-lg font-bold hover:bg-primary-700 transition">Enable Camera</button>
                        </div>
                    )}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 opacity-0 group-hover:opacity-100 transition">
                        <button onClick={() => setIsRecording(!isRecording)} className={`w-12 h-12 rounded-full flex items-center justify-center ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-white text-gray-900'}`}>
                            <Video size={24} />
                        </button>
                    </div>
                </div>

                {/* Feedback Panel */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                            <MessageCircle size={20} className="text-primary-600" /> Real-time Analysis
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                                <span className="text-sm font-medium text-gray-500">Confidence</span>
                                <span className="text-sm font-bold text-green-600">82%</span>
                            </div>
                            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                                <span className="text-sm font-medium text-gray-500">Eye Contact</span>
                                <span className="text-sm font-bold text-yellow-600">Improving</span>
                            </div>
                            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                                <span className="text-sm font-medium text-gray-500">Micro-expressions</span>
                                <span className="text-sm font-bold text-primary-600">Calm</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
                            <RefreshCw size={20} className="text-gray-400" /> Current Question
                        </h3>
                        <p className="text-sm text-gray-600">"Explain a difficult situation you faced in a team and how you resolved it."</p>
                        <button className="mt-4 text-xs font-bold text-primary-600 uppercase hover:underline">Next Question</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VirtualInterview;
