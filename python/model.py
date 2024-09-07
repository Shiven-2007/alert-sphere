


import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
import warnings

warnings.filterwarnings("ignore")

# Load the dataset
data = pd.read_csv('sam2.csv')

# Drop rows with missing target values
data = data.dropna(subset=['Disaster Type'])

# Drop classes with very few instances
class_counts = data['Disaster Type'].value_counts()
data = data[data['Disaster Type'].isin(class_counts[class_counts >= 5].index)]

# Define features and target
X = data.drop(columns=['Disaster Type'])
y = data['Disaster Type']

# Handle missing values in features
X = X.replace('', pd.NA).fillna('')  # Replace empty strings with NaN and then fill with empty string for text columns

# Check for NaN values
print("Checking for NaN values in features and target:")
print(X.isnull().sum())
print(y.isnull().sum())

# Split the data into training and testing sets with stratification
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

# Process text columns
tfidf_vectorizer = TfidfVectorizer(max_features=3000)
X_train_tfidf = tfidf_vectorizer.fit_transform(X_train['Event Name'].astype(str) + " " + X_train['Location'].astype(str))
X_test_tfidf = tfidf_vectorizer.transform(X_test['Event Name'].astype(str) + " " + X_test['Location'].astype(str))

# Convert TF-IDF output to DataFrame and ensure numeric columns are properly handled
X_train_tfidf_df = pd.DataFrame(X_train_tfidf.toarray(), index=X_train.index)
X_test_tfidf_df = pd.DataFrame(X_test_tfidf.toarray(), index=X_test.index)

# Drop text columns before combining
X_train_numeric = X_train.drop(columns=['Event Name', 'Location'])
X_test_numeric = X_test.drop(columns=['Event Name', 'Location'])

# Identify columns with non-numeric data
non_numeric_cols = X_train_numeric.select_dtypes(include=['object', 'category']).columns

# Convert all non-numeric columns to strings
X_train_numeric[non_numeric_cols] = X_train_numeric[non_numeric_cols].astype(str)
X_test_numeric[non_numeric_cols] = X_test_numeric[non_numeric_cols].astype(str)

# Apply OneHotEncoder to the non-numeric columns
onehot_encoder = ColumnTransformer(
    transformers=[
        ('cat', OneHotEncoder(handle_unknown='ignore'), non_numeric_cols)
    ],
    remainder='passthrough'
)

X_train_encoded = onehot_encoder.fit_transform(X_train_numeric)
X_test_encoded = onehot_encoder.transform(X_test_numeric)

# Combine TF-IDF features with the encoded numeric features
X_train_combined = pd.concat([X_train_tfidf_df, pd.DataFrame(X_train_encoded.toarray(), index=X_train.index)], axis=1)
X_test_combined = pd.concat([X_test_tfidf_df, pd.DataFrame(X_test_encoded.toarray(), index=X_test.index)], axis=1)

# Initialize and train the model
model = RandomForestClassifier(n_estimators=100, random_state=42)

print("Training RandomForest model...")
try:
    model.fit(X_train_combined, y_train)
    y_pred = model.predict(X_test_combined)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Accuracy with RandomForest: {accuracy * 100:.2f}%")
    print(f"Classification Report for RandomForest:\n{classification_report(y_test, y_pred)}\n")
except Exception as e:
    print(f"Error training RandomForest: {e}")


# In[2]:




