Developer notes

If you see an error like:

```
Error: EINVAL: invalid argument, readlink .next/server/app-paths-manifest.json
```

This can happen on Windows when the project is inside OneDrive or another syncing service which interferes with file operations.

Quick fixes

- Remove the Next.js build cache and restart dev:

```powershell
npm run clean
npm run dev
# or start dev after cleaning in one command
npm run dev:clean
```

Why this helps

- The `clean` script deletes the `.next` folder safely. If OneDrive or antivirus keeps files open, deleting `.next` and restarting the dev server usually resolves the `readlink`/`EINVAL` errors.

Recommendations

- Prefer working outside OneDrive (e.g., C:\projects) or mark the project folder as excluded in OneDrive settings.
- If the problem persists, temporarily pause OneDrive or disable the interfering antivirus while developing.
