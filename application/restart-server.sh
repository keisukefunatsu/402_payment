#!/bin/bash

# Kill existing Next.js server and restart
cd /Users/pyon/Projects/personal/402_payment/application
ps aux | grep "next dev" | grep -v grep | awk '{print $2}' | xargs kill
sleep 2
pnpm dev &
sleep 3
echo "Server restarted"