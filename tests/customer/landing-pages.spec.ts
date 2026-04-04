import { test, expect } from '@playwright/test';

test.describe('Customer Landing Pages', () => {

  test('Homepage should load successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check main branding header
    await expect(page.locator('h1').filter({ hasText: /India's best/i })).toBeVisible();
    
    // Ensure all CTA buttons exist
    const applyButtons = page.locator('text=Check Your Eligibility');
    expect(await applyButtons.count()).toBeGreaterThan(0);
  });

  test('Personal Loan page should load and run EMI Calculator', async ({ page }) => {
    await page.goto('/personal-loan');
    
    // Check page loaded
    await expect(page.locator('h1').filter({ hasText: 'Personal Loan' })).toBeVisible();

    // The EMI calculator amount input/text should exist
    await expect(page.locator('text=Calculate Your')).toBeVisible();
    
    // Try to click an "Apply Now" button to see logic works
    const applyButton = page.locator('a:has-text("Apply Now")').first();
    await applyButton.click();
    
    // After clicking apply from personal loan, we should be redirected to the /apply form
    await expect(page).toHaveURL(/.*apply.*/);
  });

  test('Home Loan page loads correctly', async ({ page }) => {
    await page.goto('/home-loan');
    await expect(page.locator('h1').filter({ hasText: 'Home Loan' })).toBeVisible();
  });

  test('Business Loan page loads correctly', async ({ page }) => {
    await page.goto('/business-loan');
    await expect(page.locator('h1').filter({ hasText: 'Business Loan' })).toBeVisible();
  });

  test('Credit Card page loads and has filters', async ({ page }) => {
    await page.goto('/credit-card');
    await expect(page.locator('text=Explore Top Credit Card Options')).toBeVisible();
    
    // Ensure filter sidebars exist
    await expect(page.locator('text=BANKS').first()).toBeVisible();
  });

});
