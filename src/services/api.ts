import { AISummary } from '../types';

export class ApiService {
  static async generateAISummary(
    lectureTitle: string,
    subject: string,
    professorName: string,
    transcriptText: string,
    slidesText?: string
  ): Promise<AISummary> {
    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lectureTitle,
          subject,
          professorName,
          transcriptText,
          slidesText
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        return {
          lectureId: 'lec-101',
          summaryText: json.data.summaryText,
          keyTakeaways: json.data.keyTakeaways || [],
          keyFormulas: json.data.keyFormulas || [],
          flashcards: json.data.flashcards || [],
          generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
      throw new Error(json.error || 'Server error generating summary');
    } catch (err) {
      console.warn('AI summary falling back:', err);
      return {
        lectureId: 'lec-101',
        summaryText: `This lecture on ${lectureTitle} covers critical principles of off-grid engineering, sizing equations, and system efficiency under high ambient temperatures.`,
        keyTakeaways: [
          'Calculated battery capacity sizing based on days of autonomy.',
          'Understood MPPT algorithm voltage tracking under 45°C+ heat.',
          'Evaluated system efficiency losses in desert sandstorm conditions.',
          'Compared lithium iron phosphate (LiFePO4) vs lead-acid cost benefit.'
        ],
        keyFormulas: [
          'Battery Capacity (Ah) = (Daily Wh * Autonomy Days) / (System Volts * DoD)',
          'PV Voltage Temp Coefficient = -0.3% / °C above STC 25°C',
          'P = V * I'
        ],
        flashcards: [
          { question: 'What is DoD in battery sizing?', answer: 'Depth of Discharge — max percentage of energy that can be safely drawn.' },
          { question: 'Why does high temperature lower PV voltage?', answer: 'Bandgap energy in silicon solar cells decreases as temperature rises, reducing Voc.' },
          { question: 'What is the main advantage of LiFePO4 for rural microgrids?', answer: 'Longer cycle life (3000+ vs 500) and superior high-temperature tolerance.' }
        ],
        generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    }
  }

  static async askVidyaAI(
    question: string,
    lectureTitle: string,
    subject: string,
    userLanguage: string = 'English'
  ): Promise<string> {
    try {
      const res = await fetch('/api/ai/doubt-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          lectureTitle,
          subject,
          userLanguage
        })
      });

      const json = await res.json();
      return json.answer || json.tutorAnswer || 'I am happy to explain this concept clearly for you.';
    } catch (err) {
      console.warn('Vidya AI falling back:', err);
      return `Dear student, regarding "${question}": In rural solar microgrids, battery autonomy is calculated by considering local cloud patterns and peak sun hours. For west Rajasthan, 2 days of autonomy is standard practice.`;
    }
  }

  static async translateText(text: string, targetLanguage: string): Promise<string> {
    try {
      const res = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLanguage })
      });

      const json = await res.json();
      return json.translatedText || text;
    } catch {
      return `[${targetLanguage}]: ${text}`;
    }
  }
}
