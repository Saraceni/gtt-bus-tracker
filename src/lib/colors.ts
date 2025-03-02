// export const lineColors = [
//     "#845ec2",
//     "#d65db1",
//     "#ff6f91",
//     "#ff9671",
//     "#ffc75f",
//     "#f9f871",
//     "#2c73d2",
//     "#0081cf",
//     "#0089ba",
//     "#008e9b",
//     "#008f7a",
//     "#b39cd0",
//     "#fbeaff",
//     "#00c9a7"
// ]

const hslToHex = (h: number, s: number, l: number) => {
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s;
    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
    let m = l - c / 2;
    
    let r = 0, g = 0, b = 0;

    if (h < 60) { r = c; g = x; }
    else if (h < 120) { r = x; g = c; }
    else if (h < 180) { g = c; b = x; }
    else if (h < 240) { g = x; b = c; }
    else if (h < 300) { r = x; b = c; }
    else { r = c; g = x; }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function generateGradientColorsHex(n = 120, saturation = 90, lightness = 55) {
    let colors = [];
    
    for (let i = 0; i < n; i++) {
        const rainbowStops = [0, 30, 60, 120, 240, 275, 300]; // Matizes do arco-íris
        let hue = (i / (n - 1)) * (rainbowStops[rainbowStops.length - 1]); // Interpolação entre os matizes
        let hexColor = hslToHex(hue, saturation, lightness);
        colors.push(hexColor);
    }
    
    return colors;
}

// Gerando as 120 cores únicas em HEX
export const lineColors = generateGradientColorsHex();
