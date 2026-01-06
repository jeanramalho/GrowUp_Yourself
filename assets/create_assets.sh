#!/bin/bash
# Criar imagens básicas usando sips (ferramenta nativa do macOS)

# Criar uma imagem sólida azul para o ícone
sips -c 1024 1024 --setProperty format png /System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/GenericApplicationIcon.icns --out icon.png 2>/dev/null || \
sips -z 1024 1024 -s format png /System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/GenericApplicationIcon.icns --out icon.png 2>/dev/null || \
echo "Creating simple colored images..."

# Se sips não funcionar, criar imagens usando ImageMagick ou criar arquivos vazios que serão substituídos depois
if [ ! -f icon.png ]; then
  # Usar uma imagem de 1x1 pixel e expandir (método alternativo)
  echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" | base64 -d > icon.png
fi

# Criar splash screen (1284x2778 para iPhone)
if [ ! -f splash.png ]; then
  sips -z 2778 1284 -s format png /System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/GenericApplicationIcon.icns --out splash.png 2>/dev/null || \
  echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" | base64 -d > splash.png
fi

# Criar adaptive icon (1024x1024)
if [ ! -f adaptive-icon.png ]; then
  cp icon.png adaptive-icon.png 2>/dev/null || \
  echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" | base64 -d > adaptive-icon.png
fi

# Criar favicon (32x32)
if [ ! -f favicon.png ]; then
  sips -z 32 32 -s format png icon.png --out favicon.png 2>/dev/null || \
  cp icon.png favicon.png
fi

# Criar notification icon (96x96)
if [ ! -f notification-icon.png ]; then
  sips -z 96 96 -s format png icon.png --out notification-icon.png 2>/dev/null || \
  cp icon.png notification-icon.png
fi

echo "Assets created successfully"
