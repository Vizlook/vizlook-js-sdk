#!/bin/bash
set -e # Exit immediately if a command exits with a non-zero status.

echo "Starting package release process..."

# Handle command-line arguments to determine version update type or specific version number
VERSION_INCREMENT_TYPE="patch" # Default version increment type is patch

if [ -n "$1" ]; then # Check if an argument is provided
    # Check if the argument is one of the predefined version types
    if [[ "$1" =~ ^(patch|minor|major)$ ]]; then
        VERSION_INCREMENT_TYPE="$1"
        echo "Performing a $VERSION_INCREMENT_TYPE version update."
    # Check if the argument is a semantic version number (e.g., 1.2.3, 1.0.0-beta.1)
    elif [[ "$1" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9\.-]+)?$ ]]; then
        VERSION_INCREMENT_TYPE="$1" # Use the provided version number directly
        echo "Releasing with specific version: v$VERSION_INCREMENT_TYPE."
    else
        echo "Error: Invalid version type or number '$1'."
        echo "Please use 'patch', 'minor', 'major' or a semantic version number (e.g., 1.2.3, 1.0.0-beta.1)."
        exit 1
    fi
else
    echo "No version type specified, defaulting to 'patch' version update."
fi

# 1. Automatically update version number (without creating Git commit and tag)
echo "1. Updating version number in package.json..."
# npm version command can accept 'patch', 'minor', 'major' or a specific version number
npm version "$VERSION_INCREMENT_TYPE" --no-git-tag-version

# Get the updated version number
PACKAGE_VERSION=$(node -p "require('./package.json').version")
echo "New package version: v$PACKAGE_VERSION"

# 2. Automatically build the code
echo "2. Building the project..."
npm run build # Ensure your package.json has a 'build' script

# 3. Automatically commit to Git
echo "3. Committing version update and build artifacts to Git..."
git add .
git commit -m "Release v$PACKAGE_VERSION"

# 4. Automatically publish to npm
echo "4. Publishing package to npm..."
npm publish

# 5. Automatically push a Git tag to the repository
echo "5. Creating and pushing Git Tag..."
git tag "v$PACKAGE_VERSION"
git push # Push the new commit
git push --tags # Push the new tag

echo "Package release process completed! Version v$PACKAGE_VERSION has been published."