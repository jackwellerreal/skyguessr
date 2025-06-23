from PIL import Image
import os

# Path to your maps directory
maps_dir = "./public/content/maps"

# Output directory (can overwrite original if you want)
output_dir = maps_dir

# Ensure directory exists
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Go through all files
for filename in os.listdir(maps_dir):
    if not (filename.endswith(".png") or filename.endswith(".jpg")):
        continue

    filepath = os.path.join(maps_dir, filename)

    with Image.open(filepath) as img:
        width, height = img.size

        if width == height:
            print(f"{filename}: already square ({width}x{height})")
            continue

        # Determine the new size (max dimension)
        new_size = max(width, height)
        print(f"{filename}: padding to {new_size}x{new_size}")

        # Create a new transparent image
        new_img = Image.new("RGBA", (new_size, new_size), (0, 0, 0, 0))

        # Compute position to paste original image at center
        x_offset = (new_size - width) // 2
        y_offset = (new_size - height) // 2

        # Paste the original image onto the new canvas
        new_img.paste(img.convert("RGBA"), (x_offset, y_offset))

        # Save back (or to output_dir)
        save_path = os.path.join(output_dir, filename)
        new_img.save(save_path)

print("Done padding images.")
