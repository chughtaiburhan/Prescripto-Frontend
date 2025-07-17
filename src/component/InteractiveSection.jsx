import React, { useEffect, useRef, useState } from "react";

const testimonials = [
    {
        tip: "Cough Relief: Stay hydrated, use a humidifier, and try warm honey-lemon tea to soothe your throat. If cough persists, consult a doctor.",
        image: (
            <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="70" cy="120" rx="55" ry="15" fill="#fff" fillOpacity="0.18" />
                <circle cx="70" cy="60" r="45" fill="#fff" fillOpacity="0.25" />
                <ellipse cx="70" cy="80" rx="30" ry="10" fill="#99aaff" fillOpacity="0.3" />
                <circle cx="70" cy="60" r="28" fill="#5f6FFF" />
                <ellipse cx="70" cy="60" rx="18" ry="24" fill="#fff" fillOpacity="0.7" />
                <ellipse cx="70" cy="60" rx="10" ry="14" fill="#5f6FFF" />
                {/* Animated cough cloud */}
                <ellipse cx="110" cy="60" rx="10" ry="6" fill="#fff" fillOpacity="0.8">
                    <animateTransform attributeName="transform" type="translate" values="0;8;0" dur="1.2s" repeatCount="indefinite" />
                </ellipse>
                <ellipse cx="120" cy="62" rx="5" ry="3" fill="#fff" fillOpacity="0.6">
                    <animateTransform attributeName="transform" type="translate" values="0;12;0" dur="1.2s" repeatCount="indefinite" />
                </ellipse>
            </svg>
        ),
    },
    {
        tip: "Fever Care: Rest, drink plenty of fluids, and use a cool compress. Monitor your temperature and seek medical advice if it remains high.",
        image: (
            <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="70" cy="120" rx="55" ry="15" fill="#fff" fillOpacity="0.18" />
                <circle cx="70" cy="60" r="45" fill="#fff" fillOpacity="0.25" />
                <ellipse cx="70" cy="80" rx="30" ry="10" fill="#99aaff" fillOpacity="0.3" />
                <circle cx="70" cy="60" r="28" fill="#e53e3e" />
                <rect x="65" y="40" width="10" height="40" rx="5" fill="#fff" fillOpacity="0.7" />
                {/* Animated thermometer mercury */}
                <rect x="68" y="75" width="4" height="15" rx="2" fill="#5f6FFF">
                    <animate attributeName="height" values="15;5;15" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="y" values="75;85;75" dur="1.5s" repeatCount="indefinite" />
                </rect>
                <circle cx="70" cy="92" r="6" fill="#5f6FFF" />
            </svg>
        ),
    },
    {
        tip: "Headache Help: Rest in a quiet, dark room, stay hydrated, and use a cold pack. Persistent headaches should be evaluated by a healthcare provider.",
        image: (
            <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="70" cy="120" rx="55" ry="15" fill="#fff" fillOpacity="0.18" />
                <circle cx="70" cy="60" r="45" fill="#fff" fillOpacity="0.25" />
                <ellipse cx="70" cy="80" rx="30" ry="10" fill="#99aaff" fillOpacity="0.3" />
                <circle cx="70" cy="60" r="28" fill="#5f6FFF" />
                {/* Animated headache lines */}
                <rect x="60" y="30" width="4" height="16" rx="2" fill="#e53e3e">
                    <animateTransform attributeName="transform" type="translate" values="0 0;0 -6;0 0" dur="1s" repeatCount="indefinite" />
                </rect>
                <rect x="76" y="30" width="4" height="16" rx="2" fill="#e53e3e">
                    <animateTransform attributeName="transform" type="translate" values="0 0;0 -6;0 0" dur="1s" repeatCount="indefinite" />
                </rect>
            </svg>
        ),
    },
    {
        tip: "Stomach Ache: Eat light, bland foods, avoid dairy, and stay hydrated. If pain is severe or persistent, consult your doctor.",
        image: (
            <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="70" cy="120" rx="55" ry="15" fill="#fff" fillOpacity="0.18" />
                <circle cx="70" cy="60" r="45" fill="#fff" fillOpacity="0.25" />
                <ellipse cx="70" cy="80" rx="30" ry="10" fill="#99aaff" fillOpacity="0.3" />
                <circle cx="70" cy="60" r="28" fill="#5f6FFF" />
                {/* Animated stomach swirl */}
                <path d="M70 60c10 0 10 10 0 10s-10 10 0 10" stroke="#e53e3e" strokeWidth="3" fill="none">
                    <animate attributeName="stroke-dashoffset" values="0;20;0" dur="1.2s" repeatCount="indefinite" />
                </path>
            </svg>
        ),
    },
    {
        tip: "Allergy Advice: Keep windows closed during high pollen, use air purifiers, and take antihistamines as prescribed. See a doctor for severe symptoms.",
        image: (
            <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="70" cy="120" rx="55" ry="15" fill="#fff" fillOpacity="0.18" />
                <circle cx="70" cy="60" r="45" fill="#fff" fillOpacity="0.25" />
                <ellipse cx="70" cy="80" rx="30" ry="10" fill="#99aaff" fillOpacity="0.3" />
                <circle cx="70" cy="60" r="28" fill="#5f6FFF" />
                {/* Animated allergy dots */}
                <circle cx="60" cy="70" r="3" fill="#e53e3e">
                    <animateTransform attributeName="transform" type="scale" values="1;1.3;1" dur="1.1s" repeatCount="indefinite" />
                </circle>
                <circle cx="80" cy="65" r="2" fill="#e53e3e">
                    <animateTransform attributeName="transform" type="scale" values="1;1.3;1" dur="1.1s" repeatCount="indefinite" />
                </circle>
                <circle cx="75" cy="80" r="2.5" fill="#e53e3e">
                    <animateTransform attributeName="transform" type="scale" values="1;1.3;1" dur="1.1s" repeatCount="indefinite" />
                </circle>
            </svg>
        ),
    },
];

