"""
Setup script for Spellbinder.
"""

from setuptools import setup, find_packages
from pathlib import Path

# Read the README file
readme_file = Path(__file__).parent / "README.md"
long_description = readme_file.read_text(encoding="utf-8") if readme_file.exists() else ""

setup(
    name="spellbinder",
    version="0.1.0",
    author="Spellbinder Contributors",
    description="LLM-Powered Computer Control Agent",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/Hammertail/spellbinder",
    packages=find_packages(),
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "Topic :: Software Development :: Libraries :: Python Modules",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
    ],
    python_requires=">=3.11",
    install_requires=[
        "openai>=1.0.0",
        "pillow>=10.0.0",
        "pyautogui>=0.9.54",
        "pydantic>=2.0.0",
        "pydantic-settings>=2.0.0",
        "click>=8.1.0",
        "rich>=13.0.0",
        "httpx>=0.25.0",
        "python-dotenv>=1.0.0",
    ],
    entry_points={
        "console_scripts": [
            "spellbinder=spellbinder.cli:cli",
        ],
    },
)
