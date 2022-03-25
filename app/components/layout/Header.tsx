import { Link } from "remix";
import { Theme, useTheme } from "~/utils/useTheme";

export default function Header() {
  const [theme, setTheme] = useTheme();

  const toggleDarkMode = () => {
    if (theme === Theme.DARK) {
      setTheme(Theme.LIGHT)
    } else {
      setTheme(Theme.DARK)
    }
  }

  return (
    <header>
      <h1>
        <Link to="/" style={{ textDecoration: "none" }}>Site Title</Link>
      </h1>
      <nav style={{ marginLeft: "1rem" }}>
        <ul className="nav">
          <li className="nav-item">
            <Link to="/posts">Posts</Link>
          </li>
          <li className="nav-item">
            <Link to="/admin">Admin</Link>
          </li>
        </ul>
      </nav>
      <button className="btn-text" style={{ marginLeft: "auto" }} onClick={toggleDarkMode}>
        <i className="material-icons" suppressHydrationWarning>
          {theme === Theme.DARK ? "light_mode" : "dark_mode"}
        </i>
      </button>
    </header>
  )
}