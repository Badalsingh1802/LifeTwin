
const firebaseConfig = {
    apiKey: "",
    authDomain: "lifetwin-39aff.firebaseapp.com",
    projectId: "lifetwin-39aff",
    storageBucket: "lifetwin-39aff.firebasestorage.app",
    messagingSenderId: "160775443048",
    appId: "",
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
 



async function sendMessage() {
    const input = document.getElementById("msgInput").value;
    const chatBox = document.getElementById("chatBox");

    chatBox.innerHTML += `<p><strong>You:</strong> ${input}</p>`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": ""
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are LifeTwin AI, a helpful emotional assistant." },
                { role: "user", content: input }
            ]
        })
    });

    const data = await response.json();

    if (data.choices && data.choices[0]) {
        const reply = data.choices[0].message.content;
        chatBox.innerHTML += `<p><strong>LifeTwin:</strong> ${reply}</p>`;
    } else {
        chatBox.innerHTML += `<p><strong>LifeTwin:</strong> Error receiving reply</p>`;
    }

    document.getElementById("msgInput").value = "";
    chatBox.scrollTop = chatBox.scrollHeight;
}
