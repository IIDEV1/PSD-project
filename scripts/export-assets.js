const path = require('path');
const fs = require('fs');
const PSD = require('psd');
const sharp = require('sharp');

const outputDir = path.join(process.cwd(), 'assets', 'images');
fs.mkdirSync(outputDir, { recursive: true });

async function main() {
  const psd = PSD.fromFile(path.join(process.cwd(), 'main.psd'));
  psd.parse();

  psd.tree().children()[1].children()[0].saveAsPng(path.join(outputDir, 'logo.png'));
  psd.tree().children()[1].children()[7].children()[2].children()[0].saveAsPng(
    path.join(outputDir, 'hero-main.png')
  );

  const previewPath = path.join(process.cwd(), 'artifacts', 'preview.png');
  const cropTasks = [
    { file: 'section-hero.png', left: 0, top: 0, width: 1440, height: 1180 },
    { file: 'section-approach.png', left: 0, top: 1180, width: 1440, height: 1360 },
    { file: 'section-solutions.png', left: 0, top: 2540, width: 1440, height: 1100 },
    { file: 'section-news.png', left: 0, top: 3640, width: 1440, height: 1164 },
    { file: 'section-footer.png', left: 0, top: 4804, width: 1440, height: 596 },
    { file: 'approach-visual.png', left: 0, top: 1352, width: 932, height: 380 },
    { file: 'solutions-visual.png', left: 805, top: 2322, width: 635, height: 380 },
    { file: 'solution-1.png', left: 52, top: 2866, width: 415, height: 295 },
    { file: 'solution-2.png', left: 510, top: 2866, width: 415, height: 295 },
    { file: 'solution-3.png', left: 979, top: 2866, width: 415, height: 295 },
    { file: 'news-visual.png', left: 0, top: 3683, width: 932, height: 380 },
    { file: 'news-1.png', left: 259, top: 4171, width: 369, height: 196 },
    { file: 'news-2.png', left: 668, top: 4171, width: 369, height: 196 },
    { file: 'news-3.png', left: 1048, top: 4171, width: 369, height: 196 },
    { file: 'footer-bg.png', left: 0, top: 4804, width: 1440, height: 596 },
  ];

  await Promise.all(
    cropTasks.map((item) =>
      sharp(previewPath)
        .extract({
          left: item.left,
          top: item.top,
          width: item.width,
          height: item.height,
        })
        .toFile(path.join(outputDir, item.file))
    )
  );

  console.log(`Exported ${cropTasks.length + 2} assets to ${outputDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
