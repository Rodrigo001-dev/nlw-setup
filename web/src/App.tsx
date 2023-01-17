import { Habit } from "./components/Habit";

import "./styles/global.css";

function App() {
  return (
    <div>
      <Habit completed={10} />
      <Habit completed={2} />
      <Habit completed={11} />
      <Habit completed={3} />
      <Habit completed={6} />
      <Habit completed={10} />
    </div>
  );
}

export default App;
