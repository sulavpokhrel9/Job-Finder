import { useState } from "react";
import { searchUsersApi } from "../../shared/config/api";
import { useNavigate } from "react-router-dom";
import "./home.css";

interface User {
  _id: string;
  username: string;
  fullName: string;
  role: string;
  skills: string;
}

interface Review {
  name: string;
  rating: number;
  comment: string;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewForm, setReviewForm] = useState<Review>({
    name: "",
    rating: 5,
    comment: "",
  });

  const navigate = useNavigate();

  // User search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await searchUsersApi(searchQuery);
      setSearchResults(response.data.users || []);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleUserClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  // Review form handlers
  const handleReviewChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setReviewForm((prev) => ({
      ...prev,
      [name]: name === "rating" ? Number(value) : value,
    }));
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let newReviews = [...reviews, reviewForm];
    if (newReviews.length > 3) {
      newReviews = newReviews.slice(1); // remove oldest
    }
    setReviews(newReviews);
    setReviewForm({ name: "", rating: 5, comment: "" });
  };

  return (
    <div className="jobfinder-home">
      {/* Header */}
      <header className="site-header">
        <div className="container-nav">
          <div className="logo">JobFinder</div>
          <nav className="nav-center">
            {/* Optional center links if needed */}
          </nav>
          <nav className="nav-right">
            <input
              type="text"
              placeholder="Search talented professionals..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              onKeyPress={handleSearchKeyPress}
              className="nav-search-input"
            />
            <button onClick={handleSearch} className="nav-search-button">
              Search
            </button>
            <a href="/profile" className="btn-profile">My Profile</a>
          </nav>
        </div>

        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="search-dropdown">
            {searchResults.map((user) => (
              <div
                key={user._id}
                className="dropdown-item"
                onClick={() => handleUserClick(user._id)}
              >
                <h4>{user.fullName || user.username}</h4>
                <p>{user.role || "Professional"}</p>
              </div>
            ))}
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="search-section">
        <h1 className="hero-title">
          Discover the <span className="highlight">perfect talent</span> for your project
        </h1>
        <p className="hero-subtext">
          Connect with verified professionals and find the right skillset to grow your business.
        </p>
      </section>

      {/* Customer Reviews */}
      <section className="customer-reviews">
        <h2>User Feedback</h2>

        {/* Review Form */}
        <form className="review-form" onSubmit={handleReviewSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={reviewForm.name}
            onChange={handleReviewChange}
            required
          />
          <select name="rating" value={reviewForm.rating} onChange={handleReviewChange}>
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>{r} Stars</option>
            ))}
          </select>
          <textarea
            name="comment"
            placeholder="Share your experience"
            value={reviewForm.comment}
            onChange={handleReviewChange}
            required
          />
          <button type="submit">Submit Review</button>
        </form>

        {/* Reviews Grid */}
        <div className="reviews-grid">
          {reviews.map((r, idx) => (
            <div key={idx} className="review-card">
              <h4>{r.name}</h4>
              <div className="review-rating">{r.rating} ⭐</div>
              <div className="review-comment">{r.comment}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-section footer-brand">
              <h3 className="footer-logo">JobFinder</h3>
              <p className="footer-description">
                Bridging skilled professionals with businesses around the world.
              </p>
            </div>

            <div className="footer-section">
              <h4>Professionals</h4>
              <ul>
                <li><a href="#">Create Profile</a></li>
                <li><a href="#">Explore Projects</a></li>
                <li><a href="#">Skill Tests</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Employers</h4>
              <ul>
                <li><a href="#">Post a Job</a></li>
                <li><a href="#">Find Talent</a></li>
                <li><a href="#">Enterprise Plans</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Company</h4>
              <ul>
                <li><a href="#">Who We Are</a></li>
                <li><a href="#">Get in Touch</a></li>
                <li><a href="#">Careers</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Support</h4>
              <ul>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms & Conditions</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
