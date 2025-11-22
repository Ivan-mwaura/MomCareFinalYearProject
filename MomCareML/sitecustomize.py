import os
import sys

# Add the Python 3.9 Lib directory to sys.path if it exists
python39_lib = '/opt/python3.9/lib/python3.9'
if os.path.isdir(python39_lib):
    sys.path.insert(0, python39_lib)

# Add the Python 3.9 site-packages directory to sys.path if it exists
python39_site_packages = '/opt/python3.9/lib/python3.9/site-packages'
if os.path.isdir(python39_site_packages):
    sys.path.insert(0, python39_site_packages)

# Forcibly try to import and make 'distutils' available
try:
    import distutils
    print("Successfully imported distutils via sitecustomize.py")
except ImportError:
    print("Failed to import distutils via sitecustomize.py")