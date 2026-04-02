const fs = require('fs');
const path = require('path');

const base = 'd:/AI PROJECTS/VSCODEPROJECTS/iswebsitedown';
const dirs = [
  'prisma',
  'src/app',
  'src/app/(auth)/login',
  'src/app/(auth)/register',
  'src/app/(dashboard)/dashboard',
  'src/app/(dashboard)/monitors/[id]',
  'src/app/(dashboard)/alerts',
  'src/app/(dashboard)/settings',
  'src/app/api/check',
  'src/app/api/monitors/[id]',
  'src/app/api/auth/register',
  'src/app/api/auth/[...nextauth]',
  'src/app/api/cron',
  'src/lib',
  'src/types',
  'src/components/auth',
  'src/components/layout',
  'src/components/dashboard',
  'src/components/monitors',
  'src/components/alerts',
  'src/app/api/alerts',
  'netlify/functions'
];

dirs.forEach(d => fs.mkdirSync(path.join(base, d), { recursive: true }));
console.log('DONE');
