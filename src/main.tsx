// Import the createRoot function from the React DOM package
//This is the modern way to render a React application
import { createRoot } from "react-dom/client";

// Import your main App Component
// This is the root react com that contains your entire app
import App from "./App.tsx";

// Import your global CSS file
import "./index.css";

// Find the HTML element with the id "root" in your index.html
// The "!" tells TypeScript that you are sure this element exists
//Then, create a React root and render your App component inside it
createRoot(document.getElementById("root")!).render(<App />);


// Essentially, this file is the entry point of your React application
// It finds the <div id="root"></div> in your HTML and tells React to render your App component there

/**
 * Questions: What is createRoot?
 * Answer: createRoot is a function from the React DOM package that initializes a 
 * React application in a specified DOM element. 
 * It is part of React's modern rendering API introduced in React 18, 
 * which supports concurrent features and improved performance.
 *
 * Questions: What is the ReactDOM package?
 * Answer: So React is basically a way to build UI components but the ReactDOM is the actual
 * package that puts it into place.
 **/