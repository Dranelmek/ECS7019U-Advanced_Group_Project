import torch
import torchvision.models as models
import torchvision.transforms as transforms
from torch.utils.data import DataLoader
from PIL import Image
from torch.utils.data import DataLoader, TensorDataset

#PARAMS
pretrained_weights_path = 'fine_tuned_resnet_50' #path to model
img_path = 'dashcam-footage.jpg' #path to image

#GPU

if torch.cuda.is_available():
    device = torch.device("cuda")
    print('Using GPU:', torch.cuda.get_device_name())
else:
    device = torch.device("cpu")
    print('Using CPU')

#MODEL INIT

resnet = models.resnet50()
num_ftrs = resnet.fc.in_features
resnet.fc = torch.nn.Linear(num_ftrs,2)
resnet.load_state_dict(torch.load(pretrained_weights_path))
resnet.eval()

#IMAGE PREPROCESS

preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])
img = Image.open(img_path)
input_tensor = preprocess(img)
input_batch = input_tensor.unsqueeze(0)
print("Input tensor shape:", input_batch.shape)


#RUNNING 

with torch.no_grad():
    output = resnet(input_batch)
    predicted_index = torch.argmax(output, dim=1)

print(predicted_index.item())