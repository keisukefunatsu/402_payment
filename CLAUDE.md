# Claude Configuration for 402 Payment Project

## Project Overview
Next.js application with Firebase integration for payment processing. This configuration enables Claude to assist with development while maintaining security boundaries.

## Development Environment

### Framework & Tools
- **Frontend**: Next.js 14.1.0 with TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Firestore, hosting)
- **Package Manager**: pnpm (preferred)
- **Development Server**: `pnpm dev` (runs on port 3000)

### Build & Deployment Commands
```bash
# Development
pnpm dev                    # Start development server
pnpm build                  # Build production bundle
pnpm start                  # Start production server
pnpm lint                   # Run linting

# Firebase
firebase emulators:start    # Start Firebase emulators
firebase deploy --only hosting  # Deploy to Firebase hosting
```

## Allowed Tools & Commands

### Safe File Operations
```bash
ls, ll, la                  # Directory listing
cat, head, tail, less, more # File viewing
find, grep, rg              # File and content searching
wc, sort, uniq              # Text processing
sed, awk                    # Text manipulation
diff                        # File comparison
file                        # File type detection
du, df                      # Disk usage
pwd, cd                     # Navigation
which, whereis              # Command location
```

### Development Tools
```bash
# Node.js ecosystem
npm, npx, yarn, pnpm, node
npm install, npm run, npm start, npm test, npm build
pnpm install, pnpm dev, pnpm build, pnpm test
yarn install, yarn dev, yarn build, yarn test

# Next.js specific
next dev, next build, next start

# Firebase CLI
firebase
firebase emulators:start
firebase deploy --only hosting
firebase login --reauth

# System information
ps, top, htop               # Process monitoring
whoami, uname, date         # System info
echo                        # Text output
```

### Git Operations (Read-only)
```bash
git status                  # Working directory status
git log                     # Commit history
git diff                    # Show changes
git branch                  # List branches
git show                    # Show specific commits
git blame                   # File authorship
```

### Network & Debugging
```bash
curl                        # HTTP requests (for API testing)
ping                        # Network connectivity
netstat, lsof               # Network and port information
kill                        # Process termination (specific PIDs only)
```

## Restricted Commands
The following commands are NOT allowed for security reasons:

### Git Operations
- `git push`, `git pull`, `git fetch` (remote operations)
- `git commit`, `git add` (use Claude's commit tools instead)
- `git merge`, `git rebase` (branch operations)

### System Operations
- `sudo` (elevated privileges)
- `chmod`, `chown` (permission changes)
- `rm -rf` (recursive deletion)
- `mv`, `cp -r` (large-scale file operations)
- `ssh`, `scp`, `rsync` (remote access/transfers)

### Package Installation
- `npm install -g` (global installations)
- `apt`, `yum`, `brew` (system package managers)

## Development Guidelines

### Code Style
- Use TypeScript for all new components
- Follow existing file naming conventions
- Use Tailwind CSS for styling
- Implement responsive design patterns
- Follow Next.js best practices for SSR/SSG

### Testing
- Run `pnpm lint` before committing
- Test in development environment with `pnpm dev`
- Verify Firebase emulator functionality when applicable

### File Structure
```
/
├── application/          # Next.js application
│   ├── app/             # App router pages
│   ├── package.json     # Dependencies and scripts
│   └── *.config.*       # Configuration files
├── firebase.json        # Firebase configuration
├── firestore.rules      # Firestore security rules
└── *.md                 # Documentation
```

## Current Limitations

### Without Workflow Permission Changes
Claude can create and modify files but has limited automated PR creation capabilities. Users must manually create PRs using provided links.

### Manual PR Creation
When Claude completes work, it will provide a pre-filled PR creation link in this format:
```
[Create a PR](https://github.com/keisukefunatsu/402_payment/compare/main...branch-name?quick_pull=1&title=encoded-title&body=encoded-body)
```

## Security Notes
- Never commit sensitive information (API keys, secrets)
- Firebase configuration files are public by design
- All environment variables should use `.env.local` (not tracked)
- Review all code changes before merging to main branch

---
*Generated for Issue #9: Linux commands whitelist for Next.js development*