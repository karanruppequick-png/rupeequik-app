import { test, expect } from '@playwright/test';

test.describe('Customer Authentication Flows', () => {

  test('Registration page renders and validates empty submission', async ({ page }) => {
    await page.goto('/register');
    
    await expect(page.locator('text=Create your free account')).toBeVisible();
    
    // Attempt submitting without data
    await page.getByRole('button', { name: 'Create Account' }).click();
    
    // There should be HTML5 validation or manual validation errors (we just assert we stay on page)
    await expect(page).toHaveURL(/.*register.*/);
  });

  test('Login page renders and can show invalid credentials error', async ({ page }) => {
    await page.goto('/login');
    
    await expect(page.locator('text=Welcome back!')).toBeVisible();
    
    // Fill wrong data
    await page.fill('input[type="email"]', 'fakeUser999@rupeequik.com');
    await page.fill('input[type="password"]', 'wrongPassword123');
    
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Assert error state appears
    await expect(page.locator('text=Incorrect email or password')).toBeVisible();
  });

  test('OTP Verification template loads', async ({ page }) => {
    await page.goto('/verify-otp');
    
    await expect(page.locator('h2').filter({ hasText: 'Verify Mobile Number' })).toBeVisible();
    
    // There should be exactly 4 inputs for the OTP
    const inputs = page.locator('input[type="text"]');
    expect(await inputs.count()).toBe(4);
    
    // Button should be disabled initially
    const verifyBtn = page.getByRole('button', { name: 'Verify & Login' });
    await expect(verifyBtn).toBeDisabled();
  });

});
