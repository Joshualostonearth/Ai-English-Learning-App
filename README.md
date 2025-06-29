EngBot - English Learning App
Overview
EngBot is a React Native mobile app designed to help users improve their English skills at a B1 (intermediate) level through interactive exercises. It includes four sections:

Quick Note:<br>
The generated tests in the App aren't that advanced since a small free gemini model was used. 

Vocabulary Test: Answer MCQs on word meanings. <br>
Reading: Read a generated paragraph and answer the MCQ questions asked.<br>
Fill in the Blanks: Complete a paragraph by selecting the correct set of words.<br>
Writing: Write essays based on prompts, with AI-evaluated scores for grammar, spelling, vocabulary, sentence structure, and overall quality.<br>

The app uses the Google Generative AI API (gemini-1.5-flash) for dynamic content generation and response evaluation.

Features<br>
Dynamic Content: Questions and content generated in real-time via Gemini API.<br>
User Feedback: Instant scoring with visual feedback (green for correct, red for incorrect).<br>

Technologies Used<br>
React Native: Cross-platform mobile app framework.<br>
Google Generative AI API (gemini-1.5-flash): Content generation and essay evaluation.<br>
react-native-dotenv: Secure environment variable management.<br>
React Native Paper: UI components (e.g., Appbar).<br>
React Navigation: Screen navigation.<br>

AI Assistance Acknowledgment<br>
Most of the EngBot code was generated and debugged using Grok 3 by xAI, including:<br>
Initial code for Reading.js, Vocab.js, FillinBlanks.js, and Writing.js.<br>
Debugging errors <br>
Fixes for imports, navigation, and API handling.<br>

Project Structure<br>
engbot/<br>
├── assets/                # Images (e.g., LogoDark.png)<br>
├── src/<br>
│   ├── Spelling.js        # Spelling Bee component<br>
│   ├── Vocab.js           # Vocabulary Test component<br>
│   ├── FillinBlanks.js    # Fill in the Blanks component<br>
│   ├── Writing.js         # Writing component<br>
├── .env                   # Environment variables (API key)<br>
├── package.json           # Dependencies and scripts<br>

Disclaimer:<br>
This code is provided "as is" without warranty of any kind, express or implied. The authors are not liable for any damages arising from its use.
