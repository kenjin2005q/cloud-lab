import { useState, useEffect } from "react";

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    studentId: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    gender: "Male",
    major: "",
    gpa: "",
    year: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Lấy danh sách sinh viên
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch(
        "https://glorious-computing-machine-x54pv69q4qx526776-5000.app.github.dev/api/students",
      );
      const data = await res.json();
      console.log("Raw API Response:", data);
      console.log("Type of data:", typeof data);
      console.log("Is Array:", Array.isArray(data));

      // XỬ LÝ NHIỀU TRƯỜNG HỢP DỮ LIỆU
      let studentList = [];

      if (Array.isArray(data)) {
        // Trường hợp 1: data là array trực tiếp
        studentList = data;
      } else if (data && typeof data === "object") {
        // Trường hợp 2: data là object

        // Kiểm tra nếu có field 'data' là array
        if (data.data && Array.isArray(data.data)) {
          studentList = data.data;
        }
        // Kiểm tra nếu có field 'students' là array
        else if (data.students && Array.isArray(data.students)) {
          studentList = data.students;
        }
        // Trường hợp 3: object chứa các student object
        else {
          const values = Object.values(data);
          // Lọc các object có chứa studentId
          const filtered = values.filter(
            (item) => item && typeof item === "object" && item.studentId,
          );
          if (filtered.length > 0) {
            studentList = filtered;
          } else {
            studentList = [];
          }
        }
      }

      console.log("Processed Students:", studentList);
      console.log("Number of students:", studentList.length);
      setStudents(studentList);
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents([]);
    }
  };

  // Xử lý thay đổi form
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Thêm hoặc cập nhật sinh viên
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingId
        ? `https://glorious-computing-machine-x54pv69q4qx526776-5000.app.github.dev/api/students/${editingId}`
        : "https://glorious-computing-machine-x54pv69q4qx526776-5000.app.github.dev/api/students";

      const method = editingId ? "PUT" : "POST";

      console.log("Sending to:", url);
      console.log("Method:", method);
      console.log("Data:", formData);

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("Response:", data);

      if (res.ok) {
        await fetchStudents(); // Reload danh sách
        setFormData({
          studentId: "",
          fullName: "",
          email: "",
          phone: "",
          address: "",
          gender: "Male",
          major: "",
          gpa: "",
          year: "",
        });
        setEditingId(null);
        alert(
          editingId ? "✅ Updated successfully!" : "✅ Added successfully!",
        );
      } else {
        alert("❌ Error: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Network Error! Please check backend server.");
    } finally {
      setLoading(false);
    }
  };

  // Xóa sinh viên
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this student?")) return;

    try {
      const res = await fetch(
        `https://glorious-computing-machine-x54pv69q4qx526776-5000.app.github.dev/api/students/${id}`,
        {
          method: "DELETE",
        },
      );

      if (res.ok) {
        await fetchStudents();
        alert("✅ Deleted successfully!");
      } else {
        alert("❌ Delete failed!");
      }
    } catch (error) {
      console.error("Error deleting:", error);
      alert("❌ Network Error!");
    }
  };

  // Sửa sinh viên (điền dữ liệu vào form)
  const handleEdit = (student) => {
    setEditingId(student._id || student.id);
    setFormData({
      studentId: student.studentId || "",
      fullName: student.fullName || student.name || "",
      email: student.email || "",
      phone: student.phone || "",
      address: student.address || "",
      gender: student.gender || "Male",
      major: student.major || "",
      gpa: student.gpa || "",
      year: student.year || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <h1
        style={{
          color: "#333",
          borderBottom: "3px solid #007bff",
          paddingBottom: "10px",
        }}
      >
        🎓 Student List ({students.length})
      </h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#f8f9fa",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "30px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ marginTop: 0 }}>
          {editingId ? "✏️ Edit Student" : "➕ Add New Student"}
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "15px",
          }}
        >
          <input
            name="studentId"
            placeholder="Student ID *"
            value={formData.studentId}
            onChange={handleChange}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
            required
          />
          <input
            name="fullName"
            placeholder="Full Name *"
            value={formData.fullName}
            onChange={handleChange}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
            required
          />
          <input
            name="email"
            placeholder="Email *"
            type="email"
            value={formData.email}
            onChange={handleChange}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
            required
          />
          <input
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
          />
          <input
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input
            name="major"
            placeholder="Major"
            value={formData.major}
            onChange={handleChange}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
          />
          <input
            name="gpa"
            placeholder="GPA"
            type="number"
            step="0.1"
            value={formData.gpa}
            onChange={handleChange}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
          />
          <input
            name="year"
            placeholder="Year"
            type="number"
            value={formData.year}
            onChange={handleChange}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
          />
        </div>

        <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "10px 30px",
              backgroundColor: editingId ? "#ffc107" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            {loading
              ? "⏳ Processing..."
              : editingId
                ? "✏️ Update Student"
                : "➕ Add Student"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormData({
                  studentId: "",
                  fullName: "",
                  email: "",
                  phone: "",
                  address: "",
                  gender: "Male",
                  major: "",
                  gpa: "",
                  year: "",
                });
              }}
              style={{
                padding: "10px 30px",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              ❌ Cancel
            </button>
          )}
        </div>
      </form>

      {/* Danh sách sinh viên */}
      {students.length === 0 ? (
        <p style={{ textAlign: "center", color: "#888", padding: "40px" }}>
          📭 No students found
        </p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "white",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              borderRadius: "10px",
            }}
          >
            <thead>
              <tr style={{ background: "#007bff", color: "white" }}>
                <th style={{ padding: "12px", textAlign: "left" }}>ID</th>
                <th style={{ padding: "12px", textAlign: "left" }}>
                  Full Name
                </th>
                <th style={{ padding: "12px", textAlign: "left" }}>Email</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Phone</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Major</th>
                <th style={{ padding: "12px", textAlign: "center" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr
                  key={s._id || s.id || s.studentId}
                  style={{ borderBottom: "1px solid #eee" }}
                >
                  <td style={{ padding: "10px" }}>
                    <strong>{s.studentId}</strong>
                  </td>
                  <td style={{ padding: "10px" }}>{s.fullName || s.name}</td>
                  <td style={{ padding: "10px" }}>{s.email}</td>
                  <td style={{ padding: "10px" }}>{s.phone || "-"}</td>
                  <td style={{ padding: "10px" }}>{s.major || "-"}</td>
                  <td style={{ padding: "10px", textAlign: "center" }}>
                    <button
                      onClick={() => handleEdit(s)}
                      style={{
                        padding: "5px 15px",
                        backgroundColor: "#ffc107",
                        color: "#333",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        marginRight: "5px",
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(s._id || s.id)}
                      style={{
                        padding: "5px 15px",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
