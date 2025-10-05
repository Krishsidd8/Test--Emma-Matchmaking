import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import './styles.css';

const REVEAL_DATE_ISO = '2025-12-20T12:00:00Z';
const REVEAL_DATE = new Date(REVEAL_DATE_ISO);

const NAVBAR = () => (
  <nav className="navbar">
    <h1>Emma's Matchmaking</h1>
    <div className="nav-links">
      <Link to="/">Home</Link>
      <Link to="/about">About the Play</Link>
      <Link to="/matchmaking">Matchmaking</Link>
    </div>
  </nav>
);

const Home = () => (
  <div className="home">
    <div className="home-content">
      <h2>Find your perfect match — friend, date, or group!</h2>
      <Link to="/matchmaking" className="cta-button">Start Matchmaking</Link>
    </div>
  </div>
);

const About = () => (
  <div className="about">
    <img src="https://via.placeholder.com/400" alt="The Play" />
    <div>
      <h2>About the Play</h2>
      <p>Emma's Matchmaking is a playful school project where fun, vibes, and connection meet. Whether you’re finding a friend or a group, it’s all about shared experiences and laughter!</p>
    </div>
  </div>
);

const Matchmaking = () => {
  const navigate = useNavigate();

  const stored = typeof window !== 'undefined' ? localStorage.getItem('emma_user') : null;
  const parsedUser = stored ? JSON.parse(stored) : null;

  const [user, setUser] = useState(parsedUser);
  const [step, setStep] = useState(parsedUser ? 'waiting' : 'signup');
  const [form, setForm] = useState({ name: '', email: '', grade: '' });
  const [matchType, setMatchType] = useState('');
  const [answers, setAnswers] = useState({});
  const [timeLeftMs, setTimeLeftMs] = useState(Math.max(0, REVEAL_DATE.getTime() - Date.now()));

  useEffect(() => {
    if (step !== 'waiting') return;
    const timer = setInterval(() => setTimeLeftMs(Math.max(0, REVEAL_DATE.getTime() - Date.now())), 1000);
    return () => clearInterval(timer);
  }, [step]);

  const formatTime = ms => {
    const s = Math.floor(ms / 1000);
    const days = Math.floor(s / 86400);
    const hours = Math.floor((s % 86400) / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    return `${days}d ${String(hours).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
  };

  useEffect(() => {
    if (timeLeftMs <= 0 && step === 'waiting') {
      navigate('/matchmaking/reveal');
    }
  }, [timeLeftMs, step, navigate]);

  const handleSignup = () => {
    if (!form.name.trim() || !form.email.trim() || !form.grade) {
      alert('Please complete all signup fields.');
      return;
    }
    if (!form.email.endsWith('@students.esuhsd.org')) {
      alert('Please use your @students.esuhsd.org student email.');
      return;
    }
    const storedAll = localStorage.getItem('emma_user');
    if (storedAll) {
      const u = JSON.parse(storedAll);
      if (u.email === form.email) {
        setUser(u);
        setStep('waiting');
        return;
      }
    }
    setStep('matchType');
  };

  const handleSelectMatchType = type => {
    setMatchType(type);
    setStep('questions');
  };

  const handleSubmit = () => {
    if (!matchType) { alert('Please choose a match type.'); return; }
    if (Object.keys(answers).length === 0) { alert('Please answer at least one question.'); return; }
    const u = { ...form, matchType, answers, submittedAt: new Date().toISOString() };
    localStorage.setItem('emma_user', JSON.stringify(u));
    setUser(u);
    setStep('waiting');
  };

  return (
    <div className="matchmaking">
      {step==='signup' && (
        <div className="signup">
          <h2>Sign Up</h2>
          <input placeholder="Full Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
          <input placeholder="Student Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
          <select value={form.grade} onChange={e=>setForm({...form,grade:e.target.value})}>
            <option value="">Select Grade</option>
            <option>9th</option>
            <option>10th</option>
            <option>11th</option>
            <option>12th</option>
          </select>
          <button onClick={handleSignup}>Continue</button>
        </div>
      )}
      {step==='matchType' && (
        <div className="match-type">
          <h2>Choose Match Type</h2>
          <div className="match-buttons">
            <button onClick={()=>handleSelectMatchType('friend')}>Friend</button>
            <button onClick={()=>handleSelectMatchType('date')}>Date</button>
            <button onClick={()=>handleSelectMatchType('group')}>Group</button>
          </div>
        </div>
      )}
      {step==='questions' && (
        <div className="questions">
          <h2>Tell us about yourself!</h2>
          <label>Favorite hangout spot?</label>
          <input value={answers.hangout||''} onChange={e=>setAnswers({...answers,hangout:e.target.value})}/>
          <label>Favorite vibe?</label>
          <input value={answers.vibe||''} onChange={e=>setAnswers({...answers,vibe:e.target.value})}/>
          <label>Hobby you can’t live without?</label>
          <input value={answers.hobby||''} onChange={e=>setAnswers({...answers,hobby:e.target.value})}/>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}
      {step==='waiting' && (
        <div className="waiting">
          <h2>Waiting Room</h2>
          <p>Your submission is saved. You cannot submit again with the same email.</p>
          <p>Reveal at: {REVEAL_DATE.toUTCString()}</p>
          <p>Countdown: {formatTime(timeLeftMs)}</p>
        </div>
      )}
    </div>
  );
};

const Reveal = ({user}) => {
  if (!user) return (
    <div className="reveal">
      <h2>Matches Revealed</h2>
      <p>No submission found for this browser session. If you submitted earlier, your match details would appear here after the shared reveal.</p>
    </div>
  );

  return (
    <div className="reveal">
      <h2>Matches Revealed</h2>
      <div className="card">
        <div><strong>Name:</strong> {user.name}</div>
        <div><strong>Grade:</strong> {user.grade}</div>
        <div><strong>Match Type:</strong> {user.matchType}</div>
        <div className="answers"><strong>Answers:</strong>
          <pre>{JSON.stringify(user.answers||{},null,2)}</pre>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <div>
      <NAVBAR />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/matchmaking" element={<Matchmaking />} />
        <Route path="/matchmaking/reveal" element={<Reveal user={JSON.parse(localStorage.getItem('emma_user') || 'null')} />} />
      </Routes>
    </div>
  );
}