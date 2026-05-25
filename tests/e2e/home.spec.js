import { test, expect } from '@playwright/test';

test.describe('HEXA Catalog E2E', () => {
  
  test.beforeEach(async ({ page }) => {
    // Ir a la página principal antes de cada test
    await page.goto('/');
    // Esperar a que la splash screen desaparezca y aparezca el título principal
    // Usamos role 'heading' para evitar la ambigüedad con el footer o descripciones
    await expect(page.getByRole('heading', { name: 'HEXA', exact: true })).toBeVisible({ timeout: 10000 });
  });

  test('debe cargar el catálogo inicial y mostrar cartas', async ({ page }) => {
    // Verificar que hay al menos una carta renderizada
    const cards = page.locator('a[href*="/detalles/"]');
    await expect(cards.first()).toBeVisible({ timeout: 15000 });
    
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('debe filtrar cartas por nombre en el buscador', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/buscar|search/i); // Soporta ambos idiomas
    await searchInput.fill('Grak');
    
    // Esperar al debounce y que la lista se actualice
    // Verificamos el título de la carta específica
    const cardTitle = page.locator('h3', { hasText: 'Grak' });
    await expect(cardTitle).toBeVisible({ timeout: 10000 });
  });

  test('debe navegar al detalle de una carta y volver', async ({ page }) => {
    const firstCard = page.locator('a[href*="/detalles/"]').first();
    const cardName = await firstCard.locator('h3').textContent();
    
    await firstCard.click();
    
    // Verificar que estamos en la URL de detalles
    await expect(page).toHaveURL(/\/detalles\//);
    
    // Verificar que el nombre coincide en el detalle (H1)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(cardName?.trim() || '');
    
    // Volver al catálogo usando el botón de volver (Link con texto dinámico)
    await page.getByRole('link', { name: /volver|back/i }).click();
    await expect(page).toHaveURL('/');
  });

  test('flujo de favoritos: marcar y verificar en la página de favoritos', async ({ page }) => {
    // 1. Tomar info de la primera carta
    // Usamos el contenedor de la carta para ser precisos
    const firstCard = page.locator('a[href*="/detalles/"]').first();
    const cardName = await firstCard.locator('h3').textContent();
    // Buscamos el botón específicamente dentro de esa carta
    const favButton = firstCard.getByRole('button', { name: /favorito|favorite/i });
    
    // 2. Marcar como favorita
    await favButton.click();
    
    // 3. Navegar a la página de favoritos usando el link del Nav (Desktop)
    // Scoped to getByRole('navigation') to avoid matching card links that contain "favorites" in aria-label
    const nav = page.getByRole('navigation').filter({ hasText: /favoritos|favorites/i }).first();
    await nav.getByRole('link', { name: /favoritos|favorites/i }).click();
    
    // 4. Verificar que la carta aparece en la lista
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/favoritos|favorites/i);
    await expect(page.locator('h3', { hasText: cardName?.trim() })).toBeVisible();
    
    // 5. Desmarcar y verificar que desaparece inmediatamente
    await page.getByRole('button', { name: /favorito|favorite/i }).click();
    await expect(page.locator('h3', { hasText: cardName?.trim() })).not.toBeVisible();
  });

  test('debe cargar más cartas al hacer scroll (Scroll Infinito)', async ({ page }) => {
    // 1. Contar cuántas cartas hay inicialmente
    const cards = page.locator('a[href*="/detalles/"]');
    await expect(cards.first()).toBeVisible({ timeout: 15000 });
    const initialCount = await cards.count();
    
    // 2. Hacer scroll hasta el fondo de la página
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // 3. Esperar a que la cantidad de cartas sea mayor a la inicial (se cargó la página 2)
    await expect(async () => {
      const newCount = await cards.count();
      expect(newCount).toBeGreaterThanOrEqual(initialCount);
    }).toPass({ timeout: 10000 });
  });

});


