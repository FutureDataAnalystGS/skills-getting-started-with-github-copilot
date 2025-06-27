* {document.addEventListener("DOMContentLoaded", () => {


}  margin: 0;  font-style: italic;  color: #888;.no-participants {}  font-size: 15px;  color: #333;  margin-bottom: 0;  margin-left: 18px;.participants-list {}  color: #3949ab;  margin-bottom: 6px;  display: block;.participants-section strong {}  border: 1px solid #c5cae9;  border-radius: 4px;  background-color: #e3eafc;  padding: 10px;  margin-top: 12px;.participants-section {}  color: #666;  padding: 20px;  margin-top: 30px;  text-align: center;footer {}  display: none;.hidden {}  border: 1px solid #bee5eb;  color: #0c5460;  background-color: #d1ecf1;.info {}  border: 1px solid #ef9a9a;  color: #c62828;  background-color: #ffebee;.error {}  border: 1px solid #a5d6a7;  color: #2e7d32;  background-color: #e8f5e9;.success {}  border-radius: 4px;  padding: 10px;  margin-top: 20px;.message {}  background-color: #3949ab;button:hover {}  transition: background-color 0.2s;  cursor: pointer;  border-radius: 5px;  font-size: 16px;  padding: 10px 15px;  border: none;  color: white;  background-color: #1a237e;button {}  font-size: 16px;  border-radius: 4px;  border: 1px solid #ddd;  padding: 10px;  width: 100%;.form-group select {.form-group input,}  font-weight: bold;  margin-bottom: 5px;  display: block;.form-group label {}  margin-bottom: 15px;.form-group {}  margin-bottom: 8px;.activity-card p {}  color: #0066cc;  margin-bottom: 10px;.activity-card h4 {}  background-color: #f9f9f9;  border-radius: 5px;  border: 1px solid #ddd;  padding: 15px;  margin-bottom: 15px;.activity-card {}  color: #1a237e;  border-bottom: 1px solid #ddd;  padding-bottom: 10px;  margin-bottom: 20px;section h3 {}  max-width: 500px;  width: 100%;  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);  border-radius: 5px;  padding: 20px;  background-color: white;section {}  }    grid-template-columns: 2fr 1fr;  main {@media (min-width: 768px) {}  justify-content: center;  gap: 30px;  flex-wrap: wrap;  display: flex;main {}  margin-bottom: 10px;header h1 {}  border-radius: 5px;  color: white;  background-color: #1a237e;  margin-bottom: 30px;  padding: 20px 0;  text-align: center;header {}  background-color: #f5f5f5;  padding: 20px;  margin: 0 auto;  max-width: 1200px;  color: #333;  line-height: 1.6;  font-family: Arial, sans-serif;body {}  font-family: Arial, sans-serif;  padding: 0;  margin: 0;  box-sizing: border-box;  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const spotsLeft = details.max_participants - details.participants.length;

        // Dodaj sekcję uczestników jako ładną listę
        const participantsList = details.participants.length
          ? `<ul class="participants-list">
                ${details.participants.map(email => `<li>${email}</li>`).join("")}
             </ul>`
          : `<p class="no-participants">Brak zapisanych uczestników.</p>`;

        activityCard.innerHTML = `
          <h4>${name}</h4>
          <p>${details.description}</p>
          <p><strong>Schedule:</strong> ${details.schedule}</p>
          <p><strong>Availability:</strong> ${spotsLeft} spots left</p>
          <div class="participants-section">
            <strong>Participants:</strong>
            ${participantsList}
          </div>
        `;

        activitiesList.appendChild(activityCard);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Initialize app
  fetchActivities();
});
