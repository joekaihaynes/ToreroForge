
document.addEventListener("DOMContentLoaded", function () {

    const screens = {
        login: document.getElementById("login-form"),
        register: document.getElementById("register-form"),
        forgot: document.getElementById("forgot-form"),
        dashboard: document.getElementById("dashboard")
    };

    const message = document.getElementById("message");

    // Switch between screens
    function navigate(page) {
        Object.values(screens).forEach(screen => {
            screen.classList.add("hidden");
        });

        screens[page].classList.remove("hidden");

        message.textContent = "";
        message.classList.add("hidden");
    }

    // Display feedback
    function showMessage(text) {
        message.textContent = text;
        message.classList.remove("hidden");
    }

    // Navigation buttons
    document.querySelectorAll("[data-page]").forEach(button => {
        button.addEventListener("click", function () {
            navigate(this.dataset.page);
        });
    });

    // Show or hide password
    document.querySelectorAll(".show-password").forEach(button => {
        button.addEventListener("click", function () {
            const input = document.getElementById(this.dataset.target);

            if (input.type === "password") {
                input.type = "text";
                this.textContent = "Hide";
            } else {
                input.type = "password";
                this.textContent = "Show";
            }
        });
    });

    // Simulated login
    screens.login.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        if (!email || !password) {
            showMessage("Please enter your email and password.");
            return;
        }

        // Demo only: no actual authentication
        navigate("dashboard");
    });

    // Simulated registration
    screens.register.addEventListener("submit", function (event) {
        event.preventDefault();

        const username = document.getElementById("register-username").value;
        const email = document.getElementById("register-email").value;
        const password = document.getElementById("register-password").value;
        const confirm = document.getElementById("register-confirm").value;

        if (!username || !email || !password || !confirm) {
            showMessage("Please complete all fields.");
            return;
        }

        if (password !== confirm) {
            showMessage("Passwords do not match.");
            return;
        }

        // Demo only: no account is actually created
        navigate("login");
        showMessage("Demo account created! You can now log in.");
    });

    // Simulated forgot password
    screens.forgot.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("forgot-email").value;

        if (!email) {
            showMessage("Please enter your email.");
            return;
        }

        showMessage(
            "Demo: A password reset link would be sent to " + email
        );
    });

    // Initial screen
    navigate("login");

});
