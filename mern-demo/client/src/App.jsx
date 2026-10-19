import { useState, useEffect } from "react";

function App() {
  // Thay thế URL tuyệt đối bằng đường dẫn tương đối để Nginx Reverse Proxy xử lý ngầm
  const API_URL = "/api";

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

  // =====================================================
  // LẤY DANH SÁCH SINH VIÊN
  // =====================================================
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      console.log("GET:", `${API_URL}/students`);

      const res = await fetch(`${API_URL}/students`);

      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`);
      }

      const data = await res.json();

      console.log("Raw API Response:", data);

      let studentList = [];

      if (Array.isArray(data)) {
        studentList = data;
      } else if (data && typeof data === "object") {
        if (Array.isArray(data.data)) {
          studentList = data.data;
        } else if (Array.isArray(data.students)) {
          studentList = data.students;
        } else {
          const values = Object.values(data);
          const filtered = values.filter(
            (item) => item && typeof item === "object" && item.studentId,
          );
          if (filtered.length > 0) {
            studentList = filtered;
          }
        }
      }

      setStudents(studentList);
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents([]);
    }
  };

  // =====================================================
  // XỬ LÝ THAY ĐỔI FORM
  // =====================================================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================================
  // RESET FORM
  // =====================================================
  const resetForm = () => {
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
  };

  // =====================================================
  // THÊM / CẬP NHẬT SINH VIÊN
  // =====================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingId
        ? `${API_URL}/students/${editingId}`
        : `${API_URL}/students`;

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        await fetchStudents();
        resetForm();
        alert(
          method === "POST"
            ? "✅ Added successfully!"
            : "✅ Updated successfully!",
        );
      } else {
        alert("❌ Error: " + (data.message || "Unknown server error"));
      }
    } catch (error) {
      console.error("Error submitting student:", error);
      alert("❌ Network Error! Please check Nginx Proxy.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // XÓA SINH VIÊN
  // =====================================================
  const handleDelete = async (id) => {
    if (!id) {
      alert("❌ Student ID not found!");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?",
    );
    if (!confirmDelete) return;

    try {
      const url = `${API_URL}/students/${id}`;
      const res = await fetch(url, { method: "DELETE" });
      const data = await res.json();

      if (res.ok) {
        await fetchStudents();
        alert("✅ Deleted successfully!");
      } else {
        alert("❌ Delete failed: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("❌ Network Error! Please check Nginx Proxy.");
    }
  };

  // =====================================================
  // SỬA SINH VIÊN
  // =====================================================
  const handleEdit = (student) => {
    const id = student._id || student.id;

    if (!id) {
      alert("❌ Student ID not found!");
      return;
    }

    setEditingId(id);
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

  // =====================================================
  // GIAO DIỆN
  // =====================================================
  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      {/* TIÊU ĐỀ HỆ THỐNG PHIÊN BẢN 2.0 */}
      <div
        style={{
          borderBottom: "3px solid #007bff",
          paddingBottom: "10px",
          marginBottom: "20px",
        }}
      >
        <h1 style={{ color: "#333", margin: 0 }}>
          Danh Sách Sinh Viên ({students.length})
        </h1>
        <span
          style={{
            backgroundColor: "#28a745",
            color: "white",
            padding: "3px 8px",
            borderRadius: "5px",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          v2.0 - Unified Nginx Origin
        </span>
      </div>

      {/* FORM NẬP DỮ LIỆU */}
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
            required
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
          />
          <input
            name="fullName"
            placeholder="Full Name *"
            value={formData.fullName}
            onChange={handleChange}
            required
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
          />
          <input
            name="email"
            placeholder="Email *"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
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
              cursor: loading ? "not-allowed" : "pointer",
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
              onClick={resetForm}
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

      {/* DANH SÁCH BẢNG */}
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
