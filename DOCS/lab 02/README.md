# Setting Up a Next.js Client and Node.js Server on EC2

In this lab, we will set up a Next.js client and a Node.js server on an EC2 instance. The client will fetch data from the server, demonstrating a basic client-server interaction.

## Install `node` and `npm`

```sh
sudo apt update
sudo apt install nodejs npm
```

## Client Setup

### 1. Set Up Next.js App

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

4. Edit `tailwind.config.js` using any text editor like `nano` or `vim`:

    ```sh
    nano tailwind.config.js
    ```

    ```javascript
    // tailwind.config.js
    /** @type {import('tailwindcss').Config} */
    module.exports = {
      darkMode: 'class',
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

*Note: To save and exit in nano, press `Ctrl + X`, then `Y`, and then `Enter`.*

### 2. Add Home Page

1. Remove the existing `app/page.tsx` file:

    ```sh
    rm app/page.tsx
    ```

2. Create a new file `app/page.tsx`:

    ```sh
    nano app/page.tsx
    ```

    ```tsx
    // simple-next-app/app/page.tsx
    export default function Home() {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold text-blue-500">Hello World !! </h1>
      </div>
    );
    }
    ```

### 3. Add Fetch Data Page

Create a new file `app/server/page.tsx`:

```sh
nano app/server/page.tsx
```

```tsx
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function FetchData() {
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    axios.get('http://<ec2-instance-IP>:5000/data')
      .then(response => {
        setData(response.data.message); // Assuming the response has a message property
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <h1 className="text-4xl font-bold text-blue-500 mb-4">Data from Node.js Server</h1>
      {data ? (
        <p className="bg-white dark:bg-gray-800 dark:text-white p-4 rounded-lg shadow-md text-left">{data}</p>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      )}
    </div>
  );
}
```

*Note: Replace `<ec2-instance-IP>` with your EC2 instance's public IP address.*

### 4. Run the Next.js App

Start the Next.js development server:

```bash
npm run dev
```

Your Next.js app should be running at `http://<ec2-instance-IP>:3000`.


## Server Setup

### 1. Initialize Node.js Server

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

### 2. Create Server File

Create a new file `index.js`:

```sh
nano index.js
```

```javascript
const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());

app.get('/', (req, res) => {
  res.json({ message: 'Server is Running ....' });
});

app.get('/data', (req, res) => {
  res.json({ message: 'Hello from the Node.js server!' });
});

app.listen(port, () => {
  console.log(`Node.js server running at http://localhost:${port}`);
});
```

### 3. Run the Node.js Server

Start the Node.js server:

```bash
node index.js
```

Your Node.js server should be running at `http://localhost:5000`.

## Conclusion

You now have a Next.js client application running on `http://<ec2-instance-public-IP>:3000` that can fetch data from a Node.js server running on `http://<ec2-instance-public-IP>:5000`.

1. Open `http://<ec2-instance-public-IP>:3000` in your browser to see the "Hello World" message.

    ![Hello World](https://github.com/Galadon123/Nextjs-Nodejs-labs/blob/main/DOCS/lab%2002/images/1.png)

2. Open `http://<ec2-instance-public-IP>:3000/server` in your browser to see the response from the Node.js server running on port `5000`.

    ![Node.js Response](https://github.com/Galadon123/Nextjs-Nodejs-labs/blob/main/DOCS/lab%2002/images/2.png)

*Note: Replace `<ec2-instance-public-IP>` with your EC2 instance's public IP address.*