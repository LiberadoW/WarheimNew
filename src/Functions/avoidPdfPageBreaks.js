// html2pdf 0.9 slices one tall canvas into A4 pages and has no "avoid break
// inside" option, so blocks that would straddle a page edge are pushed to the
// next page with spacers. Returns a function that removes the spacers again.
const A4_RATIO = 297 / 210;
const SPACER_CLASS = "pdf-page-spacer";
// Roughly 10mm, so pushed blocks don't start at the very edge of the page.
const PAGE_TOP_MARGIN = 38;

export const avoidPdfPageBreaks = (element, selector) => {
  const pageHeight = element.offsetWidth * A4_RATIO;
  const spacers = [];

  element.querySelectorAll(selector).forEach((block) => {
    const origin = element.getBoundingClientRect().top;
    const { top, bottom } = block.getBoundingClientRect();
    const start = top - origin;
    const end = bottom - origin;
    const pageEnd = (Math.floor(start / pageHeight) + 1) * pageHeight;

    if (end > pageEnd && end - start < pageHeight - PAGE_TOP_MARGIN) {
      const spacer = document.createElement("div");
      spacer.className = SPACER_CLASS;
      spacer.style.height = `${Math.ceil(pageEnd - start + PAGE_TOP_MARGIN)}px`;
      block.parentNode.insertBefore(spacer, block);
      spacers.push(spacer);
    }
  });

  return () => spacers.forEach((spacer) => spacer.remove());
};
