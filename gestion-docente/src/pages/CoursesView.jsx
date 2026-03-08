import { useNavigate } from "react-router-dom";
import { CourseCard } from "../components/CourseCard";
import { getCourseSummary } from "../utils/courseStats";

export function CoursesView({ courses, setCourses, selCourseId, setSelCourseId, setSelStudent, setSelEncargo, setShowCourseForm, isMobile }) {
  const navigate = useNavigate();

  function handleSelect(courseId) {
    setSelCourseId(courseId);
    setSelStudent(null);
    setSelEncargo(null);
    navigate("/");
  }

  function handleDelete(courseId) {
    setCourses(p => p.filter(x => x.id !== courseId));
    if (selCourseId === courseId) {
      const remaining = courses.find(x => x.id !== courseId);
      if (remaining) setSelCourseId(remaining.id);
    }
  }

  const cols = isMobile ? "1fr" : "repeat(auto-fill, minmax(280px, 1fr))";

  return (
    <div style={{ padding: "0 28px 28px", flex: 1 }}>
      {/* Section header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ flex: 1, height: 1, background: "#1c1c1c" }} />
        <span style={{ fontSize: 10, fontWeight: 700, color: "#7a818c", textTransform: "uppercase", letterSpacing: 2 }}>
          {courses.length} curso{courses.length !== 1 ? "s" : ""}
        </span>
        <div style={{ flex: 1, height: 1, background: "#1c1c1c" }} />
      </div>

      {/* Cards grid */}
      <div style={{ display: "grid", gridTemplateColumns: cols, gap: 14, alignItems: "start" }}>
        {courses.map(course => (
          <CourseCard
            key={course.id}
            course={course}
            summary={getCourseSummary(course)}
            isSelected={course.id === selCourseId}
            onSelect={() => handleSelect(course.id)}
            onDelete={() => handleDelete(course.id)}
            canDelete={courses.length > 1}
          />
        ))}

        {/* Add new course card */}
        <div
          className="glass-card glass-hover"
          onClick={() => setShowCourseForm(true)}
          style={{
            borderRadius: 14,
            border: "2px dashed #252525",
            minHeight: 300,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            cursor: "pointer",
            background: "transparent",
            transition: "border-color 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#3a3a3a"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#252525"; }}
        >
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            background: "#111", border: "1px solid #2a2a2a",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 24, color: "#333", lineHeight: 1 }}>+</span>
          </div>
          <span style={{ fontSize: 11, color: "#7a818c", textTransform: "uppercase", letterSpacing: 1.5 }}>
            Nuevo curso
          </span>
        </div>
      </div>
    </div>
  );
}
