import cv2

def is_dark(image_path):
    # Read the image
    image = cv2.imread(image_path)

    # Convert image to grayscale
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Calculate average pixel intensity
    average_intensity = cv2.mean(gray_image)

    # Define a threshold to distinguish between day and night images
    threshold = 60

    if average_intensity<threshold:
        return True
    else:
        return False





