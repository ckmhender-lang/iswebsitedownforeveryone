import os
base = r'd:\AI PROJECTS\VSCODEPROJECTS\iswebsitedown'
dirs = [
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
]
for d in dirs:
    os.makedirs(os.path.join(base, d.replace('/', os.sep)), exist_ok=True)
    print(f'Created: {d}')
print('DONE')
