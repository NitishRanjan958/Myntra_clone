let bagItems = [];
onLoad();

function onLoad() {
  let bagItemsStr = localStorage.getItem('bagItems');
  bagItems = bagItemsStr ? JSON.parse(bagItemsStr) : [];
  displayItemsOnHomePage();
  displayBagIcon();
  setupMobileMenu();
  setupDarkMode();
}

function addToBag(itemId) {
  bagItems.push(itemId);
  localStorage.setItem('bagItems', JSON.stringify(bagItems));
  displayBagIcon();
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

function displayItemsOnHomePage() {
  let itemsContainerElement = document.querySelector(".items-container");
  if (!itemsContainerElement) {
    return; // Safety guard: not on homepage
  }
  
  let innerhtml = ``;
  items.forEach((item) => {
    innerhtml += `
    <div class="item-container">
      <div class="img-container">
        <img class="item-image" src="${item.image}" alt="item image">
        <div class="rating">
          ${item.rating.stars} ⭐ | ${item.rating.count}
        </div>
      </div>
      <div class="company-name">${item.company}</div>
      <div class="item-name">${item.item_name}</div>
      <div class="price">
        <span class="current-price">Rs ${item.current_price}</span>
        <span class="original-price">Rs ${item.original_price}</span>
        <span class="discount">(${item.discount_percentage}% OFF)</span>
      </div>
      <button class="btn-add-bag" onclick="addToBag('${item.id}')">Add to Bag</button>
    </div>`;
  });
  itemsContainerElement.innerHTML = innerhtml;
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
      document.body.style.overflow = 'hidden'; // prevent scroll
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
