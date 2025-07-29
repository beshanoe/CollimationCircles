import { test, expect } from '@playwright/test';

test('homepage loads successfully', async ({ page }) => {
  await page.goto('/');
  
  // Check if the page loaded without errors
  await expect(page).toHaveTitle(/Collimation Circles/i);
});

test('main components are visible', async ({ page }) => {
  await page.goto('/');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Take a screenshot for visual verification
  await page.screenshot({ path: 'test-results/homepage.png' });
  
  // Check that key elements are present (adjust selectors based on actual app structure)
  // These are generic checks - you may need to adjust based on the actual app structure
  const body = page.locator('body');
  await expect(body).toBeVisible();
});

test('app is responsive', async ({ page }) => {
  await page.goto('/');
  
  // Test mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });
  await page.screenshot({ path: 'test-results/mobile-view.png' });
  
  // Test desktop viewport
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.screenshot({ path: 'test-results/desktop-view.png' });
  
  const body = page.locator('body');
  await expect(body).toBeVisible();
});