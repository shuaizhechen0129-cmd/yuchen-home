#!/bin/bash

# 创建压缩后的文件夹
mkdir -p images/compressed

# 遍历所有图片文件
for file in images/*.jpg images/*.png images/*.jpeg; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        echo "Compressing $filename..."

        # 获取图片尺寸
        dimensions=$(file "$file" | grep -o '[0-9]* x [0-9]*')

        # 使用sips调整图片大小（如果宽度超过800px）
        width=$(sips -g width "$file" | awk '{print $2}')
        if [ "$width" -gt 800 ]; then
            sips -z 800 $((width * 800 / width)) "$file" --out "images/compressed/$filename" &>/dev/null
        else
            cp "$file" "images/compressed/$filename"
        fi

        # 压缩JPEG文件
        if [[ "$filename" == *.jpg ]] || [[ "$filename" == *.jpeg ]]; then
            jpegoptim --max=85 -m "images/compressed/$filename" &>/dev/null
        fi
    fi
done

echo "压缩完成！"
echo "压缩前大小: $(du -sh images | cut -f1)"
echo "压缩后大小: $(du -sh images/compressed | cut -f1)"