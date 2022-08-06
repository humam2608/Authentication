const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyAUoLpE7M2KjbzWi_NbRBxjfL73f2yHvEY",
  authDomain: "authorization-63080.firebaseapp.com",
  projectId: "authorization-63080",
  storageBucket: "authorization-63080.appspot.com",
  messagingSenderId: "540759643949",
  appId: "1:540759643949:web:9aade2904d41ff1769e5a4"
})
const auth = firebase.auth();
const fs = firebase.firestore();

const loggedOutLinks = document.querySelectorAll(".logged-out");
const loggedInLinks = document.querySelectorAll(".logged-in");

const loginCheck = (user) => {
  if (user) {
    loggedInLinks.forEach((link) => (link.style.display = "block"));
    loggedOutLinks.forEach((link) => (link.style.display = "none"));
  } else {
    loggedInLinks.forEach((link) => (link.style.display = "none"));
    loggedOutLinks.forEach((link) => (link.style.display = "block"));
  }
};

// Sign up
const signUpForm = document.querySelector("#signup-form");
signUpForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.querySelector('#signup-email').value
  const password = document.querySelector('#signup-password').value

  // Authenticate the User
  auth
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // clear the form
      signUpForm.reset()

      // close the modal
      $('#signupModal').modal('hide')

      console.log('sign up');
    });
});  

// sign in
const signinForm = document.querySelector('#login-form')

signinForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = document.querySelector('#login-email').value
  const password = document.querySelector('#login-password').value
  
  auth
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // clear the form
      signinForm.reset()

      // close the modal
      $('#signinModal').modal('hide')

      console.log('sign in');
    });

})

// Log out
const logout = document.querySelector('#logout ')

logout.addEventListener('click', e => {
  e.preventDefault()

  auth
    .signOut()
    .then(() => {
      console.log('sign out');
    })
})

// Posts
const postList = document.querySelector('.posts')

const setupPosts = data => {
  if (data.length) {
    let html = ''
    data.forEach(doc => {
      const post = doc.data()
      console.log(post);
      const li = `
      <li class="list-group-item list-group-item-action">
        <h3>${post.title}</h3>
        <p>${post.description}</p>
      </li>
      `;
      
      html += li
    });

    postList.innerHTML = html
  } else {
    postList.innerHTML = '<p class="text-center">Log In to see the posts</p>'
  }
}

// Events
// list for auth state changed
auth.onAuthStateChanged(user => {
  if (user) {
    fs.collection('posts')
      .get()
      .then((snapshot) => {
        setupPosts(snapshot.docs)
        loginCheck(user)
      })
  } else {
    setupPosts([])
    loginCheck(user)
  }
})