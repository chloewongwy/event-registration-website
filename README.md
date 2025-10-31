# Event Registration Website

A professional, responsive event website for university (HKMU), built with **pure HTML, CSS, and vanilla JavaScript** — no frameworks or libraries.

## 🌐 Live Demo
**[View Live Website →](https://chloewongwy-event-registration-demo.vercel.app/)**

## 📁 Project Structure

```
├── index.html          # Main HTML file
├── script.js           # JavaScript for interactivity and data loading
├── data.json           # Programme data (events, speakers, times)
├── styles.css          # Main stylesheet with HKMU branding
└── README.md           # This file
```

## 💡 Interactive Features

### 1. Tech/AI Banner Animation
- Floating digital particles with randomized movement
- Animated timeline with event dates
- Glowing badges and progress bars
- Gradient overlays and scanlines
- Tech-inspired typography effects
<img width="1918" height="696" alt="image" src="https://github.com/user-attachments/assets/38a3a406-ff36-4d9a-9b88-aeddbbe1aaa9" />


### 2. Overview Cards → Programme Filtering
Click any day card in the Overview section to:
- Filter the programme to that specific day
- Update the active filter button
- Auto-scroll to the programme section
- Visual feedback with hover/active states

### 3. Day Filter Buttons
Toggle between:
- **All Days** — Show complete schedule
- **Day 1 (11 Aug)** — AI & Opening Ceremony
- **Day 2 (12 Aug)** — SoTL Day
- **Day 3 (18 Aug)** — Workshops
<img width="1903" height="812" alt="image" src="https://github.com/user-attachments/assets/24de3db0-36b9-4d46-b790-bd7221c7d7ff" />


### 4. Registration System
- **School/Office Modal:** Multi-select from 16 options
- **Event Modal:** Select events grouped by day
- **Form Validation:** Email format and required fields
- **Success Feedback:** Confirmation message with auto-reset
<img width="1905" height="816" alt="image" src="https://github.com/user-attachments/assets/621fafe3-b26a-40c0-af05-81778976ff20" />
<img width="1165" height="841" alt="image" src="https://github.com/user-attachments/assets/95250d1d-c1e6-46c7-8b83-97ab9e608fe8" />


## 📊 Data Structure

The programme schedule is stored in `data.json` with the following format:

```json
{
  "programmeData": [
    {
      "programmeId": "1101",
      "day": 11,
      "time": "9:30am-9:35am",
      "venue": "C0G01, Main Campus",
      "topic": "Opening Remarks",
      "synopsis": "Welcome address...",
      "speaker": ["Prof. Thomas Baker"],
      "language": "ENG",
      "facilitator": "Dr. Smith",
      "note": "Special requirements"
    }
  ]
}
```

### Field Descriptions
| Field | Type | Description |
|-------|------|-------------|
| `programmeId` | String | Unique ID (format: DDXX) |
| `day` | Number | Day of month (11, 12, 18) |
| `time` | String | Event time slot |
| `venue` | String | Location (empty for breaks) |
| `topic` | String | Event title |
| `synopsis` | String | Detailed description |
| `speaker` | Array | List of speaker names |
| `language` | String | Language code (e.g., "ENG") |
| `facilitator` | String | Optional facilitator |
| `note` | String | Special notes/requirements |

---
## 🔌 API Usage
### Fetch API for Dynamic Data Loading
This website uses the native **Fetch API** to load programme data dynamically from `data.json`. This approach demonstrates modern JavaScript without requiring external libraries.

#### Implementation

```javascript
// Load data from JSON file
async function loadProgrammeData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        programmeData = data.programmeData;
        renderProgrammes();
        populateEventOptions();
    } catch (error) {
        console.error('Error loading programme data:', error);
        // Display user-friendly error message
    }
}
```

---

## 📄 License

This project is available for portfolio demonstration purposes. Event content and HKMU branding are used for educational demonstration only.

---
