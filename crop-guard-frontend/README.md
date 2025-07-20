# Crop Disease Detection Mobile App

Bring up the Crop Guard mobile app in minutes and explore its highly intuitive UI—built with Expo & React Native in TypeScript.

---

### 🔧 1. Prerequisites

- **Node.js** (≥ 16) & **npm** (or [Yarn](https://yarnpkg.com/))
- **Expo CLI**

  ```bash
  npm install -g expo-cli
  ```

- **TypeScript** (already configured—see `tsconfig.json`)

---

### 🛠️ 2. Installation

```bash
# 1. Clone and navigate
git clone https://github.com/your-org/Ghana-Hack-AI.git
cd Ghana-Hack-AI/crop-guard-frontend

# 2. Install dependencies
npm install
```

---

### ⚙️ 3. Configuration

Create a `.env` (or edit `config.ts`) in the project root:

```env
# crop-guard-frontend/.env
DEV_BASE_URL=https://<YOUR_NGROK_SUBDOMAIN>.ngrok.io
```

> **Tip:** Use the HTTPS URL from `ngrok http 8000` and omit quotes/semicolons.
> **Note:** You can also export this in `config.ts`:
>
> ```ts
> // config.ts
> export const API_BASE_URL = process.env.DEV_BASE_URL!;
> ```

---

### ▶️ 4. Running the App

Launch the Expo workflow:

```bash
# Starts Metro bundler and shows QR code for devices
npm run start
```

- **Android:**

  ```bash
  npm run android
  ```

- **iOS:**

  ```bash
  npm run ios
  ```

- **Web:**

  ```bash
  npm run web
  ```

---

### 📦 5. Available Scripts

| Command           | What it does                                           |
| ----------------- | ------------------------------------------------------ |
| `npm run start`   | Launches Metro bundler & Expo Dev Tools                |
| `npm run android` | Builds & runs on Android device/emulator               |
| `npm run ios`     | Builds & runs on iOS simulator/device                  |
| `npm run web`     | Opens in your default browser via React Native Web     |
| `npm run test`    | Runs Jest with TypeScript support (`jest-expo` preset) |

---

### 🧩 6. Key Dependencies

> Checked against [package.json](./package.json)

| Package                                       | Purpose                         |
| --------------------------------------------- | ------------------------------- |
| **expo** / **react-native**                   | Core framework                  |
| **typescript**                                | Type safety & developer tooling |
| **@react-navigation/native**                  | App navigation                  |
| **expo-camera** / **expo-image-picker**       | Capture & select images         |
| **@react-native-async-storage/async-storage** | Persist scan history            |
| **uuid**                                      | Unique IDs for each scan        |
| **date-fns**                                  | Formatting timestamps           |
| **@expo/vector-icons**                        | Rich iconography                |

---

### 📱 7. UI Screenshots

<table align="center">
  <tr>
    <th>Screen</th>
    <th>Preview</th>
  </tr>
  <tr>
    <td><code>Home</code><br/><em>Select your crop</em></td>
    <td><img src="../crop-guard-demo-assets/home.png" width="200" alt="Home Screen" /></td>
  </tr>
  <tr>
    <td><code>Image-Picker</code><br/><em>Choose existing photo</em></td>
    <td><img src="../crop-guard-demo-assets/select.png" width="200" alt="Image Picker Screen" /></td>
  </tr>
  <tr>
    <td><code>Camera</code><br/><em>Capture new photo</em></td>
    <td><img src="../crop-guard-demo-assets/camera.png" width="200" alt="Camera Screen" /></td>
  </tr>
  <tr>
    <td><code>Preview</code><br/><em>Confirm or retake</em></td>
    <td><img src="../crop-guard-demo-assets/preview.png" width="200" alt="Preview Screen" /></td>
  </tr>
  <tr>
    <td><code>History</code><br/><em>Review past scans</em></td>
    <td><img src="../crop-guard-demo-assets/history.png" width="200" alt="History Screen" /></td>
  </tr>
  <tr>
    <td><code>Analysis</code><br/><em>View results & advice</em></td>
    <td><img src="../crop-guard-demo-assets/analysis.png" width="200" alt="Analysis Screen" /></td>
  </tr>
</table>

> **Pro Tip:** Keep each screenshot under 200 px wide to ensure a uniform, clean layout.

---

### 🎯 8. Project Structure

```
crop-guard-frontend/
├─ assets/
│  ├─ images/           # App icons, splash screens
│  └─ demo-assets/      # UI mockup screenshots
├─ src/
│  ├─ components/       # Reusable UI pieces
│  ├─ screens/          # Home, Camera, Preview, Analysis, History
│  ├─ navigation/       # Stack & Tab navigators
│  ├─ services/         # API client & config
│  └─ App.tsx           # Entry point
├─ package.json
├─ tsconfig.json
├─ config.ts            # API_BASE_URL export
└─ .env                 # DEV_BASE_URL for ngrok
```

---
