class ImageConverterService {
    static getFloorMapImageSource(floorMap) {
        let imageBase64 = floorMap.image;
        let imgType = floorMap.image_type;

        switch (imgType) {
            case "png":
                return "data:image/png;base64," + imageBase64;
            case "jpg":
                return "data:image/jpeg;base64," + imageBase64;
            case "svg":
                return "data:image/svg+xml;base64," + imageBase64;
            default:
                throw new Error("Unsupported image type");
        }
    }

    static async getFloorMapImage(floorMap) {
        return new Promise((resolve, reject) => {
            let img = document.createElement("img");
            img.addEventListener("load", () => resolve(img));
            img.src = ImageConverterService.getFloorMapImageSource(floorMap);
        });
    }
}

export default ImageConverterService;