# Achievement Images

## 📁 Folder Purpose
This folder contains achievement images that will be displayed in an auto-scrolling gallery on the Achievements page.

## 📝 Instructions

1. **Add your achievement images here** (JPG or PNG format recommended)
2. **Name them sequentially**: 
   - `achievement1.jpg`
   - `achievement2.jpg`
   - `achievement3.jpg`
   - ... and so on

3. **Recommended specifications:**
   - Format: JPG (for photos) or PNG
   - Size: 800-1200px width, maintain 4:3 or 16:9 aspect ratio
   - Quality: High resolution for best display

4. **Update the image paths** in `src/pages/Achievements.tsx`:
   ```typescript
   const achievementImages = [
     '/achievements/achievement1.jpg',
     '/achievements/achievement2.jpg',
     // ... add your image paths here
   ];
   ```

## 💡 Tips
- Use high-quality images that showcase your achievements
- Ensure images are well-lit and clear
- Keep file sizes reasonable (< 1MB per image recommended)
- Images will be displayed in a horizontal scrolling gallery with hover effects
