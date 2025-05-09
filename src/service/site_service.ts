import axios from 'axios';
import { JSDOM } from 'jsdom';

export async function getCleanTextFromUrl(url) {
  const { data: html } = await axios.get(url);
  const dom = new JSDOM(html);
  const text = dom.window.document.body.textContent;
  return text.replace(/\s+/g, ' ').trim().slice(0, 12000); // Gemini input limit ~12k tokens
}