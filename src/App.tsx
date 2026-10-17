import { MotionConfig } from "framer-motion";
import Portfolio from "./pages/Portfolio";
import type { FC } from "react";

const App: FC = () => {
  return (
    <MotionConfig reducedMotion="user">
      <div className="App">
        <Portfolio />
      </div>
    </MotionConfig>
  );
};

export default App;
