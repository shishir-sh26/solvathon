import React, { useState, useEffect, useRef } from 'react';
import {
    Bot, AlertCircle, CheckCircle,
    ChevronRight, Brain, Clock, BarChart3, Target,
    RefreshCcw, Award, Video, Mic, MicOff, VideoOff,
    ClipboardList, Monitor, Timer, LogOut, Trophy
} from 'lucide-react';

interface Message {
    role: 'ai' | 'student';
    content: string;
}

interface MCQ {
    id: number;
    question: string;
    options: { A: string; B: string; C: string; D: string };
    correct_answer: string;
}

interface InterviewViewProps {
    studentId: string;
    studentName: string;
}

export default function InterviewView({ studentId, studentName }: InterviewViewProps) {
    const [step, setStep] = useState<'setup' | 'interview' | 'aptitude' | 'feedback'>('setup');
    const [mode, setMode] = useState<'aptitude' | 'interview'>('interview');
    const [domain, setDomain] = useState('Software Engineering');
    const [difficulty, setDifficulty] = useState('Medium');

    // Interview States
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentInput, setCurrentInput] = useState('');

    // Aptitude States
    const [aptitudeQuestions, setAptitudeQuestions] = useState<MCQ[]>([]);
    const [currentAptitudeIdx, setCurrentAptitudeIdx] = useState(0);
    const [aptitudeAnswers, setAptitudeAnswers] = useState<Record<string, string>>({});

    // Global States
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState<any>(null);

    // Media States
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [timeLeft, setTimeLeft] = useState(600); // 10 Minutes in seconds
    const videoRef = useRef<HTMLVideoElement>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Timer Effect
    useEffect(() => {
        let timer: any;
        if (step === 'interview' || step === 'aptitude') {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        if (step === 'interview') fetchInterviewFeedback();
                        else submitAptitude();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [step]);

    // Auto-scroll chat to bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    // Sync stream with video element whenever they change
    useEffect(() => {
        if (stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [stream, step]);

    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const toggleMic = () => {
        if (stream) {
            const audioTrack = stream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsMuted(!audioTrack.enabled);
            }
        }
    };

    const toggleVideo = () => {
        if (stream) {
            const videoTrack = stream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideoOff(!videoTrack.enabled);
            }
        }
    };

    const startSession = async () => {
        setIsLoading(true);
        setTimeLeft(600); // Reset timer
        try {
            // Start Backend Session
            const response = await fetch('http://127.0.0.1:8000/api/interview/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    student_id: studentId,
                    mode: mode,
                    job_role: domain,
                    difficulty: difficulty
                })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.detail || "Failed to start session");
            }

            const data = await response.json();

            if (mode === 'interview') {
                // Request Media Access for Interview (if not already granted in preview)
                try {
                    let userMedia = stream;
                    if (!userMedia) {
                        userMedia = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                        setStream(userMedia);
                    }
                    if (videoRef.current) videoRef.current.srcObject = userMedia;
                } catch (err) {
                    console.warn("Media access denied", err);
                    alert("Camera/Mic access is recommended for a realistic experience.");
                }
                setMessages([{ role: 'ai', content: data.question }]);
                setStep('interview');
            } else {
                // Fetch Aptitude Questions
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                    setStream(null);
                }
                const qRes = await fetch(`http://127.0.0.1:8000/api/interview/aptitude/questions/${studentId}`);
                if (!qRes.ok) throw new Error("Failed to fetch questions");
                const qData = await qRes.json();
                setAptitudeQuestions(qData.questions);
                setStep('aptitude');
            }
        } catch (error: any) {
            console.error(error);
            alert(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentInput.trim() || isLoading) return;

        const studentAnswer = currentInput;
        setMessages(prev => [...prev, { role: 'student', content: studentAnswer }]);
        setCurrentInput('');
        setIsLoading(true);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/interview/respond', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ student_id: studentId, answer: studentAnswer })
            });

            if (!response.ok) throw new Error("AI failed to respond");

            const data = await response.json();

            if (data.status === 'completed') {
                fetchInterviewFeedback();
            } else {
                setMessages(prev => [...prev, { role: 'ai', content: data.question }]);
            }
        } catch (error: any) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'ai', content: "I'm having trouble connecting to the network. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchInterviewFeedback = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/interview/feedback/${studentId}`);
            if (!response.ok) throw new Error("Failed to generate feedback");
            const data = await response.json();
            setFeedback(data);
            setStep('feedback');
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                setStream(null);
            }
        } catch (error) {
            console.error(error);
            alert("Session ended prematurely due to a connection error.");
            setStep('setup');
        } finally {
            setIsLoading(false);
        }
    };

    const submitAptitude = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/interview/aptitude/submit/${studentId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    questions: aptitudeQuestions,
                    answers: aptitudeAnswers
                })
            });
            if (!response.ok) throw new Error("Failed to submit test");
            const data = await response.json();
            // Format aptitude result for the feedback screen
            setFeedback({
                score: data.percentage,
                overall_critique: `You scored ${data.score}/${data.total} in the ${domain} Aptitude Test.`,
                strengths: data.details.filter((d: any) => d.correct).length > 5 ? ["Strong conceptual foundation"] : ["Participated in session"],
                weaknesses: data.details.filter((d: any) => !d.correct).length > 3 ? ["Requires more practice in specific topics"] : ["Minor errors detected"]
            });
            setStep('feedback');
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // --- RENDER: SETUP SCREEN ---
    if (step === 'setup') {
        return (
            <div className="bg-white border-4 border-black p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-w-4xl mx-auto">
                <div className="flex items-center space-x-4 mb-8 border-b-4 border-black pb-6">
                    <div className="bg-yellow-300 p-3 border-4 border-black">
                        <Monitor className="w-10 h-10" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black uppercase tracking-tight">Placement Prep Suite</h2>
                        <p className="font-bold text-gray-600 uppercase">Master your skills with AI-powered assessment.</p>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Media Preview Section */}
                    {mode === 'interview' && (
                        <div className="bg-gray-100 border-4 border-black p-4 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
                            <div className="w-full md:w-64 aspect-video bg-black border-4 border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full h-full object-cover grayscale contrast-125"
                                />
                                {!stream && (
                                    <div className="absolute inset-0 flex items-center justify-center text-white text-[10px] font-black uppercase text-center p-4">
                                        Camera Feed Off
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 space-y-3">
                                <h3 className="font-black uppercase text-lg">Camera & Mic Check</h3>
                                <p className="text-xs font-bold text-gray-600 uppercase">Ensure you are in a well-lit area and your microphone is picking up sound.</p>
                                <button
                                    onClick={async () => {
                                        try {
                                            const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                                            setStream(s);
                                            if (videoRef.current) videoRef.current.srcObject = s;
                                        } catch (err) {
                                            alert("Camera access denied. Please check your browser permissions.");
                                        }
                                    }}
                                    className="bg-black text-white px-6 py-2 font-black uppercase text-xs border-2 border-black hover:bg-yellow-300 hover:text-black transition-all"
                                >
                                    {stream ? 'Access Granted ✅' : 'Enable Camera Access'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Mode Selection */}
                    <div className="space-y-4">
                        <label className="font-black text-lg uppercase flex items-center">
                            <ClipboardList className="mr-2 w-6 h-6" /> 1. Select Mode
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                onClick={() => setMode('aptitude')}
                                className={`border-4 border-black p-6 font-black uppercase transition-all flex flex-col items-center text-center ${mode === 'aptitude' ? 'bg-black text-white' : 'hover:bg-yellow-300'
                                    }`}
                            >
                                <ClipboardList className={`w-10 h-10 mb-2 ${mode === 'aptitude' ? 'text-yellow-300' : 'text-black'}`} />
                                <span className="text-xl">Aptitude Test</span>
                                <span className="text-[10px] mt-1 opacity-70">MCQ based assessment</span>
                            </button>
                            <button
                                onClick={() => setMode('interview')}
                                className={`border-4 border-black p-6 font-black uppercase transition-all flex flex-col items-center text-center ${mode === 'interview' ? 'bg-black text-white' : 'hover:bg-blue-300'
                                    }`}
                            >
                                <Video className={`w-10 h-10 mb-2 ${mode === 'interview' ? 'text-blue-300' : 'text-black'}`} />
                                <span className="text-xl">Video Interview</span>
                                <span className="text-[10px] mt-1 opacity-70">AI-led conversational evaluation</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Domain Selection */}
                        <div className="space-y-4">
                            <label className="font-black text-lg uppercase flex items-center">
                                <Brain className="mr-2 w-6 h-6" /> 2. Select Domain
                            </label>
                            <select
                                value={domain}
                                onChange={(e) => setDomain(e.target.value)}
                                className="w-full border-4 border-black p-4 font-black uppercase bg-gray-50 focus:bg-white"
                            >
                                {['Software Engineering', 'Data Science', 'Product Management', 'Marketing', 'Finance'].map(d => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>

                        {/* Difficulty Selection */}
                        <div className="space-y-4">
                            <label className="font-black text-lg uppercase flex items-center">
                                <BarChart3 className="mr-2 w-6 h-6" /> 3. Difficulty
                            </label>
                            <div className="flex space-x-2">
                                {['Easy', 'Medium', 'Hard'].map(lvl => (
                                    <button
                                        key={lvl}
                                        onClick={() => setDifficulty(lvl)}
                                        className={`flex-1 border-4 border-black p-3 font-black uppercase text-xs transition-all ${difficulty === lvl ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'
                                            }`}
                                    >
                                        {lvl}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-10">
                    <button
                        onClick={startSession}
                        className="w-full bg-blue-600 text-white border-4 border-black p-6 font-black text-2xl uppercase tracking-widest hover:bg-black hover:text-yellow-300 transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none flex justify-center items-center"
                        disabled={isLoading}
                    >
                        {isLoading ? 'INITIALIZING...' : 'START PERFORMANCE EVALUATION'}
                        {!isLoading && <ChevronRight className="ml-3 w-8 h-8" />}
                    </button>
                </div>
            </div>
        );
    }

    // --- RENDER: INTERVIEW CHAT (WITH VIDEO) ---
    if (step === 'interview') {
        return (
            <div className="h-[80vh] flex flex-col md:flex-row bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-w-6xl mx-auto overflow-hidden">
                {/* Sidebar / Video Booth */}
                <div className="w-full md:w-80 border-b-4 md:border-b-0 md:border-r-4 border-black bg-gray-50 flex flex-col">
                    <div className="p-4 bg-black text-white font-black uppercase text-xs flex justify-between items-center">
                        <span>Interview Booth</span>
                        <div className="flex space-x-2">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-[8px] text-red-500">REC</span>
                        </div>
                    </div>

                    <div className="flex-1 p-4 flex flex-col">
                        <div className="aspect-video bg-black border-4 border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative mb-4">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover grayscale contrast-125"
                            />
                            {!stream && (
                                <div className="absolute inset-0 flex flex-center items-center justify-center text-white text-[10px] font-black uppercase p-4 text-center">
                                    Video Stream Unavailable
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="bg-white border-2 border-black p-3 font-bold text-xs">
                                <div className="flex justify-between mb-1">
                                    <span className="uppercase text-gray-500">Volume</span>
                                    <span className="text-green-600">Active</span>
                                </div>
                                <div className="h-2 bg-gray-100 border border-black overflow-hidden">
                                    <div className="h-full bg-green-500 w-3/4 animate-pulse" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={toggleMic}
                                    className={`${isMuted ? 'bg-red-600' : 'bg-black'} text-white p-2 border-2 border-black hover:bg-white hover:text-black transition-colors flex items-center justify-center`}
                                >
                                    {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                                </button>
                                <button
                                    onClick={toggleVideo}
                                    className={`${isVideoOff ? 'bg-red-600' : 'bg-black'} text-white p-2 border-2 border-black hover:bg-white hover:text-black transition-colors flex items-center justify-center`}
                                >
                                    {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border-t-2 border-black bg-yellow-50 text-[10px] font-bold">
                        <div className="flex items-center text-red-600 mb-2">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>TIME REMAINING: {formatTime(timeLeft)}</span>
                        </div>
                        <AlertCircle className="w-4 h-4 mb-1" />
                        Maintain eye contact with the camera and speak clearly. The AI is analyzing your posture and tone.
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="bg-white p-4 border-b-4 border-black flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-yellow-300 border-2 border-black flex items-center justify-center mr-2">
                                <Bot className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-black text-sm uppercase">{domain} Interview</h3>
                                <span className="text-[10px] font-bold text-blue-600 uppercase">Status: AI Evaluating</span>
                            </div>
                        </div>
                        <button
                            onClick={() => fetchInterviewFeedback()}
                            className="bg-red-600 text-white font-black uppercase text-[10px] px-3 py-1 border-2 border-black"
                        >
                            End Session
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white custom-scrollbar">
                        {messages.map((m, idx) => (
                            <div key={idx} className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                                <div className={`max-w-[85%] p-4 border-2 border-black font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${m.role === 'ai' ? 'bg-gray-100' : 'bg-blue-600 text-white'
                                    }`}>
                                    {m.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start italic text-xs font-black animate-pulse uppercase">
                                AI is typing...
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    <div className="p-4 border-t-4 border-black bg-yellow-300">
                        <form onSubmit={handleSendMessage} className="flex space-x-2">
                            <input
                                value={currentInput}
                                onChange={(e) => setCurrentInput(e.target.value)}
                                placeholder="Talk to the recruiter..."
                                className="flex-1 border-2 border-black p-3 font-black uppercase focus:outline-none"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-black text-white px-6 font-black uppercase border-2 border-black hover:bg-white hover:text-black transition-all"
                            >
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    // --- RENDER: APTITUDE TEST ---
    if (step === 'aptitude') {
        const currentQ = aptitudeQuestions[currentAptitudeIdx];
        return (
            <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-w-4xl mx-auto overflow-hidden">
                <div className="bg-black text-white p-6 flex justify-between items-center">
                    <div>
                        <h2 className="font-black text-2xl uppercase">{domain} Aptitude</h2>
                        <span className="text-yellow-300 text-xs font-black uppercase">Level: {difficulty}</span>
                    </div>
                    <div className="text-right flex flex-col items-end">
                        <div className="font-black text-3xl">Question {currentAptitudeIdx + 1}/10</div>
                        <div className="flex items-center text-yellow-300 font-bold text-sm">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatTime(timeLeft)}
                        </div>
                    </div>
                </div>

                <div className="p-8 md:p-12 min-h-[400px]">
                    {currentQ ? (
                        <div className="animate-in slide-in-from-right duration-300">
                            <h3 className="text-2xl font-black mb-8 leading-tight uppercase">
                                {currentQ.question}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(currentQ.options).map(([key, val]) => (
                                    <button
                                        key={key}
                                        onClick={() => setAptitudeAnswers(prev => ({ ...prev, [currentQ.id]: key }))}
                                        className={`border-4 border-black p-6 font-black text-left flex items-center transition-all ${aptitudeAnswers[currentQ.id] === key ? 'bg-yellow-300 translate-x-1 translate-y-1 shadow-none' : 'hover:bg-gray-100 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
                                            }`}
                                    >
                                        <span className="w-8 h-8 flex items-center justify-center border-2 border-black mr-4 bg-white">{key}</span>
                                        <span className="uppercase">{val}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 uppercase font-black">
                            <div className="w-16 h-16 border-4 border-black border-t-yellow-300 animate-spin rounded-full mb-4" />
                            Generating Questions...
                        </div>
                    )}
                </div>

                <div className="p-6 border-t-4 border-black flex justify-between bg-gray-50">
                    <button
                        onClick={() => setCurrentAptitudeIdx(prev => Math.max(0, prev - 1))}
                        disabled={currentAptitudeIdx === 0}
                        className="border-2 border-black px-8 py-2 font-black uppercase hover:bg-black hover:text-white transition-colors disabled:opacity-30"
                    >
                        Previous
                    </button>
                    {currentAptitudeIdx < 9 ? (
                        <button
                            onClick={() => setCurrentAptitudeIdx(prev => prev + 1)}
                            className="bg-black text-white px-12 py-2 font-black uppercase border-2 border-black hover:bg-yellow-300 hover:text-black transition-all"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            onClick={submitAptitude}
                            className="bg-green-500 text-white px-12 py-2 font-black uppercase border-2 border-black hover:bg-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                        >
                            Finish Test
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // --- RENDER: FEEDBACK SCREEN ---
    if (step === 'feedback') {
        return (
            <div className="bg-white border-4 border-black p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-w-4xl mx-auto space-y-8 animate-in zoom-in duration-300">
                <div className="border-b-4 border-black pb-6 text-center">
                    <div className="inline-block bg-green-400 p-2 border-4 border-black mb-4 animate-bounce">
                        <Award className="w-12 h-12" />
                    </div>
                    <h2 className="text-4xl font-black uppercase tracking-tight">Performance Report</h2>
                    <p className="font-bold text-gray-600 uppercase mt-2">Candidate: {studentName} | {domain}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 border-4 border-black bg-black p-2 flex flex-col">
                        <div className="bg-black text-white font-black uppercase text-[10px] p-2 flex justify-between items-center">
                            <span>Recruiters Eye View</span>
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                        </div>
                        <div className="flex-1 aspect-video bg-gray-900 overflow-hidden relative border-2 border-white">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover grayscale contrast-125"
                            />
                            {!stream && (
                                <div className="absolute inset-0 flex items-center justify-center text-white text-[8px] font-black uppercase p-4 text-center">
                                    Final Review Feed
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="md:col-span-1 bg-black text-white p-6 flex flex-col items-center justify-center border-4 border-black text-center box-content">
                        <span className="text-[12px] font-black uppercase mb-1 text-yellow-300">Score</span>
                        <div className="text-7xl font-black">{Math.round(feedback?.score || 0)}%</div>
                    </div>
                    <div className="md:col-span-1 bg-yellow-100 border-4 border-black p-6 relative">
                        <div className="absolute -top-4 left-6 bg-black text-white px-3 py-1 text-xs font-black uppercase text-center">Critique</div>
                        <p className="font-bold text-sm italic text-black leading-relaxed mt-2 text-center">
                            "{feedback?.overall_critique}"
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="border-4 border-black p-6 bg-green-50">
                        <h4 className="font-black uppercase text-lg border-b-2 border-black pb-2 mb-4 flex items-center text-green-700">
                            <CheckCircle className="w-5 h-5 mr-2" /> Strengths
                        </h4>
                        <ul className="space-y-3">
                            {(feedback?.strengths || []).map((s: string, i: number) => (
                                <li key={i} className="flex items-start font-bold text-xs uppercase">
                                    <span className="mr-2">⚡</span> {s}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="border-4 border-black p-6 bg-red-50">
                        <h4 className="font-black uppercase text-lg border-b-2 border-black pb-2 mb-4 flex items-center text-red-700">
                            <Target className="w-5 h-5 mr-2" /> Improvements
                        </h4>
                        <ul className="space-y-3">
                            {(feedback?.weaknesses || []).map((w: string, i: number) => (
                                <li key={i} className="flex items-start font-bold text-xs uppercase">
                                    <span className="mr-2">🎯</span> {w}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t-4 border-black flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                    <button
                        onClick={() => setStep('setup')}
                        className="flex-1 bg-yellow-300 border-4 border-black p-4 font-black text-lg uppercase flex items-center justify-center hover:bg-black hover:text-yellow-300 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                    >
                        <RefreshCcw className="w-6 h-6 mr-3" /> New Session
                    </button>
                </div>
            </div>
        );
    }

    return null;
}
