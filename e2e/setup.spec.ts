import { test, expect } from '@playwright/test';

test.describe('Initial Setup Flow', () => {
  test('should allow creating a new household and partner', async ({ page }) => {
    // 1. Start at root, should redirect to /setup
    await page.goto('/');
    await expect(page).toHaveURL(/\/setup/);

    // 2. Create new household
    // Assuming there is a button "Neuen Haushalt erstellen"
    await page.getByRole('button', { name: /Neuen Haushalt/i }).click();

    // 3. Enter Household Name
    await page.getByPlaceholder(/Haushaltsname/i).fill('Test Haushalt');
    await page.getByRole('button', { name: /Erstellen/i }).click();

    // 4. Should see code (assuming it shows up)
    await expect(page.getByText(/Dein Haushaltscode/i)).toBeVisible();
    
    // 5. Continue to partner setup
    await page.getByRole('button', { name: /Weiter/i }).click();

    // 6. Enter Partner Name
    await page.getByPlaceholder(/Dein Name/i).fill('Test User');
    
    // 7. Select Avatar/Profile (assuming interaction)
    // This might depend on implementation details, let's just submit if possible
    await page.getByRole('button', { name: /Fertig/i }).click();

    // 8. Should redirect to Home
    await expect(page).toHaveURL('/');
    await expect(page.getByText(/Hallo Test User/i)).toBeVisible();
  });
});
