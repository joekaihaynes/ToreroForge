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
        div.textContent = `${student.name} - ${student.major}`;
        container.appendChild(div);
    });
}

loadStudents();
