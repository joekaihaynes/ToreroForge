const SUPABASE_URL = "https://anndsrdxolaetnmwnkyn.supabase.co";
const SUPABASE_KEY = "sb_publishable_oNna3bcd2rFqRi7EyX2hiw_kCj4e_8X";

const db = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


async function loadStudents() {
    const container = document.getElementById("students");

    const { data, error } = await db
        .from("students")
        .select("*")
        .order("id");

    if (error) {
        container.textContent = "Error: " + error.message;
        return;
    }

    container.replaceChildren();

    data.forEach(student => {
        const div = document.createElement("div");
        div.className = "student";

        const info = document.createElement("p");
        info.textContent = `${student.name} - ${student.major}`;

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";

        editButton.addEventListener("click", () => {
            editStudent(student);
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";

        deleteButton.addEventListener("click", () => {
            deleteStudent(student);
        });

        div.appendChild(info);
        div.appendChild(editButton);
        div.appendChild(deleteButton);
        container.appendChild(div);
    });
}


loadStudents();


document.getElementById("student-form")
    .addEventListener("submit", async function(event) {
        event.preventDefault();

        const name = document
            .getElementById("student-name")
            .value.trim();

        const major = document
            .getElementById("student-major")
            .value.trim();

        const message = document.getElementById("message");

        if (!name || !major) {
            message.textContent = "Please fill out both fields.";
            return;
        }

        const { error } = await db
            .from("students")
            .insert([{ name, major }]);

        if (error) {
            message.textContent = "Error: " + error.message;
            return;
        }

        message.textContent = "Student added successfully!";

        document.getElementById("student-form").reset();

        loadStudents();
    });


async function editStudent(student) {
    const newName = prompt("Enter new name:", student.name);

    if (newName === null) return;

    const newMajor = prompt("Enter new major:", student.major);

    if (newMajor === null) return;

    if (!newName.trim() || !newMajor.trim()) {
        alert("Name and major cannot be empty.");
        return;
    }

    const { error } = await db
        .from("students")
        .update({
            name: newName.trim(),
            major: newMajor.trim()
        })
        .eq("id", student.id);

    if (error) {
        alert("Error updating student: " + error.message);
        return;
    }

    alert("Student updated successfully!");
    loadStudents();
}


async function deleteStudent(student) {
    const confirmed = confirm(
        `Are you sure you want to delete ${student.name}?`
    );

    if (!confirmed) return;

    const { data, error } = await db
        .from("students")
        .delete()
        .eq("id", student.id)
        .select("id");

    if (error) {
        alert("Error deleting student: " + error.message);
        return;
    }

    if (data.length === 0) {
        alert("No student was deleted.");
        return;
    }

    alert("Student deleted successfully!");
    loadStudents();
}