const InteractiveSection = () => {
    const [current, setCurrent] = useState(0);
    const timeoutRef = useRef(null);

    useEffect(() => {
        timeoutRef.current = setTimeout(() => {
            setCurrent((prev) => (prev + 1) % testimonials.length);
        }, 4000);
        return () => clearTimeout(timeoutRef.current);
    }, [current]);

    return (
        <div className="relative my-16 md:mx-10 rounded-xl bg-gradient-to-r from-[#5f6FFF] to-[#99aaff] shadow-xl overflow-hidden flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 py-10 gap-8 transition-all duration-700">
            {/* Animated SVG background */}
            <svg className="absolute left-0 top-0 w-full h-full opacity-10 z-0" viewBox="0 0 600 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="100" r="80" fill="#fff" fillOpacity="0.2" />
                <rect x="400" y="40" width="120" height="120" rx="30" fill="#fff" fillOpacity="0.13" />
                <polyline points="0,150 60,120 120,180 180,100 240,160 300,110 360,170 420,90 480,150 540,100 600,130" stroke="#fff" strokeWidth="4" fill="none">
                    <animate attributeName="stroke-dashoffset" from="0" to="-600" dur="3s" repeatCount="indefinite" />
                </polyline>
            </svg>
            {/* Testimonial Slider */}
            <div className="z-10 flex-1 flex flex-col gap-4 items-start w-full md:w-1/2 min-h-[180px] justify-center">
                <div className="transition-all duration-700">
                    <h2 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg mb-2">Health Tip</h2>
                    <p className="text-white text-base md:text-lg opacity-90 max-w-xl min-h-[72px]">{testimonials[current].tip}</p>
                </div>
                <div className="flex gap-2 mt-4">
                    {testimonials.map((_, idx) => (
                        <button
                            key={idx}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${current === idx ? 'bg-white' : 'bg-white/40'}`}
                            onClick={() => setCurrent(idx)}
                            aria-label={`Go to testimonial ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
            {/* Image */}
            <div className="z-10 flex-1 flex justify-center items-center w-full md:w-1/2 min-h-[180px] transition-all duration-700">
                {testimonials[current].image}
            </div>
        </div>
    );
};

export default InteractiveSection; 