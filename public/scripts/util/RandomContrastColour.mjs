class RandomContrastColour {
    static getRandomContrastColor(foregroundColor) {
        // Generate random RGB values
        let r = Math.floor(Math.random() * 256);
        let g = Math.floor(Math.random() * 256);
        let b = Math.floor(Math.random() * 256);

        // Calculate the relative luminance of the random color
        let luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

        // Calculate the contrast ratio between the random color and the foreground color
        let fgR = parseInt(foregroundColor.substr(1, 2), 16);
        let fgG = parseInt(foregroundColor.substr(3, 2), 16);
        let fgB = parseInt(foregroundColor.substr(5, 2), 16);
        let fgLuminance = (0.2126 * fgR + 0.7152 * fgG + 0.0722 * fgB) / 255;
        let contrast = (Math.max(luminance, fgLuminance) + 0.05) / (Math.min(luminance, fgLuminance) + 0.05);

        // If the contrast ratio meets the WCAG AAA requirements (contrast >= 7), return the color
        if (contrast >= 7) {
            return '#' + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');
        }

        // If the contrast ratio does not meet the requirements, recursively call the function again to generate a new color
        return this.getRandomContrastColor(foregroundColor);
    }
}

export {RandomContrastColour};