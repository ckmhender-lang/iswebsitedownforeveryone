#!/bin/bash
cd "d:/AI PROJECTS/VSCODEPROJECTS/iswebsitedown"

echo "Step 1: Scaffolding Next.js project..."
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --yes
