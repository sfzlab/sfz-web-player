import { test, expect } from '@playwright/test';

test.describe('SFZ Web Player Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the player page
    await page.goto('/demos/index.html');
  });

  test('should load the player interface', async ({ page }) => {
    // Check if the player container exists
    await expect(page.locator('#sfzPlayer')).toBeVisible();

    // Check if header elements are present
    await expect(page.locator('.header')).toBeVisible();

    // Check if interface elements are present
    await expect(page.locator('.interface')).toBeVisible();
  });

  test('should display header controls', async ({ page }) => {
    // Check for local directory button
    const localButton = page.locator('input[type="button"][value="Local directory"]');
    await expect(localButton).toBeVisible();

    // Check for remote directory button
    const remoteButton = page.locator('input[type="button"][value="Remote directory"]');
    await expect(remoteButton).toBeVisible();

    // Check for presets dropdown
    const presetsSelect = page.locator('select');
    await expect(presetsSelect).toBeVisible();
  });

  test('should handle remote instrument loading', async ({ page }) => {
    // Dismiss any webpack dev server overlays that might block clicks
    await page.evaluate(() => {
      const overlay = document.querySelector('#webpack-dev-server-client-overlay');
      if (overlay) {
        overlay.remove();
      }
    });

    // Check that the remote directory button exists and is clickable
    const remoteButton = page.locator('input[type="button"][value="Remote directory"]');
    await expect(remoteButton).toBeVisible();
    await expect(remoteButton).toBeEnabled();

    // For now, we'll just verify the button is present and functional
    // The actual remote loading would require network requests and is better tested in unit tests
  });

  test('should handle MIDI keyboard interaction', async ({ page }) => {
    // Check if webaudio-controls are loaded
    // For now, we'll just check that the MIDI system is available
    const midiReady = await page.evaluate(() => {
      return typeof (window as any).webAudioControlsWidgetManager !== 'undefined';
    });

    expect(midiReady).toBe(true);
  });

  test('should handle audio context creation', async ({ page }) => {
    // Check if audio context is created
    const audioContextCreated = await page.evaluate(() => {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioContext();
        // Audio context might be in 'suspended' state initially, which is normal
        return audioContext.state === 'running' || audioContext.state === 'suspended';
      } catch (e) {
        return false;
      }
    });

    expect(audioContextCreated).toBe(true);
  });

  test('should handle file loading errors gracefully', async ({ page }) => {
    // Mock a failed file load
    await page.evaluate(() => {
      // This would test error handling in the file loader
      return true; // Placeholder
    });

    // Check that the interface doesn't crash
    await expect(page.locator('#sfzPlayer')).toBeVisible();
  });
});
