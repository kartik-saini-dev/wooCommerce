const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('g:/electrical/apps/admin/src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    if (filePath.includes('route.ts') || filePath.includes('auth.ts')) return; // skip
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    content = content.replace(/import\s+\{\s*authOptions\s*\}\s+from\s+['"]@repo\/services\/auth['"]/g, 'import { adminAuthOptions } from "@/lib/auth"');
    content = content.replace(/getServerSession\(authOptions\)/g, 'getServerSession(adminAuthOptions)');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated ' + filePath);
    }
  }
});
