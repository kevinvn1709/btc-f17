#!/usr/bin/env node

/**
 * Memory Wall Static Site Builder
 * Generates optimized HTML from config and images
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Paths
const ROOT = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT, 'src');
const PUBLIC_DIR = path.join(ROOT, 'public');
const IMAGES_SOURCE_DIR = path.join(ROOT, 'images');
const IMAGES_PUBLIC_DIR = path.join(PUBLIC_DIR, 'images');

// Config
const config = JSON.parse(fs.readFileSync(path.join(SRC_DIR, 'config.json'), 'utf-8'));

console.log('🚀 Building Memory Wall...\n');

/**
 * Detect all images in a year folder
 */
function detectYearImages(year) {
    const yearFolder = path.join(IMAGES_SOURCE_DIR, year.toString());
    console.log(`🔍 [DEBUG] Checking folder: ${yearFolder}`);
    
    if (!fs.existsSync(yearFolder)) {
        console.warn(`⚠️  No images found for year ${year} - folder doesn't exist`);
        return [];
    }
    
    const files = fs.readdirSync(yearFolder)
        .filter(f => /\.(jpg|jpeg|png)$/i.test(f))
        .sort();
    
    console.log(`✓ [DEBUG] Found ${files.length} images for ${year}: ${files.join(', ')}`);
    return files;
}

/**
 * Optimize image and save to public
 */
async function optimizeImage(sourcePath, targetPath, options = {}) {
    const { width = 1200, quality = 85 } = options;
    
    await sharp(sourcePath)
        .resize(width, null, { 
            withoutEnlargement: true,
            fit: 'inside'
        })
        .jpeg({ quality, mozjpeg: true })
        .toFile(targetPath);
}

/**
 * Process all images for a year
 */
async function processYearImages(year) {
    const images = detectYearImages(year);
    if (images.length === 0) {
        console.log(`⏩ [DEBUG] Skipping ${year} - no images detected`);
        return;
    }
    
    const yearPublicDir = path.join(IMAGES_PUBLIC_DIR, year.toString());
    console.log(`📂 [DEBUG] Creating public dir: ${yearPublicDir}`);
    
    if (!fs.existsSync(yearPublicDir)) {
        fs.mkdirSync(yearPublicDir, { recursive: true });
    }
    
    console.log(`📸 Processing ${images.length} images for ${year}...`);
    
    for (const img of images) {
        const sourcePath = path.join(IMAGES_SOURCE_DIR, year.toString(), img);
        const targetPath = path.join(yearPublicDir, img);
        
        console.log(`   → Optimizing ${img}...`);
        await optimizeImage(sourcePath, targetPath);
        console.log(`   ✓ ${img} saved`);
    }
}

/**
 * Generate memory card HTML
 */
function generateMemoryCard(memory, index) {
    const tapeClasses = ['tape-right', 'tape-left', 'tape-top'];
    const tapeClass = tapeClasses[index % tapeClasses.length];
    
    // Detect image count for this year
    const images = detectYearImages(memory.year);
    const imageCount = images.length > 0 ? images.length : 1;
    
    console.log(`🎴 [DEBUG] Memory card ${memory.year}: ${imageCount} images, tape: ${tapeClass}`);
    
    return `
            <!-- Year ${memory.year} -->
            <div class="memory-card" data-year="${memory.year}" data-image-count="${imageCount}">
                <div class="polaroid">
                    <div class="photo-container">
                        <img src="images/${memory.year}/${memory.year}-1.jpg" alt="Kỷ niệm ${memory.year}">
                        <div class="tape ${tapeClass}"></div>
                    </div>
                    <div class="caption">
                        <p class="year-label">${memory.year}</p>
                        <p class="memory-note">${memory.post}</p>
                        <p class="author-name">- ${memory.author} -</p>
                    </div>
                </div>
            </div>`;
}

/**
 * Generate complete HTML
 */
function generateHTML() {
    const template = fs.readFileSync(path.join(SRC_DIR, 'template.html'), 'utf-8');
    
    // Sort memories by year descending
    const sortedMemories = [...config.memories].sort((a, b) => b.year - a.year);
    
    // Generate memory cards HTML
    const memoryCardsHTML = sortedMemories
        .map((memory, index) => generateMemoryCard(memory, index))
        .join('\n');
    
    // Year range - keep "nay" instead of current year
    const yearRange = `${config.site.startYear} - nay`;
    
    // Replace placeholders in template
    let html = template
        .replace('{{SITE_TITLE}}', config.site.title)
        .replace('{{SITE_SUBTITLE}}', config.site.subtitle)
        .replace('{{YEAR_RANGE}}', yearRange)
        .replace('{{START_YEAR}}', config.site.startYear)
        .replace('{{LOCATION}}', config.site.location)
        .replace('{{MEMORY_CARDS}}', memoryCardsHTML);
    
    return html;
}

/**
 * Copy static files (CSS, JS)
 */
function copyStaticFiles() {
    console.log('📄 Copying static files...');
    
    const staticFiles = ['style.css', 'script.js'];
    
    for (const file of staticFiles) {
        const source = path.join(ROOT, file);
        const target = path.join(PUBLIC_DIR, file);
        
        if (fs.existsSync(source)) {
            fs.copyFileSync(source, target);
            console.log(`   ✓ ${file}`);
        }
    }
    
    // Create .nojekyll file to disable Jekyll on GitHub Pages
    const nojekyllPath = path.join(PUBLIC_DIR, '.nojekyll');
    fs.writeFileSync(nojekyllPath, '');
    console.log('   ✓ .nojekyll (disable Jekyll)');
}

/**
 * Main build process
 */
async function build() {
    try {
        console.log(`🔍 [DEBUG] ROOT: ${ROOT}`);
        console.log(`🔍 [DEBUG] IMAGES_SOURCE_DIR: ${IMAGES_SOURCE_DIR}`);
        console.log(`🔍 [DEBUG] PUBLIC_DIR: ${PUBLIC_DIR}`);
        console.log(`🔍 [DEBUG] Total memories to process: ${config.memories.length}\n`);
        
        // 1. Process images
        console.log('📦 Step 1: Optimizing images...');
        for (const memory of config.memories) {
            console.log(`\n--- Processing year ${memory.year} ---`);
            await processYearImages(memory.year);
        }
        
        // 2. Generate HTML
        console.log('\n📝 Step 2: Generating HTML...');
        const html = generateHTML();
        fs.writeFileSync(path.join(PUBLIC_DIR, 'index.html'), html);
        console.log('   ✓ index.html generated');
        
        // 3. Copy static files
        console.log('\n📋 Step 3: Copying static files...');
        copyStaticFiles();
        
        console.log('\n✨ Build completed successfully!');
        console.log(`\n📁 Output: ${PUBLIC_DIR}`);
        console.log('🌐 Open public/index.html in browser to preview\n');
        
    } catch (error) {
        console.error('\n❌ Build failed:', error.message);
        console.error('Stack trace:', error.stack);
        process.exit(1);
    }
}

// Run builder
build();
