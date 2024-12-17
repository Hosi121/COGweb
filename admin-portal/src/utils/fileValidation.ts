export const validateImageFile = (file: File) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  
    if (!allowedTypes.includes(file.type)) {
      throw new Error('JPG、PNG、WebP形式の画像のみアップロード可能です');
    }
  
    if (file.size > maxSize) {
      throw new Error('ファイルサイズは5MB以下にしてください');
    }
  
    return true;
  };