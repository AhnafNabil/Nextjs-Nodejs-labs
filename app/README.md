Here's a comprehensive step-by-step guide to set up a simple Next.js app that connects to a Node.js server.

### Step 1: Client Setup

#### 1. Set Up Next.js App

1. Create a new Next.js app:
    ```bash
    npx create-next-app@latest client
    cd client
    ```

2. Install necessary dependencies:
    ```bash
    npm install axios
    npm install -D tailwindcss postcss autoprefixer
    ```

3. Initialize Tailwind CSS:
    ```bash
    npx tailwindcss init -p
    ```

4. Edit `tailwind.config.js`:
    ```javascript
    // tailwind.config.js
    /** @type {import('tailwindcss').Config} */
    module.exports = {
      content: [
        './app/**/*.{js,ts,jsx,tsx}', // Add this line
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
      ],
      theme: {
        extend: {},
      },
      plugins: [],
    };
    ```

#### 2. Add Home Page

Create a new file `app/page.tsx`:

```tsx
// client/app/page.tsx
export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-500">Hello World !! </h1>
      <a href="/fetch" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">Connect to Server</a>
    </div>
  );
}
```

#### 3. Add Fetch Data Page

Create a new file `app/fetch/page.tsx`:

```tsx
// client/app/fetch/page.tsx
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function FetchData() {
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    axios.get('http://localhost:5000/data')
      .then(response => {
        setData(response.data.message); // Assuming the response has a message property
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-blue-500 mb-4">Data from Node.js Server</h1>
      {data ? (
        <p className="bg-white p-4 rounded-lg shadow-md text-left">{data}</p>
      ) : (
        <p className="text-gray-500">Loading...</p>
      )}
      <Link href="/">
        <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">Go back to Home</a>
      </Link>
    </div>
  );
}
```

#### 4. Run the Next.js App

Start the Next.js development server:
```bash
npm run dev
```
Your Next.js app should be running at `http://localhost:3000`.

### Step 2: Server Setup

#### 1. Initialize Node.js Server

1. Create a new directory for the Node.js server:
    ```bash
    mkdir server
    cd server
    ```

2. Initialize a new Node.js project:
    ```bash
    npm init -y
    ```

3. Install necessary dependencies:
    ```bash
    npm install express cors
    ```

#### 2. Create Server File

Create a new file `index.js`:

```javascript
// server/index.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());

app.get('/data', (req, res) => {
  res.json({ message: 'Hello from the Node.js server!' });
});

app.listen(port, () => {
  console.log(`Node.js server running at http://localhost:${port}`);
});
```

#### 3. Run the Node.js Server

Start the Node.js server:
```bash
node index.js
```
Your Node.js server should be running at `http://localhost:5000`.

### Conclusion

You now have a Next.js client application running on `http://localhost:3000` that can fetch data from a Node.js server running on `http://localhost:5000`. 

1. Open `http://localhost:3000` in your browser to see the "Hello World" message.
2. Click on the "Connect to Server" button to navigate to the `/fetch` route and see the message from the Node.js server.
3. Use the "Go back to Home" button to return to the home page.