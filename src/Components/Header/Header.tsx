import styles from "./Header.module.css";
import logoImg from "../../assets/JSSYSTEM.png";

//router
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className={styles.container}>
      <Link to="/">
        <img src={logoImg} alt="logo cripto js" />
      </Link>
    </header>
  );
}
