const fs = require('fs');
const path = require('path');

const adminApp = path.join(__dirname, 'apps/admin/src/app');
const adminGroup = path.join(adminApp, '(admin)');
const authGroup = path.join(adminApp, '(auth)');

fs.mkdirSync(adminGroup, { recursive: true });
fs.mkdirSync(authGroup, { recursive: true });

const routes = ['admins', 'bookings', 'categories', 'dashboard', 'logs', 'messages', 'orders', 'products', 'services', 'settings', 'page.tsx'];

for (const route of routes) {
  const src = path.join(adminApp, route);
  const dest = path.join(adminGroup, route);
  
  if (fs.existsSync(src)) {
    try {
      fs.renameSync(src, dest);
      console.log(`Moved ${route} to (admin)`);
    } catch (e) {
      console.error(`Failed to move ${route}:`, e.message);
    }
  }
}

const loginSrc = path.join(adminApp, 'login');
const loginDest = path.join(authGroup, 'login');
if (fs.existsSync(loginSrc)) {
  try {
    fs.renameSync(loginSrc, loginDest);
    console.log(`Moved login to (auth)`);
  } catch (e) {
    console.error(`Failed to move login:`, e.message);
  }
}

const unauthSrc = path.join(adminApp, 'unauthorized');
const unauthDest = path.join(authGroup, 'unauthorized');
if (fs.existsSync(unauthSrc)) {
  try {
    fs.renameSync(unauthSrc, unauthDest);
    console.log(`Moved unauthorized to (auth)`);
  } catch (e) {
    console.error(`Failed to move unauthorized:`, e.message);
  }
}
