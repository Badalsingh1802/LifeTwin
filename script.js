
 const firebaseConfig = {
  apiKey: "AIzaSyDuCux8hnVZvQh2lWL8_VYf9Te40U1RNU8",
  authDomain: "lifetwin-39aff.firebaseapp.com",
  projectId: "lifetwin-39aff",
  storageBucket: "lifetwin-39aff.firebasestorage.app",
  messagingSenderId: "160775443048",
  appId: "1:160775443048:web:6028a231a107b94906a1dd",
  measurementId: "G-PNYJS53CDQ"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

const db = firebase.firestore();

 document.getElementById("loginBtn").addEventListener("click", () => {
  auth.signInWithPopup(provider)
    .then(result => {
      const user = result.user;
      document.getElementById("user-name").textContent = `Welcome, ${user.displayName}`;
      document.getElementById("dashboard").style.display = "block";
    })
     
 });

function saveMemory() {
    const text = document.getElementById("memory").value;
    const user = auth.currentUser;
    if (user && text.trim()) {
        db.collection("users").doc(user.uid).collection("memories").add({
            text: text,
            timestamp: new Date()
        });
        alert("Memory saved!");
        document.getElementById("memory").value = "";
    }
}

function saveFutureMessage() {
    const text = document.getElementById("futureMessage").value;
    const date = document.getElementById("futureDate").value;
    const user = auth.currentUser;
    if (user && text.trim() && date) {
        db.collection("users").doc(user.uid).collection("futureMessages").add({
            message: text,
            unlockDate: new Date(date)
        });
        alert("Future message scheduled!");
        document.getElementById("futureMessage").value = "";
    }
}

function talkToLifeTwin() {
    const prompt = document.getElementById("chatInput").value;
    axios.post("https://api.openai.com/v1/completions", {
        model: "text-davinci-003",
        prompt: "Act like Badal's LifeTwin. " + prompt,
        max_tokens: 100
    }, {
        headers: {
            "Authorization": "Bearer YOUR_OPENAI_API_KEY"
        }
    }).then(response => {
        document.getElementById("chatOutput").textContent = response.data.choices[0].text.trim();
    });
}
