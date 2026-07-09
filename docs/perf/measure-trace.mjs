import puppeteer from 'puppeteer';
import fs from 'fs';

async function measure() {
  console.log('Starting Puppeteer trace...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Enable tracing
  await page.tracing.start({ path: 'trace-baseline.json', screenshots: true });
  
  console.log('Navigating to http://localhost:3000');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  
  // Wait a bit for animations to settle
  await new Promise(r => setTimeout(r, 2000));
  
  // Simulate scroll to trigger layout thrashing animations (if any)
  await page.evaluate(() => {
    window.scrollBy(0, 1000);
  });
  await new Promise(r => setTimeout(r, 1000));
  
  await page.tracing.stop();
  await browser.close();
  
  console.log('Trace saved to trace-baseline.json');
}

measure().catch(console.error);
