const fs = require('fs');
const path = require('path');

const target = path.resolve(process.cwd(), '.next');

function removeNext() {
  try {
    if (fs.existsSync(target)) {
      console.log('Removing', target);
      // Node 14+ supports rmSync; fallback to rmdirSync if necessary
      if (typeof fs.rmSync === 'function') {
        fs.rmSync(target, { recursive: true, force: true });
      } else {
        // older Node fallback
        const rimraf = require('rimraf');
        rimraf.sync(target);
      }
      console.log('.next removed');
      return 0;
    } else {
      console.log('.next not found — nothing to remove');
      return 0;
    }
  } catch (err) {
    console.error('Failed to remove .next:', err);
    return 1;
  }
}

process.exit(removeNext());
