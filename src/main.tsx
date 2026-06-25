// =============================================================================
// MAIN ENTRY POINT
// =============================================================================
// Yeh file sab se pehle chalti hai jab user website kholta hai
// Iska kaam:
// 1. React root create karna
// 2. Redux Provider se wrap karna (taake poori app ko store mile)
// 3. App component render karna
// =============================================================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';   // Redux ↔ React bridge
import { store } from  './store/index';           // Humara Redux store (Step 6 se)
import App from './App';                   // Main layout component
import './index.css';                       // Tailwind CSS import

// ============================================================================
// React 18 createRoot API
// =============================================================================
// createRoot = React 18 ka new way
// Ismein Concurrent Features enable hote hain (better performance)
// "!" = TypeScript ko pata hai ke element null nahi hoga
// =============================================================================
const rootElement = document.getElementById('root')!;
const root = ReactDOM.createRoot(rootElement);

// =============================================================================
// Render
// =============================================================================
// StrictMode = Development mein components double render karta hai
// Isse side-effects aur bugs pakde jate hain
// Provider = Redux store ko React context mein daalta hai
// Ab App ke andar koi bhi component useSelector se data le sakta hai
// =============================================================================
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);