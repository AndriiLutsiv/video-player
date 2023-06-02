import './App.css';
import styles from './app.module.scss';
import { VideoPage } from './pages/video-page';
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className={styles.app}>
      <Routes>
        <Route path="share/:id" element={<VideoPage />} />
      </Routes>
    </div>
  );
}

export default App;
