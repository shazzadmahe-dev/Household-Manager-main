const fs = require('fs');
const path = require('path');

const uiDir = path.join(__dirname, 'artifacts/home-tracker/src/components/ui');

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            const originalLength = content.length;
            
            // Replaces origin-[--radix-...-origin] with nothing
            content = content.replace(/origin-\[--radix-[a-zA-Z0-9\-]+-origin\]/g, '');
            
            // Also address max-h-[--radix-...] which might trigger the same token error
            content = content.replace(/max-h-\[--radix-[a-zA-Z0-9\-]+-height\]/g, '');
            
            if (content.length !== originalLength) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Fixed ${file}`);
            }
        }
    }
}

walk(uiDir);
console.log('Done fixing Tailwind classes');
