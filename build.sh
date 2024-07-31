#!/bin/bash

cd "$(dirname "$0")"

npm install
npm tauri build --runner cargo-xwin --target x86_64-pc-windows-msvc

if [ $? -eq 0 ]; then
  echo "Build completed successfully."
else
  echo "Build failed."
  exit 1
fi