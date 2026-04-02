import subprocess
import sys

# Run node init.js using cmd.exe
result = subprocess.run(
    ['cmd.exe', '/c', 'cd /d "d:\\AI PROJECTS\\VSCODEPROJECTS\\iswebsitedown" && node init.js'],
    capture_output=True,
    text=True
)
print("STDOUT:", result.stdout)
print("STDERR:", result.stderr)
print("Return code:", result.returncode)
