/**
 * UI utility functions
 */

/**
 * Create and show a warning banner
 */
export function createWarningBanner(browserName: string): void {
  // Remove existing banner if any
  const existingBanner = document.querySelector('.in-app-warning');
  if (existingBanner) {
    existingBanner.remove();
  }

  const banner = document.createElement('div');
  banner.className = 'in-app-warning';
  banner.setAttribute('role', 'alert');
  banner.setAttribute('aria-live', 'polite');
  
  banner.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; gap: 15px;">
      <span>⚠️ You're viewing this in ${browserName}'s in-app browser.</span>
      <button 
        type="button" 
        class="dismiss-btn" 
        aria-label="Dismiss warning"
        style="background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); color: white; padding: 5px 15px; border-radius: 4px; cursor: pointer; font-size: 14px; transition: background 0.2s;">
        Dismiss
      </button>
    </div>
  `;

  // Add click handler for dismiss button
  const dismissBtn = banner.querySelector('.dismiss-btn');
  if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
      banner.remove();
    });
  }

  document.body.appendChild(banner);
}

/**
 * Remove warning banner
 */
export function removeWarningBanner(): void {
  const banner = document.querySelector('.in-app-warning');
  if (banner) {
    banner.remove();
  }
}

/**
 * Update element text safely
 */
export function updateElementText(elementId: string, text: string): void {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = text;
  }
}

/**
 * Update element HTML safely
 */
export function updateElementHTML(elementId: string, html: string): void {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = html;
  }
}

