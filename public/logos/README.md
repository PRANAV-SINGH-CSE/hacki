# Partner/Sponsor Logos

## 📁 Folder Purpose
This folder contains partner, sponsor, or collaborator logos that will be displayed in a horizontal scrolling marquee on the Achievements page.

## 📝 Instructions

1. **Add your logo files here** (PNG, JPG, or SVG format recommended)
2. **Name them sequentially**: 
   - `logo1.png` (or `.jpg`, `.svg`)
   - `logo2.png`
   - `logo3.png`
   - ... up to `logo10.png` (or as many as you need)

3. **Recommended specifications:**
   - Format: PNG (with transparency) or SVG (for best quality)
   - Size: 200-400px width, maintain aspect ratio
   - Background: Transparent or white (logos will be inverted to white in the marquee)

4. **Update the logo paths** in `src/pages/Achievements.tsx`:
   ```typescript
   const partnerLogos = [
     '/logos/logo1.png',
     '/logos/logo2.png',
     // ... add your logo paths here
   ];
   ```

## 💡 Tips
- Use high-quality logos for best display
- Ensure logos are readable when inverted to white
- Keep file sizes reasonable (< 500KB per logo)
