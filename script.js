
// Back to top button
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTopBtn.classList.add('show');
  } else {
    backToTopBtn.classList.remove('show');
  }
});

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Auto-updating copyright year
document.getElementById('year').textContent = new Date().getFullYear();

// হেডারের নিচে লাইভ তারিখ ও সময় (প্রতি সেকেন্ডে আপডেট হবে)
const headerDateTime = document.getElementById('headerDateTime');

function updateHeaderClock() {
  if (!headerDateTime) return;
  const now = new Date();
  const dateStr = now.toLocaleDateString('bn-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = now.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  headerDateTime.textContent = dateStr + ' | ' + timeStr;
}

updateHeaderClock();
setInterval(updateHeaderClock, 1000);

// বয়স ক্যালকুলেটর
const calcAgeBtn = document.getElementById('calcAgeBtn');
const ageDob = document.getElementById('ageDob');
const ageResult = document.getElementById('ageResult');

if (calcAgeBtn) {
  calcAgeBtn.addEventListener('click', function () {
    if (!ageDob.value) {
      ageResult.style.color = '#c0392b';
      ageResult.textContent = 'অনুগ্রহ করে জন্ম তারিখ দিন।';
      return;
    }

    const dob = new Date(ageDob.value);
    const today = new Date();

    if (dob > today) {
      ageResult.style.color = '#c0392b';
      ageResult.textContent = 'জন্ম তারিখ আজকের তারিখের পরে হতে পারবে না।';
      return;
    }

    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();
    let days = today.getDate() - dob.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    ageResult.style.color = 'var(--primary)';
    ageResult.textContent = 'বর্তমান বয়স: ' + years + ' বছর ' + months + ' মাস ' + days + ' দিন';
  });
}

// Admission form submit (frontend only — connect to backend/API as needed)
const admissionForm = document.getElementById('admissionForm');
const formStatus = document.getElementById('formStatus');

if (admissionForm) {
  admissionForm.addEventListener('submit', function (e) {
    e.preventDefault();
    formStatus.textContent = 'আপনার আবেদনটি সফলভাবে জমা হয়েছে। ধন্যবাদ!';
    admissionForm.reset();
  });
}

/* =========================================================
   লগইন / রেজিস্ট্রেশন গেট (শুধুমাত্র ফ্রন্টএন্ড ডেমো)
   বাস্তব ওয়েবসাইটে এটি অবশ্যই ব্যাকএন্ড (PHP/Node) ও
   ডাটাবেজ দিয়ে সিকিউরভাবে করতে হবে। এখানে localStorage
   ব্যবহার করা হয়েছে শুধু শেখা ও ডেমো দেখানোর জন্য।
========================================================= */

const authGate = document.getElementById('authGate');
const admissionWrapper = document.getElementById('admissionWrapper');

const showLoginBtn = document.getElementById('showLoginBtn');
const showRegisterBtn = document.getElementById('showRegisterBtn');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginStatus = document.getElementById('loginStatus');
const registerStatus = document.getElementById('registerStatus');
const loggedInUser = document.getElementById('loggedInUser');
const logoutBtn = document.getElementById('logoutBtn');

// ট্যাব সুইচ (লগইন <-> রেজিস্ট্রেশন)
if (showLoginBtn && showRegisterBtn) {
  showLoginBtn.addEventListener('click', () => {
    loginForm.style.display = 'flex';
    registerForm.style.display = 'none';
    showLoginBtn.classList.add('active');
    showRegisterBtn.classList.remove('active');
  });

  showRegisterBtn.addEventListener('click', () => {
    registerForm.style.display = 'flex';
    loginForm.style.display = 'none';
    showRegisterBtn.classList.add('active');
    showLoginBtn.classList.remove('active');
  });
}

// ইউজারদের তালিকা localStorage থেকে নেওয়া
function getUsers() {
  return JSON.parse(localStorage.getItem('madrashaUsers') || '{}');
}

// রেজিস্ট্রেশন
if (registerForm) {
  registerForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const mobile = document.getElementById('regUser').value.trim();
    const pass = document.getElementById('regPass').value;
    const users = getUsers();

    if (users[mobile]) {
      registerStatus.textContent = 'এই মোবাইল নম্বর দিয়ে আগে থেকেই অ্যাকাউন্ট আছে। লগইন করুন।';
      registerStatus.style.color = '#c0392b';
      return;
    }

    users[mobile] = pass;
    localStorage.setItem('madrashaUsers', JSON.stringify(users));
    registerStatus.style.color = 'var(--primary)';
    registerStatus.textContent = 'রেজিস্ট্রেশন সফল হয়েছে। এখন লগইন করুন।';
    registerForm.reset();

    setTimeout(() => {
      showLoginBtn.click();
    }, 1000);
  });
}

