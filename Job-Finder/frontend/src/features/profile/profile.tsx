import "./profile.css";

import { useNavigate, useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../../shared/config/axiosinstance";


interface User {
  _id: string;
  username: string;
  fullName: string;
  role: string;
  skills: string;
}

interface EditFormData {
  fullName: string;
  role: string;
  skillsText: string;
}

function Profile() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<EditFormData>({
    fullName: "",
    role: "",
    skillsText: "",
  });
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      let response;
      if (userId) {
        response = await axiosInstance.get(`/user/user/${userId}`);
        setIsOwnProfile(false);
      } else {
        response = await axiosInstance.get("/user/profile");
        setIsOwnProfile(true);
      }
      setUser(response.data.user);
      setEditForm({
        fullName: response.data.user.fullName || "",
        role: response.data.user.role || "Professional",
        skillsText: response.data.user.skills || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setEditForm({
        fullName: user.fullName || "",
        role: user.role || "Professional",
        skillsText: user.skills || "",
      });
    }
  };

  const handleSave = async () => {
    try {
      const requestData = {
        fullName: editForm.fullName,
        role: editForm.role,
        skills: editForm.skillsText,
      };
      const response = await axiosInstance.put("/user/profile", requestData);
      setUser(response.data.user);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading) return <div className="app-container">Loading...</div>;
  if (!user) return <div className="app-container">User not found</div>;

  return (
    <div className="profile-container">
      {/* Sidebar */}
      <aside className="profile-sidebar">
        <div className="profile-avatar">
          
        </div>
        <h2 className="profile-name">{user.fullName}</h2>
        <p className="profile-role">{user.role}</p>

        {/* Sidebar Navigation */}
        <nav className="sidebar-nav">
          <ul>
            <li><Link to="/home">Back</Link></li>
            {isOwnProfile && (
              <>
                <li><button onClick={handleEdit}>Edit Profile</button></li>
                <li><button onClick={handleLogout}>Logout</button></li>
              </>
            )}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="profile-main">
        <div className="profile-header">
          <h1>{user.fullName}</h1>
          <p>{user.role}</p>
        </div>

        <section className="profile-skills">
          <h2>Skills</h2>
          <div className="skills-text">
            {user.skills ? user.skills.split(",").map(skill => (
              <span key={skill} className="skill-badge">{skill.trim()}</span>
            )) : "No skills provided"}
          </div>
        </section>

        {/* Additional Sections */}
        <div className="additional-sections">
          <div className="section about-section">
            <h2>About Me</h2>
            <p>{user.fullName} is a skilled {user.role}. Passionate about delivering high-quality work and building innovative solutions. Experienced in {user.skills || "various technologies"}.</p>
          </div>

          <div className="section projects-section">
            <h2>Recent Projects</h2>
            <ul>
              <li>Project A - Web Application Development</li>
              <li>Project B - UI/UX Redesign</li>
              <li>Project C - API Integration & Automation</li>
            </ul>
          </div>

          <div className="section contact-section">
            <h2>Contact & Info</h2>
            <p>Email: {user.username}@example.com</p>
            <p>Location: Kathmandu, Nepal</p>
            <p>Availability: Open to opportunities</p>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {isEditing && isOwnProfile && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Profile</h2>
            <div className="form-group">
              <label>Full Name:</label>
              <input type="text" value={editForm.fullName} onChange={e => setEditForm(prev => ({ ...prev, fullName: e.target.value }))}/>
            </div>
            <div className="form-group">
              <label>Role:</label>
              <input type="text" value={editForm.role} onChange={e => setEditForm(prev => ({ ...prev, role: e.target.value }))}/>
            </div>
            <div className="form-group">
              <label>Skills (comma-separated):</label>
              <textarea value={editForm.skillsText} onChange={e => setEditForm(prev => ({ ...prev, skillsText: e.target.value }))}/>
            </div>
            <div className="modal-buttons">
              <button className="save-btn" onClick={handleSave}>Save</button>
              <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
