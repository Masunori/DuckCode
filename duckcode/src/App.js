import './styles/App.css';
import Gameplay from './pages/Gameplay/Gameplay';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UnsupportedScreenNotification from './globalcomponents/UnsupportedScreenNotification';

// window.MonacoEnvironment = {
//   getWorkerUrl: function(moduleId, label) {
//       if (label === 'typescript' || label === 'javascript') {
//           return 'public/monaco-workers/ts.worker.js';
//       } else if (label === 'css') {
//           return 'public/monaco-workers/css.worker.js';
//       } else if (label === 'html') {
//           return 'public/monaco-workers/html.worker.js';
//       } else if (label === 'json') {
//           return 'public/monaco-workers/json.worker.js';
//       } else {
//           return 'public/monaco-workers/editor.worker.js';
//       }
//   }
// };

// window.MonacoEnvironment = {
//   getWorkerUrl: function(moduleId, label) {
//     if (label === 'typescript' || label === 'javascript') {
//         return 'node_modules/monaco-editor/esm/vs/language/typescript/ts.worker.js';
//     } else if (label === 'css') {
//         return 'node_modules/monaco-editor/esm/vs/language/css/css.worker.js';
//     } else if (label === 'html') {
//         return 'node_modules/monaco-editor/esm/vs/language/html/html.worker.js';
//     } else if (label === 'json') {
//         return 'node_modules/monaco-editor/esm/vs/language/json/json.worker.js';
//     } else {
//         return 'node_modules/monaco-editor/esm/vs/editor/editor.worker.js';
//     }
//   }
// };

// window.MonacoEnvironment = {
//   getWorkerUrl: function(moduleId, label) {
//       if (label === 'typescript' || label === 'javascript') {
//           return 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.0/esm/vs/language/typescript/ts.worker.js';
//       } else if (label === 'css') {
//           return 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.0/esm/vs/language/css/css.worker.js';
//       } else if (label === 'html') {
//           return 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.0/esm/vs/language/html/html.worker.js';
//       } else if (label === 'json') {
//           return 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.0/esm/vs/language/json/json.worker.js';
//       } else {
//           return 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.0/esm/vs/editor/editor.worker.js';
//       }
//   }
// };

function App() {
  return (
    <div id='app'>
      <Router>
        <Routes>
          <Route path='/gameplay' element={<Gameplay />}></Route>
        </Routes>
      </Router>
      <UnsupportedScreenNotification />
    </div>
  );
}

// function observeAllChildren(element) {
//   element.childNodes.forEach(child => {
//     if (child.nodeType === 1) {
//       resizeObserver.observe(child);
//       observeAllChildren(child);
//     }
//   });
// }

// const resizeObserver = new ResizeObserver(entries => {
//   entries.forEach(entry => {
//     // Log the resized element (e.g., the Navbar)
//     console.log('Resized element:', entry.target);
//   });
// });

// observeAllChildren(document.documentElement); // Observe the Navbar directly

export default App;
