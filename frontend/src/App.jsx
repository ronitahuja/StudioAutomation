import Header from './components/Header'
import Form from './components/Form'
import {Routes,Route} from 'react-router-dom'
import AppForm from './components/AppForm'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <a href="/app" style={{ display: "block", color: "blue" }}>
                App
              </a>
              <a href="/appActions" style={{ display: "block", color: "blue" }}>
                AppAction
              </a>
            </div>
          }
        />
        <Route path="/app" element={<AppForm />} />
        <Route path="/appActions" element={<Form />} />
      </Routes>
    </>
  );
}

export default App;