// লগইন
if (loginForm) {
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const mobile = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value;
    const users = getUsers();

    if (users[mobile] && users[mobile] === pass) {
      sessionStorage.setItem('loggedInUser', mobile);
      enterAdmissionForm(mobile);
    } else {
      loginStatus.style.color = '#c0392b';
      loginStatus.textContent = 'মোবাইল নম্বর অথবা পাসওয়ার্ড ভুল হয়েছে।';
    }
  });
}

// লগআউট
if (logoutBtn) {
  logoutBtn.addEventListener('click', function () {
    sessionStorage.removeItem('loggedInUser');
    admissionWrapper.style.display = 'none';
    authGate.style.display = 'block';
    loginForm.reset();
  });
}

// লগইন সফল হলে ফরম দেখানো
function enterAdmissionForm(mobile) {
  authGate.style.display = 'none';
  admissionWrapper.style.display = 'block';
  loggedInUser.textContent = 'স্বাগতম, ' + mobile;
}

// পেজ লোড হওয়ার সময় আগে থেকে লগইন করা থাকলে সরাসরি ফরম দেখানো
window.addEventListener('DOMContentLoaded', function () {
  const savedUser = sessionStorage.getItem('loggedInUser');
  if (savedUser && admissionWrapper) {
    enterAdmissionForm(savedUser);
  }
});

/* =========================================================
   সিলেবাস ট্র্যাকার (আলিম প্রথম বর্ষ) — "অনলাইন সেবা" সেকশনে
========================================================= */

const syllabusList = document.getElementById('syllabusList');
const progressText = document.getElementById('progressText');
const progressFill = document.getElementById('progressFill');
const syllabusInput = document.getElementById('syllabusInput');
const syllabusAddBtn = document.getElementById('syllabusAddBtn');

if (syllabusList) {
  const SYLLABUS_KEY = 'alim_1st_year_syllabus';

  const defaultSyllabus = [
    { text: 'আল-কুরআনুল কারীম (তাফসীর সহ)', done: false },
    { text: 'হাদীস শরীফ — প্রথম খণ্ড', done: false },
    { text: 'আরবি সাহিত্য ও ব্যাকরণ', done: false },
    { text: 'ইসলামী আইন (ফিকহ)', done: false },
    { text: 'বাংলা ভাষা ও সাহিত্য', done: false },
    { text: 'ইংরেজি', done: false }
  ];

  let syllabus = JSON.parse(localStorage.getItem(SYLLABUS_KEY)) || defaultSyllabus;

  function saveSyllabus() {
    localStorage.setItem(SYLLABUS_KEY, JSON.stringify(syllabus));
  }

  function renderSyllabus() {
    syllabusList.innerHTML = '';

    if (syllabus.length === 0) {
      syllabusList.innerHTML = '<p style="text-align:center; color:#999; font-size:0.85rem; padding:10px 0;">কোনো বিষয় নেই। উপরে লিখে যোগ করুন।</p>';
    }

    syllabus.forEach((item, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div class="syllabus-left">
          <input type="checkbox" ${item.done ? 'checked' : ''} data-index="${index}" class="syllabus-check">
          <span class="${item.done ? 'completed' : ''}">${item.text}</span>
        </div>
        <button type="button" class="syllabus-delete" data-index="${index}">✕</button>
      `;
      syllabusList.appendChild(li);
    });

    const doneCount = syllabus.filter(s => s.done).length;
    const percent = syllabus.length ? Math.round((doneCount / syllabus.length) * 100) : 0;

    progressText.textContent = `${percent}% সম্পন্ন (${doneCount}/${syllabus.length} বিষয়)`;
    progressFill.style.width = percent + '%';
  }

  function addSyllabusItem() {
    const text = syllabusInput.value.trim();
    if (text === '') return;

    syllabus.push({ text: text, done: false });
    syllabusInput.value = '';
    saveSyllabus();
    renderSyllabus();
  }

  if (syllabusAddBtn) {
    syllabusAddBtn.addEventListener('click', addSyllabusItem);
  }

  if (syllabusInput) {
    syllabusInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') addSyllabusItem();
    });
  }

  syllabusList.addEventListener('click', function (e) {
    const index = e.target.dataset.index;

    if (e.target.classList.contains('syllabus-check')) {
      syllabus[index].done = e.target.checked;
      saveSyllabus();
      renderSyllabus();
    }

    if (e.target.classList.contains('syllabus-delete')) {
      syllabus.splice(index, 1);
      saveSyllabus();
      renderSyllabus();
    }
  });

  syllabusList.addEventListener('change', function (e) {
    if (e.target.classList.contains('syllabus-check')) {
      const index = e.target.dataset.index;
      syllabus[index].done = e.target.checked;
      saveSyllabus();
      renderSyllabus();
    }
  });

  renderSyllabus();
}
