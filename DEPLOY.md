# Going live – Restaurant Billing Website

Your site is static (HTML, CSS, JS). Here are the easiest ways to put it online.

---

## Option 1: Netlify (easiest, no Git needed)

1. Go to [https://app.netlify.com](https://app.netlify.com) and sign up (free).
2. Drag and drop your **entire project folder** (the one that contains `index.html`, `css/`, `js/`, `images/`) into the “Deploy manually” area on Netlify.
3. Netlify will give you a URL like `https://random-name-123.netlify.app`. You can change the site name in **Site settings → Domain management**.

Done. Your site is live.

---

## Option 2: GitHub Pages (free, good if you use Git)

1. Create a new repository on [GitHub](https://github.com/new). Name it e.g. `restaurant-billing`. Do **not** add a README (you already have files).
2. In your project folder, open a terminal and run:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/restaurant-billing.git
   git push -u origin main
   ```
   Replace `YOUR_USERNAME` with your GitHub username.

3. On GitHub: **Settings → Pages → Source**: choose **Deploy from branch**. Branch: **main**, folder: **/ (root)**. Save.
4. After a minute, your site will be at `https://YOUR_USERNAME.github.io/restaurant-billing/`.

---

## Option 3: Vercel

1. Go to [https://vercel.com](https://vercel.com) and sign up.
2. Click **Add New → Project**. Import your Git repo (if you use GitHub) or use **Vercel CLI**: run `npx vercel` in your project folder and follow the steps.
3. Vercel will build and give you a live URL.

---

## Important note about data

This app uses **localStorage** in the browser. So:

- **Menu, cart, and sales report** are stored only on the **device/browser** where the site is used.
- If you open the site on another phone or computer, it will have empty menu and no orders until you add them (or use Manage Menu) on that device.
- For a single counter or tablet at your restaurant, this is fine. For shared data across many devices, you’d need a backend and database later.

---

## Quick checklist before going live

- [ ] Replace placeholder menu images in **Manage Menu** with real photos if you want.
- [ ] Test **Pay now** (QR), **Print bill**, and **Clear cart** once on the live URL.
- [ ] (Optional) On Netlify/Vercel you can add a **custom domain** in the site settings.
