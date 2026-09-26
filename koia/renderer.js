function render(el, json) {
  if (!el) {
    throw new TypeError("A container element is required");
  }

  const scene = typeof json === "string" ? JSON.parse(json) : json;
  if (!scene || scene["kr-type"] !== "2d-color") {
    throw new Error("Unsupported Koia renderer type");
  }

  const data = scene["kr-data"] || {};
  const points = Array.isArray(data.points) ? data.points : [];
  const lines = Array.isArray(data.lines) ? data.lines : [];
  const areas = Array.isArray(data.areas) ? data.areas : [];
  const canvas = document.createElement("canvas");
  const size = Math.max(1, Math.min(el.clientWidth || 600, 600));
  const padding = 24;
  const pixelRatio = window.devicePixelRatio || 1;
  /*function getPointByRef(r) {
    for (let i in points) {
      if (i.ref == r) {
        return i;
      } else {
        continue;
      }
    }
  }*/
  function getPointByRef(ref) {
    return points.find((point) => point?.ref === ref);
  }
  canvas.width = size * pixelRatio;
  canvas.height = size * pixelRatio;
  canvas.style.width = `${size}px`;
  canvas.style.height = `${size}px`;
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", "2D color rendering");

  const context = canvas.getContext("2d");
  context.scale(pixelRatio, pixelRatio);
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, size, size);

  const coordinates = points.filter(
    (point) => Number.isFinite(point.x) && Number.isFinite(point.y),
  );
  if (coordinates.length > 0) {
    const minX = Math.min(...coordinates.map((point) => point.x));
    const maxX = Math.max(...coordinates.map((point) => point.x));
    const minY = Math.min(...coordinates.map((point) => point.y));
    const maxY = Math.max(...coordinates.map((point) => point.y));
    const range = Math.max(maxX - minX, maxY - minY, 1);
    const scale = (size - padding * 2) / range;
    const offsetX = (size - (maxX - minX) * scale) / 2;
    const offsetY = (size - (maxY - minY) * scale) / 2;
    const position = (point) => ({
      x: offsetX + (point.x - minX) * scale,
      y: size - offsetY - (point.y - minY) * scale,
    });

    context.lineWidth = 2;
    lines.forEach((line) => {
      if (!Array.isArray(line.points) || line.points.length < 2) return;
      const first = getPointByRef(line.points[0]);
      if (!first || !Number.isFinite(first.x) || !Number.isFinite(first.y))
        return;

      context.beginPath();
      const start = position(first);
      context.moveTo(start.x, start.y);
      line.points.slice(1).forEach((index) => {
        const point = getPointByRef(index);
        if (point && Number.isFinite(point.x) && Number.isFinite(point.y)) {
          const next = position(point);
          context.lineTo(next.x, next.y);
        }
      });
      context.strokeStyle = line.color || "#000000";
      context.stroke();
    });

    points.forEach((point) => {
      if (point.style == "mini") {
        context.fillRect(position(point).x, position(point).y, 1, 1);
        return;
      }
      if (point.style == "invis") {
        return;
      }

      if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) return;
      const next = position(point);
      if (typeof point.image?.src === "string" && point.image.src) {
        const image = new Image();
        image.onload = () => {
          const width =
            Number.isFinite(point.image.width) && point.image.width > 0
              ? point.image.width
              : image.naturalWidth;
          const height =
            Number.isFinite(point.image.height) && point.image.height > 0
              ? point.image.height
              : image.naturalHeight;
          context.drawImage(
            image,
            next.x - width / 2,
            next.y - height / 2,
            width,
            height,
          );
        };
        image.src = point.image.src;
        return;
      }

      context.beginPath();
      context.arc(next.x, next.y, 6, 0, Math.PI * 2);
      context.fillStyle = point.color || "#000000";
      context.fill();
      context.strokeStyle = "#000000";
      context.stroke();
    });
    areas.forEach((area) => {
      if (!Array.isArray(area.points) || area.points.length < 3) return;

      const start = getPointByRef(area.points[0]);
      if (!start || !Number.isFinite(start.x) || !Number.isFinite(start.y))
        return;

      context.beginPath();
      context.moveTo(position(start).x, position(start).y);
      area.points.slice(1).forEach((index) => {
        const point = getPointByRef(index);
        if (point && Number.isFinite(point.x) && Number.isFinite(point.y)) {
          const next = position(point);
          context.lineTo(next.x, next.y);
        }
      });
      context.closePath();
      context.fillStyle = area.color || "#000000";
      context.fill();
    });
  }

  el.replaceChildren(canvas);
  return canvas;
}
/**
 * 
 * @param {*} prop: 
 * @param {*} ref 
 * @param {*} change 
 * @param {*} cs 
 * @param {*} json 
 */
function animate(prop, ref, change, cs = "tp", json){

}
export {render , animate };
export default render;
