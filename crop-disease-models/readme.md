## Crop Disease Detection Model for Smart Agriculture
Project Notebooks Overview
This project aims to develop an AI-based solution for detecting and classifying crop diseases affecting key Ghanaian crops (cashew, cassava, maize, and tomato) using images from smartphones or drones. The model is designed to be accurate, lightweight, and practical for deployment as a mobile app, enabling farmers to diagnose crop diseases in real-time under varying field conditions (e.g., different lighting, angles).
The solution leverages the CCMT Dataset, which contains 24,881 raw images and 102,976 augmented images across 22 disease classes for cashew (6,549 images), cassava (7,508 images), maize (5,389 images), and tomato (5,435 images). The dataset is validated by expert plant virologists, making it highly relevant for Ghana’s agricultural context.
Model Training Approach
We trained four separate Xception-based convolutional neural network (CNN) models, one for each crop (cashew, cassava, maize, and tomato), to classify diseases specific to each crop. The training process for each crop follows a similar methodology, with the primary difference being the crop-specific directories used for training and testing data. The provided Jupyter notebook (tomatoXception_model.ipynb) details the process for the tomato crop, and this README summarizes the approach, which was replicated for the other crops.
Dataset Preparation

# Dataset Acquisition:

The CCMT Dataset was downloaded from a provided URL using gdown and unzipped to extract the raw and augmented image folders.
The dataset structure includes separate directories for each crop (e.g., Tomato, Cashew, Cassava, Maize) under CCMT Dataset-Augmented, with train_set and test_set subdirectories for each crop.


# Directory Setup:

For each crop, the training directory (train_dir) and testing directory (test_dir) were set to the respective crop's train_set and test_set paths. For example, for tomato:train_dir = "/kaggle/working/bwh3zbpkpv/Dataset for Crop Pest and Disease Detection/CCMT Dataset-Augmented/Tomato/train_set"
test_dir = "/kaggle/working/bwh3zbpkpv/Dataset for Crop Pest and Disease Detection/CCMT Dataset-Augmented/Tomato/test_set"


The validation directory (validation_dir) was set to the same path as test_dir for simplicity, as the dataset did not provide a separate validation set.
The same directory structure was used for other crops, replacing Tomato with Cashew, Cassava, or Maize.


# Data Preprocessing:

A DataFrame was created to map image file paths to their respective class names (disease types) for the training set.
Class names were encoded into numerical Class_IDs using LabelEncoder for model compatibility.
The dataset was found to be imbalanced (e.g., tomato classes ranged from 2,000 to 9,373 images per class), but augmentation was not further applied since the dataset was already augmented.


# Data Generators:

TensorFlow’s ImageDataGenerator was used to load and preprocess images:
Training: Applied rescaling (1./255), width/height shift (0.2), zoom (0.2), and horizontal flipping to enhance robustness.
Testing/Validation: Only rescaling (1./255) was applied to preserve original image characteristics.


Images were resized to 299x299 pixels to match the Xception model’s input requirements.
Batch size was set to 32 for efficient training.



# Model Architecture

# Base Model: The Xception model (pre-trained on ImageNet) was used as the base, with the top layer removed to allow fine-tuning for crop disease classification.
Custom Layers:
A Flatten layer to convert feature maps into a 1D vector.
Two Dense layers with ReLU activation (512 and 128 units) for feature processing.
A Dropout layer (0.5) to prevent overfitting.
A final Dense layer with softmax activation, with the number of units equal to the number of disease classes for the specific crop (e.g., 5 for tomato).


# Optimizer and Loss:
Optimizer: Adam with a learning rate of 1e-4.
Loss: Categorical cross-entropy.
Metric: Accuracy.



# Training Process

# Epochs and Steps:
Training was set for 10 epochs, with steps per epoch calculated as ceil(training_samples / batch_size) (e.g., 679 steps for tomato’s 21,723 training images).
Validation steps were similarly calculated (e.g., 171 steps for tomato’s 5,445 validation images).


# Callbacks:
ModelCheckpoint: Saved the best model based on validation accuracy (xception_<crop>.keras).
EarlyStopping: Stopped training if validation accuracy did not improve after 10 epochs, restoring the best weights.


# Training:
The model was trained using the fit method with the training and validation generators.
For tomato, the model achieved a validation accuracy of 96.82% after 10 epochs, with a validation loss of 0.1080.



# Post-Training

Model Saving:
The final model was saved as Xcetpion_{cropname}.keras for each crop.
my_model.h5 will also be obtained when you run the notebooks
A zipped version (my_model.zip) was created for easy sharing.


Evaluation:
A function (predict_image_class) was implemented to predict the disease class for a single image, returning the predicted class and confidence score.
Class mappings were extracted from the validation generator to interpret predictions (e.g., tomato classes: healthy, leaf blight, leaf curl, septoria leaf spot, verticulium wilt).


Visualization and Reporting (commented out in the notebook):
Code was included to visualize sample predictions and generate a classification report using sklearn.metrics.classification_report for detailed performance metrics (precision, recall, F1-score).


Cleanup:
The large dataset zip file and extracted folders were removed to save space after training.



Adaptation for Other Crops

The same notebook (tomatoXception_model.ipynb) was reused for cashew, cassava, and maize by modifying the train_dir and test_dir paths to point to the respective crop directories (e.g., CCMT Dataset-Augmented/Cashew/train_set for cashew).
The number of output classes in the final Dense layer was adjusted based on the number of disease classes for each crop, as determined by the dataset’s directory structure.
All other parameters (e.g., batch size, learning rate, epochs, callbacks) remained consistent across crops to ensure uniformity in the training process.

How to Use

Environment Setup:

Install dependencies: tensorflow, pandas, numpy, matplotlib, seaborn, opencv-python, scikit-learn, gdown.
Ensure a GPU is available for faster training (e.g., on Kaggle or a local machine with CUDA support).


Running the Notebook:

Download the CCMT Dataset using the provided URL.
Update the train_dir and test_dir paths in the notebook to the desired crop’s directories.
Execute the notebook cells sequentially to download, preprocess, train, and save the model.
Use the predict_image_class function to classify new images.


Deploying as a Mobile App:

The saved .h5 model can be converted to TensorFlow Lite format for deployment on resource-constrained devices like smartphones.
Use tools like TensorFlow Lite Converter and integrate the model into a mobile app framework (e.g., Flutter, Android Studio).



Results

The tomato model achieved a validation accuracy of 96.82% after 10 epochs, indicating strong performance in classifying five tomato diseases.
The other three crops achieved similrar accuracies. Please refer to the respective notebooks for train and validation accuracies for each
Similar performance is expected for cashew, cassava, and maize models, with variations depending on the number of classes and dataset size for each crop.

Future Improvements

Data Augmentation: Explore additional augmentation techniques if further robustness is needed.

Model Optimization: Apply quantization and pruning to reduce model size for mobile deployment.

Cross-Crop Model: Investigate a single model for all crops using multi-task learning.

Train on more epochs to achieve even better accuracies and stop when it plateau.

Explore OUT OF DISTRIBUTION IMAGE CLASSIFICATION FOR AN EVEN BETTER ERROR HANDLING.

Apply MLops in the entire implementation.

Notes

The dataset is large (8.44 GB), so ensure sufficient storage and memory during training.
The notebook includes commented-out code for visualization and classification reports, which can be uncommented for detailed analysis.
The model is tailored to Ghana’s agricultural context but can be adapted for other regions with similar crops.

For further details, refer to the Jupyter notebook (tomatoXception_model.ipynb) or the other notebooks or contact the project team to through the contributors to this repo.
