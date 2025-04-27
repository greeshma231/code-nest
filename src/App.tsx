import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

// Animation hook for cards
function useInViewAnimation(count: number) {
  const refs = Array.from({ length: count }, () => useRef<HTMLDivElement>(null));
  const [visible, setVisible] = useState(Array(count).fill(false));

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    refs.forEach((ref, idx) => {
      if (!ref.current) return;
      const observer = new window.IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible((v) => {
              const copy = [...v];
              copy[idx] = true;
              return copy;
            });
            observer.disconnect();
          }
        },
        { threshold: 0.2 }
      );
      observer.observe(ref.current);
      observers.push(observer);
    });
    return () => observers.forEach((obs) => obs.disconnect());
  }, []);
  return { refs, visible };
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

function LearningPathModal({ 
  isOpen, 
  onClose, 
  title
}: { 
  isOpen: boolean; 
  onClose: () => void;
  title: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-purple-400 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Study Card */}
          <div className="group bg-[#181028] rounded-2xl p-8 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="mb-6 text-6xl text-center">📚</div>
              <h3 className="text-2xl font-bold mb-4 text-center">Study</h3>
              <p className="text-gray-300 mb-6 text-center">
                {`Dive deep into ${title.toLowerCase()} concepts with interactive lessons and visualizations.`}
              </p>
              <div className="flex justify-center">
                <button className="btn-explore px-8 py-3 text-lg">
                  Start Learning →
                </button>
              </div>
            </div>
            <div className="absolute inset-0 border-4 border-transparent group-hover:border-purple-500/30 rounded-2xl transition-all duration-500"></div>
          </div>

          {/* Quiz Card */}
          <div className="group bg-[#181028] rounded-2xl p-8 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="mb-6 text-6xl text-center">🎯</div>
              <h3 className="text-2xl font-bold mb-4 text-center">Quiz</h3>
              <p className="text-gray-300 mb-6 text-center">
                {`Test your knowledge of ${title.toLowerCase()} with interactive quizzes and challenges.`}
              </p>
              <div className="flex justify-center">
                <button className="btn-explore px-8 py-3 text-lg">
                  Take Quiz →
                </button>
              </div>
            </div>
            <div className="absolute inset-0 border-4 border-transparent group-hover:border-pink-500/30 rounded-2xl transition-all duration-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HomePage() {
  const [showContent, setShowContent] = useState(false);
  const [activeModal, setActiveModal] = useState<{ title: string } | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const whyChooseRef = useRef<HTMLDivElement>(null);
  const learningPathsRef = useRef<HTMLDivElement>(null);
  const whyChooseCount = 3;
  const { refs: whyRefs, visible: whyVisible } = useInViewAnimation(whyChooseCount);

  // Scroll to Why Choose section
  const scrollToWhyChoose = () => {
    if (whyChooseRef.current) {
      whyChooseRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Scroll to Learning Paths section
  const scrollToLearningPaths = () => {
    if (learningPathsRef.current) {
      learningPathsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!showContent && window.scrollY > 50) {
        setShowContent(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showContent]);

  const learningPaths = [
    {
      title: 'Arrays',
      desc: 'Master Arrays from basics to advanced with hands-on coding challenges.',
      img: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80',
      level: 'Beginner',
    },
    {
      title: 'Stacks & Queues',
      desc: 'Learn the right way to use stacks and queues in real-world problems.',
      img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80',
      level: 'Beginner',
    },
    {
      title: 'Linked Lists',
      desc: 'Visualize and code all types of linked lists with interactive tools.',
      img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2944&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      level: 'Intermediate',
    },
    {
      title: 'Hashing',
      desc: 'Crack the code of hash tables, maps, and sets with practical exercises.',
      img: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      level: 'Intermediate',
    },
    {
      title: 'Trees',
      desc: 'Master binary trees, BSTs, and more with step-by-step visualizations.',
      img: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      level: 'Advanced',
    },
    {
      title: 'Heaps',
      desc: 'Learn heaps and priority queues for efficient algorithms.',
      img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80',
      level: 'Advanced',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-purple-400"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 4.5L19.5 7.5M19.5 7.5L16.5 10.5M19.5 7.5H9.75M7.5 19.5L4.5 16.5M4.5 16.5L7.5 13.5M4.5 16.5H14.25" /></svg></span>
            <span className="text-2xl font-bold">Code Nest</span>
          </div>
          <nav className="flex items-center space-x-6">
            <button className="btn-nav" onClick={scrollToWhyChoose}>
              Features
            </button>
            <button className="btn-nav" onClick={scrollToLearningPaths}>
              Learning Paths
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#1a102e] to-black min-h-screen flex items-center py-24 md:py-32 relative overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-br from-purple-700/40 via-pink-500/20 to-transparent rounded-full blur-3xl opacity-60 pointer-events-none z-0"></div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 gap-12 w-full relative z-10">
          {/* Left: Text */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight drop-shadow-lg">
              Master <span className="text-purple-400">DSA</span> <br className="hidden md:block" /> Through <span className="text-pink-400">Interactive</span> Learning
            </h1>
            <p className="max-w-2xl text-2xl text-gray-200 mb-10 mx-auto md:mx-0 font-medium drop-shadow">
              Experience the future of coding education with AI-powered personalized learning paths tailored to your goals.
            </p>
            <button
              className="btn-gradient animate-pulse"
              onClick={scrollToLearningPaths}
            >
              Start Learning
            </button>
          </div>
          {/* Right: Image */}
          <div className="flex-1 flex justify-center md:justify-end w-full">
            <img 
              src="/developer-hero.jpg" 
              alt="Developer at computer" 
              className="rounded-3xl shadow-2xl w-full max-w-lg object-cover border-4 border-purple-900/40"
              style={{maxHeight: '420px'}}
            />
          </div>
        </div>
      </section>

      {/* Main Content (hidden until scroll) */}
      <div
        ref={contentRef}
        className={`transition-opacity duration-1000 ${showContent ? 'opacity-100 pointer-events-auto select-auto' : 'opacity-0 pointer-events-none select-none h-0 overflow-hidden'}`}
        style={{ minHeight: showContent ? undefined : 0 }}
      >
        {/* Why Choose Section */}
        <section ref={whyChooseRef} className="py-20 bg-black">
          <h2 className="text-4xl font-extrabold text-center mb-14 tracking-tight">Why Choose Code Nest?</h2>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: '🎮',
                title: 'Gamified Learning',
                desc: 'Learn through interactive challenges and earn rewards as you progress through your coding journey.'
              },
              {
                icon: '🤖',
                title: 'AI-Powered Quizzes',
                desc: 'Adaptive assessments that evolve with your skills, ensuring optimal learning outcomes.'
              },
              {
                icon: '🗺️',
                title: 'Personal Roadmaps',
                desc: 'Custom learning paths tailored to your goals and current skill level.'
              }
            ].map((card, idx) => (
              <div
                key={card.title}
                ref={whyRefs[idx]}
                className={`bg-[#181028] rounded-2xl p-10 shadow-lg text-center transform transition-all duration-700 relative overflow-hidden
                  ${whyVisible[idx] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                  group hover:scale-105 hover:shadow-2xl hover:ring-4 hover:ring-purple-500/30`}
                style={{
                  boxShadow: '0 4px 24px 0 rgba(80, 0, 200, 0.10)',
                }}
              >
                <div className="mb-6 text-5xl drop-shadow-lg transition-transform duration-300 group-hover:scale-125">
                  {card.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{card.title}</h3>
                <p className="text-gray-300 text-lg">{card.desc}</p>
                {/* Animated gradient border on hover */}
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-full h-full rounded-2xl border-4 border-gradient-to-br from-purple-400 via-pink-400 to-purple-600 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Learning Paths Section */}
        <section ref={learningPathsRef} className="py-16 bg-black">
          <h2 className="text-4xl font-extrabold text-center mb-14 tracking-tight">Learning Paths</h2>
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {learningPaths.map((path) => (
              <div
                key={path.title}
                className="group bg-[#181028] rounded-2xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl relative cursor-pointer"
                style={{
                  boxShadow: '0 4px 24px 0 rgba(80, 0, 200, 0.10)',
                }}
              >
                <div className="relative">
                  <img src={path.img} alt={path.title} className="w-full h-48 object-cover transition-all duration-300 group-hover:brightness-110" />
                  <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-purple-500/60 to-pink-400/60"></div>
                </div>
                <div className="p-6">
                  <span className="inline-block bg-purple-700 text-xs px-2 py-1 rounded-full mb-2">{path.level}</span>
                  <h3 className="text-xl font-semibold mb-1">{path.title}</h3>
                  <p className="text-gray-400 mb-3">{path.desc}</p>
                  <button 
                    className="btn-explore"
                    onClick={() => setActiveModal({ title: path.title })}
                  >
                    Explore →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 bg-gradient-to-t from-[#1a102e] to-black text-center">
          <h2 className="text-3xl font-bold mb-4">Begin Your Coding Journey Today</h2>
          <p className="text-gray-300 mb-8">Join the community of successful developers who started their career with Code Nest</p>
          <button className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition" onClick={scrollToLearningPaths}>
            Start Learning
          </button>
        </section>
      </div>

      {/* Learning Path Modal */}
      {activeModal && (
        <LearningPathModal
          isOpen={!!activeModal}
          onClose={() => setActiveModal(null)}
          title={activeModal.title}
        />
      )}
    </div>
  );
}

export default App;
