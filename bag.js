let bagItemObjects;
let bagItems = [];
const CONVENIENCE_FEE = 99;

onLoad();

function onLoad() {
  loadBagItemObjects();
  displayBagItems();
  displayBagSummary();
  displayBagIcon();
  setupMobileMenu();
  setupDarkMode();
}

function loadBagItemObjects() {
  let bagItemsStr = localStorage.getItem('bagItems');
  bagItems = bagItemsStr ? JSON.parse(bagItemsStr) : [];
  
  bagItemObjects = bagItems.map(itemId => {
    for (let i = 0; i < items.length; i++) {
      if (items[i].id === itemId) {
        return items[i];
      }
    }
  }).filter(item => item !== undefined);
}

function displayBagIcon() {
  let bagItemCountElement = document.querySelector(".bag-item-count");
  if (bagItemCountElement) {
    if (bagItems.length > 0) {
      bagItemCountElement.style.visibility = "visible";
      bagItemCountElement.innerText = bagItems.length;
    } else {
      bagItemCountElement.style.visibility = "hidden";
    }
  }
}

function removeFromBag(itemId) {
  // Find index of first occurrence and remove it
  const index = bagItems.indexOf(itemId);
  if (index > -1) {
    bagItems.splice(index, 1);
  }
  localStorage.setItem('bagItems', JSON.stringify(bagItems));
  loadBagItemObjects();
  displayBagItems();
  displayBagSummary();
  displayBagIcon();
}

function displayBagItems() {
  let containerElement = document.querySelector('.bag-items-container');
  if (!containerElement) return;

  if (bagItemObjects.length === 0) {
    containerElement.innerHTML = `
      <div class="empty-cart-message" style="text-align: center; padding: 40px 20px; border-right: none;">
        <span class="material-symbols-outlined" style="font-size: 80px; color: #ff3f6c; margin-bottom: 20px; font-variation-settings: 'FILL' 0, 'wght' 200, 'GRAD' 0, 'opsz' 48;">shopping_bag</span>
        <h2 style="font-size: 20px; color: var(--text-color); margin-bottom: 10px; font-weight: 700;">Hey, it feels so light!</h2>
        <p style="color: var(--text-light); font-size: 14px; margin-bottom: 25px;">There is nothing in your bag. Let's add some items.</p>
        <a href="index.html" style="display: inline-block; background-color: #ff3f6c; color: #fff; text-decoration: none; padding: 12px 30px; border-radius: 4px; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; transition: background-color 0.2s;">Go To Homepage</a>
      </div>
    `;
    containerElement.style.borderRight = 'none';
    containerElement.style.width = '100%';
    return;
  } else {
    // Restore styling if items are present
    if (window.innerWidth > 768) {
      containerElement.style.borderRight = '1px solid var(--border-color)';
    } else {
      containerElement.style.borderRight = 'none';
    }
    containerElement.style.width = 'auto';
  }

  let innerHTML = '';
  bagItemObjects.forEach(bagItem => {
    innerHTML += generateItemHTML(bagItem);
  });
  containerElement.innerHTML = innerHTML;
}

function generateItemHTML(item) {
  return `
  <div class="bag-item-container">
    <div class="item-left-part">
      <img class="bag-item-img" src="${item.image}">
    </div>
    <div class="item-right-part">
      <div class="company">${item.company}</div>
      <div class="item-name">${item.item_name}</div>
      <div class="price-container">
        <span class="current-price">Rs ${item.current_price}</span>
        <span class="original-price">Rs ${item.original_price}</span>
        <span class="discount-percentage">(${item.discount_percentage}% OFF)</span>
      </div>
      <div class="return-period">
        <span class="return-period-days">${item.return_period || 14} days</span> return available
      </div>
      <div class="delivery-details">
        Delivery by
        <span class="delivery-details-days">${item.delivery_date || '10 Oct 2023'}</span>
      </div>
    </div>
    <div class="remove-from-cart" onclick="removeFromBag('${item.id}')">X</div>
  </div>`;
}

function displayBagSummary() {
  let bagSummaryElement = document.querySelector('.bag-summary');
  if (!bagSummaryElement) return;

  let totalItem = bagItemObjects.length;
  let totalMRP = 0;
  let totalDiscount = 0;

  bagItemObjects.forEach(bagItem => {
    totalMRP += bagItem.original_price;
    totalDiscount += (bagItem.original_price - bagItem.current_price);
  });

  let convenienceFee = totalItem > 0 ? CONVENIENCE_FEE : 0;
  let finalPayment = totalMRP - totalDiscount + convenienceFee;

  if (totalItem === 0) {
    bagSummaryElement.style.display = 'none';
    return;
  } else {
    bagSummaryElement.style.display = 'block';
  }

  bagSummaryElement.innerHTML = `
    <div class="bag-details-container">
      <div class="price-header">PRICE DETAILS (${totalItem} Items) </div>
      <div class="price-item">
        <span class="price-item-tag">Total MRP</span>
        <span class="price-item-value">Rs ${totalMRP}</span>
      </div>
      <div class="price-item">
        <span class="price-item-tag">Discount on MRP</span>
        <span class="price-item-value priceDetail-base-discount">-Rs ${totalDiscount}</span>
      </div>
      <div class="price-item">
        <span class="price-item-tag">Convenience Fee</span>
        <span class="price-item-value">Rs ${convenienceFee}</span>
      </div>
      <div class="price-footer">
        <span class="price-item-tag">Total Amount</span>
        <span class="price-item-value">Rs ${finalPayment}</span>
      </div>
    </div>
    <button class="btn-place-order" onclick="alert('Order Placed Successfully!')">
      <div>PLACE ORDER</div>
    </button>
  `;
}

// Mobile menu drawer toggle logic
function setupMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const closeDrawer = document.getElementById('closeDrawer');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');

  if (menuToggle && mobileDrawer && drawerOverlay) {
    menuToggle.addEventListener('click', () => {
      mobileDrawer.classList.add('active');
      drawerOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  const closeMenu = () => {
    if (mobileDrawer && drawerOverlay) {
      mobileDrawer.classList.remove('active');
      drawerOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  if (closeDrawer) {
    closeDrawer.addEventListener('click', closeMenu);
  }
  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', closeMenu);
  }
}

// Dark Mode Toggle Logic
function setupDarkMode() {
  const darkModeToggle = document.getElementById('darkModeToggle');
  if (!darkModeToggle) return;

  const toggleIcon = darkModeToggle.querySelector('.action_icon');

  // Load saved theme state
  const savedTheme = localStorage.getItem('theme');
  const isDark = savedTheme === 'dark';

  if (isDark) {
    document.body.classList.add('dark-theme');
    if (toggleIcon) toggleIcon.innerText = 'light_mode';
  } else {
    document.body.classList.remove('dark-theme');
    if (toggleIcon) toggleIcon.innerText = 'dark_mode';
  }

  darkModeToggle.addEventListener('click', () => {
    const isCurrentlyDark = document.body.classList.contains('dark-theme');
    if (isCurrentlyDark) {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
      if (toggleIcon) toggleIcon.innerText = 'dark_mode';
    } else {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
      if (toggleIcon) toggleIcon.innerText = 'light_mode';
    }
  });
}
