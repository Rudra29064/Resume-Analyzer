const PDFDocument = require('pdfkit');

const ACCENT = '#2563eb';
const DARK = '#111827';
const GRAY = '#4b5563';
const LIGHT_GRAY = '#9ca3af';

const generatePDF = (data) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const buffers = [];

    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    const pageWidth = doc.page.width - 100;

    // ---- Name & Title ----
    doc
      .fontSize(24)
      .fillColor(DARK)
      .font('Helvetica-Bold')
      .text(data.name || 'Your Name', { align: 'left' });

    if (data.title) {
      doc
        .fontSize(13)
        .fillColor(ACCENT)
        .font('Helvetica')
        .text(data.title);
    }

    doc.moveDown(0.4);

    // ---- Contact line ----
    const contactParts = [
      data.contact?.email,
      data.contact?.phone,
      data.contact?.location,
      data.contact?.linkedin,
      data.contact?.github,
    ].filter(Boolean);

    if (contactParts.length) {
      doc
        .fontSize(9)
        .fillColor(GRAY)
        .font('Helvetica')
        .text(contactParts.join('   |   '));
    }

    doc.moveDown(0.6);
    drawDivider(doc, pageWidth);
    doc.moveDown(0.8);

    // ---- Summary ----
    if (data.summary) {
      sectionTitle(doc, 'SUMMARY');
      doc
        .fontSize(10)
        .fillColor(GRAY)
        .font('Helvetica')
        .text(data.summary, { lineGap: 3 });
      doc.moveDown(0.8);
    }

    // ---- Skills ----
    if (data.skills?.length) {
      sectionTitle(doc, 'SKILLS');
      doc
        .fontSize(10)
        .fillColor(GRAY)
        .font('Helvetica')
        .text(data.skills.join('  •  '), { lineGap: 3 });
      doc.moveDown(0.8);
    }

    // ---- Experience ----
    if (data.experience?.length) {
      sectionTitle(doc, 'EXPERIENCE');
      data.experience.forEach((exp) => {
        doc
          .fontSize(11)
          .fillColor(DARK)
          .font('Helvetica-Bold')
          .text(`${exp.role}`, { continued: true })
          .font('Helvetica')
          .fillColor(GRAY)
          .text(`  —  ${exp.company}`);

        if (exp.duration) {
          doc
            .fontSize(9)
            .fillColor(LIGHT_GRAY)
            .font('Helvetica-Oblique')
            .text(exp.duration);
        }

        doc.moveDown(0.2);

        exp.bullets?.forEach((b) => {
          doc
            .fontSize(10)
            .fillColor(GRAY)
            .font('Helvetica')
            .text(`•  ${b}`, { indent: 10, lineGap: 2 });
        });

        doc.moveDown(0.6);
      });
    }

    // ---- Projects ----
    if (data.projects?.length) {
      sectionTitle(doc, 'PROJECTS');
      data.projects.forEach((proj) => {
        doc
          .fontSize(11)
          .fillColor(DARK)
          .font('Helvetica-Bold')
          .text(proj.name, { continued: !!proj.tech })
          .font('Helvetica')
          .fillColor(ACCENT)
          .text(proj.tech ? `  (${proj.tech})` : '');

        doc.moveDown(0.2);

        proj.bullets?.forEach((b) => {
          doc
            .fontSize(10)
            .fillColor(GRAY)
            .font('Helvetica')
            .text(`•  ${b}`, { indent: 10, lineGap: 2 });
        });

        doc.moveDown(0.6);
      });
    }

    // ---- Education ----
    if (data.education?.length) {
      sectionTitle(doc, 'EDUCATION');
      data.education.forEach((edu) => {
        doc
          .fontSize(11)
          .fillColor(DARK)
          .font('Helvetica-Bold')
          .text(edu.degree);
        doc
          .fontSize(10)
          .fillColor(GRAY)
          .font('Helvetica')
          .text(`${edu.institution}${edu.duration ? '  •  ' + edu.duration : ''}`);
        doc.moveDown(0.5);
      });
    }

    doc.end();
  });
};

function sectionTitle(doc, text) {
  doc
    .fontSize(12)
    .fillColor(ACCENT)
    .font('Helvetica-Bold')
    .text(text);
  doc
    .moveTo(50, doc.y + 2)
    .lineTo(doc.page.width - 50, doc.y + 2)
    .strokeColor('#dbeafe')
    .lineWidth(1)
    .stroke();
  doc.moveDown(0.4);
}

function drawDivider(doc, width) {
  doc
    .moveTo(50, doc.y)
    .lineTo(50 + width, doc.y)
    .strokeColor(ACCENT)
    .lineWidth(1.5)
    .stroke();
}

module.exports = generatePDF;