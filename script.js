async function signIn() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    console.log("Sending login request:", { email, password }); // Debugging

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (response.ok) {
            alert("Login successful!");
            window.location.href = "profile.html";
        } else {
            document.getElementById('signInError').innerText = result.error;
            document.getElementById('signInError').style.display = "block";
        }
    } catch (error) {
        console.error("Fetch error:", error); // Debugging
        document.getElementById('signInError').innerText = "Network error!";
        document.getElementById('signInError').style.display = "block";
    }
}