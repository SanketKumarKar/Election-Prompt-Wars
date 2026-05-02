import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { translateText } from '../lib/translateService';

export function useTranslation(text: string): string {
  const target = useStore(state => state.selectedLanguage);
  const [translated, setTranslated] = useState(text);

  useEffect(() => {
    if (target === 'en' || !text) {
      setTranslated(text);
      return;
    }
    let isMounted = true;
    translateText(text, target).then(t => {
      // Decode HTML entities since the API returns format: 'html' which might encode things like ' -> &#39;
      if (isMounted) {
        const decoded = t.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
        setTranslated(decoded);
      }
    }).catch(console.error);

    return () => { isMounted = false; };
  }, [text, target]);

  return translated;
}

export function useTranslations(texts: string[]): string[] {
  const target = useStore(state => state.selectedLanguage);
  const [translated, setTranslated] = useState(texts);

  useEffect(() => {
    if (target === 'en' || !texts || texts.length === 0) {
      setTranslated(texts);
      return;
    }
    let isMounted = true;
    Promise.all(texts.map(t => translateText(t, target))).then(t => {
      if (isMounted) {
        const decoded = t.map(v => v.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&'));
        setTranslated(decoded);
      }
    }).catch(console.error);

    return () => { isMounted = false; };
  }, [texts.join('|'), target]);

  return translated;
}

export const T = ({ children }: { children: string }) => {
  const text = useTranslation(children);
  return <>{text}</>;
};
