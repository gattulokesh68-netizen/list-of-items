const API_BASE = '/api/items';

// DOM Elements
const itemsList = document.getElementById('itemsList');
const addItemForm = document.getElementById('addItemForm');
const itemTitleInput = document.getElementById('itemTitle');
const itemDescriptionInput = document.getElementById('itemDescription');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  loadItems();
  addItemForm.addEventListener('submit', handleAddItem);
});

/**
 * Load all items from the API
 */
async function loadItems() {
  try {
    itemsList.innerHTML = '<div class="loading">Loading items...</div>';
    const response = await fetch(API_BASE);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const items = await response.json();

    if (items.length === 0) {
      itemsList.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📭</div>
          <p>No items yet. Add one to get started!</p>
        </div>
      `;
    } else {
      itemsList.innerHTML = items.map(item => createItemCard(item)).join('');
      attachEventListeners();
    }
  } catch (error) {
    console.error('Error loading items:', error);
    itemsList.innerHTML = `
      <div class="error">
        Failed to load items. Please try again later.
      </div>
    `;
  }
}

/**
 * Create HTML for an item card
 */
function createItemCard(item) {
  const createdDate = new Date(item.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return `
    <div class="item-card" data-item-id="${item.id}">
      <h3 class="item-title">${escapeHtml(item.title)}</h3>
      ${item.description ? `<p class="item-description">${escapeHtml(item.description)}</p>` : ''}
      <div class="item-meta">Added on ${createdDate}</div>
      <div class="vote-count">
        ${item.votes}
        <span>votes</span>
      </div>
      <div class="item-actions">
        <button class="btn btn-vote vote-btn" data-item-id="${item.id}">
          👍 Vote
        </button>
        <button class="btn btn-delete delete-btn" data-item-id="${item.id}">
          🗑️ Remove
        </button>
      </div>
    </div>
  `;
}

/**
 * Handle adding a new item
 */
async function handleAddItem(e) {
  e.preventDefault();

  const title = itemTitleInput.value.trim();
  const description = itemDescriptionInput.value.trim();

  if (!title) {
    showNotification('Please enter a title', 'error');
    return;
  }

  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, description })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const newItem = await response.json();
    console.log('Item added:', newItem);

    // Clear form
    addItemForm.reset();
    itemTitleInput.focus();

    // Reload items
    await loadItems();
    showNotification('Item added successfully!', 'success');
  } catch (error) {
    console.error('Error adding item:', error);
    showNotification('Failed to add item. Please try again.', 'error');
  }
}

/**
 * Attach event listeners to dynamically created elements
 */
function attachEventListeners() {
  // Vote buttons
  document.querySelectorAll('.vote-btn').forEach(btn => {
    btn.addEventListener('click', handleVote);
  });

  // Delete buttons
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', handleDelete);
  });
}

/**
 * Handle voting on an item
 */
async function handleVote(e) {
  const itemId = e.target.dataset.itemId;
  const btn = e.target;

  // Disable button temporarily
  btn.disabled = true;
  btn.classList.add('voted');

  try {
    const response = await fetch(`${API_BASE}/${itemId}/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const updatedItem = await response.json();
    console.log('Vote recorded:', updatedItem);

    // Update the vote count in the UI
    const card = document.querySelector(`[data-item-id="${itemId}"]`);
    const voteCount = card.querySelector('.vote-count');
    voteCount.textContent = updatedItem.votes + '\nvotes';

    // Re-enable button
    btn.disabled = false;
    btn.classList.remove('voted');

    // Re-sort items by votes
    await loadItems();
  } catch (error) {
    console.error('Error voting:', error);
    btn.disabled = false;
    btn.classList.remove('voted');
    showNotification('Failed to record vote. Please try again.', 'error');
  }
}

/**
 * Handle deleting an item
 */
async function handleDelete(e) {
  const itemId = e.target.dataset.itemId;

  if (!confirm('Are you sure you want to delete this item?')) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/${itemId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('Item deleted');
    await loadItems();
    showNotification('Item deleted successfully!', 'success');
  } catch (error) {
    console.error('Error deleting item:', error);
    showNotification('Failed to delete item. Please try again.', 'error');
  }
}

/**
 * Show a notification message
 */
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = type;
  notification.textContent = message;
  notification.style.position = 'fixed';
  notification.style.top = '20px';
  notification.style.right = '20px';
  notification.style.zIndex = '1000';
  notification.style.maxWidth = '400px';

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
