const fs = require('fs');
const path = require('path');

function processFiles(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.next') {
        processFiles(fullPath);
      }
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const newContent = content.replace(/@\/app\/actions/g, '@repo/services/actions');
      
      if (newContent !== content) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log("Updated imports in", fullPath);
      }
    }
  }
}

console.log("Updating action imports in apps/client...");
processFiles(path.join(__dirname, 'apps/client'));

console.log("Updating action imports in apps/admin...");
processFiles(path.join(__dirname, 'apps/admin'));

console.log("Updating action imports in packages/ui...");
processFiles(path.join(__dirname, 'packages/ui'));

console.log("Updating action imports in packages/services...");
processFiles(path.join(__dirname, 'packages/services'));

const oldActionsDir = path.join(__dirname, 'apps/client/src/app/actions');
if (fs.existsSync(oldActionsDir)) {
  console.log("Removing old actions directory from client app...");
  fs.rmSync(oldActionsDir, { recursive: true, force: true });
}

console.log("Action imports updated!");
