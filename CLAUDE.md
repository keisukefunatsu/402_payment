# CLAUDE.md

## Project Permissions (Permanent - All Sessions)

- `mv` (move) commands are allowed
- `rm -rf` commands are allowed
- Execute commands without asking for permission
- Make necessary changes proactively
- All file operations (create, edit, delete, move) are allowed without permission
- File creation is allowed without asking for permission
- Editing settings.json is allowed without permission - NEVER ASK
- These permissions apply to ALL future sessions permanently

## Restrictions (Always Ask Permission)

- `git push` and any remote repository operations
- Writing to external services (APIs, databases, etc.)
- File operations outside of `/Users/pyon/Projects/personal/402_payment/`
- Any operation that affects systems outside this project

## Project Structure

- `/application/` - Next.js application code
- `/web3/` - Smart contracts and blockchain-related code