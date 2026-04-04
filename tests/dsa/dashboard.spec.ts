import { test, expect } from '@playwright/test';

test.describe('DSA Privileged Workflows', () => {

  test('DSA Login is structurally available', async ({ page }) => {
    await page.goto('/dsa/login');
    
    // We expect the specific DSA agent login page to appear
    await expect(page.locator('text=DSA Portal')).toBeVisible();
    await expect(page.locator('text=Agent Login')).toBeVisible();
  });

});
