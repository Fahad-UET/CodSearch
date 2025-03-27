// Get Firebase instances
const auth = window.firebaseAuth;
const db = window.firebaseDb;

// DOM Elements
const loginPrompt = document.getElementById('loginPrompt');
const userView = document.getElementById('userView');
const userEmail = document.getElementById('userEmail');
const linkStatus = document.getElementById('linkStatus');
const linkAccountBtn = document.getElementById('linkAccountBtn');
const boardSelect = document.getElementById('boardSelect');
const message = document.getElementById('message');
const loading = document.getElementById('loading');

// Auth Elements
const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const authForm = document.getElementById('authForm');
const submitBtn = document.getElementById('submitBtn');
const forgotPassword = document.getElementById('forgotPassword');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const openAppBtn = document.getElementById('openAppBtn');

let isRegistering = false;

// Initialize extension
async function initExtension() {
  showLoading();
  try {
    // Check for existing auth state
    const user = auth.currentUser;
    if (user) {
      await checkAccountLinkStatus(user);
      showUserView(user);
      await loadBoards(user.uid);
    } else {
      showLoginPrompt();
    }
  } catch (error) {
    showMessage(getErrorMessage(error), 'error');
  } finally {
    hideLoading();
  }
}

// Event Listeners
loginTab.addEventListener('click', () => switchAuthMode(false));
registerTab.addEventListener('click', () => switchAuthMode(true));
authForm.addEventListener('submit', handleAuth);
openAppBtn.addEventListener('click', openWebApp);
forgotPassword.addEventListener('click', handleForgotPassword);
boardSelect.addEventListener('change', handleBoardSelect);

// Auth Functions
async function handleAuth(e) {
  e.preventDefault();
  showLoading();

  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    const userCredential = isRegistering
      ? await auth.createUserWithEmailAndPassword(email, password)
      : await auth.signInWithEmailAndPassword(email, password);
      
    await checkAccountLinkStatus(userCredential.user);
    showUserView(userCredential.user);
    await loadBoards(userCredential.user.uid);
  } catch (error) {
    showMessage(getErrorMessage(error), 'error');
  } finally {
    hideLoading();
  }
}

async function loadBoards(userId) {
  try {
    const boardsRef = db.collection('boards');
    const snapshot = await boardsRef.where('ownerId', '==', userId).get();
    
    clearBoardSelect();
    
    snapshot.forEach(doc => {
      const board = doc.data();
      const option = document.createElement('option');
      option.value = doc.id;
      option.textContent = board.name;
      boardSelect.appendChild(option);
    });
  } catch (error) {
    showMessage('Failed to load boards', 'error');
  }
}

// UI Functions
function switchAuthMode(registering) {
  isRegistering = registering;
  loginTab.classList.toggle('active', !registering);
  registerTab.classList.toggle('active', registering);
  submitBtn.textContent = registering ? 'Create Account' : 'Sign In';
  forgotPassword.style.display = registering ? 'none' : 'block';
}

function showUserView(user) {
  loginPrompt.classList.add('hidden');
  userView.classList.remove('hidden');
  userEmail.textContent = user.email;
}

function showLoginPrompt() {
  loginPrompt.classList.remove('hidden');
  userView.classList.add('hidden');
}

function showLoading() {
  loading.classList.remove('hidden');
}

function hideLoading() {
  loading.classList.add('hidden');
}

function showMessage(text, type = 'info') {
  message.textContent = text;
  message.className = `message ${type}`;
  message.classList.remove('hidden');
  setTimeout(() => message.classList.add('hidden'), 3000);
}

function clearBoardSelect() {
  boardSelect.innerHTML = '<option value="">Choose a board...</option>';
}

function handleBoardSelect() {
  const scrapeBtn = document.getElementById('scrapeBtn');
  scrapeBtn.disabled = !boardSelect.value;
}

function openWebApp() {
  chrome.tabs.create({ url: 'https://incredible-youtiao-2a1b5d.netlify.app' });
}

// Error Handling
function getErrorMessage(error) {
  switch (error.code) {
    case 'auth/wrong-password':
      return 'Incorrect password';
    case 'auth/user-not-found':
      return 'No account found with this email';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email';
    default:
      return error.message;
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', initExtension);