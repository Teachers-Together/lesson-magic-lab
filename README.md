# EduPulse AI Games

Build a modern, AI-first educational game platform inspired by Wordwall but amplified by AI automation, named "EduPulse AI". 

The platform must be highly interactive, sleek, and responsive (mobile + desktop) using React, Tailwind CSS, and Shadcn UI. 

### 1. CORE ARCHITECTURE & PAGES

Build a single-page app structure with a persistent sidebar navigation containing:

- **Dashboard:** Overview of created activities, community templates, and recent student analytics.

- **AI Creator Hub (The Moat):** The central workspace where teachers generate games instantly via AI prompts or text inputs.

- **My Activities:** A library grid of saved games with options to Play, Edit, Share, or View Results.

- **Student Play Zone:** A clean, distraction-free view where students actually play a selected game.

### 2. DATA MODEL & STATE MANAGEMENT

Set up a robust local state (mocking a database schema) to manage:

- `activities`: array of objects containing id, title, subject, gradeLevel, gameType ('quiz', 'matchup', 'wheel'), contentData (the actual questions/answers), and createdAt.

- `gameTemplates`: 'Quiz' (multiple choice), 'Matchup' (drag-and-drop definitions), and 'Random Wheel' (click to spin and reveal a prompt).

### 3. THE AI CREATOR HUB (CORE FEATURE)

Create an interactive multi-step generator interface:

- **Input Methods:** A large text area for "Paste Lesson Text / Notes" and a prominent prompt box: "What do you want to teach today? (e.g., 3rd-grade fractions, Spanish past tense)".

- **Configuration Controls:** Dropdowns for Grade Level (K-12) and Game Type (Quiz, Matchup, Wheel).

- **Mock AI Processing Engine:** When the user clicks "Generate Game Assets", show a beautiful, multi-stage loading animation (e.g., "Step 1: Scaffolding curriculum...", "Step 2: Designing interactive vectors..."). 

- **The Magic Switch (Better than Wordwall):** Provide a "Differentiate / Adapt" toggle that lets the teacher instantly morph the generated content into "Dyslexia-Friendly Mode", "ELL/ESL Support", or "Simplified Reading Level" with simulated instant adjustments.

- **Preview & Edit Grid:** Once "generated", render the questions and answers in an editable table so teachers can tweak the text before finalizing.

### 4. FIVE PLAYABLE INTERACTIVE GAME ENGINES (HTML5 & WEB API POWERED)

When an activity is launched in the "Student Play Zone", render hyper-tactile HTML5 templates that feel alive, utilizing fluid animations and state-of-the-art interaction models:

- **Template A: Kinetic Flip Cards & Word Clicker**

  - **The Interaction:** A grid of beautiful 3D HTML5 card structures that smoothly flip on user click using CSS 3D transforms (`rotateY`). 

  - **Outside-the-Box Mechanic:** Once flipped, sentences are revealed where specific words are interactive "hotspots." Students must click the correct grammatical token or keyword. Incorrect clicks trigger a subtle HTML5 Vibration API pulse (on mobile) and a physical "shake" animation.

- **Template B: Fluid Physics Drag-and-Drop**

  - **The Interaction:** Utilize HTML5 Drag and Drop or pointer events to let students drag digital "sticky notes" or colored tokens containing terms.

  - **Outside-the-Box Mechanic:** Instead of a rigid grid, create an organic "Sorting Bin" interface. When an item is dragged over the correct drop zone, use SVG boundary paths to make the zone "swell" or magnetically snap the item into place with a satisfying pop effect, using absolute screen positioning for a fluid, desktop-to-mobile tactile feel.

- **Template C: The AI Wheel of Wonder (Canvas/SVG Hybrid)**

  - **The Interaction:** A beautiful, responsive SVG or HTML5 Canvas wheel. 

  - **Outside-the-Box Mechanic:** Implement a true pointer gesture swipe. Students can actually "flick" the wheel with their mouse or finger to spin it. The spinning velocity matches their swipe speed, decelerates naturally using a physics easing function, and dynamically brings up a full-screen micro-challenge when it stops.

- **Template D: Next-Gen Quiz**

  - Displays a progress bar, live score, and countdown timer.

  - Large, high-contrast question card.

  - Interactive multiple-choice grid buttons with instant hover, click, correct (green flash), and incorrect (red shake) visual states.

- **Template E: Interactive Matchup**

  - Two parallel vertical columns: "Items" on the left, "Definitions/Answers" on the right.

  - Implement smooth, functional drag-and-drop mechanics (using a library or native HTML5/Tailwind) allowing items to lock into place when matched correctly.

### 5. DESIGN SYSTEM & UX (COLOR THEORY TUNED)

Apply a sophisticated, high-energy secondary split-complementary color scheme optimized for accessibility and focus:

- **Base/Background:** Clean, spacious stark white and ultra-light gray (#F8F9FA) canvas elements to reduce cognitive overload.

- **Primary Brand Color (Trust & Magic):** Deep, royal Amethyst Purple (e.g., Tailwind `indigo-600` or `purple-700`) for headers, sidebar navigation, and primary branding elements.

- **Success & Progression Color (Growth):** A vibrant, high-contrast Mint/Emerald Green (e.g., Tailwind `emerald-500` or `green-500`) used exclusively for correct answers, progress bars, and positive achievement states.

- **Action & Interactive Color (Energy):** A bright, playful Coral-Orange (e.g., Tailwind `orange-500` or `amber-500`) reserved for high-priority CTA buttons, "SPIN" mechanics, and interactive game controls.

- **Feedback Loops:** Use crisp micro-interactions, canvas-confetti on game completion (using the purple, green, and orange color palette), and distinct, modern sound-effect toggles.

- **Gamification:** Display a "Game Over Summary Card" at the end of every play session showing Score, Time Taken, and a mock Leaderboard using the core color scheme.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1007fead-247f-4907-85de-87adf54bf3e7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
