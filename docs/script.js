const REVEAL_DATE = new Date('2025-12-20T12:00:00Z');
let user = JSON.parse(localStorage.getItem('emma_user')) || null;
let step = user ? 'waiting' : 'signup';
let form = {name:'', email:'', grade:''};
let matchType = '';
let answers = {};

function renderNavbar() {
  return `<div class='navbar'><h1>Emma's Matchmaking</h1>
    <div class='nav-links'>
      <a href='#home' onclick="showSection('home')">Home</a>
      <a href='#about' onclick="showSection('about')">About the Play</a>
      <a href='#matchmaking' onclick="showSection('matchmaking')">Matchmaking</a>
    </div>
  </div>`;
}

function renderHome() {
  return `<div class='home'><div class='home-content'>
    <h2>Find your perfect match — friend, date, or group!</h2>
    <button onclick="showSection('matchmaking')" class='cta-button'>Start Matchmaking</button>
  </div></div>`;
}

function renderAbout() {
  return `<div class='about'>
    <img src='https://via.placeholder.com/400' alt='The Play'/>
    <div><h2>About the Play</h2>
    <p>Emma is a witty and theatrical adaptation of Jane Austen’s beloved novel, following the charming yet meddlesome Emma Woodhouse as she navigates romantic entanglements in early 19th-century England. Though she vows never to marry, Emma delights in matchmaking for others, particularly her friend Harriet Smith, despite warnings from the sensible Mr. Knightley. Her plans go awry when Mr. Elton, whom she intended for Harriet, reveals his interest in Emma instead. The arrival of Jane Fairfax and Frank Churchill adds further intrigue and confusion, prompting Emma to confront her own feelings and misjudgments. Ultimately, she realizes her love for Mr. Knightley, leading to heartfelt resolutions and personal growth. Blending humor, heart, and period charm, the play explores themes of love, friendship, social class, and self-awareness, with notable adaptations offering tones that range from classic elegance to screwball comedy</p></div>
  </div>`;
}

function renderSignup() {
  return `<div class='matchmaking'>
    <h2>Sign Up</h2>
    <input id='name' placeholder='Full Name' />
    <input id='email' placeholder='Student Email' />
    <select id='grade'>
      <option value=''>Select Grade</option>
      <option>9th</option>
      <option>10th</option>
      <option>11th</option>
      <option>12th</option>
    </select>
    <button onclick='handleSignup()'>Continue</button>
  </div>`;
}

function renderMatchType() {
  return `<div class='match-type'>
    <h2>Choose Match Type</h2>
    <button onclick="handleSelectMatchType('friend')">Friend</button>
    <button onclick="handleSelectMatchType('date')">Date</button>
    <button onclick="handleSelectMatchType('group')">Group</button>
  </div>`;
}

function renderQuestions() {
  return `<div class='questions'>
    <h2>Tell us about yourself!</h2>
    <label>Favorite hangout spot?</label><input id='hangout'/>
    <label>Favorite vibe?</label><input id='vibe'/>
    <label>Hobby you can't live without?</label><input id='hobby'/>
    <button onclick='handleSubmit()'>Submit</button>
  </div>`;
}

function renderWaiting() {
  const countdown = Math.max(0, REVEAL_DATE.getTime() - new Date().getTime());
  return `<div class='waiting'>
    <h2>Waiting Room</h2>
    <p>Your submission is saved. You cannot submit again with the same email.</p>
    <p>Reveal at: ${REVEAL_DATE.toUTCString()}</p>
    <p>Countdown: ${Math.floor(countdown/1000)} seconds</p>
  </div>`;
}

function renderReveal() {
  if(!user) return `<div class='reveal'><h2>Matches Revealed</h2><p>No submission found.</p></div>`;
  return `<div class='reveal'><h2>Matches Revealed</h2>
    <div><strong>Name:</strong> ${user.name}</div>
    <div><strong>Grade:</strong> ${user.grade}</div>
    <div><strong>Match Type:</strong> ${user.matchType}</div>
    <div><strong>Answers:</strong><pre>${JSON.stringify(user.answers)}</pre></div>
  </div>`;
}

function showSection(section) {
  let html = renderNavbar();
  if(section==='home') html += renderHome();
  if(section==='about') html += renderAbout();
  if(section==='matchmaking') {
    if(step==='signup') html += renderSignup();
    else if(step==='matchType') html += renderMatchType();
    else if(step==='questions') html += renderQuestions();
    else if(step==='waiting') html += renderWaiting();
  }
  if(section==='reveal') html += renderReveal();
  document.getElementById('app').innerHTML = html;
}

function handleSignup() {
  form.name = document.getElementById('name').value;
  form.email = document.getElementById('email').value;
  form.grade = document.getElementById('grade').value;
  if(!form.name || !form.email || !form.grade) { alert('Complete all fields'); return; }
  if(!form.email.endsWith('@students.esuhsd.org')) { alert('Use a valid student email'); return; }
  const storedAll = localStorage.getItem('emma_user');
  if(storedAll && JSON.parse(storedAll).email===form.email) { user=JSON.parse(storedAll); step='waiting'; showSection('matchmaking'); return; }
  step='matchType'; showSection('matchmaking');
}

function handleSelectMatchType(type) {
  matchType = type; step='questions'; showSection('matchmaking');
}

function handleSubmit() {
  answers.hangout=document.getElementById('hangout').value;
  answers.vibe=document.getElementById('vibe').value;
  answers.hobby=document.getElementById('hobby').value;
  if(!matchType || !answers.hangout || !answers.vibe || !answers.hobby) { alert('Complete all questions'); return; }
  user = Object.assign({}, form, {matchType, answers, submittedAt: new Date().toISOString()});
  localStorage.setItem('emma_user', JSON.stringify(user));
  step='waiting'; showSection('matchmaking');
}

window.onload = function() { showSection('home'); };