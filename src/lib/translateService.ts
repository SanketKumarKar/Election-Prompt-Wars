let batch: { text: string; target: string; resolve: (t: string) => void; reject: (e: any) => void }[] = [];
let batchTimeout: NodeJS.Timeout | null = null;
let cache: Record<string, Record<string, string>> = {}; // target -> { text -> translatedStr }

export const _clearCache = () => {
  cache = {};
};

export async function translateText(text: string, target: string): Promise<string> {
  if (target === 'en') return text;
  
  if (!cache[target]) cache[target] = {};
  if (cache[target][text]) return cache[target][text];

  return new Promise((resolve, reject) => {
    batch.push({ text, target, resolve, reject });
    
    if (!batchTimeout) {
      batchTimeout = setTimeout(async () => {
        // Group by target language
        const currentBatch = [...batch];
        batch = [];
        batchTimeout = null;

        const byTarget = currentBatch.reduce((acc, item) => {
          if (!acc[item.target]) acc[item.target] = [];
          acc[item.target].push(item);
          return acc;
        }, {} as Record<string, typeof currentBatch>);

        for (const [tg, items] of Object.entries(byTarget)) {
          const texts = items.map(item => item.text);
          try {
            const res = await fetch('/api/translate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text: texts, target: tg }),
            });
            const data = await res.json();
            if (data.error) {
              console.warn('Translation error:', data.error);
              items.forEach(item => item.resolve(item.text));
              continue;
            }

            const translations = Array.isArray(data.translatedText) ? data.translatedText : [data.translatedText];
            items.forEach((item, i) => {
              cache[tg][item.text] = translations[i] || item.text;
              item.resolve(translations[i] || item.text);
            });
          } catch (error) {
            console.warn('Translation fetch failed:', error);
            items.forEach(item => item.resolve(item.text));
          }
        }
      }, 50);
    }
  });
}
