#!/bin/bash

## We need to use this script to link the docs in latest version to their v2 counterparts.
## When we want to work on v3 docs, we'll need to remove the symlinks and make the docs independent again (for v3).

# Set the source and destination directories
SRC_DIR="HyperIndex_versioned_docs/version-v2"
DEST_DIR="docs/HyperIndex"

# Function to create symlinks recursively
create_symlinks() {
    local src=$1
    local dest=$2

    for item in "$src"/*; do
        local base=$(basename "$item")
        local target="$dest/$base"

        if [ -d "$item" ]; then
            # If it's a directory, create it in the destination if it doesn't exist
            if [ ! -d "$target" ]; then
                mkdir -p "$target"
            fi
            # Recursively create symlinks for the contents of the directory
            create_symlinks "$item" "$target"
        else
            # If it's a file, create a symlink
            if [ -e "$target" ]; then
                rm -f "$target"
            fi
            ln -s "$(realpath "$item")" "$target"
            echo "Created symlink: $target -> $item"
        fi
    done
}

# Check if the source directory exists
if [ ! -d "$SRC_DIR" ]; then
    echo "Error: Source directory $SRC_DIR does not exist."
    exit 1
fi

# Check if the destination directory exists
if [ ! -d "$DEST_DIR" ]; then
    echo "Error: Destination directory $DEST_DIR does not exist."
    exit 1
fi

# Start the recursive symlinking process
create_symlinks "$SRC_DIR" "$DEST_DIR"

echo "Recursive symlinking complete."
